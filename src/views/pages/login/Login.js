import { useState, React, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AccountCircle from '@mui/icons-material/AccountCircle'
import HttpsIcon from '@mui/icons-material/Https'
import {
  Box,
  Avatar,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@mui/material'

const theme = createTheme()

const Login = () => {
  //Variable declarations
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Initialize the state for "Remember Me"
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  //CSS Styling
  const modalStyle2 = {
    position: 'fixed',
    top: '85%',
    left: '80%',
    transform: 'translateX(-50%)',
  }

  // Function to handle the checkbox change
  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked)
  }

  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  })

  //Form handling
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    })
  }

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  //Login API call
  async function login() {
    let item = { email, password, rememberMe }
    console.log('item: ', item)

    // Validate the form
    const errors = {}
    if (!email) {
      errors.email = 'Email is required'
    }
    if (!password) {
      errors.password = 'Password is required'
    }

    // Update the form errors
    setFormErrors(errors)

    let result = await fetch('http://10.3.3.80/api/login', {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.status === 400) {
      handleButtonClick1()
    } else if (result.status === 500) {
      handleButtonClick3()
    } else if (result.status === 401) {
      handleButtonClick4()
    } else {
      result = await result.json()
      localStorage.setItem('user-info', JSON.stringify(result))
      handleButtonClick2()
      setTimeout(async () => {
        await navigate('/Dashboard')
      }, 2000)
    }
  }

  //Functions for Login Failed
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

  //Functions for Login Success
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

  //Functions for User not found
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

  //Functions for Failed password or login
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
            backgroundImage: 'url(hub_stuff_bg.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 14 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5" component="h2" sx={{ mt: 2 }}>
              Sign In
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                <AccountCircle sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  id="input-email"
                  label="Enter Email Address"
                  variant="standard"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email Address"
                  sx={{ width: '100%' }}
                  onFocus={handleFocus}
                />
              </Box>
              {formErrors.email && <div className="text-danger">{formErrors.email}</div>}

              <Box sx={{ display: 'flex', alignItems: 'flex-end', mt: 1, mb: 2 }}>
                <HttpsIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                <TextField
                  id="input-password"
                  label="Enter Password"
                  variant="standard"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
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

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label="Remember Me"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                />
              </Box>

              <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={login} fullWidth>
                  Sign In
                </Button>
              </Box>

              <Grid container>
                <Grid item xs>
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Don&apos;t have an account?{' '}
                      <a href="/register" className="link-primary">
                        Register
                      </a>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Alert for Login Failure*/}
      {showAlert1 && (
        <Alert onClose={handleCloseAlert1} severity="error" style={modalStyle2}>
          Failed to Login
        </Alert>
      )}

      {/* Alert for Login Success*/}
      {showAlert2 && (
        <Alert onClose={handleCloseAlert2} severity="success" style={modalStyle2}>
          Successfully Logged In
        </Alert>
      )}

      {/* Alert for User not found*/}
      {showAlert3 && (
        <Alert onClose={handleCloseAlert3} severity="error" style={modalStyle2}>
          User does not exists
        </Alert>
      )}

      {/* Alert for Invalid Login*/}
      {showAlert4 && (
        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
          Invalid email or password
        </Alert>
      )}
    </ThemeProvider>
  )
}

export default Login
