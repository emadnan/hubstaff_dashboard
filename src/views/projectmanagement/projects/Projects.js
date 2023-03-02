
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,

} from '@coreui/react'

import React from 'react';

const Projects = () => {
  return (
    <div className="card">
     
      <div className="card-body">
        
        <a href="#" className="btn btn-primary" style={{ marginLeft: '85%' }}>Add a Project</a>
        <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                <CTableHead color="light" >
                  <CTableRow>
                    
                    <CTableHeaderCell className="text-center">
                    </CTableHeaderCell>
                    
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Teams</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Members</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">TO-DOS</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Budget</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                </CTableBody>
              </CTable>
      </div>
    </div>
  );
}

export default Projects;
