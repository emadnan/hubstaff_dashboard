import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter
      style={{ backgroundColor: '#f8f9fa', color: '#333', padding: '20px', marginTop: '20px' }}
    >
      <div>
        <a
          href="https://www.biafotech.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: 'black',
          }}
        >
          BiafoTech
        </a>
        <span className="ms-1">Private Ltd. &copy; {currentYear}</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a
          href="https://www.biafotech.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            textDecoration: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: 'black',
          }}
        >
          BiafoTech
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
