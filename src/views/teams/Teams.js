import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState } from 'react';
import { Button, Modal } from 'antd';

const Team = () => {

  //Variable Declarations
  const [teamname, setTeamName] = useState("");
  const [description, setDescription] = useState("");

  //CSS Styling
  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const buttonStyle = {
    float: "right",
    padding: "2px",
    width: "120px",
    backgroundColor: "white",
    fontWeight: "bold",
    color: "#0070ff",
  };

  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
  };

  const modalStyle2 = {
    position: "fixed",
    top: "10%",
    left: "55%",
    transform: "translateX(-50%)",
  };

  // Functions for Add Team Modal
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

  return (
    <>
      <div className='row'>
        <div className='col-md 6'>
          <h3>Teams</h3>
        </div>
        <div className='col-md 6'>
          {/* Add Teams Button */}
          {/* {isCreateButtonEnabled ? ( */}
          <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Team</Button>
          {/* ) : null} */}
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light" >

          {/* Teams table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Team Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Description</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Assign Members</CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}
          {/* {users.map((user, index) => (
                        <CTableRow key={user.id}>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{user.name}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{user.email}</CTableHeaderCell>
                            {
                                local.Users.role === "1" ? (
                                    <CTableHeaderCell className="text-center" style={mystyle2}>{user.role}</CTableHeaderCell>
                                ) : null
                            }
                            {isEditButtonEnabled || isDeleteButtonEnabled ? (
                                <CTableHeaderCell className="text-center" style={mystyle2}>
                                    {isEditButtonEnabled ? (
                                        <IconButton aria-label="update" onClick={() => showModal3(user.id)}>
                                            <EditIcon htmlColor='#28B463' />
                                        </IconButton>
                                    ) : null}
                                    {isDeleteButtonEnabled ? (
                                        <IconButton aria-label="delete" onClick={() => showModal2(user.id)}>
                                            <DeleteIcon htmlColor='#FF0000' />
                                        </IconButton>
                                    ) : null}
                                </CTableHeaderCell>
                            ) : null}
                        </CTableRow>
                    ))} */}
        </CTableHead>
        <CTableBody>

          {/* Modal for Add Team */}
          <Modal title="Add a Team" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle2}>

            <br></br>

            <div className="form-outline mb-3">
              <label>Team Name</label>
              <input
                type="text"
                value={teamname}
                onChange={(e) => setTeamName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Team Name"
              />
            </div>

            <div className="form-outline mb-3">
              <label>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Description"
              />
            </div>

          </Modal>

          {/* Modal for Deletion Confirmation */}
          {/* <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
                    </Modal> */}

        </CTableBody>
      </CTable>
    </>
  );
}

export default Team;
