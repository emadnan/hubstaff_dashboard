import React, { useState, useEffect } from 'react'
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell } from '@coreui/react'
import { Button, Modal, message, Card, Tag } from 'antd'
import { useNavigate } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CreateIcon from '@mui/icons-material/Create'
import DeleteIcon from '@mui/icons-material/Delete'
import { MDBRow, MDBCol, MDBCard, MDBCardHeader, MDBCardBody } from 'mdb-react-ui-kit'

const BASE_URL = process.env.REACT_APP_BASE_URL

function FormList() {
    const navigate = useNavigate()
    const [forms, setForms] = useState([])
    const [loading, setLoading] = useState(false)
    const local = JSON.parse(localStorage.getItem('user-info'))
    const token = local?.token

    const fetchForms = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json()
            setForms(data)
        } catch (error) {
            console.error('Error fetching forms:', error)
            message.error('Failed to fetch forms')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchForms()
    }, [])

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this form?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    if (response.ok) {
                        message.success('Form deleted successfully')
                        fetchForms()
                    } else {
                        message.error('Failed to delete form')
                    }
                } catch (error) {
                    console.error('Error deleting form:', error)
                    message.error('Error deleting form')
                }
            },
        })
    }

    return (
        <MDBCard>
            <MDBCardHeader className="d-flex justify-content-between align-items-center">
                <h3>Form Builder</h3>
                <Button type="primary" onClick={() => navigate('/form-builder/create')}>
                    Create New Form
                </Button>
            </MDBCardHeader>
            <MDBCardBody>
                <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead color="light">
                        <CTableRow>
                            <CTableHeaderCell>Name</CTableHeaderCell>
                            <CTableHeaderCell>Description</CTableHeaderCell>
                            <CTableHeaderCell>Sections</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {forms.map((form) => (
                            <CTableRow key={form.id}>
                                <CTableDataCell>{form.name}</CTableDataCell>
                                <CTableDataCell>{form.description}</CTableDataCell>
                                <CTableDataCell>{form.sections_count || 0}</CTableDataCell>
                                <CTableDataCell>
                                    <Tag color={form.status === 'active' ? 'green' : form.status === 'draft' ? 'orange' : 'red'}>
                                        {form.status ? form.status.toUpperCase() : 'UNKNOWN'}
                                    </Tag>
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                    <IconButton onClick={() => navigate(`/form-builder/edit/${form.id}`)} color="primary">
                                        <CreateIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(form.id)} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                        {forms.length === 0 && !loading && (
                            <CTableRow>
                                <CTableDataCell colSpan="5" className="text-center">
                                    No forms found.
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </MDBCardBody>
        </MDBCard>
    )
}

export default FormList
