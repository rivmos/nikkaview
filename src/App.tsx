import React, { useEffect, useRef } from 'react'
import { MediaFactory } from './core/mediaFactory'

const App = () => {

  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    MediaFactory.createMediaViewer(containerRef.current, 'image', 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg')
  }, [])

  return (
    <div ref={containerRef}></div>
  )
}

export default App