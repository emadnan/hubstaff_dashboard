import React from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import Typography from '@mui/joy/Typography'

export default function InitialMessegeForCompany() {
  const cardStyle = {
    width: '100%',
  }

  return (
    <>
      <Box mt={2}>
        <Card style={cardStyle}>
          <Box className="row">
            <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
              PLEASE SELECT THE EMPLOYEE NAME FOR WHOM YOU WISH TO GENERATE THE REPORT
            </Typography>
          </Box>
        </Card>
      </Box>
    </>
  )
}
