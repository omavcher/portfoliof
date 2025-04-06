import React from 'react'

function NotFound() {
  return (
    <div style={{
      backgroundColor: '#000000',
      color: '#ffffff',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '20px',
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '6rem',
          margin: '0',
          color: '#ffffff',
          fontWeight: '900',
          lineHeight: '1'
        }}>404</h1>
        
        <h2 style={{
          fontSize: '2rem',
          margin: '20px 0 10px',
          color: '#ffffff',
          fontWeight: '700'
        }}>Page Not Found</h2>
        
        <p style={{
          fontSize: '1.1rem',
          margin: '0 0 30px',
          color: '#aaaaaa',
          lineHeight: '1.5'
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <a href="/" style={{
          display: 'inline-block',
          padding: '12px 30px',
          backgroundColor: '#ffffff',
          color: '#000000',
          textDecoration: 'none',
          borderRadius: '4px',
          fontWeight: '600',
          transition: 'all 0.3s ease',
          marginTop: '20px',
          ':hover': {
            backgroundColor: '#dddddd',
            transform: 'translateY(-2px)'
          }
        }}>Go to Homepage</a>
      </div>
    </div>
  )
}

export default NotFound
