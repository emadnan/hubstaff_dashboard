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
import { saveAs } from 'file-saver'
import json2csv from 'json2csv'
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

const data = [
  {
    DATE: 'THU, 01-JUNE-2023',
    'TOTAL DAY HOURS': '06:30',
    PROJECTS: [
      { PROJECT: 'TIME TACKER', HOURS: '04:30', PERCENTAGE: '45%' },
      { PROJECT: 'CARDIFY', HOURS: '02:00', PERCENTAGE: '25%' },
      { PROJECT: 'OFFICE WORK', HOURS: '-', PERCENTAGE: '0%' },
    ],
  },
  {
    DATE: 'FRI, 02-JUNE-2023',
    'TOTAL DAY HOURS': '07:15',
    PROJECTS: [
      { PROJECT: 'PROJECT A', HOURS: '05:45', PERCENTAGE: '60%' },
      { PROJECT: 'PROJECT B', HOURS: '01:30', PERCENTAGE: '15%' },
      { PROJECT: 'PROJECT C', HOURS: '00:00', PERCENTAGE: '0%' },
    ],
  },
  {
    DATE: 'SAT, 03-JUNE-2023',
    'TOTAL DAY HOURS': '08:00',
    PROJECTS: [
      { PROJECT: 'PROJECT X', HOURS: '06:00', PERCENTAGE: '75%' },
      { PROJECT: 'PROJECT Y', HOURS: '01:30', PERCENTAGE: '18%' },
      { PROJECT: 'PROJECT Z', HOURS: '00:30', PERCENTAGE: '7%' },
    ],
  },
  {
    DATE: 'SUN, 04-JUNE-2023',
    'TOTAL DAY HOURS': '05:45',
    PROJECTS: [
      { PROJECT: 'PROJECT P', HOURS: '04:30', PERCENTAGE: '70%' },
      { PROJECT: 'PROJECT Q', HOURS: '01:00', PERCENTAGE: '17%' },
      { PROJECT: 'PROJECT R', HOURS: '00:15', PERCENTAGE: '3%' },
    ],
  },
  {
    DATE: 'MON, 05-JUNE-2023',
    'TOTAL DAY HOURS': '09:15',
    PROJECTS: [
      { PROJECT: 'PROJECT M', HOURS: '07:30', PERCENTAGE: '80%' },
      { PROJECT: 'PROJECT N', HOURS: '01:45', PERCENTAGE: '19%' },
      { PROJECT: 'PROJECT O', HOURS: '-', PERCENTAGE: '0%' },
    ],
  },
  // Add more records...
]

export default function Dashboard() {
  const handleDownloadCSV = () => {
    // Flatten the nested data structure
    const flattenedData = data
      .map((item) => {
        const flattenedProjects = item.PROJECTS.map((project) => ({
          DATE: item.DATE,
          'TOTAL DAY HOURS': item['TOTAL DAY HOURS'],
          PROJECT: project.PROJECT,
          HOURS: project.HOURS,
          PERCENTAGE: project.PERCENTAGE,
        }))

        return flattenedProjects
      })
      .flat()

    // Generate the CSV data
    const csvData = json2csv.parse(flattenedData, {
      fields: ['DATE', 'TOTAL DAY HOURS', 'PROJECT', 'HOURS', 'PERCENTAGE'],
      header: true,
    })

    const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8' })
    saveAs(csvBlob, 'Monthly-Report.csv')
  }
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
                <FileDownloadIcon onClick={handleDownloadCSV} />
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
                    <TableCell sx={tableHeaderCellStyle}>PROJECTS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((item) => (
                    <TableRow key={item.DATE}>
                      <TableCell>{item.DATE}</TableCell>
                      <TableCell>{item['TOTAL DAY HOURS']}</TableCell>
                      <TableCell>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={tableHeaderCellStyle}>PROJECT</TableCell>
                              <TableCell sx={tableHeaderCellStyle}>HOURS</TableCell>
                              <TableCell sx={tableHeaderCellStyle}>PERCENTAGE</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {item.PROJECTS.map((project, index) => (
                              <TableRow key={index}>
                                <TableCell>{project.PROJECT}</TableCell>
                                <TableCell>{project.HOURS}</TableCell>
                                <TableCell>{project.PERCENTAGE}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
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
