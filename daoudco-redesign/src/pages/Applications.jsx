import SEO from '../components/SEO'
import ProductImage from '../components/ProductImage'
import { products } from '../data/products'
import { Link } from 'react-router-dom'
const applications=[
 ['greenhouse','Greenhouses','البيوت الزراعية','Covering systems for crop protection and a controlled growing environment.','أغطية لحماية المحاصيل وتوفير بيئة نمو ملائمة.'],
 ['low-tunnel','Low tunnels','الأنفاق المنخفضة','Seasonal protection for smaller crops and earlier planting and harvesting.','حماية موسمية للمحاصيل الصغيرة والتبكير بالزراعة والحصاد.'],
 ['mulching','Soil mulching','تغطية التربة','Cover crop rows to retain moisture, limit weeds, and keep fruit off the soil.','تغطية صفوف المحاصيل للاحتفاظ بالرطوبة والحد من الأعشاب وفصل الثمار عن التربة.'],
 ['solarization','Soil solarization','التعقيم الشمسي للتربة','Clear or thermal film to help increase soil temperature between growing seasons.','أفلام شفافة أو حرارية للمساعدة على رفع حرارة التربة بين مواسم الزراعة.'],
 ['fumigation','Soil fumigation','تبخير التربة','Virtually impermeable film for chemical fumigation applications between seasons.','أفلام شبه غير منفذة لتطبيقات التبخير الكيميائي بين المواسم.'],
 ['silage','Silage and forage storage','تخزين السيلاج والأعلاف','Opaque covers and bale stretch wrap to help protect stored forage from light, water, and air.','أغطية معتمة وأفلام تمدد للبالات لحماية الأعلاف المخزنة من الضوء والماء والهواء.'],
 ['pondliner','Water reservoirs','خزانات المياه','Thick black polyethylene lining with overlapping, thermo-welded sections for agricultural reservoirs.','بطانات بولي إيثيلين سوداء سميكة بمقاطع متراكبة وملحومة حرارياً للخزانات الزراعية.'],
 ['hydroponic','Hydroponic growing','الزراعة المائية','Thick sheets for channels carrying nutrient-rich water past plant roots.','صفائح سميكة لقنوات تنقل المياه الغنية بالعناصر الغذائية بجوار جذور النباتات.']
]
export default function Applications({lang='en'}) {
 const ar=lang==='ar'
 return <main className="page wrap"><SEO title={ar?'التطبيقات الزراعية | داودكو':'Agricultural Applications | DAOUDCO'} description={ar?'حلول أفلام للبيوت الزراعية والأنفاق وتغطية التربة والتعقيم الشمسي والتبخير والسيلاج والخزانات والزراعة المائية.':'Films for greenhouses, low tunnels, mulching, solarization, fumigation, silage, reservoirs, and hydroponics.'}/><span className="eyebrow">{ar?'التطبيقات':'Applications'}</span><h1>{ar?'حلول للاستخدامات الزراعية العملية':'Built for practical agricultural uses'}</h1><div className="cards four">{applications.map(([id,en,arabic,description,arDescription])=>{const p=products.find(p=>p.id===(id==='fumigation'?'solarization':id));return <Link className="product-card" to={`/products/${p.slug}`} key={id}><ProductImage product={id==='fumigation'?{...p,id:'fumigation',name:ar?arabic:en,image:null}:p} lang={lang}/><h2>{ar?arabic:en}</h2><p>{ar?arDescription:description}</p></Link>})}</div><section className="finder"><h2>{ar?'اعثر على الفيلم المناسب':'Find the Right Film'}</h2><p>{ar?'اختر تطبيقك لاستكشاف خيارات الأفلام، أو تواصل مع فريقنا لمناقشة ظروف الزراعة والمقاسات المطلوبة.':'Choose an application to explore film options, or contact our team to discuss your growing conditions and required dimensions.'}</p><div className="chips">{applications.map(([id,en,arabic])=><Link key={id} to={`/products/${products.find(p=>p.id===(id==='fumigation'?'solarization':id)).slug}`}>{ar?arabic:en}</Link>)}</div><Link className="btn" to="/contact">{ar?'ناقش تطبيقك معنا':'Discuss your application'}</Link></section></main>
}
