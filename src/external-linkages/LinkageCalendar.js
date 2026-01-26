import React, { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Calendar,
  Typography,
  Space,
  Drawer,
  Tag,
  Descriptions,
  Table,
  Empty,
  Divider,
  Popconfirm,
  message,
  Spin
} from 'antd'
import {
  LeftOutlined,
  RightOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  EditOutlined,
  FileSearchOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import moment from 'moment'

const { Title, Text } = Typography

function LinkageCalendar() {
  // Styles
  const titleStyle = {
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0070FF',
    marginBottom: '20px'
  }

  const cardStyle = {
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  }

  // State
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)

  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const localUser = JSON.parse(localStorage.getItem('user-info'))
      const token = localUser?.token
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const response = await fetch(`${BASE_URL}/api/getUpcomingActivities`, { headers });
      const data = await response.json();
      if (response.ok && data.activities) {
        setActivities(data.activities);
      } else {
        console.error("Failed to fetch activities:", data);
      }
    } catch (error) {
      console.error("Network error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  }

  const fetchPlanDetails = async (planId) => {
    setDetailLoading(true);
    setDrawerVisible(true);
    try {
      const localUser = JSON.parse(localStorage.getItem('user-info'))
      const response = await fetch(`${BASE_URL}/api/getLinkagePlan/${planId}`, {
        headers: {
          'Authorization': `Bearer ${localUser?.token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedPlan(data.plan);
      } else {
        message.error('Failed to fetch plan details');
      }
    } catch (error) {
      message.error('Network error');
    } finally {
      setDetailLoading(false);
    }
  }

  const getStatusConfig = (status) => {
    if (!status) return { color: '#3b82f6', icon: <ClockCircleOutlined />, bg: '#dbeafe' }

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

  const dateCellRender = (value) => {
    const listData = activities.filter(activity => activity.date === value.format('YYYY-MM-DD'));
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index} className="mb-1">
            <Badge
              onClick={(e) => {
                e.stopPropagation();
                fetchPlanDetails(item.linkage_plan_id);
              }}
              style={{ cursor: 'pointer' }}
              status={
                item.activity_type === 'MOU' ? 'processing' :
                  item.activity_type === 'IP' ? 'success' :
                    item.activity_type === 'IV' ? 'default' :
                      item.activity_type === 'GLIT' ? 'warning' : 'error'
              }
              text={
                <span style={{ fontSize: '10px', whiteSpace: 'normal', lineHeight: '1.2' }}>
                  <b>{item.activity_type}:</b> {item.description}
                  <br />
                  <span style={{ color: item.linkage_plan?.status === 'Planned' ? 'green' : 'orange' }}>
                    [{item.linkage_plan?.status || 'N/A'}]
                  </span>
                </span>
              }
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="p-4">
      <Row>
        <Col span={24}>
          <h3 style={titleStyle}>Linkage Activities Calendar</h3>
          <Card style={cardStyle} bodyStyle={{ padding: '20px' }} loading={loading}>
            <Calendar
              cellRender={(value, info) => {
                if (info.type === 'date') return dateCellRender(value);
                return info.originNode;
              }}
              onSelect={(value) => {
                const dateActivities = activities.filter(a => a.date === value.format('YYYY-MM-DD'));
                if (dateActivities.length > 0) {
                  if (dateActivities.length === 1) {
                    fetchPlanDetails(dateActivities[0].linkage_plan_id);
                  }
                }
              }}
              headerRender={({ value, type, onChange, onTypeChange }) => {
                const current = value.clone();
                const localeData = value.localeData();
                const months = [];
                for (let i = 0; i < 12; i++) {
                  months.push(localeData.monthsShort(value.clone().month(i)));
                }

                return (
                  <div style={{ padding: 8, marginBottom: 10 }}>
                    <Row justify="space-between" align="middle">
                      <Col>
                        <Space>
                          <Button
                            icon={<LeftOutlined />}
                            onClick={() => {
                              const newValue = value.clone().subtract(1, 'month');
                              onChange(newValue);
                            }}
                          />
                          <Title level={4} style={{ margin: 0, color: '#6E6E6E' }}>
                            {current.format('MMMM YYYY')}
                          </Title>
                          <Button
                            icon={<RightOutlined />}
                            onClick={() => {
                              const newValue = value.clone().add(1, 'month');
                              onChange(newValue);
                            }}
                          />
                        </Space>
                      </Col>
                      <Col>
                        <Space size="large">
                          <Badge status="processing" text="MOU - MoU Signing" />
                          <Badge status="success" text="IP - Internship/Placement" />
                          <Badge status="default" text="IV - Industrial Visit" />
                          <Badge status="warning" text="GLIT - Guest Lecture" />
                          <Badge status="error" text="IDV - International Delegate Visit" />
                        </Space>
                      </Col>
                    </Row>
                  </div>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

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
              <FileSearchOutlined /> Linkage Plan Details
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
      >
        {selectedPlan ? (
          <div>
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
                <Descriptions.Item label="Focal Person">
                  {selectedPlan.focal_person || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {selectedPlan.email || 'N/A'}
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
              </Descriptions>
            </Card>

            <Divider />

            <Title level={5}>All Activities in this Plan</Title>
            {selectedPlan.activities && selectedPlan.activities.map((activity, index) => (
              <Card key={index} size="small" style={{ marginBottom: '10px', background: '#ffffff' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Tag color="blue">{activity.activity_type}</Tag>
                    <Text type="secondary">{moment(activity.date).format('MMM DD, YYYY')}</Text>
                  </div>
                  <Text strong>{activity.description}</Text>
                  {activity.partner_organization && (
                    <Text type="secondary">Partner: {activity.partner_organization}</Text>
                  )}
                  {activity.expected_outcome && (
                    <div style={{ marginTop: '4px' }}>
                      <Text type="secondary" strong>Expected Outcome: </Text>
                      <Text type="secondary">{activity.expected_outcome}</Text>
                    </div>
                  )}
                  <Tag color={activity.status === 'Completed' ? 'green' : 'orange'}>{activity.status}</Tag>
                </Space>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" spinning={detailLoading}>
              <Empty description="Fetching details..." />
            </Spin>
          </div>
        )}
      </Drawer>
    </div>
  )
}

export default LinkageCalendar