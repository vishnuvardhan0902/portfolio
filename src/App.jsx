import React from 'react'
import Navigation from './components/Navigation'
import MusicControl from './components/MusicControl'
import CanvasScene from './components/CanvasScene'
import ContentPanels from './components/ContentPanels'

export default function App(){
  return (
    <div className="bg-black text-white" style={{height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'Inter, sans-serif'}}>
      <CanvasScene />
      <div id="instruction" className="instruction" style={{opacity: 0}}>Click and drag to explore. Use the side menu.</div>
      <Navigation />
      <MusicControl />
      <ContentPanels />
    </div>
  )
}
