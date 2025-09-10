import React, {useEffect, useRef} from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { gsap } from 'gsap'

export default function CanvasScene(){
  const mountRef = useRef(null)
  const sceneRef = useRef(null)
  const planetsCreatedRef = useRef(false) // Track if planets have been created

  useEffect(()=>{
    const mount = mountRef.current
    if (!mount) return

    // Prevent duplicate planet creation (React 18 StrictMode issue)
    if (planetsCreatedRef.current) {
      return // Planets already created, exit early
    }
    planetsCreatedRef.current = true

    // loader overlay
    const loader = document.createElement('div')
    loader.id = 'loader'
    loader.style.position = 'fixed'
    loader.style.inset = '0'
    loader.style.display = 'flex'
    loader.style.justifyContent = 'center'
    loader.style.alignItems = 'center'
    loader.style.background = 'rgba(0,0,0,0.85)'
    loader.style.zIndex = '999'
    loader.innerHTML = `<div style="color:white;font-size:20px">Loading Universe...</div>`
    document.body.appendChild(loader)

    const scene = new THREE.Scene()
    sceneRef.current = scene
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)
    const initialCameraPosition = new THREE.Vector3(200, 80, -60) // More zoomed out position
    camera.position.copy(initialCameraPosition)

    const renderer = new THREE.WebGLRenderer({ antialias:true })
  renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
  // keep id similar to original file so other code can select it
  renderer.domElement.id = 'bg'
    renderer.domElement.style.position = 'fixed'
    renderer.domElement.style.inset = '0'
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 10; controls.maxDistance = 200

    const textureLoader = new THREE.TextureLoader()
    const spaceTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/starry-deep-space-bg.jpg')
    const spaceGeometry = new THREE.SphereGeometry(500, 64, 64)
    const spaceMaterial = new THREE.MeshBasicMaterial({ map: spaceTexture, side: THREE.BackSide })
    const spaceBackground = new THREE.Mesh(spaceGeometry, spaceMaterial)
    scene.add(spaceBackground)

    // lights
    const pointLight = new THREE.PointLight(0xffffff, 1.5)
    pointLight.position.set(20,20,30)
    const ambient = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(pointLight, ambient)

    // stars
    const starVertices = []
    for (let i=0;i<8000;i++){ const [x,y,z] = Array(3).fill().map(()=>THREE.MathUtils.randFloatSpread(1000)); starVertices.push(x,y,z) }
    const starGeometry = new THREE.BufferGeometry()
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color:0xffffff, size:0.5 }))
    scene.add(stars)

    // planets container
    const planetGroup = new THREE.Group()
    scene.add(planetGroup)

    const gltfLoader = new GLTFLoader()
    const planetsMeta = [
      { name: 'contact', url: '/assets/mercury.glb', position:{x:-60,y:0,z:0}, scale:5 },
      { name: 'skills', url: '/assets/venus.glb', position:{x:-35,y:0,z:0}, scale:0.08 },
      { name: 'about', url: '/assets/earth.glb', position:{x:0,y:0,z:0}, scale:0.1 },
      { name: 'projects', url: '/assets/mars.glb', position:{x:40,y:0,z:0}, scale:20 },
      { name: 'leadership', url: '/assets/jupiter.glb', position:{x:80,y:0,z:0}, scale:7 },
      { name: 'education', url: '/assets/saturn.glb', position:{x:120,y:0,z:0}, scale:0.1, ring:{ textureUrl: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/saturnringcolor.jpg', innerRadius:6, outerRadius:10 } }
    ]

    let loadedPlanets = 0
    const totalPlanets = planetsMeta.length

    function createFallbackPlanet(name, position, scale, ring){
      const geometry = new THREE.SphereGeometry(2 * (scale||1), 32, 32)
      const material = new THREE.MeshStandardMaterial({ color: new THREE.Color().setHSL(Math.random(),0.7,0.5), roughness:0.8, metalness:0.1 })
      const planet = new THREE.Mesh(geometry, material)
      planet.position.set(position.x, position.y, position.z)
      planet.rotation.z = Math.random() * Math.PI
      planet.userData = { name, modelUrl: 'fallback' }
      planetGroup.add(planet)
      if (ring) {
        const ringTexture = textureLoader.load(ring.textureUrl)
        const ringGeometry = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 64)
        const pos = ringGeometry.attributes.position
        const v3 = new THREE.Vector3()
        for (let i=0;i<pos.count;i++){ v3.fromBufferAttribute(pos,i); ringGeometry.attributes.uv.setXY(i, v3.length() < ring.innerRadius + 0.1 ? 0 : 1, 1) }
        const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
        const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
        ringMesh.rotation.x = -0.5 * Math.PI
        planet.add(ringMesh)
      }
    }

    function loadPlanet(meta){
      gltfLoader.load(meta.url,
        (gltf)=>{
          const planet = gltf.scene
          planet.scale.setScalar(meta.scale || 1)
          planet.position.set(meta.position.x, meta.position.y, meta.position.z)
          planet.rotation.z = Math.random() * Math.PI
          planet.userData = { name: meta.name, modelUrl: meta.url }
          planetGroup.add(planet)
          if (meta.ring) {
            const ringTexture = textureLoader.load(meta.ring.textureUrl)
            const ringGeometry = new THREE.RingGeometry(meta.ring.innerRadius, meta.ring.outerRadius, 64)
            const pos = ringGeometry.attributes.position
            const v3 = new THREE.Vector3()
            for (let i=0;i<pos.count;i++){ v3.fromBufferAttribute(pos,i); ringGeometry.attributes.uv.setXY(i, v3.length() < meta.ring.innerRadius + 0.1 ? 0 : 1, 1) }
            const ringMaterial = new THREE.MeshBasicMaterial({ map: ringTexture, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
            const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
            ringMesh.rotation.x = -0.5 * Math.PI
            planet.add(ringMesh)
          }
          loadedPlanets++
          if (loadedPlanets === totalPlanets) { loader.remove(); window.dispatchEvent(new Event('modelsReady')) }
        },
        undefined,
        (err)=>{ console.warn('GLTF load failed for', meta.url, err); createFallbackPlanet(meta.name, meta.position, meta.scale, meta.ring); loadedPlanets++; if (loadedPlanets === totalPlanets) { loader.remove(); window.dispatchEvent(new Event('modelsReady')) } }
      )
    }

    planetsMeta.forEach(loadPlanet)

    // cinematic config (similar to original)
    const planetCinematic = {
      contact: { fovTarget: 36, distanceMul: 1.0, xFactor: 0.12, yFactor: 0.06, duration: 1.4 },
      skills:  { fovTarget: 38, distanceMul: 0.6, xFactor: 0,    yFactor: 1,    duration: 1.3 },
      about:   { fovTarget: 34, distanceMul: 1.0, xFactor: 0.15, yFactor: 0.08, duration: 1.3 },
      projects:{ fovTarget: 40, distanceMul: 1.0, xFactor: 0.10, yFactor: 0.06, duration: 1.5 },
      leadership:{ fovTarget: 42, distanceMul: 1.0, xFactor: 0.18, yFactor: 0.10, duration: 1.6 },
      education:{ fovTarget: 36, distanceMul: 1.0, xFactor: 0.16, yFactor: 0.08, duration: 1.6 }
    }

    let isZoomed = false

    function moveCameraToPlanet(targetPlanet){
      const targetPosition = new THREE.Vector3(); targetPlanet.getWorldPosition(targetPosition)
      const box = new THREE.Box3().setFromObject(targetPlanet)
      const size = box.getSize(new THREE.Vector3())
      const base = Math.max(size.x, size.y, size.z) || 1
      const name = targetPlanet.userData && targetPlanet.userData.name ? targetPlanet.userData.name : ''
      const cfg = planetCinematic[name] || { fovTarget:36, distanceMul:2.5, xFactor:0.12, yFactor:0.06, duration:1.4 }
      const offset = base * cfg.distanceMul
      const cameraTargetPosition = new THREE.Vector3(
        targetPosition.x + (offset * cfg.xFactor),
        targetPosition.y + (offset * cfg.yFactor),
        targetPosition.z + offset
      )
      const tl = gsap.timeline({ defaults:{ ease:'power3.inOut' } })
      tl.addLabel('start')
        .to(camera, { duration: Math.min(0.9, cfg.duration * 0.6), fov: cfg.fovTarget, onUpdate: ()=> camera.updateProjectionMatrix() }, 'start+=0.05')
        .to(camera.position, { duration: cfg.duration, x: cameraTargetPosition.x, y: cameraTargetPosition.y, z: cameraTargetPosition.z }, 'start+=0.05')
        .to(controls.target, { duration: cfg.duration, x: targetPosition.x, y: targetPosition.y, z: targetPosition.z, onUpdate: ()=> controls.update() }, 'start+=0.05')
        .call(()=>{ isZoomed = true; window.dispatchEvent(new CustomEvent('showSection', { detail: { name } })) })
    }

    function zoomOut(){
      const tl = gsap.timeline({ defaults:{ ease:'power3.inOut' } })
      tl.to(camera, { duration: 1.2, fov: 75, onUpdate: ()=> camera.updateProjectionMatrix() }, 0)
        .to(camera.position, { duration: 1.6, x: initialCameraPosition.x, y: initialCameraPosition.y, z: initialCameraPosition.z }, 0)
        .to(controls.target, { duration: 1.6, x: 0, y: 0, z: 0, onUpdate: ()=> controls.update() }, 0)
        .call(()=>{ controls.enabled = true; isZoomed = false; const inst = document.querySelector('.instruction'); if (inst) inst.style.opacity = '1' })
    }

  // propagate pointerdown on canvas so navigation can close mobile dropdowns (matches original behaviour)
  const onCanvasPointer = ()=> window.dispatchEvent(new Event('canvasPointerDown'))
  renderer.domElement.addEventListener('pointerdown', onCanvasPointer)

  // listen for navigation events and models ready
    const onNavigate = (e)=>{
      const name = e.detail && e.detail.name
      if (!name) return
      const scene = sceneRef.current
      if (!scene) return
      const planetGroup = scene.children.find(child => child.type === 'Group' && child.children.length > 0)
      if (!planetGroup) return
      const target = planetGroup.children.find(c=>c.userData && c.userData.name===name)
      if (!target) return
      moveCameraToPlanet(target)
    }
    const onModelsReady = ()=>{
      // hide loader is handled by loader.remove when last model loads
      
      // Auto-navigate to "about" section after a brief delay to show the overview first
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('navigateTo', { detail: { name: 'about' } }))
      }, 1500) // 1.5 second delay to appreciate the overview
    }
    window.addEventListener('navigateTo', onNavigate)
    window.addEventListener('modelsReady', onModelsReady)
    window.addEventListener('zoomOut', zoomOut)

    // animation loop
    const animate = ()=>{
      const currentPlanetGroup = scene.children.find(child => child.type === 'Group' && child.children.length > 0)
      if (currentPlanetGroup) {
        currentPlanetGroup.children.forEach(p=>{ p.rotation.y += 0.001 })
      }
      stars.rotation.y += 0.0001
      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // resize
    const onResize = ()=>{ camera.aspect = window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight) }
    window.addEventListener('resize', onResize)

    // cleanup
    return ()=>{
      planetsCreatedRef.current = false // Reset flag for next mount
      window.removeEventListener('navigateTo', onNavigate)
      window.removeEventListener('modelsReady', onModelsReady)
      window.removeEventListener('zoomOut', zoomOut)
      window.removeEventListener('resize', onResize)
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader)
      
      // Clear planets from scene to prevent duplicates on re-mount
      const scene = sceneRef.current
      if (scene) {
        const planetGroup = scene.children.find(child => child.type === 'Group' && child.children.length > 0)
        if (planetGroup) {
          planetGroup.children.forEach(child => {
            if (child.geometry) child.geometry.dispose()
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose())
              } else {
                child.material.dispose()
              }
            }
          })
          planetGroup.clear()
        }
      }
      
      try{ mount.removeChild(renderer.domElement) }catch{}
      renderer.domElement.removeEventListener('pointerdown', onCanvasPointer)
      renderer.dispose()
    }
  },[])

  return <div ref={mountRef} style={{position:'fixed', inset:0}} />
}
