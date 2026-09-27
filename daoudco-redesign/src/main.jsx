
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import FloatingWhatsApp from './components/FloatingWhatsApp'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Manufacturing from './pages/Manufacturing'
import Applications from './pages/Applications'
import Gallery from './pages/Gallery'
import Contact from './pages/Contact'
import './styles/site.css'

function ScrollToTop(){
 const { pathname, search } = useLocation()
 useEffect(()=>{window.scrollTo({top:0,left:0,behavior:'auto'})},[pathname,search])
 return null
}

function App(){const [lang,setLang]=useState(localStorage.getItem('lang')||'en'); useEffect(()=>{document.documentElement.lang=lang; document.documentElement.dir=lang==='ar'?'rtl':'ltr'; localStorage.setItem('lang',lang)},[lang]); return <BrowserRouter><ScrollToTop/><Header lang={lang} setLang={setLang}/><Routes><Route path="/" element={<Home lang={lang}/>}/><Route path="/about" element={<About lang={lang}/>}/><Route path="/products" element={<Products lang={lang}/>}/><Route path="/products/:slug" element={<ProductDetail lang={lang}/>}/><Route path="/manufacturing" element={<Manufacturing lang={lang}/>}/><Route path="/applications" element={<Applications lang={lang}/>}/><Route path="/gallery" element={<Gallery lang={lang}/>}/><Route path="/customers" element={<Navigate to="/about" replace/>}/><Route path="/contact" element={<Contact lang={lang}/>}/></Routes><FloatingWhatsApp lang={lang}/><Footer lang={lang}/></BrowserRouter>}
createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>)
