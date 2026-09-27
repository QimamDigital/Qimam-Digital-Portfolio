import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { inquiryProducts, limits, selectedProduct, validateInquiry, sendInquiry, whatsappUrl } from '../utils/contact'
import { company } from '../data/company'

const copy = {
 en: {
  name:'Name', phone:'Phone / WhatsApp', business:'Business / farm name', email:'Email', country:'Country', city:'City', product:'Product interested in', quantity:'Quantity / requirements', message:'What do you need?', select:'Select a product (optional)', optional:'optional', send:'Send product inquiry', sending:'Sending…',
  help:'Your inquiry is sent directly to DAOUDCO. Only your name and phone number are required.', privacy:'We use these details to respond to your inquiry. Please do not include sensitive information.', alternatives:'Prefer to speak with us?', whatsapp:'WhatsApp',
  success:'Your inquiry has been sent to DAOUDCO. Thank you — our team will follow up using the contact details you provided.',
  invalid:'Please check your details. Enter your name (at least 2 characters), a valid phone number (7–15 digits), and a valid email if provided.',
  unavailable:'Online inquiry is currently unavailable. Please contact us by phone, WhatsApp or email below. Your details have been kept so you can try again.',
  failed:'We could not confirm that your inquiry was sent. Please try again or contact us below. Your details have been kept.',
  rate:'Too many attempts. Please wait 10 minutes before trying again, or contact us below.', pending:'An identical inquiry is already being sent. Please wait before trying again.',
 },
 ar: {
  name:'الاسم', phone:'الهاتف / واتساب', business:'اسم الشركة / المزرعة', email:'البريد الإلكتروني', country:'الدولة', city:'المدينة', product:'المنتج المطلوب', quantity:'الكمية / المتطلبات', message:'كيف يمكننا مساعدتك؟', select:'اختر منتجاً (اختياري)', optional:'اختياري', send:'إرسال الاستفسار', sending:'جارٍ الإرسال…',
  help:'يُرسل استفسارك مباشرة إلى داودكو. الاسم ورقم الهاتف فقط مطلوبان.', privacy:'نستخدم هذه البيانات للرد على استفسارك. يُرجى عدم تضمين معلومات حساسة.', alternatives:'تفضّل التواصل معنا مباشرة؟', whatsapp:'واتساب',
  success:'تم إرسال استفسارك إلى داودكو. شكراً لك — سيتواصل فريقنا معك باستخدام بيانات الاتصال التي قدمتها.',
  invalid:'يُرجى التحقق من بياناتك. أدخل اسماً من حرفين على الأقل، ورقم هاتف صالحاً (٧–١٥ رقماً)، وبريداً إلكترونياً صالحاً إذا أضفته.',
  unavailable:'إرسال الاستفسارات غير متاح حالياً. يُرجى التواصل معنا عبر الهاتف أو واتساب أو البريد الإلكتروني أدناه. احتفظنا ببياناتك لتتمكن من المحاولة مجدداً.',
  failed:'لم نتمكن من تأكيد إرسال استفسارك. حاول مجدداً أو تواصل معنا أدناه. احتفظنا ببياناتك.',
  rate:'محاولات كثيرة. يُرجى الانتظار ١٠ دقائق قبل المحاولة مجدداً، أو التواصل معنا أدناه.', pending:'يجري إرسال استفسار مطابق بالفعل. يُرجى الانتظار قبل المحاولة مجدداً.',
 },
}

export default function ContactForm({ lang = 'en' }) {
 const language = lang === 'ar' ? 'ar' : 'en'
 const t = copy[language]
 const { search } = useLocation()
 const [data, setData] = useState(() => ({ product:selectedProduct(new URLSearchParams(search).get('product')) }))
 const [status, setStatus] = useState('')
 const [invalidField, setInvalidField] = useState('')
 const [busy, setBusy] = useState(false)
 const inFlight = useRef(false)
 useEffect(() => { setData(old => ({...old, product:selectedProduct(new URLSearchParams(search).get('product'))})) }, [search])
 const set = (key, value) => { setData(old => ({ ...old, [key]: value })); setStatus(''); setInvalidField('') }
 const submit = async event => {
  event.preventDefault()
  if (inFlight.current) return
  const checked = validateInquiry({ ...data, lang: language })
  if (!checked.ok) {
   setStatus('invalid'); setInvalidField(checked.field)
   event.currentTarget.elements.namedItem(checked.field)?.focus()
   return
  }
  inFlight.current = true; setBusy(true); setStatus(''); setInvalidField('')
  try { await sendInquiry(checked.data); setStatus('success') }
  catch (error) { setStatus(({unavailable:'unavailable',origin:'unavailable',rate_limit:'rate',in_progress:'pending',invalid:'invalid'})[error.message] || 'failed') }
  finally { inFlight.current = false; setBusy(false) }
 }
 const input = (key, type = 'text') => <label key={key} htmlFor={`inquiry-${key}`}>{t[key]} {['name','phone'].includes(key) ? '*' : `(${t.optional})`}
  <input id={`inquiry-${key}`} name={key} type={type} required={['name','phone'].includes(key)} maxLength={limits[key]} value={data[key] || ''} onChange={e => set(key,e.target.value)} disabled={busy} autoComplete={({name:'name',phone:'tel',business:'organization',email:'email',country:'country-name',city:'address-level2'})[key]} inputMode={key==='phone'?'tel':undefined} dir={['phone','email'].includes(key)?'ltr':undefined} aria-invalid={invalidField===key || undefined} aria-describedby={invalidField===key?'inquiry-status':undefined}/>
 </label>
 return <form className="quote-form" onSubmit={submit} noValidate aria-busy={busy} dir={language==='ar'?'rtl':'ltr'}>
  <p className="help wide">{t.help}</p>
  {input('name')}{input('phone','tel')}{input('business')}{input('email','email')}{input('country')}{input('city')}
  <label htmlFor="inquiry-product">{t.product} ({t.optional})<select id="inquiry-product" name="product" value={data.product || ''} onChange={e => set('product',e.target.value)} disabled={busy}><option value="">{t.select}</option>{inquiryProducts.map(product => <option key={product.slug} value={product.slug}>{product[language]}</option>)}</select></label>
  {input('quantity')}
  <label className="wide" htmlFor="inquiry-message">{t.message} ({t.optional})<textarea id="inquiry-message" name="message" rows="5" maxLength={limits.message} value={data.message || ''} onChange={e=>set('message',e.target.value)} disabled={busy}/></label>
  <div hidden aria-hidden="true"><label>Website<input name="website" value={data.website || ''} onChange={e=>set('website',e.target.value)} tabIndex={-1} autoComplete="off" maxLength={limits.website}/></label></div>
  <p className="help wide">{t.privacy}</p>
  {status && <p id="inquiry-status" className={`${status==='success'?'form-success':'form-error'} wide`} role={status==='success'?'status':'alert'}>{t[status]}</p>}
  <button className="btn wide" type="submit" disabled={busy}>{busy?t.sending:t.send}</button>
  <p className="help wide">{t.alternatives} <a href={whatsappUrl(language==='ar'?'مرحباً داودكو، أود الاستفسار عن منتجاتكم الزراعية.':undefined)} target="_blank" rel="noopener noreferrer">{t.whatsapp}</a> · <a href={`tel:${company.phoneTel}`} dir="ltr">{company.phoneDisplay}</a> · <a href={`mailto:${company.email}`}>{company.email}</a></p>
 </form>
}
