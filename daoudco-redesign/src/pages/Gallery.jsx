import { useEffect, useRef, useState } from 'react'
import SEO from '../components/SEO'
const items=[
 ['Factory','production-facility.jpg','Production facility','منشأة الإنتاج'],
 ['Factory','coextrusion-line.jpg','5-layer co-extrusion production line','خط إنتاج بالبثق المشترك من خمس طبقات'],
 ['Production','coextruded-film.png','5-layer co-extruded film, 14 m','أفلام مبثوقة بالتشارك من خمس طبقات بعرض 14 م'],
 ['Production','jumbo-rolls.jpg','Jumbo rolls up to 3000 kg','لفائف كبيرة حتى 3000 كغ'],
 ['Production','pondliner-gallery.jpg','Black film winding','لف الأفلام السوداء'],
 ['Production','shrink-film.jpg','Pallet shrink film production','إنتاج أفلام الانكماش لتغليف الطبليات'],
 ['Production','blown-film.jpg','Blown film production','إنتاج الأفلام بالنفخ'],
 ['Agriculture','low-tunnel.jpg','Walk-in greenhouse interior','داخل بيت زراعي مرتفع'],
 ['History','drip-production.jpg','Historical extrusion equipment','معدات بثق تاريخية'],
 ['History','water-flow-testing.jpg','Historical water-flow testing','اختبار تدفق المياه تاريخياً'],
 ['Production','transport-pallets.jpg','Truck loaded with pallets for transport','شاحنة محملة بالطبليات للنقل'],
 ['Agriculture','greenhouse-aerial.jpg','Aerial view of greenhouses','منظر جوي للبيوت الزراعية'],
 ['Agriculture','greenhouse.jpg','Walk-in greenhouses','بيوت زراعية مرتفعة'],
 ['Agriculture','greenhouse-interior.jpg','Greenhouse interior','داخل بيت زراعي'],
 ['Factory','tensile-testing.jpg','Tensile testing','اختبار الشد']
]
const categoryArabic={All:'الكل',Factory:'المصنع',Production:'الإنتاج',Agriculture:'الزراعة',History:'الأرشيف'}
export default function Gallery({lang='en'}) {
 const ar=lang==='ar'; const cats=['All',...new Set(items.map(i=>i[0]))]; const [cat,setCat]=useState('All'); const [open,setOpen]=useState(null); const modal=useRef(null); const trigger=useRef(null)
 const shown=cat==='All'?items:items.filter(i=>i[0]===cat)
 useEffect(()=>{if(open) modal.current?.showModal()},[open])
 function close(){modal.current?.close();setOpen(null);trigger.current?.focus()}
 return <main className="page wrap"><SEO title={ar?'المعرض | داودكو':'Gallery | DAOUDCO Factory, Production, and Agriculture'} description={ar?'صور منشآت داودكو وإنتاج الأفلام والتطبيقات الزراعية ومعدات تاريخية من الأرشيف.':'Explore DAOUDCO facilities, film production, agricultural applications, and historical equipment.'}/><span className="eyebrow">{ar?'المعرض':'Gallery'}</span><h1>{ar?'المصنع والإنتاج والتطبيقات الزراعية':'Factory, production, and agricultural applications'}</h1><div className="product-pills small-pills" role="group" aria-label={ar?'تصفية الصور':'Filter photographs'}>{cats.map(c=><button className={cat===c?'active':''} aria-pressed={cat===c} key={c} onClick={()=>setCat(c)}>{ar?categoryArabic[c]:c}</button>)}</div><div className="masonry">{shown.map(i=><button key={i[1]} onClick={e=>{trigger.current=e.currentTarget;setOpen(i)}} aria-label={`${ar?'تكبير الصورة':'Enlarge image'}: ${i[ar?3:2]}`}><img src={`/images/daoudco/${i[1]}`} alt={i[ar?3:2]} loading="lazy"/><span>{i[ar?3:2]}</span></button>)}</div>{open&&<dialog ref={modal} className="lightbox" aria-modal="true" aria-labelledby="gallery-caption" onCancel={e=>{e.preventDefault();close()}} onClick={e=>{if(e.target===e.currentTarget)close()}}><button autoFocus onClick={close}>{ar?'إغلاق':'Close'}</button><img src={`/images/daoudco/${open[1]}`} alt={open[ar?3:2]}/><p id="gallery-caption">{open[ar?3:2]}</p></dialog>}</main>
}
