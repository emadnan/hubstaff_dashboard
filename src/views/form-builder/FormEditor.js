import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
    Button,
    Form,
    Input,
    Card,
    Space,
    message,
    Typography,
    Layout,
    Tooltip,
    Affix,
    Divider,
    Select as AntSelect,
    Checkbox,
    Radio,
    DatePicker,
    TimePicker,
    InputNumber,
    Rate,
    Upload
} from 'antd'
import {
    PlusOutlined,
    SaveOutlined,
    ArrowLeftOutlined,
    FontSizeOutlined,
    NumberOutlined,
    CalendarOutlined,
    DownSquareOutlined,
    AlignLeftOutlined,
    CheckSquareOutlined,
    CheckCircleOutlined,
    EyeOutlined,
    EditOutlined,
    LockOutlined,
    MailOutlined,
    LinkOutlined,
    ClockCircleOutlined,
    AppstoreAddOutlined,
    UserOutlined,
    PhoneOutlined,
    FileOutlined,
    StarOutlined
} from '@ant-design/icons'
import { MDBCard, MDBCardBody, MDBRow, MDBCol } from 'mdb-react-ui-kit'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
    DraggableFieldTemplate,
    SortableFieldItem,
    SortableSection
} from './DndComponents'

const { Title, Text } = Typography
const { Content } = Layout
const { Option } = AntSelect

const BASE_URL = process.env.REACT_APP_BASE_URL

const FIELD_TYPES = [
    { type: 'text', label: 'Text Input', icon: <FontSizeOutlined /> },
    { type: 'textarea', label: 'Long Text', icon: <AlignLeftOutlined /> },
    { type: 'name', label: 'Name (First/Last)', icon: <UserOutlined /> },
    { type: 'email', label: 'Email', icon: <MailOutlined /> },
    { type: 'phone', label: 'Phone Number', icon: <PhoneOutlined /> },
    { type: 'password', label: 'Password', icon: <LockOutlined /> },
    { type: 'url', label: 'URL/Website', icon: <LinkOutlined /> },
    { type: 'number', label: 'Number', icon: <NumberOutlined /> },
    { type: 'date', label: 'Date', icon: <CalendarOutlined /> },
    { type: 'time', label: 'Time', icon: <ClockCircleOutlined /> },
    { type: 'radio', label: 'Multiple Choice', icon: <CheckCircleOutlined /> },
    { type: 'checkbox', label: 'Checkboxes', icon: <CheckSquareOutlined /> },
    { type: 'select', label: 'Dropdown', icon: <DownSquareOutlined /> },
    { type: 'file', label: 'File Upload', icon: <FileOutlined /> },
    { type: 'rating', label: 'Rating/Stars', icon: <StarOutlined /> },
    { type: 'button', label: 'Button', icon: <PlusOutlined /> },
]

const getColumnClass = (width) => {
    switch (width) {
        case 'half': return 6
        case 'third': return 4
        case 'quarter': return 3
        default: return 12
    }
}

const FormEditor = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [formInstance] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [sections, setSections] = useState([])
    const [activeId, setActiveId] = useState(null)
    const [focusedFieldId, setFocusedFieldId] = useState(null)
    const [previewMode, setPreviewMode] = useState(false)
    const [dynamicData, setDynamicData] = useState({}) // Store fetched dynamic data
    const local = JSON.parse(localStorage.getItem('user-info'))
    const token = local?.token

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(() => {
        if (id) {
            fetchForm()
        }
    }, [id])

    // Fetch dynamic data sources when sections change
    useEffect(() => {
        if (sections && sections.length > 0) {
            fetchDynamicDataSources()
        }
    }, [sections])

    const fetchDynamicDataSources = async () => {
        const dataSourcesToFetch = new Set()

        // Find all fields that use dynamic data sources
        sections.forEach(section => {
            section.fields.forEach(field => {
                if (field.data_source) {
                    dataSourcesToFetch.add(field.data_source)
                }
            })
        })

        if (dataSourcesToFetch.size === 0) return;

        // Fetch each unique data source
        const dataPromises = Array.from(dataSourcesToFetch).map(async (source) => {
            try {
                let endpoint = ''
                switch (source) {
                    case 'campuses':
                        endpoint = `${BASE_URL}/api/getCampuses`
                        break
                    case 'faculties':
                        endpoint = `${BASE_URL}/api/getFaculties`
                        break
                    case 'departments':
                        endpoint = `${BASE_URL}/api/getDepartments`
                        break
                    case 'activity_types':
                        endpoint = `${BASE_URL}/api/getActivityTypes`
                        break
                    case 'users':
                        endpoint = `${BASE_URL}/api/get_users`
                        break
                    case 'industry_sectors':
                        endpoint = `${BASE_URL}/api/getIndustrySectors`
                        break
                    case 'employers':
                        endpoint = `${BASE_URL}/api/getProposedEmployers`
                        break
                    case 'department_hods':
                        endpoint = `${BASE_URL}/api/getHODs`
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
                } else {
                    const errorText = `Failed to fetch ${source}: ${response.status} ${response.statusText}`;
                    console.error(errorText);
                }
            } catch (error) {
                const errorMsg = `Error fetching ${source}: ${error.message}`;
                console.error(errorMsg);
            }
            return null
        })

        const results = await Promise.all(dataPromises)
        const newDynamicData = { ...dynamicData }

        results.forEach(result => {
            if (result) {
                newDynamicData[result.source] = result.data;
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

                case 'users':
                    return Array.isArray(data) ? data.map(user => ({
                        label: user.name || user.email,
                        value: user.id
                    })) : []

                case 'industry_sectors':
                case 'employers':
                    return Array.isArray(data) ? data.map(item => ({
                        label: item.name,
                        value: item.name
                    })) : []

                case 'department_hods':
                    return Array.isArray(data) ? data.map(item => ({
                        label: item.hod_name,
                        value: item.hod_name
                    })) : []

                default:
                    return []
            }
        }

        // Return manual options if no data source
        return field.options || []
    }

    const fetchForm = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            const data = await response.json()
            formInstance.setFieldsValue({
                name: data.name,
                description: data.description,
                status: data.status,
            })
            const sectionsWithIds = (data.sections || []).map(s => ({
                ...s,
                id: s.id || `section-${Math.random().toString(36).substr(2, 9)}`,
                fields: (s.fields || []).map(f => ({
                    ...f,
                    id: f.id || `field-${Math.random().toString(36).substr(2, 9)}`
                }))
            }))
            setSections(sectionsWithIds)
            if (sectionsWithIds.length > 0) {
                setFocusedFieldId(sectionsWithIds[0].id)
            }
        } catch (error) {
            console.error('Error fetching form:', error)
            message.error('Failed to fetch form details')
        } finally {
            setLoading(false)
        }
    }

    const handleSaveForm = async (values) => {
        setSaving(true)
        try {
            let formId = id
            const method = id ? 'PUT' : 'POST'
            const url = id ? `${BASE_URL}/api/forms/${id}` : `${BASE_URL}/api/forms`

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            })

            const data = await response.json()
            if (!id) formId = data.id

            const structureResponse = await fetch(`${BASE_URL}/api/forms/${formId}/structure`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ sections }),
            })

            if (structureResponse.ok) {
                message.success('Form saved successfully')
                navigate('/form-builder')
            } else {
                message.error('Failed to save form structure')
            }
        } catch (error) {
            console.error('Error saving form:', error)
            message.error('Error saving form')
        } finally {
            setSaving(false)
        }
    }

    const addSection = () => {
        const newId = `section-${Date.now()}`
        const newSection = {
            id: newId,
            name: `Section ${sections.length + 1}`,
            order: sections.length,
            columns_per_row: 1,
            fields: [],
        }
        setSections([...sections, newSection])
        setFocusedFieldId(newId)
    }

    const removeSection = (index) => {
        const newSections = [...sections]
        newSections.splice(index, 1)
        setSections(newSections)
    }

    const updateSectionName = (index, name) => {
        const newSections = [...sections]
        newSections[index].name = name
        setSections(newSections)
    }

    const addField = (fieldType = 'text') => {
        // Auto-create first section if none exist
        if (sections.length === 0) {
            const newSectionId = `section-${Date.now()}`
            const newSection = {
                id: newSectionId,
                name: 'Section 1',
                order: 0,
                columns_per_row: 1,
                fields: [],
            }
            setSections([newSection])
            setFocusedFieldId(newSectionId)

            // Add field to the new section after a brief delay
            setTimeout(() => {
                const fieldId = `field-${Date.now()}`
                const typeLabel = FIELD_TYPES.find(t => t.type === fieldType)?.label || 'Question'
                const updatedSection = {
                    ...newSection,
                    fields: [{
                        id: fieldId,
                        label: typeLabel,
                        field_type: fieldType,
                        name: `field_${Date.now()}`,
                        order: 0,
                        is_required: false,
                        column_width: 'full',
                        options: ['radio', 'checkbox', 'select'].includes(fieldType) ? [{ label: 'Option 1', value: 'option_1' }] : []
                    }]
                }
                setSections([updatedSection])
                setFocusedFieldId(fieldId)
            }, 100)
            return
        }

        let targetSectionIdx = sections.findIndex(s => s.id === focusedFieldId)
        if (targetSectionIdx === -1) {
            sections.forEach((s, idx) => {
                if (s.fields.some(f => f.id === focusedFieldId)) {
                    targetSectionIdx = idx
                }
            })
        }
        if (targetSectionIdx === -1) targetSectionIdx = sections.length - 1

        const newSections = [...sections]
        const typeLabel = FIELD_TYPES.find(t => t.type === fieldType)?.label || 'Question'
        const fieldId = `field-${Date.now()}`
        newSections[targetSectionIdx].fields.push({
            id: fieldId,
            label: typeLabel,
            field_type: fieldType,
            name: `field_${Date.now()}`,
            order: newSections[targetSectionIdx].fields.length,
            is_required: false,
            column_width: 'full',
            options: ['radio', 'checkbox', 'select'].includes(fieldType) ? [{ label: 'Option 1', value: 'option_1' }] : []
        })
        setSections(newSections)
        setFocusedFieldId(fieldId)
    }

    const duplicateField = (sectionIndex, fieldIndex) => {
        const newSections = [...sections]
        const original = newSections[sectionIndex].fields[fieldIndex]
        const fieldId = `field-copy-${Date.now()}`
        const copy = {
            ...original,
            id: fieldId,
            name: `${original.name}_copy`,
            order: original.order + 1
        }
        newSections[sectionIndex].fields.splice(fieldIndex + 1, 0, copy)
        setSections(newSections)
        setFocusedFieldId(fieldId)
    }

    const removeField = (sectionIndex, fieldIndex) => {
        const newSections = [...sections]
        newSections[sectionIndex].fields.splice(fieldIndex, 1)
        setSections(newSections)
    }

    const updateField = (sectionIndex, fieldIndex, fieldData) => {
        const newSections = [...sections]
        const updatedField = {
            ...newSections[sectionIndex].fields[fieldIndex],
            ...fieldData,
        };
        newSections[sectionIndex].fields[fieldIndex] = updatedField;
        setSections(newSections)
    }

    const handleDragStart = (event) => {
        setActiveId(event.active.id)
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        setActiveId(null)

        if (!over) return

        if (active.id !== over.id) {
            if (active.data.current.type === 'section') {
                const oldIndex = sections.findIndex(s => s.id === active.id)
                const newIndex = sections.findIndex(s => s.id === over.id)
                setSections(arrayMove(sections, oldIndex, newIndex))
            } else if (active.data.current.type === 'field') {
                const activeSectionIdx = active.data.current.sectionIndex
                const overSectionIdx = over.data.current?.sectionIndex

                if (activeSectionIdx === overSectionIdx) {
                    const newSections = [...sections]
                    const fields = newSections[activeSectionIdx].fields
                    const oldIndex = active.data.current.fieldIndex
                    const newIndex = over.data.current.fieldIndex
                    newSections[activeSectionIdx].fields = arrayMove(fields, oldIndex, newIndex)
                    setSections(newSections)
                }
            }
        }
    }

    const renderPreviewField = (field) => {
        const commonStyle = { width: '100%', borderRadius: '6px' }

        switch (field.field_type) {
            case 'text':
                return <Input placeholder={`Enter ${field.label}`} style={commonStyle} />
            case 'name':
                return (
                    <Space.Compact style={{ width: '100%' }}>
                        <Input placeholder="First Name" style={{ ...commonStyle, borderRadius: '6px 0 0 6px' }} />
                        <Input placeholder="Last Name" style={{ ...commonStyle, borderRadius: '0 6px 6px 0' }} />
                    </Space.Compact>
                )
            case 'email':
                return <Input type="email" placeholder={`Enter ${field.label}`} style={commonStyle} />
            case 'phone':
                return <Input placeholder="+1 (555) 000-0000" style={commonStyle} />
            case 'url':
                return <Input placeholder="https://example.com" style={commonStyle} />
            case 'password':
                return (
                    <Input.Password
                        placeholder={`Enter ${field.label}`}
                        style={commonStyle}
                        visibilityToggle={field.validation?.allow_show_password !== false}
                    />
                )
            case 'number':
                return <InputNumber placeholder={`Enter ${field.label}`} style={commonStyle} />
            case 'textarea':
                return <Input.TextArea rows={4} placeholder={`Enter ${field.label}`} style={commonStyle} />
            case 'date':
                return <DatePicker style={commonStyle} />
            case 'time':
                return <TimePicker style={commonStyle} />
            case 'file':
                return (
                    <Upload.Dragger style={{ ...commonStyle, padding: '20px' }}>
                        <p className="ant-upload-drag-icon">
                            <FileOutlined style={{ fontSize: '32px', color: '#0070FF' }} />
                        </p>
                        <p className="ant-upload-text">Click or drag file to upload</p>
                        <p className="ant-upload-hint">Support for single or bulk upload</p>
                    </Upload.Dragger>
                )
            case 'rating':
                return (
                    <div>
                        <Rate defaultValue={0} style={{ fontSize: '28px', color: '#0070FF' }} />
                    </div>
                )
            case 'button':
                const buttonStyle = field.validation?.button_style || 'primary';
                const buttonText = field.validation?.button_text || field.label || 'Button';
                return (
                    <Button
                        type={buttonStyle}
                        size="large"
                        style={{
                            borderRadius: '6px',
                            ...(buttonStyle === 'primary' && { background: '#0070FF', border: 'none' })
                        }}
                        onClick={() => {
                            if (field.validation?.action_url) {
                                window.open(field.validation.action_url, '_blank');
                            }
                        }}
                    >
                        {buttonText}
                    </Button>
                )
            case 'select':
                const selectOptions = getOptionsForField(field)
                return (
                    <AntSelect
                        placeholder={`Select ${field.label}`}
                        style={commonStyle}
                        loading={field.data_source && !dynamicData[field.data_source]}
                    >
                        {selectOptions.map((opt, idx) => (
                            <Option key={idx} value={opt.value}>{opt.label}</Option>
                        ))}
                    </AntSelect>
                )
            case 'radio':
                const radioOptions = getOptionsForField(field)
                return (
                    <Radio.Group style={{ width: '100%' }}>
                        <Space direction="vertical">
                            {radioOptions.map((opt, idx) => (
                                <Radio key={idx} value={opt.value}>{opt.label}</Radio>
                            ))}
                        </Space>
                    </Radio.Group>
                )
            case 'checkbox':
                const checkboxOptions = getOptionsForField(field)
                return (
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Space direction="vertical">
                            {checkboxOptions.map((opt, idx) => (
                                <Checkbox key={idx} value={opt.value}>{opt.label}</Checkbox>
                            ))}
                        </Space>
                    </Checkbox.Group>
                )
            default:
                return <Input placeholder={`Enter ${field.label}`} style={commonStyle} />
        }
    }

    return (
        <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
            <Affix offsetTop={0}>
                <div style={{
                    background: '#ffffff',
                    borderBottom: '1px solid #f0f0f0',
                    padding: '16px 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Space size="large">
                            <Button
                                type="text"
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate('/form-builder')}
                            />
                            <Title level={4} style={{ margin: 0, color: '#262626', fontWeight: '600' }}>
                                {previewMode ? 'Form Preview' : 'Form Builder'}
                            </Title>
                        </Space>
                        <Space>
                            <Button
                                icon={previewMode ? <EditOutlined /> : <EyeOutlined />}
                                onClick={() => setPreviewMode(!previewMode)}
                                style={{ borderRadius: '6px' }}
                            >
                                {previewMode ? 'Edit' : 'Preview'}
                            </Button>
                            <Button
                                type="primary"
                                icon={<SaveOutlined />}
                                loading={saving}
                                onClick={() => formInstance.submit()}
                                style={{
                                    borderRadius: '6px',
                                    background: '#0070FF',
                                    border: 'none'
                                }}
                            >
                                Save Form
                            </Button>
                        </Space>
                    </div>
                </div>
            </Affix>

            <Content style={{ padding: '32px 24px 100px 24px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '100%', maxWidth: '900px', position: 'relative' }}>
                    {!previewMode ? (
                        <>
                            <MDBCard style={{ border: 'none', boxShadow: 'none', borderRadius: '12px', background: 'transparent' }}>
                                <MDBCardBody style={{ padding: 0 }}>
                                    <Form
                                        form={formInstance}
                                        layout="vertical"
                                        onFinish={handleSaveForm}
                                        initialValues={{ status: 'active' }}
                                    >
                                        <div style={{
                                            background: '#ffffff',
                                            borderRadius: '12px',
                                            border: focusedFieldId === 'header' ? '2px solid #0070FF' : '1px solid #f0f0f0',
                                            padding: '32px',
                                            marginBottom: '20px',
                                            transition: 'all 0.2s',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
                                        }} onClick={() => setFocusedFieldId('header')}>
                                            <Form.Item name="name" rules={[{ required: true }]} style={{ marginBottom: '16px' }}>
                                                <Input
                                                    placeholder="Form Title"
                                                    variant="borderless"
                                                    style={{
                                                        fontSize: '24px',
                                                        fontWeight: '600',
                                                        padding: '0',
                                                        color: '#262626',
                                                        borderBottom: focusedFieldId === 'header' ? '2px solid #f0f0f0' : 'none'
                                                    }}
                                                />
                                            </Form.Item>
                                            <Form.Item name="description" style={{ marginBottom: 0 }}>
                                                <Input.TextArea
                                                    placeholder="Form description (optional)"
                                                    variant="borderless"
                                                    autoSize
                                                    style={{ fontSize: '14px', padding: '0', color: '#8c8c8c' }}
                                                />
                                            </Form.Item>
                                        </div>
                                    </Form>

                                    <DndContext
                                        sensors={sensors}
                                        collisionDetection={closestCenter}
                                        onDragStart={handleDragStart}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <SortableContext
                                            items={sections.map(s => s.id)}
                                            strategy={verticalListSortingStrategy}
                                        >
                                            {sections.map((section, sIdx) => (
                                                <SortableSection
                                                    key={section.id}
                                                    id={section.id}
                                                    section={section}
                                                    index={sIdx}
                                                    updateSectionName={updateSectionName}
                                                    removeSection={removeSection}
                                                    onFocus={setFocusedFieldId}
                                                    isActive={focusedFieldId === section.id}
                                                    sections={sections}
                                                    setSections={setSections}
                                                >
                                                    <SortableContext
                                                        items={section.fields.map(f => f.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {section.fields.map((field, fIdx) => (
                                                            <SortableFieldItem
                                                                key={field.id}
                                                                id={field.id}
                                                                field={field}
                                                                sectionIndex={sIdx}
                                                                fieldIndex={fIdx}
                                                                updateField={updateField}
                                                                removeField={removeField}
                                                                isActive={focusedFieldId === field.id}
                                                                onFocus={setFocusedFieldId}
                                                                duplicateField={duplicateField}
                                                                dynamicData={dynamicData}
                                                                getOptionsForField={getOptionsForField}
                                                            />
                                                        ))}
                                                    </SortableContext>
                                                </SortableSection>
                                            ))}
                                        </SortableContext>

                                        <DragOverlay>
                                            {activeId ? (
                                                <div style={{
                                                    width: '900px',
                                                    height: '80px',
                                                    backgroundColor: '#fff',
                                                    border: '2px solid #0070FF',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 8px 24px rgba(0,112,255,0.2)'
                                                }} />
                                            ) : null}
                                        </DragOverlay>
                                    </DndContext>
                                </MDBCardBody>
                            </MDBCard>

                            {/* Floating Toolbar */}
                            <div style={{ position: 'fixed', right: '40px', top: '50%', transform: 'translateY(-50%)' }}>
                                <Card
                                    size="small"
                                    bodyStyle={{ padding: '12px 8px' }}
                                    style={{
                                        width: '56px',
                                        borderRadius: '12px',
                                        background: '#ffffff',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                                        border: '1px solid #f0f0f0',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Tooltip title="Add Field" placement="left">
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={() => addField('text')}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                marginBottom: '8px',
                                                background: '#0070FF',
                                                border: 'none'
                                            }}
                                        />
                                    </Tooltip>
                                    <Tooltip title="Add Section" placement="left">
                                        <Button
                                            type="text"
                                            icon={<AppstoreAddOutlined style={{ fontSize: '18px', color: '#0070FF' }} />}
                                            onClick={addSection}
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '8px',
                                                marginBottom: '8px'
                                            }}
                                        />
                                    </Tooltip>
                                    <Divider style={{ margin: '8px 0', width: '32px' }} />
                                    {FIELD_TYPES.map(f => (
                                        <DraggableFieldTemplate
                                            key={f.type}
                                            {...f}
                                            onClick={() => addField(f.type)}
                                        />
                                    ))}
                                </Card>
                            </div>
                        </>
                    ) : (
                        /* Preview Mode */
                        <Card style={{
                            borderRadius: '12px',
                            border: '1px solid #f0f0f0',
                            background: '#fff',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.05)'
                        }}>
                            <div style={{ padding: '32px' }}>
                                <div style={{ marginBottom: '32px', borderBottom: '2px solid #0070FF', paddingBottom: '16px' }}>
                                    <Title level={2} style={{ margin: 0, color: '#262626' }}>
                                        {formInstance.getFieldValue('name') || 'Untitled Form'}
                                    </Title>
                                    {formInstance.getFieldValue('description') && (
                                        <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
                                            {formInstance.getFieldValue('description')}
                                        </Text>
                                    )}
                                </div>

                                {sections.map((section, sIdx) => {
                                    const columnsPerRow = section.columns_per_row || 1;
                                    const colSize = 12 / columnsPerRow; // Bootstrap grid: 12 columns total

                                    return (
                                        <div key={section.id} style={{ marginBottom: '40px' }}>
                                            <Title level={4} style={{
                                                color: '#0070FF',
                                                marginBottom: '20px',
                                                paddingBottom: '8px',
                                                borderBottom: '1px solid #f0f0f0'
                                            }}>
                                                {section.name}
                                            </Title>
                                            <MDBRow>
                                                {section.fields.map((field, fIdx) => (
                                                    <MDBCol
                                                        key={field.id}
                                                        md={colSize}
                                                        style={{ marginBottom: '24px' }}
                                                    >
                                                        <div>
                                                            <Text strong style={{ fontSize: '14px', color: '#374151', display: 'block', marginBottom: '8px' }}>
                                                                {field.label}
                                                                {field.is_required && <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>}
                                                            </Text>
                                                            {renderPreviewField(field)}
                                                        </div>
                                                    </MDBCol>
                                                ))}
                                            </MDBRow>
                                        </div>
                                    );
                                })}

                                <Divider />
                                <div style={{ textAlign: 'center' }}>
                                    <Button
                                        type="primary"
                                        size="large"
                                        style={{
                                            background: '#0070FF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '0 48px',
                                            height: '44px'
                                        }}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </Content>

            <style>{`
                .form-field-card:hover .drag-handle {
                    opacity: 0.8 !important;
                }
                .toolbar-btn:hover {
                    background: rgba(0, 112, 255, 0.1) !important;
                    transform: scale(1.05);
                }
            `}</style>
        </Layout>
    )
}

export default FormEditor
