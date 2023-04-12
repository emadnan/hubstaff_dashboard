import { React, useEffect, useState } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Card, Divider, Button } from 'antd'
import moment from 'moment';

const Dashboard = () => {

  //CSS Stylings
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

  const imageWrapper = {
    margin: "10px",
    display: "flex",
    flexDirection: "row",
  };

  const timingStyle = {
    display: "flex",
    flexDirection: "row",
  };

  //Get API calls and functions
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [clients, setClients] = useState([]);
  const [screenshot, setScreenshot] = useState([]);
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("");
  // const [images, setImages] = useState([]);

  useEffect(() => {
    getCompanies()
    getProjects()
    getDepartments()
    getClients()
    getTotalTime()
    getProjectScreenshots()
  }, []);

  function getCompanies() {
    fetch("http://10.3.3.80/api/getcompany")
      .then((response) => response.json())
      .then((data) => setUsers(data.companies))
      .catch((error) => console.log(error));
  };

  function getProjects() {
    fetch("http://10.3.3.80/api/getproject")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.log(error));
  };

  function getDepartments() {
    fetch("http://10.3.3.80/api/getdepartment")
      .then((response) => response.json())
      .then((data) => setDepartments(data.Departments))
      .catch((error) => console.log(error));
  };

  function getClients() {
    fetch("http://10.3.3.80/api/get_client")
      .then((response) => response.json())
      .then((data) => setClients(data.Departments))
      .catch((error) => console.log(error));
  };

  function getTotalTime() {
    fetch("http://10.3.3.80/api/get_Project_Screenshots")
      .then((response) => response.json())
      .then((data) => {
        setHours(data.TotalHours);
        setMinutes(data.TotalMinutes);
        setSeconds(data.TotalSeconds);
      })
      .catch((error) => console.log(error));
  };

  function getProjectScreenshots() {
    fetch("http://10.3.3.80/api/get_Project_Screenshots")
      .then((response) => response.json())
      .then((data) => setScreenshot(data.projectscreenshot))
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

      {/* Statistics Data Modal Starts */}
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
            <h3 style={subhead}>{hours}:{minutes}:{seconds}</h3>
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
      {/* Statistics Data Modal Ends */}

      <br></br>

      <div className='row'>
        <div className='col-md-6'>

          {/* Card for Recent Activity Starts */}
          <Card style={cardStyle2}>
            <h5 style={head}>RECENT ACTIVITY</h5>
            <Divider />
            {screenshot.map((image) => {
              return (
                <div key={image.id} style={{ display: 'flex', justifyContent: 'center' }}>
                  {image.get_timings.map((timing) => (
                    <div key={timing.id} style={timingStyle}>
                      {timing.getattechments.slice(0, 1).map((attach) => (
                        <div key={attach.id} style={{ marginRight: '10px' }}>
                          <a href={attach.path_url}>
                            <img className='card' src={attach.path_url} width={150} height={100} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              );
            })}
            <Divider />
            <div className='text-center'>
              <Button type="link" href="/activity/screenshots">View recent activity &gt;</Button>
            </div>
          </Card>
          {/* Card for Recent Activity Ends */}

          <br></br>

          {/* Card for Companies Modal Starts */}
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
              <Button type="link" href="/companies/Companies">View companies &gt;</Button>
            </div>
          </Card>
          {/* Card for Companies Modal Ends */}

          <br></br>

          {/* Card for Departments Modal Starts  */}
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
              <Button type="link" href="/departments/Departments">View departments &gt;</Button>
            </div>

          </Card>
          {/* Card for Departments Modal Ends */}
        </div>

        <div className='col-md-6'>

          {/* Card for Projects Modal Starts */}
          <Card style={cardStyle2}>
            <h5 style={head}>PROJECTS</h5>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >


                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Start Date</CTableHeaderCell>
                </CTableRow>

                {projects.slice(0, 4).map((proj) => {
                  const start = moment(proj.start_date).format('DD-MM-YYYY');

                  return (
                    <CTableRow key={proj.id}>
                      <CTableHeaderCell className="text-center" style={mystyle2}>{proj.project_name}</CTableHeaderCell>
                      <CTableHeaderCell className="text-center" style={mystyle2}>{start}</CTableHeaderCell>
                    </CTableRow>
                  )
                })}

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" href="/projectmanagement/projects">View projects &gt;</Button>
            </div>

          </Card>
          {/* Card for Projects Modal Ends */}

          <br></br>

          {/* Card for Time Sheets Modal Starts */}
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
              <Button type="link" href="/timesheets/viewedit">View daily timesheets &gt;</Button>
            </div>

          </Card>
          {/* Card for Time Sheets Modal Ends */}

          <br></br>

          {/* Card for Apps Modal Starts */}
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
              <Button type="link" href="/activity/apps">View apps activity &gt;</Button>
            </div>

          </Card>
          {/* Card for Apps Modal Ends */}

          <br></br>

          {/* Card for Clients Modal Start */}
          {/* <Card style={cardStyle2}>
            <h5 style={head}>CLIENTS</h5>
            <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
              <CTableHead color="light" >


                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>Client Name</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>Status</CTableHeaderCell>
                </CTableRow>

                {clients.slice(0, 3).map((client) => (
                  <CTableRow key={client.id}>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{client.client_name}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{client.project}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>{client.project_status}</CTableHeaderCell>
                  </CTableRow>
                ))}

              </CTableHead>

              <CTableBody>
              </CTableBody>
            </CTable>

            <Divider></Divider>
            <div className='text-center'>
              <Button type="link" href="/projectmanagement/client">View clients &gt;</Button>
            </div>

          </Card> */}
          {/* Card for Clients Modal Ends */}

        </div>
      </div>

    </>
  )
}

export default Dashboard
