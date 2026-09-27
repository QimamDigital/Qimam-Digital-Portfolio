// Shared public validation only: this module contains no server configuration or secrets.
export const inquiryProducts = [
  { slug: 'greenhouse-film', en: 'Greenhouse Film', ar: 'أفلام البيوت الزراعية' },
  { slug: 'low-tunnel-film', en: 'Low Tunnel Film', ar: 'أفلام الأنفاق المنخفضة' },
  { slug: 'mulching-film', en: 'Mulching Film', ar: 'أفلام تغطية التربة' },
  { slug: 'solarization-fumigation-film', en: 'Solarization & Fumigation Film', ar: 'أفلام التعقيم الشمسي والتبخير' },
  { slug: 'silage-film', en: 'Silage Film', ar: 'أفلام السيلاج' },
  { slug: 'pondliner-film', en: 'Pondliner Film', ar: 'أفلام تبطين البرك' },
  { slug: 'hydroponic-film', en: 'Hydroponic Film', ar: 'أفلام الزراعة المائية' },
]
export const limits = { name: 100, phone: 40, business: 160, email: 254, country: 100, city: 100, product: 80, quantity: 500, message: 4000, website: 200, lang: 2 }
export const selectedProduct = value => inquiryProducts.some(p => p.slug === value) ? value : ''
const digits = value => value.replace(/[٠-٩۰-۹]/g, c => String(c.charCodeAt(0) - (c <= '٩' ? 1632 : 1776)))
export function validateInquiry(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, field: 'form' }
  const data = {}
  for (const [key, max] of Object.entries(limits)) {
    const value = input[key] ?? ''
    if (typeof value !== 'string' || value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) || (key !== 'message' && /[\r\n]/.test(value))) return { ok: false, field: key }
    data[key] = value.trim()
  }
  if (data.name.length < 2) return { ok: false, field: 'name' }
  data.phone = digits(data.phone)
  if (!/^\+?[\d\s().-]+$/.test(data.phone) || !/^\d{7,15}$/.test(data.phone.replace(/\D/g, ''))) return { ok: false, field: 'phone' }
  if (data.email && !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) return { ok: false, field: 'email' }
  if (data.product && !selectedProduct(data.product)) return { ok: false, field: 'product' }
  if (data.website) return { ok: false, field: 'website' }
  if (data.lang && !['en', 'ar'].includes(data.lang)) return { ok: false, field: 'lang' }
  data.lang ||= 'en'
  return { ok: true, data }
}
