import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import worklog from 'src/assets/images/worklog.png'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import { _navAdmin, _navCompanyAdmin, _navEmployee, _navFunctional, _navTeamLead } from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [navigation, setNavigation] = useState([])

  useEffect(() => {
    const userRole = JSON.parse(localStorage.getItem('user-info'))?.Users?.role

    let navConfig
    if (userRole === 1) {
      navConfig = _navAdmin
    } else if (userRole === 3) {
      navConfig = _navCompanyAdmin
    } else if (userRole === 5) {
      navConfig = _navEmployee
    } else if (userRole === 6) {
      navConfig = _navFunctional
    } else if (userRole === 7) {
      navConfig = _navTeamLead
    } else {
      navConfig = _navEmployee
    }

    setNavigation(navConfig)
  }, [])

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img src={worklog} width={150} height={50} alt="" />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar
          style={{
            maxHeight: '100%',
          }}
        >
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
