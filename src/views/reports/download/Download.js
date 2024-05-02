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
import { DatePicker,Select, Form } from 'antd'
import { Card } from '@mui/material'
import { saveAs } from 'file-saver'
import json2csv from 'json2csv'
import moment from 'moment'
import dayjs from 'dayjs'
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp'
import html2pdf from 'html2pdf.js'
import { Button } from 'antd'
import NoRecordsMessegeComponent from 'src/components/noRecordsMessegeComponent/NoRecordsMessegeComponent'
import InitialMessegeForCompany from 'src/components/intialMessegeForCompany/InitialMessegeForCompany'
const BASE_URL = process.env.REACT_APP_BASE_URL

export default function Download() {

    const buttonStyle = {
        padding: '2px',
        width: '240px',
        fontWeight: 'bold',
      }
    const cardStyle = {
        width: '100%',
    }
      
    const [isEmployeeSelected, setIsEmployeeSelected] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [isRecordNotFound, setIsRecordNotFound] = useState(false)
    const [isAdminLogin, setIsAdminLogin] = useState(true)

    const local = JSON.parse(localStorage.getItem('user-info'))
    const permissions = local.permissions
    const perm = permissions.map((permission) => ({
      name: permission.name,
    }))

        // Array Declaration for API Calls
        const [users, setUsers] = useState([])
        const [report, setReport] = useState([])
        const [user_id, setUserId] = useState('')
        const [notfoundmessage, setNotFoundMessage] = useState(true)
        const [offline , setOffline] = useState(false)
        const [online , setOnline] = useState(false)
        const [all_users , setAllUsers] = useState(false)
        const [default_api , setDefaultApi] = useState(true)
    
        // Images URLs State
        const [imagesUrls, setImagesUrls] = useState([])
  
        useEffect(() => {
            if (perm.some((item) => item.name === 'Company_Data')) {
                setIsAdminLogin(false)
            } else if (perm.some((item) => item.name === 'User_Data')) {
                setUserId(local.Users.user_id)
            }
        }, [])

        function onTodayButtonClicked() {
            setIsAdminLogin(true)
            // setSelectedDate(null)
            setIsRecordNotFound(false)
            // const today = new Date()
            // const day = today.getDate()
            // const month = today.getMonth() + 1
            // const year = today.getFullYear()
            // const todayDate = `${year}-${month}-${day}`
            // setSelectedDate(todayDate)
            // console.log(selectedDate);
            getReport(selectedDate)
        }

        async function getReport(date) {
        try {
            const response = await fetch(`${BASE_URL}/api/get-daily-report-of-users-for-teamlead/${user_id}/${date}`);

            const data = await response.json();

            if (data.data.length === 0) {
                setNotFoundMessage(true);
            } else {
                setNotFoundMessage(false);
                console.log('Data', data)
                setReport(data.data);
                console.log('Report', report);
            }
        } catch (error) {
            console.log(error);
        }
    }

        const onDateChange = (date, dateString) => {
            setIsAdminLogin(true)
            setSelectedDate(dateString)
            getReport(dateString)
        }

      const handleExport = () => {
        console.log('EXCEL Download');
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
        {/* <Box>
            <Box className="row">
                <Box className="col-md 6">
                <Typography variant="h4">Download Reports</Typography>
                </Box>
            </Box>
            <Box className="row justify-content-between" sx={{ mt: 1 }}>
                <Box className="col-md-3">
                <DatePicker
                    value={selectedDate ? dayjs(selectedDate, 'YYYY-MM-DD') : null}
                    onChange={onDateChange}
                    disabled={!user_id}
                    clearIcon={null}
                    style={{
                        width: '100%',
                    }}
                />
                <Button type="default" onClick={onTodayButtonClicked} className="ml-2">
                    Today
                </Button>
                </Box>
            </Box>
            <Box>
                <button className={selectedDate ? "btn btn-primary mt-5" : "btn btn-secondary mt-5" } style={buttonStyle} onClick={handleExport}>
                    Download Report
                </button>
            </Box>
        </Box> */}
        <Box>
                <h2>Download Reports</h2>
                <br></br>
                <div className="row mt-2 mb-2 justify-content-between">
                    <div className="col-md-6">
                        <div className="d-flex align-items-center">
                            <DatePicker
                                value={selectedDate ? dayjs(selectedDate, 'YYYY-MM-DD') : null}
                                onChange={onDateChange}
                                disabled={!user_id}
                                clearIcon={null}
                                style={{
                                    width: '100%',
                                    marginRight: '10px'
                                }}
                            />
                            <Form
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Select placeholder="Filter Members...">
                                    <Select.Option>
                                        All Members
                                    </Select.Option>
                                    <Select.Option>
                                        Online Members
                                    </Select.Option>
                                    <Select.Option>
                                        Offline Members
                                    </Select.Option>
                                </Select>
                            </Form>
                            <Button  style={{ width: '100%', }}  onClick={onTodayButtonClicked}>
                            Get Report
                            </Button>
                           
                        </div>
                    </div>
                    <Button className={selectedDate ? "btn btn-primary float-right" : "btn btn-secondary text-light float-right" } disabled={!selectedDate} style={buttonStyle} onClick={handleExport}>
                        Download Report
                    </Button>
                </div>



                <div>
                    {
                        selectedDate ? (
                            notfoundmessage ? (
                                <Box mt={5}>
                                <Card style={cardStyle}>
                                  <Box className="row">
                                    <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                      NO RECORDS FOUND
                                    </Typography>
                                  </Box>
                                </Card>
                              </Box>
                            ) : (
                            <Box mt={5}>
                                <Card>
                                    <div className="report-card ">
                                        <h4 className='mt-3 ml-5'>Report Summary</h4>
                                        <br></br>
                                            <div className="report-item ml-5 mt-1">
                                                {/* <span>&#8227;</span>  {data.name} */}
                                                <Table>
                                                    <TableHead>
                                                        <TableCell>
                                                            Name
                                                        </TableCell>
                                                        <TableCell>
                                                            Email
                                                        </TableCell>
                                                        <TableCell>
                                                            Online Time
                                                        </TableCell>
                                                    </TableHead>
                                                    <TableBody>
                                        {report.map((data, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                {data.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {data.email}
                                                            </TableCell>
                                                            <TableCell>
                                                                {data.totalHours}:{data.totalMinutes}:{data.totalSeconds}
                                                            </TableCell>
                                                        </TableRow>
                                        ))}

                                                    </TableBody>
                                                </Table>
                                            </div>
                                        <br></br>
                                    </div>
                                </Card>
                            </Box>
                            )
                        ) : (
                            <Box mt={5}>
                                <Card style={cardStyle}>
                                <Box className="row">
                                    <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }} className='p-2'>
                                    PLEASE SELECT THE DATE TO GENERATE THE REPORT
                                    </Typography>
                                </Box>
                                </Card>
                            </Box>
                        )
                    }
                </div>

            </Box>
            </>
    )

}

