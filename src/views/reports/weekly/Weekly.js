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
  createData('TIME TRACKER', '03:30', '-', '04:00', '-', '-', '-', '07:30', '62%'),
  createData('CARDIFY', '03:30', '-', '02:00', '-', '01:30', '-', '07:00', '72%'),
  createData('OFFICE WORK', '03:30', '02:00', '02:00', '-', '01:30', '-', '08:00', '82%'),
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
                3
              </Typography>
            </Box>
            <Box className="col-md-3">
              <Typography variant="h6" sx={head}>
                AVG. HOURS PER DAY
              </Typography>
              <Typography variant="h4" sx={subhead}>
                04:30
              </Typography>
            </Box>
            <Box className="col-md-3">
              <Typography variant="h6" sx={head}>
                WEEKLY ACTIVITY
              </Typography>
              <Typography variant="h4" sx={subhead}>
                72%
              </Typography>
            </Box>
            <Box className="col-md-3">
              <Typography variant="h6" sx={head}>
                TOTAL WORKS HOURS
              </Typography>
              <Typography variant="h4" sx={subhead}>
                15:30
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
                WEEK DETAILS
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Mon, 03-June-2023. to Fri, 09-June-2023
              </Typography>
            </Box>
            <hr />
          </Box>

          <div style={{ width: '90%', margin: 'auto', justifyItems: 'center' }}>
            <TableContainer>
              <Table sx={{ minWidth: 650, mb: 4 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>PROJECTS</TableCell>
                    <TableCell style={tableHeaderCellStyle}>MON, 05-JUNE-2023</TableCell>
                    <TableCell style={tableHeaderCellStyle}>TUE, 06-JUNE-2023</TableCell>
                    <TableCell style={tableHeaderCellStyle}>WED, 07-JUNE-2023</TableCell>
                    <TableCell style={tableHeaderCellStyle}>THU, 08-JUNE-2023</TableCell>
                    <TableCell style={tableHeaderCellStyle}>FRI, 09-JUNE-2023</TableCell>
                    <TableCell style={tableHeaderCellStyle}>SAT, 10-JUNE-2023</TableCell>
                    <TableCell style={tableHeaderCellStyle}>TOTAL WORKED</TableCell>
                    <TableCell style={tableHeaderCellStyle}>ACTIVITY</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.projectName}
                      </TableCell>
                      <TableCell style={tableHeaderCellStyle}>{row.weekDay1}</TableCell>
                      <TableCell style={tableHeaderCellStyle}>{row.weekDay2}</TableCell>
                      <TableCell style={tableHeaderCellStyle}>{row.weekDay3}</TableCell>
                      <TableCell style={tableHeaderCellStyle}>{row.weekDay4}</TableCell>
                      <TableCell style={tableHeaderCellStyle}>{row.weekDay5}</TableCell>
                      <TableCell style={tableHeaderCellStyle}>{row.weekDay6}</TableCell>
                      <TableCell style={tableHeaderCellStyle}>{row.totalWeekHours}</TableCell>
                      <TableCell style={tableHeaderCellStyle}>
                        {row.persentageWeeklyPerformance}
                      </TableCell>
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
