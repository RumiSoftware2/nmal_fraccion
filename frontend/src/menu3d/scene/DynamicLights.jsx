import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWelcomePointer } from '../context/WelcomePointerContext'

export default function DynamicLights() {
  const warmRef = useRef()
  const coolRef = useRef()
  const dirRef = useRef()
  const { pointerRef } = useWelcomePointer()

  useFrame((state) => {
    const p = pointerRef.current
    const t = state.clock.elapsedTime
    // lerp positions
    const lerp = (a,b,t2)=> a + (b-a)*0.08
    const targetX = p.x * 2
    const targetY = p.y * 1.5
    if (warmRef.current) {
      warmRef.current.position.x = warmRef.current.position.x + (targetX - warmRef.current.position.x) * 0.08
      warmRef.current.position.y = warmRef.current.position.y + (targetY - warmRef.current.position.y) * 0.08
    }
    if (coolRef.current) {
      coolRef.current.position.x = coolRef.current.position.x + ((-targetX) - coolRef.current.position.x) * 0.08
      coolRef.current.position.y = coolRef.current.position.y + ((-targetY) - coolRef.current.position.y) * 0.08
    }
    if (dirRef.current) {
      dirRef.current.intensity = 0.4 + Math.sin(t * 0.6) * 0.08
    }
  })

  return (
    <>
      <ambientLight intensity={0.45} />
      <pointLight ref={warmRef} intensity={0.8} distance={8} color={'#ffd6a5'} position={[0,2,2]} />
      <pointLight ref={coolRef} intensity={0.7} distance={8} color={'#cfe8ff'} position={[0,-2,1.5]} />
      <directionalLight ref={dirRef} intensity={0.45} position={[2,4,2]} />
    </>
  )
}
