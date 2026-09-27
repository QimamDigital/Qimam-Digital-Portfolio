import { useLocation } from 'react-router-dom'
import { whatsappUrl } from '../utils/contact'

export default function FloatingWhatsApp({lang='en'}) {
 const { pathname } = useLocation()
 if (pathname.startsWith('/contact') || pathname.startsWith('/products')) return null
 return <a className="floating-wa" href={whatsappUrl()} target="_blank" rel="noopener noreferrer" aria-label={lang==='ar'?'تواصل مع داودكو عبر واتساب':'Contact DAOUDCO on WhatsApp'}><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M20 11.5a8.5 8.5 0 0 1-12.7 7.4L3 20l1.1-4.3A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 7.5c0 4.5 3 7.5 7.5 7.5l1-2-3-1-1 1c-1.5-.7-2.3-1.5-3-3l1-1-1-2Z"/></svg><span>{lang==='ar'?'واتساب':'WhatsApp'}</span></a>
}
