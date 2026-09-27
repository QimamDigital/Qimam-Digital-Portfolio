export const company = {
  brand: 'DAOUDCO',
  name: 'Agricultural Polyethylene Film Manf. Co.',
  arabicName: 'شركة مصانع الأغطية الزراعية م.م',
  founded: '1977', location: 'Jordan', email: 'info@daoudco.jo',
  phoneDisplay: '+962 6 4725003', phoneTel: '+96264725003', fax: '+962 6 4728445',
  poBox: 'P.O. Box 5010, Amman 11183, Jordan',
  hours: 'Saturday – Thursday, 8:00 AM – 4:00 PM',
  whatsapp: '96264725003',
  mapUrl: 'https://goo.gl/maps/am6sSdBw1972',
  socials: { instagram: '', facebook: '', linkedin: '' },
}
export const whyPillars = [
  ['Extrusion expertise', 'In-depth knowledge of extrusion technology for agricultural polyethylene films.'],
  ['Experience since 1977', 'Decades of working with the needs of growers and the agricultural sector.'],
  ['A versatile film portfolio', 'Polyethylene films for greenhouse covering, soil management, crop protection and other agricultural applications.'],
  ['Attention at every stage', 'From raw material selection and production to final testing and customer follow-up.'],
  ['Commitment to quality', 'Testing and quality-control stages support consistent film production.'],
  ['Continued development', 'Ongoing development of machinery, production techniques and testing equipment.'],
]
export const whyPillarsAr = [
  ['خبرة في البثق', 'معرفة متعمقة بتقنيات البثق لإنتاج أفلام البولي إيثيلين الزراعية.'],
  ['خبرة منذ عام 1977', 'عقود من العمل مع احتياجات المزارعين والقطاع الزراعي.'],
  ['مجموعة متنوعة من الأفلام', 'أفلام بولي إيثيلين لتغطية البيوت المحمية وإدارة التربة وحماية المحاصيل وتطبيقات زراعية أخرى.'],
  ['عناية في كل مرحلة', 'من اختيار المواد الخام والإنتاج إلى الاختبارات النهائية ومتابعة العملاء.'],
  ['الالتزام بالجودة', 'مراحل اختبار وضبط جودة تدعم تجانس إنتاج الأفلام.'],
  ['تطوير مستمر', 'تطوير الآلات وتقنيات الإنتاج ومعدات الاختبار باستمرار.'],
]
export const manufacturingCapabilities = [
  ['5-layer co-extrusion', 'Multi-layer extrusion combines five layers in a single polyethylene film.'],
  ['Widths up to 16 m', 'Wide-film production for agricultural covering applications.'],
  ['Automated material handling', 'Automated feeding, dosing and blending of raw materials.'],
  ['Homogeneous blends', 'Controlled material blending supports uniform film production.'],
  ['Additive dispersion', 'Co-extrusion supports the distribution of additives across film layers.'],
  ['Quality control', 'Production is supported by product testing and quality-control stages.'],
]
export const manufacturingCapabilitiesAr = [
  ['بثق مشترك بخمس طبقات', 'تجمع تقنية البثق متعدد الطبقات خمس طبقات في فيلم بولي إيثيلين واحد.'],
  ['عروض تصل إلى 16 متراً', 'إنتاج أفلام عريضة لتطبيقات التغطية الزراعية.'],
  ['مناولة آلية للمواد', 'تغذية وجرعات وخلط آلي للمواد الخام.'],
  ['خلطات متجانسة', 'يسهم التحكم في خلط المواد في تجانس إنتاج الأفلام.'],
  ['توزيع الإضافات', 'تدعم تقنية البثق المشترك توزيع الإضافات عبر طبقات الفيلم.'],
  ['ضبط الجودة', 'تدعم اختبارات المنتجات ومراحل ضبط الجودة عملية الإنتاج.'],
]
export const getWhyPillars = lang => lang === 'ar' ? whyPillarsAr : whyPillars
export const getManufacturingCapabilities = lang => lang === 'ar' ? manufacturingCapabilitiesAr : manufacturingCapabilities
