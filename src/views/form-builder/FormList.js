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

        const result = await response.json()
        console.log("Forms API:", result)

        let formsArray = []

        if (Array.isArray(result)) {
            formsArray = result
        } else if (Array.isArray(result.data)) {
            formsArray = result.data
        } else if (Array.isArray(result.data?.data)) {
            formsArray = result.data.data
        }

        setForms(formsArray)

    } catch (error) {
        console.error("Error fetching forms:", error)
        setForms([]) // prevent crash
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

    // Drafts Logic
    const [drafts, setDrafts] = useState([])
    const [draftsLoading, setDraftsLoading] = useState(false)
    const [isDraftModalOpen, setIsDraftModalOpen] = useState(false)

    const fetchDrafts = async () => {
        setDraftsLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/drafts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
            }
            
            const data = await response.json()
            // Ensure data is an array
            setDrafts(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching drafts:', error)
            message.error(error.message || 'Failed to fetch drafts')
            setDrafts([])
        } finally {
            setDraftsLoading(false)
        }
    }

    const openDraftsModal = () => {
        setIsDraftModalOpen(true)
        fetchDrafts()
    }

    const handleContinueDraft = (formId, submissionId, draftType) => {
        if (draftType === 'form_structure') {
            // Navigate to edit mode to continue editing the form structure
            navigate(`/form-builder/edit/${formId}`)
        } else {
            // Navigate to view mode with submission ID to continue filling the form
            // TODO: Implement loading submission data in FormRenderer
            navigate(`/form-builder/view/${formId}?submissionId=${submissionId}`)
        }
    }

    return (
        <MDBCard>
            <MDBCardHeader className="d-flex justify-content-between align-items-center">
                <h3>Form Builder</h3>
                <div>
                    <Button onClick={openDraftsModal} style={{ marginRight: 8 }}>
                        View Drafts
                    </Button>
                    <Button type="primary" onClick={() => navigate('/form-builder/create')}>
                        Create New Form
                    </Button>
                </div>
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
                                    <IconButton onClick={() => navigate(`/form-builder/view/${form.id}`)} color="info" title="Preview Form">
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => navigate(`/form-builder/edit/${form.id}`)} color="primary" title="Edit Form">
                                        <CreateIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(form.id)} color="error" title="Delete Form">
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

            <Modal
                title="Saved Drafts"
                open={isDraftModalOpen}
                onCancel={() => setIsDraftModalOpen(false)}
                footer={null}
                width={800}
            >
                <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead color="light">
                        <CTableRow>
                            <CTableHeaderCell>Form Name</CTableHeaderCell>
                            <CTableHeaderCell>Saved At</CTableHeaderCell>
                            <CTableHeaderCell>Status</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {drafts.map((draft) => (
                            <CTableRow key={draft.id}>
                                <CTableDataCell>{draft.form ? draft.form.name : 'Unknown Form'}</CTableDataCell>
                                <CTableDataCell>{new Date(draft.updated_at || draft.created_at).toLocaleString()}</CTableDataCell>
                                <CTableDataCell>
                                    <Tag color="orange">
                                        {draft.type === 'form_structure' ? 'FORM DRAFT' : 'SUBMISSION DRAFT'}
                                    </Tag>
                                </CTableDataCell>
                                <CTableDataCell>
                                    <Button 
                                        size="small" 
                                        type="primary" 
                                        onClick={() => handleContinueDraft(draft.form_id, draft.id, draft.type)}
                                    >
                                        {draft.type === 'form_structure' ? 'Edit Form' : 'Continue'}
                                    </Button>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                        {drafts.length === 0 && !draftsLoading && (
                            <CTableRow>
                                <CTableDataCell colSpan="4" className="text-center">
                                    No drafts found.
                                </CTableDataCell>
                            </CTableRow>
                        )}
                    </CTableBody>
                </CTable>
            </Modal>
        </MDBCard>
    )
}

export default FormList
