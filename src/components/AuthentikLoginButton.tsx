'use client'

export default function AuthentikLoginButton() {
  const handleLogin = () => {
    window.location.href = '/api/users/auth/authentik?returnTo=/admin'
  }

  return (
    <div style={{ marginTop: '16px', textAlign: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ flex: 1, height: '1px', background: 'var(--theme-elevation-200)' }} />
        <span style={{ fontSize: '13px', color: 'var(--theme-elevation-500)' }}>oder</span>
        <div style={{ flex: 1, height: '1px', background: 'var(--theme-elevation-200)' }} />
      </div>
      <button
        onClick={handleLogin}
        type="button"
        style={{
          width: '100%',
          padding: '10px 16px',
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--theme-text)',
          backgroundColor: 'var(--theme-elevation-100)',
          border: '1px solid var(--theme-elevation-200)',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = 'var(--theme-elevation-200)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'var(--theme-elevation-100)')
        }
      >
        Mit Authentik anmelden (SSO)
      </button>
    </div>
  )
}
