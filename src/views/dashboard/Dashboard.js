import { React, useEffect, useState } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import screen1 from 'src/assets/screenshots/screen1.png';
import screen2 from 'src/assets/screenshots/screen2.png';
import screen3 from 'src/assets/screenshots/screen3.png';
import { Card, Divider, Button } from 'antd'

const Dashboard = () => {

  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const mystyle2 = {
    backgroundColor: "white ",
    padding: "15px",
    fontFamily: "Arial",
    fontSize: 14,
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const cardStyle = {
    width: "100%",
  };

  const cardStyle2 = {
    width: "100%",
    backgroundColor: "#FFFFFF ",
  };

  const head = {
    color: "#6E6E6E",
    fontSize: 14,
  };

  const subhead = {
    color: "#28B463",
  };

  const headStyle = {
    fontFamily: "Arial",
    fontSize: 30,
  };

  const buttonStyle = {

  };

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    getCompanies()
    getProjects()
    getDepartments()
  }, []);

  function getCompanies() {
    fetch("http://127.0.0.1:8000/api/getcompany")
      .then((response) => response.json())
      .then((data) => setUsers(data.companies))
      .catch((error) => console.log(error));
  };

  function getProjects() {
    fetch("http://127.0.0.1:8000/api/getproject")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.log(error));
  };

  function getDepartments() {
    fetch("http://127.0.0.1:8000/api/getdepartment")
      .then((response) => response.json())
      .then((data) => setDepartments(data.Departments))
      .catch((error) => console.log(error));
  };

  return (
    <>
      <div className='row'>
        <div className='col-md 6'>
          <h4 style={headStyle}>Dashboard</h4>
        </div>
      </div>
      <br></br>
      <br></br>
      <Card style={cardStyle}>
        <div className='row'>
          <div className='col-md-2'>
            <h6 style={head}>PROJECTS WORKED</h6>
            <h3 style={subhead}>1</h3>
          </div>
          <div className='col-md-2'>
            <h6 style={head}>TODAY ACTIVITY</h6>
            <h3 style={subhead}>82%</h3>
          </div>
          <div className='col-md-2'>
            <h6 style={head}>TODAY WORKED</h6>
            <h3 style={subhead}>6:35:42</h3>
          </div>
          <div className='col-md-2'>
            <h6 style={head}>WEEKLY ACTIVITY</h6>
            <h3 style={subhead}>75%</h3>
          </div>
          <div className='col-md-2'>
            <h6 style={head}>WEEKLY WORKED</h6>
            <h3 style={subhead}>48:55:40</h3>
          </div>
          <div className='col-md-2'>
            <h6 style={head}>EARNED AMOUNT</h6>
            <h3 style={subhead}>-</h3>
          </div>
        </div>
      </Card>
      <br></br>

      <div className='row'>
        {/* <CRow> */}
        <div className='col-md-6'>
          <Card style={cardStyle2}>
            <h5 style={head}>RECENT ACTIVITY</h5>
            <Divider></Divider>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >

                <img src={screen1} width={200} height={150} alt='' />
                &nbsp; &nbsp;
                <img src={screen2} width={200} height={150} alt='' />
                &nbsp; &nbsp;
                <img src={screen3} width={200} height={150} alt='' />

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" style={buttonStyle} href="/activity/screenshots">View recent activity &gt;</Button>
            </div>

          </Card>

          <br></br>
          <Card style={cardStyle2}>
            <h5 style={head}>COMPANIES</h5>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >

                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>Company Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Address</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Company Email</CTableHeaderCell>
                </CTableRow>

                {users.slice(0, 3).map((company) => (
                  <CTableRow key={company.id}>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{company.company_name}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{company.address}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{company.company_email}</CTableHeaderCell>
                  </CTableRow>
                ))}

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" style={buttonStyle} href="/companies/Companies">View companies &gt;</Button>
            </div>
          </Card>
          <br></br>
          <Card style={cardStyle2}>
            <h5 style={head}>DEPARTMENTS</h5>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >

                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>Department Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Company</CTableHeaderCell>
                </CTableRow>

                {departments.slice(0, 3).map((dept) => (
                  <CTableRow key={dept.id}>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{dept.department_name}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{dept.company_name}</CTableHeaderCell>
                  </CTableRow>
                ))}

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" style={buttonStyle} href="/departments/Departments">View departments &gt;</Button>
            </div>

          </Card>
        </div>

        <div className='col-md-6'>
          <Card style={cardStyle2}>
            <h5 style={head}>TIME SHEETS</h5>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >

                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Activity</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Duration</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Time</CTableHeaderCell>
                </CTableRow>

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" style={buttonStyle} href="/timesheets/viewedit">View daily timesheets &gt;</Button>
            </div>

          </Card>

          <br></br>
          <Card style={cardStyle2}>
            <h5 style={head}>PROJECTS</h5>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >


                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Start Date</CTableHeaderCell>
                </CTableRow>

                {projects.slice(0, 4).map((proj) => (
                  <CTableRow key={proj.id}>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{proj.project_name}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{proj.start_date}</CTableHeaderCell>
                  </CTableRow>
                ))}

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" style={buttonStyle} href="/projectmanagement/projects">View projects &gt;</Button>
            </div>

          </Card>

          <br></br>
          <Card style={cardStyle2}>
            <h5 style={head}>APPS & URLS</h5>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >


                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>App Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Time Spent</CTableHeaderCell>
                </CTableRow>

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" style={buttonStyle} href="/activity/apps">View apps activity &gt;</Button>
            </div>

          </Card>
        </div>
      </div>

      {/* </CRow> */}

    </>
  )
}

export default Dashboard
