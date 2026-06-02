import React from 'react'
import { Canvas } from '@react-three/fiber'
import WelcomeScene from './scene/WelcomeScene'
import StartButton from './ui/StartButton'
import useWebGLSupport from './hooks/useWebGLSupport'
import useReducedMotion from './hooks/useReducedMotion'
import WelcomeStatic from './WelcomeStatic'
import WelcomeErrorBoundary from './WelcomeErrorBoundary'
import './WelcomeMenu.css'

export default function WelcomeMenu({ onStart }) {
  const webgl = useWebGLSupport()
  const reduced = useReducedMotion()

  if (!webgl || reduced) {
    return <WelcomeStatic onStart={onStart} />
  }

  return (
    <div className="welcome-menu">
      <WelcomeErrorBoundary fallback={<WelcomeStatic onStart={onStart} />}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }}>
          <WelcomeScene />
        </Canvas>
      </WelcomeErrorBoundary>
      <div className="welcome-overlay">
        <StartButton onClick={onStart} />
      </div>
    </div>
  )
}
