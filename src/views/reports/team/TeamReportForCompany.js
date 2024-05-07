import { React, useState, useEffect, useCallback } from 'react'
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
import Typography from '@mui/joy/Typography'
import dayjs from 'dayjs'
import { Card } from '@mui/material'
import { saveAs } from 'file-saver'
import NoRecordsMessegeComponent from 'src/components/noRecordsMessegeComponent/NoRecordsMessegeComponent'
import InitialMessegeForCompany from 'src/components/intialMessegeForCompany/InitialMessegeForCompany'
const BASE_URL = process.env.REACT_APP_BASE_URL
dayjs.extend(customParseFormat)

const TeamReportForCompany = () => {
    const buttonStyle = {
        padding: '2px',
        width: '240px',
        fontWeight: 'bold',
      }
    const [company_id , setCompanyId] = useState('')
    // Local Storage data
    const local = JSON.parse(localStorage.getItem('user-info'))
    const permissions = local.permissions
    const perm = permissions.map((permission) => ({
        name: permission.name,
    }))

    const [isEmployeeSelected, setIsEmployeeSelected] = useState(false)
    const [selectedDate, setSelectedDate] = useState(null)
    const [isRecordNotFound, setIsRecordNotFound] = useState(false)
    const [isAdminLogin, setIsAdminLogin] = useState(true)
    const [api , setApi] = useState('get-daily-report-of-both-offline-or-online')

    useEffect(() => {
        if (perm.some((item) => item.name === 'Company_Data')) {
            setIsAdminLogin(false)
        } else if (perm.some((item) => item.name === 'User_Data')) {
            setUserId(local.Users.user_id)
        }
    }, [])

    function onDateChange(date, dateString) {
        setIsAdminLogin(true)
        setSelectedDate(dateString)
        getReport(api ,dateString)
    }

    function onTodayButtonClicked() {
        setIsAdminLogin(true)
        setSelectedDate(null)
        setIsRecordNotFound(false)
        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        const todayDate = `${year}-${month}-${day}`
        getReport(api , todayDate)
    }

    // Array Declaration for API Calls
    const [users, setUsers] = useState([])
    const [report, setReport] = useState([])
    const [user_id, setUserId] = useState('')
    const [notfoundmessage, setNotFoundMessage] = useState(true)
    const [export_disable, setExportDisable] = useState(true)

    // Images URLs State
    const [imagesUrls, setImagesUrls] = useState([])

    // Initial rendering through useEffect
    useEffect(() => {
        setCompanyId(local.Users.company_id)
        getUsers(local.Users.company_id)
        // console.log(company_id);
    }, [])

    // Get API Calls
    function getUsers(company_id) {
        fetchPromise(`${BASE_URL}/api/get-team-leads-by-company-id/${company_id}`)
            .then((response) => response.json())
            .then((data) => {
                let filteredUsers = []
                if (perm.some((item) => item.name === 'All_Data')) {
                    filteredUsers = data.team_leads
                } else if (perm.some((item) => item.name === 'Company_Data')) {
                    filteredUsers = data.team_leads.filter((user) => user.company_id === local.Users.company_id && user.email !== local.Users.email)
                } else if (perm.some((item) => item.name === 'User_Data')) {
                    filteredUsers = data.team_leads.filter((user) => user.id === user_id)
                }
                setUsers(filteredUsers)
            })
            .catch((error) => console.log(error))
    }

    async function getReport(api ,  date) {
        try {
            const response = await fetch(`${BASE_URL}/api/${api}/${user_id}/${date}`);

            const data = await response.json();

            if (data.length === 0) {
                setNotFoundMessage(true);
                setExportDisable(true)
            } else {
                setExportDisable(false)
                setNotFoundMessage(false);
                console.log('Data', data)
                setReport(data);
                console.log('Report', report);
            }
        } catch (error) {
            console.log(error);
        }
    }


    const handleUserChange = (value) => {
        setNotFoundMessage(true)
        setSelectedDate("");
        setIsEmployeeSelected(true)
        setIsAdminLogin(true)
        setUserId(value)
        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth() + 1
        const year = today.getFullYear()
        const todayDate = `${year}-${month}-${day}`
    }

    const handleClick = useCallback((imageUrl) => {
        let urls = imageUrl.map((url) => `${BASE_URL}/screenshots/${url.path_url}`)
        setImagesUrls(urls)
    }, [])

    // Helper function to wrap fetch in a Promise
    function fetchPromise(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => resolve(response))
                .catch((error) => reject(error))
        })
    }

    // Logic to concatenate the base URL with the image URL
    const url = (imageUrl) => {
        const concatinatedImage = `${BASE_URL}/screenshots/${imageUrl}`
        return concatinatedImage
    }

    // Disable Dates
    const disabledDate = (current) => {
        // Disable dates that are after the current date
        return current && current > dayjs().endOf('day')
    }

    // Static Messeges
    const renderInitialMessage = () => {
        return <InitialMessegeForCompany />
    }

    const renderNoRecordFoundMessage = () => {
        return <NoRecordsMessegeComponent />
    }

    const handleExport = () => {
      
        if(api === 'get-daily-report-of-users-for-teamlead') {
            const worksheet = XLSX.utils.json_to_sheet(report.data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Online Users");
        
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            if(selectedDate === null) {
                const today = new Date()
                const day = today.getDate()
                const month = today.getMonth() + 1
                const year = today.getFullYear()
                const todayDate = `${year}-${month}-${day}`
                saveAs(blob, `Online_users_report${[todayDate]}.xlsx`);
            }
            else {
                saveAs(blob, `Online_users_report${[selectedDate]}.xlsx`);
            }
        }
        else if(api === 'get-daily-report-of-offline-users-by-teamlead') {
            const worksheet = XLSX.utils.json_to_sheet(report.data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Offline Users");
        
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            if(selectedDate === null) {
                const today = new Date()
                const day = today.getDate()
                const month = today.getMonth() + 1
                const year = today.getFullYear()
                const todayDate = `${year}-${month}-${day}`
                saveAs(blob, `Offline_users_report[${todayDate}].xlsx`);
            }
            else {
                saveAs(blob, `Offline_users_report[${selectedDate}].xlsx`);
            }
        }
        else if(api === 'get-daily-report-of-both-offline-or-online') {
            const AllUsers = [...report.data, ...report.offlineUsers];
            const worksheet = XLSX.utils.json_to_sheet(AllUsers);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            if(selectedDate === null) {
                const today = new Date()
                const day = today.getDate()
                const month = today.getMonth() + 1
                const year = today.getFullYear()
                const todayDate = `${year}-${month}-${day}`
                saveAs(blob, `All_users_report[${todayDate}].xlsx`);
            }
            else {
                saveAs(blob, `All_users_report[${selectedDate}].xlsx`);
            }
        }
      }

    const handleMembers = (value)=> {
        setApi(value);
        if(selectedDate === null) {
            const today = new Date()
            const day = today.getDate()
            const month = today.getMonth() + 1
            const year = today.getFullYear()
            const todayDate = `${year}-${month}-${day}`
            getReport(value , todayDate);
        }
        else {
            getReport(value , selectedDate);
        }
      }

    return (
        <>
            <Box>
                <div className='row justify-content-between'>
                    <h2 className='col-md-6'>Team Reports</h2>
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
                                disabled={!user_id}
                                disabledDate={disabledDate}
                                clearIcon={null}
                                style={{
                                    width: '100%',
                                }}
                            />
                          
                            <Form
                                style={{
                                    width: '100%',
                                }}
                            >
                                <Select placeholder="Filter Members..." onChange={handleMembers}>
                                    <Select.Option value='get-daily-report-of-both-offline-or-online'>
                                        All Members
                                    </Select.Option>
                                    <Select.Option  value='get-daily-report-of-users-for-teamlead'>
                                        Online Members
                                    </Select.Option>
                                    <Select.Option  value='get-daily-report-of-offline-users-by-teamlead'>
                                        Offline Members
                                    </Select.Option>
                                </Select>
                            </Form>
                            <Button type="default" onClick={onTodayButtonClicked} className="ml-2">
                                Today
                            </Button>
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

                <Divider />

                <div>
                    {
                        user_id ? (
                            notfoundmessage ? (
                                renderNoRecordFoundMessage()
                            ) : (
                                <Card>
                                    <div className="report-card ">
                                        <h4 className='mt-3 ml-5'>Report Summary</h4>
                                        
                                        <br></br>
                                        {
                                            api === 'get-daily-report-of-users-for-teamlead' ? 
                                            <>
                                        <h6 className='mt-3 ml-5'>Online Members</h6>
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
                                    {report.data?.map((data, index) => (
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
                                        </>
                                         :
                                        api === 'get-daily-report-of-offline-users-by-teamlead' ?
                                        <>
                                            <h6 className='mt-3 ml-5'>Offline Members</h6>
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
                                                        </TableRow>
                                        ))}

                                                    </TableBody>
                                                </Table>
                                            </div>
                                            </>
                                             :
                                            <>
                                            {
                                                report.data?.length === 0 && report.offlineUsers?.length === 0  ? 
                                                <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                                                NO RECORDS FOUND
                                              </Typography>
                                                :
                                                    <>
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
                                                    {report.data?.map((online, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>
                                                                {online.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {online.email}
                                                            </TableCell>
                                                            <TableCell>
                                                                {online.totalHours}:{online.totalMinutes}:{online.totalSeconds}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                {report.offlineUsers?.map((data, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        {data.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        {data.email}
                                                    </TableCell>
                                                    <TableCell>---</TableCell>
                                                </TableRow>
                                                ))}

                                                    </TableBody>
                                                </Table>
                                            </div>
                                            </>
                                            }
                                    </>
                                            }
                                        <br></br>
                                    </div>
                                </Card>
                            )
                        ) : (
                            renderInitialMessage()
                        )
                    }
                </div>

            </Box>
        </>
    )
}

export default TeamReportForCompany
