import React, {useEffect, useRef, useState} from 'react'

export default function MusicControl(){
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(true) // Start as playing by default
  const [unavailable, setUnavailable] = useState(false)

  useEffect(()=>{
    const music = audioRef.current
    if (!music) return
    const onPlay = ()=>{ setPlaying(true); localStorage.setItem('vv_bg_music_playing','1') }
    const onPause = ()=>{ setPlaying(false); localStorage.setItem('vv_bg_music_playing','0') }
    const onError = ()=> setUnavailable(true)
    music.addEventListener('playing', onPlay)
    music.addEventListener('pause', onPause)
    music.addEventListener('error', onError)
    return ()=>{ 
      music.removeEventListener('playing', onPlay)
      music.removeEventListener('pause', onPause)
      music.removeEventListener('error', onError)
    }
  },[])

  useEffect(()=>{
    // Set music to play by default (store preference as playing)
    localStorage.setItem('vv_bg_music_playing', '1')
    
    // Try to start music automatically
    setTimeout(() => {
      audioRef.current?.play().catch((err) => {
        console.log('Autoplay prevented:', err.message)
        // Even if autoplay fails, keep the UI showing as "playing" 
        // so user knows music will start when they interact
      })
    }, 500)
  },[])

  useEffect(()=>{
    // HEAD check for audio availability
    setTimeout(()=>{
      const music = audioRef.current
      if (!music) return
      if (music.readyState === 0){
        fetch(music.getAttribute('src'), { method: 'HEAD' }).then(r=>{ if (!r.ok) setUnavailable(true) }).catch(()=> setUnavailable(true))
      }
    }, 600)

    // one-time gesture to attempt play if user previously wanted music
    const gestureHandler = ()=>{
      if (localStorage.getItem('vv_bg_music_playing') === '1' && audioRef.current && audioRef.current.paused && !unavailable){
        audioRef.current.play().catch(()=>{})
      }
      window.removeEventListener('pointerdown', gestureHandler)
    }
    window.addEventListener('pointerdown', gestureHandler, { once: true })
  },[unavailable])

  const toggle = async ()=>{
    const music = audioRef.current
    if (!music) return
    if (unavailable) return
    if (music.paused) { 
      try{ await music.play(); }catch{ setPlaying(false) } 
    }
    else music.pause()
  }

  const getIcon = () => {
    if (playing) {
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M5 9v6h4l5 4V5L9 9H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 7a4 4 0 010 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    } else {
      return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M9 9v6h4l5 4V5l-5 4H9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 2l20 20" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
        </svg>
      )
    }
  }

  return (
    <>
      <button 
        id="musicToggle" 
        className={`${playing ? 'playing' : ''} ${unavailable ? 'unavailable' : ''}`}
        aria-pressed={playing} 
        onClick={toggle} 
        title="Toggle background music"
      >
        <span id="musicIcon" aria-hidden="true">{getIcon()}</span>
        <span className="sr-only">Toggle music</span>
      </button>
      <audio ref={audioRef} id="bgMusic" loop preload="auto" src="assets/interstaller.mp3" crossOrigin="anonymous" />
    </>
  )
}
