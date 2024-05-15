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
import {FormLabel } from '@mui/material'
import Card from '@mui/joy/Card'
import { saveAs } from 'file-saver'
import NoRecordsMessegeComponent from 'src/components/noRecordsMessegeComponent/NoRecordsMessegeComponent'
import InitialMessegeForCompany from 'src/components/intialMessegeForCompany/InitialMessegeForCompany'
const BASE_URL = process.env.REACT_APP_BASE_URL
dayjs.extend(customParseFormat)
const Allreports = () => {
  const buttonStyle = {
    padding: '2px',
    width: '240px',
    fontWeight: 'bold',
  }
  const cardStyle = {
    width: '100%',
  }
    const [company_id , setCompanyId] = useState('')
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

    useEffect(() => {
        if (perm.some((item) => item.name === 'Comp any_Data')) {
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

     // Initial rendering through useEffect
     useEffect(() => {
      setCompanyId(local.Users.company_id)
      getUsers(local.Users.company_id)
      // console.log(company_id);
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
    setNotFoundMessage(true)
    setFromSelectedDate("");
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
          console.log('Data', data)
          setReport(data);
          console.log('Report', report);
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
        <h2 className='col-md-6'>Team Reports</h2>
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
                <Card>REPORT</Card>
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

export default Allreports