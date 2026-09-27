import SEO from '../components/SEO'
import ContactForm from '../components/ContactForm'
import { company } from '../data/company'
import { whatsappUrl } from '../utils/contact'

export default function Contact({ lang = 'en' }) {
 const ar = lang === 'ar'
 return <main className="page wrap" dir={ar?'rtl':'ltr'}>
  <SEO title={ar?'تواصل مع داودكو | اطلب عرض سعر':'Contact DAOUDCO | Request a Product Quote'} description={ar?'تواصل مع داودكو للاستفسار عن أفلام البولي إيثيلين الزراعية. أرسل استفسارك مباشرة أو تواصل معنا عبر الهاتف وواتساب والبريد الإلكتروني.':'Contact DAOUDCO for agricultural polyethylene film inquiries. Send a direct inquiry or contact us by email, phone or WhatsApp.'}/>
  <span className="eyebrow">{ar?'تواصل معنا / اطلب عرض سعر':'Contact / Request a Quote'}</span>
  <h1>{ar?'أرسل استفسارك عن المنتجات':'Send a product inquiry'}</h1>
  <div className="contact-grid">
   <ContactForm lang={lang}/>
   <aside className="contact-card">
    <h2>{ar?'تواصل مباشر':'Direct contact'}</h2>
    <a href={`mailto:${company.email}`}>{company.email}</a>
    <a href={`tel:${company.phoneTel}`} dir="ltr">{company.phoneDisplay}</a>
    <a href={whatsappUrl(ar?'مرحباً داودكو، أود الاستفسار عن منتجاتكم الزراعية.':undefined)} target="_blank" rel="noopener noreferrer">{ar?'واتساب':'WhatsApp'}</a>
    <p>{ar?'ص.ب. ٥٠١٠، عمّان ١١١٨٣، الأردن':company.poBox}</p>
    <p>{ar?'السبت – الخميس، ٨:٠٠ صباحاً – ٤:٠٠ مساءً':company.hours}</p>
    <p>{ar?'فاكس:':'Fax:'} <bdi>{company.fax}</bdi></p>
    <a href={company.mapUrl} target="_blank" rel="noopener noreferrer">{ar?'افتح الخريطة':'Open map'}</a>
   </aside>
  </div>
 </main>
}
