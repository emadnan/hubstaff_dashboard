import React from 'react'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import Typography from '@mui/joy/Typography'

export default function NoRecordsMessegeComponent() {
  const cardStyle = {
    width: '100%',
  }

  return (
    <>
      <Box mt={2}>
        <Card style={cardStyle}>
          <Box className="row">
            <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
              NO RECORDS FOUND
            </Typography>
          </Box>
        </Card>
      </Box>
    </>
  )
}
