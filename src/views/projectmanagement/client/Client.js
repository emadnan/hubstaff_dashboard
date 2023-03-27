import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button, Modal, Select, Form } from 'antd';
import { React, useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Alert from '@mui/material/Alert';

const { Option } = Select;

const Client = () => {

  // Variable declarations
  const [client_name, setClientName] = useState("");
  const [project, setProject] = useState("");
  const [invoicing, setInvoicing] = useState("");
  const [project_status, setProjectStatus] = useState("");

  // CSS Styling
  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
  };

  const modalStyle2 = {
    position: "fixed",
    top: "10%",
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
    float: "right",
    padding: "2px",
    width: "120px",
    backgroundColor: "#0070ff",
    fontWeight: "bold",
    color: "white",
  }

  // Functions of Add Client Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    addClient()
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Functions for Delete Client Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = (id) => {
    setIsModalOpen2(id);
  };

  const handleOk2 = () => {
    deleteClient(isModalOpen2);
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  // Functions for Update Client Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const showModal3 = (id) => {
    setIsModalOpen3(id);
  };

  const handleOk3 = () => {
    updateClient(isModalOpen3);
    setIsModalOpen3(false);
  };

  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  // Functions for Add Client Success
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

  // Functions for Add Client Failure
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

  // Functions for Delete Client Success
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

  // Functions for Delete Client Failure
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

  // Functions for Update Client Success
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

  // Functions for Update Client Failure
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

  const handleProjectStatus = (value) => {
    setProjectStatus(value);
  };

  // Get API calls
  const [users, setUsers] = useState([]);

  function getClients() {
    fetch("http://10.3.3.80/api/get_client")
      .then((response) => response.json())
      .then((data) => setUsers(data.Departments))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getClients()
  }, []);

  // Add API call
  async function addClient() {
    let item = { client_name, project, invoicing, project_status }

    await fetch("http://10.3.3.80/api/add_client",
      {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        },

      }).then(response => {
        if (response.ok) {
          handleButtonClick1();
          getClients()
        } else {
          handleButtonClick2();
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Delete API call
  async function deleteClient(newid) {
    await fetch('http://10.3.3.80/api/delete_client', {
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
        getClients()
      } else {
        handleButtonClick4();
      }
    })
      .catch(error => {
        console.error(error);
      });

  }

  // Update API call
  async function updateClient(newid) {
    await fetch('http://10.3.3.80/api/update_client', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid,
        client_name: client_name,
        project: project,
        invoicing: invoicing,
        project_status: project_status,
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick5();
        getClients()
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
        <div className='col-md 6'>
          <h3>Clients</h3>
        </div>
        <div className='col-md 6'>
          {/* Add Client Button */}
          <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Client</Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light" >

          {/* Clients table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Client Name</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Project</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Invoicing</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Project Status</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
          </CTableRow>

          {/* Get API Users */}
          {users.map((client, index) => (
            <CTableRow key={client.id}>
              <CTableHeaderCell className="text-center">{index + 1}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{client.client_name}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{client.project}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{client.invoicing}</CTableHeaderCell>
              <CTableHeaderCell className="text-center">{client.project_status}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                <IconButton aria-label="update" onClick={() => showModal3(client.id)}>
                  <EditIcon htmlColor='#28B463' />
                </IconButton>
                <IconButton aria-label="delete" onClick={() => showModal2(client.id)}>
                  <DeleteIcon htmlColor='#FF0000' />
                </IconButton>

              </CTableHeaderCell>
            </CTableRow>
          ))}

        </CTableHead>
        <CTableBody>

          {/* Modal for Add Client */}
          <Modal title="Add a Client" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

            <div className="form-outline mb-3">
              <input
                type="text"
                value={client_name}
                onChange={(e) => setClientName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Client Name"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Project Name"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="number"
                value={invoicing}
                onChange={(e) => setInvoicing(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Invoicing"
              />
            </div>

            <div className="form-outline mb-3">
              <Form.Item label="Status">
                <Select placeholder="Select Project Status" onChange={handleProjectStatus}>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </div>

          </Modal>

          {/* Modal for deletion confirmation */}
          <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
          </Modal>

          {/* Modal for Update Client */}
          <Modal title="Update a Client" open={isModalOpen3} onOk={handleOk3} onCancel={handleCancel3} style={modalStyle}>

            <div className="form-outline mb-3">
              <input
                type="text"
                value={client_name}
                onChange={(e) => setClientName(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Client Name"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="text"
                value={project}
                onChange={(e) => setProject(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Project Name"
              />
            </div>

            <div className="form-outline mb-3">
              <input
                type="number"
                value={invoicing}
                onChange={(e) => setInvoicing(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter Invoicing"
              />
            </div>

            <div className="form-outline mb-3">
              <Form.Item label="Status">
                <Select placeholder="Select Project Status" onChange={handleProjectStatus}>
                  <Option value="in_progress">In Progress</Option>
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                </Select>
              </Form.Item>
            </div>

          </Modal>

          {/* Alert for Add Client Success*/}
          {showAlert1 && (
            <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
              Client Added Successfully
            </Alert>
          )}

          {/* Alert for Add Client Failure*/}
          {showAlert2 && (
            <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
              Failed to Add Client
            </Alert>
          )}

          {/* Alert for Delete Client Success*/}
          {showAlert3 && (
            <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
              Client Deleted Successfully
            </Alert>
          )}

          {/* Alert for Delete Client Failure*/}
          {showAlert4 && (
            <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
              Failed to Delete Client
            </Alert>
          )}

          {/* Alert for Update Client Success*/}
          {showAlert5 && (
            <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
              Client Updated Successfully
            </Alert>
          )}

          {/* Alert for Update Client Failure*/}
          {showAlert6 && (
            <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
              Failed to Update Client
            </Alert>
          )}


        </CTableBody>
      </CTable>
    </>
  );
}

export default Client;
