import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button, Modal, Checkbox, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar'

function AllFSF() {

  const local = JSON.parse(localStorage.getItem('user-info'))
  getFsfonTeamLeadId(local.token);

  const navigate = useNavigate();
  const [fsf, setFsf] = useState([]);
  const [fsfbyid, setFsfById] = useState([]);
  const [fsfonTeamId, setFsfOnTeamId] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([])

  const handleSelectUser = (e, userId) => {
    if (e.target.checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  //CSS Stylings
  const buttonStyle = {
    float: "right",
    padding: "2px",
    width: "120px",
    backgroundColor: "white",
    fontWeight: "bold",
    color: "#0070ff",
  };

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  }

  const mystyle = {
    color: "white",
    backgroundColor: "#0070FF ",
    padding: "15px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-end',
  };

  const modalStyle = {
    position: "fixed",
    top: "15%",
    left: "40%",
  };

  const mystyle2 = {
    backgroundColor: "white ",
  };

  const perStyle = {
    fontSize: 14,
  };

  const headStyle = {
    color: "#0070ff",
    fontWeight: "bold",
  };

  //GET API calls
  function getFsf() {
    fetch("http://10.3.3.80/api/getFunctionalSpecificationForm")
      .then((response) => response.json())
      .then((data) => setFsf(data.Functional))
      .catch((error) => console.log(error));
  };

  function getFsfById(id) {
    fetch(`http://10.3.3.80/api/getFunctionalSpecificationFormById?id=${id}`)
      .then((response) => response.json())
      .then((data) => setFsfById(data.Functional))
      .catch((error) => console.log(error));
  };

  function getMembers() {
    fetch(`http://10.3.3.80/api/getUsersByRoleId/5`)
      .then((response) => response.json())
      .then((data) => setMembers(data.User))
      .catch((error) => console.log(error));
  };

  function getFsfonTeamLeadId(token) {
    fetch("http://10.3.3.80/api/getFunctionalSpecificationFormByTeamLeadId", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => setFsfOnTeamId(data.Functional))
      .catch((error) => console.log(error));
  };

  //Initial rendering through useEffect
  useEffect(() => {
    getFsf();
    getMembers();
  }, []);

  // Functions for Show FSF Report Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (id) => {
    getFsfById(id)
    setIsModalOpen(id)
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Functions for Delete FSF Report Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const showModal2 = (id) => {
    setIsModalOpen2(id);
  };

  const handleOk2 = () => {
    deleteFsf(isModalOpen2);
    setIsModalOpen2(false);
  };

  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };

  // Functions for Assign Users Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false)
  const showModal4 = (id) => {
    // getHasRole(proj_id, id)
    setIsModalOpen4(true)
  }

  const handleOk4 = () => {
    // addAssignProject(isModalOpen4)
    setIsModalOpen4(false)
  }

  const handleCancel4 = () => {
    setIsModalOpen4(false)
  }

  // Delete API call
  async function deleteFsf(newid) {
    await fetch('http://10.3.3.80/api/deleteFunctionalSpecificationForm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: newid
      })
    }).then(response => {
      if (response.ok) {
        handleButtonClick1();
        getFsf()
      } else {
        handleButtonClick2();
      }
    })
      .catch(error => {
        console.error(error);
      });
  };

  // Functions for Delete FSF Success
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

  // Functions for Delete FSF Failure
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


  return (
    <>
      <div className='row'>
        <div className='col-md 6'>
          <h3>Functional Specification Form</h3>
        </div>
        <div className='col-md 6'>
          {/* Add FSF Button */}
          <Button className="btn btn-primary" style={buttonStyle} onClick={async () => {
            await navigate("/fsfform");
          }}>Add FSF</Button>
        </div>
      </div>
      <br></br>
      <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
        <CTableHead color="light" >

          {/* FSF table heading */}
          <CTableRow>
            <CTableHeaderCell className="text-center" style={mystyle}>Sr/No</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>WRICEF ID</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Functional</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>Assign</CTableHeaderCell>
            <CTableHeaderCell className="text-center" style={mystyle}>View</CTableHeaderCell>
          </CTableRow>

          {fsfonTeamId.map((fsf, index) => (
            <CTableRow key={fsf.id}>
              <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>{fsf.wricef_id}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>{fsf.name}</CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                <IconButton aria-label="assign" title="Assign Members" onAuxClick={() => showModal4(fsf.id)}>
                  <PermContactCalendarIcon htmlColor="#0070ff" />
                </IconButton>
              </CTableHeaderCell>
              <CTableHeaderCell className="text-center" style={mystyle2}>
                <IconButton aria-label="view" title='View FSF'>
                  <VisibilityIcon htmlColor="#28B463" />
                </IconButton>
              </CTableHeaderCell>
            </CTableRow>
          ))}

        </CTableHead>

        <CTableBody>

          {/* Modal for View FSF Report */}
          <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} okButtonProps={{ style: { background: 'blue' } }} style={modalStyle}>

            {fsfbyid.map((fsf) => {
              return (
                <div key={fsf.id}>
                  <h3 style={headStyle}>FSF Report</h3>
                  <br></br>
                  <h6 style={perStyle}>WRICEF ID</h6>
                  <p>{fsf.wricef_id
                  }</p>
                  <h6 style={perStyle}>Module Name</h6>
                  <p>{fsf.module_name}</p>
                  <h6 style={perStyle}>Functional Lead</h6>
                  <p>{fsf.functional_lead}</p>
                  <h6 style={perStyle}>Requested Date</h6>
                  <p>{fsf.requested_date}</p>
                  <h6 style={perStyle}>Type of Development</h6>
                  <p>{fsf.type_of_development}</p>
                  <h6 style={perStyle}>Priority</h6>
                  <p>{fsf.priority}</p>
                  <h6 style={perStyle}>Usage Frequency</h6>
                  <p>{fsf.usage_frequency}</p>
                  <h6 style={perStyle}>Transaction Code</h6>
                  <p>{fsf.transaction_code}</p>
                  <h6 style={perStyle}>Authorization Level</h6>
                  <p>{fsf.authorization_level}</p>
                </div>
              );
            })}
          </Modal>

          {/* Modal for Assign User */}
          <Modal
            title="Assign Users"
            open={isModalOpen4}
            onOk={handleOk4}
            onCancel={handleCancel4}
            okButtonProps={{ style: { background: 'blue' } }}
          >
            <br></br>
            <div className="row">
              <div className="col md-2 text-center">
                <h6>Sr/No</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6>Members</h6>
              </div>
              <div className="col md-3"></div>
              <div className="col md-2 text-center">
                <h6 style={heading}>Select</h6>
              </div>
              &nbsp;
              <Divider></Divider>
            </div>

            {members.map((mem, index) => (
              <div className="row" key={mem.id}>
                <div className="col md-2 text-center">
                  <h6 style={perStyle}>{index + 1}</h6>
                </div>
                <div className="col md-3"></div>
                <div className="col md-2 text-center">
                  <h6 style={perStyle}>{mem.name}</h6>
                </div>
                <div className="col md-3"></div>
                <div className="col md-2 text-center">
                  <Checkbox
                    checked={selectedUsers.includes(mem.id)}
                    onChange={(e) => handleSelectUser(e, mem.id)}
                  />
                </div>
                &nbsp;
                <Divider></Divider>
              </div>
            ))}
          </Modal>

          {/* Modal for Deletion Confirmation */}
          <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} okButtonProps={{ style: { background: 'blue' } }} onCancel={handleCancel2} style={modalStyle}>
          </Modal>

        </CTableBody>
      </CTable>
    </>
  )
}

export default AllFSF