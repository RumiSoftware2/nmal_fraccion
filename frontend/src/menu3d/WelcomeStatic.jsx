import React from 'react'
import StartButton from './ui/StartButton'
import WelcomeTypography from './ui/WelcomeTypography'
import ContinuedFractionDecor from './ui/ContinuedFractionDecor'
import { WelcomePointerProvider } from './context/WelcomePointerContext'
import './WelcomeMenu.css'

export default function WelcomeStatic({ onStart }) {
  return (
    <WelcomePointerProvider>
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#f6f7fb 0%,#fffaf6 100%)',
        position: 'relative'
      }}>
        <ContinuedFractionDecor />
        <div style={{ textAlign: 'center' }}>
          <WelcomeTypography isStatic />
          <div style={{ marginTop: 18 }}>
            <StartButton onClick={onStart} delay={0.75} />
          </div>
        </div>
      </div>
    </WelcomePointerProvider>
  )
}

