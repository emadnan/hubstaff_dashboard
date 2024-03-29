import { React, useState, useEffect } from 'react'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import BusinessIcon from '@mui/icons-material/Business'
import AccountCircle from '@mui/icons-material/AccountCircle'
import { Modal } from 'antd'
import { cilSettings, cilAccountLogout } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import user from './../../assets/images/user.png'
import company from './../../assets/images/company.png'

const AppHeaderDropdown = () => {
  // const sessionExpirationTime = 5000;
  const [loggedOut, setLoggedOut] = useState(false)

  const modalStyle = {
    position: 'fixed',
    top: '35%',
    left: '40%',
  }

  const navigate = useNavigate()
  const local = JSON.parse(localStorage.getItem('user-info'))
  // let user = JSON.parse(localStorage.getItem("user-info"))

  function logOut() {
    if (loggedOut === true) {
      setTimeout(async () => {
        localStorage.clear()
        sessionStorage.clear()
        await navigate('/Login')
        window.location.reload()
      }, 100)
    }
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
    setLoggedOut(true)
  }

  const handleOk = () => {
    logOut()
    setLoggedOut(false)
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setLoggedOut(false)
  }

  return (
    <>
      <CDropdown variant="nav-item">
        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          {local.Users.role === 3 ? (
            <BusinessIcon style={{ fontSize: '40px' }} />
          ) : (
            <AccountCircle style={{ fontSize: '40px' }} />
          )}
        </CDropdownToggle>

        <CDropdownMenu className="pt-0" placement="bottom-end">
          <CDropdownHeader className="bg-light fw-semibold py-2">
            {local.Users.role === 3 ? local.Users.company_name : local.Users.name}
          </CDropdownHeader>

          {/* <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>

          <CDropdownItem onClick={showModal}>
            <CIcon icon={cilSettings} className="me-2" />
            Settings
          </CDropdownItem> */}

          {/* <CDropdownDivider /> */}

          <CDropdownItem onClick={showModal}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>
          <CDropdownItem href="/changepassword">
            <CIcon icon={cilSettings} className="me-2" />
            Change Password
          </CDropdownItem> 
          
        </CDropdownMenu>
      </CDropdown>

      <Modal
        title="Exit"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ style: { background: 'blue' } }}
        style={modalStyle}
      >
        <p>Are you sure you want to exit?</p>
      </Modal>
    </>
  )
}

export default AppHeaderDropdown
