import { React, useState, useEffect } from 'react'
import { Form, Input, Select, Button, Modal } from 'antd'
import { CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTable } from '@coreui/react'

function FSFform() {

  //Variable declarations
  const [ricefId, setRicefId] = useState("");
  const [modulename, setModuleName] = useState("");
  const [project, setProjects] = useState([]);

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

  //GET calls handling
  const handleModuleChange = (value) => {
    setModuleName(value);
  };

  // Functions of Add Parameter Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // addCompany()
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //Initial rendering
  useEffect(() => {
    getProjects();
  }, []);

  //GET API calls
  function getProjects() {
    fetch("http://10.3.3.80/api/getproject")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.log(error));
  };

  //DIV handlings
  const [showDiv1, setShowDiv1] = useState(true);
  const [showDiv2, setShowDiv2] = useState(false);
  const [showDiv3, setShowDiv3] = useState(false);

  const handleClick1 = () => {
    setShowDiv1(false);
    setShowDiv2(true);
  };

  const handleClick2 = () => {
    setShowDiv2(false);
    setShowDiv3(true);
  };

  const handleClick3 = () => {
    setShowDiv3(false);
    setShowDiv2(true);
  };

  const handleClick4 = () => {
    setShowDiv2(false);
    setShowDiv1(true);
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
                    <Input style={{ width: '400px' }} />
                  </Form.Item>

                  <Form.Item label="Module Name" >
                    <Select onChange={handleModuleChange} value={modulename} style={{ width: '400px' }}>
                      {project.map((pro) => (
                        <Select.Option value={pro.name} key={pro.id}>
                          {pro.project_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item label="Functional Lead">
                    <Input style={{ width: '400px' }} />
                  </Form.Item>

                  <Form.Item label="Type of Development" >
                    <Select style={{ width: '400px' }}>
                      <Select.Option value="Form">Form</Select.Option>
                      <Select.Option value="Report">Report</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Priority" >
                    <Select style={{ width: '400px' }}>
                      <Select.Option value="Low">Low</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="High">High</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Usage Frequency" >
                    <Select style={{ width: '400px' }}>
                      <Select.Option value="Daily">Daily</Select.Option>
                      <Select.Option value="Weekly">Weekly</Select.Option>
                      <Select.Option value="Daily">Monthly</Select.Option>
                    </Select>
                  </Form.Item>

                  <Form.Item label="Development Logic Detail">
                    <Input />
                  </Form.Item>

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
                    <Input style={{ width: '400px' }} />
                  </Form.Item>

                  <Form.Item label="Authorization Level">
                    <Input style={{ width: '400px' }} />
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

              {/* Modal for Add Department */}
              <Modal title="Add a Parameter" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                <br></br>

                <Form.Item label="Description">
                  <Input style={{ width: '400px' }} />
                </Form.Item>

                <Form.Item label="Field Technical Name">
                  <Input style={{ width: '400px' }} />
                </Form.Item>

                <Form.Item label="Field Length">
                  <Input style={{ width: '400px' }} />
                </Form.Item>

                <Form.Item label="Field Type">
                  <Input style={{ width: '400px' }} />
                </Form.Item>

                <Form.Item label="Field Table Name">
                  <Input style={{ width: '400px' }} />
                </Form.Item>

                <Form.Item label="Mandatory/Optional">
                  <Input style={{ width: '400px' }} />
                </Form.Item>

                <Form.Item label="Parameter/Selection">
                  <Input style={{ width: '400px' }} />
                </Form.Item>

              </Modal>

            </CTableBody>
          </CTable>

          <Button style={buttonStyle} onClick={handleClick3}>Back</Button>
        </div>
      }
      {/* FSF Level 3 Form Ends */}
    </>
  )
}

export default FSFform