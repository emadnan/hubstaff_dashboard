import { React, useState, useEffect, useCallback } from 'react'
import { Button, DatePicker, Select, Form } from 'antd'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import Box from '@mui/joy/Box'
import Divider from '@mui/joy/Divider'
import Typography from '@mui/joy/Typography'
import dayjs from 'dayjs'
import { Card } from '@mui/material'
import NoRecordsMessegeComponent from 'src/components/noRecordsMessegeComponent/NoRecordsMessegeComponent'
import InitialMessegeForCompany from 'src/components/intialMessegeForCompany/InitialMessegeForCompany'
const BASE_URL = process.env.REACT_APP_BASE_URL
dayjs.extend(customParseFormat)

const Dayend = () => {
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
        getReport(dateString)
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
        getReport(todayDate)
    }

    // Array Declaration for API Calls
    const [users, setUsers] = useState([])
    const [dayendreport, setDayendReport] = useState([])
    const [user_id, setUserId] = useState('')
    const [notfoundmessage, setNotFoundMessage] = useState(true)

    // Images URLs State
    const [imagesUrls, setImagesUrls] = useState([])

    // Initial rendering through useEffect
    useEffect(() => {
        getUsers()
    }, [])

    // Get API Calls
    function getUsers() {
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

    async function getReport(date) {
        try {
            const response = await fetch(`${BASE_URL}/api/getDayEndReportById/${user_id}/${date}`);

            const data = await response.json();

            if (data.dayEndReport.length === 0) {
                setNotFoundMessage(true);
            } else {
                setNotFoundMessage(false);
                console.log('Data', data)
                setDayendReport(data.dayEndReport);
                console.log('Report', dayendreport);
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

    return (
        <>
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
                                disabledDate={disabledDate}
                                clearIcon={null}
                                style={{
                                    width: '100%',
                                }}
                            />
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
                </div>

            </Box>
        </>
    )
}

export default Dayend
