import { React, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

function FSFlevel1() {

  const [ricefId, setRicefId] = useState("");
  const [modulename, setModuleName] = useState("");
  const [project, setProjects] = useState([]);

  const heading = {
    textAlign: 'center',
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

  return (
    <>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <h3 id='heading' style={heading}>Functional Specification Form</h3>
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

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FSFlevel1