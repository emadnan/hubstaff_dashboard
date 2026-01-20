import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Button,
    Select,
    Checkbox,
    Radio,
    DatePicker,
    TimePicker,
    InputNumber,
    Upload,
    Rate,
    Space,
    message,
    Spin,
    Card,
    Typography,
    Row,
    Col,
    Divider
} from 'antd'
import {
    UploadOutlined,
    LoadingOutlined,
    CheckCircleOutlined,
    PlusOutlined,
    MinusCircleOutlined
} from '@ant-design/icons'
import moment from 'moment'

const { TextArea } = Input
const { Option } = Select
const { Title, Text } = Typography

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

/**
 * FormRenderer - Dynamically renders forms based on database structure
 * 
 * @param {number} formId - ID of the form to render
 * @param {function} onSubmit - Callback when form is submitted (receives form data)
 * @param {object} initialValues - Initial form values for edit mode
 * @param {string} mode - 'create' or 'edit'
 * @param {boolean} showTitle - Whether to show form title and description
 */
const FormRenderer = ({
    formId,
    onSubmit,
    initialValues = {},
    mode = 'create',
    showTitle = true
}) => {
    const [form] = Form.useForm()
    const [formStructure, setFormStructure] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [fileList, setFileList] = useState({})
    const [dynamicData, setDynamicData] = useState({}) // Store fetched dynamic data

    const local = JSON.parse(localStorage.getItem('user-info'))
    const token = local?.token

    const sectionCardStyle = {
        marginBottom: '24px',
        borderRadius: '12px',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        background: '#ffffff'
    }

    const repeaterCardStyle = {
        marginBottom: '16px',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '10px'
    }

    useEffect(() => {
        if (formId) {
            fetchFormStructure()
        }
    }, [formId])

    // Build default values from structure when in create mode
    useEffect(() => {
        if (mode === 'create' && formStructure && formStructure.sections) {
            const defaults = {}
            formStructure.sections.forEach(section => {
                section.fields.forEach(field => {
                    const defaultValue = field.options?.default_value || field.default_value
                    if (defaultValue !== undefined && defaultValue !== null) {
                        defaults[field.name] = defaultValue
                    }
                })
            })
            if (Object.keys(defaults).length > 0) {
                form.setFieldsValue({ ...defaults, ...initialValues })
            }
        }
    }, [formStructure, mode, initialValues, form])

    // Fetch dynamic data sources when form structure loads
    useEffect(() => {
        if (formStructure && formStructure.sections) {
            fetchDynamicDataSources()
        }
    }, [formStructure])

    const fetchFormStructure = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${formId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (response.ok) {
                const data = await response.json()
                setFormStructure(data)
            } else {
                message.error('Failed to load form')
            }
        } catch (error) {
            console.error('Error fetching form:', error)
            message.error('Error loading form')
        } finally {
            setLoading(false)
        }
    }

    const fetchDynamicDataSources = async () => {
        const dataSourcesToFetch = new Set()

        // Find all fields that use dynamic data sources
        formStructure.sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.data_source) {
                    dataSourcesToFetch.add(field.data_source)
                }

                // Check sub-fields for repeaters
                if (field.field_type === 'repeater' && field.options?.sub_fields) {
                    field.options.sub_fields.forEach(subField => {
                        if (subField.data_source) {
                            dataSourcesToFetch.add(subField.data_source)
                        }
                    })
                }
            })
        })

        // Fetch each unique data source
        const dataPromises = Array.from(dataSourcesToFetch).map(async (source) => {
            try {
                let endpoint = ''
                switch (source) {
                    case 'campuses':
                        endpoint = `${BASE_URL}/api/getCampuses`
                        break
                    case 'activity_types':
                        endpoint = `${BASE_URL}/api/getActivityTypes`
                        break
                    case 'industry_sectors':
                        endpoint = `${BASE_URL}/api/getIndustrySectors`
                        break
                    case 'employers':
                        endpoint = `${BASE_URL}/api/getProposedEmployers`
                        break
                    case 'users':
                        endpoint = `${BASE_URL}/api/get_users`
                        break
                    case 'department_hods':
                        const currentDept = form.getFieldValue('department')
                        const currentCampus = form.getFieldValue('campus')
                        if (currentDept) {
                            endpoint = `${BASE_URL}/api/getHODs?department=${encodeURIComponent(currentDept)}${currentCampus ? `&campus=${encodeURIComponent(currentCampus)}` : ''}`
                        } else {
                            return null
                        }
                        break
                    case 'faculties':
                        const campusVal = form.getFieldValue('campus')
                        endpoint = campusVal
                            ? `${BASE_URL}/api/getFaculties?campus=${encodeURIComponent(campusVal)}`
                            : `${BASE_URL}/api/getFaculties`
                        break
                    case 'departments':
                        const facultyVal = form.getFieldValue('faculty')
                        const campusVal2 = form.getFieldValue('campus')
                        if (facultyVal) {
                            endpoint = `${BASE_URL}/api/getDepartments?faculty=${encodeURIComponent(facultyVal)}${campusVal2 ? `&campus=${encodeURIComponent(campusVal2)}` : ''}`
                        } else {
                            // Fallback for initial load if no faculty selected
                            endpoint = `${BASE_URL}/api/getDepartments`
                        }
                        break
                    default:
                        return null
                }

                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    return { source, data }
                }
            } catch (error) {
                console.error(`Error fetching ${source}:`, error)
            }
            return null
        })

        const results = await Promise.all(dataPromises)
        const newDynamicData = {}

        results.forEach(result => {
            if (result) {
                newDynamicData[result.source] = result.data
            }
        })

        setDynamicData(newDynamicData)
    }

    const getOptionsForField = (field) => {
        if (field.data_source && dynamicData[field.data_source]) {
            const data = dynamicData[field.data_source]

            // Transform data based on source type
            switch (field.data_source) {
                case 'campuses':
                    return Array.isArray(data) ? data.map(item => ({
                        label: item.name,
                        value: item.name
                    })) : []

                case 'departments':
                    return Array.isArray(data) ? data.map(item => ({
                        label: item.department_name,
                        value: item.department_name
                    })) : []

                case 'faculties':
                    // Faculties returns an object with faculty names as keys
                    return Object.keys(data).map(name => ({
                        label: name,
                        value: name
                    }))

                case 'activity_types':
                    return Array.isArray(data) ? data.map(item => ({
                        label: item.label,
                        value: item.code
                    })) : []

                case 'industry_sectors':
                case 'employers':
                    return Array.isArray(data) ? data.map(item => ({
                        label: item.name,
                        value: item.name
                    })) : []

                case 'users':
                    return Array.isArray(data) ? data.map(user => ({
                        label: user.name || user.email,
                        value: user.id
                    })) : []

                case 'department_hods':
                    return Array.isArray(data) ? data.map(item => ({
                        label: item.hod_name,
                        value: item.hod_name,
                        email: item.hod_email
                    })) : []

                default:
                    return []
            }
        }

        // Return manual options if no data source
        return field.options || []
    }

    const handleSubmit = async (values) => {
        setSubmitting(true)
        try {
            // Helper to recursively format values (especially dates from repeaters)
            const processValues = (obj) => {
                if (!obj || typeof obj !== 'object') return obj

                if (moment.isMoment(obj)) {
                    return obj.format('YYYY-MM-DD')
                }

                if (Array.isArray(obj)) {
                    return obj.map(item => processValues(item))
                }

                const processed = {}
                Object.keys(obj).forEach(key => {
                    processed[key] = processValues(obj[key])
                })
                return processed
            }

            const processedValues = processValues(values)
            Object.keys(fileList).forEach(fieldName => {
                if (fileList[fieldName] && fileList[fieldName].length > 0) {
                    processedValues[fieldName] = fileList[fieldName].map(file => file.response?.url || file.url)
                }
            })

            // Call parent onSubmit callback
            if (onSubmit) {
                await onSubmit(processedValues)
            }

            message.success('Form submitted successfully!')
            if (mode === 'create') {
                form.resetFields()
                setFileList({})
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            message.error('Failed to submit form')
        } finally {
            setSubmitting(false)
        }
    }

    const handleFileChange = (fieldName, info) => {
        setFileList(prev => ({
            ...prev,
            [fieldName]: info.fileList
        }))
    }

    const handleValuesChange = async (changedValues, allValues) => {
        // Handle department -> HOD dependency
        if (changedValues.department) {
            // Reset HOD fields
            form.setFieldsValue({ dean_head: undefined, hod_email: undefined })

            // Re-fetch HODs for the new department, including campus context
            const campus = allValues.campus
            try {
                const response = await fetch(`${BASE_URL}/api/getHODs?department=${encodeURIComponent(changedValues.department)}${campus ? `&campus=${encodeURIComponent(campus)}` : ''}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setDynamicData(prev => ({ ...prev, department_hods: data }))

                    // If only one HOD, auto-select it
                    if (data.length === 1) {
                        form.setFieldsValue({
                            dean_head: data[0].hod_name,
                            hod_email: data[0].hod_email
                        })
                    }
                }
            } catch (error) {
                console.error('Error fetching HODs:', error)
            }
        }

        // Handle HOD -> Email auto-fill
        if (changedValues.dean_head) {
            const hods = dynamicData['department_hods']
            if (hods) {
                const selectedHod = hods.find(h => h.hod_name === changedValues.dean_head)
                if (selectedHod) {
                    form.setFieldsValue({ hod_email: selectedHod.hod_email })
                } else {
                    // Check fallback in departments if hod list is empty or name is pre-loaded
                    const departments = dynamicData['departments']
                    const selectedDept = allValues.department
                    if (departments && selectedDept) {
                        const dept = departments.find(d => d.department_name === selectedDept)
                        if (dept && dept.hod_name === changedValues.dean_head) {
                            form.setFieldsValue({ hod_email: dept.hod_email })
                        }
                    }
                }
            }
        }

        // Handle Campus -> Faculty dependency (if needed in generic renderer)
        if (changedValues.campus) {
            // Reset dependent fields
            form.setFieldsValue({ faculty: undefined, department: undefined, dean_head: undefined, hod_email: undefined })

            // Fetch faculties for campus
            try {
                const response = await fetch(`${BASE_URL}/api/getFaculties?campus=${encodeURIComponent(changedValues.campus)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setDynamicData(prev => ({ ...prev, faculties: data }))
                }
            } catch (error) {
                console.error('Error fetching faculties:', error)
            }
        }

        // Handle Faculty -> Department dependency
        if (changedValues.faculty) {
            form.setFieldsValue({ department: undefined, dean_head: undefined, hod_email: undefined })
            setDynamicData(prev => ({ ...prev, departments: [], department_hods: [] }))

            // Re-fetch departments for faculty and campus
            const campus = allValues.campus
            try {
                const response = await fetch(`${BASE_URL}/api/getDepartments?faculty=${encodeURIComponent(changedValues.faculty)}${campus ? `&campus=${encodeURIComponent(campus)}` : ''}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                if (response.ok) {
                    const data = await response.json()
                    setDynamicData(prev => ({ ...prev, departments: data }))
                }
            } catch (error) {
                console.error('Error fetching departments:', error)
            }
        }
    }

    const getValidationRules = (field) => {
        const rules = []

        if (field.is_required) {
            rules.push({
                required: true,
                message: `${field.label} is required`
            })
        }

        const validation = field.validation || {}

        // Text validations
        if (validation.min_length) {
            rules.push({
                min: parseInt(validation.min_length),
                message: `Minimum ${validation.min_length} characters required`
            })
        }

        if (validation.max_length) {
            rules.push({
                max: parseInt(validation.max_length),
                message: `Maximum ${validation.max_length} characters allowed`
            })
        }

        // Email validation
        if (field.field_type === 'email') {
            rules.push({
                type: 'email',
                message: 'Please enter a valid email address'
            })
        }

        // URL validation
        if (field.field_type === 'url') {
            rules.push({
                type: 'url',
                message: 'Please enter a valid URL'
            })
        }

        // Number validations
        if (field.field_type === 'number') {
            if (validation.min_value !== undefined) {
                rules.push({
                    type: 'number',
                    min: parseFloat(validation.min_value),
                    message: `Minimum value is ${validation.min_value}`
                })
            }
            if (validation.max_value !== undefined) {
                rules.push({
                    type: 'number',
                    max: parseFloat(validation.max_value),
                    message: `Maximum value is ${validation.max_value}`
                })
            }
        }

        // Dropdown/Select and Checkbox min/max selections validation
        if ((field.field_type === 'select' && validation.allow_multiple) || field.field_type === 'checkbox') {
            if (validation.min_selections && validation.min_selections > 0) {
                rules.push({
                    validator: (_, value) => {
                        if (!value || value.length < validation.min_selections) {
                            return Promise.reject(new Error(`Please select at least ${validation.min_selections} option(s)`))
                        }
                        return Promise.resolve()
                    }
                })
            }
            if (validation.max_selections) {
                rules.push({
                    validator: (_, value) => {
                        if (value && value.length > validation.max_selections) {
                            return Promise.reject(new Error(`Please select at most ${validation.max_selections} option(s)`))
                        }
                        return Promise.resolve()
                    }
                })
            }
        }

        // Pattern validation
        if (validation.pattern) {
            rules.push({
                pattern: new RegExp(validation.pattern),
                message: validation.pattern_message || 'Invalid format'
            })
        }

        return rules
    }

    const renderField = (field) => {
        const validation = field.validation || {}
        const commonProps = {
            placeholder: field.placeholder || `Enter ${field.label}`,
            disabled: field.is_readonly
        }

        // Get options (either from data source or manual)
        const fieldOptions = getOptionsForField(field)

        switch (field.field_type) {
            case 'text':
                return <Input {...commonProps} />

            case 'textarea':
                return (
                    <TextArea
                        {...commonProps}
                        rows={validation.rows || 4}
                        maxLength={validation.max_length}
                        showCount={!!validation.max_length}
                    />
                )

            case 'name':
                return (
                    <Space.Compact style={{ width: '100%' }}>
                        <Input placeholder="First Name" style={{ width: '50%' }} />
                        <Input placeholder="Last Name" style={{ width: '50%' }} />
                    </Space.Compact>
                )

            case 'email':
                return <Input {...commonProps} type="email" />

            case 'phone':
                return <Input {...commonProps} />

            case 'password':
                return (
                    <Input.Password
                        {...commonProps}
                        visibilityToggle={validation.allow_show_password !== false}
                    />
                )

            case 'url':
                return <Input {...commonProps} />

            case 'number':
                return (
                    <InputNumber
                        {...commonProps}
                        style={{ width: '100%' }}
                        min={validation.min_value}
                        max={validation.max_value}
                        step={validation.step || 1}
                    />
                )

            case 'date':
                return (
                    <DatePicker
                        {...commonProps}
                        style={{ width: '100%' }}
                        format={validation.date_format || 'YYYY-MM-DD'}
                    />
                )

            case 'time':
                return (
                    <TimePicker
                        {...commonProps}
                        style={{ width: '100%' }}
                        format={validation.time_format || 'HH:mm'}
                    />
                )

            case 'select':
                return (
                    <Select
                        {...commonProps}
                        mode={validation.allow_multiple ? 'multiple' : undefined}
                        showSearch={validation.searchable}
                        loading={field.data_source && !dynamicData[field.data_source]}
                    >
                        {fieldOptions.map((opt, idx) => (
                            <Option key={idx} value={opt.value}>
                                {opt.label}
                            </Option>
                        ))}
                    </Select>
                )

            case 'radio':
                return (
                    <Radio.Group>
                        <Space direction={validation.layout === 'horizontal' ? 'horizontal' : 'vertical'}>
                            {fieldOptions.map((opt, idx) => (
                                <Radio key={idx} value={opt.value}>
                                    {opt.label}
                                </Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                )

            case 'checkbox':
                return (
                    <Checkbox.Group>
                        <Space direction={validation.layout === 'horizontal' ? 'horizontal' : 'vertical'}>
                            {fieldOptions.map((opt, idx) => (
                                <Checkbox key={idx} value={opt.value}>
                                    {opt.label}
                                </Checkbox>
                            ))}
                        </Space>
                    </Checkbox.Group>
                )

            case 'file':
                return (
                    <Upload
                        fileList={fileList[field.name] || []}
                        onChange={(info) => handleFileChange(field.name, info)}
                        multiple={validation.allow_multiple}
                        maxCount={validation.max_files || 1}
                        accept={validation.allowed_types}
                    >
                        <Button icon={<UploadOutlined />}>
                            {validation.button_text || 'Upload File'}
                        </Button>
                    </Upload>
                )

            case 'rating':
                return (
                    <Rate
                        count={validation.max_rating || 5}
                        allowHalf={validation.allow_half}
                    />
                )

            case 'button':
                return (
                    <Button
                        type={validation.button_style || 'primary'}
                        size="large"
                        onClick={() => {
                            if (validation.action_url) {
                                window.open(validation.action_url, '_blank')
                            }
                        }}
                    >
                        {validation.button_text || field.label}
                    </Button>
                )

            case 'repeater':
                return renderRepeater(field)

            default:
                return <Input {...commonProps} />
        }
    }

    const renderRepeater = (field) => {
        const subFields = field.options?.sub_fields || []

        return (
            <Form.List name={field.name}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, ...restField }) => (
                            <Card
                                key={key}
                                size="small"
                                style={repeaterCardStyle}
                                extra={<MinusCircleOutlined onClick={() => remove(name)} style={{ color: '#ef4444', fontSize: '18px' }} />}
                            >
                                <Row gutter={[16, 8]}>
                                    {subFields.map((subField, idx) => (
                                        <Col key={idx} span={getColumnSpan(subField.column_width)}>
                                            <Form.Item
                                                {...restField}
                                                name={[name, subField.name]}
                                                label={subField.label}
                                                rules={getValidationRules(subField)}
                                            >
                                                {renderField({ ...subField, name: [field.name, name, subField.name] })}
                                            </Form.Item>
                                        </Col>
                                    ))}
                                </Row>
                            </Card>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Add {field.label}
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
        )
    }

    const getColumnSpan = (width, columnsPerRow = 1) => {
        // If specific width is set, use it (Ant Design 24-column grid)
        if (width === 'full') return 24
        if (width === 'half') return 12
        if (width === 'third') return 8
        if (width === 'quarter') return 6

        // If no specific width, use the section's columnsPerRow setting
        // If columnsPerRow is 2, span is 12. If 3, span is 8. If 1, span is 24.
        const cols = parseInt(columnsPerRow) || 1
        return Math.floor(24 / cols)
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" indicator={<LoadingOutlined style={{ fontSize: 48 }} />} />
                <div style={{ marginTop: '16px' }}>
                    <Text>Loading form...</Text>
                </div>
            </div>
        )
    }

    if (!formStructure) {
        return (
            <Card>
                <Text type="danger">Form not found</Text>
            </Card>
        )
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {showTitle && (
                <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
                    <Title level={2} style={{ margin: 0, color: '#0070FF' }}>
                        {formStructure.name}
                    </Title>
                    {formStructure.description && (
                        <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
                            {formStructure.description}
                        </Text>
                    )}
                </Card>
            )}

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                onValuesChange={handleValuesChange}
                initialValues={initialValues}
            >
                {(formStructure.sections || []).map((section, sIdx) => (
                    <Card
                        key={section.id}
                        title={section.name && <Title level={4} style={{ margin: 0, color: '#0070FF' }}>{section.name}</Title>}
                        style={sectionCardStyle}
                    >
                        <Row gutter={[24, 12]}>
                            {(section.fields || []).map((field, fIdx) => (
                                <Col
                                    key={field.id}
                                    span={getColumnSpan(field.column_width, section.columns_per_row)}
                                >
                                    <Form.Item
                                        name={field.name}
                                        label={field.label}
                                        rules={getValidationRules(field)}
                                        help={field.help_text}
                                        extra={field.description}
                                    >
                                        {renderField(field)}
                                    </Form.Item>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                ))}

                <div style={{ textAlign: 'center', marginTop: '32px' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        loading={submitting}
                        icon={submitting ? <LoadingOutlined /> : <CheckCircleOutlined />}
                        style={{
                            background: '#0070FF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0 48px',
                            height: '48px',
                            fontSize: '16px'
                        }}
                    >
                        {mode === 'edit' ? 'Update' : 'Submit'}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

FormRenderer.propTypes = {
    formId: PropTypes.number.isRequired,
    onSubmit: PropTypes.func.isRequired,
    initialValues: PropTypes.object,
    mode: PropTypes.oneOf(['create', 'edit']),
    showTitle: PropTypes.bool
}

export default FormRenderer
