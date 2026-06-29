import type { ValidationError } from '../lib/validateChartInputs'

const cardStyle = {
  width: 'min(560px, 100%)',
  background: '#ffffff',
  border: '1px solid #e6e8eb',
  borderRadius: 8,
  padding: '40px 32px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
} as const

const iconWrapStyle = {
  width: 48,
  height: 48,
  marginBottom: 16,
} as const

const titleStyle = {
  margin: 0,
  fontSize: 24,
  fontWeight: 600,
  color: '#1f2328',
  lineHeight: 1.2,
} as const

const messageStyle = {
  margin: '12px 0 0',
  color: '#1f2328',
  fontSize: 15,
  lineHeight: 1.5,
} as const

const hintStyle = {
  margin: '12px 0 0',
  color: '#6b7280',
  fontSize: 14,
  lineHeight: 1.5,
} as const

function WarningIcon() {
  return (
    <svg
      style={iconWrapStyle}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#d97706"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

type Props = { error: ValidationError }

export function DataErrorPanel({ error }: Props) {
  return (
    <div style={cardStyle} role="alert">
      <WarningIcon />
      <h2 style={titleStyle}>{error.title}</h2>
      <p style={messageStyle}>{error.message}</p>
      <p style={hintStyle}>{error.hint}</p>
    </div>
  )
}
