
import { useEffect } from 'react'
export default function SEO({title, description, canonical}){
 useEffect(()=>{
  document.title = title
  const set=(sel,attr,val)=>{let el=document.querySelector(sel); if(!el){el=document.createElement('meta'); if(sel.includes('description')) el.name='description'; document.head.appendChild(el)} el.setAttribute(attr,val)}
  set('meta[name="description"]','content',description)
  let can=document.querySelector('link[rel="canonical"]'); if(!can){can=document.createElement('link'); can.rel='canonical'; document.head.appendChild(can)} can.href=canonical || window.location.href
 },[title,description,canonical])
 return null
}
