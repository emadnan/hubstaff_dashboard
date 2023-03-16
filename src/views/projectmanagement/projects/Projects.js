import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button, Form, Select } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const Projects = () => {

  // Variable declarations
  const [user_id, setUserId] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [company_id, setCompanyId] = useState("");
  const [project_name, setProjectName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [dead_line, setDeadLine] = useState("");
  const [team_id, setTeamId] = useState("");
  const [to_dos, setTodos] = useState("");
  const [budget, setBudget] = useState("");

  // CSS Styling
  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
  };

  const modalStyle2 = {
    position: "fixed",
    top: "13%",
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
    setIsModalOpen3(id);
  };

  const handleOk3 = () => {
    updateProject(isModalOpen3);
    setIsModalOpen3(false);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
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

  //Get calls handling
  const handleCompanyChange = (value) => {
    setCompanyId(value);
  };

  const handleUserChange = (value) => {
    setUserId(value);
  };

  const handleDepartmentChange = (value) => {
    setDepartmentId(value);
  };

  // Get API call
  const [projects, setProjects] = useState([]);
  const [company, setCompanies] = useState([]);
  const [users, setUsers] = useState([]);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    getList()
    getCompany()
    getUsers()
    getDepartment()
  }, []);

  function getList() {
    fetch("http://127.0.0.1:8000/api/getproject")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.log(error));
  };

  // Get Companies API call
  function getCompany() {
    fetch("http://127.0.0.1:8000/api/getcompany")
      .then((response) => response.json())
      .then((data) => setCompanies(data.companies))
      .catch((error) => console.log(error));
  };

  // Get Users API call
  function getUsers() {
    fetch("http://127.0.0.1:8000/api/get_users")
      .then((response) => response.json())
      .then((data) => setUsers(data.Users))
      .catch((error) => console.log(error));
  }

  // Get Department API call
  function getDepartment() {
    fetch("http://127.0.0.1:8000/api/getdepartment")
      .then((response) => response.json())
      .then((data) => setDepartment(data.Departments))
      .catch((error) => console.log(error));
  }

  // Add API call
  async function addProject() {
    let user = { user_id, department_id, company_id, project_name, start_date, dead_line, team_id, to_dos, budget }

    await fetch("http://127.0.0.1:8000/api/add_project",
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

  // Delete API call
  async function deleteProject(newid) {
    await fetch('http://127.0.0.1:8000/api/delete-project', {
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
    await fetch('http://127.0.0.1:8000/api/update-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid,
        user_id: user_id,
        department_id: department_id,
        company_id: company_id,
        project_name: project_name,
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
            <CTableHeaderCell className="text-center" style={mystyle}>SR/No</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Project Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Company Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Department Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Users</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Todos</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Budget</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Start Date</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Deadline</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
          </CTableRow>

          {/* Get API Projects */}
          {projects.map((project, index) => (
            <CTableRow key={project.id}>
              <CTableHeaderCell className="text-center">{index + 1}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.project_name}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.company_id}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.department_id}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.user_id}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.to_dos}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.budget}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.start_date}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{project.dead_line}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">
                <IconButton aria-label="update" onClick={() => showModal3(project.id)}>
                  <EditIcon htmlColor='#28B463' />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => showModal2(project.id)}>
                  <DeleteIcon htmlColor='#FF0000' />
                </IconButton>

              </CTableHeaderCell>
            </CTableRow>
          ))}

        </CTableHead>
        <CTableBody>

          {/* Modal for Add Projects */}
          <Modal title="Add a Project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

            <div className="form-outline mb-3">
              <Form.Item label="Users">
                <Select placeholder="Select Users" onChange={handleUserChange} value={user_id}>
                  {users.map((form) => (
                    <Select.Option value={form.nname} key={form.id}>
                      {form.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-outline mb-3">
              <Form.Item label="Company">
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
              <Form.Item label="Departments">
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
              <input
                type="text"
                value={project_name}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Project Name"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="date"
                value={dead_line}
                onChange={(e) => setDeadLine(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Dead Line"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="number"
                value={team_id}
                onChange={(e) => setTeamId(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Team Id"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="text"
                value={to_dos}
                onChange={(e) => setTodos(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Todos"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Budget"
              />
            </div>

          </Modal>

          {/* Modal for Update User */}
          <Modal title="Update a Project" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} style={modalStyle}>

            <div className="form-outline mb-3">
              <Form.Item label="Users">
                <Select placeholder="Select Users" onChange={handleUserChange} value={user_id}>
                  {users.map((form) => (
                    <Select.Option value={form.nname} key={form.id}>
                      {form.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="form-outline mb-3">
              <Form.Item label="Company">
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
              <Form.Item label="Departments">
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
              <input
                type="text"
                value={project_name}
                onChange={(e) => setProjectName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Project Name"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="date"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Start Date"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="date"
                value={dead_line}
                onChange={(e) => setDeadLine(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Dead Line"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="number"
                value={team_id}
                onChange={(e) => setTeamId(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Team Id"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="text"
                value={to_dos}
                onChange={(e) => setTodos(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Todos"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Budget"
              />
            </div>

          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
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

        </CTableBody>
      </CTable>
    </>
  );
}

export default Projects;