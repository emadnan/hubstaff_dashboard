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
                      <CTableHeaderCell className="text-center">Company Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Address</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Company Email</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Contact No</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">City</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Country</CTableHeaderCell>
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