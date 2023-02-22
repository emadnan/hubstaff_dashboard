import React from 'react'

const Login = () => {
  return (
    <>
      <div className="col-sm-6 row d-flex mx-auto">
        <div className="container-fluid h-custom">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-md-9 col-lg-6 col-xl-5">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="img-fluid"
                alt="Sample"
              />
            </div>
            <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
              <form>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <h2>Sign In</h2>
                </div>
                <div className="divider d-flex align-items-center my-4"></div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form3Example3">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="form3Example3"
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
                    id="form3Example4"
                    className="form-control form-control-lg"
                    placeholder="Enter Password"
                  />
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      defaultValue
                      id="form2Example3"
                    />
                    <label className="form-check-label" htmlFor="form2Example3">
                      Remember me
                    </label>
                  </div>
                  <a href="#!" className="text-body">
                    Forgot password?
                  </a>
                </div>
                <div className="divider d-flex align-items-center my-2"></div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-grid">
                    <button type="button" className="btn btn-primary">
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
        </div>
      </div>
    </>
  )
}

export default Login
