import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { React, useState} from 'react';
import { Modal, Button} from 'antd';

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

  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const buttonStyle = {
    marginLeft: '85%',
  };

  return (
    <div className="card">

      <div className="card-body">
      <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Team</Button>
        <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
          <CTableHead color="light" >
            <CTableRow>
              <CTableHeaderCell className="text-center" style={mystyle}>Name</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>Members</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>Projects</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>

            <Modal title="Add a Team" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

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
