import React from 'react'
import { Canvas } from '@react-three/fiber'
import WelcomeScene from './scene/WelcomeScene'
import StartButton from './ui/StartButton'
import useWebGLSupport from './hooks/useWebGLSupport'
import useReducedMotion from './hooks/useReducedMotion'
import WelcomeStatic from './WelcomeStatic'
import WelcomeErrorBoundary from './WelcomeErrorBoundary'
import { WelcomePointerProvider } from './context/WelcomePointerContext'
import WelcomeTypography from './ui/WelcomeTypography'
import ContinuedFractionDecor from './ui/ContinuedFractionDecor'
import './WelcomeMenu.css'

export default function WelcomeMenu({ onStart }) {
  const webgl = useWebGLSupport()
  const reduced = useReducedMotion()

  if (!webgl || reduced) {
    return <WelcomeStatic onStart={onStart} />
  }

  return (
    <WelcomePointerProvider>
      <WelcomeErrorBoundary fallback={<WelcomeStatic onStart={onStart} />}>
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 6], fov: 50 }}>
          <WelcomeScene />
        </Canvas>
      </WelcomeErrorBoundary>

      <div className="welcome-overlay">
        <WelcomeTypography />
        <StartButton onClick={onStart} delay={0.75} />
        <ContinuedFractionDecor />
      </div>
    </WelcomePointerProvider>
  )
}
