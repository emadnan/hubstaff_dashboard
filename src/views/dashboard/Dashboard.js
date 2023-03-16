import React from 'react'
import { CCol, CRow, CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CWidgetStatsA } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

const Dashboard = () => {

  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  return (
    <>
      <WidgetsDropdown />
      <CRow>
        <CCol sm={12} lg={6}>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead color="light">

              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>ACTIVITY</CTableHeaderCell>
              </CTableRow>

              <CTableRow>
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
                <CTableHeaderCell className="text-center" style={mystyle}>ACTIVITY</CTableHeaderCell>
              </CTableRow>

              <CTableRow>
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
                <CTableHeaderCell className="text-center" style={mystyle}>ACTIVITY</CTableHeaderCell>
              </CTableRow>

              <CTableRow>
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
                <CTableHeaderCell className="text-center" style={mystyle}>ACTIVITY</CTableHeaderCell>
              </CTableRow>

              <CTableRow>
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

            chart={
              <CChartLine

              />
            }
          />


        </CCol>

      </CRow>

    </>
  )
}

export default Dashboard
