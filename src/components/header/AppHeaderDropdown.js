import React from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilSettings,
  cilUser,
  cilAccountLogout
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom';
import biafologo from './../../assets/images/biafologo.png'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user-info"))
  console.warn(user)

  function logOut() {
    localStorage.clear();
    navigate("/Login")
  }

  return (
    <CDropdown variant="nav-item">
      
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={biafologo} size="md" />
      </CDropdownToggle>

      <CDropdownMenu className="pt-0" placement="bottom-end">

        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>

        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>

        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2"/>
          Change Password
        </CDropdownItem>

        <CDropdownDivider />

        <CDropdownItem href="#" onClick={logOut}>
          <CIcon icon={cilAccountLogout} className="me-2"/>
          Logout
        </CDropdownItem>

      </CDropdownMenu>

    </CDropdown>
  )
}

export default AppHeaderDropdown
