import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products'
import { localizeProduct } from '../data/productArabic'
import ProductImage from './ProductImage'
import { ui } from '../content'
import { whatsappUrl } from '../utils/contact'
export default function ProductSelector({lang='en'}) {
 const [index,setIndex]=useState(0); const refs=useRef([]); const id=useId(); const t=ui[lang]; const ar=lang==='ar'; const active=localizeProduct(products[index],lang)
 function onKeyDown(event,i) {
  let next=i
  if(event.key==='Home') next=0
  else if(event.key==='End') next=products.length-1
  else if(event.key==='ArrowRight') next=(i+(ar?-1:1)+products.length)%products.length
  else if(event.key==='ArrowLeft') next=(i+(ar?1:-1)+products.length)%products.length
  else return
  event.preventDefault(); setIndex(next); refs.current[next]?.focus()
 }
 return <section className="product-experience"><div className="product-pills" role="tablist" aria-label={ar?'فئات المنتجات':'Product categories'}>{products.map((p,i)=><button key={p.slug} ref={el=>refs.current[i]=el} id={`${id}-tab-${i}`} role="tab" aria-controls={`${id}-panel`} aria-selected={index===i} tabIndex={index===i?0:-1} className={index===i?'active':''} onKeyDown={e=>onKeyDown(e,i)} onClick={()=>setIndex(i)}>{ar?p.arName:p.name}</button>)}</div>
 <div className="product-panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${index}`} tabIndex={0}><div className="product-panel-copy"><span className="eyebrow">{ar?'منتجات داودكو':'DAOUDCO Products'}</span><h2>{active.name}</h2><p>{active.shortDescription}</p><h3>{ar?'التطبيقات الرئيسية':'Main applications'}</h3><div className="chips">{active.applications.map(a=><span key={a}>{a}</span>)}</div><h3>{ar?'الخصائص الرئيسية':'Key characteristics'}</h3><ul>{active.features.map(f=><li key={f}>{f}</li>)}</ul><h3>{ar?'المواصفات الفنية':'Technical specifications'}</h3><table><tbody>{active.specifications.map(([k,v])=><tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}</tbody></table><div className="actions"><Link className="btn" to={`/products/${active.slug}`}>{t.view}</Link><Link className="btn ghost" to={`/contact?product=${active.slug}`}>{t.quote}</Link><a className="btn light" href={whatsappUrl(ar?`مرحباً داودكو، أود الحصول على معلومات عن ${active.name}.`:`Hello Daoudco, I would like more information about ${active.name}.`)} target="_blank" rel="noopener noreferrer">{t.ask}</a></div></div><ProductImage product={active} lang={lang}/></div></section>
}
