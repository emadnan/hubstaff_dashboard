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
        <Box>
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
                </Box>
            </Box>
            <Box>
                <button className="btn btn-primary mt-5" style={buttonStyle} onClick={handleExport}>
                    Download Report
                </button>
            </Box>
        </Box>
    )

}

