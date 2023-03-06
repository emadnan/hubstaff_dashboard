import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { React, useState, useEffect } from 'react';
import { Modal, Button } from 'antd';

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

  async function deleteUser(newid) {
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

  return (
    <>
      <div className="card">

        <div className="card-body">

          <a className="btn btn-primary" style={{ marginLeft: '85%' }} onClick={showModal}>Add a Project</a>
          <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
            <CTableHead color="light" >

              <CTableRow>
                <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Teams</CTableHeaderCell>
                <CTableHeaderCell className="text-center">TO-DOS</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Budget</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Start</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Deadline</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
              </CTableRow>
              {projects.map((project) => (
                <CTableRow key={project.id}>
                  <CTableHeaderCell className="text-center">{project.project_name}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.team_id}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.to_dos}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.budget}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.start_date}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{project.dead_line}</CTableHeaderCell>
                  <CTableHeaderCell className="text-left">
                  <Button type="primary" onClick={() => deleteUser(project.id)}>Delete</Button>
                  </CTableHeaderCell>
                </CTableRow>
              ))}

            </CTableHead>
            <CTableBody>
              <Modal title="Add a Project" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

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
            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  );
}

export default Projects;