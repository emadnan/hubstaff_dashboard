import React, { useState } from 'react'

const Changepassword = () => {

  const [password, setPassword] = useState("");

  async function changepassword() {
    let item = { password }
    console.warn(item)

     await fetch("http://127.0.0.1:8000/api/changepassword",
      {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        },

      })
    // result = await result.json()
  }

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-sm-4">

            <label>New Password</label>
            <div className="form-group pass_show">
              <input type="password" value={password} className="form-control" onChange={(e) => setPassword(e.target.value)} placeholder="New Password" />
            </div>
            {/* <label>Confirm Password</label>
            <div className="form-group pass_show">
              <input type="password" value={password} className="form-control" placeholder="Confirm Password" />
            </div> */}

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-grid">
                <button type="button" className="btn btn-primary" onClick={changepassword}>
                  Sign In
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default Changepassword