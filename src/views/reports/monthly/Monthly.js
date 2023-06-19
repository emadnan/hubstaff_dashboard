import React, { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { DatePicker, Card, Select, Form } from 'antd'
import { saveAs } from 'file-saver'
import json2csv from 'json2csv'
import moment from 'moment'
import dayjs from 'dayjs'
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp'
import html2pdf from 'html2pdf.js';

const BASE_URL = process.env.REACT_APP_BASE_URL

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

export default function Dashboard() {
  const tableRef = useRef(null)
  const [totalWorkingHoursOfMonth, setTotalWorkingHoursOfMonth] = useState('')
  const [userId, setUserId] = useState()
  const [month, setMonth] = useState([])
  const [monthlyReportData, setMonthlyReportData] = useState([])
  const [companies, setCompanies] = useState([])
  const [totalProjects, setTotalProjects] = useState([])
  const [totalNumberOfProjects, setTotalNumberOfProjects] = useState()
  const [averageWorkingHoursOfDay, setAverageWorkingHoursOfDay] = useState(0)
  const [age, setAge] = useState()
  const [users, setUsers] = useState([])
  const [currentUser, setCurrentUser] = useState([])
  const [isReportPreview, setIsReportPreview] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  let local = JSON.parse(localStorage.getItem('user-info'))

  const handleUserChange = (value) => {
    const selectedUser = users.filter((user) => user.id === value)
    setCurrentUser(selectedUser)
    setUserId(value)
    getMonthlyReport(value)
    getAssignedProjects(value)
    getCompanies(selectedUser)
    setIsReportPreview(true)
    setSelectedDate(null)
  }

  const onDateChange = (date, dateString) => {
    setSelectedDate(dateString)
    const selectedMonth = moment(dateString, 'YYYY-MM')
    const startOfMonth = selectedMonth.clone().startOf('month').format('YYYY-MM-DD')
    const endOfMonth = selectedMonth.clone().endOf('month').format('YYYY-MM-DD')
    if (startOfMonth !== 'Invalid date' && endOfMonth !== 'Invalid date') {
      getMonthlyReportOnMonthSelection(startOfMonth, endOfMonth, userId)
    } else {
      getMonthlyReport(userId)
    }

    const startMonthName = getMonthName(selectedMonth.month())
    const endMonthName = getMonthName(selectedMonth.clone().endOf('month').month())
    const dateRange = `${startMonthName} ${moment(startOfMonth).format(
      'DD, YYYY',
    )} - ${endMonthName} ${moment(endOfMonth).format('DD, YYYY')}`
    setMonth(dateRange)
  }

  const getUsers = () => {
    if (!local) {
      console.log('Local variable is not available')
      return
    }
    let filteredUsers = []

    fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.Users
        } else if (local.Users.role === 3) {
          filteredUsers = data.Users.filter(
            (user) =>
              user.company_id === local.Users.company_id && user.role !== 3 && user.role !== 1,
          )
          console.log('filteredUsers in getUsers: ', filteredUsers)
        } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
          filteredUsers = data.Users.filter((user) => user.id === local.Users.id)
        }
        setUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  const getMonthName = (monthIndex) => {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ]
    return months[monthIndex]
  }

  const getMonthlyReport = (userId) => {
    if (!local) {
      console.log('Local variable is not available')
      return
    }

    fetch(`${BASE_URL}/api/calculateMonthlyActivity/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        const totalSeconds = data.project.reduce((total, project) => {
          return total + project.hours * 3600 + project.minutes * 60 + project.seconds
        }, 0)

        const averageSeconds = totalSeconds / data.project.length
        let averageHours = 0
        let averageMinutes = 0

        if (averageSeconds > 0) {
          averageHours = Math.floor(averageSeconds / 3600)
          averageMinutes = Math.floor((averageSeconds % 3600) / 60)
        }

        setAverageWorkingHoursOfDay(`${averageHours.toString().padStart(2, '0')}: ${averageMinutes.toString().padStart(2, '0')}`)
        setTotalWorkingHoursOfMonth(`${data.hours.toString().padStart(2, '0')}:${data.minutes.toString().padStart(2, '0')}:${data.seconds.toString().padStart(2, '0')}`)

        const projectDates = data.project.map((project) => new Date(project.date))
        const minDate = new Date(Math.min(...projectDates))
        const maxDate = new Date(Math.max(...projectDates))

        const startDate = `${getMonthName(minDate.getMonth())} ${minDate
          .getDate()
          .toString()
          .padStart(2, '0')}, ${minDate.getFullYear()}`
        const endDate = `${getMonthName(maxDate.getMonth())} ${maxDate
          .getDate()
          .toString()
          .padStart(2, '0')}, ${maxDate.getFullYear()}`
        const dateRange = `${startDate} - ${endDate}`
        setMonth(dateRange)

        processData(data)
      })
      .catch((error) => console.log(error))
  }

  const getMonthlyReportOnMonthSelection = (
    selectedMonthStartDate,
    selectedMonthEndDate,
    selectedUserId,
  ) => {
    fetch(
      `${BASE_URL}/api/getSumByDateWithUserId/${selectedMonthStartDate}/${selectedMonthEndDate}/${selectedUserId}`,
    )
      .then((response) => response.json())
      .then((data) => {
        const totalSeconds = data.projects.reduce((total, projects) => {
          return total + projects.hours * 3600 + projects.minutes * 60 + projects.seconds
        }, 0)

        const averageSeconds = totalSeconds / data.projects.length
        let averageHours = 0
        let averageMinutes = 0

        if (averageSeconds > 0) {
          averageHours = Math.floor(averageSeconds / 3600)
          averageMinutes = Math.floor((averageSeconds % 3600) / 60)
        }

        setAverageWorkingHoursOfDay(`
          ${averageHours.toString().padStart(2, '0')}
          : ${averageMinutes.toString().padStart(2, '0')}
        `)
        setTotalWorkingHoursOfMonth(`
           ${data.hours.toString().padStart(2, '0')}
          : ${data.minutes.toString().padStart(2, '0')}
          : ${data.seconds.toString().padStart(2, '0')}
        `)

        processDataOnMonthSelection(data)
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
    jsonData.project.forEach((project) => {
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
          PERCENTAGE: '-',
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

      if (totalDaySeconds !== 0) {
        dayData.projects.forEach((projectData) => {
          const projectSeconds = timeInSeconds(projectData.HOURS)
          projectData.PERCENTAGE = `${((projectSeconds / totalDaySeconds) * 100).toFixed(0)}%`
        })
      } else {
        dayData.projects.forEach((projectData) => {
          projectData.PERCENTAGE = `0%`
        })
      }
    })

    setMonthlyReportData(Object.values(processedData))
  }

  const processDataOnMonthSelection = (jsonData) => {
    // Initialize an empty object to store the processed data
    const processedData = {}

    // Iterate over each object in the "project" array of the JSON data
    jsonData.projects.forEach((project) => {
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
          PERCENTAGE: '-',
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
      dayData.projects.forEach((projectData) => {
        const projectSeconds = timeInSeconds(projectData.HOURS)
        projectData.PERCENTAGE = `${((projectSeconds / totalDaySeconds) * 100).toFixed(0)}%`
      })
    })

    setMonthlyReportData(Object.values(processedData))
  }

  function getAssignedProjects(userId) {
    if (!local) {
      console.log('Local variable is not available')
      return
    }
    let filteredAssignedProjects = []

    fetch(`${BASE_URL}/api/get_assign_projects`)
      .then((response) => response.json())
      .then((data) => {
        filteredAssignedProjects = data.Project_Assigns.filter(
          (project) => project.assign_projects_user_id === userId,
        )
        console.log('filteredAssignedProjects: ', filteredAssignedProjects)
        setTotalProjects(filteredAssignedProjects)
        setTotalNumberOfProjects(filteredAssignedProjects.length)
      })
      .catch((error) => console.log(error))
  }

  function getCompanies(selectedUser) {
    const companyId = selectedUser[0].company_id
    let filteredCompanies = []
    fetch(`${BASE_URL}/api/getcompany`)
      .then((response) => response.json())
      .then((data) => {
        filteredCompanies = data.companies.filter((company) => company.id === companyId)
        setCompanies(filteredCompanies)
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    getUsers()
  }, [userId])

  const handleDownloadCSV = () => {
    const employeeName = currentUser[0].name
    const startDate = new Date(month.split(' - ')[0])
    const monthName = startDate.toLocaleString('en-US', { month: 'long' })
    const year = startDate.getFullYear()
    // Flatten the nested data structure
    const flattenedData = monthlyReportData
      .map((item) => {
        const flattenedProjects = item.projects.map((project) => ({
          DATE: item.date,
          'TOTAL DAY HOURS': item.totalWorkingHourOfDay,
          PROJECT: project.project,
          HOURS: project.HOURS,
          PERCENTAGE: project.PERCENTAGE,
        }))

        return flattenedProjects
      })
      .flat()

    // Generate the CSV data
    const csvData = json2csv.parse(flattenedData, {
      fields: ['DATE', 'TOTAL DAY HOURS', 'PROJECT', 'HOURS', 'PERCENTAGE'],
      header: false, // We will manually add the header later
    })

    // Create the header row
    const headerRow = 'DATE,TOTAL DAY HOURS,PROJECT,HOURS,PERCENTAGE'

    // Create the merged cell row with the Monthly Report, Employee name, and Month Date Range
    const mergedCellRow = `Monthly Report\nEmployee: ${employeeName}\nMonth: ${monthName}-${year}\nTotal Hours of ${monthName}-${year}: ${totalWorkingHoursOfMonth}\nAVG. Working Hours of Day in ${monthName}-${year}: ${averageWorkingHoursOfDay}\n`

    // Combine the merged cell row, header row, and CSV data
    const modifiedCsvData = `${mergedCellRow}\n${headerRow}\n${csvData}`

    const csvBlob = new Blob([modifiedCsvData], { type: 'text/csv;charset=utf-8' })
    saveAs(csvBlob, `${currentUser[0].name} Monthly-Report.csv`)
  }

  const handleDownloadPDF = () => {
    const input = tableRef.current;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${currentUser[0].name} Monthly-Report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, logging: true },
        jsPDF: { unit: 'mm', format: 'a3' },
      })
      .from(input)
      .save();
  };

  return (
    <Box>
      <Box className="row">
        <Box className="col-md 6">
          <Typography variant="h4">Monthly Reports</Typography>
        </Box>
      </Box>
      <Box className="row justify-content-between" sx={{ mt: 1 }}>
        <Box className="col-md-3">
          <DatePicker
            placeholder="SELECT MONTH"
            onChange={onDateChange}
            value={selectedDate ? dayjs(selectedDate, 'YYYY-MM') : null}
            picker="month"
            disabled={!isReportPreview}
            style={{
              width: '100%',
            }}
          />
        </Box>

        <Box
          className="col-md-7"
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Box className="col-md-5">
            <Form.Item name="select" hasFeedback>
              <Select placeholder="SELECT EMPLOYEE" onChange={handleUserChange}>
                {users.map((user) => (
                  <Select.Option value={user.id} key={user.id}>
                    {user.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Box>
        </Box>
      </Box>

      {isReportPreview && isReportPreview === true ? (
        <div ref={tableRef}>
          <Box mt={2} >
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
                    TOTAL HOURS OF MONTH
                  </Typography>
                  <Typography variant="h4" sx={subhead}>
                    {totalWorkingHoursOfMonth}
                  </Typography>
                </Box>
                <Box className="col-md-3">
                  <Typography variant="h6" sx={head}>
                    AVG. WORKING HOURS OF DAY
                  </Typography>
                  <Typography variant="h4" sx={subhead}>
                    {averageWorkingHoursOfDay}
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
                    MONTH DATE RANGE
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {month}
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
                      {monthlyReportData.map((item) => (
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
                                  <TableCell sx={tableHeaderCellStyle}>PERCENTAGE</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {item.projects.map((project, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{project.project}</TableCell>
                                    <TableCell>{project.HOURS}</TableCell>
                                    <TableCell>{project.PERCENTAGE}</TableCell>
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
      ) : (
        <Box mt={2}>
          <Card style={cardStyle}>
            <Box className="row">
              <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                PLEASE SELECT THE EMPLOYEE, WHOM YOU WANNA GENERATE REPORT
              </Typography>
            </Box>
          </Card>
        </Box>
      )}
    </Box>
  )
}
