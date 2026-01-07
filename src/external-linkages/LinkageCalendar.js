import React, { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Badge,
  Calendar,
  Typography,
  Space
} from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const { Title } = Typography

function LinkageCalendar() {
  // Styles reused/adapted from Dashboard.js
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

  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000';

  React.useEffect(() => {
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
        // Transform backend activity to calendar format if needed
        // Backend: { id, activity_type, description, date, status, ... }
        const mappedActivities = data.activities.map(act => ({
          date: act.date,
          title: act.description,
          type: act.activity_type,
          status: act.status, // Activity Status
          planStatus: act.linkage_plan ? act.linkage_plan.status : 'N/A', // Plan Status
          planId: act.linkage_plan_id
        }));
        setActivities(mappedActivities);
      } else {
        console.error("Failed to fetch activities:", data);
      }
    } catch (error) {
      console.error("Network error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  }

  const getActivitiesForDate = (value) => {
    const dateString = value.format('YYYY-MM-DD')
    return activities.filter(activity => activity.date === dateString)
  }

  const dateCellRender = (value) => {
    const listData = getActivitiesForDate(value);
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {listData.map((item, index) => (
          <li key={index} className="mb-1">
            <Badge
              status={
                item.type === 'MOU' ? 'processing' :
                  item.type === 'IP' ? 'success' :
                    item.type === 'IV' ? 'default' :
                      item.type === 'GLIT' ? 'warning' : 'error'
              }
              text={
                <span style={{ fontSize: '10px', whiteSpace: 'normal', lineHeight: '1.2' }}>
                  <b>{item.type}:</b> {item.title}
                  <br />
                  <span style={{ color: item.planStatus === 'Planned' ? 'green' : 'orange' }}>
                    [{item.planStatus}]
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
    </div>
  )
}

export default LinkageCalendar