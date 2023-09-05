import { React, useState, useEffect } from 'react';
import './Changepassword.css';
import TextField from '@mui/material/TextField';
import { Button } from 'antd';
import Alert from '@mui/material/Alert'

const BASE_URL = process.env.REACT_APP_BASE_URL
 
const Changepassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [apiMessage, setApiMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('')

  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const session_token = session.token

  const alertStyle = {
    position: 'fixed',
    top: '85%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  async function changepassword() {
    const data = {
      oldPassword,
      newPassword,
      confirmPassword
    };
    try {
      const response = await fetch(`${BASE_URL}/api/resetPassword`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session_token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        message = data.message
        handleOpenAlert(message);
      } else {
        const errorData = await response.json();
        setApiMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('An error occurred while fetching data', error);
      setApiMessage('An error occurred while making the request.');
    } finally {
      setLoading(false);
    }
  }

  const [showAlert, setShowAlert] = useState(false)

  const handleOpenAlert = () => {
    setShowAlert(true)
  }

  const handleCloseAlert = () => {
    setShowAlert(false)
  }

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert])

  return (
    <>
    <div>
    <div className='body'>
      <div className="forget-form-container">
        <h2 className='forget-form-container-h2'>Forgot Your Password?</h2>
          <p className='forget-form-container-p'>Enter Your Current  And Old Password To Reset Your Password.</p>
          <form className='forget-form-container-form'>
            <div className="container">
              <div className="row">
                <div className="col-sm-4">
                  <div className="form-group pass_show">
                    <TextField 
                      id="oldPassword" 
                      label="Current Password" 
                      variant="standard"
                      type='password'
                      value={oldPassword}
                      style={{width:"460px", height:"40px", marginTop: "20px"}}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Enter Email"
                       
                    />
                  </div>
                  <div className="form-group pass_show">
                  <TextField 
                    id="newPassword" 
                    label="New Password" 
                    variant="standard"
                    type='password'
                    value={newPassword}
                    style={{width:"460px", height:"40px", marginTop: "20px" }}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter Email" 
                    />
                  </div>
                  <div className="form-group pass_show">
                    <TextField 
                      id="confirmPassword" 
                      label="Confirm Password" 
                      variant="standard" 
                      type='password'
                      value={confirmPassword}
                      style={{width:"460px", height:"40px", marginTop: "20px" }}
                      onChange={(e) => setconfirmPassword(e.target.value)}
                      placeholder="Enter Email" 
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-grid">
                      
                      <Button onClick={changepassword} style={{width:"160px", height:"40px", marginTop: "20px", marginLeft: "100%",  backgroundColor: "#007bff", color: "#ffffff" }} variant="contained" color="primary" disableElevation>
                        Change Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {showAlert && (
        <Alert onClose={handleCloseAlert} severity="success" style={alertStyle}>{message}</Alert>
      )}
      </div>
    </div>
    
    </>
  );
};

export default Changepassword;
