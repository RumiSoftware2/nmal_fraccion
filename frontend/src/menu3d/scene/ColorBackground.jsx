import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWelcomePointer } from '../context/WelcomePointerContext'
import useWelcomePalette from '../hooks/useWelcomePalette'

export default function ColorBackground() {
  const meshRef = useRef()
  const { pointerRef } = useWelcomePointer()
  const palRef = useWelcomePalette(pointerRef)

  useFrame(() => {
    const p = pointerRef.current
    const pal = palRef.current
    if (meshRef.current && pal) {
      // subtle color mix using style background via material color
      const c = pal.primary.replace('#','')
      meshRef.current.material.color.set(pal.primary)
      meshRef.current.material.opacity = 1.0
    }
  })

  return (
    <mesh ref={meshRef} position={[0,0,-6]} scale={[20, 12, 1]}>
      <planeGeometry args={[1,1]} />
      <meshBasicMaterial toneMapped={false} fog={false} side={2} />
    </mesh>
  )
}
