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
import { useNavigate, useLocation } from 'react-router-dom'
import moment from 'moment'

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
  const [hodData, setHodData] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [editPlanId, setEditPlanId] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const localUser = JSON.parse(localStorage.getItem('user-info'))
        const token = localUser?.token
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const [actResponse, userContextResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/getActivityTypes`, { headers }),
          fetch(`${BASE_URL}/api/user-context`, { headers }) // New endpoint
        ])

        const unwrap = (data, type) => {
          if (!data) return data
          if (type === 'list') {
            if (Array.isArray(data)) return data
            if (data.data && Array.isArray(data.data)) return data.data
            for (const key in data) {
              if (Array.isArray(data[key])) return data[key]
            }
          }
          return data
        }

        if (actResponse.ok) {
          const rawAct = await actResponse.json()
          setActivityTypes(unwrap(rawAct, 'list') || [])
        }

        if (userContextResponse.ok) {
          const context = await userContextResponse.json()
          console.log("Fetched User Context:", context)

          // Auto-fill Basic Info
          setBasicInfo(prev => ({
            ...prev,
            campus: context.campus?.name || '',
            faculty: context.faculty?.name || '',
            department: context.department?.name || '',
            dean_head: context.department?.hod_name || '',
            // Focal person can still be manual or auto-filled from user name. 
            // Request says "filled automatically". Let's assume focal person is the user themselves.
            focalPerson: context.user?.name || '',
            email: context.user?.email || '',
            // Phone might not be in user context yet, keep manual or empty
          }))
        }

      } catch (error) {
        console.error("Error fetching master data:", error)
        message.error("Failed to load form data")
      }
    }

    if (!editMode) {
      fetchMasterData()
    }
  }, [editMode])

  // Effect to handle Edit Mode
  useEffect(() => {
    if (location.state?.editMode && location.state?.planData) {
      const plan = location.state.planData
      console.log("Editing Plan:", plan)
      setEditMode(true)
      setEditPlanId(plan.id)

      // Populate Basic Info
      setBasicInfo({
        campus: plan.campus || '',
        faculty: (typeof plan.faculty === 'object' ? plan.faculty?.name : plan.faculty) || '',
        department: (typeof plan.department === 'object' ? plan.department?.department_name : plan.department) || '',
        focalPerson: plan.focal_person || '',
        dean_head: plan.dean_head || '',
        email: plan.email || '',
        phone: plan.phone || ''
      })

      // Populate Support Required
      if (plan.support_required) setSupportRequired(plan.support_required)

      // Populate Industry Sectors
      if (plan.industry_sectors && Array.isArray(plan.industry_sectors)) {
        // If only one empty item, keep default. If has data, overwrite.
        if (plan.industry_sectors.length > 0) setIndustrySectors(plan.industry_sectors)
      }

      // Populate Employers
      if (plan.employers && Array.isArray(plan.employers)) {
        if (plan.employers.length > 0) setEmployers(plan.employers)
      }

      // Populate Alumni
      if (plan.alumni && Array.isArray(plan.alumni)) {
        if (plan.alumni.length > 0) setAlumni(plan.alumni)
      }

      // Populate Activities
      if (plan.activities && Array.isArray(plan.activities)) {
        const mappedActivities = plan.activities.map(a => ({
          shortName: a.short_name || '',
          type: a.activity_type || '',
          description: a.description || '',
          partner: a.partner_organization || '',
          date: a.date ? moment(a.date) : '',
          outcome: a.expected_outcome || '',
          status: a.status || 'Planned'
        }))
        if (mappedActivities.length > 0) setActivities(mappedActivities)
      }
    }
  }, [location.state])

  // 1. Basic Info State
  const [basicInfo, setBasicInfo] = useState({
    campus: '',
    faculty: '',
    department: '',
    dean_head: '',
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



  // 3. Planned Activities State
  const [activities, setActivities] = useState([
    {
      shortName: 'MOU',
      type: 'MoU Signing/Proposal',
      description: '',
      partner: '',
      date: '',
      outcome: ''
    }
  ])
  const [activityErrors, setActivityErrors] = useState([{ description: '' }])

  // 4. Calendar State
  const [calendar, setCalendar] = useState([{ month: '', activity: '', partner: '', comments: '' }])

  // 5. Industry Targets State
  const [industrySectors, setIndustrySectors] = useState([''])
  const [employers, setEmployers] = useState([''])

  // 6. Alumni State
  const [alumni, setAlumni] = useState([
    { name: '', email: '', phone: '' },
    { name: '', email: '', phone: '' },
    { name: '', email: '', phone: '' },
    { name: '', email: '', phone: '' },
    { name: '', email: '', phone: '' }
  ])
  const [alumniErrors, setAlumniErrors] = useState([
    { email: '', phone: '' },
    { email: '', phone: '' },
    { email: '', phone: '' },
    { email: '', phone: '' },
    { email: '', phone: '' }
  ])

  // 7. Support Required State
  const [supportRequired, setSupportRequired] = useState('')

  // 8. Endorsement State
  const [endorsement, setEndorsement] = useState({
    preparedBy: '',
    reviewedBy: '',
    submittedTo: 'Office of External Linkages (OEL)',
    date: new Date().toISOString().split('T')[0]
  })

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
  // Handle basic info change with validation
  const handleBasicInfoChange = (field, value) => {
    // Cascading logic
    if (field === 'campus') {
      setBasicInfo(prev => ({
        ...prev,
        campus: value,
        faculty: '',
        department: '',
        dean_head: ''
      }))
    } else if (field === 'faculty') {
      setBasicInfo(prev => ({
        ...prev,
        faculty: value,
        department: '',
        dean_head: ''
      }))
    } else if (field === 'department') {
      // Find HOD based on Campus + Faculty (implicit) + Dept
      // Backend HOD data might need checking, but assuming names are unique enough or allow fuzzy match if needed.
      // Better: Filter hodData by campus_id (mapped from name) and dept name.
      // For now, simpler matching by Department Name is likely sufficient if names are unique per campus,
      // but since we have "Department of Law" etc, safer to match loosely or trust the user selection if auto-fetch fails.

      // We need to match precise department name
      const selectedHod = hodData.find(h =>
        h.department_name === value &&
        (h.campus_id === (basicInfo.campus === 'Lahore Campus' ? 1 : 2))
      )

      setBasicInfo(prev => ({
        ...prev,
        department: value,
        dean_head: selectedHod ? selectedHod.hod_name : ''
      }))
    } else {
      setBasicInfo(prev => ({ ...prev, [field]: value }))
    }

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

  useEffect(() => {
    if (location.state?.editMode && location.state?.planData) {
      const plan = location.state.planData
      console.log("Editing Plan:", plan)
      setEditMode(true)
      setEditPlanId(plan.id)

      // Populate Basic Info
      setBasicInfo({
        campus: plan.campus,
        faculty: (typeof plan.faculty === 'object' ? plan.faculty?.name : plan.faculty),
        department: (typeof plan.department === 'object' ? plan.department?.department_name : plan.department),
        dean_head: plan.dean_head || '',
        focalPerson: plan.focal_person,
        email: plan.email,
        phone: plan.phone
      })

      // Populate Support Required
      setSupportRequired(plan.support_required || '')

      // Populate Industry Sectors (Handling Checkbox Group Logic if needed, or simple array)
      // Assuming industrySectors is an array of strings
      if (plan.industry_sectors) {
        setIndustrySectors(plan.industry_sectors)
      }

      // Populate Employers
      if (plan.employers) {
        setEmployers(plan.employers)
      }

      // Populate Alumni
      if (plan.alumni) {
        setAlumni(plan.alumni)
      }

      // Populate Activities
      if (plan.activities) {
        const mappedActivities = plan.activities.map(a => ({
          shortName: a.short_name || '',
          type: a.activity_type,
          description: a.description,
          partner: a.partner_organization,
          date: a.date ? moment(a.date) : null,
          outcome: a.expected_outcome,
          status: a.status
        }))
        setActivities(mappedActivities)
      }
    }
  }, [location.state])


  const handleSubmit = async () => {
    setSubmitted(true)

    // Validate all sections
    const basicValid = validateBasicInfo()
    const activitiesValid = validateActivities()
    const alumniValid = validateAlumni()

    if (!basicValid || !activitiesValid || !alumniValid) {
      message.error('Please fix all errors before submitting')
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

      // If editing, force status back to Pending
      status: editMode ? 'Pending from HOD' : undefined,

      // Endorsement Info (Snapshot)
      endorsement_prepared_by: basicInfo.focalPerson,
      endorsement_reviewed_by: basicInfo.dean_head,
      endorsement_submitted_to: endorsement.submittedTo,
      endorsement_date: endorsement.date,

      activities: activities
        .filter(a => a.type && a.description)
        .map(a => ({
          short_name: a.shortName,
          activity_type: a.type,
          description: a.description,
          partner_organization: a.partner || null,
          date: a.date ? (moment.isMoment(a.date) ? a.date.format('YYYY-MM-DD') : a.date) : null,
          expected_outcome: a.outcome || null,
          status: 'Planned'
        })),

      calendar: calendar.filter(c => c.month && c.activity).map(c => ({
        month: c.month,
        activity: c.activity,
        partner: c.partner,
        comments: c.comments
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

    // Add ID if editing
    if (editMode) {
      payload.id = editPlanId
    }

    try {
      const token = localUser?.token
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      // Determine Endpoint and Method
      const url = editMode
        ? `${BASE_URL}/api/updateLinkagePlan/${editPlanId}`
        : `${BASE_URL}/api/addLinkagePlan`

      const method = editMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        message.success(editMode ? 'Linkage Plan updated and resubmitted successfully!' : 'Linkage Plan submitted successfully!')
        // Navigate back to manage forms
        navigate('/external-linkages-manage-forms')
      } else {
        const errorData = await response.json()
        message.error(`Failed to ${editMode ? 'update' : 'submit'} plan: ` + (errorData.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error submitting plan:', error)
      message.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Columns for Tables
  // Calendar Columns
  const calendarColumns = [
    {
      title: 'Month',
      dataIndex: 'month',
      width: '15%',
      render: (text, record, index) => (
        <Select
          style={{ width: '100%' }}
          value={text || undefined}
          onChange={(value) => handleInputChange(index, 'month', value, calendar, setCalendar)}
        >
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
            <Option key={m} value={m}>{m}</Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Planned Activity / Initiative',
      dataIndex: 'activity',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(index, 'activity', e.target.value, calendar, setCalendar)}
        />
      )
    },
    {
      title: 'Target Partner / Institution',
      dataIndex: 'partner',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(index, 'partner', e.target.value, calendar, setCalendar)}
        />
      )
    },
    {
      title: 'Comments (if any)',
      dataIndex: 'comments',
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) => handleInputChange(index, 'comments', e.target.value, calendar, setCalendar)}
        />
      )
    },
    {
      title: 'Action',
      width: '80px',
      render: (_, record, index) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveRow(index, calendar, setCalendar)}
          disabled={calendar.length === 1}
        />
      )
    }
  ]



  const activityColumns = [
    {
      title: 'Short Name',
      dataIndex: 'shortName',
      width: '100px',
      render: (text) => <span>{text}</span>
    },
    {
      title: <span>Type <span style={{ color: 'red' }}>*</span></span>,
      dataIndex: 'type',
      width: '25%',
      render: (text, record, index) => (
        <div>
          <Select
            style={{ width: '100%' }}
            status={submitted && activityErrors[index]?.type ? 'error' : ''}
            value={text || undefined}
            placeholder="Select"
            onChange={(value) => {
              // Auto-set Short Name
              const selected = activityTypes.find(t => t.code === value)
              const updatedActs = [...activities]
              updatedActs[index].type = value
              updatedActs[index].shortName = selected ? selected.code : ''
              setActivities(updatedActs)

              if (submitted) {
                const newErrs = [...activityErrors]
                newErrs[index].type = ''
                setActivityErrors(newErrs)
              }
            }}
          >
            {Array.isArray(activityTypes) && activityTypes.map(type => (
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
        <TextArea
          placeholder="Expected outcome"
          value={text}
          autoSize={{ minRows: 2, maxRows: 6 }}
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
        index >= 5 && (
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveRow(index, alumni, setAlumni, alumniErrors, setAlumniErrors)}
          />
        )
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
                <Input
                  value={basicInfo.campus}
                  readOnly
                  placeholder="Auto-fetched"
                  style={{ backgroundColor: '#f5f5f5', color: '#595959' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Faculty Name <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.faculty ? 'error' : ''}
                help={submitted && errors.faculty}
              >
                <Input
                  value={basicInfo.faculty}
                  readOnly
                  placeholder="Auto-fetched"
                  style={{ backgroundColor: '#f5f5f5', color: '#595959' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Department Name <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.department ? 'error' : ''}
                help={submitted && errors.department}
              >
                <Input
                  value={basicInfo.department}
                  readOnly
                  placeholder="Auto-fetched"
                  style={{ backgroundColor: '#f5f5f5', color: '#595959' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Dean/Head of Department <span style={{ color: 'red' }}>*</span></span>}
                validateStatus={submitted && errors.dean_head ? 'error' : ''}
                help={submitted && errors.dean_head}
              >
                <Input
                  value={basicInfo.dean_head}
                  readOnly
                  placeholder="Auto-fetched"
                  style={{ backgroundColor: '#f5f5f5', color: '#595959' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label={<span>Faculty Focal Person (FFP) for External Linkages <span style={{ color: 'red' }}>*</span></span>}
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

      {/* Section 2: Planned Activities */}
      <Card style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={sectionHeaderStyle}>Section 2: Planned Activities for the Semester</div>
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



      {/* Section 3: Proposed Activities Calendar
      <Card style={cardStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div style={sectionHeaderStyle}>Section 3: Proposed Activities Calendar (Semester)</div>
          <Button
            type="primary"
            ghost
            icon={<PlusOutlined />}
            onClick={() => handleAddRow(calendar, setCalendar, { month: '', activity: '', partner: '', comments: '' })}
          >
            Add Item
          </Button>
        </div>
        <Table
          dataSource={calendar}
          columns={calendarColumns}
          pagination={false}
          rowKey={(record, index) => index}
          bordered
        />
      </Card> */}

      {/* Section 4: Industry and Alumni Linkage Targets */}
      <Card style={cardStyle}>
        <div style={sectionHeaderStyle}>Section 3: Industry and Alumni Linkage Targets</div>

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

      {/* Section 5: Support Required */}
      <Card style={cardStyle}>
        <div style={sectionHeaderStyle}>Section 4: Support Required from OEL</div>
        <TextArea
          rows={4}
          placeholder="Please list specific facilitation, coordination, documentation, or outreach support expected from OEL..."
          value={supportRequired}
          onChange={(e) => setSupportRequired(e.target.value)}
        />
      </Card>



      {/* Section 6: Endorsement & Submission */}
      <Card style={cardStyle}>
        <div style={sectionHeaderStyle}>Section 5: Endorsement & Submission</div>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item label="Prepared by (Focal Person)">
              <Input
                value={basicInfo.focalPerson}
                disabled
                placeholder="Auto-filled from Section 1"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Reviewed by (HOD)">
              <Input
                value={basicInfo.dean_head}
                disabled
                placeholder="Auto-filled from Section 1"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Submitted to">
              <Input value={endorsement.submittedTo} disabled />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Date">
              <Input type="date" value={endorsement.date} disabled />
            </Form.Item>
          </Col>
        </Row>
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