
import { company } from '../data/company'
export { inquiryProducts, limits, selectedProduct, validateInquiry } from '../../server/inquiry-schema.mjs'

export async function sendInquiry(data) {
 const response = await fetch('/api/inquiry', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data), signal: AbortSignal.timeout(15000),
 })
 let result
 try { result = await response.json() } catch { throw new Error('unavailable') }
 if (!response.ok || result?.ok !== true) throw new Error(result?.error || 'delivery_failed')
 return result
}
export const whatsappUrl = (message) => `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message || 'Hello Daoudco, I would like to ask about your agricultural polyethylene film products.')}`
export const phoneUrl = () => `tel:${company.phoneTel}`
export function buildMailto(data){
 const customer = data.business || data.name || 'Customer'
 const subject = `DAOUDCO Product Inquiry – ${customer}`
 const body = `Name: ${data.name || ''}\nPhone / WhatsApp: ${data.phone || ''}\nBusiness / Farm: ${data.business || ''}\nEmail: ${data.email || ''}\nCountry: ${data.country || ''}\nCity: ${data.city || ''}\nProduct: ${data.product || ''}\nQuantity / Requirements: ${data.quantity || ''}\n\nMessage:\n${data.message || ''}`
 return `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
export const trackEvent = (name, data={}) => { window.dispatchEvent(new CustomEvent('daoudco:event',{detail:{name, data}})) }
