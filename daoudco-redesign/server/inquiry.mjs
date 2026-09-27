import { createServer } from 'node:http'
import { createHash } from 'node:crypto'
import { validateInquiry, inquiryProducts } from './inquiry-schema.mjs'

export function createInquiryServer({ apiKey = '', from = '', to = 'info@daoudco.jo', allowedOrigins = [], fetchImpl = fetch, rateLimit = 5, windowMs = 600000 } = {}) {
  const attempts = new Map()
  const pending = new Set()
  const origins = new Set(allowedOrigins)
  const reply = (res, status, error) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' })
    res.end(JSON.stringify(error ? { ok: false, error } : { ok: true }))
  }
  const server = createServer(async (req, res) => {
    if (req.url !== '/api/inquiry') return reply(res, 404, 'not_found')
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return reply(res, 405, 'method') }
    if (!origins.has(req.headers.origin)) return reply(res, 403, 'origin')
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) return reply(res, 415, 'content_type')
    // Deliberately ignore X-Forwarded-For: a public client must not bypass throttling.
    const ip = req.socket.remoteAddress
    const now = Date.now()
    for (const [key, entry] of attempts) if (entry.until <= now) attempts.delete(key)
    const entry = attempts.get(ip) || { count: 0, until: now + windowMs }
    if (entry.count >= rateLimit || (!attempts.has(ip) && attempts.size >= 10000)) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((entry.until - now) / 1000))))
      return reply(res, 429, 'rate_limit')
    }
    entry.count++
    attempts.set(ip, entry)
    try {
      if (Number(req.headers['content-length']) > 16384) { req.resume(); return reply(res, 413, 'too_large') }
      const chunks = []
      let size = 0
      for await (const chunk of req) {
        size += chunk.length
        if (size > 16384) { reply(res, 413, 'too_large'); return }
        chunks.push(chunk)
      }
      let input
      try { input = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return reply(res, 400, 'invalid') }
      const result = validateInquiry(input)
      if (!result.ok) return reply(res, 400, 'invalid')
      if (!apiKey || !from || !to || /[\r\n]/.test(from + to)) return reply(res, 503, 'unavailable')
      const data = result.data
      const fingerprint = createHash('sha256').update(JSON.stringify(data)).digest('hex')
      if (pending.has(fingerprint)) return reply(res, 409, 'in_progress')
      pending.add(fingerprint)
      try {
        const product = inquiryProducts.find(p => p.slug === data.product)
        const text = [
          'DAOUDCO website inquiry / استفسار من الموقع',
          `Name / الاسم: ${data.name}`, `Phone / الهاتف: ${data.phone}`,
          `Business / الشركة أو المزرعة: ${data.business}`, `Email / البريد الإلكتروني: ${data.email}`,
          `Country / الدولة: ${data.country}`, `City / المدينة: ${data.city}`,
          `Product / المنتج: ${product ? `${product.en} / ${product.ar}` : 'Not specified / غير محدد'}`,
          `Quantity / الكمية والمتطلبات: ${data.quantity}`, `Language / اللغة: ${data.lang}`,
          `Message / الرسالة:\n${data.message}`,
        ].join('\n')
        const provider = await fetchImpl('https://api.resend.com/emails', {
          method: 'POST', signal: AbortSignal.timeout(10000),
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to: [to], subject: 'DAOUDCO — Website product inquiry', text, ...(data.email ? { reply_to: data.email } : {}) }),
        })
        if (!provider.ok) return reply(res, 502, 'delivery_failed')
        const confirmation = await provider.json()
        if (!confirmation?.id) return reply(res, 502, 'delivery_failed')
        return reply(res, 200)
      } catch { return reply(res, 502, 'delivery_failed') }
      finally { pending.delete(fingerprint) }
    } catch { if (!res.headersSent) reply(res, 400, 'invalid') }
  })
  server.requestTimeout = 15000
  server.headersTimeout = 10000
  server.maxHeadersCount = 40
  return server
}
