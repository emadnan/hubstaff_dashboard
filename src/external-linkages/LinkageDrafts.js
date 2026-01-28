import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Input,
    Space,
    Tag,
    Drawer,
    message,
    Row,
    Col,
    Typography,
    Divider,
    Empty,
    Spin,
    Tooltip,
    Popconfirm,
    Descriptions
} from 'antd'
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    ReloadOutlined,
    PlusOutlined,
    LeftOutlined,
    SendOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const { Title, Text } = Typography

function LinkageDrafts() {
    const navigate = useNavigate()
    const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'
    const gradientBg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

    const [drafts, setDrafts] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [drawerVisible, setDrawerVisible] = useState(false)

    useEffect(() => {
        fetchDrafts()
    }, [])

    const fetchDrafts = async () => {
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
                const draftPlans = (data.plans || []).filter(p => p.status === 'Draft')
                setDrafts(draftPlans)
            } else {
                message.error('Failed to fetch drafts')
            }
        } catch (error) {
            message.error('Network error')
        } finally {
            setLoading(false)
        }
    }

    const fetchPlanDetails = async (id) => {
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'))
            const response = await fetch(`${BASE_URL}/api/getLinkagePlan/${id}`, {
                headers: { 'Authorization': `Bearer ${localUser?.token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setSelectedPlan(data.plan)
                setDrawerVisible(true)
            }
        } catch (error) {
            message.error('Failed to load plan details')
        }
    }

    const handleFinalize = async (id) => {
        const plan = drafts.find(p => p.id === id)
        if (!plan) return

        // 🔍 Basic Validation (matching LinkagePlanForm rules)
        const missingFields = []
        if (!plan.focal_person) missingFields.push('Focal Person')
        if (!plan.campus) missingFields.push('Campus')
        if (!plan.department_id && !plan.department) missingFields.push('Department')
        if (!plan.faculty_id && !plan.faculty) missingFields.push('Faculty')
        if (!plan.phone) missingFields.push('Focal Person Phone')
        if (!plan.email) missingFields.push('Focal Person Email')

        // Check if there is at least one activity with both type and description
        const activities = plan.activities || []
        const hasValidActivity = activities.some(a => a.activity_type && a.description)
        if (!hasValidActivity) {
            missingFields.push('At least one Activity (with Type & Description)')
        }

        if (missingFields.length > 0) {
            message.error({
                content: (
                    <div style={{ textAlign: 'left' }}>
                        <strong style={{ color: '#ff4d4f' }}>Draft Incomplete!</strong>
                        <div style={{ marginTop: '5px', fontSize: '12px' }}>
                            You cannot finalize this draft because the following fields are missing:
                        </div>
                        <ul style={{ marginTop: '5px', paddingLeft: '18px', fontSize: '12px', margin: '5px 0' }}>
                            {missingFields.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                        <div style={{ fontSize: '11px', color: '#666' }}>
                            Click the <strong>Edit icon</strong> to complete your Semester Plan.
                        </div>
                    </div>
                ),
                duration: 6
            })
            return
        }

        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'))
            const response = await fetch(`${BASE_URL}/api/updatePlanStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localUser?.token}`
                },
                body: JSON.stringify({
                    id: id,
                    status: 'Pending from HOD',
                    reviewed_by: localUser?.Users?.id || localUser?.id,
                    review_comments: 'Finalized from Draft'
                })
            })

            if (response.ok) {
                message.success('Plan finalized and submitted to HOD!')
                fetchDrafts()
            } else {
                message.error('Failed to finalize')
            }
        } catch (error) {
            message.error('Network error')
        }
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
                message.success('Draft deleted')
                fetchDrafts()
            } else {
                message.error('Failed to delete')
            }
        } catch (error) {
            message.error('Network error')
        }
    }

    const filteredDrafts = drafts.filter(p =>
        p.department?.department_name?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.faculty?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        p.focal_person?.toLowerCase().includes(searchText.toLowerCase())
    )

    const columns = [
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (dept) => dept?.department_name || 'N/A'
        },
        {
            title: 'Focal Person',
            dataIndex: 'focal_person',
            key: 'focal_person',
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => moment(date).format('MMM DD, YYYY')
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Preview">
                        <Button
                            icon={<EyeOutlined style={{ color: '#0070FF' }} />}
                            onClick={() => fetchPlanDetails(record.id)}
                        />
                    </Tooltip>
                    <Tooltip title="Continue Editing">
                        <Button
                            icon={<EditOutlined style={{ color: '#f59e0b' }} />}
                            onClick={() => navigate('/external-linkages-plan-form', { state: { editMode: true, planData: record } })}
                        />
                    </Tooltip>
                    <Tooltip title="Finalize & Submit">
                        <Button
                            icon={<SendOutlined style={{ color: '#28B463' }} />}
                            onClick={() => handleFinalize(record.id)}
                        />
                    </Tooltip>
                    <Popconfirm title="Delete draft?" onConfirm={() => handleDelete(record.id)}>
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <Card style={{
                background: gradientBg,
                borderRadius: '16px',
                marginBottom: '24px',
                border: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}>
                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col>
                        <Space>
                            <Button
                                type="text"
                                icon={<LeftOutlined style={{ color: 'white' }} />}
                                onClick={() => navigate('/external-linkages-manage-forms')}
                            />
                            <Title level={window.innerWidth < 768 ? 4 : 2} style={{ color: 'white', margin: 0 }}>My Drafts</Title>
                        </Space>
                    </Col>
                    <Col>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/external-linkages-plan-form')}
                            style={{ color: 'black', fontWeight: 600 }}
                        >
                            New Plan
                        </Button>
                    </Col>
                </Row>
            </Card>

            <Card style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ marginBottom: '16px' }}>
                    <Input
                        placeholder="Search drafts..."
                        prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ maxWidth: '400px', borderRadius: '8px' }}
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredDrafts}
                    loading={loading}
                    rowKey="id"
                    scroll={{ x: 'max-content' }}
                    pagination={{ pageSize: 10 }}
                />
            </Card>

            <Drawer
                title={
                    <div style={{
                        background: gradientBg,
                        margin: '-24px -24px 24px -24px',
                        padding: '24px',
                        color: 'white'
                    }}>
                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                            Draft Preview
                        </Title>
                    </div>
                }
                placement="right"
                width={window.innerWidth < 768 ? '100%' : 700}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
            >
                {selectedPlan ? (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Card title="Plan Info" size="small">
                            <Descriptions column={1} size="small" bordered>
                                <Descriptions.Item label="Campus">{selectedPlan.campus}</Descriptions.Item>
                                <Descriptions.Item label="Department">{selectedPlan.department?.department_name}</Descriptions.Item>
                                <Descriptions.Item label="Focal Person">{selectedPlan.focal_person}</Descriptions.Item>
                            </Descriptions>
                        </Card>

                        <Card title="Activities" size="small">
                            {selectedPlan.activities?.map((a, i) => (
                                <div key={i} style={{ marginBottom: '8px', borderBottom: '1px solid #f0f0f0', paddingBottom: '8px' }}>
                                    <Tag color="blue">{a.activity_type}</Tag>
                                    <Text strong>{a.description}</Text>
                                    <br />
                                    <Text type="secondary" size="small">Target: {a.partner_organization || 'N/A'}</Text>
                                </div>
                            ))}
                        </Card>

                        <Card title="Industry Sectors" size="small">
                            {(() => {
                                const sectors = selectedPlan.industrySectors || selectedPlan.industry_sectors
                                return sectors && sectors.length > 0 ? (
                                    <Space wrap>
                                        {sectors.map((sector, index) => (
                                            <Tag key={index} color="purple">
                                                {typeof sector === 'object' ? sector.sector_name : sector}
                                            </Tag>
                                        ))}
                                    </Space>
                                ) : (
                                    <Empty description="No industry sectors" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                )
                            })()}
                        </Card>

                        <Card title="Target Employers" size="small">
                            {selectedPlan.employers && selectedPlan.employers.length > 0 ? (
                                <Space wrap>
                                    {selectedPlan.employers.map((employer, index) => (
                                        <Tag key={index} color="green">
                                            {typeof employer === 'object' ? employer.employer_name : employer}
                                        </Tag>
                                    ))}
                                </Space>
                            ) : (
                                <Empty description="No employers" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>

                        <Card title="Alumni Targets" size="small">
                            {selectedPlan.alumni && selectedPlan.alumni.length > 0 ? (
                                selectedPlan.alumni.map((alum, i) => (
                                    <div key={i} style={{ marginBottom: '8px', padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                                        <Text strong>{alum.name}</Text>
                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                            {alum.email && <div>Email: {alum.email}</div>}
                                            {alum.phone && <div>Phone: {alum.phone}</div>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <Empty description="No alumni specified" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                            )}
                        </Card>
                    </Space>
                ) : (
                    <div style={{ textAlign: 'center', padding: '50px' }}>
                        <Spin tip="Loading preview..." />
                    </div>
                )}
            </Drawer>
        </div>
    )
}

export default LinkageDrafts
