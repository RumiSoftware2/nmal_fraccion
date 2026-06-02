import React from 'react'
import StartButton from './ui/StartButton'
import './WelcomeMenu.css'

export default function WelcomeStatic({ onStart }) {
  return (
    <div className="welcome-menu">
      <div style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg,#f6f7fb 0%,#fffaf6 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ marginBottom: 12 }}>Bienvenido a Math Tutor</h1>
          <p style={{ marginBottom: 18 }}>Una experiencia interactiva para aprender matemáticas.</p>
          <StartButton onClick={onStart} />
        </div>
      </div>
    </div>
  )
}
