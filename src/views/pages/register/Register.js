import { useState, React, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Register = () => {

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpass, setConfirmPass] = useState("");

  const navigate = useNavigate();

  const theme = createTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    // const data = new FormData(event.currentTarget);
  };

  const modalStyle2 = {
    position: "fixed",
    top: "85%",
    left: "80%",
    transform: "translateX(-50%)",
  };

  async function signUp() {
    let item = { name, email, password, confirmpass, role: 3 }
    let result = await fetch("http://10.3.3.80/api/register", {
      method: "POST",
      body: JSON.stringify(item),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (result.status === 400) {
      console.log(item);
      handleButtonClick1()
    } else {
      result = await result.json();
      localStorage.setItem("user-info", JSON.stringify(result));
      handleButtonClick2()
      setTimeout(async () => {
        await navigate("/Dashboard");
      }, 2000);
    }
  }


  const [showAlert1, setShowAlert1] = useState(false);

  function handleButtonClick1() {
    setShowAlert1(true);
  }

  function handleCloseAlert1() {
    setShowAlert1(false);
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert1]);

  const [showAlert2, setShowAlert2] = useState(false);

  function handleButtonClick2() {
    setShowAlert2(true);
  }

  function handleCloseAlert2() {
    setShowAlert2(false);
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert2]);


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
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <h2>Company Sign Up</h2>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Company Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Username"
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="form3Example3">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Email Address"
                />
              </div>

              <div className="form-outline mb-3">
                <label className="form-label" htmlFor="form3Example4">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Password"
                />
              </div>

              <div className="form-outline mb-10">
                <label className="form-label" htmlFor="form3Example4">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmpass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Confirm Password"
                />
              </div>

              <br></br>

              <div className="d-flex justify-content-between align-items-center">
                <div className="d-grid">
                  <button type="button" className="btn btn-primary" onClick={signUp}>
                    Sign Up
                  </button>
                </div>
              </div>

              <Grid container>

                <Grid item>
                  <div className="text-center text-lg-start mt-4 pt-2">
                    <p className="small fw-bold mt-2 pt-1 mb-0">
                      Already have an account?
                      &nbsp;
                      <a href="/login" className="link-primary">
                        Login
                      </a>
                    </p>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Alert for Add Project Success*/}
      {showAlert1 && (
        <Alert onClose={handleCloseAlert1} severity="error" style={modalStyle2}>
          Failed to Register
        </Alert>
      )}

      {/* Alert for Add Project Failure*/}
      {showAlert2 && (
        <Alert onClose={handleCloseAlert2} severity="success" style={modalStyle2}>
          User Registered Successfully
        </Alert>
      )}
    </ThemeProvider>
  )
}

export default Register