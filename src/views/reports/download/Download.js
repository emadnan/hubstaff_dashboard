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
import html2pdf from 'html2pdf.js'
import { Button } from '@mui/material'

export default function Download() {

    const buttonStyle = {
        padding: '2px',
        width: '240px',
        fontWeight: 'bold',
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
        const [dayendreport, setDayendReport] = useState([])
        const [user_id, setUserId] = useState('')
        const [notfoundmessage, setNotFoundMessage] = useState(true)
    
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
            setSelectedDate(null)
            setIsRecordNotFound(false)
            const today = new Date()
            const day = today.getDate()
            const month = today.getMonth() + 1
            const year = today.getFullYear()
            const todayDate = `${year}-${month}-${day}`
            // getReport(todayDate)
        }

        const onDateChange = (date, dateString) => {
            setSelectedDate(dateString)
            setIsAdminLogin(true)
            setSelectedDate(dateString)
            // getReport(dateString)
            console.log(dateString);
        }

      const handleExport = () => {
        console.log('EXCEL Download');
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
                <h2>Day-End Reports</h2>
                <br></br>
                <div className="row mt-2 mb-2 justify-content-between">
                    <div className="col-md-4">
                        <div className="d-flex align-items-center">
                            <DatePicker
                                value={selectedDate ? dayjs(selectedDate, 'YYYY-MM-DD') : null}
                                onChange={onDateChange}
                                disabled={!user_id}
                                clearIcon={null}
                                style={{
                                    width: '100%',
                                }}
                            />
                            <Button type="default" onClick={onTodayButtonClicked} className="ml-2 bg-white p-0 color-secondary">
                                Today
                            </Button>
                        </div>
                    </div>
                    </div>

                    {/* <div className="col-md-4">
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

                <Divider />

                <div>
                    {
                        user_id ? (
                            notfoundmessage ? (
                                renderNoRecordFoundMessage()
                            ) : (
                                <Card>
                                    <div className="report-card">
                                        <h4 className='mt-3 ml-5'>Report Summary</h4>
                                        <br></br>
                                        {dayendreport.map((data, index) => (
                                            <div key={index} className="report-item ml-5 mt-1">
                                                <span>&#8227;</span>  {data.day_report}
                                            </div>
                                        ))}
                                        <br></br>
                                    </div>
                                </Card>
                            )
                        ) : (
                            renderInitialMessage()
                        )
                    }
                </div> */}

            </Box>
            </>
    )

}

