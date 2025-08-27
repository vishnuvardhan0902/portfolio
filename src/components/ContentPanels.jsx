import React, {useEffect} from 'react'
import { gsap } from 'gsap'

export default function ContentPanels(){
  useEffect(()=>{
    const onShow = (e)=>{
      const name = e.detail && e.detail.name
      if (!name) return
      
      const targetSection = document.getElementById(name)
      if (!targetSection) return
      
      // Show the section and animate with slow particle dissolve effect
      targetSection.classList.add('visible')
      targetSection.style.pointerEvents = 'auto'
      
      // Particle dissolve entrance animation
      gsap.fromTo(targetSection, 
        {
          opacity: 0,
          scale: 0.8,
          rotationX: 15,
          filter: "blur(8px)",
        },
        {
          opacity: 1,
          scale: 1,
          rotationX: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power2.out",
        }
      )
      
      // Add sparkle particle effect
      const particles = []
      for(let i = 0; i < 20; i++) {
        const particle = document.createElement('div')
        particle.style.cssText = `
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(129, 173, 255, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1000;
        `
        
        const rect = targetSection.getBoundingClientRect()
        particle.style.left = (rect.left + Math.random() * rect.width) + 'px'
        particle.style.top = (rect.top + Math.random() * rect.height) + 'px'
        
        document.body.appendChild(particle)
        particles.push(particle)
        
        gsap.fromTo(particle, 
          { opacity: 0, scale: 0 },
          { 
            opacity: 1, 
            scale: 1, 
            duration: 0.4 + Math.random() * 0.6,
            delay: Math.random() * 0.8,
            ease: "back.out(1.7)"
          }
        )
        
        gsap.to(particle, {
          opacity: 0,
          y: -30 - Math.random() * 20,
          x: (Math.random() - 0.5) * 40,
          duration: 1.5,
          delay: 0.8 + Math.random() * 0.4,
          ease: "power2.out",
          onComplete: () => {
            document.body.removeChild(particle)
          }
        })
      }
    }
    
    const onHide = ()=>{
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
        
        // Close with dissolve effect
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
          }
        })
      }
    }
    
    window.addEventListener('showSection', onShow)
    window.addEventListener('zoomOut', onHide)
    return ()=>{ window.removeEventListener('showSection', onShow); window.removeEventListener('zoomOut', onHide) }
  },[])

  return (
    <>
      <div id="about" className="content-section">
        <span className="close-btn" onClick={()=> window.dispatchEvent(new Event('zoomOut'))}>&times;</span>
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-semibold mb-2">MARISHETTY VISHNU VARDHAN</h1>
          <p className="text-lg md:text-xl text-blue-300 mb-4">Undergraduate (2022-26) | B.Tech in Computer Science and Business Systems</p>
          <p className="max-w-3xl mx-auto text-gray-300">A passionate and driven student with a strong foundation in computer science and a keen interest in developing innovative solutions. I thrive in collaborative environments and am always eager to learn and apply new technologies to solve real-world problems.</p>
        </div>
      </div>
      
      <div id="education" className="content-section">
        <span className="close-btn" onClick={()=> window.dispatchEvent(new Event('zoomOut'))}>&times;</span>
        <h2 className="text-3xl font-bold mb-6 text-center">Education</h2>
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-blue-400">VNR Vignana Jyothi Institute of Engineering and Technology</h3>
          <p className="text-lg text-gray-300">Hyderabad, India</p>
          <p className="mt-2 text-gray-400">Bachelor of Technology in Computer Science and Business Systems</p>
          <p className="mt-1 text-gray-400">Nov 2022 - May 2026</p>
          <p className="mt-4 text-2xl font-bold text-white">CGPA: 8.62</p>
        </div>
      </div>
      
      <div id="projects" className="content-section">
        <span className="close-btn" onClick={()=> window.dispatchEvent(new Event('zoomOut'))}>&times;</span>
        <h2 className="text-3xl font-bold mb-6 text-center">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400">The Sacred Drop</h3>
            <p className="text-gray-400 mt-2">An educational water conservation game using Unity with real-time leaderboards and dynamic quiz content from the Gemini API. Designed 3D assets in Blender.</p>
            <p className="mt-2 text-sm"><strong>Tech:</strong> Unity, C#, Gemini API, Blender, Node.js, MongoDB</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400">Endeavor</h3>
            <p className="text-gray-400 mt-2">An AI-driven interview prep platform that generates skill-based assessments from resumes using RAG pipelines for domain-specific question generation.</p>
            <p className="mt-2 text-sm"><strong>Tech:</strong> Next.js, Node.js, Python, FastAPI, MongoDB, LangChain, Vector DB</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold text-blue-400">AR Indoor Navigation</h3>
            <p className="text-gray-400 mt-2">An AR navigation system using NavMesh pathfinding and LiDAR-based environmental mapping for real-time guidance.</p>
            <p className="mt-2 text-sm"><strong>Tech:</strong> Unity, NavMeshAI, LiDAR, Blender, C#</p>
          </div>
        </div>
      </div>
      
      <div id="skills" className="content-section">
        <span className="close-btn" onClick={()=> window.dispatchEvent(new Event('zoomOut'))}>&times;</span>
        <h2 className="text-3xl font-bold mb-6 text-center">Skills</h2>
        <div className="flex flex-wrap justify-center gap-4">
          <div className="bg-gray-800 p-4 rounded-lg w-full md:w-auto">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Programming</h3>
            <p>Python, C++, Java, SQL, C, JavaScript</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg w-full md:w-auto">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Development</h3>
            <p>NextJS, NodeJS, MongoDB, HTML, CSS, LangChain, RAG, OOP, DBMS</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg w-full md:w-auto">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Tools</h3>
            <p>Unity, GitHub, Power BI</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg w-full md:w-auto">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Soft Skills</h3>
            <p>Problem-solving, Teamwork, Adaptability, Communication</p>
          </div>
        </div>
      </div>
      
      <div id="leadership" className="content-section">
        <span className="close-btn" onClick={()=> window.dispatchEvent(new Event('zoomOut'))}>&times;</span>
        <h2 className="text-3xl font-bold mb-6 text-center">Leadership Experience</h2>
        <ul className="list-disc list-inside text-gray-300 mt-2 space-y-3">
          <li><strong>VJ TEATRO:</strong> Led the Editing Department, conducted video editing workshops, and organized short film contests to enhance creative skills among participants.</li>
          <li><strong>VNR DESIGN-A-THON:</strong> Coordinated and managed a 24-hour national-level hackathon, facilitating participation from multiple states across India.</li>
          <li><strong>TEDxVNRVJIET:</strong> Served on the TEDx organizing committee for TEDxVNRVJIET 2023; currently part of the 2024 committee.</li>
        </ul>
      </div>
      
      <div id="contact" className="content-section">
        <span className="close-btn" onClick={()=> window.dispatchEvent(new Event('zoomOut'))}>&times;</span>
        <h2 className="text-3xl font-bold mb-6 text-center">Get In Touch</h2>
        <div className="text-center">
          <p className="text-lg mb-4">Feel free to reach out for collaborations or just a friendly chat!</p>
          <p className="mb-2"><strong>Email:</strong> <a href="mailto:vishnuvardhan0290@gmail.com" className="text-blue-400 hover:underline">vishnuvardhan0290@gmail.com</a></p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="https://www.linkedin.com/in/vishnu-vardhan-mvv09" target="_blank" className="text-blue-400 hover:text-blue-300">LinkedIn</a>
            <a href="https://github.com/vishnuvardhan0902" target="_blank" className="text-blue-400 hover:text-blue-300">GitHub</a>
          </div>
        </div>
      </div>
    </>
  )
}
