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
import TableHead from '@mui/material/TableHead'
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
    textAlign: 'right',
  },
}

function createData(
  projectName,
  weekDay1,
  weekDay2,
  weekDay3,
  weekDay4,
  weekDay5,
  weekDay6,
  totalWeekHours,
  persentageWeeklyPerformance,
) {
  return {
    projectName,
    weekDay1,
    weekDay2,
    weekDay3,
    weekDay4,
    weekDay5,
    weekDay6,
    totalWeekHours,
    persentageWeeklyPerformance,
  }
}

const rows = [
  createData('TIME TRACKER', '03:30', '-', '04:00', '-', '-', '-', '07:30', '82%'),
  createData('CARDIFY', '03:30', '-', '02:00', '-', '01:30', '-', '07:00', '72%'),
  createData('OFFICE WORK', '03:30', '02:00', '02:00', '-', '01:30', '-', '08:00', '62%'),
]

const tableData = [
  {
    mainRow: 'THU, 08-JUNE-2023',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedRows: ['04:00', '02:00', '-'],
    activityRows: ['50%', '25%', '0%'],
  },
  {
    mainRow: 'FRI, 09-JUNE-2023	',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedRows: ['02:00', '-', '04:00'],
    activityRows: ['25%', '0%', '50%'],
  },
  // Add more data objects as needed
]

export default function Dashboard() {
  return (
    <Box>
      <Box className="row">
        <Box className="col-md 6">
          <Typography variant="h4">Weekly Reports</Typography>
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
                ASSIGNED PROJECTS
              </Typography>
              <Typography variant="h4" sx={subhead}>
                1
              </Typography>
            </Box>
            <Box className="col-md-3">
              <Typography variant="h6" sx={head}>
                AVG. HOURS PER DAY
              </Typography>
              <Typography variant="h4" sx={subhead}>
                5:35
              </Typography>
            </Box>
            <Box className="col-md-3">
              <Typography variant="h6" sx={head}>
                AVG. ACTIVITY
              </Typography>
              <Typography variant="h4" sx={subhead}>
                82%
              </Typography>
            </Box>
            <Box className="col-md-3">
              <Typography variant="h6" sx={head}>
                EARNING
              </Typography>
              <Typography variant="h4" sx={subhead}>
                -
              </Typography>
            </Box>
          </Box>
        </Card>
      </Box>
      <Box sx={{ width: '100%', mt: 2 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
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

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>DATE</TableCell>
                <TableCell>PROJECTS</TableCell>
                <TableCell>TOTAL WORKED</TableCell>
                <TableCell>ACTIVITY</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.map((data, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell rowSpan={3}>{data.mainRow}</TableCell>
                    <TableCell>{data.projectRows[0]}</TableCell>
                    <TableCell>{data.totalWorkedRows[0]}</TableCell>
                    <TableCell>{data.activityRows[0]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{data.projectRows[1]}</TableCell>
                    <TableCell>{data.totalWorkedRows[1]}</TableCell>
                    <TableCell>{data.activityRows[1]}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{data.projectRows[2]}</TableCell>
                    <TableCell>{data.totalWorkedRows[2]}</TableCell>
                    <TableCell>{data.activityRows[2]}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  )
}
