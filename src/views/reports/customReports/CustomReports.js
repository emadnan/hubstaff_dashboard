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
const CustomReports = () => {
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
    const [currentUser, setCurrentUser] = useState([])
    const [companies, setCompanies] = useState([])

  // Local Storage data
    const local = JSON.parse(localStorage.getItem('user-info'))
    const permissions = local.permissions
    const perm = permissions.map((permission) => ({
        name: permission.name,
    }))

    const [isEmployeeSelected, setIsEmployeeSelected] = useState(false)
    const [fromSelectedDate, setFromSelectedDate] = useState(null)
    const [toSelectedDate, setToSelectedDate] = useState(null)
    const [selectedDate, setSelectedDate] = useState(null)
    const [isRecordNotFound, setIsRecordNotFound] = useState(false)
    const [isAdminLogin, setIsAdminLogin] = useState(true)
    const [api , setApi] = useState('get-reports-with-date-range')
    const [totalWorkingHours , setTotalWorkingHours] = useState('')
    const [averageWorkingHours , setAverageWorkingHours] = useState('')
    const tableRef = useRef(null)

    useEffect(() => {
        if (perm.some((item) => item.name === 'Company_Data')) {
            setIsAdminLogin(false)
        } else if (perm.some((item) => item.name === 'User_Data')) {
            setUserId(local.Users.user_id)
        }
    }, [])

     // Disable Dates
     const disabledDate = (current) => {
      // Disable dates that are after the current date
      return current && current > dayjs().endOf('day')
  }

      const disabledReverseDate = (current) => {
        // Disable dates that are before the fromSelectedDate
        return current && current < dayjs(fromSelectedDate).endOf('day')
    }

  function onFromDateChange(date, dateString) {
    setIsAdminLogin(true)
    setFromSelectedDate(dateString)
}

  function onToDateChange(date, dateString) {
    setIsAdminLogin(true)
    setToSelectedDate(dateString)
  }

    // Array Declaration for API Calls
    const [users, setUsers] = useState([])
    const [report, setReport] = useState([])
    const [user_id, setUserId] = useState('')
    const [notfoundmessage, setNotFoundMessage] = useState(true)
    const [export_disable, setExportDisable] = useState(true)
    const [totalProjects, setTotalProjects] = useState([])
    const [totalNumberOfProjects, setTotalNumberOfProjects] = useState()

     // Initial rendering through useEffect
     useEffect(() => {
      setCompanyId(local.Users.company_id)
      getUsers(local.Users.company_id)
  }, [])

  const handleExport = () => {
        const worksheet = XLSX.utils.json_to_sheet(report.data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
        if(selectedDate === null) {
            const today = new Date()
            const day = today.getDate()
            const month = today.getMonth() + 1
            const year = today.getFullYear()
            const todayDate = `${year}-${month}-${day}`
            saveAs(blob, `Report${[todayDate]}.xlsx`);
        }
        else {
            saveAs(blob, `Report${[selectedDate]}.xlsx`);
        }
  }

  const handleUserChange = (value) => {
    const selectedUser = users.filter((user) => user.id === value)
    getCompanies(selectedUser)
    setCurrentUser(selectedUser)
    setNotFoundMessage(true)
    setFromSelectedDate("");
    getAssignedProjects(value)
    setToSelectedDate("");
    setIsEmployeeSelected(true)
    setIsAdminLogin(true)
    setUserId(value)
    const today = new Date()
    const day = today.getDate()
    const month = today.getMonth() + 1
    const year = today.getFullYear()
    const todayDate = `${year}-${month}-${day}`

}

function fetchPromise(url) {
  return new Promise((resolve, reject) => {
      fetch(url)
          .then((response) => resolve(response))
          .catch((error) => reject(error))
  })
}

async function getReport() {
  try {
      const response = await fetch(`${BASE_URL}/api/get-reports-with-date-range/${user_id}/${fromSelectedDate}/${toSelectedDate}`);

      const data = await response.json();

      if (data.length === 0) {
          setNotFoundMessage(true);
          setExportDisable(true)
      } else {
          setExportDisable(false)
          setNotFoundMessage(false);

          setTotalWorkingHours(`
          ${data.hours.toString().padStart(2,'0')}:
          ${data.minutes.toString().padStart(2,'0')}:
          ${data.seconds.toString().padStart(2,'0')}
          `)

          // const totalSeconds = data.project.reduce((total, project) => {
          //   return total + project.hours * 3600 + project.minutes * 60 + project.seconds
          // }, 0)

          const totalSeconds = data.hours * 3600 + data.minutes * 60 + data.seconds
  
          const averageSeconds = totalSeconds / data.total_working_days
          let averageHours = 0
          let averageMinutes = 0
  
          if (averageSeconds > 0) {
            averageHours = Math.floor(averageSeconds / 3600)
            averageMinutes = Math.floor((averageSeconds % 3600) / 60)
          }

          setAverageWorkingHours(
            `${averageHours.toString().padStart(2, '0')}: 
             ${averageMinutes.toString().padStart(2, '0')}`
          )

          const projectDates = data.everyDays.map((project) => new Date(project.date))
          processData(data);
      }
  } catch (error) {
      console.log(error);
  }
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

async function getCompanies(selectedUser) {
  const companyId = selectedUser[0].company_id
  let filteredCompanies = []
  await fetch(`${BASE_URL}/api/getcompany`)
    .then((response) => response.json())
    .then((data) => {
      filteredCompanies = data.companies.filter((company) => company.id === companyId)
      setCompanies(filteredCompanies)
    })
    .catch((error) => console.log(error))
}


async function getAssignedProjects(userId) {
  if (!local) {
    // console.log('Local variable is not available')
    return
  }
  let filteredAssignedProjects = []

  await fetch(`${BASE_URL}/api/get_assign_projects`)
    .then((response) => response.json())
    .then((data) => {
      filteredAssignedProjects = data.Project_Assigns.filter(
        (project) => project.assign_projects_user_id === userId,
      )
      // console.log('filteredAssignedProjects: ', filteredAssignedProjects)
      setTotalProjects(filteredAssignedProjects)
      setTotalNumberOfProjects(filteredAssignedProjects.length)
    })
    .catch((error) => console.log(error))
}

 // Function to format the date
 const formatDate = (dateString) => {
  const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' }
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', options).toUpperCase()
}

// Function to format time as HH:MM
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Function to convert time in HH:MM format to seconds
const timeInSeconds = (timeString) => {
  const [hours, minutes] = timeString.split(':')
  return parseInt(hours) * 3600 + parseInt(minutes) * 60
}


  // Function to process the JSON data
  const processData = (jsonData) => {
    // Initialize an empty object to store the processed data
    const processedData = {}

    // Iterate over each object in the "project" array of the JSON data
    jsonData.everyDays.forEach((project) => {
      // Extract the relevant properties from the project object
      const { date, hours, minutes, seconds, project_name } = project

      // Calculate the total time in seconds
      const totalSeconds = hours * 3600 + minutes * 60 + seconds

      // Format the date
      const formattedDate = formatDate(date)

      // If the date doesn't exist in the processedData object, create a new entry
      if (!processedData[formattedDate]) {
        processedData[formattedDate] = {
          date: formattedDate,
          totalWorkingHourOfDay: formatTime(0), // Initialize total working hours as 0
          projects: [],
        }
      }

      // Update the total working hours for the date
      processedData[formattedDate].totalWorkingHourOfDay = formatTime(
        timeInSeconds(processedData[formattedDate].totalWorkingHourOfDay) + totalSeconds,
      )

      // Find the corresponding projectData object in the projects array for the date
      let projectData = processedData[formattedDate].projects.find(
        (data) => data.project === project_name,
      )

      // If the projectData object doesn't exist, create a new one
      if (!projectData) {
        projectData = {
          project: project_name,
          HOURS: formatTime(totalSeconds), // Format the project hours
          ACTIVITY: '-',
        }
        processedData[formattedDate].projects.push(projectData)
      } else {
        // Update the project hours
        projectData.HOURS = formatTime(timeInSeconds(projectData.HOURS) + totalSeconds)
      }
    })

    // Calculate the percentages for each project in each day
    Object.values(processedData).forEach((dayData) => {
      const totalDaySeconds = timeInSeconds(dayData.totalWorkingHourOfDay)
      const totalSecondsPerDay = 8 * 3600 // Total seconds for 7 hours per day

      if (totalDaySeconds !== 0) {
        dayData.projects.forEach((projectData) => {
          const projectSeconds = timeInSeconds(projectData.HOURS)
          projectData.ACTIVITY = `${((projectSeconds / totalSecondsPerDay) * 100).toFixed(0)}%`
        })
      } else {
        dayData.projects.forEach((projectData) => {
          projectData.ACTIVITY = `0%`
        })
      }
    })

    setReport(Object.values(processedData))
  }


    // Static Messeges
    const renderInitialMessage = () => {
      return <InitialMessegeForCompany />
  }

  const renderNoRecordFoundMessage = () => {
      return <NoRecordsMessegeComponent />
  }

  const handleDownloadCSV = () => {
    const employeeName = currentUser[0].name
    const startDate = fromSelectedDate
    const endDate = toSelectedDate
    // Flatten the nested data structure
    const flattenedData = report
      .map((item) => {
        const flattenedProjects = item.projects.map((project) => ({
          DATE: item.date,
          'TOTAL DAY HOURS': item.totalWorkingHourOfDay,
          PROJECT: project.project,
          HOURS: project.HOURS,
          ACTIVITY: project.ACTIVITY,
        }))

        return flattenedProjects
      })
      .flat()

    // Generate the CSV data
    const csvData = json2csv.parse(flattenedData, {
      fields: ['DATE', 'TOTAL DAY HOURS', 'PROJECT', 'HOURS', 'ACTIVITY'],
      header: false, // We will manually add the header later
    })

    // Create the header row
    const headerRow = 'DATE,TOTAL DAY HOURS,PROJECT,HOURS,ACTIVITY'

    // Create the merged cell row with the Monthly Report, Employee name, and Month Date Range
    const mergedCellRow = `Monthly Report\nEmployee: ${employeeName}\Margins: ${startDate}-${endDate}\nTotal Hours of ${startDate}-${endDate}: ${totalWorkingHours}\nAVG. Working Hours of Day in ${startDate}-${endDate}: ${averageWorkingHours}\n`

    // Combine the merged cell row, header row, and CSV data
    const modifiedCsvData = `${mergedCellRow}\n${headerRow}\n${csvData}`

    const csvBlob = new Blob([modifiedCsvData], { type: 'text/csv;charset=utf-8' })
    saveAs(csvBlob, `${currentUser[0].name} Monthly-Report.csv`)
  }

  const handleDownloadPDF = () => {
    const input = tableRef.current

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${currentUser[0].name} Monthly-Report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: 'mm', format: 'a3' },
      })
      .from(input)
      .save()
  }

  return (
    <>
    <Box>
    <div className='row justify-content-between'>
        <h2 className='col-md-6'>Custom Reports </h2>
        {/* <Button className={!export_disable ? "btn btn-primary float-right col-md-6" : "btn btn-secondary text-light float-right col-md-6" } disabled={export_disable} style={buttonStyle} onClick={handleExport}>
            Export
        </Button> */}
    </div>
    <br></br>
    <div className="row mt-2 mb-2 justify-content-between">
        <div className="col-md-4">
            <div className="d-flex align-items-center">
              <FormLabel>From: </FormLabel>
                <DatePicker
                    value={fromSelectedDate ? dayjs(fromSelectedDate, 'YYYY-MM-DD') : null}
                    onChange={onFromDateChange}
                    disabled={!user_id}
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
            </div>
          </div>
            <div className="col-md-4">
              {perm.some((item) => item.name === 'All_Data') || perm.some((item) => item.name === 'Company_Data') ? (
                  <div className="d-flex align-items-center">
                      <Form.Item
                          name="select"
                          hasFeedback
                          style={{
                              width: '100%',
                          }}
                      >
                          <Select
                              placeholder="Members"
                              onChange={handleUserChange}
                              value={user_id}
                              showSearch
                              filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                          >
                              {users.map((user) => (
                                  <Select.Option value={user.id} key={user.id}>
                                      {user.name}
                                  </Select.Option>
                              ))}
                          </Select>
                      </Form.Item>
                  </div>
              ) : null}
        </div>
    </div>

    <Divider/>
    <div>
      {
        user_id ? (
          !fromSelectedDate ? (
            <>
            <Box mt={2}>
              <Card style={cardStyle}>
                <Box className="row">
                  <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                    PLEASE SELECT START DATE TO GENERATE REPORT
                  </Typography>
                </Box>
              </Card>
            </Box>
            </>
          ) : (
            !toSelectedDate ? (
              <>
              <Box mt={2}>
              <Card style={cardStyle}>
                <Box className="row">
                  <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                    PLEASE SELECT END DATE TO GENERATE REPORT
                  </Typography>
                </Box>
              </Card>
            </Box>
            </>
            ) :(
              notfoundmessage ? (renderNoRecordFoundMessage()) : (
                !report ? (renderNoRecordFoundMessage())
                : (
                  <div ref={tableRef}>
                  <Box mt={2}>
                    <Card style={cardStyle}>
                      <Box className="row">
                        <Box className="col-md-3">
                          <Typography variant="h6" sx={head}>
                            NO. OF ASSIGNED PROJECTS
                          </Typography>
                          <Typography variant="h4" sx={subhead}>
                            {totalNumberOfProjects}
                          </Typography>
                        </Box>
                        <Box className="col-md-3">
                          <Typography variant="h6" sx={head}>
                            TOTAL WORKING HOURS
                          </Typography>
                          <Typography variant="h4" sx={subhead}>
                            {totalWorkingHours}
                          </Typography>
                        </Box>
                        <Box className="col-md-3">
                          <Typography variant="h6" sx={head}>
                            AVG. WORKING HOURS 
                          </Typography>
                          <Typography variant="h4" sx={subhead}>
                            {averageWorkingHours}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Box>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Card style={cardStyle2}>
                      <h5 style={head}>ASSIGNED PROJECTS</h5>
                      <CTable
                        align="middle"
                        className="mb-0 border"
                        hover
                        responsive
                        style={{ marginTop: '20px' }}
                      >
                        <CTableHead color="light">
                          <CTableRow>
                            <CTableHeaderCell className="text-center" style={mystyle}>
                              Project Name
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle}>
                              Stream Name
                            </CTableHeaderCell>
                          </CTableRow>
        
                          {totalProjects.map((project, index) => (
                            <CTableRow key={index}>
                              <CTableHeaderCell className="text-center" style={mystyle2}>
                                {project.project_name}
                              </CTableHeaderCell>
                              <CTableHeaderCell className="text-center" style={mystyle2}>
                                {project.stream_name}
                              </CTableHeaderCell>
                            </CTableRow>
                          ))}
                        </CTableHead>
        
                        <CTableBody></CTableBody>
                      </CTable>
                    </Card>
                  </Box>
                  <Box sx={{ width: '100%', mt: 2 }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                      <Toolbar
                        sx={{
                          pl: { sm: 4 },
                          pr: { xs: 2, sm: 2 },
                          pt: 2,
                          mb: 2,
                        }}
                      >
                        {companies.map((company) => (
                          <Typography
                            sx={{ flex: '1 1 100%', color: 'blue' }}
                            variant="h4"
                            id="tableTitle"
                            component="div"
                            key={company.id}
                          >
                            {company.company_name}
                            <span style={{ fontSize: 'medium', color: 'gray', ml: 4 }}>{company.city}</span>
                          </Typography>
                        ))}{' '}
                        <Tooltip title="Generate CSV Report">
                          <IconButton>
                            <FileDownloadIcon onClick={handleDownloadCSV} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Generate PDF Report">
                          <IconButton>
                            <PictureAsPdfSharpIcon onClick={handleDownloadPDF} />
                          </IconButton>
                        </Tooltip>
                      </Toolbar>
        
                      <Box className="row" style={{ width: '90%', margin: 'auto' }}>
                        <Box className="col-md-6">
                          <Typography variant="h5" sx={head}>
                            EMPLOYEE NAME
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {currentUser[0].name}
                          </Typography>
                        </Box>
                        <Box className="col-md-6">
                          <Typography variant="h5" sx={head}>
                            DATE RANGE
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {fromSelectedDate}-{toSelectedDate}
                          </Typography>
                        </Box>
                      </Box>
        
                      <div style={{ width: '90%', margin: 'auto', justifyItems: 'center' }}>
                        <TableContainer>
                          <Table sx={{ minWidth: 650, mb: 4 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell sx={tableHeaderCellStyle}>DATE</TableCell>
                                <TableCell sx={tableHeaderCellStyle}>TOTAL DAY HOURS</TableCell>
                                <TableCell sx={tableHeaderCellStyle}>PROJECTS</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {report.map((item) => (
                                <TableRow key={item.date}>
                                  <TableCell style={{ fontSize: 'large' }}>{item.date}</TableCell>
                                  <TableCell style={{ fontSize: 'large' }}>
                                    {item.totalWorkingHourOfDay}
                                  </TableCell>
                                  <TableCell>
                                    <Table>
                                      <TableHead>
                                        <TableRow>
                                          <TableCell sx={tableHeaderCellStyle}>PROJECT</TableCell>
                                          <TableCell sx={tableHeaderCellStyle}>HOURS</TableCell>
                                          <TableCell sx={tableHeaderCellStyle}>ACTIVITY</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {item.projects.map((project, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{project.project}</TableCell>
                                            <TableCell>{project.HOURS}</TableCell>
                                            <TableCell>{project.ACTIVITY}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </Paper>
                  </Box>
                </div>
              )
              )
            )
          ) 
        )  : (renderInitialMessage())
      }
    </div>
    </Box>
</>
  )
}

export default CustomReports