import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://www.biafotech.com/" target="_blank" rel="noopener noreferrer">
          BiafoTech
        </a>
        <span className="ms-1">&copy; 2022 Private Lmtd.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://www.biafotech.com/" target="_blank" rel="noopener noreferrer">
          BiafoTech
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
