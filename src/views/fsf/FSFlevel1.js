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

  const [showDiv1, setShowDiv1] = useState(false);
  const [showDiv2, setShowDiv2] = useState(false);
  const [showDiv3, setShowDiv3] = useState(false);

  const handleClick1 = () => {
    setShowDiv1(!showDiv1);
  };

  const handleClick2 = () => {
    setShowDiv2(!showDiv2);
  };

  const handleClick3 = () => {
    setShowDiv3(!showDiv3);
  };

  return (
    <>
      {/* <div className='row justify-content-center'>
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
      </div> */}

      <div>
        <button onClick={handleClick1}>Toggle Div</button>
        {showDiv1 && <div>This is DIV 1</div>}
      </div>

      <div>
        <button onClick={handleClick2}>Toggle Div</button>
        {showDiv2 && <div>This is the DIV 2</div>}
      </div>

      <div>
        <button onClick={handleClick3}>Toggle Div</button>
        {showDiv3 && <div>This is the DIV 3</div>}
      </div>
    </>
  )
}

export default FSFlevel1