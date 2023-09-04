import React, { useState } from 'react';
import './ForgetPassword.css'; // Import the CSS file
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from 'antd'
const BASE_URL = process.env.REACT_APP_BASE_URL

function ForgetPassword() {
  const [email, setEmail] = useState('');
  const [availability, setAvailability] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let data = {email}
      const response = await fetch(`${BASE_URL}/api/forGetPassword`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
      } else {
        // Handle error responses here
        console.error('API request failed');
      }
    } catch (error) {
      console.error('An error occurred while making the API request', error);
    }
  };

  return (
    <div className='body'>
      <div className="forget-form-container">
        <h2 className='forget-form-container-h2'>Forgot Your Password?</h2>
        <p className='forget-form-container-p'>Enter your email to reset your password.</p>
        <form className='forget-form-container-form'>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, width: '63ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField 
              id="Email" 
              label="Email" 
              variant="standard" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email" 
              />
            </Box>
            <Button onClick={handleSubmit} style={{width:"160px", height:"40px",  backgroundColor: "#007bff", color: "#ffffff" }} variant="contained" color="primary" disableElevation>
              Forget Password
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgetPassword;
