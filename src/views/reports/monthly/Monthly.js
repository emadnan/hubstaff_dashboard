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
    fontSize: 'medium',
    fontWeight: 'bold',
  },
}

const tableData = [
  {
    dateRow: 'THU, 01-JUNE-2023',
    totalWorkedRow: '06:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:30', '02:00', '-'],
    activityRows: ['45%', '25%', '0%'],
  },
  {
    dateRow: 'FRI, 02-JUNE-2023',
    totalWorkedRow: '05:45',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:45', '-', '02:00'],
    activityRows: ['40%', '0%', '20%'],
  },
  {
    dateRow: 'SAT, 03-JUNE-2023',
    totalWorkedRow: '05:15',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:00', '01:00', '00:15'],
    activityRows: ['50%', '10%', '5%'],
  },
  {
    dateRow: 'SUN, 04-JUNE-2023',
    totalWorkedRow: '04:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:00', '-', '01:00'],
    activityRows: ['37.5%', '0%', '12.5%'],
  },
  {
    dateRow: 'MON, 05-JUNE-2023',
    totalWorkedRow: '06:15',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:15', '01:00', '01:00'],
    activityRows: ['55%', '10%', '10%'],
  },
  {
    dateRow: 'TUE, 06-JUNE-2023',
    totalWorkedRow: '07:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:30', '00:30', '02:00'],
    activityRows: ['65%', '5%', '20%'],
  },
  {
    dateRow: 'WED, 07-JUNE-2023',
    totalWorkedRow: '06:45',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:45', '-', '03:00'],
    activityRows: ['60%', '0%', '30%'],
  },
  {
    dateRow: 'THU, 08-JUNE-2023',
    totalWorkedRow: '06:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:00', '02:00', '-'],
    activityRows: ['50%', '25%', '0%'],
  },
  {
    dateRow: 'FRI, 09-JUNE-2023',
    totalWorkedRow: '06:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:30', '-', '02:00'],
    activityRows: ['55%', '0%', '25%'],
  },
  {
    dateRow: 'SAT, 10-JUNE-2023',
    totalWorkedRow: '05:45',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:45', '01:00', '01:00'],
    activityRows: ['45%', '10%', '10%'],
  },
  {
    dateRow: 'SUN, 11-JUNE-2023',
    totalWorkedRow: '04:15',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:15', '-', '01:00'],
    activityRows: ['38%', '0%', '14%'],
  },
  {
    dateRow: 'MON, 12-JUNE-2023',
    totalWorkedRow: '06:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:00', '01:00', '01:00'],
    activityRows: ['50%', '10%', '10%'],
  },
  {
    dateRow: 'TUE, 13-JUNE-2023',
    totalWorkedRow: '07:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['05:00', '01:30', '01:00'],
    activityRows: ['67%', '15%', '10%'],
  },
  {
    dateRow: 'WED, 14-JUNE-2023',
    totalWorkedRow: '06:45',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:45', '-', '02:00'],
    activityRows: ['60%', '0%', '20%'],
  },
  {
    dateRow: 'THU, 15-JUNE-2023',
    totalWorkedRow: '06:15',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:15', '01:00', '01:00'],
    activityRows: ['55%', '10%', '10%'],
  },
  {
    dateRow: 'FRI, 16-JUNE-2023',
    totalWorkedRow: '05:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:30', '-', '02:00'],
    activityRows: ['50%', '0%', '20%'],
  },
  {
    dateRow: 'SAT, 17-JUNE-2023',
    totalWorkedRow: '05:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:00', '01:00', '-'],
    activityRows: ['45%', '10%', '0%'],
  },
  {
    dateRow: 'SUN, 18-JUNE-2023',
    totalWorkedRow: '04:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:30', '-', '01:00'],
    activityRows: ['40%', '0%', '10%'],
  },
  {
    dateRow: 'MON, 19-JUNE-2023',
    totalWorkedRow: '06:15',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:15', '01:00', '01:00'],
    activityRows: ['55%', '10%', '10%'],
  },
  {
    dateRow: 'TUE, 20-JUNE-2023',
    totalWorkedRow: '07:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['05:00', '01:00', '01:00'],
    activityRows: ['65%', '10%', '10%'],
  },
  {
    dateRow: 'WED, 21-JUNE-2023',
    totalWorkedRow: '06:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:30', '-', '02:00'],
    activityRows: ['60%', '0%', '20%'],
  },
  {
    dateRow: 'THU, 22-JUNE-2023',
    totalWorkedRow: '06:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:00', '01:00', '01:00'],
    activityRows: ['55%', '10%', '10%'],
  },
  {
    dateRow: 'FRI, 23-JUNE-2023',
    totalWorkedRow: '05:45',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:45', '-', '02:00'],
    activityRows: ['50%', '0%', '20%'],
  },
  {
    dateRow: 'SAT, 24-JUNE-2023',
    totalWorkedRow: '05:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:30', '01:00', '-'],
    activityRows: ['45%', '10%', '0%'],
  },
  {
    dateRow: 'SUN, 25-JUNE-2023',
    totalWorkedRow: '04:45',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:45', '-', '01:00'],
    activityRows: ['42.5%', '0%', '10%'],
  },
  {
    dateRow: 'MON, 26-JUNE-2023',
    totalWorkedRow: '06:15',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:15', '01:00', '01:00'],
    activityRows: ['55%', '10%', '10%'],
  },
  {
    dateRow: 'TUE, 27-JUNE-2023',
    totalWorkedRow: '07:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['05:00', '01:30', '01:00'],
    activityRows: ['67%', '15%', '10%'],
  },
  {
    dateRow: 'WED, 28-JUNE-2023',
    totalWorkedRow: '06:45',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:45', '-', '02:00'],
    activityRows: ['60%', '0%', '20%'],
  },
  {
    dateRow: 'THU, 29-JUNE-2023',
    totalWorkedRow: '06:00',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['04:00', '01:00', '01:00'],
    activityRows: ['55%', '10%', '10%'],
  },
  {
    dateRow: 'FRI, 30-JUNE-2023',
    totalWorkedRow: '05:30',
    projectRows: ['TIME TACKER', 'CARDIFY', 'OFFICE WORK'],
    totalWorkedOnProjectsRows: ['03:30', '-', '02:00'],
    activityRows: ['50%', '0%', '20%'],
  },
  // Continue with remaining days of June...
]

export default function Dashboard() {
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
                    <TableCell sx={tableHeaderCellStyle} colSpan={3}>
                      PROJECTS
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((data, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        <TableCell rowSpan={data.projectRows.length + 1}>
                          <Typography variant="h6" sx={subhead}>
                            {data.dateRow}
                          </Typography>
                        </TableCell>
                        <TableCell rowSpan={data.projectRows.length + 1}>
                          <Typography variant="h6" sx={subhead}>
                            {data.totalWorkedRow}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      {data.projectRows.map((project, projectIndex) => (
                        <TableRow key={projectIndex}>
                          <TableCell>{project}</TableCell>
                          <TableCell>{data.totalWorkedOnProjectsRows[projectIndex]}</TableCell>
                          <TableCell>{data.activityRows[projectIndex]}</TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
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
