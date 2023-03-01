
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import React from 'react';

const Card = () => {
  return (
    <div className="card">
     
      <div className="card-body">
        
        <a href="#" className="btn btn-primary" style={{ marginLeft: '85%' }}>Add a Client</a>
        
        <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >
                  <CTableRow>
                    
                    <CTableHeaderCell className="text-center">
                    </CTableHeaderCell>
                    
                    <CTableHeaderCell>Client List</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Project</CTableHeaderCell>
                    <CTableHeaderCell className="text-center"></CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Invoicing</CTableHeaderCell>
                    <CTableHeaderCell className="text-center"></CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Project Status</CTableHeaderCell>
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
