import React from 'react'
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
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@mui/icons-material'
import { DatePicker, Button, Card } from 'antd'
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
    fontWeight: 'bold',
  },
}

const tableData = [
  { label: 'PROJECTS', value: 'TIME TRACKER, CARDIFY, OFFICE WORK' },
  { label: 'EMPLOYEE NAME', value: 'JHON DOE' },
  { label: 'WORKING HOURS ON TIME TRACKER', value: '03:00' },
  { label: 'WORKING HOURS ON CARDIFY', value: '01:00' },
  { label: 'WORKING HOURS ON OFFICE WORK', value: '02:00' },
]

export default function Dashboard() {
  return (
    <Box>
      <Box className="row">
        <Box className="col-md 6">
          <Typography variant="h4">Daily Reports</Typography>
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
            <Box className="col-md-4">
              <Typography variant="h6" sx={head}>
                ASSIGNED PROJECTS
              </Typography>
              <Typography variant="h4" sx={subhead}>
                3
              </Typography>
            </Box>
            <Box className="col-md-4">
              <Typography variant="h6" sx={head}>
                DAY HOURS
              </Typography>
              <Typography variant="h4" sx={subhead}>
                06:00
              </Typography>
            </Box>
            <Box className="col-md-4">
              <Typography variant="h6" sx={head}>
                DAY ACTIVITY
              </Typography>
              <Typography variant="h4" sx={subhead}>
                80%
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
                <FileDownloadIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <div style={{ width: '90%', margin: 'auto', justifyItems: 'center' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650, mb: 4 }}>
                <TableBody>
                  {tableData.map((item) => (
                    <TableRow key={item.label}>
                      <TableCell component="th" scope="row" sx={tableHeaderCellStyle}>
                        {item.label}
                      </TableCell>
                      <TableCell>{item.value}</TableCell>
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
