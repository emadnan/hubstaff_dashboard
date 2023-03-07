import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

const Team = () => {

  const [team_name, setTeamName] = useState("");
  const [members, setMembers] = useState("");
  const [projects, setProjects] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    // addUser()
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
  };

  return (
    <div className="card">

      <div className="card-body">

        <a href="#" className="btn btn-primary" style={{ marginLeft: '85%' }} onClick={showModal}>Add a Team</a>
        <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
          <CTableHead color="light" >
            <CTableRow>

              <CTableHeaderCell className="text-center">
              </CTableHeaderCell>

              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell className="text-center"></CTableHeaderCell>
              <CTableHeaderCell className="text-center">Members</CTableHeaderCell>
              <CTableHeaderCell className="text-center"></CTableHeaderCell>
              <CTableHeaderCell className="text-center">Projects</CTableHeaderCell>
              <CTableHeaderCell className="text-center"></CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>

            <Modal title="Add a Project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

              <div className="form-outline mb-3">
                <input
                  type="text"
                  value={team_name}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Team Name"
                />
              </div>

              <div className="form-outline mb-3">
                <input
                  type="text"
                  value={members}
                  onChange={(e) => setMembers(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Member"
                />
              </div>

              <div className="form-outline mb-3">
                <input
                  type="text"
                  value={projects}
                  onChange={(e) => setProjects(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Project Name"
                />
              </div>

            </Modal>

          </CTableBody>
        </CTable>
      </div>
    </div>
  );
}

export default Team;
