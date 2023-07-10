import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Modal, Button, Select, Form } from 'antd'
import { React, useState, useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
const BASE_URL = process.env.REACT_APP_BASE_URL

const Companies = () => {
  // Variable declarations
  const [company_name, setCompanyName] = useState('')
  const [address, setAddress] = useState('')
  const [company_email, setCompanyEmail] = useState('')
  const [contact_no, setContactNo] = useState('')
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))
  const permissions = local.permissions
  const perm = permissions.map((permission) => ({
    name: permission.name,
  }))

  //Role & Permissions check
  const isEditButtonEnabled = perm.some((item) => item.name === 'Update_Company')
  const isDeleteButtonEnabled = perm.some((item) => item.name === 'Delete_Company')
  const isCreateButtonEnabled = perm.some((item) => item.name === 'Create_Company')

  const [enableChangeCity, setEnableChangeCity] = useState(false)

  let [form] = Form.useForm()

  // CSS Styling
  const modalStyle = {
    position: 'fixed',
    top: '25%',
    left: '40%',
  }

  // const perStyle = {
  //   fontSize: 14,
  // };

  // const headStyle = {
  //   color: "#0070ff",
  //   fontWeight: "bold",
  // };

  const modalStyle2 = {
    position: 'fixed',
    top: '10%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: 'white',
    fontWeight: 'bold',
    color: '#0070ff',
  }

  const [formErrors, setFormErrors] = useState({
    company_name,
    address,
    company_email,
    city,
    country,
    contact_no,
  })

  // Functions of Add Company Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setEnableChangeCity(false)
    if (company_name && address && company_email && city && country && contact_no) {
      addCompany()
      setIsModalOpen(false)
      form.resetFields()
      setCompanyName('')
      setAddress('')
      setCompanyEmail('')
      setContactNo('')
      setCity('')
      setCountry('')
    } else {
      callErrors(company_name, address, company_email, city, country, contact_no)
    }
  }

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const callErrors = (company_name, address, company_email, city, country, contact_no) => {
    const errors = {}
    if (!company_name) {
      errors.company_name = 'Enter the Company Name'
    }
    if (!company_email) {
      errors.company_email = 'Enter the Company Email'
    } else if (!validateEmail(company_email)) {
      errors.company_email = 'Invalid Email'
    }
    if (!address) {
      errors.address = 'Address is Required'
    }
    if (!contact_no) {
      errors.contact_no = 'Company Contact No. is Required'
    }
    if (!city) {
      errors.city = 'City Field is Required'
    }
    if (!country) {
      errors.country = 'Country Field is Required'
    }

    setFormErrors(errors)
  }

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  const handleCancel = () => {
    setEnableChangeCity(false)
    setIsModalOpen(false)
    form.resetFields()
    setCompanyName('')
    setAddress('')
    setCompanyEmail('')
    setContactNo('')
    setCity('')
    setCountry('')
  }

  // Functions for Delete Company Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = (id) => {
    setIsModalOpen2(id)
  }

  const handleOk2 = () => {
    deleteCompany(isModalOpen2)
    setIsModalOpen2(false)
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
  }

  // Functions for Update Company Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    getCompanyById(id)
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    if (company_name && address && company_email && city && country && contact_no) {
      updateCompany(isModalOpen3)
      setIsModalOpen3(false)
      setEnableChangeCity(false)
      form.resetFields()
    } else {
      callErrors(company_name, address, company_email, city, country, contact_no)
    }
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
    setEnableChangeCity(false)
    form.resetFields()
  }

  // Functions for Show Details Modal
  // const [isModalOpen4, setIsModalOpen4] = useState(false);
  // const showModal4 = (id) => {
  //   getCompanyById(id)
  //   setIsModalOpen4(id)
  // };

  // const handleOk4 = () => {
  //   setIsModalOpen4(false);
  // };

  // const handleCancel4 = () => {
  //   setIsModalOpen4(false);
  // };

  // Functions for Add Company Success
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

  // Functions for Add Company Failure
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

  // Functions for Delete Company Success
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

  // Functions for Delete Company Failure
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

  // Functions for Update Company Success
  const [showAlert5, setShowAlert5] = useState(false)

  function handleButtonClick5() {
    setShowAlert5(true)
  }

  function handleCloseAlert5() {
    setShowAlert5(false)
  }

  useEffect(() => {
    if (showAlert5) {
      const timer = setTimeout(() => {
        setShowAlert5(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert5])

  // Functions for Update Company Failure
  const [showAlert6, setShowAlert6] = useState(false)

  function handleButtonClick6() {
    setShowAlert6(true)
  }

  function handleCloseAlert6() {
    setShowAlert6(false)
  }

  useEffect(() => {
    if (showAlert6) {
      const timer = setTimeout(() => {
        setShowAlert6(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert6])

  //Get calls handling
  const handleCountryChange = (value) => {
    setEnableChangeCity(true)
    setCountry(value)
    setCity('') // Reset the city value
    form.setFieldsValue({ city: null })
  }

  const handleCityChange = (value) => {
    setCity(value)
  }

  // Array declarations for API calls
  const [users, setUsers] = useState([])
  const [countries, setCountries] = useState([])
  const [cities, setCities] = useState([])
  const [bycompany, setByCompany] = useState([])
  var filteredUsers = []

  //Initial rendering through useEffect
  useEffect(() => {
    getList()
    getCountry()
  }, [])

  //GET API calls
  function getList() {
    fetch(`${BASE_URL}/api/getcompany`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.companies
        } else if (local.Users.role === 3) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
          filteredUsers = data.companies.filter((user) => user.id === local.Users.company_id)
        }
        setUsers(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  function getCountry() {
    fetch(`${BASE_URL}/api/get_country`)
      .then((response) => response.json())
      .then((data) => setCountries(data.Country))
      .catch((error) => console.log(error))
  }

  function getCity(id) {
    fetch(`${BASE_URL}/api/get_cities/${id}`)
      .then((response) => response.json())
      .then((data) => setCities(data.Cities))
      .catch((error) => console.log(error))
  }

  function getCompanyById(id) {
    fetch(`${BASE_URL}/api/get_company_by_id/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setByCompany(data.company)
        setCompanyName(data.company[0].company_name)
        setCompanyEmail(data.company[0].company_email)
        setAddress(data.company[0].address)
        setContactNo(data.company[0].contact_no)
        setCountry(data.company[0].country)
        setCity(data.company[0].city)
      })
      .catch((error) => console.log(error))
  }

  // Add API call
  async function addCompany() {
    let item = { company_name, address, company_email, contact_no, city, country }

    await fetch(`${BASE_URL}/api/addcompany`, {
      method: 'POST',
      body: JSON.stringify(item),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick1()
          getList()
        } else {
          handleButtonClick2()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete API call
  async function deleteCompany(newid) {
    await fetch(`${BASE_URL}/api/delete-company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick3()
          getList()
        } else {
          handleButtonClick4()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update API call
  async function updateCompany(newid) {
    await fetch(`${BASE_URL}/api/update-company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        company_name: company_name,
        address: address,
        company_email: company_email,
        contact_no: contact_no,
        city: city,
        country: country,
      }),
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick5()
          getList()
        } else {
          handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  useEffect(() => {
    if (country) {
      const selectedCountry = countries.find((countryItem) => countryItem.name === country)
      getCity(selectedCountry.id)
    }
  }, [country])

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Companies</h3>
        </div>
        <div className="col-md 6">
          {/* Add Company Button */}
          {isCreateButtonEnabled ? (
            <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>
              Add Company
            </Button>
          ) : null}
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light">
          {/* Users table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Sr/No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Company Name
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Address
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Company Email
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Contact No
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              City
            </CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>
              Country
            </CTableHeaderCell>
            {isEditButtonEnabled || isDeleteButtonEnabled ? (
              <CTableHeaderCell className="text-center" style={mystyle}>
                Action
              </CTableHeaderCell>
            ) : null}
          </CTableRow>

          {/* Get API Users */}
          {users.map((company, index) => (
            <CTableRow key={company.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {index + 1}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {company.company_name}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {company.address}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {company.company_email}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {company.contact_no}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {company.city}
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                {company.country}
              </CTableHeaderCell>
              {isEditButtonEnabled || isDeleteButtonEnabled ? (
                <CTableHeaderCell className="text-center" style={mystyle2}>
                  {isEditButtonEnabled ? (
                    <IconButton aria-label="update" onClick={() => showModal3(company.id)}>
                      <EditIcon htmlColor="#28B463" />
                    </IconButton>
                  ) : null}
                  {isDeleteButtonEnabled ? (
                    <IconButton aria-label="delete" onClick={() => showModal2(company.id)}>
                      <DeleteIcon htmlColor="#FF0000" />
                    </IconButton>
                  ) : null}
                </CTableHeaderCell>
              ) : null}
            </CTableRow>
          ))}
        </CTableHead>
        <CTableBody>
          {/* Modal for Add Company */}
          <Modal
            title="Add a Company"
            open={isModalOpen}
            onOk={handleOk}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel}
            maskClosable={false}
          >
            <br></br>

            <div className="form-outline mt-3">
              <label>Company</label>
              <input
                type="text"
                name="company_name"
                value={company_name}
                onFocus={handleFocus}
                onChange={(e) => setCompanyName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Company Name"
              />
            </div>
            {formErrors.company_name && (
              <div className="text-danger">{formErrors.company_name}</div>
            )}

            <div className="form-outline mt-3">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={address}
                onFocus={handleFocus}
                onChange={(e) => setAddress(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Address"
              />
            </div>
            {formErrors.address && <div className="text-danger">{formErrors.address}</div>}

            <div className="form-outline mt-3">
              <label>Email</label>
              <input
                type="text"
                name="company_email"
                value={company_email}
                onFocus={handleFocus}
                onChange={(e) => setCompanyEmail(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Email"
              />
            </div>
            {formErrors.company_email && (
              <div className="text-danger">{formErrors.company_email}</div>
            )}

            <div className="form-outline mt-3">
              <label>Contact</label>
              <input
                type="number"
                name="contact_no"
                value={contact_no}
                onFocus={handleFocus}
                onChange={(e) => setContactNo(e.target.value)}
                className="form-control form-control-lg"
                placeholder="03XXXXXXXXX"
              />
            </div>
            {formErrors.contact_no && <div className="text-danger">{formErrors.contact_no}</div>}

            <Form form={form}>
              <div className="form-outline mt-3">
                <label>Country</label>
                <Form.Item
                  name="country"
                  validateStatus={formErrors.country ? 'error' : ''}
                  help={formErrors.country}
                >
                  <Select
                    placeholder="Select Country"
                    showSearch={true}
                    onFocus={handleFocus}
                    onChange={handleCountryChange}
                    value={country}
                  >
                    {countries.map((count) => (
                      <Select.Option value={count.name} key={count.id}>
                        {count.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>

              <div className="form-outline mt-3">
                <label>City</label>
                <Form.Item
                  name="city"
                  validateStatus={formErrors.city ? 'error' : ''}
                  help={formErrors.city}
                >
                  <Select
                    placeholder="Select City"
                    showSearch={true}
                    onFocus={handleFocus}
                    onChange={handleCityChange}
                    value={city}
                    disabled={!enableChangeCity}
                  >
                    {cities.map((city) => (
                      <Select.Option value={city.name} key={city.id}>
                        {city.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </Form>
          </Modal>

          {/* Modal for deletion confirmation */}
          <Modal
            title="Are you sure you want to delete?"
            open={isModalOpen2}
            onOk={handleOk2}
            okButtonProps={{ style: { background: 'blue' } }}
            onCancel={handleCancel2}
            style={modalStyle}
          ></Modal>

          {/* Modal for Update Company */}
          <Modal
            title="Update a Company"
            open={isModalOpen3}
            onOk={handleOk3}
            onCancel={handleCancel3}
            okButtonProps={{ style: { background: 'blue' } }}
            maskClosable={false}
          >
            <br></br>
            {bycompany.map((company) => (
              <div key={company.id}>
                <div className="form-outline mt-3">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company_name"
                    defaultValue={company.company_name}
                    onFocus={handleFocus}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Company Name"
                  />
                </div>
                {formErrors.company_name && (
                  <div className="text-danger">{formErrors.company_name}</div>
                )}

                <div className="form-outline mt-3">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={company.address}
                    onFocus={handleFocus}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Address"
                  />
                </div>
                {formErrors.address && <div className="text-danger">{formErrors.address}</div>}

                <div className="form-outline mt-3">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company_email"
                    defaultValue={company.company_email}
                    onFocus={handleFocus}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Email"
                  />
                </div>
                {formErrors.company_email && (
                  <div className="text-danger">{formErrors.company_email}</div>
                )}

                <div className="form-outline mt-3">
                  <label>Contact</label>
                  <input
                    type="number"
                    name="contact_no"
                    defaultValue={company.contact_no}
                    onFocus={handleFocus}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="03XXXXXXXXX"
                  />
                </div>
                {formErrors.contact_no && (
                  <div className="text-danger">{formErrors.contact_no}</div>
                )}

                <Form form={form}>
                  <div className="form-outline mt-3">
                    <label>Country</label>
                    <Form.Item
                      name="country"
                      validateStatus={formErrors.country ? 'error' : ''}
                      help={formErrors.country}
                    >
                      <Select
                        placeholder="Select Country"
                        showSearch={true}
                        onFocus={handleFocus}
                        onChange={handleCountryChange}
                        defaultValue={country}
                      >
                        {countries.map((count) => (
                          <Select.Option value={count.name} key={count.id}>
                            {count.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>

                  <div className="form-outline mt-3">
                    <label>City</label>
                    <Form.Item
                      name="city"
                      validateStatus={formErrors.city ? 'error' : ''}
                      help={formErrors.city}
                    >
                      <Select
                        placeholder="Select City"
                        showSearch={true}
                        onFocus={handleFocus}
                        onChange={handleCityChange}
                        defaultValue={city}
                        disabled={!enableChangeCity}
                      >
                        {cities.map((citi) => (
                          <Select.Option value={citi.name} key={citi.id}>
                            {citi.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            ))}
          </Modal>

          {/* Alert for Add Company Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              Company Added Successfully
            </Alert>
          )}

          {/* Alert for Add Company Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Add Company
            </Alert>
          )}

          {/* Alert for Delete Company Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Company Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Company Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Delete Company
            </Alert>
          )}

          {/* Alert for Update Company Success*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Company Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Company Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Company
            </Alert>
          )}
        </CTableBody>
      </CTable>
    </>
  )
}

export default Companies
