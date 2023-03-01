import React from 'react'
import {
  CRow,
  CCol,
  CDropdown,
  CDropdownMenu,
  CDropdownItem,
  CDropdownToggle,
  CWidgetStatsA,
  CFormTextarea,
} from '@coreui/react'
import { getStyle } from '@coreui/utils'
import { CChartBar, CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilArrowBottom, cilArrowTop, cilOptions } from '@coreui/icons'

const WidgetsDropdown = () => {
  return (
    <div className="card">
      <div style={{ padding: '10px' }}>
      <CRow>
        <CCol sm={3} lg={2}>
          <CWidgetStatsA
            className="mb-2"
            color="secondary"
            value={
              <>
                <p>{'Project Worked'}</p>
                <span className="fs-6 fw-normal">
                </span>
              </>
            }
            title="12"
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
                className="mt-3 mx-3"
              />
            }
          />
        </CCol>
        <CCol sm={3} lg={2}>
          <CWidgetStatsA
            className="mb-2"
            color="info"
            value={
              <>
                <p>{'Today Activity'}</p>
                <span className="fs-6 fw-normal">
                </span>
              </>
            }
            title="12"
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
                className="mt-3 mx-3"
              />
            }
          />
        </CCol>
        <CCol sm={3} lg={2}>
          <CWidgetStatsA
            className="mb-2"
            color="info"
            value={
              <>
                <p>{'Today Worked'}</p>
                <span className="fs-6 fw-normal">
                </span>
              </>
            }
            title="12"
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
                className="mt-3 mx-3"
              />
            }
          />
        </CCol>
        <CCol sm={3} lg={2}>
          <CWidgetStatsA
            className="mb-2"
            color="warning"
            value={
              <>
                <p>{'Weekly Activity'}</p>
                <span className="fs-6 fw-normal">
                </span>
              </>
            }
            title="12"
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
                className="mt-3 mx-3"
              />
            }
          />
        </CCol>
        <CCol sm={3} lg={2}>
          <CWidgetStatsA
            className="mb-2"
            color="warning"
            value={
              <>
                <p>{'Weekly Worked'}</p>
                <span className="fs-6 fw-normal">
                </span>
              </>
            }
            title="12"
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
                className="mt-3 mx-3"
              />
            }
          />
        </CCol>
        <CCol sm={3} lg={2}>
          <CWidgetStatsA
            className="mb-2"
            color="danger"
            value={
              <>
                <p>{'Earned Amount'}</p>
                <span className="fs-6 fw-normal">
                </span>

              </>

            }
            title="12"
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
                className="mt-3 mx-3"
              />
            }
          />
        </CCol>
      </CRow>
    </div>
    </div>
  )
}

export default WidgetsDropdown
