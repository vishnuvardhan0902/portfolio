import React, {useState, useEffect, useRef} from 'react'
import { gsap } from 'gsap'

const navOrder = ['about','education','skills','projects','leadership','contact']
const thumbnails = {
  about: '/cover_photos/Earth.png',
  education: '/cover_photos/Saturn.png',
  projects: '/cover_photos/Mars.png',
  skills: '/cover_photos/Venus.png',
  leadership: '/cover_photos/Jupyter.png',
  contact: '/cover_photos/Mercury.png'
}

export default function Navigation(){
  const [open, setOpen] = useState(false)
  const backdropRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(()=>{
  const onNavigate = () => setOpen(false)
  const onCanvasPointer = ()=> setOpen(false)
  window.addEventListener('navigateTo', onNavigate)
  window.addEventListener('canvasPointerDown', onCanvasPointer)
  return ()=>{ window.removeEventListener('navigateTo', onNavigate); window.removeEventListener('canvasPointerDown', onCanvasPointer) }
  },[])

  const handleClick = (name)=>{
    // Check if there's a currently visible popup
    const currentVisible = document.querySelector('.content-section.visible')
    
    if (currentVisible) {
      // Create dissolve particles before closing
      const particles = []
      for(let i = 0; i < 15; i++) {
        const particle = document.createElement('div')
        particle.style.cssText = `
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(129, 173, 255, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1000;
        `
        
        const rect = currentVisible.getBoundingClientRect()
        particle.style.left = (rect.left + Math.random() * rect.width) + 'px'
        particle.style.top = (rect.top + Math.random() * rect.height) + 'px'
        
        document.body.appendChild(particle)
        particles.push(particle)
        
        gsap.to(particle, {
          opacity: 0,
          scale: 0,
          y: Math.random() * 60 - 30,
          x: Math.random() * 60 - 30,
          duration: 0.8 + Math.random() * 0.4,
          ease: "power2.out",
          onComplete: () => {
            if (document.body.contains(particle)) {
              document.body.removeChild(particle)
            }
          }
        })
      }
      
      // Close current popup with dissolve effect
      gsap.to(currentVisible, {
        opacity: 0,
        scale: 0.85,
        rotationX: -10,
        filter: "blur(6px)",
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          currentVisible.classList.remove('visible')
          currentVisible.style.pointerEvents = 'none'
          
          // Now trigger camera movement
          window.dispatchEvent(new CustomEvent('navigateTo',{ detail: { name } }))
        }
      })
    } else {
      // No popup open, directly trigger camera movement
      window.dispatchEvent(new CustomEvent('navigateTo',{ detail: { name } }))
    }
    
    setOpen(false)
  }

  useEffect(()=>{
    const b = backdropRef.current
    const d = dropdownRef.current
    if (open){
      if (b) { 
        b.style.display = 'block'
        b.classList.add('backdrop-visible')
        gsap.fromTo(b,{opacity:0},{opacity:1,duration:0.32,ease:'power1.out'}) 
      }
      if (d) { 
        d.style.display = 'block'
        d.classList.add('dropdown-open')
        gsap.fromTo(d,{opacity:0,scale:0.96},{opacity:1,scale:1,duration:0.38,ease:'back.out(0.6)'}) 
      }
      document.getElementById('bg')?.style && (document.getElementById('bg').style.filter = 'blur(4px)')
      document.querySelectorAll('.content-section').forEach(s=> s.style.filter = 'blur(3px)')
    } else {
      if (b) gsap.to(b,{opacity:0,duration:0.22,ease:'power1.in', onComplete: ()=> { b.classList.remove('backdrop-visible'); b.style.display = 'none' }})
      if (d) gsap.to(d,{opacity:0,scale:0.96,duration:0.24,ease:'power1.in', onComplete: ()=> { d.classList.remove('dropdown-open'); d.style.display = 'none' }})
      document.getElementById('bg')?.style && (document.getElementById('bg').style.filter = '')
      document.querySelectorAll('.content-section').forEach(s=> s.style.filter = '')
    }
  },[open])

  return (
    <>
      {/* Side Navigation (ALWAYS visible) */}
      <div id="navigation" className="fixed top-4 left-1/2 -translate-x-1/2 flex flex-row gap-2 z-20 md:top-1/2 md:left-5 md:-translate-x-0 md:-translate-y-1/2 md:flex-col">
        {/* Explore button: visible on small screens only */}
        <button id="exploreBtn" className="explore-btn" aria-controls="navItems" aria-expanded={open} onClick={()=>setOpen(v=>!v)} title="Open navigation">
          <span>Explore</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div id="navItems" className="flex flex-row gap-2 md:flex-col">
          {/* Buttons will be generated by JavaScript */}
          {navOrder.map(key => (
            <div key={key} className="nav-item flex items-center gap-4 cursor-pointer p-1" role="button" tabIndex={0} onClick={()=>handleClick(key)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') {e.preventDefault(); handleClick(key)}}}>
              <img src={thumbnails[key]} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border-2 border-transparent transition-all duration-300"/>
              <span className="text-white whitespace-nowrap text-xs md:text-sm ml-2 md:ml-3">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile backdrop and dropdown (injected for small screens) */}
      <div id="mobileBackdrop" ref={backdropRef} tabIndex={-1} aria-hidden="true" onClick={()=>setOpen(false)} />
      <div id="mobileDropdown" ref={dropdownRef} aria-hidden={!open}>
        <div id="mobileNavItems" className="flex flex-col gap-2">
          {navOrder.map(key => (
            <div key={key} className="nav-item flex items-center gap-4 cursor-pointer p-1" role="button" tabIndex={0} onClick={()=>handleClick(key)} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') {e.preventDefault(); handleClick(key)}}}>
              <img src={thumbnails[key]} alt="" className="w-6 h-6 md:w-8 md:h-8 rounded-full object-cover border-2 border-transparent transition-all duration-300"/>
              <span className="text-white whitespace-nowrap text-xs md:text-sm ml-2 md:ml-3">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
