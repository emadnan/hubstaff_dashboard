import { React, useState, useEffect } from 'react'
import { Form, Input, Select, Button } from 'antd'
import { CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTable } from '@coreui/react'

function FSFlevel1() {

  const [ricefId, setRicefId] = useState("");
  const [modulename, setModuleName] = useState("");
  const [project, setProjects] = useState([]);

  const heading = {
    textAlign: 'center',
  };

  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const handleModuleChange = (value) => {
    setModuleName(value);
  };

  function getProjects() {
    fetch("http://10.3.3.80/api/getproject")
      .then((response) => response.json())
      .then((data) => setProjects(data.projects))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getProjects();
  }, []);

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

                  <Button className="btn btn-primary" onClick={handleClick1}>Next</Button>
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

                  <Button className="btn btn-primary" onClick={handleClick4}>Back</Button>
                  &nbsp;
                  <Button className="btn btn-primary" onClick={handleClick2}>Next</Button>
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
          {/* <div className='row justify-content-center'>
            <div className='col-md-6'>
              <div className="card w-300">
                <div className="card-body"> */}

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
                      {/* <Modal title="Add a Department" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

                        <br></br>

                        <div className="form-outline mb-3">
                          <label>Company</label>
                          <Form.Item>
                            <Select placeholder="Select Company" onChange={handleCompanyChange} value={company_id}>
                              {company.map((count) => (
                                <Select.Option value={count.name} key={count.id}>
                                  {count.company_name}
                                </Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </div>

                        <div className="form-outline mb-3">
                          <label>Department</label>
                          <input
                            type="text"
                            value={department_name}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            className="form-control form-control-lg"
                            placeholder="Enter Department Name"
                          />
                        </div>

                        <div className="form-outline mb-3">
                          <label>Description</label>
                          <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="form-control form-control-lg"
                            placeholder="Enter Description"
                          />
                        </div>

                      </Modal> */}

                    </CTableBody>
                  </CTable>

                  <Button className="btn btn-primary" onClick={handleClick3}>Back</Button>
                </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      }
      {/* FSF Level 3 Form Ends */}
    </>
  )
}

export default FSFlevel1