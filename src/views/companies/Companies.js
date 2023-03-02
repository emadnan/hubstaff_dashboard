import {
    CTable,
    CTableBody,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
  } from '@coreui/react'
  
  import React from 'react';
  
  const Companies = () => {
    return (
      <div className="card">
       
        <div className="card-body">
          
          <a href="/showModal" className="btn btn-primary" style={{ marginLeft: '90%' }}>Add a Company</a>
          
          <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                  <CTableHead color="light" >
                    <CTableRow>
                      
                      <CTableHeaderCell className="text-center">
                      </CTableHeaderCell>

                      <CTableHeaderCell>SR_NO</CTableHeaderCell>
                      <CTableHeaderCell>company_name</CTableHeaderCell>
                      <CTableHeaderCell>address</CTableHeaderCell>
                      <CTableHeaderCell>company_eamil</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">contact_no</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">city</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">country</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    
                  </CTableBody>
                </CTable>
        </div>
      </div>
      
    );
  }
  
  export default Companies;