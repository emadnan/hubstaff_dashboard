import React from 'react'

const NotFound = () => {
  const pageStyle = {
    height: '70vh',
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#808080',
  }
  return (
    <div style={pageStyle}>
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  )
}

export default NotFound
