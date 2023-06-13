import React, { useState, useEffect } from 'react'
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
import { ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material'
import { DatePicker, Button, Card } from 'antd'
import { saveAs } from 'file-saver'
import json2csv from 'json2csv'
const BASE_URL = process.env.REACT_APP_BASE_URL

const { RangePicker } = DatePicker

const { cardStyle, head, subhead, arrowStyle, tableHeaderCellStyle } = {
  cardStyle: {
    width: '100%',
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
  const [totalWorkingHoursOfMonth, setTotalWorkingHoursOfMonth] = useState('')
  const [userId, setUserId] = useState()
  const [monthlyReportData, setMonthlyReportData] = useState([])
  const [totalNumberOfProjects, setTotalNumberOfProjects] = useState()
  let local = JSON.parse(localStorage.getItem('user-info'))

  useEffect(() => {
    if (local) {
      setUserId(local.Users.id)
    }
  }, [])

  const getMonthlyReport = () => {
    if (!local) {
      console.log('Local variable is not available')
      return
    }

    fetch(`${BASE_URL}/api/calculateMonthlyActivity/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setTotalWorkingHoursOfMonth(`
           ${data.hours.toString().padStart(2, '0')}
          :${data.minutes.toString().padStart(2, '0')}
          :${data.seconds.toString().padStart(2, '0')}
        `)
        processData(data)
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
    // Initialize an empty array to store the processed data
    const processedData = []

    // Iterate over each object in the "project" array of the JSON data
    jsonData.project.forEach((project) => {
      // Extract the relevant properties from the project object
      const { date, hours, minutes, seconds, project_name } = project

      // Calculate the total time in seconds
      const totalSeconds = hours * 3600 + minutes * 60 + seconds

      // Find the corresponding dayData object in the processedData array
      let dayData = processedData.find((data) => data.date === date)

      // If the dayData object doesn't exist, create a new one
      if (!dayData) {
        dayData = {
          date: formatDate(date), // Format the date
          totalDayHours: formatTime(0), // Initialize total day hours as 0
          projects: [],
        }
        processedData.push(dayData)
      }

      // Update the total day hours
      dayData.totalDayHours = formatTime(timeInSeconds(dayData.totalDayHours) + totalSeconds)

      // Find the corresponding projectData object in the dayData's projects array
      let projectData = dayData.projects.find((data) => data.project === project_name)

      // If the projectData object doesn't exist, create a new one
      if (!projectData) {
        projectData = {
          project: project_name,
          HOURS: formatTime(totalSeconds), // Format the project hours
          PERCENTAGE: '-',
        }
        dayData.projects.push(projectData)
      } else {
        // Update the project hours
        projectData.HOURS = formatTime(timeInSeconds(projectData.HOURS) + totalSeconds)
      }
    })

    // Calculate the percentages for each project in each day
    processedData.forEach((dayData) => {
      const totalDaySeconds = timeInSeconds(dayData.totalDayHours)
      dayData.projects.forEach((projectData) => {
        const projectSeconds = timeInSeconds(projectData.HOURS)
        projectData.PERCENTAGE = `${((projectSeconds / totalDaySeconds) * 100).toFixed(0)}%`
      })
    })

    setMonthlyReportData(processedData)
  }

  function getAssigns() {
    if (!local) {
      console.log('Local variable is not available')
      return
    }
    let filteredAssignedProjects = []

    fetch(`${BASE_URL}/api/get_assign_projects`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredAssignedProjects = data.Project_Assigns
        } else if (local.Users.role === 3) {
          filteredAssignedProjects = data.Project_Assigns.filter(
            (user) => user.company_id === local.Users.company_id,
          )
        } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
          filteredAssignedProjects = data.Project_Assigns.filter(
            (user) => user.assign_projects_user_id === local.Users.user_id,
          )
        }
        setTotalNumberOfProjects(filteredAssignedProjects.length)
      })
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    getMonthlyReport()
    getAssigns()
  }, [userId])

  const handleDownloadCSV = () => {
    // Flatten the nested data structure
    const flattenedData = monthlyReportData
      .map((item) => {
        const flattenedProjects = item.projects.map((project) => ({
          DATE: item.date,
          'TOTAL DAY HOURS': item.totalDayHours,
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
      header: true,
    })

    const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
    saveAs(csvBlob, 'Monthly-Report.csv')
  }

  return (
    <Box>
      <Box className="row">
        <Box className="col-md 6">
          <Typography variant="h4">Monthly Reports</Typography>
        </Box>
      </Box>
      <Box className="row justify-content-end">
        <Box className="col-md-5">
          <Button type="default" style={arrowStyle} icon={<ArrowLeftOutlined />} />
          &nbsp;
          <Button type="default" style={arrowStyle} icon={<ArrowRightOutlined />} />
          &nbsp;
          <RangePicker />
          &nbsp; &nbsp;
          <Button type="default">Today</Button>
          &nbsp; &nbsp;
          <Button variant="contained" color="primary">
            Filters
          </Button>
        </Box>
      </Box>
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
                TOTAL HOURS OF MONTH
              </Typography>
              <Typography variant="h4" sx={subhead}>
                {totalWorkingHoursOfMonth}
              </Typography>
            </Box>
            <Box className="col-md-3">
              <Typography variant="h6" sx={head}>
                ASSIGNED PROJECTS
              </Typography>
              <Typography variant="h4" sx={subhead}>
                1
              </Typography>
            </Box>
          </Box>
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
            <Typography
              sx={{ flex: '1 1 100%', color: 'blue' }}
              variant="h4"
              id="tableTitle"
              component="div"
            >
              COMPANY NAME <span style={{ fontSize: 'small', color: 'gray' }}>LOCATION</span>
            </Typography>{' '}
            <Tooltip title="Generate Report">
              <IconButton>
                <FileDownloadIcon onClick={handleDownloadCSV} />
              </IconButton>
            </Tooltip>
          </Toolbar>

          <Box className="row" style={{ width: '90%', margin: 'auto' }}>
            <Box className="col-md-6">
              <Typography variant="h5" sx={head}>
                EMPLOYEE NAME
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Muhammad Jahanzaib Baig
              </Typography>
            </Box>
            <Box className="col-md-6">
              <Typography variant="h5" sx={head}>
                MONTH
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                June, 2023.
              </Typography>
            </Box>
            <hr />
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
                      <TableCell style={{ fontSize: 'large' }}>{item.totalDayHours}</TableCell>
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
    </Box>
  )
}
