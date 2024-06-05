import { React, useState, useEffect, useCallback, useRef } from 'react'
import * as XLSX from 'xlsx';
import { Button, DatePicker, Select, Form } from 'antd'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import Typography from '@mui/joy/Typography'
import dayjs from 'dayjs'
import {FormLabel } from '@mui/material'
import Card from '@mui/joy/Card'
import { saveAs } from 'file-saver'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import Toolbar from '@mui/material/Toolbar'
import NoRecordsMessegeComponent from 'src/components/noRecordsMessegeComponent/NoRecordsMessegeComponent'
import InitialMessegeForCompany from 'src/components/intialMessegeForCompany/InitialMessegeForCompany'
import json2csv from 'json2csv'
import html2pdf from 'html2pdf.js'
const BASE_URL = process.env.REACT_APP_BASE_URL
dayjs.extend(customParseFormat)
const Allreports = () => {
  const buttonStyle = {
    padding: '2px',
    width: '240px',
    fontWeight: 'bold',
  }
  const {
    cardStyle,
    cardStyle2,
    mystyle2,
    mystyle,
    head,
    subhead,
    arrowStyle,
    tableHeaderCellStyle,
  } = {
    cardStyle: {
      width: '100%',
    },
    cardStyle2: {
      width: '100%',
      backgroundColor: '#FFFFFF ',
    },
    mystyle: {
      color: 'white',
      backgroundColor: '#0070FF ',
      padding: '15px',
      fontFamily: 'Arial',
      textAlign: 'center',
      alignSelf: 'flex-end',
    },
    mystyle2: {
      backgroundColor: 'white ',
      padding: '15px',
      fontFamily: 'Arial',
      fontSize: 14,
      textAlign: 'center',
      alignSelf: 'flex-end',
    },
    head: {
      color: '#9E9E9E',
    },
    subhead: {
      color: '#28B463',
    },
    arrowStyle: {
      padding: '2px',
      width: '40px',
      color: 'black',
    },
    tableHeaderCellStyle: {
      fontSize: 'medium',
      fontWeight: 'bold',
    },
  }
    const [company_id , setCompanyId] = useState('')

  // Local Storage data
    const local = JSON.parse(localStorage.getItem('user-info'))
    const permissions = local.permissions
    const perm = permissions.map((permission) => ({
        name: permission.name,
    }))

    const [selectedDate, setSelectedDate] = useState('')
    const [fromSelectedDate, setFromSelectedDate] = useState('')
    const [toSelectedDate, setToSelectedDate] = useState('')
    const [isAdminLogin, setIsAdminLogin] = useState(true)
    const [isAllFilter , setIsAllFilter] = useState(true)
    const [isOnlineFilter , setIsOnlineFilter] = useState(false)
    const [isOfflineFilter , setIsOfflineFilter] = useState(false)

    useEffect(() => {
        if (perm.some((item) => item.name === 'Company_Data')) {
            setIsAdminLogin(false)
        } else if (perm.some((item) => item.name === 'User_Data')) {
            setUserId(local.Users.user_id)
        }
    }, [])

     // Disable Dates
     const disabledDate = (current) => {
      return current && current > dayjs().endOf('day')
  }

  function getTodayDate() {
    setIsAdminLogin(true)
    setSelectedDate(null)
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const todayDate = `${year}-${month}-${day}`
    setSelectedDate(todayDate)
}

function onFromDateChange(date, dateString) {
  setIsAdminLogin(true)
  setFromSelectedDate(dateString)
}

function onToDateChange(date, dateString) {
  setIsAdminLogin(true)
  setToSelectedDate(dateString)
}

const disabledReverseDate = (current) => {
  // Disable dates that are before the fromSelectedDate
  return current && current < dayjs(fromSelectedDate).endOf('day')
}
  
  const handleFilterChange = (value) => {
    if(value === 'all') {
      setIsAllFilter(true)
      setIsOnlineFilter(false)
      setIsOfflineFilter(false)
    }
    else if( value === 'online') {
      setIsAllFilter(false)
      setIsOnlineFilter(true)
      setIsOfflineFilter(false)
    }
    else {
      setIsAllFilter(false)
      setIsOnlineFilter(false)
      setIsOfflineFilter(true)
    }

  }

    // Array Declaration for API Calls
    const [users, setUsers] = useState([])
    const [report, setReport] = useState([])
    const [todayReport, setTodayReport] = useState([])
    const [online_users, setOnlineUsers] = useState([])
    const [offline_users, setOfflineUsers] = useState([])
    const [user_id, setUserId] = useState('')
    const [notfoundmessage, setNotFoundMessage] = useState(true)
    const [export_disable, setExportDisable] = useState(true)

     // Initial rendering through useEffect
     useEffect(() => {
      setCompanyId(local.Users.company_id)
      getUsers(local.Users.company_id)
      getTodayDate()
  }, [])

  useEffect(() => {
    console.log(report);
  } ,[report])

  const handleExport = () => {
        const modifiedReport = (isAllFilter ? todayReport.data : isOnlineFilter ? online_users : offline_users).map((item) => (
          item.totalHours ?
          {
          Name : item.name,
          Email : item.email,
          Status : item.status,
          'Online Time' : item.totalHours+':'+item.totalMinutes+':'+item.totalSeconds,
        } : {
          Name : item.name,
          Email : item.email,
          Status : item.status,
          'Online Time' : '---',
        }
      ))

        const worksheet = XLSX.utils.json_to_sheet(modifiedReport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        saveAs(blob, `Report${[selectedDate]}.xlsx`);
  }

function fetchPromise(url) {
  return new Promise((resolve, reject) => {
      fetch(url)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
  })
}

async function getTodayReport() {
  setReport([])
  setExportDisable(true)
  try {
      const response = await fetch(`${BASE_URL}/api/get-all-users-report-by-company-id/${company_id}/${selectedDate}`);

      const data = await response.json();

      if (data.data.length === 0) {
          setNotFoundMessage(true);
          setExportDisable(true)
      } else {
          setExportDisable(false)
          setNotFoundMessage(true);
          setTodayReport(data)
          let onlineUsers = data.data.filter((user) => user.status === 'online')
          let offlineUsers = data.data.filter((user) => user.status === 'offline')
          setOnlineUsers(onlineUsers)
          setOfflineUsers(offlineUsers)
      }
  } catch (error) {
      console.log(error);
  }
}

function getReport() {
  setTodayReport([])
  setExportDisable(true)
  fetchPromise(`${BASE_URL}/api/get-all-users-report-by-company-id-and-dates/${company_id}/${fromSelectedDate}/${toSelectedDate}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.data.length === 0) {
                setNotFoundMessage(true);
                setExportDisable(true)
            } else {
                setExportDisable(false)
                setNotFoundMessage(true);

                const restructuredData = data.data.reduce((acc, curr) => {
                  const found = acc.find(item => item.date === curr.date);
                  if (found) {
                      found.users.push({
                        name: curr.name,
                        hours : curr.totalHours,
                        minutes : curr.totalMinutes,
                        seconds : curr.totalSeconds,
                        status : curr.status
                       });
                  } else {
                      acc.push({ date: curr.date, users: [
                        {
                          name: curr.name,
                          hours : curr.totalHours,
                          minutes : curr.totalMinutes,
                          seconds : curr.totalSeconds,
                          status : curr.status
                         }
                      ] 
                      });
                  }
                  return acc;
              }, []);
              
              console.log({ data: restructuredData });
                setReport(restructuredData)
                // let onlineUsers = data.data.filter((user) => user.status === 'online')
                // let offlineUsers = data.data.filter((user) => user.status === 'offline')
                // setOnlineUsers(onlineUsers)
                // setOfflineUsers(offlineUsers)
            }
             

                // if (perm.some((item) => item.name === 'All_Data')) {
                //     filteredUsers = data.Users
                // } else if (perm.some((item) => item.name === 'Company_Data')) {
                //     filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && user.email !== local.Users.email)
                // } else if (perm.some((item) => item.name === 'User_Data')) {
                //     filteredUsers = data.Users.filter((user) => user.id === user_id)
                // }
                // setUsers(filteredUsers)
            })
            .catch((error) => console.log(error))
}

function getUsers(company_id) {
  fetchPromise(`${BASE_URL}/api/get_users`)
            .then((response) => response.json())
            .then((data) => {
                let filteredUsers = []
                if (perm.some((item) => item.name === 'All_Data')) {
                    filteredUsers = data.Users
                } else if (perm.some((item) => item.name === 'Company_Data')) {
                    filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id && user.email !== local.Users.email)
                } else if (perm.some((item) => item.name === 'User_Data')) {
                    filteredUsers = data.Users.filter((user) => user.id === user_id)
                }
                setUsers(filteredUsers)
            })
            .catch((error) => console.log(error))
}
    // Static Messeges
    const renderInitialMessage = () => {
      return <InitialMessegeForCompany />
  }

  const renderNoRecordFoundMessage = () => {
      return <NoRecordsMessegeComponent />
  }

  return (
    <>
    <Box>
    <div className='row justify-content-between'>
        <h2 className='col-md-6'>All User Report</h2>
        <Button className={!export_disable ? "btn btn-primary float-right col-md-6" : "btn btn-secondary text-light float-right col-md-6" } disabled={export_disable} style={buttonStyle} onClick={handleExport}>
            Export
        </Button>
    </div>
    <br></br>
    <div className="row mt-2 mb-2 justify-content-between">
        <div className="col-md-4">
             <div className="d-flex align-items-center">
             <FormLabel>From: </FormLabel>
                <DatePicker
                    value={fromSelectedDate ? dayjs(fromSelectedDate, 'YYYY-MM-DD') : null}
                    onChange={onFromDateChange}
                    disabledDate={disabledDate}
                    clearIcon={null}
                    style={{
                        width: '100%',
                    }}
                />

                <FormLabel>To: </FormLabel>
                <DatePicker
                    value={toSelectedDate ? dayjs(toSelectedDate, 'YYYY-MM-DD') : null}
                    onChange={onToDateChange}
                    disabled={!fromSelectedDate}
                    disabledDate={disabledReverseDate}
                    clearIcon={null}
                    style={{
                        width: '100%',
                    }}
                />
                <Button type="default" onClick={getReport} className="ml-2">Get Report</Button>
                <Button type="default" onClick={getTodayReport} className="ml-2">{"Today's Report"}</Button>
            </div>
          </div>
          <div className="col-md-4">
              <Form.Item name="select" hasFeedback>
                <Select
                placeholder="SELECT FILTER"
                onChange={handleFilterChange}
                defaultValue='all'
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                >
                  <Select.Option value='all'>
                    All Employees
                  </Select.Option>
                  <Select.Option value='online'>
                    Online Employees
                  </Select.Option>
                  <Select.Option value='offline'>
                    Offline Employees
                  </Select.Option>
                </Select>
              </Form.Item>
            </div>
    </div>

    <Divider/>

    {
      report.length !== 0 ? (
        <Card>
          {
            report.map((rep , index) => (
              <div key={index}>
                  <h4 className='mt-3 ml-5'>Date: {rep.date}</h4>
                  <div className="report-card ">
                  <br></br>
                  <Table>
                          <TableHead>
                              <TableCell>
                                  Name
                              </TableCell>
                              {/* <TableCell>
                                  Email
                              </TableCell> */}
                              <TableCell>
                                Status
                              </TableCell>
                              <TableCell>
                                Online Time
                              </TableCell>
                          </TableHead>
                          <TableBody>
              {rep.users.map((data, user_index) => (
                              <TableRow key={user_index}>
                                  <TableCell>
                                    {data.name}
                                  </TableCell>
                                  {/* <TableCell>
                                      {data.email}
                                  </TableCell> */}
                                  <TableCell>
                                      {data.status}
                                  </TableCell>
                                  <TableCell>
                                      {data.hours}:{data.minutes}:{data.seconds}
                                  </TableCell>
                              </TableRow>
              ))}
                          </TableBody>
                      </Table>
                  <br></br>
              </div>
              </div>
            ))
          }
          </Card>
      ) : (
        todayReport.length !== 0 ? ( 
          isAllFilter ? (
            <Card>
              <div className="report-card ">
                  <h4 className='mt-3 ml-5'>Report Summary</h4>
                  <br></br>
                  <Table>
                          <TableHead>
                              <TableCell>
                                  Name
                              </TableCell>
                              <TableCell>
                                  Email
                              </TableCell>
                              <TableCell>
                                Status
                              </TableCell>
                              <TableCell>
                                Online Time
                              </TableCell>
                          </TableHead>
                          <TableBody>
              {todayReport.data?.map((data, index) => (
                              <TableRow key={index}>
                                  <TableCell>
                                      {data.name}
                                  </TableCell>
                                  <TableCell>
                                      {data.email}
                                  </TableCell>
                                  <TableCell>
                                      {data.status}
                                  </TableCell>
                                  <TableCell>
                                      {data.totalHours}:{data.totalMinutes}:{data.totalSeconds}
                                  </TableCell>
                              </TableRow>
              ))}
                          </TableBody>
                      </Table>
                  <br></br>
              </div>
          </Card>
          ) : (
            isOnlineFilter ? (
              <Card>
              <div className="report-card ">
                  <h4 className='mt-3 ml-5'>Report Summary</h4>
                  <br></br>
                  <Table>
                          <TableHead>
                              <TableCell>
                                  Name
                              </TableCell>
                              <TableCell>
                                  Email
                              </TableCell>
                              <TableCell>
                                Status
                              </TableCell>
                              <TableCell>
                                Online Time
                              </TableCell>
                          </TableHead>
                          <TableBody>
              {online_users?.map((data, index) => (
                              <TableRow key={index}>
                                  <TableCell>
                                      {data.name}
                                  </TableCell>
                                  <TableCell>
                                      {data.email}
                                  </TableCell>
                                  <TableCell>
                                      {data.status}
                                  </TableCell>
                                  <TableCell>
                                      {data.totalHours}:{data.totalMinutes}:{data.totalSeconds}
                                  </TableCell>
                              </TableRow>
              ))}
                          </TableBody>
                      </Table>
                  <br></br>
              </div>
          </Card>
            ) : (
              isOfflineFilter ? (
            <Card>
              <div className="report-card ">
                  <h4 className='mt-3 ml-5'>Report Summary</h4>
                  <br></br>
                  <Table>
                          <TableHead>
                              <TableCell>
                                  Name
                              </TableCell>
                              <TableCell>
                                  Email
                              </TableCell>
                              <TableCell>
                                Status
                              </TableCell>
                              <TableCell>
                                Online Time
                              </TableCell>
                          </TableHead>
                          <TableBody>
              {offline_users?.map((data, index) => (
                              <TableRow key={index}>
                                  <TableCell>
                                      {data.name}
                                  </TableCell>
                                  <TableCell>
                                      {data.email}
                                  </TableCell>
                                  <TableCell>
                                      {data.status}
                                  </TableCell>
                                  <TableCell>
                                      {data.totalHours}:{data.totalMinutes}:{data.totalSeconds}
                                  </TableCell>
                              </TableRow>
              ))}
                          </TableBody>
                      </Table>
                  <br></br>
              </div>
          </Card>
              ) : (
                null
              )
            )
          )
        ) : (
          <>
          <Box mt={2}>
            <Card style={cardStyle}>
              <Box className="row">
                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                  CLICK ABOVE BUTTON TO GENERATE REPORT
                </Typography>
              </Box>
            </Card>
          </Box>
          </>
        )
      )
      
    }

    {/* {
      isAllFilter ? (
                  <div>
                    {
                        selectedDate ? (
                          report.length != 0 ? (
                                  <Card>
                                    <div className="report-card ">
                                        <h4 className='mt-3 ml-5'>Report Summary</h4>
                                        <br></br>
                                        <Table>
                                                <TableHead>
                                                    <TableCell>
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        Email
                                                    </TableCell>
                                                    <TableCell>
                                                      Status
                                                    </TableCell>
                                                    <TableCell>
                                                        Online Time
                                                    </TableCell>
                                                </TableHead>
                                                <TableBody>
                                    {report.data?.map((data, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {data.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.status}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.totalHours}:{data.totalMinutes}:{data.totalSeconds}
                                                        </TableCell>
                                                    </TableRow>
                                    ))}

                                                </TableBody>
                                            </Table>
                                        <br></br>
                                    </div>
                                </Card>
                        ) :
                        (
                          <>
                          <Box mt={2}>
                            <Card style={cardStyle}>
                              <Box className="row">
                                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                  CLICK ABOVE BUTTON TO GENERATE REPORT
                                </Typography>
                              </Box>
                            </Card>
                          </Box>
                          </>
                        )
                          ) : (
                          <>
                          <Box mt={2}>
                            <Card style={cardStyle}>
                              <Box className="row">
                                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                  PLEASE SELECT A DATE
                                </Typography>
                              </Box>
                            </Card>
                          </Box>
                          </>
                        )
                    }
                </div>
      ) : (
        isOnlineFilter ? (
                  <div>
                    {
                        selectedDate ? (
                          online_users.length != 0 ? (
                                  <Card>
                                    <div className="report-card ">
                                        <h4 className='mt-3 ml-5'>Online Employees</h4>
                                        <br></br>
                                        <Table>
                                                <TableHead>
                                                    <TableCell>
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        Email
                                                    </TableCell>
                                                    <TableCell>
                                                      Status
                                                    </TableCell>
                                                    <TableCell>
                                                        Online Time
                                                    </TableCell>
                                                </TableHead>
                                                <TableBody>
                                    {online_users.map((data, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {data.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.status}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.totalHours}:{data.totalMinutes}:{data.totalSeconds}
                                                        </TableCell>
                                                    </TableRow>
                                    ))}

                                                </TableBody>
                                            </Table>
                                        <br></br>
                                    </div>
                                </Card>
                        ) :
                        (
                          <>
                          <Box mt={2}>
                            <Card style={cardStyle}>
                              <Box className="row">
                                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                  CLICK ABOVE BUTTON TO GENERATE REPORT
                                </Typography>
                              </Box>
                            </Card>
                          </Box>
                          </>
                        )
                          ) : (
                          <>
                          <Box mt={2}>
                            <Card style={cardStyle}>
                              <Box className="row">
                                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                  PLEASE SELECT A DATE
                                </Typography>
                              </Box>
                            </Card>
                          </Box>
                          </>
                        )
                    }
                </div>
        ) : (
                  <div>
                    {
                        selectedDate ? (
                          offline_users.length != 0 ? (
                                  <Card>
                                    <div className="report-card ">
                                        <h4 className='mt-3 ml-5'>Offline Employees</h4>
                                        <br></br>
                                        <Table>
                                                <TableHead>
                                                    <TableCell>
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        Email
                                                    </TableCell>
                                                    <TableCell>
                                                      Status
                                                    </TableCell>
                                                    <TableCell>
                                                        Online Time
                                                    </TableCell>
                                                </TableHead>
                                                <TableBody>
                                    {offline_users?.map((data, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell>
                                                            {data.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.email}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.status}
                                                        </TableCell>
                                                        <TableCell>
                                                            {data.totalHours}:{data.totalMinutes}:{data.totalSeconds}
                                                        </TableCell>
                                                    </TableRow>
                                    ))}

                                                </TableBody>
                                            </Table>
                                        <br></br>
                                    </div>
                                </Card>
                        ) :
                        (
                          <>
                          <Box mt={2}>
                            <Card style={cardStyle}>
                              <Box className="row">
                                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                  CLICK ABOVE BUTTON TO GENERATE REPORT
                                </Typography>
                              </Box>
                            </Card>
                          </Box>
                          </>
                        )
                          ) : (
                          <>
                          <Box mt={2}>
                            <Card style={cardStyle}>
                              <Box className="row">
                                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                  PLEASE SELECT A DATE
                                </Typography>
                              </Box>
                            </Card>
                          </Box>
                          </>
                        )
                    }
                </div>
        )
      )
    } */}


                 
    </Box>
</>
  )
}

export default Allreports