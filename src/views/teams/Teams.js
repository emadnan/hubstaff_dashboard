import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Button, Modal } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const Team = () => {

  //Variable Declarations
  const [team_name, setTeamName] = useState("");
  const [description, setDescription] = useState("");
  const [teams, setTeams] = useState([]);
  const [byteam, setTeamById] = useState([]);
  var filteredUsers = [];

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'));
  const permissions = local.permissions;
  const perm = permissions.map(permission => ({
    name: permission.name,
  }));

  //Role & Permissions check
  const isCreateButtonEnabled = perm.some(item => item.name === 'Create_Team');

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

  const mystyle2 = {
    backgroundColor: "white ",
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
    addTeam()
    setIsModalOpen(false);
    setTeamName('');
    setDescription('');
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setTeamName('');
    setDescription('');
  };

  // Functions for Delete Team Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = (id) => {
    setIsModalOpen2(id);
  };

  const handleOk2 = () => {
    deleteTeam(isModalOpen2);
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  // Functions for Update Team Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const showModal3 = (id) => {
    getTeamById(id);
    setIsModalOpen3(id);
  };

  const handleOk3 = () => {
    updateTeam(isModalOpen3);
    setIsModalOpen3(false);
    setTeamName('');
    setDescription('');
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
    setTeamName('');
    setDescription('');
  };

  //Initial rendering through useEffect
  useEffect(() => {
    getTeams();
  }, []);

  function getTeams() {
    fetch("http://10.3.3.80/api/get_teams")
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === "1") {
          filteredUsers = data.Teams;
        }
        else if (local.Users.role === "3") {
          filteredUsers = data.Teams.filter((tem) => tem.team_company_id === local.Users.company_id);
        }
        setTeams(filteredUsers);
      })
      .catch((error) => console.log(error));
  };

  function getTeamById(id) {
    fetch(`http://10.3.3.80/api/getTeam/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTeamById(data.Team);
        setTeamName(data.Team[0].team_name);
        setDescription(data.Team[0].description);
      })
      .catch((error) => console.log(error));
  };

  // Add API call
  async function addTeam() {
    let addteam = { team_name, team_company_id: local.Users.company_id, description }
    await fetch("http://10.3.3.80/api/add_team",
      {
        method: 'POST',
        body: JSON.stringify(addteam),
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(response => {
        if (response.ok) {
          handleButtonClick1();
          getTeams()
        } else {
          handleButtonClick2();
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  // Delete API call
  async function deleteTeam(newid) {
    await fetch(`http://10.3.3.80/api/delete_team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick3();
        getTeams()
      } else {
        handleButtonClick4();
      }
    })
      .catch(error => {
        console.error(error);
      });

  }

  // Update API call
  async function updateTeam(newid) {
    await fetch('http://10.3.3.80/api/updateteam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid,
        team_name: team_name,
        description: description,
        team_company_id: local.Users.company_id,
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick5();
        getTeams()
      } else {
        handleButtonClick6();
      }
    })
      .catch(error => {
        console.error(error);
      });
  }

  // Functions for Add Team Success
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

  // Functions for Add Team Failure
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

  // Functions for Delete Team Success
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

  // Functions for Delete Team Failure
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

  // Functions for Update Team Success
  const [showAlert5, setShowAlert5] = useState(false);

  function handleButtonClick5() {
    setShowAlert5(true);
  }

  function handleCloseAlert5() {
    setShowAlert5(false);
  }

  useEffect(() => {
    if (showAlert5) {
      const timer = setTimeout(() => {
        setShowAlert5(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert5]);

  // Functions for Update Team Failure
  const [showAlert6, setShowAlert6] = useState(false);

  function handleButtonClick6() {
    setShowAlert6(true);
  }

  function handleCloseAlert6() {
    setShowAlert6(false);
  }

  useEffect(() => {
    if (showAlert6) {
      const timer = setTimeout(() => {
        setShowAlert6(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert6]);

  return (
    <>
      <div className='row'>
        <div className='col-md 6'>
          <h3>Teams</h3>
        </div>
        <div className='col-md 6'>
          {/* Add Teams Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Team</Button>
          ) : null}
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
            <CTableHeaderCell className="text-center" style={mystyle}>Assign Team</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}
          {teams.map((tem, index) => (
            <CTableRow key={tem.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>{tem.team_name}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>{tem.description}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}></CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                <IconButton aria-label="update" onClick={() => showModal3(tem.id)}>
                  <EditIcon htmlColor='#28B463' />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => showModal2(tem.id)}>
                  <DeleteIcon htmlColor='#FF0000' />
                </IconButton>
              </CTableHeaderCell>
            </CTableRow>
          ))}
        </CTableHead>
        <CTableBody>

          {/* Modal for Add Team */}
          <Modal title="Add a Team" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle} maskClosable={false}>

            <br></br>

            <div className="form-outline mb-3">
              <label>Team Name</label>
              <input
                type="text"
                value={team_name}
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

          {/* Modal for Update Team */}
          <Modal title="Update a Team" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} style={modalStyle} maskClosable={false}>
            <br></br>
            {
              byteam.map((tem) => (
                <div key={tem.id}>

                  <div className="form-outline mb-3">
                    <label>Team Name</label>
                    <input
                      type="text"
                      defaultValue={tem.team_name}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Team Name"
                    />
                  </div>

                  <div className="form-outline mb-3">
                    <label>Description</label>
                    <input
                      type="text"
                      defaultValue={tem.description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Description"
                    />
                  </div>

                </div>
              ))
            }
          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
          </Modal>

          {/* Alert for Add Team Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              Team Added Successfully
            </Alert>
          )}

          {/* Alert for Add Team Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Add Team
            </Alert>
          )}

          {/* Alert for Delete Team Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Team Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Team Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Delete Team
            </Alert>
          )}

          {/* Alert for Update Team Success*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Team Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Team Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Team
            </Alert>
          )}

        </CTableBody>
      </CTable>
    </>
  );
}

export default Team;
