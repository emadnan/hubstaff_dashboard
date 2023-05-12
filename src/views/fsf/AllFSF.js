import { React, useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { Button, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SummarizeIcon from '@mui/icons-material/Summarize';

function AllFSF() {

    const navigate = useNavigate();
    const [fsf, setFsf] = useState([]);
    const [fsfbyid, setFsfById] = useState([]);

    //CSS Stylings
    const buttonStyle = {
        float: "right",
        padding: "2px",
        width: "120px",
        backgroundColor: "white",
        fontWeight: "bold",
        color: "#0070ff",
    };

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

    //Initial rendering through useEffect
    useEffect(() => {
        getFsf();
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
                        <CTableHeaderCell className="text-center" style={mystyle}>FSF Report</CTableHeaderCell>
                        <CTableHeaderCell className="text-center" style={mystyle}>Actions</CTableHeaderCell>
                    </CTableRow>

                    {fsf.map((fsf, index) => (
                        <CTableRow key={fsf.id}>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{index + 1}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>{fsf.wricef_id}</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>
                                <IconButton aria-label="View Report" onClick={() => showModal(fsf.id)}>
                                    <SummarizeIcon htmlColor='#0070ff' />
                                </IconButton>
                            </CTableHeaderCell>
                            <CTableHeaderCell className="text-center" style={mystyle2}>
                            <IconButton aria-label="delete" onClick={() => showModal2(fsf.id)}>
                            <DeleteIcon htmlColor='#FF0000' />
                          </IconButton>
                            </CTableHeaderCell>
                        </CTableRow>
                    ))}

                </CTableHead>

                <CTableBody>

                    {/* Modal for View FSF Report */}
                    <Modal title="" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

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

                    {/* Modal for Deletion Confirmation */}
                    <Modal title="Are you sure you want to delete?" open={isModalOpen2} onOk={handleOk2} onCancel={handleCancel2} style={modalStyle}>
                    </Modal>

                </CTableBody>
            </CTable>
        </>
    )
}

export default AllFSF