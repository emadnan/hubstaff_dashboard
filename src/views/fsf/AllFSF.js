import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button, Modal, Checkbox, Divider, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'
const BASE_URL = process.env.REACT_APP_BASE_URL

function AllFSF() {

  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions;
  const perm = permissions.map(permission => ({
    name: permission.name,
  }));

  useEffect(() => {
    getFsfonTeamLeadId(local.token);
  }, []);

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some(item => item.name === 'Create_Fsf');

  const navigate = useNavigate();
  const [fsf, setFsf] = useState([]);
  const [fsfbyid, setFsfById] = useState([]);
  const [fsfonTeamId, setFsfOnTeamId] = useState([]);
  const [members, setMembers] = useState([]);
  const [hasmembers, setHasMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  var filteredUsers = [];

  //CSS Stylings
  const buttonStyle = {
    float: "right",
    padding: "2px",
    width: "120px",
    backgroundColor: "white",
    fontWeight: "bold",
    color: "#0070ff",
  };

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  };

  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const modalStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  };

  const mystyle2 = {
    backgroundColor: "white ",
  };

  const perStyle = {
    fontSize: 14,
  };

  const headStyle = {
    color: "#0070ff",
    fontWeight: "bold",
  };

  const modalStyle2 = {
    position: "fixed",
    top: "10%",
    left: "55%",
    transform: "translateX(-50%)",
  };

  //Function for checkbox handling
  const handleSelectUser = (e, permId) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, permId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== permId));
    }
  };

  //GET API calls
  function getFsf() {
    fetch(`${BASE_URL}/api/getFunctionalSpecificationForm`)
      .then((response) => response.json())
      .then((data) => setFsf(data.Functional))
      .catch((error) => console.log(error));
  };

  function getFsfById(id) {
    fetch(`${BASE_URL}/api/getFunctionalSpecificationFormById?fsf=${id}`)
      .then((response) => response.json())
      .then((data) => setFsfById(data.Functional))
      .catch((error) => console.log(error));
  };

  function getMembers() {
    fetch(`${BASE_URL}/api/getUsersByRoleId/5`)
      .then((response) => response.json())
      .then((data) => setMembers(data.User))
      .catch((error) => console.log(error));
  };

  function getFsfonTeamLeadId(token) {
    fetch(`${BASE_URL}/api/getFunctionalSpecificationFormByTeamLeadId`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 6) {
          filteredUsers = data.Functional
        } else if (local.Users.role === 7) {
          filteredUsers = data.Functional.filter((user) => user.team_lead_id === local.Users.user_id);
        }
        setFsfOnTeamId(filteredUsers)
      })
      .catch((error) => console.log(error));
  };

  function getHasMembers(id) {
    fetch(`${BASE_URL}/api/getFsfAssignToUsersByFsfId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        const temp_array = data.fsf_Assign_to_users.map(element => element.user_id);
        setHasMembers(temp_array);
        console.log(temp_array);
      })
      .catch((error) => console.log(error));
  };

  //Initial rendering through useEffect
  useEffect(() => {
    getFsf();
    getMembers();
  }, []);

  useEffect(() => {
    setSelectedUsers(hasmembers);
  }, [hasmembers]);

  // Functions for Delete FSF Success
  const [showAlert1, setShowAlert1] = useState(false);

  function handleButtonClick1() {
    setShowAlert1(true);
  }

  function handleCloseAlert1() {
    setShowAlert1(false);
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert1]);

  // Functions for Delete FSF Failure
  const [showAlert2, setShowAlert2] = useState(false);

  function handleButtonClick2() {
    setShowAlert2(true);
  }

  function handleCloseAlert2() {
    setShowAlert2(false);
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert2]);

  // Functions for Assign Members Success
  const [showAlert3, setShowAlert3] = useState(false);

  function handleButtonClick3() {
    setShowAlert3(true);
  }

  function handleCloseAlert3() {
    setShowAlert3(false);
  }

  useEffect(() => {
    if (showAlert3) {
      const timer = setTimeout(() => {
        setShowAlert3(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert3]);

  // Functions for Assign Members Failure
  const [showAlert4, setShowAlert4] = useState(false);

  function handleButtonClick4() {
    setShowAlert4(true);
  }

  function handleCloseAlert4() {
    setShowAlert4(false);
  }

  useEffect(() => {
    if (showAlert4) {
      const timer = setTimeout(() => {
        setShowAlert4(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert4]);

  // Functions for View FSF Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = (id) => {
    getFsfById(id)
    setIsModalOpen(id)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }


  // Functions for Delete FSF Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const showModal3 = (id) => {
    setIsModalOpen3(id);
  };

  const handleOk3 = () => {
    deleteFsf(isModalOpen3);
    setIsModalOpen3(false);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  // Functions for Assign Users Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const showModal4 = (id) => {
    getHasMembers(id)
    setIsModalOpen4(id);
  };

  const handleOk4 = () => {
    assignMembers(isModalOpen4)
    setIsModalOpen4(false);
  };

  const handleCancel4 = () => {
    setIsModalOpen4(false);
  };

  // API Calls through Fetch
  async function deleteFsf(newid) {
    await fetch(`${BASE_URL}/api/deleteFunctionalSpecificationForm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick1();
        getFsf()
      } else {
        handleButtonClick2();
      }
    })
      .catch(error => {
        console.error(error);
      });
  };

  async function assignMembers(newid) {
    await fetch(`${BASE_URL}/api/fsfAssignToUsers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fsf_id: newid,
        user_ids: selectedUsers,
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick3();
        getMembers()
      } else {
        handleButtonClick4();
      }
    })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
      <div className='row'>
        <div className='col-md 6'>
          <h3>Functional Specification Form</h3>
        </div>
        <div className='col-md 6'>
          {/* Add FSF Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={async () => {
              await navigate("/fsfform");
            }}>Add FSF</Button>
          ) : null}
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light" >

          {/* FSF table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>WRICEF ID</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Functional</CTableHeaderCell>
            {
              local.Users.role === 7 ? (
                <CTableHeaderCell className="text-center" style={mystyle}>Assign</CTableHeaderCell>
              ) : null
            }
            {
              local.Users.role === 7 ? (
                <CTableHeaderCell className="text-center" style={mystyle}>View</CTableHeaderCell>
              ) : null
            }
            {
              local.Users.role === 6 ? (
                <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
              ) : null
            }
          </CTableRow>

          {fsfonTeamId.map((fsf, index) => (
            <CTableRow key={fsf.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>{fsf.wricef_id}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>{fsf.name}</CTableHeaderCell>
              {
                local.Users.role === 7 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton aria-label="assign" title="Assign Members" onClick={() => showModal4(fsf.id)}>
                      <PermContactCalendarIcon htmlColor="#0070ff" />
                    </IconButton>
                  </CTableHeaderCell>

                ) : null
              }
              {
                local.Users.role === 7 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton aria-label="view" title='View FSF' onClick={() => showModal(fsf.id)}>
                      <VisibilityIcon htmlColor="#28B463" />
                    </IconButton>
                  </CTableHeaderCell>
                ) : null
              }
              {
                local.Users.role === 6 ? (
                  <CTableHeaderCell className="text-center" style={mystyle2}>
                    <IconButton aria-label="update">
                      <EditIcon htmlColor='#28B463' />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => showModal3(fsf.id)}>
                      <DeleteIcon htmlColor='#FF0000' />
                    </IconButton>
                  </CTableHeaderCell>
                ) : null
              }
            </CTableRow>
          ))}

        </CTableHead>

        <CTableBody>

          {/* Modal for Assign Permissions */}
          <Modal title="Assign Members" open={isModalOpen4} onOk={handleOk4} okButtonProps={{ style: { background: 'blue' } }} onCancel={handleCancel4}>

            <br></br>
            <div className='row'>
              <div className='col md-2 text-center'>
                <h6>Sr/No</h6>
              </div>
              <div className='col md-3'></div>
              <div className='col md-2 text-center'>
                <h6>Members</h6>
              </div>
              <div className='col md-3'></div>
              <div className='col md-2 text-center'>
                <h6 style={heading}>Select</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>

            <div>
              {members.map((mem, index) => (
                <div className='row' key={mem.id}>
                  <div className='col md-2 text-center'>
                    <h6>{index + 1}</h6>
                  </div>
                  <div className='col md-3'></div>
                  <div className='col md-2 text-center'>
                    <h6>{mem.name}</h6>
                  </div>
                  <div className='col md-3'></div>
                  <div className='col md-2 text-center'>
                    <Checkbox
                      checked={selectedUsers.includes(mem.id)}
                      onChange={(e) => handleSelectUser(e, mem.id)}
                    />
                  </div>
                  &nbsp;
                  <Divider />
                </div>
              ))}
            </div>
          </Modal>

          {/* Modal for View FSF Details */}
          <Modal
            title={<div style={{ textAlign: 'center' }}>FSF Details</div>}
            open={isModalOpen}
            onOk={handleOk}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel}
            style={modalStyle}
            width={800}
          >
            {fsfbyid.map((fsf) => {
              return (
                <div key={fsf.id}>
                  <br></br>
                  <h6 style={perStyle}>WRICEF ID</h6>
                  <p>{fsf.wricef_id}</p>
                  <h6 style={perStyle}>Module Name</h6>
                  <p>{fsf.module_name}</p>
                  <h6 style={perStyle}>Team Lead</h6>
                  <p>{fsf.team_lead_details.name}</p>
                  <h6 style={perStyle}>Requested Date</h6>
                  <p>{fsf.requested_date}</p>
                  <h6 style={perStyle}>Type of Development</h6>
                  <p>{fsf.type_of_development}</p>
                  <h6 style={perStyle}>Priority</h6>
                  <p>{fsf.priority}</p>
                  <h6 style={perStyle}>Usage Frequency</h6>
                  <p>{fsf.usage_frequency}</p>
                  <h6 style={perStyle}>Transaction Code</h6>
                  <p>{fsf.transaction_code}</p>
                  <h6 style={perStyle}>Authorization Level</h6>
                  <p>{fsf.authorization_level}</p>

                  <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
                    <CTableHead color="light" >

                      {/* FSF table heading */}
                      <CTableRow>
                        <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Description</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Field Technical Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Field Length</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Field Type</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Field Table Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>M/O</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>P/S</CTableHeaderCell>
                      </CTableRow>

                      {fsf.get_fsf_parameter.map((param, index) => (
                        <CTableRow key={param.id}>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{param.description}</CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{param.field_technical_name}</CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{param.field_length}</CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{param.field_type}</CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{param.field_table_name}</CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{param.mandatory_or_optional}</CTableHeaderCell>
                          <CTableHeaderCell className="text-center" style={mystyle2}>{param.parameter_or_selection}</CTableHeaderCell>
                        </CTableRow>
                      ))}

                    </CTableHead>
                    <CTableBody>
                    </CTableBody>
                  </CTable>
                </div>
              );
            })}
          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal title="Are you sure you want to delete?" open={isModalOpen3} onOk={handleOk3} okButtonProps={{ style: { background: 'blue' } }} onCancel={handleCancel3} style={modalStyle}>
          </Modal>

          {/* Alert for Add Company Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              FSF Deleted Successfully
            </Alert>
          )}

          {/* Alert for Add Company Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Delete FSF
            </Alert>
          )}

          {/* Alert for  Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Members Assigned Successfully
            </Alert>
          )}

          {/* Alert for Assign Members Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Assign Members
            </Alert>
          )}

        </CTableBody>
      </CTable>
    </>
  )
}

export default AllFSF