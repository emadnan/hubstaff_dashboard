import React, { useState, useEffect } from 'react'
import {
    Card,
    Table,
    Button,
    Typography,
    Space,
    Modal,
    Form,
    Input,
    message,
    Tag,
    Divider,
    Descriptions,
    Badge
} from 'antd'
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    EyeOutlined,
    ClockCircleOutlined,
    FileSearchOutlined
} from '@ant-design/icons'
import moment from 'moment'

const { Title, Text } = Typography
const { TextArea } = Input

const LinkageApprovals = () => {
    const [plans, setPlans] = useState([])
    const [loading, setLoading] = useState(false)
    const [reviewModalVisible, setReviewModalVisible] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [reviewAction, setReviewAction] = useState(null) // 'approve' or 'reject'
    const [form] = Form.useForm()

    const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'
    const local = JSON.parse(localStorage.getItem('user-info'))
    const token = local?.token

    useEffect(() => {
        fetchPendingPlans()
    }, [])

    const fetchPendingPlans = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/getPendingApprovals`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setPlans(data.plans || [])
            } else {
                message.error('Failed to fetch pending approvals')
            }
        } catch (error) {
            message.error('Network error')
        } finally {
            setLoading(false)
        }
    }

    const handleReview = async (values) => {
        const endpoint = reviewAction === 'approve' ? 'approveLinkagePlan' : 'rejectLinkagePlan'
        try {
            const response = await fetch(`${BASE_URL}/api/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    id: selectedPlan.id,
                    comments: values.comments
                })
            })

            if (response.ok) {
                message.success(`Plan ${reviewAction}d successfully`)
                setReviewModalVisible(false)
                form.resetFields()
                fetchPendingPlans()
            } else {
                message.error(`Failed to ${reviewAction} plan`)
            }
        } catch (error) {
            message.error('Network error')
        }
    }

    const openReviewModal = (plan, action) => {
        setSelectedPlan(plan)
        setReviewAction(action)
        setReviewModalVisible(true)
    }

    const columns = [
        {
            title: 'Submitted By',
            dataIndex: 'submitter',
            key: 'submitter',
            render: (user) => <Text strong>{user?.name || 'N/A'}</Text>
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
            render: (dept) => (typeof dept === 'object' ? dept?.department_name : dept) || 'N/A'
        },
        {
            title: 'Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => moment(date).format('MMM DD, YYYY')
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'Pending from Linkage Office' ? 'purple' : 'orange'}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        style={{ background: '#28a745', borderColor: '#28a745' }}
                        icon={<CheckCircleOutlined />}
                        onClick={() => openReviewModal(record, 'approve')}
                    >
                        Approve
                    </Button>
                    <Button
                        danger
                        icon={<CloseCircleOutlined />}
                        onClick={() => openReviewModal(record, 'reject')}
                    >
                        Reject
                    </Button>
                </Space>
            )
        }
    ]

    return (
        <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
            <div style={{ marginBottom: '32px' }}>
                <Title level={3}><FileSearchOutlined /> Pending Approvals</Title>
                <Text type="secondary">Review and approve External Linkage Plans assigned to your role.</Text>
            </div>

            <Card style={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Table
                    columns={columns}
                    dataSource={plans}
                    loading={loading}
                    rowKey="id"
                    locale={{ emptyText: <Badge status="processing" text="No pending approvals found at this time." /> }}
                />
            </Card>

            <Modal
                title={reviewAction === 'approve' ? 'Approve Linkage Plan' : 'Reject Linkage Plan'}
                open={reviewModalVisible}
                onCancel={() => setReviewModalVisible(false)}
                onOk={() => form.submit()}
                width={700}
            >
                {selectedPlan && (
                    <div style={{ marginBottom: '20px' }}>
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="Focal Person">{selectedPlan.focal_person}</Descriptions.Item>
                            <Descriptions.Item label="Department">
                                {typeof selectedPlan.department === 'object'
                                    ? selectedPlan.department?.department_name
                                    : selectedPlan.department}
                            </Descriptions.Item>
                        </Descriptions>
                        <Divider />
                        <Form form={form} layout="vertical" onFinish={handleReview}>
                            <Form.Item
                                name="comments"
                                label="Review Comments"
                                rules={[{ required: reviewAction === 'reject', message: 'Comments are mandatory for rejection' }]}
                            >
                                <TextArea rows={4} placeholder="Add your feedback here..." />
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>
        </div>
    )
}

export default LinkageApprovals
