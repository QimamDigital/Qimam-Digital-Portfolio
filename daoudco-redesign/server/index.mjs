import { createInquiryServer } from './inquiry.mjs'
const production = process.env.NODE_ENV === 'production'
const allowedOrigins = (process.env.INQUIRY_ALLOWED_ORIGINS || (production ? '' : 'http://127.0.0.1:5178,http://localhost:5178,http://127.0.0.1:5173,http://localhost:5173')).split(',').map(s => s.trim()).filter(Boolean)
for (const origin of allowedOrigins) {
  const url = new URL(origin)
  if (url.origin !== origin || !['http:', 'https:'].includes(url.protocol) || (production && url.protocol !== 'https:')) throw new Error('INQUIRY_ALLOWED_ORIGINS must contain exact origins; production requires HTTPS')
}
if (production && !allowedOrigins.length) throw new Error('Set INQUIRY_ALLOWED_ORIGINS before starting the production API')
const server = createInquiryServer({ apiKey: process.env.RESEND_API_KEY, from: process.env.INQUIRY_FROM, to: process.env.INQUIRY_TO || 'info@daoudco.jo', allowedOrigins })
const port = Number(process.env.INQUIRY_PORT || 3001)
const host = process.env.INQUIRY_HOST || '127.0.0.1'
server.listen(port, host, () => {
  console.log(`Inquiry API listening on http://${host}:${port}`)
  if (!process.env.RESEND_API_KEY || !process.env.INQUIRY_FROM) console.warn('Email credentials missing: submissions return 503; no email is sent.')
})
