import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button, Select, Form, Divider, Checkbox } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

const Projects = () => {

  // Variable declarations
  // const [user_id, setUserId] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [company_id, setCompanyId] = useState("");
  const [project_name, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [start_date, setStartDate] = useState("");
  const [dead_line, setDeadLine] = useState("");
  const [team_id, setTeamId] = useState("");
  const [to_dos, setTodos] = useState("");
  const [budget, setBudget] = useState("");
  const [stream_id, setStreamId] = useState("");
  const [date] = useState("");


  const [selectedUsers, setSelectedUsers] = useState([]);

  // CSS Styling
  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
  };

  const perStyle = {
    fontSize: 14,
  };

  const headStyle = {
    color: "#0070ff",
    fontWeight: "bold",
  };

  const headStyle2 = {
    color: "#black",
    fontWeight: "bold",
  };

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  };

  const modalStyle2 = {
    position: "fixed",
    top: "10%",
    left: "55%",
    transform: "translateX(-50%)",
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
    float: "right",
    padding: "2px",
    width: "120px",
    backgroundColor: "white",
    fontWeight: "bold",
    color: "#0070ff",
  };

  const linkStyle = {
    color: "#0070ff",
  }

  const buttonStyle2 = {
    padding: "2px",
    width: "100px",
    backgroundColor: "#0070ff",
    fontWeight: "bold",
    color: "white",
  };

  // Functions for Add Project Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    addProject();
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Functions for Delete Project Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = (id) => {
    setIsModalOpen2(id);
  };

  const handleOk2 = () => {
    deleteProject(isModalOpen2);
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  // Functions for Update Project Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const showModal3 = (id) => {
    getProjectById(id)
    setIsModalOpen3(id);
  };

  const handleOk3 = () => {
    updateProject(isModalOpen3);
    setIsModalOpen3(false);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  // Functions for Assign Users Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false);
  const showModal4 = (id) => {
    setStreamId(id);
    setIsModalOpen4(id);
  };

  const handleOk4 = () => {
    addAssignProject(isModalOpen4)
    setIsModalOpen4(false);
  };

  const handleCancel4 = () => {
    setIsModalOpen4(false);
  };

  // Functions for Show Description Modal
  const [isModalOpen5, setIsModalOpen5] = useState(false);
  const showModal5 = (id) => {
    getProjectById(id)
    setIsModalOpen5(id)
  };

  const handleOk5 = () => {
    setIsModalOpen5(false);
  };

  const handleCancel5 = () => {
    setIsModalOpen5(false);
  };

  // Functions for Streams Modal
  const [isModalOpen6, setIsModalOpen6] = useState(false);
  const showModal6 = (id) => {
    getProjectById(id)
    setIsModalOpen6(true)
  };

  const handleOk6 = () => {
    setIsModalOpen6(false);
  };

  const handleCancel6 = () => {
    setIsModalOpen6(false);
  };

  // Functions for Add Project Success
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

  // Functions for Add Project Failure
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

  // Functions for Delete Project Success
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

  // Functions for Delete Project Failure
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

  // Functions for Update Project Success
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

  // Functions for Update Project Failure
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

  // Functions for Assign User Success
  const [showAlert7, setShowAlert7] = useState(false);

  function handleButtonClick7() {
    setShowAlert7(true);
  }

  function handleCloseAlert7() {
    setShowAlert7(false);
  }

  useEffect(() => {
    if (showAlert7) {
      const timer = setTimeout(() => {
        setShowAlert7(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert7]);

  // Functions for Assign User Failure
  const [showAlert8, setShowAlert8] = useState(false);

  function handleButtonClick8() {
    setShowAlert8(true);
  }

  function handleCloseAlert8() {
    setShowAlert8(false);
  }

  useEffect(() => {
    if (showAlert8) {
      const timer = setTimeout(() => {
        setShowAlert8(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert8]);

  //Get calls handling
  const handleCompanyChange = (value) => {
    setCompanyId(value);
  };

  // const handleUserChange = (value) => {
  //   setUserId(value);
  // };

  const handleDepartmentChange = (value) => {
    setDepartmentId(value);
  };

  // const handleTodoChange = (value) => {
  //   setTodos(value);
  // }

  // Get API call
  const [projects, setProjects] = useState([]);
  const [company, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [department, setDepartment] = useState([]);
  const [byproject, setByProject] = useState([]);
  const [stream, setStream] = useState([]);

  useEffect(() => {
    getList()
    getCompany()
    getUsers()
    getDepartment()
    getStreams()
  }, []);

  function getList() {
    fetch("http://10.3.3.80/api/getproject")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.log(error));
  };

  function getProjectById(id) {
    fetch(`http://10.3.3.80/api/get-project-by-project-id/${id}`)
      .then((response) => response.json())
      .then((data) => setByProject(data.projects))
      .catch((error) => console.log(error));
  };

  // Get Companies API call
  function getCompany() {
    fetch("http://10.3.3.80/api/getcompany")
      .then((response) => response.json())
      .then((data) => setCompanies(data.companies))
      .catch((error) => console.log(error));
  };

  // Get Users API call
  function getUsers() {
    fetch("http://10.3.3.80/api/get_users")
      .then((response) => response.json())
      .then((data) => setUsers(data.Users))
      .catch((error) => console.log(error));
  }

  // Get Department API call
  function getDepartment() {
    fetch("http://10.3.3.80/api/getdepartment")
      .then((response) => response.json())
      .then((data) => setDepartment(data.Departments))
      .catch((error) => console.log(error));
  }

  // Get Streams API call
  function getStreams() {
    fetch("http://10.3.3.80/api/get-streams")
      .then((response) => response.json())
      .then((data) => setStream(data.Streams))
      .catch((error) => console.log(error));
  }

  // Add API call
  async function addProject() {
    let user = { department_id, company_id, project_name, description, start_date, dead_line, team_id, to_dos, budget }

    await fetch("http://10.3.3.80/api/add_project",
      {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(response => {
        if (response.ok) {
          handleButtonClick1();
          getList()
        } else {
          handleButtonClick2();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  //Assign users API call
  async function addAssignProject(newid) {
    await fetch('http://10.3.3.80/api/assign_projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        project_id: newid,
        user_ids: selectedUsers,
        stream_id: stream_id,
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick7();
        getList()

      } else {
        handleButtonClick8();
      }
    })
      .catch(error => {
        console.error(error);
      });

  };

  // Delete API call
  async function deleteProject(newid) {
    await fetch('http://10.3.3.80/api/delete-project', {
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
        getList()
      } else {
        handleButtonClick4();
      }
    })
      .catch(error => {
        console.error(error);
      });

  }

  // Update API call
  async function updateProject(newid) {
    await fetch('http://10.3.3.80/api/update-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid,
        department_id: department_id,
        company_id: company_id,
        project_name: project_name,
        description: description,
        start_date: start_date,
        dead_line: dead_line,
        team_id: team_id,
        to_dos: to_dos,
        budget: budget,
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick5();
        getList()
      } else {
        handleButtonClick6();
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
          <h3>Projects</h3>
        </div>
        <div className='col-md 6'>
          {/* Add Project Button */}
          <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Project</Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light" >

          {/* Projects table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Project Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Company Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Department Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Start Date</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>End Date</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Assign</CTableHeaderCell>
          </CTableRow>

          {/* Get API Projects */}
          {projects.map((project, index) => {
            const startDate = new Date(project.start_date).toLocaleDateString();
            const deadline = new Date(project.dead_line).toLocaleDateString();

            return (
              <CTableRow key={project.id}>
                <CTableHeaderCell className="text-center">{index + 1}</CTableHeaderCell>
                <CTableHeaderCell className="text-center">{project.project_name}</CTableHeaderCell>
                <CTableHeaderCell className="text-center">{project.company_name}</CTableHeaderCell>
                <CTableHeaderCell className="text-center">{project.department_name}</CTableHeaderCell>
                <CTableHeaderCell className="text-center">{startDate}</CTableHeaderCell>
                <CTableHeaderCell className="text-center">{deadline}</CTableHeaderCell>
                <CTableHeaderCell className="text-center">
                  <IconButton aria-label="description" onClick={() => showModal5(project.project_id)}>
                    <VisibilityIcon htmlColor='#0070ff' />
                  </IconButton>
                  <IconButton aria-label="update" onClick={() => showModal3(project.project_id)}>
                    <EditIcon htmlColor='#28B463' />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => showModal2(project.project_id)}>
                    <DeleteIcon htmlColor='#FF0000' />
                  </IconButton>
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center">
                  <Button className="btn btn-primary" style={buttonStyle2} onClick={() => showModal6(project.project_id)}>Streams</Button>
                </CTableHeaderCell>
              </CTableRow>
            );
          })}

        </CTableHead>
        <CTableBody>

          {/* Modal for Add Projects */}
          <Modal title="Add a Project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

            <br></br>

            <div className="form-outline mb-3">
              <label>Company</label>
              <Form.Item>
                <Select placeholder="Select Company" onChange={handleCompanyChange} value={company_id}>
                  {company.map((count) => (
                    <Select.Option value={count.name} key={count.id}>
                      {count.company_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-outline mb-3">
              <label>Department</label>
              <Form.Item>
                <Select placeholder="Select Departments" onChange={handleDepartmentChange} value={department_id}>
                  {department.map((count) => (
                    <Select.Option value={count.nnname} key={count.id}>
                      {count.department_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-outline mb-3">
              <label>Project Name</label>
              <input
                type="text"
                value={project_name}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Project Name"
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

            <div className="form-outline mb-3">
              <label>Start Date</label>
              <input
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
              />
            </div>

            <div className="form-outline mb-3">
              <label>End Date</label>
              <input
                type="date"
                value={dead_line}
                onChange={(e) => setDeadLine(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Dead Line"
              />
            </div>

          </Modal>

          {/* Modal for Update User */}
          <Modal title="Update a Project" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3}>

            <br></br>

            {byproject.map((pro) => (
              <div key={pro.id}>
                <div className="form-outline mb-3">
                  <label>Company</label>
                  <Form.Item>
                    <Select placeholder="Select Company" onChange={handleCompanyChange} defaultValue={pro.company_name}>
                      {company.map((count) => (
                        <Select.Option value={count.name} key={count.id}>
                          {count.company_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Department</label>
                  <Form.Item>
                    <Select placeholder="Select Departments" onChange={handleDepartmentChange} defaultValue={pro.department_name}>
                      {department.map((count) => (
                        <Select.Option value={count.name} key={count.id}>
                          {count.department_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Project Name</label>
                  <input
                    type="text"
                    defaultValue={pro.project_name}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Project Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Description</label>
                  <input
                    type="text"
                    defaultValue={pro.project_description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Description"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Start Date</label>
                  <input
                    type="date"
                    defaultValue={pro.start_date}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Start Date"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>End Date</label>
                  <input
                    type="date"
                    defaultValue={pro.dead_line}
                    onChange={(e) => setDeadLine(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Dead Line"
                  />
                </div>
              </div>
            ))}

          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
          </Modal>

          {/* Modal for View Details */}
          <Modal title="" open={isModalOpen5} onOk={handleOk5} onCancel={handleCancel5} style={modalStyle}>

            {byproject.map((proj) => {
              const start = new Date(proj.start_date).toLocaleDateString();
              const dead = new Date(proj.dead_line).toLocaleDateString();

              return (
                <div key={proj.id}>
                  <h3 style={headStyle}>{proj.project_name}</h3>
                  <br></br>
                  <h6 style={perStyle}>Company Name</h6>
                  <p>{proj.company_name}</p>
                  <h6 style={perStyle}>Department Name</h6>
                  <p>{proj.department_name}</p>
                  <h6 style={perStyle}>Description</h6>
                  <p>{proj.project_description}</p>
                  <h6 style={perStyle}>Start Date</h6>
                  <p>{start}</p>
                  <h6 style={perStyle}>End Date</h6>
                  <p>{dead}</p>
                </div>
              );
            })}

          </Modal>

          {/* Modal for Streams */}
          <Modal title="" open={isModalOpen6} onOk={handleOk6} onCancel={handleCancel6} style={modalStyle}>

            <h3 style={headStyle2}>Streams</h3>

            <br></br>
            <div className='row'>
              <div className='col md-2 text-center'>
                <h6>Sr/No</h6>
              </div>
              <div className='col md-3'></div>
              <div className='col md-2 text-center'>
                <h6 style={perStyle}>Name</h6>
              </div>
              <div className='col md-3'></div>
              <div className='col md-2 text-center'>
                <h6 style={perStyle}>Assign</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>

            {stream.map((str, index) => (
              <div className='row' key={str.id}>
                <div className='col md-2 text-center'>
                  <h6 style={perStyle}>{index + 1}</h6>
                </div>
                <div className='col md-3'></div>
                <div className='col md-2 text-center'>
                  <h6 style={perStyle}>{str.stream_name}</h6>
                </div>
                <div className='col md-3'></div>
                <div className='col md-2 text-center'>
                  <IconButton aria-label="user" onClick={() => showModal4(str.id)}>
                    <AssignmentIndIcon htmlColor='#0070ff' />
                  </IconButton>
                </div>
                &nbsp;
                <Divider></Divider>
              </div>
            ))}

            <br></br>
          </Modal>

          {/* Modal for Assign User */}
          <Modal title="Assign Users" open={isModalOpen4} onOk={handleOk4} onCancel={handleCancel4} style={modalStyle}>

            <br></br>
            <div className='row'>
              <div className='col md-2 text-center'>
                <h6>Sr/No</h6>
              </div>
              <div className='col md-3'></div>
              <div className='col md-2 text-center'>
                <h6>Users</h6>
              </div>
              <div className='col md-3'></div>
              <div className='col md-2 text-center'>
                <h6 style={heading}>Select</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>

            {users.map((user, index) => (
              <div className='row' key={user.id}>
                <div className='col md-2 text-center'>
                  <h6 style={perStyle}>{index + 1}</h6>
                </div>
                <div className='col md-3'></div>
                <div className='col md-2 text-center'>
                  <h6 style={perStyle}>{user.name}</h6>
                </div>
                <div className='col md-3'></div>
                <div className='col md-2 text-center'>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                      }
                    }}
                  />
                </div>
                &nbsp;
                <Divider></Divider>
              </div>
            ))}
          </Modal>

          {/* Alert for Add Project Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              Project Added Successfully
            </Alert>
          )}

          {/* Alert for Add Project Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Add Project
            </Alert>
          )}

          {/* Alert for Delete Project Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Project Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Project Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Delete Project
            </Alert>
          )}

          {/* Alert for Update Project Success*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Project Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Project Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Project
            </Alert>
          )}

          {/* Alert for User Assign Success*/}
          {showAlert7 && (
            <Alert onClose={handleCloseAlert7} severity="success" style={modalStyle2}>
              Users Assigned Successfully
            </Alert>
          )}

          {/* Alert for User Assign Failure*/}
          {showAlert8 && (
            <Alert onClose={handleCloseAlert8} severity="error" style={modalStyle2}>
              Failed to Assign Users
            </Alert>
          )}

        </CTableBody>
      </CTable>
    </>
  );
}

export default Projects;