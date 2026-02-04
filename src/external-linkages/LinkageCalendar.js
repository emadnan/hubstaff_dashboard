import React, { useState, useEffect } from 'react';
import {
    Card, Row, Col, Badge, Calendar, Typography, Space, Drawer, Tag, Descriptions, Empty, Divider, message, Spin, Modal
} from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title, Text } = Typography;

function LinkageCalendar() {
    // State
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null); 
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);
    const [selectedDateActivities, setSelectedDateActivities] = useState([]);
    const [activitiesModalVisible, setActivitiesModalVisible] = useState(false);

    const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        setLoading(true);
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'));
            const token = localUser?.token;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const currentYear = moment().year();
            const start = `${currentYear}-01-01`;
            const end = `${currentYear}-12-31`;

            const response = await fetch(`${BASE_URL}/api/getActivitiesByDateRange?start_date=${start}&end_date=${end}`, { headers });
            const data = await response.json();
            if (response.ok && data.activities) {
                setActivities(data.activities);
            }
        } catch (error) {
            console.error("Network error fetching activities:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlanDetails = async (planId) => {
        setDetailLoading(true);
        setDrawerVisible(true);
        try {
            const localUser = JSON.parse(localStorage.getItem('user-info'));
            const response = await fetch(`${BASE_URL}/api/getLinkagePlan/${planId}`, {
                headers: { 'Authorization': `Bearer ${localUser?.token}` }
            });
            const data = await response.json();
            
            if (response.ok) {
                // Set the plan data directly from the response
                setSelectedPlan(data); 
            } else {
                message.error('Failed to fetch plan details');
            }
        } catch (error) {
            message.error('Network error');
        } finally {
            setDetailLoading(false);
        }
    };

    const dateCellRender = (value) => {
        const dateStr = value.format('YYYY-MM-DD');
        const listData = activities.filter(activity => activity.start === dateStr);

        return (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: '100px', overflowY: 'auto' }}>
                {listData.map((item, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                        <Badge
                            onClick={(e) => {
                                e.stopPropagation();
                                fetchPlanDetails(item.id);
                            }}
                            status={item.status === 'Planned' ? 'success' : 'processing'}
                            text={
                                <div style={{ 
                                    cursor: 'pointer', 
                                    fontSize: '11px', 
                                    lineHeight: '1.2',
                                    background: '#f0f7ff',
                                    padding: '2px 4px',
                                    borderRadius: '4px',
                                    border: '1px solid #bae7ff'
                                }}>
                                    <span style={{ fontWeight: 'bold' }}>{item.partner}</span>
                                    <div style={{ color: '#595959', fontSize: '10px' }}>{item.title}</div>
                                </div>
                            }
                        />
                    </li>
                ))}
            </ul>
        );
    };

    // Define 'plan' here so it is available to the JSX below
    const plan = selectedPlan;

    return (
        <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
            <Card bordered={false} style={{ borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
                    <Col>
                        <Title level={3} style={{ margin: 0, color: '#003a8c' }}>Linkage Activities Calendar</Title>
                        <Text type="secondary">View and track all approved and pending linkage plans</Text>
                    </Col>
                    <Col>
                        <Space>
                            <Badge status="processing" text="Pending" />
                            <Badge status="success" text="Planned" />
                        </Space>
                    </Col>
                </Row>

                <Spin spinning={loading}>
                    <Calendar
                        cellRender={(value, info) => {
                            if (info.type === 'date') return dateCellRender(value);
                            return info.originNode;
                        }}
                        onSelect={(value) => {
                            const dateStr = value.format('YYYY-MM-DD');
                            const dateActivities = activities.filter(a => a.start === dateStr);
                            if (dateActivities.length > 0) {
                                setSelectedDateActivities(dateActivities);
                                setActivitiesModalVisible(true);
                            }
                        }}
                    />
                </Spin>
            </Card>

            {/* Plan Detail Drawer */}
            <Drawer
                title={
                    <Space>
                        <FileSearchOutlined />
                        <span>Linkage Plan Details</span>
                    </Space>
                }
                width={640}
                onClose={() => setDrawerVisible(false)}
                open={drawerVisible}
                styles={{ header: { background: '#fafafa' } }}
            >
                {detailLoading ? (
                    <div style={{ textAlign: 'center', paddingTop: '50px' }}><Spin tip="Loading..." /></div>
                ) : plan ? (
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        <Descriptions title="Institutional Info" bordered column={1} size="small">
                            <Descriptions.Item label="Campus">{plan.campus}</Descriptions.Item>
                            <Descriptions.Item label="Faculty">{plan.faculty}</Descriptions.Item>
                            <Descriptions.Item label="Department">{plan.department}</Descriptions.Item>
                            <Descriptions.Item label="Dean/HOD">{plan.dean_head}</Descriptions.Item>
                        </Descriptions>

                        <Descriptions title="Focal Person" bordered column={1} size="small">
                            <Descriptions.Item label="Name">{plan.focal_person}</Descriptions.Item>
                            <Descriptions.Item label="Email">{plan.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone">{plan.phone}</Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Planned Activities</Divider>
                        {plan.activities?.map((act, idx) => (
                            <Card key={idx} size="small" style={{ marginBottom: 10, borderLeft: '4px solid #1890ff' }}>
                                <Descriptions column={1} size="small">
                                    <Descriptions.Item label="Type"><strong>{act.activity_type}</strong></Descriptions.Item>
                                    <Descriptions.Item label="Partner">{act.partner_organization}</Descriptions.Item>
                                    <Descriptions.Item label="Tentative Date">{act.date}</Descriptions.Item>
                                    <Descriptions.Item label="Outcome">{act.expected_outcome}</Descriptions.Item>
                                </Descriptions>
                            </Card>
                        ))}

                        {plan.support_required && (
                            <Descriptions title="Support Required" bordered column={1} size="small">
                                <Descriptions.Item label="Details">{plan.support_required}</Descriptions.Item>
                            </Descriptions>
                        )}
                        
                        <Descriptions title="Status Information" bordered column={1} size="small">
                            <Descriptions.Item label="Current Status">
                                <Tag color={plan.status === 'Planned' ? 'green' : 'blue'}>{plan.status}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Submission Date">{plan.created_at}</Descriptions.Item>
                        </Descriptions>
                    </Space>
                ) : <Empty description="No details found" />}
            </Drawer>

            {/* Day Activities Modal */}
            <Modal
                title={`Activities on ${selectedDateActivities[0]?.start}`}
                open={activitiesModalVisible}
                onCancel={() => setActivitiesModalVisible(false)}
                footer={null}
            >
                {selectedDateActivities.map((activity, index) => (
                    <Card 
                        key={index} 
                        hoverable 
                        style={{ marginBottom: '12px' }}
                        onClick={() => {
                            setActivitiesModalVisible(false);
                            fetchPlanDetails(activity.id);
                        }}
                    >
                        <Space direction="vertical">
                            <Text strong style={{ color: '#1890ff' }}>{activity.title}</Text>
                            <Text type="secondary">Partner: {activity.partner}</Text>
                            <Tag color="blue">{activity.status}</Tag>
                        </Space>
                    </Card>
                ))}
            </Modal>
        </div>
    );
}

export default LinkageCalendar;