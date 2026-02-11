import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button, Input, Affix, Space, message, Spin, Switch, Typography, List, Card, Modal, Form as AntForm, Select, Table, Tag } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, EyeOutlined, EditOutlined, PlusOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons'
import { FormEditor, Form } from '@bpmn-io/form-js'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Import form-js styles
import '@bpmn-io/form-js/dist/assets/form-js.css'
import '@bpmn-io/form-js/dist/assets/form-js-editor.css'
import './FormEditor.css'

const { Text, Title } = Typography
const BASE_URL = process.env.REACT_APP_BASE_URL

// Define read-only system keys
const READ_ONLY_MASTER_KEYS = ['campuses', 'faculties', 'departments', 'activityTypes', 'industrySectors', 'hods']


// --- Submission Status Manager Component ---
const SubmissionStatusManager = ({ formId, visible, onClose }) => {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(false)
    const [updatingId, setUpdatingId] = useState(null)

    const local = JSON.parse(localStorage.getItem('user-info') || '{}')
    const token = local?.token

    useEffect(() => {
        if (visible && formId) {
            fetchSubmissions()
        }
    }, [visible, formId])

    const fetchSubmissions = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${formId}/submissions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setSubmissions(data)
            } else {
                message.error('Failed to fetch submissions')
            }
        } catch (error) {
            console.error('Error fetching submissions:', error)
            message.error('Error fetching submissions')
        } finally {
            setLoading(false)
        }
    }

    const updateSubmissionStatus = async (submissionId, newStatus) => {
        setUpdatingId(submissionId)
        try {
            const response = await fetch(`${BASE_URL}/api/form-submissions/${submissionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                message.success('Status updated successfully')
                fetchSubmissions() // Refresh the list
            } else {
                const error = await response.json()
                message.error(error.message || 'Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            message.error('Error updating status')
        } finally {
            setUpdatingId(null)
        }
    }
    const handleDeleteSubmission = async (submissionId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/form-submissions/${submissionId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                message.success('Submission deleted successfully')
                fetchSubmissions()
            } else {
                const error = await response.json()
                message.error(error.message || 'Failed to delete submission')
            }
        } catch (error) {
            console.error('Error deleting submission:', error)
            message.error('Error deleting submission')
        }
    }

    const handleEditSubmission = (record) => {
        // Navigate to edit page or open edit modal
        Modal.info({
            title: 'Edit Rejected Submission',
            content: (
                <div>
                    <p>Submission ID: {record.id}</p>
                    <p>Status: <Tag color="red">Rejected</Tag></p>
                    <pre style={{ maxHeight: '400px', overflow: 'auto', background: '#f5f5f5', padding: '12px' }}>
                        {JSON.stringify(record.submission_data, null, 2)}
                    </pre>
                </div>
            ),
            width: 700
        })
    }
    const getStatusColor = (status) => {
        const colors = {
            'draft': 'default',
            'submitted': 'blue',
            'Pending from HOD': 'orange',
            'approved': 'green',
            'rejected': 'red'
        }
        return colors[status] || 'default'
    }

    const columns = [
        {
            title: 'Submission ID',
            dataIndex: 'id',
            key: 'id',
            width: 120
        },
        {
            title: 'Submitted At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString(),
            width: 200
        },
        {
            title: 'Current Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            ),
            width: 150
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Select
                        value={record.status}
                        style={{ width: 180 }}
                        onChange={(value) => updateSubmissionStatus(record.id, value)}
                        loading={updatingId === record.id}
                        disabled={updatingId === record.id}
                    >
                        <Option value="draft">Draft</Option>
                        <Option value="submitted">Submitted</Option>
                        <Option value="ending from HOD">Pending from HOD</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            Modal.info({
                                title: 'Submission Data',
                                content: (
                                    <pre style={{ maxHeight: '400px', overflow: 'auto' }}>
                                        {JSON.stringify(record.submission_data, null, 2)}
                                    </pre>
                                ),
                                width: 600
                            })
                        }}
                    >
                        View Data
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <Modal
            title="Manage Form Submissions"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
            width={1000}
        >
            <Table
                columns={columns}
                dataSource={submissions}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Modal>
    )
}

SubmissionStatusManager.propTypes = {
    formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}

// --- Submission Status Manager Component ---
const SubmissionStatusManager = ({ formId, visible, onClose }) => {
    const [submissions, setSubmissions] = useState([])
    const [loading, setLoading] = useState(false)
    const [updatingId, setUpdatingId] = useState(null)

    const local = JSON.parse(localStorage.getItem('user-info') || '{}')
    const token = local?.token

    useEffect(() => {
        if (visible && formId) {
            fetchSubmissions()
        }
    }, [visible, formId])

    const fetchSubmissions = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${formId}/submissions`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setSubmissions(data)
            } else {
                message.error('Failed to fetch submissions')
            }
        } catch (error) {
            console.error('Error fetching submissions:', error)
            message.error('Error fetching submissions')
        } finally {
            setLoading(false)
        }
    }

    const updateSubmissionStatus = async (submissionId, newStatus) => {
        setUpdatingId(submissionId)
        try {
            const response = await fetch(`${BASE_URL}/api/form-submissions/${submissionId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                message.success('Status updated successfully')
                fetchSubmissions() // Refresh the list
            } else {
                const error = await response.json()
                message.error(error.message || 'Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            message.error('Error updating status')
        } finally {
            setUpdatingId(null)
        }
    }
    const handleDeleteSubmission = async (submissionId) => {
        try {
            const response = await fetch(`${BASE_URL}/api/form-submissions/${submissionId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.ok) {
                message.success('Submission deleted successfully')
                fetchSubmissions()
            } else {
                const error = await response.json()
                message.error(error.message || 'Failed to delete submission')
            }
        } catch (error) {
            console.error('Error deleting submission:', error)
            message.error('Error deleting submission')
        }
    }

    const handleEditSubmission = (record) => {
        // Navigate to edit page or open edit modal
        Modal.info({
            title: 'Edit Rejected Submission',
            content: (
                <div>
                    <p>Submission ID: {record.id}</p>
                    <p>Status: <Tag color="red">Rejected</Tag></p>
                    <pre style={{ maxHeight: '400px', overflow: 'auto', background: '#f5f5f5', padding: '12px' }}>
                        {JSON.stringify(record.submission_data, null, 2)}
                    </pre>
                </div>
            ),
            width: 700
        })
    }
    const getStatusColor = (status) => {
        const colors = {
            'draft': 'default',
            'submitted': 'blue',
            'Pending from HOD': 'orange',
            'approved': 'green',
            'rejected': 'red'
        }
        return colors[status] || 'default'
    }

    const columns = [
        {
            title: 'Submission ID',
            dataIndex: 'id',
            key: 'id',
            width: 120
        },
        {
            title: 'Submitted At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleString(),
            width: 200
        },
        {
            title: 'Current Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>
                    {status.toUpperCase()}
                </Tag>
            ),
            width: 150
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Select
                        value={record.status}
                        style={{ width: 180 }}
                        onChange={(value) => updateSubmissionStatus(record.id, value)}
                        loading={updatingId === record.id}
                        disabled={updatingId === record.id}
                    >
                        <Option value="draft">Draft</Option>
                        <Option value="submitted">Submitted</Option>
                        <Option value="ending from HOD">Pending from HOD</Option>
                        <Option value="approved">Approved</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>
                    <Button
                        icon={<EyeOutlined />}
                        onClick={() => {
                            Modal.info({
                                title: 'Submission Data',
                                content: (
                                    <pre style={{ maxHeight: '400px', overflow: 'auto' }}>
                                        {JSON.stringify(record.submission_data, null, 2)}
                                    </pre>
                                ),
                                width: 600
                            })
                        }}
                    >
                        View Data
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <Modal
            title="Manage Form Submissions"
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Close
                </Button>
            ]}
            width={1000}
        >
            <Table
                columns={columns}
                dataSource={submissions}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </Modal>
    )
}

SubmissionStatusManager.propTypes = {
    formId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
}
// --- Sortable Item Component for Section List ---

const SortableSectionItem = ({ section, isActive, onClick, onDelete, onNameChange }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    return (
        <div ref={setNodeRef} style={{ ...style, marginBottom: 8 }} {...attributes}>
            <Card
                size="small"
                hoverable
                onClick={onClick}
                style={{
                    cursor: 'pointer',
                    borderColor: isActive ? '#1890ff' : '#f0f0f0',
                    backgroundColor: isActive ? '#e6f7ff' : '#fff'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <MenuOutlined
                            style={{ marginRight: 8, cursor: 'grab', color: '#999' }}
                            {...listeners}
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                if (listeners && listeners.onPointerDown) {
                                    listeners.onPointerDown(e)
                                }
                            }}
                        />
                        <Input
                            value={section.name}
                            onChange={(e) => onNameChange(section.id, e.target.value)}
                            bordered={false}
                            style={{
                                padding: 0,
                                fontWeight: isActive ? 600 : 400,
                                background: 'transparent'
                            }}
                        />
                    </div>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onDelete(section.id); }}
                    />
                </div>
            </Card>
        </div>
    )
}

SortableSectionItem.propTypes = {
    section: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired
}

// --- Preview Component for a Single Section ---
const SectionPreview = ({ section, masterData, onDataChange }) => {
    const containerRef = useRef(null)
    const viewerInstance = useRef(null)

    useEffect(() => {
        if (!containerRef.current) return

        const viewer = new Form({ container: containerRef.current })
        viewerInstance.current = viewer

        const init = async () => {
            try {
                // Deep copy to ensure no shared state issues in viewer
                const schema = section.schema ? JSON.parse(JSON.stringify(section.schema)) : null
                if (schema && !schema.components) schema.components = []

                await viewer.importSchema(schema || { schemaVersion: 4, exporter: { name: 'form-js', version: '0.1.0' }, type: 'default', components: [] }, masterData)

                // Listen for data changes
                viewer.on('changed', (event) => {
                    if (onDataChange) {
                        onDataChange(section.id, event.data)
                    }
                })
            } catch (err) {
                console.error(`Failed to load preview for section ${section.name}`, err)
            }
        }
        init()

        return () => {
            if (viewerInstance.current) viewerInstance.current.destroy()
        }
    }, [section, masterData]) // Removed 'onDataChange' from deps to avoid re-init loop if handler is unstable, but ideally it should be stable or ref.


    return (
        <Card
            className="form-preview-card"
            style={{
                marginBottom: 32,
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                borderRadius: '12px',
                border: '1px solid #e8e8e8',
                overflow: 'visible',
                background: '#ffffff',
                position: 'relative',
                zIndex: 'auto'
            }}
            bodyStyle={{
                padding: '40px',
                position: 'relative',
                overflow: 'visible'
            }}
        >
            {/* Section Title */}
            <div style={{
                marginBottom: '32px',
                paddingBottom: '16px',
                borderBottom: '2px solid #f0f0f0'
            }}>
                <Title level={4} style={{
                    margin: 0,
                    color: '#262626',
                    fontSize: '18px',
                    fontWeight: 600
                }}>
                    {section.name}
                </Title>
            </div>

            {/* Form Fields Container */}
            <div
                ref={containerRef}
                style={{
                    position: 'relative',
                    minHeight: '100px',
                    overflow: 'visible'
                }}
                className="form-preview-fields"
            />
        </Card>
    )
}

SectionPreview.propTypes = {
    section: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        schema: PropTypes.object
    }).isRequired,
    masterData: PropTypes.object,
    onDataChange: PropTypes.func
}

const CreateFormEditor = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const isViewMode = location.pathname.includes('/view/') || location.pathname.includes('/test-form')

    const containerRef = useRef(null)
    const bpmnInstance = useRef(null)

    // State
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formName, setFormName] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [mode, setMode] = useState(isViewMode ? 'preview' : 'edit') // 'edit' | 'preview'
    const [formData, setFormData] = useState({})

    // Sections Management
    const [sections, setSections] = useState([])
    const [workflows, setWorkflows] = useState([])
    const [selectedWorkflowId, setSelectedWorkflowId] = useState(null)
    const [activeSectionId, setActiveSectionId] = useState(null)
    const [isMasterKeyModalOpen, setIsMasterKeyModalOpen] = useState(false)
    const [masterKeyForm] = AntForm.useForm()
    const [creatingMasterKey, setCreatingMasterKey] = useState(false)

    // Submission Status Manager
    const [submissionModalVisible, setSubmissionModalVisible] = useState(false)

    const local = JSON.parse(localStorage.getItem('user-info'))
    const token = local?.token

    // --- Master Data for Dropdowns ---
    const [masterData, setMasterData] = useState({})
    const [editingKey, setEditingKey] = useState(null)

    // Open modal for adding
    const openAddMasterKeyModal = () => {
        masterKeyForm.resetFields()
        setEditingKey(null)
        setIsMasterKeyModalOpen(true)
    }

    // Open modal for editing
    const openEditMasterKeyModal = (key) => {
        const currentValues = masterData[key]?.map(v => ({
            label: v.label,
            value: v.value
        })) || []

        masterKeyForm.setFieldsValue({
            name: key,
            values: currentValues
        })

        setEditingKey(key)
        setIsMasterKeyModalOpen(true)
    }

    // Save or update key
    const handleSaveMasterKey = async () => {
        try {
            const values = await masterKeyForm.validateFields()
            setCreatingMasterKey(true)

            const url = editingKey
                ? `${BASE_URL}/api/form-options/master-keys/${encodeURIComponent(editingKey)}`
                : `${BASE_URL}/api/form-options/master-keys`

            const method = editingKey ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    name: values.name,
                    values: values.values || []
                })
            })

            const data = await res.json().catch(() => ({}))

            if (res.ok) {
                message.success(editingKey ? 'Master key updated successfully!' : 'Master key created successfully!')

                // Update masterData state
                setMasterData(prev => ({
                    ...prev,
                    [values.name]: (values.values || []).map(v => ({
                        label: v.label,
                        value: v.value
                    }))
                }))

                // If editing and name changed, remove old key
                if (editingKey && editingKey !== values.name) {
                    setMasterData(prev => {
                        const updated = { ...prev }
                        delete updated[editingKey]
                        return updated
                    })
                }

                masterKeyForm.resetFields()
                setIsMasterKeyModalOpen(false)
                setEditingKey(null)
            } else {
                message.error(data.message || `Failed to ${editingKey ? 'update' : 'create'} master key`)
            }
        } catch (err) {
            console.error('Error saving master key:', err)
            message.error('An error occurred. Please try again.')
        } finally {
            setCreatingMasterKey(false)
        }
    }

    // Save form payload function
    const saveFormPayload = async (sectionsPayload, status = 'active', isAutoSave = false) => {
        try {
            const payload = {
                name: formName,
                description: formDescription,
                status,
                sections: sectionsPayload
            };

            const method = id ? 'PUT' : 'POST';
            const url = id ? `${BASE_URL}/api/forms/${id}` : `${BASE_URL}/api/forms`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                const data = await res.json();

                if (!isAutoSave) {
                    message.success(status === 'draft' ? 'Draft saved successfully!' : 'Form saved successfully!');
                }

                // CRITICAL: Update IDs from the database response without overwriting schemas
                if (data.sections && Array.isArray(data.sections)) {
                    setSections(prevSections => {
                        return data.sections.map((dbSection, idx) => {
                            // Match by database ID OR by the current index if it's a new section
                            const localMatch = prevSections.find(s => s.id === dbSection.id) || prevSections[idx];

                            return {
                                ...dbSection,
                                // Prioritize the schema we currently have in memory to avoid "jumping" back to old DB versions
                                schema: localMatch?.schema || dbSection.schema || getEmptySchema()
                            };
                        });
                    });
                }

                if (!id && data.id) {
                    navigate(`/form-builder-edit/${data.id}`, { replace: true });
                }
            } else {
                const err = await res.json();
                message.error(err.message || 'Failed to save form');
            }
        } catch (error) {
            console.error('Save error:', error);
            message.error('An error occurred while saving');
        }
    };

    // Fetch master data
    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const newData = {};

                // 1. Fetch Campuses
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/campuses`, { headers });
                    if (res.ok) {
                        const data = await res.json();
                        newData.campuses = Array.isArray(data) ? data : [];
                    }
                } catch (e) {
                    newData.campuses = [];
                }

                // 2. Fetch Faculties
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/faculties`, { headers });
                    if (res.ok) {
                        const data = await res.json();
                        newData.faculties = Array.isArray(data) ? data : [];
                    }
                } catch (e) {
                    newData.faculties = [];
                }

                // 3. Fetch Departments
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/departments`, { headers });
                    if (res.ok) {
                        const data = await res.json();
                        newData.departments = Array.isArray(data)
                            ? data.map(d => ({
                                label: d.label,
                                value: d.value || d.id?.toString()
                            }))
                            : [];
                    }
                } catch (e) {
                    newData.departments = [];
                }

                // 4. Fetch Activity Types
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/activityTypes`, { headers });
                    if (res.ok) {
                        const data = await res.json();
                        newData.activityTypes = Array.isArray(data)
                            ? data.map(item => ({
                                value: item.value || item.code,
                                label: item.label
                            }))
                            : [];
                    }
                } catch (e) {
                    newData.activityTypes = [];
                }

                // 5. Fetch Industry Sectors
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/industrySectors`, { headers });
                    if (res.ok) {
                        const data = await res.json();
                        newData.industrySectors = Array.isArray(data) ? data : [];
                    }
                } catch (e) {
                    newData.industrySectors = [];
                }

                // 6. Fetch HODs
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/hods`, { headers });
                    if (res.ok) {
                        const data = await res.json();
                        newData.hods = Array.isArray(data) ? data : [];
                    }
                } catch (e) {
                    console.error("HOD Fetch Error", e);
                }

                // 7. Fetch Custom Master Keys
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/master-keys`, { headers });
                    if (res.ok) {
                        const keys = await res.json();
                        if (Array.isArray(keys)) {
                            keys.forEach(key => {
                                if (key.name && Array.isArray(key.values)) {
                                    newData[key.name] = key.values.map(v => ({
                                        label: v.label || v.value,
                                        value: v.value?.toString()
                                    }));
                                }
                            });
                        }
                    }
                } catch (err) {
                    // Silently handle error
                }

                setMasterData(newData);

            } catch (err) {
                message.error('Failed to load form options. Please refresh the page.');
            }
        }
        fetchMasterData()
    }, [])

    // --- DND Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // --- Editor/Viewer Logic ---

    // Save current active section schema to state before switching
    const saveCurrentSectionSchema = () => {
        if (!activeSectionId || !bpmnInstance.current || !sections.length) return

        try {
            // Check if we are in a state where saving is possible (Edit mode has .saveSchema)
            // Viewer (Preview) does not have saveSchema, but we shouldn't be editing in preview anyway
            if (mode === 'edit') {
                const currentSchema = bpmnInstance.current.saveSchema()
                setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, schema: currentSchema } : s))
            }
        } catch (err) {
            console.error('Error auto-saving section schema:', err)
        }
    }

    const initEditor = async (schema) => {
        if (!containerRef.current) return
        if (bpmnInstance.current) bpmnInstance.current.destroy()

        const editor = new FormEditor({ container: containerRef.current })
        bpmnInstance.current = editor

        try {
            const schemaToImport = schema || getEmptySchema()
            if (!schemaToImport.components) {
                schemaToImport.components = []
            }
            await editor.importSchema(schemaToImport)
        } catch (err) {
            // console.error('Failed to import schema into Editor', err)
            // Fallback if schema is invalid
            await editor.importSchema(getEmptySchema())
        }
    }

    const initViewer = async (schema) => {
        if (!containerRef.current) return
        if (bpmnInstance.current) bpmnInstance.current.destroy()

        const viewer = new Form({ container: containerRef.current })
        bpmnInstance.current = viewer

        try {
            const schemaToImport = schema || getEmptySchema()
            if (!schemaToImport.components) {
                schemaToImport.components = []
            }
            await viewer.importSchema(schemaToImport, masterData)
        } catch (err) {
            console.error('Failed to import schema into Viewer', err)
        }
    }

    // --- Effects ---

    // Load form on mount
    useEffect(() => {
        if (id) {
            fetchForm()
        } else {
            // New Form: Create 1 default section
            const defaultSection = { id: `sec-${Date.now()}`, name: 'Section 1', order: 0, schema: getEmptySchema() }
            setSections([defaultSection])
            setActiveSectionId(defaultSection.id)
        }
    }, [id])

    // Sync mode with view prop
    useEffect(() => {
        if (isViewMode) {
            setMode('preview')
        }
    }, [isViewMode])

    // Handle switching sections or modes
    // When activeSectionId changes, we load that schema into the editor
    useEffect(() => {
        if (!activeSectionId) return

        const activeSection = sections.find(s => s.id === activeSectionId)
        if (activeSection) {
            // console.log('Loading section:', activeSection.name)
            if (mode === 'edit') {
                initEditor(activeSection.schema)
            } else {
                initViewer(activeSection.schema)
            }
        }
    }, [activeSectionId, mode])


    // --- Actions ---

    const fetchForm = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await response.json()
            setFormName(data.name)
            setFormDescription(data.description)
            if (data.workflow_id) setSelectedWorkflowId(data.workflow_id)

            // Check for Sections
            if (data.sections && data.sections.length > 0) {
                // Map backend sections to our state
                const mappedSections = data.sections.map(s => ({
                    id: s.id || `sec-${Math.random()}`,
                    name: s.name,
                    order: s.order,
                    schema: s.schema || getEmptySchema()
                }))
                // Sort by order
                mappedSections.sort((a, b) => a.order - b.order)

                setSections(mappedSections)
                setActiveSectionId(mappedSections[0].id)
            } else if (data.schema) {
                // Backward compatibility: Single schema form, convert to 1 section
                const singleSection = { id: `sec-default`, name: 'Main Section', order: 0, schema: data.schema }
                setSections([singleSection])
                setActiveSectionId(singleSection.id)
            } else {
                // Empty
                const defaultSection = { id: `sec-${Date.now()}`, name: 'Section 1', order: 0, schema: getEmptySchema() }
                setSections([defaultSection])
                setActiveSectionId(defaultSection.id)
            }
        } catch (error) {
            console.error('Error fetching form:', error)
            message.error('Failed to fetch form details')
        } finally {
            setLoading(false)
        }
    }

    const addSection = () => {
        // Capture current schema manually to avoid race conditions with state updates
        const currentSchema = bpmnInstance.current && mode === 'edit' ? bpmnInstance.current.saveSchema() : null

        setSections(prevSections => {
            // Update current section if needed
            const updatedSections = prevSections.map(s =>
                s.id === activeSectionId && currentSchema
                    ? { ...s, schema: currentSchema }
                    : s
            )

            const newSection = {
                id: `sec-${Date.now()}`,
                name: `Section ${updatedSections.length + 1}`,
                order: updatedSections.length,
                schema: getEmptySchema()
            }

            // We can't side-effect set the active ID easily here, 
            // so we'll do it by effect or just set it after. 
            // But since this is sync, we can just grab the ID.
            setTimeout(() => setActiveSectionId(newSection.id), 0)

            return [...updatedSections, newSection]
        })
    }

    const switchSection = async (id) => {
        if (id === activeSectionId) return

        // 1. Capture current state
        let currentSchema = null
        try {
            currentSchema = bpmnInstance.current && mode === 'edit' ? bpmnInstance.current.saveSchema() : null
        } catch (e) {
            console.error('Failed to save current schema:', e)
        }

        // 2. Update local state
        // We need to calculate the NEW sections array to pass to the next render AND to the save function
        const updatedSections = sections.map(s =>
            s.id === activeSectionId && currentSchema
                ? { ...s, schema: currentSchema }
                : s
        )

        setSections(updatedSections)
        setActiveSectionId(id)

        // 3. Auto-save as draft
        // We use the updatedSections we just calculated
        // Only auto-save if we have a name (or meaningful data) to avoid creating junk
        if (formName) {
            await saveFormPayload(updatedSections, 'draft', true, id) // Pass target active ID
        }
    }

    const updateSectionName = (id, newName) => {
        setSections(sections.map(s => s.id === id ? { ...s, name: newName } : s))
    }

    const deleteSection = (id) => {
        if (sections.length <= 1) {
            message.warning('Forms must have at least one section.')
            return
        }

        Modal.confirm({
            title: 'Delete Section?',
            content: 'This will delete the section and all its fields.',
            onOk: () => {
                const newSections = sections.filter(s => s.id !== id)
                setSections(newSections)
                if (activeSectionId === id) {
                    setActiveSectionId(newSections[0].id)
                }
            }
        })
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id)
                const newIndex = items.findIndex(i => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const toggleMode = () => {
        saveCurrentSectionSchema()
        setMode(prev => prev === 'edit' ? 'preview' : 'edit')
    }

    const handleSave = async (status = 'active') => {
        if (!formName) {
            message.error('Please enter a form name');
            return;
        }

        setSaving(true);

        try {
            // 1. Get the absolute latest schema directly from the editor instance
            let currentSchema = null;
            if (bpmnInstance.current && typeof bpmnInstance.current.saveSchema === 'function') {
                const rawSchema = bpmnInstance.current.saveSchema();
                currentSchema = prepareSchema(rawSchema);
            }

            // 2. Build the payload using the absolute latest data for the active section
            const sectionsPayload = sections.map((s, index) => {
                const isCurrent = s.id === activeSectionId;
                return {
                    id: typeof s.id === 'string' && s.id.startsWith('sec-') ? null : s.id,
                    name: s.name,
                    order: index,
                    schema: isCurrent && currentSchema ? currentSchema : prepareSchema(s.schema)
                };
            });

            // 3. Update local state immediately so UI is in sync
            setSections(prev => prev.map(s =>
                s.id === activeSectionId && currentSchema ? { ...s, schema: currentSchema } : s
            ));

            // 4. Send to API
            await saveFormPayload(sectionsPayload, status);
        } catch (err) {
            console.error('Error in handleSave:', err);
            message.error('Failed to prepare form data for saving.');
        } finally {
            if (!silent) setSaving(false)
        }
    }

    const handleSectionDataChange = (sectionId, data) => {
        setFormData(prev => ({
            ...prev,
            [sectionId]: data
        }))
    }

    const handleSubmitForm = async () => {
        // Merge section data
        let mergedData = {}
        Object.values(formData).forEach(sectionData => {
            mergedData = { ...mergedData, ...sectionData }
        })

        // Clean data: Remove masterData keys that might have polluted the form data
        if (masterData) {
            Object.keys(masterData).forEach(key => {
                delete mergedData[key]
            })
        }

        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ data: mergedData })
            })

            const resData = await response.json()

            if (response.ok) {
                message.success('Form submitted successfully!')
            } else {
                if (resData.errors) {
                    const errorMsg = Object.values(resData.errors).flat()[0] || 'Submission invalid'
                    message.error(errorMsg)
                } else {
                    message.error(resData.message || 'Submission failed')
                }
            }
        } catch (error) {
            console.error('Submission error:', error)
            message.error('An error occurred during submission.')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteMasterKey = async (key) => {
        Modal.confirm({
            title: `Delete Master Key "${key}"?`,
            content: 'This will remove the key and all its values. This action cannot be undone.',
            okText: 'Delete',
            okType: 'danger',
            onOk: async () => {
                try {
                    const res = await fetch(`${BASE_URL}/api/form-options/master-keys/${encodeURIComponent(key)}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                    })

                    if (res.ok) {
                        message.success(`Master key "${key}" deleted.`)
                        setMasterData(prev => {
                            const updated = { ...prev }
                            delete updated[key]
                            return updated
                        })
                    } else {
                        const data = await res.json().catch(() => ({}))
                        message.error(data.message || 'Failed to delete master key')
                    }
                } catch (err) {
                    console.error('Error deleting master key:', err)
                    message.error('Error deleting master key. Please try again.')
                }
            }
        })
    }

    const handleGetAllMasterKeys = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/form-options/master-keys`, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (res.ok) {
                const keys = await res.json()
                console.log('=== ALL MASTER KEYS ===')
                console.log('Raw Response:', keys)

                const formattedKeys = keys.map(key => ({
                    name: key.name,
                    valueCount: Array.isArray(key.values) ? key.values.length : 0,
                    values: key.values || [],
                }))

                console.table(formattedKeys.map(k => ({
                    Name: k.name,
                    'Value Count': k.valueCount
                })))

                formattedKeys.forEach(k => {
                    console.log(`\n📋 ${k.name} (${k.valueCount} values):`, k.values)
                })

                message.success(`Retrieved ${keys.length} master keys. Check browser console for details.`)
                return keys
            } else {
                const data = await res.json().catch(() => ({}))
                message.error(data.message || 'Failed to fetch master keys')
            }
        } catch (err) {
            console.error('Error fetching all master keys:', err)
            message.error('Error fetching master keys. Please try again.')
        }
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5', overflow: 'hidden' }}>
            {/* Header */}
            <div className="editor-header">
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/form-builder')} type="text" style={{ fontSize: '16px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                        <Input
                            placeholder="Form Name"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            variant="borderless"
                            style={{ fontSize: '18px', fontWeight: 'bold', padding: 0, height: '24px' }}
                        />
                        <Input
                            placeholder="Add description..."
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            variant="borderless"
                            size="small"
                            style={{ color: '#888', padding: 0, fontSize: '12px' }}
                        />
                    </div>
                    <div style={{ marginLeft: 24, display: 'flex', alignItems: 'center' }}>
                        <Text strong style={{ marginRight: 8, whiteSpace: 'nowrap' }}>Workflow:</Text>
                        <Select
                            placeholder="Attach Workflow"
                            value={selectedWorkflowId}
                            onChange={setSelectedWorkflowId}
                            style={{ width: 200 }}
                            allowClear
                        >
                            {workflows.map(w => (
                                <Option key={w.id} value={w.id}>{w.name || `Workflow #${w.id}`}</Option>
                            ))}
                        </Select>
                        <Space style={{ marginLeft: 8 }}>
                            <Button
                                type="text"
                                size="small"
                                icon={<PlusOutlined />}
                                onClick={() => navigate('/workflow-builder')}
                                title="Create New Workflow"
                            />
                            {selectedWorkflowId && (
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<EditOutlined />}
                                    onClick={() => navigate(`/workflow-builder`)}
                                    title="Edit Selected Workflow"
                                />
                            )}
                        </Space>
                    </div>
                </Space>
                <Space size="middle">
                    {/* Manage Submissions Button - only show when editing an existing form */}
                    {id && !isViewMode && (
                        <Button
                            icon={<EditOutlined />}
                            onClick={() => setSubmissionModalVisible(true)}
                        >
                            Manage Submissions
                        </Button>
                    )}

                    {!isViewMode && (
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f0f2f5', padding: '4px 8px', borderRadius: '6px' }}>
                            <Text style={{ marginRight: 8, fontSize: '12px', fontWeight: 500, color: '#666' }}>{mode === 'edit' ? 'Design Mode' : 'Preview Mode'}</Text>
                            <Switch
                                checkedChildren={<EyeOutlined />}
                                unCheckedChildren={<EditOutlined />}
                                checked={mode === 'preview'}
                                onChange={toggleMode}
                                size="small"
                            />
                        </div>
                    )}
                    {!isViewMode && <Button type="default" icon={<SaveOutlined />} onClick={() => handleSave('draft')} loading={saving}>Save Draft</Button>}
                    {!isViewMode && <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave('active')} loading={saving} style={{ background: '#28B463', borderColor: '#28B463' }}>Save & Publish</Button>}
                </Space>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left Sidebar: Sections List and Data Sources */}
                {mode === 'edit' && (
                    <div className="editor-sidebar">
                        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <Text strong style={{ fontSize: '14px' }}>Form Sections</Text>
                            <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addSection}>Add</Button>
                        </div>

                        <div className="sidebar-list-container" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                    {sections.map(section => (
                                        <div className="sidebar-section-item" key={section.id}>
                                            <SortableSectionItem
                                                section={section}
                                                isActive={activeSectionId === section.id}
                                                onClick={() => switchSection(section.id)}
                                                onDelete={deleteSection}
                                                onNameChange={updateSectionName}
                                            />
                                        </div>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>

                        {/* Available Data Sources Help Panel */}
                        <div style={{ padding: '16px', borderTop: '1px solid #e8e8e8', background: '#fcfcfc' }}>
                            <div className="data-source-panel-header">
                                <Text strong style={{ fontSize: '12px', color: '#595959' }}>Master Data Keys</Text>
                            </div>

                            <div style={{ maxHeight: '150px', overflowY: 'auto' }} className="sidebar-list-container">
                                <List
                                    size="small"
                                    dataSource={Object.keys(masterData)}
                                    renderItem={key => (
                                        <List.Item style={{ padding: '6px 0', fontSize: '11px', borderBottom: '1px solid #f5f5f5' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <span style={{ fontFamily: 'monospace', color: '#096dd9' }}>{key}</span>
                                                <Typography.Paragraph
                                                    copyable={{ text: key, tooltips: ['Copy', 'Copied!'] }}
                                                    style={{ margin: 0 }}
                                                />
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginTop: '8px', lineHeight: '1.4' }}>
                                Paste these keys into the <b>&quot;Values Key&quot;</b> property of Select components.
                            </Text>
                        </div>
                    </div>
                )}

                {/* Right Area: Form Editor Canvas / Preview */}
                <div className="editor-main-canvas-wrapper" style={{ background: mode === 'preview' ? '#f0f2f5' : undefined, overflowY: mode === 'preview' ? 'auto' : 'hidden' }}>
                    {/* Overlay Loader */}
                    {loading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(2px)' }}>
                            <Spin size="large" tip="Loading Form..." />
                        </div>
                    )}

                    {mode === 'edit' ? (
                        <div className="editor-paper-card">
                            <div className="section-header-bar">
                                <Text strong style={{ fontSize: '14px', color: '#333' }}>
                                    Form Designer
                                </Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Active Section: <span style={{ color: '#1890ff', fontWeight: 500 }}>{sections.find(s => s.id === activeSectionId)?.name}</span>
                                </Text>
                            </div>
                            <div
                                ref={containerRef}
                                style={{ flex: 1, position: 'relative' }}
                            />
                        </div>
                    ) : (
                        <div style={{
                            padding: '48px 24px',
                            maxWidth: '900px',
                            margin: '0 auto',
                            width: '100%',
                            overflow: 'visible',
                            position: 'relative'
                        }}>
                            {/* Form Header */}
                            <div style={{
                                textAlign: 'center',
                                marginBottom: 48,
                                padding: '32px',
                                background: '#ffffff',
                                borderRadius: '12px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <Title level={2} style={{
                                    marginBottom: 12,
                                    color: '#1a1a1a',
                                    fontSize: '28px',
                                    fontWeight: 600
                                }}>
                                    {formName || 'Untitled Form'}
                                </Title>
                                {formDescription && (
                                    <Text style={{
                                        fontSize: '15px',
                                        color: '#666',
                                        display: 'block',
                                        lineHeight: 1.6
                                    }}>
                                        {formDescription}
                                    </Text>
                                )}
                            </div>

                            {sections.map(section => (
                                <SectionPreview
                                    key={section.id}
                                    section={section}
                                    masterData={masterData}
                                    onDataChange={handleSectionDataChange}
                                />
                            ))}

                            {/* Submit Buttons */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '16px',
                                marginTop: 48,
                                paddingBottom: 48
                            }}>
                                <Button
                                    size="large"
                                    style={{
                                        minWidth: 180,
                                        height: 48,
                                        fontSize: 15,
                                        fontWeight: 500,
                                        borderRadius: '8px'
                                    }}
                                    onClick={() => handleSubmitForm(true)}
                                >
                                    Save as Draft
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        minWidth: 200,
                                        height: 48,
                                        fontSize: 15,
                                        fontWeight: 500,
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 0 rgba(0,0,0,0.045)'
                                    }}
                                    onClick={() => handleSubmitForm(false)}
                                >
                                    Submit Form
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Submission Status Manager Modal */}
            <SubmissionStatusManager
                formId={id}
                visible={submissionModalVisible}
                onClose={() => setSubmissionModalVisible(false)}
            />
        </div>
    )
}

export default CreateFormEditor
