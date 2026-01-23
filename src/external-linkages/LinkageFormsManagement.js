import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Input,
    Select,
    Space,
    Tag,
    Modal,
    Drawer,
    Descriptions,
    message,
    Popconfirm,
    Row,
    Col,
    Typography,
    Divider,
    Badge,
    Tooltip,
    Empty,
    Spin
} from 'antd'
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    PlusOutlined,
    ReloadOutlined,
    FilterOutlined,
    CloseCircleOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const { Title, Text } = Typography
const { Option } = Select

function LinkageFormsManagement() {
    // Modern Styling
    const primaryColor = '#0070FF'
    const secondaryColor = '#28B463'
    const gradientBg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

    const pageStyle = {
        background: 'linear-gradient(to bottom, #f0f4f8 0%, #ffffff 100%)',
        minHeight: '100vh',
        padding: '32px 24px'
    }

    const headerCardStyle = {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        marginBottom: '32px',
        border: 'none',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)'
    }

    const mainCardStyle = {
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: 'none',
        overflow: 'hidden'
    }

    const filterCardStyle = {
        background: '#f8fafc',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
    }

    // State Management
    const [linkagePlans, setLinkagePlans] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [campusFilter, setCampusFilter] = useState(null)
    const [statusFilter, setStatusFilter] = useState(null)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [campuses, setCampuses] = useState([])

    const navigate = useNavigate()
    const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

    // Fetch Data
    useEffect(() => {
        fetchLinkagePlans()
        fetchCampuses()
    }, [])

    useEffect(() => {
        applyFilters()
    }, [searchText, campusFilter, statusFilter, linkagePlans])

    const fetchLinkagePlans = async () => {
        setLoading(true)
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'))
            const response = await fetch(`${BASE_URL}/api/getLinkagePlans`, {
                headers: {
                    'Authorization': `Bearer ${localUser?.token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log('Fetched plans:', data.plans) // Debug log
                setLinkagePlans(data.plans || [])
            } else {
                message.error('Failed to fetch linkage plans')
            }
        } catch (error) {
            message.error('Network error while fetching plans')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchCampuses = async () => {
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'))
            const response = await fetch(`${BASE_URL}/api/getCampuses`, {
                headers: {
                    'Authorization': `Bearer ${localUser?.token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                if (Array.isArray(data)) {
                    setCampuses(data)
                } else {
                    console.error('Campuses data is not an array:', data)
                    setCampuses([])
                }
            }
        } catch (error) {
            console.error('Failed to fetch campuses:', error)
            setCampuses([])
        }
    }

    const applyFilters = () => {
        let filtered = [...linkagePlans]

        if (searchText) {
            filtered = filtered.filter(plan =>
                plan.faculty?.toLowerCase().includes(searchText.toLowerCase()) ||
                plan.department?.toLowerCase().includes(searchText.toLowerCase()) ||
                plan.focal_person?.toLowerCase().includes(searchText.toLowerCase()) ||
                plan.campus?.toLowerCase().includes(searchText.toLowerCase())
            )
        }

        if (campusFilter) {
            filtered = filtered.filter(plan => plan.campus === campusFilter)
        }

        if (statusFilter) {
            filtered = filtered.filter(plan => (plan.status || 'Planned') === statusFilter)
        }

        setFilteredData(filtered)
    }

    const handleDelete = async (id) => {
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'))
            const response = await fetch(`${BASE_URL}/api/deleteLinkagePlan/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localUser?.token}`
                }
            })

            if (response.ok) {
                message.success('Linkage plan deleted successfully')
                fetchLinkagePlans()
            } else {
                message.error('Failed to delete linkage plan')
            }
        } catch (error) {
            message.error('Network error while deleting plan')
        }
    }

    const handleApprove = async (id) => {
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'))
            const response = await fetch(`${BASE_URL}/api/approveLinkagePlan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localUser?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            })

            if (response.ok) {
                message.success('Plan approved successfully')
                fetchLinkagePlans()
            } else {
                const errorData = await response.json()
                message.error(errorData.message || 'Failed to approve plan')
            }
        } catch (error) {
            console.error(error)
            message.error('Network error')
        }
    }

    const handleReject = async (id) => {
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'))
            const response = await fetch(`${BASE_URL}/api/rejectLinkagePlan`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localUser?.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id })
            })

            if (response.ok) {
                message.success('Plan rejected')
                fetchLinkagePlans()
            } else {
                const errorData = await response.json()
                message.error(errorData.message || 'Failed to reject plan')
            }
        } catch (error) {
            console.error(error)
            message.error('Network error')
        }
    }

    const handleViewDetails = (plan) => {
        console.log('Selected plan:', plan) // Debug log
        setSelectedPlan(plan)
        setDrawerVisible(true)
    }

    const handleEdit = (plan) => {
        // Navigate to plan form with plan data in state
        navigate('/external-linkages/plan-form', { state: { editMode: true, planData: plan } })
    }

    const getStatusConfig = (status) => {
        if (!status) return { color: '#3b82f6', icon: <ClockCircleOutlined />, bg: '#dbeafe' } // Default Safe Fallback

        if (status.startsWith('Pending from')) {
            return { color: '#8b5cf6', icon: <ClockCircleOutlined />, bg: '#ede9fe' }
        }
        if (status.startsWith('Rejected') || status === 'Rejected') {
            return { color: '#ef4444', icon: <CloseCircleOutlined />, bg: '#fee2e2' }
        }
        if (status === 'Approved') {
            return { color: '#10b981', icon: <CheckCircleOutlined />, bg: '#d1fae5' }
        }

        const configs = {
            'Planned': { color: '#3b82f6', icon: <ClockCircleOutlined />, bg: '#dbeafe' },
            'Draft': { color: '#94a3b8', icon: <EditOutlined />, bg: '#f1f5f9' },
            'In Progress': { color: '#f59e0b', icon: <ClockCircleOutlined />, bg: '#fef3c7' },
            'Completed': { color: '#10b981', icon: <CheckCircleOutlined />, bg: '#d1fae5' },
            'Cancelled': { color: '#ef4444', icon: <CloseCircleOutlined />, bg: '#fee2e2' },
            'Pending': { color: '#8b5cf6', icon: <ClockCircleOutlined />, bg: '#ede9fe' }
        }
        return configs[status] || configs['Planned']
    }

    const clearFilters = () => {
        setSearchText('')
        setCampusFilter(null)
        setStatusFilter(null)
    }

    // Table Columns
    const columns = [
        {
            title: <Text strong style={{ color: '#1e293b' }}>Campus</Text>,
            dataIndex: 'campus',
            key: 'campus',
            width: 140,
            render: (text) => (
                <Tag color="blue" style={{ borderRadius: '6px', padding: '4px 12px', fontWeight: 500 }}>
                    {text}
                </Tag>
            )
        },
        {
            title: <Text strong style={{ color: '#1e293b' }}>Faculty</Text>,
            dataIndex: 'faculty',
            key: 'faculty',
            ellipsis: true,
            render: (text) => {
                const name = typeof text === 'object' && text !== null ? text.name : text
                return (
                    <Tooltip title={name}>
                        <span style={{ color: '#64748b' }}>{name || 'N/A'}</span>
                    </Tooltip>
                )
            }
        },
        {
            title: <Text strong style={{ color: '#1e293b' }}>Department</Text>,
            dataIndex: 'department',
            key: 'department',
            ellipsis: true,
            render: (text) => {
                const name = typeof text === 'object' && text !== null ? (text.department_name || text.name) : text
                return (
                    <Tooltip title={name}>
                        <span style={{ color: '#64748b' }}>{name || 'N/A'}</span>
                    </Tooltip>
                )
            }
        },
        {
            title: <Text strong style={{ color: '#1e293b' }}>Focal Person</Text>,
            dataIndex: 'focal_person',
            key: 'focal_person',
            render: (text) => (
                <Space>
                    <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px'
                    }}>
                        {text?.charAt(0)?.toUpperCase()}
                    </div>
                    <Text>{text}</Text>
                </Space>
            )
        },
        {
            title: <Text strong style={{ color: '#1e293b' }}>Email</Text>,
            dataIndex: 'email',
            key: 'email',
            ellipsis: true,
            render: (text) => (
                <div style={{ fontSize: '13px', color: '#334155' }}>{text || 'N/A'}</div>
            )
        },
        {
            title: <Text strong style={{ color: '#1e293b' }}>Status</Text>,
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (status) => {
                const config = getStatusConfig(status || 'Planned')
                return (
                    <Tag
                        icon={config.icon}
                        color={config.color}
                        style={{
                            borderRadius: '20px',
                            padding: '0 10px',
                            border: 'none',
                            fontWeight: 500
                        }}
                    >
                        {status || 'Planned'}
                    </Tag>
                )
            }
        },
        {
            title: <Text strong style={{ color: '#1e293b' }}>Submitted</Text>,
            dataIndex: 'created_at',
            key: 'created_at',
            width: 130,
            render: (date) => (
                <Text style={{ color: '#64748b', fontSize: '13px' }}>
                    {moment(date).format('MMM DD, YYYY')}
                </Text>
            )
        },
        {
            title: <Text strong style={{ color: '#1e293b' }}>Actions</Text>,
            key: 'actions',
            width: 100,
            render: (_, record) => {
                const localUser = JSON.parse(localStorage.getItem('user-info'))
                // Access ID from 'Users' object inside localUser (based on UserController response)
                const userId = localUser?.Users?.id || localUser?.id
                const isInitiator = userId == record.submitted_by

                return (
                    <Space size="small">
                        <Tooltip title="View Details">
                            <Button
                                shape="circle"
                                icon={<EyeOutlined style={{ color: '#0070FF' }} />}
                                size="small"
                                onClick={() => handleViewDetails(record)}
                                style={{
                                    border: '1px solid #e2e8f0',
                                    background: 'white',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                }}
                            />
                        </Tooltip>
                        {isInitiator && !['Pending from Linkage Office', 'Planned'].includes(record.status) && (
                            <>
                                <Tooltip title="Edit">
                                    <Button
                                        shape="circle"
                                        icon={<EditOutlined style={{ color: '#f59e0b' }} />}
                                        size="small"
                                        onClick={() => handleEdit(record)}
                                        style={{
                                            border: '1px solid #e2e8f0',
                                            background: 'white',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                        }}
                                    />
                                </Tooltip>
                                <Popconfirm
                                    title="Delete this plan?"
                                    description="This action cannot be undone."
                                    onConfirm={() => handleDelete(record.id)}
                                    okText="Delete"
                                    cancelText="Cancel"
                                    okButtonProps={{ danger: true, size: 'small' }}
                                    cancelButtonProps={{ size: 'small' }}
                                >
                                    <Tooltip title="Delete">
                                        <Button
                                            danger
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            size="small"
                                            style={{
                                                background: '#fff1f2',
                                                border: '1px solid #fecdd3',
                                                color: '#ef4444'
                                            }}
                                        />
                                    </Tooltip>
                                </Popconfirm>
                            </>
                        )}
                    </Space>
                )
            }
        }
    ]

    return (
        <div style={pageStyle}>
            {/* Header Card */}
            <Card style={headerCardStyle} bodyStyle={{ padding: '32px' }}>
                <Row justify="space-between" align="middle">
                    <Col>
                        <Title level={2} style={{ color: 'white', margin: 0, marginBottom: '8px' }}>
                            Manage Linkage Forms
                        </Title>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}>
                            View and manage all submitted external linkage plans
                        </Text>
                    </Col>
                    <Col>
                        <Space size="middle">
                            <Button
                                type="default"
                                icon={<ReloadOutlined />}
                                onClick={fetchLinkagePlans}
                                size="large"
                                style={{
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.15)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    color: 'white',
                                    fontWeight: 500,
                                    backdropFilter: 'blur(4px)'
                                }}
                            >
                                Refresh
                            </Button>

                            {(JSON.parse(localStorage.getItem('user-info'))?.permissions?.includes('Nav_LinkagePlanForm')) && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => navigate('/external-linkages/plan-form')}
                                    size="large"
                                    style={{
                                        borderRadius: '12px',
                                        background: 'white',
                                        color: '#667eea',
                                        border: 'none',
                                        fontWeight: 600,
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                                        paddingLeft: '24px',
                                        paddingRight: '24px'
                                    }}
                                >
                                    New Linkage Plan
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Filters Card */}
            <Card style={filterCardStyle} bodyStyle={{ padding: 0 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={24} md={10}>
                        <Input
                            placeholder="Search by faculty, department, or focal person..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            allowClear
                            size="large"
                            style={{ borderRadius: '10px' }}
                        />
                    </Col>
                    <Col xs={12} sm={12} md={5}>
                        <Select
                            placeholder="Filter by Campus"
                            value={campusFilter}
                            onChange={setCampusFilter}
                            allowClear
                            style={{ width: '100%', borderRadius: '10px' }}
                            size="large"
                        >
                            {campuses.map(campus => (
                                <Option key={campus.id} value={campus.name}>{campus.name}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col xs={12} sm={12} md={5}>
                        <Select
                            placeholder="Filter by Status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            allowClear
                            style={{ width: '100%' }}
                            size="large"
                        >
                            <Option value="Planned">Planned</Option>
                            <Option value="Pending from HOD">Pending from HOD</Option>
                            <Option value="Pending from Linkage Office">Pending from Linkage Office</Option>
                            <Option value="Rejected">Rejected</Option>
                            <Option value="Draft">Draft</Option>
                        </Select>
                    </Col>
                    <Col xs={24} sm={24} md={4}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <Badge
                                count={filteredData.length}
                                showZero
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                                }}
                            >
                                <Button
                                    icon={<FilterOutlined />}
                                    size="large"
                                    style={{ borderRadius: '10px' }}
                                >
                                    Results
                                </Button>
                            </Badge>
                            {(searchText || campusFilter || statusFilter) && (
                                <Button
                                    type="link"
                                    onClick={clearFilters}
                                    style={{ color: '#ef4444' }}
                                >
                                    Clear
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Main Table Card */}
            <Card style={mainCardStyle}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => (
                            <Text strong style={{ color: '#64748b' }}>
                                Total {total} plans
                            </Text>
                        ),
                        pageSizeOptions: ['10', '20', '50', '100'],
                        style: { marginTop: '24px' }
                    }}
                    locale={{
                        emptyText: (
                            <Empty
                                description={
                                    <span style={{ color: '#94a3b8' }}>
                                        No linkage plans found. Create your first plan to get started!
                                    </span>
                                }
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        )
                    }}
                    rowClassName={(record, index) =>
                        index % 2 === 0 ? 'table-row-light' : 'table-row-dark'
                    }
                />
            </Card>

            {/* Details Drawer */}
            <Drawer
                title={
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        margin: '-24px -24px 24px -24px',
                        padding: '24px',
                        color: 'white'
                    }}>
                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                            Linkage Plan Details
                        </Title>
                    </div>
                }
                placement="right"
                width={800}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                styles={{
                    body: { padding: '24px', background: '#f8fafc' }
                }}
                footer={
                    selectedPlan?.can_approve ? (
                        <div style={{ textAlign: 'right', padding: '16px 24px' }}>
                            <Space>
                                <Popconfirm
                                    title="Reject Plan"
                                    description="Are you sure you want to reject this plan?"
                                    onConfirm={() => {
                                        handleReject(selectedPlan.id)
                                        setDrawerVisible(false) // Close drawer after action
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button danger size="large" icon={<CloseCircleOutlined />}>
                                        Reject
                                    </Button>
                                </Popconfirm>
                                <Popconfirm
                                    title="Approve Plan"
                                    description="Are you sure you want to approve this plan?"
                                    onConfirm={() => {
                                        handleApprove(selectedPlan.id)
                                        setDrawerVisible(false) // Close drawer after action
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button type="primary" size="large" icon={<CheckCircleOutlined />} style={{ background: '#28B463', borderColor: '#28B463' }}>
                                        Approve
                                    </Button>
                                </Popconfirm>
                            </Space>
                        </div>
                    ) : null
                }
            >
                {selectedPlan && (
                    <div>
                        {/* Basic Information */}
                        <Card
                            title={<Text strong style={{ fontSize: '16px' }}>Basic Information</Text>}
                            style={{ marginBottom: '16px', borderRadius: '12px' }}
                        >
                            <Descriptions bordered column={2} size="small">
                                <Descriptions.Item label="Campus" span={2}>
                                    <Tag color="blue" style={{ borderRadius: '6px' }}>
                                        {selectedPlan.campus || 'N/A'}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Faculty" span={2}>
                                    <Text strong>
                                        {(typeof selectedPlan.faculty === 'object' ? selectedPlan.faculty?.name : selectedPlan.faculty) || 'N/A'}
                                    </Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Department" span={2}>
                                    {(typeof selectedPlan.department === 'object' ? selectedPlan.department?.department_name : selectedPlan.department) || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Dean/Head">
                                    {selectedPlan.dean_head || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Focal Person">
                                    {selectedPlan.focal_person || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Email">
                                    {selectedPlan.email || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    {selectedPlan.phone || 'N/A'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Status" span={2}>
                                    {(() => {
                                        const config = getStatusConfig(selectedPlan.status || 'Planned')
                                        return (
                                            <Tag
                                                icon={config.icon}
                                                color={config.color}
                                                style={{ borderRadius: '20px', padding: '4px 14px' }}
                                            >
                                                {selectedPlan.status || 'Planned'}
                                            </Tag>
                                        )
                                    })()}
                                </Descriptions.Item>
                                <Descriptions.Item label="Submitted" span={2}>
                                    {moment(selectedPlan.created_at).format('MMMM DD, YYYY [at] h:mm A')}
                                </Descriptions.Item>
                                {selectedPlan.current_step_role && (
                                    <Descriptions.Item label="Current Pending At" span={2}>
                                        <Badge status="processing" text={selectedPlan.current_step_role} />
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>

                        {/* Approval History */}
                        {selectedPlan.workflow_logs && selectedPlan.workflow_logs.length > 0 && (
                            <Card
                                title={<Text strong style={{ fontSize: '16px' }}>Approval History</Text>}
                                style={{ marginBottom: '16px', borderRadius: '12px' }}
                            >
                                <Table
                                    size="small"
                                    dataSource={selectedPlan.workflow_logs}
                                    pagination={false}
                                    rowKey="id"
                                    columns={[
                                        { title: 'Step', dataIndex: ['step', 'role_name'], key: 'step' },
                                        { title: 'User', dataIndex: ['user', 'name'], key: 'user' },
                                        {
                                            title: 'Action',
                                            dataIndex: 'action',
                                            key: 'action',
                                            render: (action) => (
                                                <Tag color={action === 'Approve' ? 'green' : 'red'}>{action}</Tag>
                                            )
                                        },
                                        { title: 'Comments', dataIndex: 'comments', key: 'comments' },
                                        {
                                            title: 'Date',
                                            dataIndex: 'created_at',
                                            key: 'date',
                                            render: (date) => moment(date).format('MMM DD, HH:mm')
                                        },
                                    ]}
                                />
                            </Card>
                        )}

                        {/* Goals */}
                        <Card
                            title={<Text strong style={{ fontSize: '16px' }}>Linkage Goals</Text>}
                            style={{ marginBottom: '16px', borderRadius: '12px' }}
                        >
                            {selectedPlan.goals && selectedPlan.goals.length > 0 ? (
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    {selectedPlan.goals.map((goal, index) => (
                                        <Card key={index} size="small" style={{ background: '#f1f5f9', borderRadius: '8px' }}>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <Tag color="purple" style={{ borderRadius: '6px' }}>{goal.type}</Tag>
                                                <Text>{goal.deliverable}</Text>
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="No goals defined" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>

                        {/* Activities */}
                        <Card
                            title={<Text strong style={{ fontSize: '16px' }}>Planned Activities</Text>}
                            style={{ marginBottom: '16px', borderRadius: '12px' }}
                        >
                            {selectedPlan.activities && selectedPlan.activities.length > 0 ? (
                                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                    {selectedPlan.activities.map((activity, index) => (
                                        <Card key={index} size="small" style={{ background: '#f1f5f9', borderRadius: '8px' }}>
                                            <Space direction="vertical" style={{ width: '100%' }}>
                                                <div>
                                                    <Tag color="blue" style={{ borderRadius: '6px' }}>{activity.activity_type}</Tag>
                                                    <Text strong style={{ marginLeft: '8px' }}>{activity.description}</Text>
                                                </div>
                                                {activity.partner_organization && (
                                                    <Text type="secondary">
                                                        <strong>Partner:</strong> {activity.partner_organization}
                                                    </Text>
                                                )}
                                                {activity.date && (
                                                    <Text type="secondary">
                                                        <strong>Date:</strong> {moment(activity.date).format('MMM DD, YYYY')}
                                                    </Text>
                                                )}
                                                {activity.expected_outcome && (
                                                    <Text type="secondary">
                                                        <strong>Expected Outcome:</strong> {activity.expected_outcome}
                                                    </Text>
                                                )}
                                                {(() => {
                                                    const config = getStatusConfig(activity.status)
                                                    return (
                                                        <Tag icon={config.icon} color={config.color} style={{ borderRadius: '20px' }}>
                                                            {activity.status}
                                                        </Tag>
                                                    )
                                                })()}
                                            </Space>
                                        </Card>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="No activities planned" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>

                        {/* Industry Sectors */}
                        <Card
                            title={<Text strong style={{ fontSize: '16px' }}>Industry Sectors</Text>}
                            style={{ marginBottom: '16px', borderRadius: '12px' }}
                        >
                            {selectedPlan.industry_sectors && selectedPlan.industry_sectors.length > 0 ? (
                                <Space wrap>
                                    {selectedPlan.industry_sectors.map((sector, index) => (
                                        <Tag key={index} color="purple" style={{ borderRadius: '6px', padding: '4px 12px' }}>
                                            {sector}
                                        </Tag>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="No industry sectors specified" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>

                        {/* Employers */}
                        <Card
                            title={<Text strong style={{ fontSize: '16px' }}>Target Employers</Text>}
                            style={{ marginBottom: '16px', borderRadius: '12px' }}
                        >
                            {selectedPlan.employers && selectedPlan.employers.length > 0 ? (
                                <Space wrap>
                                    {selectedPlan.employers.map((employer, index) => (
                                        <Tag key={index} color="green" style={{ borderRadius: '6px', padding: '4px 12px' }}>
                                            {employer}
                                        </Tag>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="No employers specified" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>

                        {/* Alumni */}
                        <Card
                            title={<Text strong style={{ fontSize: '16px' }}>Alumni Targets</Text>}
                            style={{ marginBottom: '16px', borderRadius: '12px' }}
                        >
                            {selectedPlan.alumni && selectedPlan.alumni.length > 0 ? (
                                <Space direction="vertical" style={{ width: '100%' }} size="small">
                                    {selectedPlan.alumni.map((alum, index) => (
                                        <Card key={index} size="small" style={{ background: '#f1f5f9', borderRadius: '8px' }}>
                                            <Text strong>{alum.name}</Text>
                                            <br />
                                            <Text type="secondary">{alum.email}</Text>
                                            {alum.phone && <Text type="secondary"> • {alum.phone}</Text>}
                                        </Card>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="No alumni targets specified" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>

                        {/* Support Required */}
                        {selectedPlan.support_required && (
                            <Card
                                title={<Text strong style={{ fontSize: '16px' }}>Support Required</Text>}
                                style={{ borderRadius: '12px' }}
                            >
                                <Text>{selectedPlan.support_required}</Text>
                            </Card>
                        )}
                    </div>
                )}
            </Drawer>

            <style>{`
        .table-row-light {
          background-color: #ffffff;
        }
        .table-row-dark {
          background-color: #f8fafc;
        }
        .ant-table-thead > tr > th {
          background: linear-gradient(to right, #f1f5f9, #e2e8f0) !important;
          font-weight: 600;
          border-bottom: 2px solid #cbd5e1;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #f0f9ff !important;
        }
      `}</style>
        </div >
    )
}

export default LinkageFormsManagement

