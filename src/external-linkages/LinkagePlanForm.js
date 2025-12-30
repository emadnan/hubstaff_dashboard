import React, { useState, useEffect } from 'react'
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
  message
} from 'antd'
import { DeleteOutlined, PlusOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons'

const { Option } = Select
const { TextArea } = Input

// Master Data from Template
// Master Data will be fetched from API


const LinkagePlanForm = () => {
  // Styles reused/adapted from Dashboard.js
  const titleStyle = {
    fontFamily: 'Arial',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0070FF',
    marginBottom: '20px'
  }

  const sectionHeaderStyle = {
    fontFamily: 'Arial',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6E6E6E',
    marginBottom: '15px',
    borderBottom: '2px solid #28B463',
    paddingBottom: '5px',
    display: 'inline-block'
  }

  const cardStyle = {
    width: '100%',
    backgroundColor: '#FFFFFF',
    marginBottom: '20px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  }

  // Master Data State
  const [facultyData, setFacultyData] = useState({})
  const [activityTypes, setActivityTypes] = useState([])
  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [facResponse, actResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/getFaculties`),
          fetch(`${BASE_URL}/api/getActivityTypes`)
        ])

        if (facResponse.ok) {
          const facData = await facResponse.json()
          setFacultyData(facData)
        }

        if (actResponse.ok) {
          const actData = await actResponse.json()
          setActivityTypes(actData)
        }
      } catch (error) {
        console.error("Error fetching master data:", error)
        message.error("Failed to load form data")
      }
    }

    fetchMasterData()
  }, [])

  // 1. Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    campus: '',
    faculty: '',
    department: '',
    focalPerson: '',
    email: '',
    phone: ''
  })

  // Validation errors state
  const [errors, setErrors] = useState({
    campus: '',
    faculty: '',
    department: '',
    focalPerson: '',
    email: '',
    phone: ''
  })

  // 2. Goals State
  const [goals, setGoals] = useState([{ type: '', deliverable: '' }])
  const [goalErrors, setGoalErrors] = useState([{ type: '', deliverable: '' }])

  // 3. Planned Activities State
  const [activities, setActivities] = useState([
    {
      type: '',
      description: '',
      partner: '',
      date: '',
      outcome: ''
    }
  ])
  const [activityErrors, setActivityErrors] = useState([{ type: '', description: '' }])

  // 4. Industry Targets State
  const [industrySectors, setIndustrySectors] = useState([''])
  const [employers, setEmployers] = useState([''])

  // 5. Alumni State
  const [alumni, setAlumni] = useState([{ name: '', email: '', phone: '' }])
  const [alumniErrors, setAlumniErrors] = useState([{ email: '', phone: '' }])

  // 6. Support Required State
  const [supportRequired, setSupportRequired] = useState('')

  // Loading state
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // --- Validation Functions ---

  const validateEmail = (email) => {
    if (!email) return ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) ? '' : 'Invalid email format'
  }

  const validatePakistaniPhone = (phone) => {
    if (!phone) return ''
    let cleaned = phone.replace(/[\s\-]/g, '')
    cleaned = cleaned.replace(/^\+92/, '0')
    const phoneRegex = /^03[0-9]{9}$/
    return phoneRegex.test(cleaned) ? '' : 'Invalid phone number (use 03XX-XXXXXXX)'
  }

  const formatPhoneNumber = (phone) => {
    let cleaned = phone.replace(/[\s\-]/g, '')
    cleaned = cleaned.replace(/^\+92/, '0')
    if (cleaned.length === 11 && cleaned.startsWith('0')) {
      return `${cleaned.substring(0, 4)}-${cleaned.substring(4)}`
    }
    return cleaned
  }

  // Handle basic info change with validation
  const handleBasicInfoChange = (field, value) => {
    setBasicInfo({ ...basicInfo, [field]: value })

    // Clear error when user starts typing
    if (submitted) {
      let error = ''
      if (field === 'email') {
        error = validateEmail(value)
      } else if (field === 'phone') {
        error = validatePakistaniPhone(value)
      } else if (!value) {
        error = 'This field is required'
      }
      setErrors({ ...errors, [field]: error })
    }
  }

  // Validate all basic info
  const validateBasicInfo = () => {
    const newErrors = {
      campus: !basicInfo.campus ? 'Campus is required' : '',
      faculty: !basicInfo.faculty ? 'Faculty is required' : '',
      department: !basicInfo.department ? 'Department is required' : '',
      focalPerson: !basicInfo.focalPerson ? 'Focal person name is required' : '',
      email: !basicInfo.email ? 'Email is required' : validateEmail(basicInfo.email),
      phone: !basicInfo.phone ? 'Phone is required' : validatePakistaniPhone(basicInfo.phone)
    }
    setErrors(newErrors)
    return Object.values(newErrors).every(error => !error)
  }

  // Validate goals
  const validateGoals = () => {
    const newErrors = goals.map((goal, idx) => {
      const hasType = !!goal.type
      const hasDeliverable = !!goal.deliverable

      if (!hasType && !hasDeliverable) return { type: '', deliverable: '' }

      return {
        type: hasDeliverable && !hasType ? 'Select activity type' : '',
        deliverable: hasType && !hasDeliverable ? 'Enter deliverable' : ''
      }
    })

    setGoalErrors(newErrors)

    const hasValidGoal = goals.some(g => g.type && g.deliverable)
    return hasValidGoal && newErrors.every(e => !e.type && !e.deliverable)
  }

  // Validate activities
  const validateActivities = () => {
    const newErrors = activities.map((activity, idx) => {
      const hasType = !!activity.type
      const hasDescription = !!activity.description

      if (!hasType && !hasDescription) return { type: '', description: '' }

      return {
        type: hasDescription && !hasType ? 'Select type' : '',
        description: hasType && !hasDescription ? 'Enter description' : ''
      }
    })

    setActivityErrors(newErrors)

    const hasValidActivity = activities.some(a => a.type && a.description)
    return hasValidActivity && newErrors.every(e => !e.type && !e.description)
  }

  // Validate alumni
  const validateAlumni = () => {
    const newErrors = alumni.map(alum => ({
      email: alum.email ? validateEmail(alum.email) : '',
      phone: alum.phone ? validatePakistaniPhone(alum.phone) : ''
    }))

    setAlumniErrors(newErrors)
    return newErrors.every(e => !e.email && !e.phone)
  }

  // --- Handlers for Dynamic Rows ---
  const handleAddRow = (state, setState, template, errorState, setErrorState, errorTemplate) => {
    setState([...state, template])
    if (setErrorState) {
      setErrorState([...errorState, errorTemplate])
    }
  }

  const handleRemoveRow = (index, state, setState, errorState, setErrorState) => {
    if (state.length > 1) {
      setState(state.filter((_, i) => i !== index))
      if (setErrorState) {
        setErrorState(errorState.filter((_, i) => i !== index))
      }
    }
  }

  const handleInputChange = (index, field, value, state, setState, errorState, setErrorState) => {
    const updated = [...state]
    updated[index][field] = value
    setState(updated)

    // Clear error when typing
    if (submitted && errorState && setErrorState) {
      const updatedErrors = [...errorState]
      updatedErrors[index] = { ...updatedErrors[index], [field]: '' }
      setErrorState(updatedErrors)
    }
  }

  const handleArrayInputChange = (index, value, state, setState) => {
    const updated = [...state]
    updated[index] = value
    setState(updated)
  }



  const handleSubmit = async () => {
    setSubmitted(true)

    // Validate all sections
    const basicValid = validateBasicInfo()
    const goalsValid = validateGoals()
    const activitiesValid = validateActivities()
    const alumniValid = validateAlumni()

    if (!basicValid || !goalsValid || !activitiesValid || !alumniValid) {
      message.error('Please fix all errors before submitting')
      // Scroll to first error
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)

    const localUser = JSON.parse(localStorage.getItem('user-info'))
    const userId = localUser?.Users?.user_id || localUser?.Users?.id || 1

    const payload = {
      campus: basicInfo.campus,
      faculty: basicInfo.faculty,
      department: basicInfo.department,
      focal_person: basicInfo.focalPerson,
      email: basicInfo.email,
      phone: formatPhoneNumber(basicInfo.phone),
      semester: "Spring 2025",
      academic_year: "2024-2025",
      support_required: supportRequired || null,
      submitted_by: userId,

      goals: goals.filter(g => g.type && g.deliverable),
      activities: activities
        .filter(a => a.type && a.description)
        .map(a => ({
          activity_type: a.type,
          description: a.description,
          partner_organization: a.partner || null,
          date: a.date || null,
          expected_outcome: a.outcome || null,
          status: 'Planned'
        })),
      industry_sectors: industrySectors.filter(s => s && s.trim()),
      employers: employers.filter(e => e && e.trim()),
      alumni: alumni
        .filter(a => a.name && (a.email || a.phone))
        .map(a => ({
          name: a.name,
          email: a.email || null,
          phone: a.phone ? formatPhoneNumber(a.phone) : null
        }))
    }

    try {
      const token = localUser?.token
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch(`${BASE_URL}/api/addLinkagePlan`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        message.success('Linkage Plan submitted successfully!')

        // Reset form
        setBasicInfo({ campus: '', faculty: '', department: '', focalPerson: '', email: '', phone: '' })
        setErrors({ campus: '', faculty: '', department: '', focalPerson: '', email: '', phone: '' })
        setGoals([{ type: '', deliverable: '' }])
        setGoalErrors([{ type: '', deliverable: '' }])
        setActivities([{ type: '', description: '', partner: '', date: '', outcome: '' }])
        setActivityErrors([{ type: '', description: '' }])
        setIndustrySectors([''])
        setEmployers([''])
        setAlumni([{ name: '', email: '', phone: '' }])
        setAlumniErrors([{ email: '', phone: '' }])
        setSupportRequired('')
        setSubmitted(false)

      } else {
        message.error(data.message || 'Failed to submit plan')
      }
    } catch (error) {
      message.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Columns for Tables
  const goalColumns = [
    {
      title: <span>Strategic Domain <span style={{ color: 'red' }}>*</span></span>,
      dataIndex: 'type',
      key: 'type',
      width: '35%',
      render: (text, record, index) => (
        <div>
          <Select
            style={{
              width: '100%',
              borderColor: submitted && goalErrors[index]?.type ? '#ff4d4f' : undefined
            }}
            status={submitted && goalErrors[index]?.type ? 'error' : ''}
            value={text || undefined}
            placeholder="Select Type"
            onChange={(value) => handleInputChange(index, 'type', value, goals, setGoals, goalErrors, setGoalErrors)}
          >
            {activityTypes.map(type => (
              <Option key={type.code} value={type.code}>{type.label}</Option>
            ))}
          </Select>
          {submitted && goalErrors[index]?.type && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              {goalErrors[index].type}
            </div>
          )}
        </div>
      )
    },
    {
      title: <span>Deliverable (Narrative) <span style={{ color: 'red' }}>*</span></span>,
      dataIndex: 'deliverable',
      key: 'deliverable',
      render: (text, record, index) => (
        <div>
          <Input
            status={submitted && goalErrors[index]?.deliverable ? 'error' : ''}
            placeholder="e.g., Sign 3 new MoUs with industry partners"
            value={text}
            onChange={(e) => handleInputChange(index, 'deliverable', e.target.value, goals, setGoals, goalErrors, setGoalErrors)}
          />
          {submitted && goalErrors[index]?.deliverable && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              {goalErrors[index].deliverable}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: '100px',
      render: (_, record, index) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(index, goals, setGoals, goalErrors, setGoalErrors)}
          disabled={goals.length === 1}
        />
      )
    }
  ]

  const activityColumns = [
    {
      title: <span>Type <span style={{ color: 'red' }}>*</span></span>,
      dataIndex: 'type',
      width: '15%',
      render: (text, record, index) => (
        <div>
          <Select
            style={{ width: '100%' }}
            status={submitted && activityErrors[index]?.type ? 'error' : ''}
            value={text || undefined}
            placeholder="Select"
            onChange={(value) => handleInputChange(index, 'type', value, activities, setActivities, activityErrors, setActivityErrors)}
          >
            {activityTypes.map(type => (
              <Option key={type.code} value={type.code}>{type.label}</Option>
            ))}
          </Select>
          {submitted && activityErrors[index]?.type && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              {activityErrors[index].type}
            </div>
          )}
        </div>
      )
    },
    {
      title: <span>Brief Description <span style={{ color: 'red' }}>*</span></span>,
      dataIndex: 'description',
      render: (text, record, index) => (
        <div>
          <Input
            status={submitted && activityErrors[index]?.description ? 'error' : ''}
            placeholder="Activity description"
            value={text}
            onChange={(e) => handleInputChange(index, 'description', e.target.value, activities, setActivities, activityErrors, setActivityErrors)}
          />
          {submitted && activityErrors[index]?.description && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              {activityErrors[index].description}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Target Partner/Institution',
      dataIndex: 'partner',
      render: (text, record, index) => (
        <Input
          placeholder="Institution name"
          value={text}
          onChange={(e) => handleInputChange(index, 'partner', e.target.value, activities, setActivities)}
        />
      )
    },
    {
      title: 'Tentative Date',
      dataIndex: 'date',
      width: '150px',
      render: (text, record, index) => (
        <Input
          type="date"
          value={text}
          onChange={(e) => handleInputChange(index, 'date', e.target.value, activities, setActivities)}
        />
      )
    },
    {
      title: 'Expected Outcome',
      dataIndex: 'outcome',
      render: (text, record, index) => (
        <Input
          placeholder="Expected outcome"
          value={text}
          onChange={(e) => handleInputChange(index, 'outcome', e.target.value, activities, setActivities)}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: '80px',
      render: (_, record, index) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(index, activities, setActivities, activityErrors, setActivityErrors)}
          disabled={activities.length === 1}
        />
      )
    }
  ]

  const alumniColumns = [
    {
      title: 'Name with Designation',
      dataIndex: 'name',
      render: (text, record, index) => (
        <Input
          placeholder="Name and designation"
          value={text}
          onChange={(e) => handleInputChange(index, 'name', e.target.value, alumni, setAlumni, alumniErrors, setAlumniErrors)}
        />
      )
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      render: (text, record, index) => (
        <div>
          <Input
            status={submitted && alumniErrors[index]?.email ? 'error' : ''}
            placeholder="email@example.com"
            value={text}
            onChange={(e) => handleInputChange(index, 'email', e.target.value, alumni, setAlumni, alumniErrors, setAlumniErrors)}
          />
          {submitted && alumniErrors[index]?.email && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              {alumniErrors[index].email}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Contact Number',
      dataIndex: 'phone',
      render: (text, record, index) => (
        <div>
          <Input
            status={submitted && alumniErrors[index]?.phone ? 'error' : ''}
            placeholder="03XX-XXXXXXX"
            value={text}
            onChange={(e) => handleInputChange(index, 'phone', e.target.value, alumni, setAlumni, alumniErrors, setAlumniErrors)}
          />
          {submitted && alumniErrors[index]?.phone && (
            <div style={{ color: '#ff4d4f', fontSize: '12px', marginTop: '4px' }}>
              {alumniErrors[index].phone}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Action',
      key: 'action',
      width: '80px',
      render: (_, record, index) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(index, alumni, setAlumni, alumniErrors, setAlumniErrors)}
          disabled={alumni.length === 1}
        />
      )
    }
  ]

  return (
    <div className="p-4">
      <h3 style={titleStyle}>Departmental External Linkage Plan</h3>

      {/* Section 1: Basic Information */}
      <Card style={cardStyle}>
        <div style={sectionHeaderStyle}>Section 1: Basic Information</div>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Campus <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.campus ? 'error' : ''}
                help={submitted && errors.campus}
              >
                <Select
                  value={basicInfo.campus || undefined}
                  placeholder="Select Campus"
                  onChange={(value) => handleBasicInfoChange('campus', value)}
                  status={submitted && errors.campus ? 'error' : ''}
                >
                  <Option value="Lahore Campus">Lahore Campus</Option>
                  <Option value="Sargodha Campus">Sargodha Campus</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Faculty Name <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.faculty ? 'error' : ''}
                help={submitted && errors.faculty}
              >
                <Select
                  value={basicInfo.faculty || undefined}
                  placeholder="Select Faculty"
                  onChange={(value) => handleBasicInfoChange('faculty', value)}
                  status={submitted && errors.faculty ? 'error' : ''}
                >
                  {Object.keys(facultyData).map(f => <Option key={f} value={f}>{f}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Department Name <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.department ? 'error' : ''}
                help={submitted && errors.department}
              >
                <Select
                  value={basicInfo.department || undefined}
                  placeholder="Select Department"
                  onChange={(value) => handleBasicInfoChange('department', value)}
                  disabled={!basicInfo.faculty}
                  status={submitted && errors.department ? 'error' : ''}
                >
                  {basicInfo.faculty && facultyData[basicInfo.faculty]?.map(d => (
                    <Option key={d} value={d}>{d}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Faculty Focal Person (FFP) <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.focalPerson ? 'error' : ''}
                help={submitted && errors.focalPerson}
              >
                <Input
                  placeholder="Enter name"
                  value={basicInfo.focalPerson}
                  onChange={(e) => handleBasicInfoChange('focalPerson', e.target.value)}
                  status={submitted && errors.focalPerson ? 'error' : ''}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Contact Email <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.email ? 'error' : ''}
                help={submitted && errors.email}
              >
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={basicInfo.email}
                  onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                  status={submitted && errors.email ? 'error' : ''}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Contact Phone <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.phone ? 'error' : ''}
                help={submitted && errors.phone ? errors.phone : 'Format: 03XX-XXXXXXX'}
              >
                <Input
                  placeholder="03XX-XXXXXXX"
                  value={basicInfo.phone}
                  onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                  status={submitted && errors.phone ? 'error' : ''}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Section 2: Linkage Goals */}
      <Card style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={sectionHeaderStyle}>Section 2: Linkage Goals for the Semester</div>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => handleAddRow(goals, setGoals, { type: '', deliverable: '' }, goalErrors, setGoalErrors, { type: '', deliverable: '' })}
          >
            Add Goal
          </Button>
        </div>
        <Table
          dataSource={goals}
          columns={goalColumns}
          pagination={false}
          rowKey={(record, index) => index}
          bordered
        />
      </Card>

      {/* Section 3: Planned Activities */}
      <Card style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={sectionHeaderStyle}>Section 3: Planned Activities for the Semester</div>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => handleAddRow(
              activities,
              setActivities,
              { type: '', description: '', partner: '', date: '', outcome: '' },
              activityErrors,
              setActivityErrors,
              { type: '', description: '' }
            )}
          >
            Add Activity
          </Button>
        </div>
        <Table
          dataSource={activities}
          columns={activityColumns}
          pagination={false}
          rowKey={(record, index) => index}
          bordered
        />
      </Card>

      {/* Section 5: Industry and Alumni Linkage Targets */}
      <Card style={cardStyle}>
        <div style={sectionHeaderStyle}>Section 5: Industry and Alumni Linkage Targets</div>

        <h5 style={{ ...sectionHeaderStyle, fontSize: 14, borderBottom: 'none', color: '#0070FF' }}>
          Key Industry Sectors to Engage
        </h5>
        <div className="mb-4">
          {industrySectors.map((sector, idx) => (
            <Row key={idx} gutter={8} className="mb-2">
              <Col flex="auto">
                <Input
                  placeholder={`Industry sector ${idx + 1}`}
                  value={sector}
                  onChange={(e) => handleArrayInputChange(idx, e.target.value, industrySectors, setIndustrySectors)}
                />
              </Col>
              {industrySectors.length > 1 && (
                <Col flex="none">
                  <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveRow(idx, industrySectors, setIndustrySectors)} />
                </Col>
              )}
            </Row>
          ))}
          <Button type="dashed" block onClick={() => handleAddRow(industrySectors, setIndustrySectors, '')}>
            + Add Sector
          </Button>
        </div>

        <h5 style={{ ...sectionHeaderStyle, fontSize: 14, borderBottom: 'none', color: '#0070FF' }}>
          Proposed Employers for Internship/Recruitment
        </h5>
        <div className="mb-4">
          {employers.map((employer, idx) => (
            <Row key={idx} gutter={8} className="mb-2">
              <Col flex="auto">
                <Input
                  placeholder={`Employer ${idx + 1}`}
                  value={employer}
                  onChange={(e) => handleArrayInputChange(idx, e.target.value, employers, setEmployers)}
                />
              </Col>
              {employers.length > 1 && (
                <Col flex="none">
                  <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveRow(idx, employers, setEmployers)} />
                </Col>
              )}
            </Row>
          ))}
          <Button type="dashed" block onClick={() => handleAddRow(employers, setEmployers, '')}>
            + Add Employer
          </Button>
        </div>

        <h5 style={{ ...sectionHeaderStyle, fontSize: 14, borderBottom: 'none', color: '#0070FF' }}>
          Alumni to be Engaged
        </h5>
        <div className="mb-3 d-flex justify-content-end">
          <Button
            type="primary"
            ghost
            size="small"
            icon={<PlusOutlined />}
            onClick={() => handleAddRow(alumni, setAlumni, { name: '', email: '', phone: '' }, alumniErrors, setAlumniErrors, { email: '', phone: '' })}
          >
            Add Alumni
          </Button>
        </div>
        <Table
          dataSource={alumni}
          columns={alumniColumns}
          pagination={false}
          rowKey={(record, index) => index}
          bordered
        />
      </Card>

      {/* Section 6: Support Required */}
      <Card style={cardStyle}>
        <div style={sectionHeaderStyle}>Section 6: Support Required from OEL</div>
        <TextArea
          rows={4}
          placeholder="Please list specific facilitation, coordination, documentation, or outreach support expected from OEL..."
          value={supportRequired}
          onChange={(e) => setSupportRequired(e.target.value)}
        />
      </Card>

      {/* Submit Buttons */}
      <div className="d-flex justify-content-end gap-2 mb-5">
        <Button size="large" icon={<SaveOutlined />}>Save Draft</Button>
        <Button
          type="primary"
          size="large"
          icon={<SendOutlined />}
          onClick={handleSubmit}
          loading={loading}
        >
          Submit Plan to OEL
        </Button>
      </div>
    </div>
  )
}

export default LinkagePlanForm