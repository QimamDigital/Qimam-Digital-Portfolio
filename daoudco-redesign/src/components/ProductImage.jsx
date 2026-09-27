import { useState } from 'react'
import ImagePlaceholder from './ImagePlaceholder'
import { localizeProduct } from '../data/productArabic'
export default function ProductImage({product,lang='en',className=''}) {
 const [failed,setFailed]=useState(null)
 const p=localizeProduct(product,lang)
 if(!p?.image || failed===p.image) return <ImagePlaceholder lang={lang} label={p?.name} className={className}/>
 return <img className={`product-media ${className}`} src={p.image} alt={p.imageAlt||p.name} loading="lazy" onError={()=>setFailed(p.image)}/>
}
