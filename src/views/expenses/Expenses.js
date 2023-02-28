
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
        
        <a href="#" className="btn btn-primary" style={{ marginLeft: '85%' }}>Add a Expense</a>
        <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >
                  <CTableRow>
                    
                    <CTableHeaderCell className="text-center">
                    </CTableHeaderCell>
                    
                    <CTableHeaderCell>Member</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Date</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Description</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Amount</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Category</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Project</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
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
