
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,

} from '@coreui/react'
import { React, useState } from 'react';

import { Modal } from 'antd';

const Projects = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

  return (
    <div className="card">

      <div className="card-body">

        <a className="btn btn-primary" style={{ marginLeft: '85%' }} onClick={showModal}>Add a Project</a>
        <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
          <CTableHead color="light" >
            <CTableRow>

              <CTableHeaderCell className="text-center">
              </CTableHeaderCell>

              <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Teams</CTableHeaderCell>
              <CTableHeaderCell className="text-center">TO-DOS</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Budget</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Start</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Deadline</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Modal>
          </CTableBody>
        </CTable>
      </div>
    </div>
  );
}

export default Projects;
