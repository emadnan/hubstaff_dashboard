import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  //Variable Declarations
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  //Login API call
  async function login() {
    let item = { email, password }
    let result = await fetch("http://10.3.3.80/api/login",
      {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        },

      })
    result = await result.json()
      localStorage.setItem("user-info", JSON.stringify(result))
      navigate("/Dashboard")
  }
  

  return (
    <>
      <div className="col-sm-20 row-sm-20 d-flex">
        {/* <div className="col-md-9 col-lg-6 col-xl-5">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample"
          />
        </div> */}
        <div className="col-md-10 col-lg-6 col-xl-4 offset-xl-1">
          <form>
            <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
              <h2>Sign In</h2>
            </div>
            <div className="divider d-flex align-items-center my-4"></div>

            <div className="form-outline mb-4" >
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

            <div className="d-flex justify-content-between align-items-center">
              <a href="#!" className="text-body">
                Forgot password?
              </a>
            </div>

            <div className="divider d-flex align-items-center my-2"></div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-grid">
                <button type="button" className="btn btn-primary" onClick={login}>
                  Sign In
                </button>
              </div>
            </div>

            <div className="text-center text-lg-start mt-4 pt-2">
              <p className="small fw-bold mt-2 pt-1 mb-0">
                Dont have an account?
                <a href="/register" className="link-primary">
                  Register
                </a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default Login
