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
            <div className="flex gap-3 mt-3">
              <a href="https://github.com/vishnuvardhan0902/TheSacredDrop" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="https://drive.google.com/file/d/1JTeMlUDAsbDfTBxlssh2MyrvtqiSbrI5/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Demo
              </a>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400">Endeavor</h3>
            <p className="text-gray-400 mt-2">An AI-driven interview prep platform that generates skill-based assessments from resumes using RAG pipelines for domain-specific question generation.</p>
            <p className="mt-2 text-sm"><strong>Tech:</strong> Next.js, Node.js, Python, FastAPI, MongoDB, LangChain, Vector DB</p>
            <div className="flex gap-3 mt-3">
              <a href="https://github.com/vishnuvardhan0902/Endeavor" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="https://drive.google.com/file/d/1y0zc5O8MFMYPjiEU4ssukqE7uoRkDxTf/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Demo
              </a>
            </div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold text-blue-400">AR Indoor Navigation</h3>
            <p className="text-gray-400 mt-2">An AR navigation system using NavMesh pathfinding and LiDAR-based environmental mapping for real-time guidance.</p>
            <p className="mt-2 text-sm"><strong>Tech:</strong> Unity, NavMeshAI, LiDAR, Blender, C#</p>
            <div className="flex gap-3 mt-3">
              <a href="https://github.com/vishnuvardhan0902/ar_Indoor_navigation" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.30 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a href="https://drive.google.com/file/d/1JVcVz8wnpt9LY2pmmA_9yFKXRhoq0vak/view?usp=drivesdk" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 text-sm flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                Demo
              </a>
            </div>
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
