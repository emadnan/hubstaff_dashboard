import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [selectedOption, setSelectedOption] = useState('option1')

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value)
  }

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpass, setConfirmPass] = useState("");

  const navigate = useNavigate();

  async function signUp() {
    let item = {name,email,password,confirmpass}
    console.warn(item)

    let result = await fetch("http://127.0.0.1:8000/api/register",
    {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json'
      },

    })
    result = await result.json()
    localStorage.setItem("user-info", JSON.stringify(result))
    navigate("/Login")

  }

  return (
    <>
      <div className="col-sm-6 row d-flex mx-auto">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <h2>Registration</h2>
                </div>
                <div className="divider d-flex align-items-center my-4"></div>
                <div className="form-outline mb-3">
                  <label className="form-label" htmlFor="form3Example4">
                    Username
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
                <div className="divider d-flex align-items-center my-3"></div>
                <div className="form-outline mb-10">
                </div>
                <div className="divider d-flex align-items-center my-2"></div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-grid">
                    <button type="button" className="btn btn-primary" onClick={signUp}>
                      Sign In
                    </button>
                  </div>
                </div>
                <div className="text-center text-lg-start mt-4 pt-2">
                  <p className="small fw-bold mt-2 pt-1 mb-0">
                    Already have an account?
                    <a href="/login" className="link-primary">
                      Sign-In
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register
