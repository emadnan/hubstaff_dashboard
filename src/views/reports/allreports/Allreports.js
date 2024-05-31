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
    const [isAdminLogin, setIsAdminLogin] = useState(true)

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

  function onDateChange(date, dateString) {
    setIsAdminLogin(true)
    setSelectedDate(dateString)
    setReport([])
    console.log(dateString);
      setExportDisable(true)
}

    // Array Declaration for API Calls
    const [users, setUsers] = useState([])
    const [report, setReport] = useState([])
    const [user_id, setUserId] = useState('')
    const [notfoundmessage, setNotFoundMessage] = useState(true)
    const [export_disable, setExportDisable] = useState(true)

     // Initial rendering through useEffect
     useEffect(() => {
      setCompanyId(local.Users.company_id)
      getUsers(local.Users.company_id)
  }, [])

  const handleExport = () => {
        const modifiedReport = report.data.map((item) => (
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
        // if(selectedDate === null) {
        //     const today = new Date()
        //     const day = today.getDate()
        //     const month = today.getMonth() + 1
        //     const year = today.getFullYear()
        //     const todayDate = `${year}-${month}-${day}`
        //     saveAs(blob, `Report${[todayDate]}.xlsx`);
        // }
        // else {
            saveAs(blob, `Report${[selectedDate]}.xlsx`);
        // }
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
      const response = await fetch(`${BASE_URL}/api/get-all-users-report-by-company-id/${company_id}/${selectedDate}`);

      const data = await response.json();

      if (data.data.length === 0) {
          setNotFoundMessage(true);
          setExportDisable(true)
      } else {
          setExportDisable(false)
          setNotFoundMessage(true);
          setReport(data)
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
                <DatePicker
                    value={selectedDate ? dayjs(selectedDate, 'YYYY-MM-DD') : null}
                    onChange={onDateChange}
                    disabledDate={disabledDate}
                    clearIcon={null}
                    style={{
                        width: '100%',
                    }}
                />
                <Button type="default" onClick={getReport} className="ml-2">Get Report</Button>
            </div>
          </div>
    </div>

    <Divider/>
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
    </Box>
</>
  )
}

export default Allreports