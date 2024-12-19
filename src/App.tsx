import React, { useEffect, useRef } from 'react'
import { MediaFactory } from './core/mediaFactory'

const Image = ({link} : {link: string}) => {
  
  const containerRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    MediaFactory.createMediaViewer(containerRef.current, 'image', link)
  }, [])


  return(
    <div ref={containerRef}>
        
    </div>
  )
}

const App = () => {

  return (
    <div style={{ display: 'flex', height: '200px', gap: '20px' }}>
      {
        ['https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg', 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg', 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg', 'https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg'].map((imageLink, index) => <Image key={index} link={imageLink}/>)
      }
    </div>
  )
}

export default App