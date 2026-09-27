export default function ImagePlaceholder({lang='en',label='',className=''}) {
 return <div className={`image-placeholder product-media ${className}`} role="img" aria-label={`${label} — ${lang==='ar'?'الصورة غير متاحة حالياً':'Image not currently available'}`}><span aria-hidden="true">{label}</span><p aria-hidden="true">{lang==='ar'?'الصورة غير متاحة حالياً':'Image not currently available'}</p></div>
}
