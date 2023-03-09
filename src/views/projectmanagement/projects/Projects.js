import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Projects = () => {

  const [user_id, setUserId] = useState("");
  const [department_id, setDepartmentId] = useState("");
  const [company_id, setCompanyId] = useState("");
  const [project_name, setProjectName] = useState("");
  const [start_date, setStartDate] = useState("");
  const [dead_line, setDeadLine] = useState("");
  const [team_id, setTeamId] = useState("");
  const [to_dos, setTodos] = useState("");
  const [budget, setBudget] = useState("");

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

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getList()
  }, []);

  function getList() {
    fetch("http://127.0.0.1:8000/api/getproject")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.log(error));
  }

  const modalStyle = {
    position: "fixed",
    top: "15%",
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
          console.log('Project added Successfully');
          getList()
        } else {
          console.error('Failed to add project');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

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
        console.log('Project deleted successfully');
        getList()
      } else {
        console.error('Failed to delete project');
      }
    })
      .catch(error => {
        console.error(error);
      });

  }

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
        console.log('Project updated successfully');
        getList()
      } else {
        console.error('Failed to update project');
      }
    })
      .catch(error => {
        console.error(error);
      });

  }

  return (
    <>
      <div className='row'>
        <div className='col-md 6'></div>
        <div className='col-md 6'>
          <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Project</Button>
        </div>
      </div>
      <br></br>
      <div className="card">
        <div className="card-body">
          <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
            <CTableHead color="light" >

              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Teams</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Todos</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Budget</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Start Date</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Deadline</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
              </CTableRow>
              {projects.map((project) => (
                <CTableRow key={project.id}>
                  <CTableHeaderCell className="text-center">{project.project_name}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.team_id}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.to_dos}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.budget}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.start_date}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.dead_line}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    <IconButton aria-label="delete" onClick={() => showModal2(project.id)}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={() => showModal3(project.id)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  </CTableHeaderCell>
                </CTableRow>
              ))}

            </CTableHead>
            <CTableBody>

              <Modal title="Add a Project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

                <div className="form-outline mb-3">
                  <input
                    type="number"
                    value={user_id}
                    onChange={(e) => setUserId(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter User Id"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="number"
                    value={department_id}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Department Id"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="number"
                    value={company_id}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Company Id"
                  />
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

              <Modal title="Update a Project" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} style={modalStyle}>

                <div className="form-outline mb-3">
                  <input
                    type="number"
                    value={user_id}
                    onChange={(e) => setUserId(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter User Id"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="number"
                    value={department_id}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Department Id"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="number"
                    value={company_id}
                    onChange={(e) => setCompanyId(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Company Id"
                  />
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

              <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
              </Modal>

            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  );
}

export default Projects;