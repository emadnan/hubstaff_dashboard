import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Form,
  Space,
  message,
  Typography,
  Divider,
  Tag,
  Tooltip,
  Steps,
  Result
} from 'antd'
import {
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  SendOutlined,
  InfoCircleOutlined,
  CalendarOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  RocketOutlined,
  TeamOutlined
} from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography
const { Step } = Steps

const LinkagePlanForm = () => {
  const location = useLocation()
  const navigate = useNavigate()

  // Check if we're in edit mode
  const editMode = location.state?.editMode || false
  const planData = location.state?.planData || null

  // --- Modern Styling Tokens ---
  const primaryColor = '#0070FF'
  const secondaryColor = '#28B463'

  const cardStyle = {
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    border: 'none',
    marginBottom: '32px'
  }

  const sectionTitleStyle = {
    color: primaryColor,
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }

  // --- State Management ---
  const [currentStep, setCurrentStep] = useState(0)
  const [campusData, setCampusData] = useState([])
  const [facultyData, setFacultyData] = useState({})
  const [activityTypes, setActivityTypes] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [success, setSuccess] = useState(false)

  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

  const [basicInfo, setBasicInfo] = useState({
    campus: '',
    faculty: '',
    department: '',
    deanHead: '',
    focalPerson: '',
    email: '',
    phone: ''
  })

  const [goals, setGoals] = useState([{ type: '', deliverable: '' }])
  const [activities, setActivities] = useState([{ type: '', description: '', partner: '', date: '', outcome: '' }])
  const [industrySectors, setIndustrySectors] = useState([''])
  const [employers, setEmployers] = useState([''])
  const [alumni, setAlumni] = useState([{ name: '', email: '', phone: '' }])
  const [supportRequired, setSupportRequired] = useState('')

  // --- Pre-populate form if in edit mode ---
  useEffect(() => {
    if (editMode && planData) {
      setBasicInfo({
        campus: planData.campus || '',
        faculty: planData.faculty || '',
        department: planData.department || '',
        deanHead: planData.dean_head || '',
        focalPerson: planData.focal_person || '',
        email: planData.email || '',
        phone: planData.phone || ''
      })

      if (planData.goals && planData.goals.length > 0) {
        setGoals(planData.goals)
      }

      if (planData.activities && planData.activities.length > 0) {
        setActivities(planData.activities.map(a => ({
          type: a.activity_type,
          description: a.description,
          partner: a.partner_organization || '',
          date: a.date || '',
          outcome: a.expected_outcome || ''
        })))
      }

      if (planData.industry_sectors && planData.industry_sectors.length > 0) {
        setIndustrySectors(planData.industry_sectors)
      }

      if (planData.employers && planData.employers.length > 0) {
        setEmployers(planData.employers)
      }

      if (planData.alumni && planData.alumni.length > 0) {
        setAlumni(planData.alumni)
      }

      setSupportRequired(planData.support_required || '')

      // Fetch faculties for the selected campus
      if (planData.campus) {
        fetchFacultiesForCampus(planData.campus)
      }
    }
  }, [editMode, planData])

  // --- Data Fetching ---
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [campusResponse, actResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/getCampuses`),
          fetch(`${BASE_URL}/api/getActivityTypes`)
        ])

        if (campusResponse.ok) setCampusData(await campusResponse.json())
        if (actResponse.ok) setActivityTypes(await actResponse.json())
      } catch (error) {
        message.error("Failed to load master data from server")
      }
    }
    fetchMasterData()
  }, [])

  // Fetch faculties when campus is selected
  const fetchFacultiesForCampus = async (campusName) => {
    try {
      const response = await fetch(`${BASE_URL}/api/getFaculties?campus=${encodeURIComponent(campusName)}`)
      if (response.ok) {
        const data = await response.json()
        setFacultyData(data)
      } else {
        message.error("Failed to load faculties for selected campus")
      }
    } catch (error) {
      message.error("Failed to load faculties from server")
    }
  }

  // --- Validation ---
  const validateStep = (step) => {
    if (step === 0) {
      const { campus, faculty, department, focalPerson, email, phone } = basicInfo
      if (!campus || !faculty || !department || !focalPerson || !email || !phone) {
        message.warning("Please fill all required basic information")
        return false
      }
      return true
    }
    if (step === 1) {
      if (!goals.some(g => g.type && g.deliverable)) {
        message.warning("Please add at least one complete linkage goal")
        return false
      }
      return true
    }
    return true
  }

  // --- Handlers ---
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    setLoading(true)
    const localUser = JSON.parse(localStorage.getItem('user-info'))
    const userId = localUser?.Users?.id || 1

    const payload = {
      campus: basicInfo.campus,
      faculty: basicInfo.faculty,
      department: basicInfo.department,
      dean_head: basicInfo.deanHead,
      focal_person: basicInfo.focalPerson,
      email: basicInfo.email,
      phone: basicInfo.phone,
      semester: "Spring 2025",
      academic_year: "2024-2025",
      support_required: supportRequired,
      submitted_by: userId,
      goals: goals.filter(g => g.type && g.deliverable),
      activities: activities.filter(a => a.type && a.description).map(a => ({
        activity_type: a.type,
        description: a.description,
        partner_organization: a.partner,
        date: a.date,
        expected_outcome: a.outcome,
        status: a.status || 'Planned'
      })),
      industry_sectors: industrySectors.filter(s => s.trim()),
      employers: employers.filter(e => e.trim()),
      alumni: alumni.filter(a => a.name)
    }

    try {
      const url = editMode
        ? `${BASE_URL}/api/updateLinkagePlan/${planData.id}`
        : `${BASE_URL}/api/addLinkagePlan`

      const method = editMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localUser?.token}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        setSuccess(true)
        message.success(editMode
          ? "External Linkage Plan updated successfully!"
          : "External Linkage Plan submitted successfully!")
      } else {
        const errorData = await response.json()
        message.error(errorData.message || `Failed to ${editMode ? 'update' : 'submit'} the plan`)
      }
    } catch (e) {
      message.error("A network error occurred")
    } finally {
      setLoading(false)
    }
  }

  // --- Step Content Renderers ---
  const renderStep0 = () => (
    <Card style={cardStyle} title={<Title level={4} style={sectionTitleStyle}><UserOutlined /> Basic Information</Title>}>
      <Form layout="vertical">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Form.Item label="Campus" required tooltip="Select the campus location">
              <Select
                placeholder="Select Campus"
                value={basicInfo.campus || undefined}
                onChange={v => {
                  setBasicInfo({ ...basicInfo, campus: v, faculty: '', department: '' })
                  setFacultyData({})
                  fetchFacultiesForCampus(v)
                }}
                size="large"
              >
                {campusData.map(campus => <Option key={campus.id} value={campus.name}>{campus.name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Faculty" required>
              <Select
                placeholder="Select Faculty"
                value={basicInfo.faculty || undefined}
                onChange={v => setBasicInfo({ ...basicInfo, faculty: v, department: '' })}
                size="large"
                showSearch
              >
                {Object.keys(facultyData).map(f => <Option key={f} value={f}>{f}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <Form.Item label="Department" required>
              <Select
                placeholder="Select Department"
                value={basicInfo.department || undefined}
                onChange={v => setBasicInfo({ ...basicInfo, department: v })}
                disabled={!basicInfo.faculty}
                size="large"
                showSearch
              >
                {basicInfo.faculty && facultyData[basicInfo.faculty]?.map(d => (
                  <Option key={d} value={d}>{d}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Dean / Head of Department" required>
              <Input
                prefix={<UserOutlined style={{ color: '#ccc' }} />}
                placeholder="Name of Dean or HOD"
                value={basicInfo.deanHead}
                onChange={e => setBasicInfo({ ...basicInfo, deanHead: e.target.value })}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Faculty Focal Person (FFP)" required>
              <Input
                prefix={<TeamOutlined style={{ color: '#ccc' }} />}
                placeholder="Name of Focal Person"
                value={basicInfo.focalPerson}
                onChange={e => setBasicInfo({ ...basicInfo, focalPerson: e.target.value })}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Contact Email" required>
              <Input
                prefix={<MailOutlined style={{ color: '#ccc' }} />}
                placeholder="email@example.com"
                value={basicInfo.email}
                onChange={e => setBasicInfo({ ...basicInfo, email: e.target.value })}
                size="large"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Contact Phone" required>
              <Input
                prefix={<PhoneOutlined style={{ color: '#ccc' }} />}
                placeholder="03XX-XXXXXXX"
                value={basicInfo.phone}
                onChange={e => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  )

  const renderStep1 = () => (
    <Card style={cardStyle} title={<Title level={4} style={sectionTitleStyle}><RocketOutlined /> Linkage Goals & Activities</Title>}>
      <Divider orientation="left"><Text strong>Linkage Goals for the Semester</Text></Divider>
      <Table
        dataSource={goals}
        pagination={false}
        rowKey={(_, i) => i}
        columns={[
          {
            title: 'Strategic Domain',
            dataIndex: 'type',
            width: '40%',
            render: (v, _, i) => (
              <Select placeholder="Select Domain" value={v || undefined} onChange={val => {
                const newGoals = [...goals]; newGoals[i].type = val; setGoals(newGoals);
              }} style={{ width: '100%' }}>
                {activityTypes.map(t => <Option key={t.code} value={t.code}>{t.label}</Option>)}
              </Select>
            )
          },
          {
            title: 'Deliverable (Narrative)',
            dataIndex: 'deliverable',
            render: (v, _, i) => <Input placeholder="Brief deliverable description" value={v} onChange={e => {
              const newGoals = [...goals]; newGoals[i].deliverable = e.target.value; setGoals(newGoals);
            }} />
          },
          {
            title: '',
            width: 50,
            render: (_, __, i) => <Button danger icon={<DeleteOutlined />} onClick={() => setGoals(goals.filter((_, idx) => idx !== i))} disabled={goals.length === 1} />
          }
        ]}
      />
      <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setGoals([...goals, { type: '', deliverable: '' }])} style={{ marginTop: 16 }}>
        Add Goal
      </Button>

      <Divider orientation="left" style={{ marginTop: 48 }}><Text strong>Planned Activities</Text></Divider>
      <Table
        dataSource={activities}
        pagination={false}
        scroll={{ x: 800 }}
        rowKey={(_, i) => i}
        columns={[
          {
            title: 'Type',
            dataIndex: 'type',
            width: 150,
            render: (v, _, i) => (
              <Select placeholder="Type" value={v || undefined} onChange={val => {
                const newAct = [...activities]; newAct[i].type = val; setActivities(newAct);
              }} style={{ width: '100%' }}>
                {activityTypes.map(t => <Option key={t.code} value={t.code}>{t.label}</Option>)}
              </Select>
            )
          },
          {
            title: 'Description',
            dataIndex: 'description',
            render: (v, _, i) => <Input placeholder="Activity description" value={v} onChange={e => {
              const newAct = [...activities]; newAct[i].description = e.target.value; setActivities(newAct);
            }} />
          },
          {
            title: 'Partner',
            dataIndex: 'partner',
            render: (v, _, i) => <Input placeholder="Partner name" value={v} onChange={e => {
              const newAct = [...activities]; newAct[i].partner = e.target.value; setActivities(newAct);
            }} />
          },
          {
            title: 'Date',
            dataIndex: 'date',
            width: 150,
            render: (v, _, i) => <Input type="date" value={v} onChange={e => {
              const newAct = [...activities]; newAct[i].date = e.target.value; setActivities(newAct);
            }} />
          },
          {
            title: '',
            width: 50,
            render: (_, __, i) => <Button danger icon={<DeleteOutlined />} onClick={() => setActivities(activities.filter((_, idx) => idx !== i))} disabled={activities.length === 1} />
          }
        ]}
      />
      <Button type="dashed" block icon={<PlusOutlined />} onClick={() => setActivities([...activities, { type: '', description: '', partner: '', date: '', outcome: '' }])} style={{ marginTop: 16 }}>
        Add Activity
      </Button>
    </Card>
  )

  const renderStep2 = () => (
    <Card style={cardStyle} title={<Title level={4} style={sectionTitleStyle}><TeamOutlined /> Targets & Support</Title>}>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Divider orientation="left"><Text strong>Key Industry Sectors to Engage</Text></Divider>
          {industrySectors.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <Input placeholder="Industry sector name" value={s} onChange={e => {
                const updated = [...industrySectors]; updated[i] = e.target.value; setIndustrySectors(updated)
              }} />
              <Button danger icon={<DeleteOutlined />} onClick={() => setIndustrySectors(industrySectors.filter((_, idx) => idx !== i))} disabled={industrySectors.length === 1} />
            </div>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => setIndustrySectors([...industrySectors, ''])}>Add Sector</Button>
        </Col>

        <Col span={24}>
          <Divider orientation="left" style={{ marginTop: 24 }}><Text strong>Proposed Alumni Targets</Text></Divider>
          <Table
            dataSource={alumni}
            pagination={false}
            rowKey={(_, i) => i}
            columns={[
              {
                title: 'Name', dataIndex: 'name', render: (v, _, i) => <Input value={v} onChange={e => {
                  const updated = [...alumni]; updated[i].name = e.target.value; setAlumni(updated)
                }} />
              },
              {
                title: 'Email', dataIndex: 'email', render: (v, _, i) => <Input value={v} onChange={e => {
                  const updated = [...alumni]; updated[i].email = e.target.value; setAlumni(updated)
                }} />
              },
              { title: '', width: 50, render: (_, __, i) => <Button danger icon={<DeleteOutlined />} onClick={() => setAlumni(alumni.filter((_, idx) => idx !== i))} disabled={alumni.length === 1} /> }
            ]}
          />
          <Button type="dashed" icon={<PlusOutlined />} onClick={() => setAlumni([...alumni, { name: '', email: '', phone: '' }])} style={{ marginTop: 16 }}>Add Alumni</Button>
        </Col>

        <Col span={24}>
          <Divider orientation="left" style={{ marginTop: 24 }}><Text strong>Support Required from Directorate</Text></Divider>
          <TextArea
            rows={4}
            placeholder="Describe any assistance needed from the Directorate of External Linkages"
            value={supportRequired}
            onChange={e => setSupportRequired(e.target.value)}
          />
        </Col>
      </Row>
    </Card>
  )

  if (success) {
    return (
      <Card style={{ ...cardStyle, maxWidth: 600, margin: '100px auto', textAlign: 'center' }}>
        <Result
          status="success"
          title={editMode ? "Successfully Updated!" : "Successfully Submitted!"}
          subTitle={editMode
            ? "Your Departmental External Linkage Plan has been updated successfully."
            : "Your Departmental External Linkage Plan has been saved and is now visible in the activities calendar."}
          extra={[
            <Button
              type="primary"
              key="manage"
              size="large"
              onClick={() => navigate('/external-linkages/manage-forms')}
              style={{ borderRadius: '8px' }}
            >
              View All Forms
            </Button>,
            <Button
              key="calendar"
              size="large"
              onClick={() => navigate('/external-linkages/calendar')}
              style={{ borderRadius: '8px' }}
            >
              Go to Calendar
            </Button>,
            !editMode && <Button
              key="new"
              size="large"
              onClick={() => window.location.reload()}
              style={{ borderRadius: '8px' }}
            >
              Submit Another Plan
            </Button>,
          ].filter(Boolean)}
        />
      </Card>
    )
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', background: '#f9f9f9', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={2} style={{ color: primaryColor, fontWeight: 800 }}>External Linkage Management</Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>Formulate your departmental outreach strategy and track industry engagements</Text>
      </div>

      <Steps current={currentStep} style={{ marginBottom: '48px', padding: '0 20px' }}>
        <Step title="Identity" icon={<InfoCircleOutlined />} />
        <Step title="Strategy" icon={<CalendarOutlined />} />
        <Step title="Targets" icon={<SendOutlined />} />
      </Steps>

      <div className="step-content">
        {currentStep === 0 && renderStep0()}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '100px' }}>
        <Button size="large" onClick={handlePrev} disabled={currentStep === 0}>
          Back
        </Button>
        {currentStep < 2 ? (
          <Button type="primary" size="large" onClick={handleNext}>
            Next Step
          </Button>
        ) : (
          <Button
            type="primary"
            size="large"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={loading}
            style={{ background: secondaryColor, borderColor: secondaryColor }}
          >
            Submit Linkage Plan
          </Button>
        )}
      </div>
    </div >
  )
}

export default LinkagePlanForm