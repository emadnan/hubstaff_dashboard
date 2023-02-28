
import {
    CAvatar,
    CButton,
    CButtonGroup,
    CCard,
    CCardBody,
    CCardFooter,
    CCardHeader,
    CCol,
    CProgress,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CDropdown,
    CDropdownMenu,
    CDropdownItem,
    CDropdownToggle,
    CWidgetStatsA,
  } from '@coreui/react'
  
  import React from 'react';
  
  const Card = () => {
    return (
      <div className="card">
       
        <div className="card-body">
          
          <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                  <CTableHead color="light" >
                    <CTableRow>
                      
                      <CTableHeaderCell className="text-center">
                      </CTableHeaderCell>
                      
                      <CTableHeaderCell>Project</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">App Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center"></CTableHeaderCell>
                      <CTableHeaderCell className="text-center"></CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Time spent (hrs)</CTableHeaderCell>
                      <CTableHeaderCell className="text-center"></CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Sessions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    
                  </CTableBody>
                </CTable>
        </div>
      </div>
    );
  }
  
  export default Card;
  