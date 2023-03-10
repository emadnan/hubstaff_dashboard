import { CTable , CTableBody , CTableHead , CTableHeaderCell , CTableRow } from '@coreui/react'
import { Modal, Button, Select, Form } from 'antd';
import { React, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const Companies = () => {

  // Variable declarations
  const [company_name, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [company_email, setCompanyEmail] = useState("");
  const [contact_no, setContactNo] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  // CSS Styling
  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
  };

  const modalStyle2 = {
    position: "fixed",
    top: "13%",
    left: "55%",
    transform: "translateX(-50%)",
  };

  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const buttonStyle = {
    marginLeft: '-100%',
  };

  // Functions of Add Company Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    addCompany()
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Functions for Delete Company Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = (id) => {
    setIsModalOpen2(id);
  };

  const handleOk2 = () => {
    deleteCompany(isModalOpen2);
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  // Functions for Update Company Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const showModal3 = (id) => {
    setIsModalOpen3(id);
  };

  const handleOk3 = () => {
    updateCompany(isModalOpen3);
    setIsModalOpen3(false);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  // Functions for Add Company Success
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

  // Functions for Add Company Failure
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

  // Functions for Delete Company Success
  const [showAlert3, setShowAlert3] = useState(false);

  function handleButtonClick3() {
    setShowAlert3(true);
  }

  function handleCloseAlert3() {
    setShowAlert3(false);
  }

  useEffect(() => {
    if (showAlert3) {
      const timer = setTimeout(() => {
        setShowAlert3(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert3]);

  // Functions for Delete Company Failure
  const [showAlert4, setShowAlert4] = useState(false);

  function handleButtonClick4() {
    setShowAlert4(true);
  }

  function handleCloseAlert4() {
    setShowAlert4(false);
  }

  useEffect(() => {
    if (showAlert4) {
      const timer = setTimeout(() => {
        setShowAlert4(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert4]);

  // Functions for Update Company Failure
  const [showAlert5, setShowAlert5] = useState(false);

  function handleButtonClick5() {
    setShowAlert5(true);
  }

  function handleCloseAlert5() {
    setShowAlert5(false);
  }

  useEffect(() => {
    if (showAlert5) {
      const timer = setTimeout(() => {
        setShowAlert5(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert5]);

  // Functions for Update Company Failure
  const [showAlert6, setShowAlert6] = useState(false);

  function handleButtonClick6() {
    setShowAlert6(true);
  }

  function handleCloseAlert6() {
    setShowAlert6(false);
  }

  useEffect(() => {
    if (showAlert6) {
      const timer = setTimeout(() => {
        setShowAlert6(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert6]);

  // Countries API Functions
  const [users, setUsers] = useState([]);
  const [countries, setCountries] = useState([]);

  // const handleCountryChange = (value) => {
  //   setCountry(value);
  // };

  const handleCountryChange = (value) => {
    setCountry(value);
    const selectedCountry = countries.find((country) => country.name === value);
    getCity(selectedCountry.id);
  }

  // Cities API Functions
  const [cities, setCities] = useState([]);

  const handleCityChange = (value) => {
    setCity(value);
  };


  // Get API calls
  function getList() {
    fetch("http://127.0.0.1:8000/api/getcompany")
      .then((response) => response.json())
      .then((data) => setUsers(data.companies))
      .catch((error) => console.log(error));
  }

  function getCountry() {
    fetch("http://127.0.0.1:8000/api/get_country")
      .then((response) => response.json())
      .then((data) => setCountries(data.Country))
      .catch((error) => console.log(error));
  }

  function getCity(id) {
    fetch(`http://127.0.0.1:8000/api/get_cities/${id}`)
      .then((response) => response.json())
      .then((data) => setCities(data.Cities))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getList()
    getCountry()
  }, []);

  // Add API call
  async function addCompany() {
    let item = { company_name, address, company_email, contact_no, city, country }

    await fetch("http://127.0.0.1:8000/api/addcompany",
      {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(response => {
        if (response.ok) {
          handleButtonClick1();
          getList()
        } else {
          handleButtonClick2();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Delete API call
  async function deleteCompany(newid) {
    await fetch('http://127.0.0.1:8000/api/delete-company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick3();
        getList()
      } else {
        handleButtonClick4();
      }
    })
      .catch(error => {
        console.error(error);
      });

  }

  // Update API call
  async function updateCompany(newid) {
    await fetch('http://127.0.0.1:8000/api/update-company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid,
        company_name: company_name,
        address: address,
        company_email: company_email,
        contact_no: contact_no,
        city: city,
        country: country,
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick5();
        getList()
      } else {
        handleButtonClick6();
      }
    })
      .catch(error => {
        console.error(error);
      });

  }

  return (
    <>
      <div className='row'>
        <div className='col-md 6'></div>
        <div className='col-md 6'>
          <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Company</Button>
        </div>
      </div>
      <br></br>
      <div className="card">
        <div className="card-body">
          <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
            <CTableHead color="light" >

              {/* Users table heading */}
              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>Company Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Address</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Company Email</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Contact No</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>City</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Country</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
              </CTableRow>

              {/* Get API Users */}
              {users.map((company) => (
                <CTableRow key={company.id}>
                  <CTableHeaderCell className="text-center">{company.company_name}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.address}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.company_email}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.contact_no}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.city}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.country}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                    <IconButton aria-label="delete" onClick={() => showModal2(company.id)}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="update" onClick={() => showModal3(company.id)}>
                      <EditIcon color="primary " />
                    </IconButton>
                  </CTableHeaderCell>
                </CTableRow>
              ))}

            </CTableHead>
            <CTableBody>

              {/* Modal for Add Company */}
              <Modal title="Add a Company" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={company_name}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Company Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Address"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={company_email}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Company Email"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={contact_no}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Contact No"
                  />
                </div>

                {/* Select Country  */}
                <div className="form-outline mb-3">
                  <Form.Item>
                    <Select placeholder="Select Country" onChange={handleCountryChange} value={country}>
                      {countries.map((count) => (
                        <Select.Option value={count.name} key={count.id}>
                          {count.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                {/* Select City  */}
                <div className="form-outline mb-3">
                  <Form.Item>
                    <Select placeholder="Select City" onChange={handleCityChange} value={city}>
                      {cities.map((citi) => (
                        <Select.Option value={citi.name} key={citi.id}>
                          {citi.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

              </Modal>

              {/* Modal for deletion confirmation */}
              <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
              </Modal>

              {/* Modal for Update Company */}
              <Modal title="Update a Company" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} style={modalStyle}>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={company_name}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Company Name"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Address"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={company_email}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Company Email"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={contact_no}
                    onChange={(e) => setContactNo(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Contact No"
                  />
                </div>

                {/* Select Country  */}
                <div className="form-outline mb-3">
                  <Form.Item>
                    <Select placeholder="Select Country" onChange={handleCountryChange} value={country}>
                      {countries.map((count) => (
                        <Select.Option value={count.name} key={count.id}>
                          {count.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
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
        </div>
      </div>
    </>
  );
}

export default Companies;