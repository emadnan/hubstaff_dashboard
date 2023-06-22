import { useState, React, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import BusinessIcon from '@mui/icons-material/Business'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import HttpsIcon from '@mui/icons-material/Https'
import MailIcon from '@mui/icons-material/Mail'
import { Box, TextField, Grid, IconButton, InputAdornment, Button, Typography } from '@mui/material'
const BASE_URL = process.env.REACT_APP_BASE_URL

const theme = createTheme()

const Register = () => {
  //Variable declarations
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmpass, setConfirmPass] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const navigate = useNavigate()

  //Form handling
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmpass: '',
  })

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  //CSS Styling
  const modalStyle2 = {
    position: 'fixed',
    top: '85%',
    left: '80%',
    transform: 'translateX(-50%)',
  }

  //Register API call
  async function signUp() {
    const errors = {}
    if (!name) {
      errors.name = 'Company Name is required'
    }
    if (!email) {
      errors.email = 'Email is required'
    }
    if (!password) {
      errors.password = 'Password is required'
    }
    if (!confirmpass) {
      errors.confirmpass = 'Confirmation of Password is required'
    }
    if (password && confirmpass && password !== confirmpass) {
      errors.confirmpass = 'Passwords do not match'
    } else if (password && confirmpass && password === confirmpass && password.length < 8) {
      errors.confirmpass = 'Passwords must be upto 8 digits'
    }

    setFormErrors(errors)

    const item = { name, email, password, confirmpass, role: 3 }
    let response

    try {
      response = await fetch(`${BASE_URL}/api/register`, {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 400) {
        handleButtonClick1()
      } else if (response.status === 404) {
        handleButtonClick3()
      } else {
        const result = await response.json()
        localStorage.setItem('user-info', JSON.stringify(result))
        handleButtonClick2()
        setTimeout(async () => {
          await navigate('/login')
        }, 2000)
      }
    } catch (error) {
      console.log('Jahanzaib Baig')
      console.error(error)
      if (Object.keys(errors).length === 0) {
        handleButtonClick4()
      }
    }
  }

  //Functions for Company register failure
  const [showAlert1, setShowAlert1] = useState(false)

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleCloseAlert1() {
    setShowAlert1(false)
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert1])

  //Functions for Company register success
  const [showAlert2, setShowAlert2] = useState(false)

  function handleButtonClick2() {
    setShowAlert2(true)
  }

  function handleCloseAlert2() {
    setShowAlert2(false)
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert2])

  //Functions for company email already exists
  const [showAlert3, setShowAlert3] = useState(false)

  function handleButtonClick3() {
    setShowAlert3(true)
  }

  function handleCloseAlert3() {
    setShowAlert3(false)
  }

  useEffect(() => {
    if (showAlert3) {
      const timer = setTimeout(() => {
        setShowAlert3(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert3])

  //Functions for company email already exists
  const [showAlert4, setShowAlert4] = useState(false)

  function handleButtonClick4() {
    setShowAlert4(true)
  }

  function handleCloseAlert4() {
    setShowAlert4(false)
  }

  useEffect(() => {
    if (showAlert4) {
      const timer = setTimeout(() => {
        setShowAlert4(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert4])

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 14 }}>
            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              Register your Company
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 3 }}>
                <BusinessIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  id="input-name"
                  label="Enter Company Name"
                  variant="standard"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={handleFocus}
                  placeholder="Enter Company Name"
                  sx={{ width: '100%' }}
                />
              </Box>
              {formErrors.name && <div className="text-danger">{formErrors.name}</div>}

              <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 3 }}>
                <MailIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  id="input-email"
                  label="Enter Company Email"
                  variant="standard"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={handleFocus}
                  placeholder="Enter Company Email"
                  sx={{ width: '100%' }}
                />
              </Box>
              {formErrors.email && <div className="text-danger">{formErrors.email}</div>}

              <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 3 }}>
                <HttpsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  id="input-password"
                  label="Enter Password"
                  variant="standard"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={handleFocus}
                  placeholder="Enter Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: '100%' }}
                />
              </Box>
              {formErrors.password && <div className="text-danger">{formErrors.password}</div>}

              <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 3 }}>
                <VerifiedUserIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  id="input-confirmPassword"
                  label="Confirm Password"
                  variant="standard"
                  name="confirmpass"
                  type={showPassword2 ? 'text' : 'password'}
                  value={confirmpass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  onFocus={handleFocus}
                  placeholder="Please Confirm Password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword2(!showPassword2)} edge="end">
                          {showPassword2 ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: '100%' }}
                />
              </Box>
              {formErrors.confirmpass && (
                <div className="text-danger">{formErrors.confirmpass}</div>
              )}

              <Box sx={{ mt: 2 }}>
                <Button id="register" variant="contained" onClick={signUp} fullWidth>
                  Sign Up
                </Button>
              </Box>

              <Grid container>
                <Grid item xs>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Already have an account? &nbsp;
                      <a href="/login" className="link-primary">
                        Login
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Alert for Add Project Success*/}
      {showAlert1 && (
        <Alert onClose={handleCloseAlert1} severity="error" style={modalStyle2}>
          Failed to Register Company
        </Alert>
      )}

      {/* Alert for Add Project Failure*/}
      {showAlert2 && (
        <Alert onClose={handleCloseAlert2} severity="success" style={modalStyle2}>
          Company Registered Successfully
        </Alert>
      )}

      {/* Alert for Add Project Failure*/}
      {showAlert3 && (
        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
          Company Email already exists
        </Alert>
      )}

      {/* Alert for Add Project Failure*/}
      {showAlert4 && (
        <Alert onClose={handleCloseAlert4} severity="warning" style={modalStyle2}>
          Invalid Email
        </Alert>
      )}
    </ThemeProvider>
  )
}

export default Register
