import { React, useState, useEffect } from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { Modal } from 'antd';
import {
  cilSettings,
  cilUser,
  cilAccountLogout
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom';
import grey from './../../assets/images/grey.png'

const AppHeaderDropdown = () => {

  // const sessionExpirationTime = 5000;

  const modalStyle = {
    position: "fixed",
    top: "35%",
    left: "40%",
  };

  const navigate = useNavigate();
  let user = JSON.parse(localStorage.getItem("user-info"))

  function logOut() {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/Login")
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    logOut()
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // useEffect(() => {
  //   const checkSessionExpiration = () => {
  //     const currentTime = new Date().getTime();
  //     if (currentTime > sessionExpirationTime) {
  //       logOut(); // Call the logout function or perform logout actions
  //     }
  //   };

  //   const interval = setInterval(checkSessionExpiration, 1000); // Adjust the interval as needed

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <>
      <CDropdown variant="nav-item">

        <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
          <CAvatar src={grey} size="col-md-6" />
        </CDropdownToggle>

        <CDropdownMenu className="pt-0" placement="bottom-end">

          <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>

          {/* <CDropdownItem href="#">
            <CIcon icon={cilUser} className="me-2" />
            Profile
          </CDropdownItem>

          <CDropdownItem href="#">
            <CIcon icon={cilSettings} className="me-2" />
            Change Password
          </CDropdownItem> */}

          {/* <CDropdownDivider /> */}

          <CDropdownItem href="#" onClick={showModal}>
            <CIcon icon={cilAccountLogout} className="me-2" />
            Logout
          </CDropdownItem>

        </CDropdownMenu>

      </CDropdown>

      <Modal title="Exit" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ style: { background: 'blue' } }} style={modalStyle}>
        <p>Are you sure you want to exit?</p>
      </Modal>

    </>
  )
}

export default AppHeaderDropdown
