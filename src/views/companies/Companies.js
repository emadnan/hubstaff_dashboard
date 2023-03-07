import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Modal, Button } from 'antd';
import { React, useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const Companies = () => {

  const [company_name, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [company_email, setCompanyEmail] = useState("");
  const [contact_no, setContactNo] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

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

  const [users, setUsers] = useState([]);

  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
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
    marginLeft: '85%',
  };

  function getList() {
    fetch("http://127.0.0.1:8000/api/getcompany")
      .then((response) => response.json())
      .then((data) => setUsers(data.companies))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getList()
  }, []);

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
          console.log('Company added Successfully');
          getList()
        } else {
          console.error('Failed to add company');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

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
            console.log('Company deleted successfully');
            getList()
        } else {
            console.error('Failed to delete company');
        }
    })
        .catch(error => {
            console.error(error);
        });

}


  return (
    <>
      <div className="card">
        <div className="card-body">
          <Button className="btn btn-primary" style={buttonStyle} onClick={showModal}>Add Company</Button>
          <CTable align="middle" className="mb-0 border" hover responsive style={{ marginTop: '20px' }}>
            <CTableHead color="light" >

              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>Company Name</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Address</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Company Email</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Contact No</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>City</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Country</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>Action</CTableHeaderCell>
              </CTableRow>

              {users.map((company) => (
                <CTableRow key={company.id}>
                  <CTableHeaderCell className="text-center">{company.company_name}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.address}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.company_email}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.contact_no}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.city}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">{company.country}</CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ marginLeft: '85%' }}>
                    <IconButton aria-label="delete" onClick={() => deleteCompany(company.id)}>
                      <DeleteIcon color="primary" />
                    </IconButton>
                    <IconButton aria-label="update">
                      <EditIcon color="primary " />
                    </IconButton>
                  </CTableHeaderCell>
                </CTableRow>
              ))}

            </CTableHead>
            <CTableBody>

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

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter City"
                  />
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Country"
                  />
                </div>

              </Modal>
            </CTableBody>
          </CTable>
        </div>
      </div>
    </>
  );
}

export default Companies;