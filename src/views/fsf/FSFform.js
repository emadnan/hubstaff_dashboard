import { React, useState, useEffect } from 'react'
import { Form, Input, Select, Button, Modal, DatePicker } from 'antd'
import { CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTable } from '@coreui/react'
import moment from 'moment';
import Alert from '@mui/material/Alert';

const { RangePicker } = DatePicker;

function FSFform() {

  //Variable declarations
  const [wricef_id, setWRicefId] = useState("");
  const [module_name, setModuleName] = useState("");
  const [functional_lead, setFuncionalLead] = useState("");
  const [requested_date, setRequestedDate] = useState("");
  const [type_of_development, setTypeOfDevelopment] = useState("");
  const [priority, setPriority] = useState("");
  const [usage_frequency, setUsageFrequency] = useState("");
  const [transaction_code, setTransactionCode] = useState("");
  const [authorization_level, setAuthorizationLevel] = useState("");
  const [description, setDescription] = useState("");
  const [field_technical_name, setFieldTechnicalName] = useState("");
  const [field_length, setFieldLength] = useState("");
  const [field_type, setFieldType] = useState("");
  const [field_table_name, setFieldTableName] = useState("");
  const [mandatory_or_optional, setMandatoryOrOptional] = useState("");
  const [parameter_or_selection, setParameterOrSelection] = useState("");
  const [project, setProjects] = useState([]);

  const [ref_id, setRef_id] = useState();

  // Define an array to store the parameter objects
  const [parameters, setParameters] = useState([]);

  const local = JSON.parse(localStorage.getItem('user-info'));

  //CSS Styling
  const heading = {
    textAlign: 'center',
  };

  const mystyle = {
    color: "black",
    backgroundColor: "white",
    padding: "15px",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const buttonStyle = {
    float: "right",
    padding: "2px",
    width: "120px",
    backgroundColor: "#0070ff",
    fontWeight: "bold",
    color: "white",
  };

  const modalStyle2 = {
    position: "fixed",
    top: "10%",
    left: "55%",
    transform: "translateX(-50%)",
  };

  //GET calls handling
  const handleModuleChange = (value) => {
    setModuleName(value);
  };

  const handleTypeOfDevelopmentChange = (value) => {
    setTypeOfDevelopment(value);
  };

  const handlePriorityChange = (value) => {
    setPriority(value);
  };

  const handleUsageFrequencyChange = (value) => {
    setUsageFrequency(value);
  };

  const handleMandatoryOrOptionalChange = (value) => {
    setMandatoryOrOptional(value);
  };

  const handleParameterOrSelection = (value) => {
    setParameterOrSelection(value);
  };

  // const handleRequestedDateChange = (value) => {
  //   setRequestedDate(value);
  // };

  const handleFunctionalLeadChange = (value) => {
    setFuncionalLead(value);
  };

  // Functions of Add Parameter Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {

    // Reset the input fields
    setDescription("");
    setFieldTechnicalName("");
    setFieldLength("");
    setFieldType("");
    setFieldTableName("");
    setMandatoryOrOptional("");
    setParameterOrSelection("");

    setIsModalOpen(true);
  };

  const handleOk = () => {
    // addFsf()
    setIsModalOpen(false);
    // submitHandle();
    addFsfStage3();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function submitHandle (){
    // addFsf();
  };

  //Initial rendering
  useEffect(() => {
    getProjects();
    getUsers();
  }, []);

  var filteredUsers = [];
  const [users, setUsers] = useState([]);

  //GET API calls
  function getProjects() {
    fetch("http://10.3.3.80/api/getproject")
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === "1") {
          filteredUsers = data.projects;
        }
        else if (local.Users.role === "3") {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id);
        }
        setProjects(filteredUsers);
      })
      .catch((error) => console.log(error));
  };

  function getUsers() {
    fetch("http://10.3.3.80/api/get_users")
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === "1") {
          filteredUsers = data.Users;
        }
        else if (local.Users.role === "3") {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id);
        }
        setUsers(filteredUsers.slice(1));
      })
      .catch((error) => console.log(error));
  };

  //DIV handlings
  const [showDiv1, setShowDiv1] = useState(true);
  const [showDiv2, setShowDiv2] = useState(false);
  const [showDiv3, setShowDiv3] = useState(false);

  const handleClick1 = () => {
    setShowDiv1(false);
    setShowDiv2(true);
    addFsfStage1();
  };

  const handleClick2 = () => {
    setShowDiv2(false);
    setShowDiv3(true);
    addFsfStage2();
  };

  const handleClick3 = () => {
    setShowDiv3(false);
    setShowDiv2(true);
  };

  const handleClick4 = () => {
    setShowDiv2(false);
    setShowDiv1(true);
  };

  // Functions for Add FSF Success
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

  // Functions for Add FSF Failure
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

  // Add API call

  async function addFsfStage1() {
    let data = { wricef_id, module_name, functional_lead, requested_date, type_of_development, priority, usage_frequency }
    console.log(data);

    await fetch("http://10.3.3.80/api/addFunctionalSpecificationForm/1/",
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(response => {
        if (response.ok) {
          return response.json(); // Parse the response body as JSON
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .then(data => {
        console.log(data);
        setRef_id(data.id);
      })
      .catch(error => {
        console.error(error);
      });
  };

  async function addFsfStage2() {
    let data = { id: ref_id, transaction_code, authorization_level }
    console.log(data);

    await fetch("http://10.3.3.80/api/addFunctionalSpecificationForm/2/",
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(response => {
        if (response.ok) {
          return response.json(); // Parse the response body as JSON
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  async function addFsfStage3() {
    let data = { fsf_id: ref_id, description, field_technical_name, field_length, field_type, field_table_name, mandatory_or_optional, parameter_or_selection }
    console.log(data);

    await fetch("http://10.3.3.80/api/addFunctionalSpecificationForm/3/",
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(response => {
        if (response.ok) {
          return response.json(); // Parse the response body as JSON
        } else {
          throw new Error('Request failed with status ' + response.status);
        }
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });

  };


  return (
    <>
      {/* FSF Level 1 Form Starts */}
      {showDiv1 &&
        <div>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <h3 id='heading' style={heading}>Development Request Data</h3>
            </div>
          </div>
          <br></br>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <h4 style={heading}>Level 1</h4>
            </div>
          </div>
          <br></br>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div className="card w-150">
                <div className="card-body">

                  <br></br>

                  <Form.Item label="WRICEF ID">
                    <Input
                      style={{ width: '400px' }}
                      value={wricef_id}
                      type="text"
                      onChange={(e) => setWRicefId(e.target.value)}
                      className="form-control form-control-lg"
                    />
                  </Form.Item>

                  {/* <Form.Item label="Module Name" >
                    <Select onChange={handleModuleChange} value={module_name} style={{ width: '400px' }}>
                      {project.map((pro) => (
                        <Select.Option value={pro.name} key={pro.id}>
                          {pro.project_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item> */}

                  <Form.Item label="Module Name" >
                    <Select onChange={handleModuleChange} value={module_name} style={{ width: '400px' }}>
                      <Select.Option value="Test 1">Test 1</Select.Option>
                      <Select.Option value="Test 2">Test 2</Select.Option>
                    </Select>
                  </Form.Item>

                  {/* <Form.Item label="Functional Lead" >
                    <Select onChange={handleFunctionalLeadChange} value={functional_lead} style={{ width: '400px' }}>
                      {users.map((user) => (
                        <Select.Option value={user.name} key={user.id}>
                          {user.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item> */}

                  <Form.Item label="Functional Lead" >
                    <Select onChange={handleFunctionalLeadChange} value={functional_lead} style={{ width: '400px' }}>
                      <Select.Option value="Test 1">Test 1</Select.Option>
                      <Select.Option value="Test 2">Test 2</Select.Option>
                    </Select>
                  </Form.Item>

                  <div className="form-outline mb-3">
                    <label>Requested Date</label>
                    <input
                      type="date"
                      value={requested_date}
                      onChange={(e) => setRequestedDate(e.target.value)}
                      className="form-control form-control-lg"
                    />
                  </div>

                  <Form.Item label="Type of Development" >
                    <Select onChange={handleTypeOfDevelopmentChange} value={type_of_development} style={{ width: '400px' }}>
                      <Select.Option value="Form">Form</Select.Option>
                      <Select.Option value="Report">Report</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Priority" >
                    <Select onChange={handlePriorityChange} value={priority} style={{ width: '400px' }}>
                      <Select.Option value="Low">Low</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="High">High</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Usage Frequency" >
                    <Select onChange={handleUsageFrequencyChange} value={usage_frequency} style={{ width: '400px' }}>
                      <Select.Option value="Daily">Daily</Select.Option>
                      <Select.Option value="Weekly">Weekly</Select.Option>
                      <Select.Option value="Monthly">Monthly</Select.Option>
                    </Select>
                  </Form.Item>

                  {/* <Form.Item label="Development Logic Detail">
                    <Input />
                  </Form.Item> */}

                  <Button style={buttonStyle} onClick={handleClick1}>Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {/* FSF Level 1 Form Ends */}

      {/* FSF Level 2 Form Starts */}
      {showDiv2 &&
        <div>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <h3 id='heading' style={heading}>Development Screen Data</h3>
            </div>
          </div>
          <br></br>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <h4 style={heading}>Level 2</h4>
            </div>
          </div>
          <br></br>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div className="card w-150">
                <div className="card-body">

                  <br></br>

                  <Form.Item label="Transaction Code">
                    <Input
                      style={{ width: '400px' }}
                      value={transaction_code}
                      type="text"
                      onChange={(e) => setTransactionCode(e.target.value)}
                      className="form-control form-control-lg"
                    />
                  </Form.Item>

                  <Form.Item label="Authorization Level">
                    <Input
                      style={{ width: '400px' }}
                      value={authorization_level}
                      type="text"
                      onChange={(e) => setAuthorizationLevel(e.target.value)}
                      className="form-control form-control-lg"
                    />
                  </Form.Item>

                  <Button style={buttonStyle} onClick={handleClick4}>Back</Button>
                  <Button style={buttonStyle} onClick={handleClick2}>Next</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      {/* FSF Level 2 Form Ends */}

      {/* FSF Level 3 Form Starts */}
      {showDiv3 &&
        <div>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <h3 id='heading' style={heading}>Input Parameter</h3>
            </div>
          </div>
          <br></br>
          <div className='row justify-content-center'>
            <div className='col-md-6'>
              <h4 style={heading}>Level 3</h4>
            </div>
          </div>
          <br></br>

          <div className='row'>
            <div className='col-md 6'></div>
            <div className='col-md 6'>
              <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Parameter</Button>
            </div>
          </div>
          <br></br>

          <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
            <CTableHead color="light" >

              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Description</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Field Technical Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Field Length</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Field Type</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Field Table Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Mandatory/Optional</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Parameter/Selection</CTableHeaderCell>
              </CTableRow>

            </CTableHead>
            <CTableBody>

              {/* Modal for Add Parameter */}
              <Modal title="Add a Parameter" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <br></br>

                <Form.Item label="Description">
                  <Input
                    style={{ width: '400px' }}
                    value={description}
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                    className="form-control form-control-lg"
                  />
                </Form.Item>

                <Form.Item label="Field Technical Name">
                  <Input
                    style={{ width: '400px' }}
                    value={field_technical_name}
                    type="text"
                    onChange={(e) => setFieldTechnicalName(e.target.value)}
                    className="form-control form-control-lg"
                  />
                </Form.Item>

                <Form.Item label="Field Length">
                  <Input
                    style={{ width: '400px' }}
                    value={field_length}
                    type="text"
                    onChange={(e) => setFieldLength(e.target.value)}
                    className="form-control form-control-lg"
                  />
                </Form.Item>

                <Form.Item label="Field Type">
                  <Input
                    style={{ width: '400px' }}
                    value={field_type}
                    type="text"
                    onChange={(e) => setFieldType(e.target.value)}
                    className="form-control form-control-lg"
                  />
                </Form.Item>

                <Form.Item label="Field Table Name">
                  <Input
                    style={{ width: '400px' }}
                    value={field_table_name}
                    type="text"
                    onChange={(e) => setFieldTableName(e.target.value)}
                    className="form-control form-control-lg"
                  />
                </Form.Item>

                <Form.Item label="Mandatory/Optional" >
                  <Select onChange={handleMandatoryOrOptionalChange}
                   value={mandatory_or_optional} 
                   style={{ width: '400px' }}>
                    <Select.Option value="Mandatory">Mandatory</Select.Option>
                    <Select.Option value="Optional">Optional</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item label="Parameter/Selection" >
                  <Select onChange={handleParameterOrSelection} 
                  value={parameter_or_selection} 
                  style={{ width: '400px' }}>
                    <Select.Option value="Parameter">Parameter</Select.Option>
                    <Select.Option value="Selection">Selection</Select.Option>
                  </Select>
                </Form.Item>

              </Modal>

              {/* Alert for Add FSF Success*/}
              {showAlert1 && (
                <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
                  FSF Added Successfully
                </Alert>
              )}

              {/* Alert for Add FSF Failure*/}
              {showAlert2 && (
                <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
                  Failed to Add FSF
                </Alert>
              )}


            </CTableBody>
          </CTable>

          <Button style={buttonStyle} onClick={handleClick3}>Back</Button>
          <Button style={buttonStyle} onClick={() => submitHandle()}>Submit</Button>
        </div>
      }
      {/* FSF Level 3 Form Ends */}
    </>
  )
}

export default FSFform