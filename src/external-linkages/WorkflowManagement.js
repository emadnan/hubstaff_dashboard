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
    InputNumber,
    message,
    Popconfirm,
    Breadcrumb,
    Tag
} from 'antd'
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    ArrowLeftOutlined,
    OrderedListOutlined,
    UserOutlined
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Text } = Typography

const WorkflowManagement = () => {
    const [workflow, setWorkflow] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [editingStep, setEditingStep] = useState(null)
    const [form] = Form.useForm()
    const navigate = useNavigate()

    const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'
    const local = JSON.parse(localStorage.getItem('user-info'))
    const token = local?.token

    useEffect(() => {
        fetchActiveWorkflow()
    }, [])

    const fetchActiveWorkflow = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/getActiveLinkageWorkflow`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setWorkflow(data)
            } else {
                message.error('Failed to fetch workflow')
            }
        } catch (error) {
            console.error('Error:', error)
            message.error('Network error')
        } finally {
            setLoading(false)
        }
    }

    const handleAddStep = async (values) => {
        try {
            const response = await fetch(`${BASE_URL}/api/addLinkageWorkflowStep`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    workflow_id: workflow.id,
                    role_name: values.role_name,
                    step_order: values.step_order
                })
            })

            if (response.ok) {
                message.success('Step added successfully')
                setIsModalVisible(false)
                form.resetFields()
                fetchActiveWorkflow()
            } else {
                message.error('Failed to add step')
            }
        } catch (error) {
            message.error('Network error')
        }
    }

    const handleDeleteStep = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/deleteLinkageWorkflowStep/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })

            if (response.ok) {
                message.success('Step deleted successfully')
                fetchActiveWorkflow()
            } else {
                message.error('Failed to delete step')
            }
        } catch (error) {
            message.error('Network error')
        }
    }

    const columns = [
        {
            title: 'Order',
            dataIndex: 'step_order',
            key: 'step_order',
            render: (order) => (
                <Tag color="blue" icon={<OrderedListOutlined />}>
                    Step {order}
                </Tag>
            )
        },
        {
            title: 'Role Name',
            dataIndex: 'role_name',
            key: 'role_name',
            render: (text) => (
                <Space>
                    <UserOutlined />
                    <Text strong>{text}</Text>
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Are you sure to delete this step?"
                        onConfirm={() => handleDeleteStep(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button danger icon={<DeleteOutlined />} size="small" />
                    </Popconfirm>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => openEditModal(record)}
                    />
                </Space >
            )
        }
    ]

    const openEditModal = (step) => {
        setEditingStep(step)
        form.setFieldsValue({
            role_name: step.role_name,
            step_order: step.step_order
        })
        setIsModalVisible(true)
    }

    const handleFormSubmit = async (values) => {
        if (editingStep) {
            // Update Logic
            try {
                const response = await fetch(`${BASE_URL}/api/updateLinkageWorkflowStep/${editingStep.id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        role_name: values.role_name,
                        step_order: values.step_order
                    })
                })

                if (response.ok) {
                    message.success('Step updated successfully')
                    setIsModalVisible(false)
                    setEditingStep(null)
                    form.resetFields()
                    fetchActiveWorkflow()
                } else {
                    message.error('Failed to update step')
                }
            } catch (error) {
                message.error('Network error')
            }
        } else {
            // Add Logic
            handleAddStep(values)
        }
    }

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Breadcrumb style={{ marginBottom: '16px' }}>
                <Breadcrumb.Item onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>Home</Breadcrumb.Item>
                <Breadcrumb.Item>External Linkages</Breadcrumb.Item>
                <Breadcrumb.Item>Linkage Workflow Management</Breadcrumb.Item>
            </Breadcrumb>

            <Card
                title={
                    <Space>
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} type="text" />
                        <Title level={4} style={{ margin: 0 }}>Linkage Workflow Management</Title>
                    </Space>
                }
                extra={
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsModalVisible(true)}
                        style={{ background: '#0070FF' }}
                    >
                        Add Step
                    </Button>
                }
                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <Text type="secondary">
                        Define the sequence of approval steps for External Linkage Plans.
                        The system currently uses the first step as the default after submission.
                    </Text>
                </div>

                <Table
                    dataSource={workflow?.steps || []}
                    columns={columns}
                    loading={loading}
                    rowKey="id"
                    pagination={false}
                />
            </Card>

            <Modal
                title={editingStep ? "Edit Workflow Step" : "Add Workflow Step"}
                open={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                    setEditingStep(null)
                    form.resetFields()
                }}
                onOk={() => form.submit()}
            >
                <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                    <Form.Item
                        name="role_name"
                        label="Approver Role"
                        rules={[{ required: true, message: 'Please enter role name (e.g., HOD, Linkage Officer)' }]}
                    >
                        <Input placeholder="Enter role name" />
                    </Form.Item>
                    <Form.Item
                        name="step_order"
                        label="Order Sequence"
                        rules={[{ required: true, message: 'Please enter sequence order' }]}
                        initialValue={(workflow?.steps?.length || 0) + 1}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default WorkflowManagement
