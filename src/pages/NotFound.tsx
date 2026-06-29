import { useEffect } from 'react'

import { Link } from 'react-router-dom'

const cardStyle = {
  width: 'min(560px, 100%)',
  background: '#ffffff',
  border: '1px solid #e6e8eb',
  borderRadius: 8,
  padding: '40px 32px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
} as const

const headingStyle = {
  margin: 0,
  fontSize: 48,
  fontWeight: 600,
  color: '#1f2328',
  lineHeight: 1,
} as const

const subtitleStyle = {
  margin: '12px 0 24px',
  color: '#6b7280',
  fontSize: 15,
} as const

const linkStyle = {
  color: '#1f6feb',
  textDecoration: 'none',
  fontSize: 15,
} as const

export function NotFound() {
  useEffect(() => {
    const previous = document.title
    document.title = '404 — t-graph'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div style={cardStyle}>
      <h1 style={headingStyle}>404</h1>
      <p style={subtitleStyle}>This page doesn&apos;t exist.</p>
      <Link to="/" style={linkStyle}>
        ← Back to the chart
      </Link>
    </div>
  )
}
