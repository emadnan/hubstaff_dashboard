import React from 'react'

import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'
import { cilOptions } from '@coreui/icons'

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {
  const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

  const progressExample = [

    { title: '', color: 'success' },
    { title: 'Recent Activity', color: 'success' },
    // { title: 'Unique', value: '24.093 Users', percent: 40, color: 'info' },
    // // { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    // { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    // { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const progressGroupExample1 = [
    { title: 'Monday', value1: 34, value2: 78 },
    { title: 'Tuesday', value1: 56, value2: 94 },
    { title: 'Wednesday', value1: 12, value2: 67 },
    { title: 'Thursday', value1: 43, value2: 91 },
    { title: 'Friday', value1: 22, value2: 73 },
    { title: 'Saturday', value1: 53, value2: 82 },
    { title: 'Sunday', value1: 9, value2: 69 },
  ]

  const progressGroupExample2 = [
    { title: 'Male', icon: cilUser, value: 53 },
    { title: 'Female', icon: cilUserFemale, value: 43 },
  ]

  const progressGroupExample3 = [
    { title: 'Organic Search', icon: cibGoogle, percent: 56, value: '191,235' },
    { title: 'Facebook', icon: cibFacebook, percent: 15, value: '51,223' },
    { title: 'Twitter', icon: cibTwitter, percent: 11, value: '37,564' },
    { title: 'LinkedIn', icon: cibLinkedin, percent: 8, value: '27,319' },
  ]

  const tableExample = [
    {
      avatar: { src: avatar1, status: 'success' },
      user: {
        name: 'Yiorgos Avraamu',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'USA', flag: cifUs },
      usage: {
        value: 50,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Mastercard', icon: cibCcMastercard },
      activity: '10 sec ago',
    },
    {
      avatar: { src: avatar2, status: 'danger' },
      user: {
        name: 'Avram Tarasios',
        new: false,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Brazil', flag: cifBr },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'info',
      },
      payment: { name: 'Visa', icon: cibCcVisa },
      activity: '5 minutes ago',
    },
    {
      avatar: { src: avatar3, status: 'warning' },
      user: { name: 'Quintin Ed', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'India', flag: cifIn },
      usage: {
        value: 74,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'warning',
      },
      payment: { name: 'Stripe', icon: cibCcStripe },
      
      activity: '1 hour ago',
    },
    {
      avatar: { src: avatar4, status: 'secondary' },
      user: { name: 'En??as Kwadwo', new: true, registered: 'Jan 1, 2021' },
      country: { name: 'France', flag: cifFr },
      usage: {
        value: 98,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'danger',
      },
      payment: { name: 'PayPal', icon: cibCcPaypal },
      activity: 'Last month',
    },
    {
      avatar: { src: avatar5, status: 'success' },
      user: {
        name: 'Agapetus Tade????',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Spain', flag: cifEs },
      usage: {
        value: 22,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'primary',
      },
      payment: { name: 'Google Wallet', icon: cibCcApplePay },
      activity: 'Last week',
    },
    {
      avatar: { src: avatar6, status: 'danger' },
      user: {
        name: 'Friderik D??vid',
        new: true,
        registered: 'Jan 1, 2021',
      },
      country: { name: 'Poland', flag: cifPl },
      usage: {
        value: 43,
        period: 'Jun 11, 2021 - Jul 10, 2021',
        color: 'success',
      },
      payment: { name: 'Amex', icon: cibCcAmex },
      activity: 'Last week',
    },
  ]

  return (
    <>
      <WidgetsDropdown />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
          <CCol sm={12} lg={6}>
          <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                     
                    </CTableHeaderCell>

                    <CTableHeaderCell>TODAY ACTIVITY</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
            <CWidgetStatsA
              className="mb-4"
              
              value={
                <>
                  
                  {/* 26K */}
                  {''}
                  
                  
                 
                  <span className="fs-6 fw-normal">
                    {/* (-12.4% <CIcon icon={cilArrowBottom} />) */}
                  </span>
                </>
              }
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Remove</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
              
              chart={
                <CChartLine
                  
                />
              }
            />
            
            
          </CCol>
          
          <CCol sm={12} lg={6}>
          <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    
                    <CTableHeaderCell className="text-center">
                    </CTableHeaderCell>
                    <CTableHeaderCell>Project</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Date</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Start Time</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Stop Time</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Duration</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
              <CWidgetStatsA
              className="mb-4"
              
              value={
                <>
                  
                  {/* 26K */}
                  {''}
                  
                  
                 
                  <span className="fs-6 fw-normal">
                    {/* (-12.4% <CIcon icon={cilArrowBottom} />) */}
                  </span>
                </>
              }
              
              
              chart={
                <CChartLine
                  
                />
              }
            />
            
          </CCol>
          <CCol sm={12} lg={6}>
          <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                     
                    </CTableHeaderCell>
                      <CTableHeaderCell >TO-DOS</CTableHeaderCell>
                      <CTableHeaderCell className="text-center"></CTableHeaderCell>
                      <CTableHeaderCell className="text-center"></CTableHeaderCell>
                      <CTableHeaderCell className="text-center">TIME</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
            <CWidgetStatsA
              className="mb-4"
              
              value={
                <>
                  
                  {/* 26K */}
                  {''}
                  
                  
                 
                  <span className="fs-6 fw-normal">
                    {/* (-12.4% <CIcon icon={cilArrowBottom} />) */}
                  </span>
                </>
              }
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Remove</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
              
              chart={
                <CChartLine
                  
                />
              }
            />
            
            
          </CCol>
          
          <CCol sm={12} lg={6}>
          <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    
                    <CTableHeaderCell className="text-center">
                    </CTableHeaderCell>
                    <CTableHeaderCell>Project</CTableHeaderCell>
                    <CTableHeaderCell className="text-center"></CTableHeaderCell>
                    <CTableHeaderCell className="text-center"></CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
              <CWidgetStatsA
              className="mb-4"
              
              value={
                <>
                  
                  {/* 26K */}
                  {''}
                  
                  
                 
                  <span className="fs-6 fw-normal">
                    {/* (-12.4% <CIcon icon={cilArrowBottom} />) */}
                  </span>
                </>
              }
              
              
              chart={
                <CChartLine
                  
                />
              }
            />
            
          </CCol>
          <CCol sm={12} lg={6}>
          <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                     
                    </CTableHeaderCell>

                    <CTableHeaderCell>THIS WEEK</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
            <CWidgetStatsA
              className="mb-4"
              
              value={
                <>
                  
                  {/* 26K */}
                  {''}
                  
                  
                 
                  <span className="fs-6 fw-normal">
                    {/* (-12.4% <CIcon icon={cilArrowBottom} />) */}
                  </span>
                </>
              }
              action={
                <CDropdown alignment="end">
                  <CDropdownToggle color="transparent" caret={false} className="p-0">
                    <CIcon icon={cilOptions} className="text-high-emphasis-inverse" />
                  </CDropdownToggle>
                  <CDropdownMenu>
                    <CDropdownItem>Remove</CDropdownItem>
                  </CDropdownMenu>
                </CDropdown>
              }
              
              chart={
                <CChartLine
                  
                />
              }
            />
            
            
          </CCol>
          
          <CCol sm={12} lg={6}>
          <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    
                    <CTableHeaderCell className="text-center">
                    </CTableHeaderCell>
                    <CTableHeaderCell >App or Site</CTableHeaderCell>
                    <CTableHeaderCell className="text-center"></CTableHeaderCell>
                    <CTableHeaderCell className="text-center"></CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Time</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
              <CWidgetStatsA
              className="mb-4"
              
              value={
                <>
                  
                  {/* 26K */}
                  {''}
                  
                  
                 
                  <span className="fs-6 fw-normal">
                    {/* (-12.4% <CIcon icon={cilArrowBottom} />) */}
                  </span>
                </>
              }
              
              
              chart={
                <CChartLine
                  
                />
              }
            />
            
          </CCol>
          </CRow>
          
          
        </CCardBody>
      </CCard>


    </>
  )
}

export default Dashboard
