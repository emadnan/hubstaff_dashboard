import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Button, Input, Affix, Space, message, Spin, Switch, Typography, List, Card, Modal, Form as AntForm } from 'antd'
import { ArrowLeftOutlined, SaveOutlined, EyeOutlined, EditOutlined, PlusOutlined, DeleteOutlined, MenuOutlined } from '@ant-design/icons'
import { FormEditor, Form } from '@bpmn-io/form-js'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// Import form-js styles
import '@bpmn-io/form-js/dist/assets/form-js.css'
import '@bpmn-io/form-js/dist/assets/form-js-editor.css'
import './FormEditor.css'

const { Text, Title } = Typography
const BASE_URL = process.env.REACT_APP_BASE_URL

// --- Sortable Item Component for Section List ---

const SortableSectionItem = ({ section, isActive, onClick, onDelete, onNameChange }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: section.id })
    const style = { transform: CSS.Transform.toString(transform), transition }

    return (
        <div ref={setNodeRef} style={{ ...style, marginBottom: 8 }} {...attributes}>
            <Card
                size="small"
                hoverable
                onClick={onClick}
                style={{
                    cursor: 'pointer',
                    borderColor: isActive ? '#1890ff' : '#f0f0f0',
                    backgroundColor: isActive ? '#e6f7ff' : '#fff'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <MenuOutlined
                            style={{ marginRight: 8, cursor: 'grab', color: '#999' }}
                            {...listeners}
                            onPointerDown={(e) => {
                                e.stopPropagation()
                                if (listeners && listeners.onPointerDown) {
                                    listeners.onPointerDown(e)
                                }
                            }}
                        />
                        <Input
                            value={section.name}
                            onChange={(e) => onNameChange(section.id, e.target.value)}
                            bordered={false}
                            style={{
                                padding: 0,
                                fontWeight: isActive ? 600 : 400,
                                background: 'transparent'
                            }}
                        />
                    </div>
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onDelete(section.id); }}
                    />
                </div>
            </Card>
        </div>
    )
}

SortableSectionItem.propTypes = {
    section: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        name: PropTypes.string.isRequired
    }).isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onNameChange: PropTypes.func.isRequired
}

// --- Preview Component for a Single Section ---
const SectionPreview = ({ section, masterData, onDataChange }) => {
    const containerRef = useRef(null)
    const viewerInstance = useRef(null)
    useEffect(() => {
        if (!containerRef.current) return

        const viewer = new Form({ container: containerRef.current })
        viewerInstance.current = viewer

        const init = async () => {
            try {
                // Deep copy to ensure no shared state issues in viewer
                const schema = section.schema ? JSON.parse(JSON.stringify(section.schema)) : null
                if (schema && !schema.components) schema.components = []

                await viewer.importSchema(schema || { schemaVersion: 4, exporter: { name: 'form-js', version: '0.1.0' }, type: 'default', components: [] }, masterData)

                // Listen for data changes
                viewer.on('changed', (event) => {
                    if (onDataChange) {
                        onDataChange(section.id, event.data)
                    }
                })
            } catch (err) {
                console.error(`Failed to load preview for section ${section.name}`, err)
            }
        }
        init()

        return () => {
            if (viewerInstance.current) viewerInstance.current.destroy()
        }
    }, [section, masterData]) // Removed 'onDataChange' from deps to avoid re-init loop if handler is unstable, but ideally it should be stable or ref.


    return (
        <Card title={section.name} className="form-preview-card" style={{ marginBottom: 24, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)' }}>
            <div ref={containerRef} />
        </Card>
    )
}

SectionPreview.propTypes = {
    section: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        name: PropTypes.string,
        schema: PropTypes.object
    }).isRequired,
    masterData: PropTypes.object,
    onDataChange: PropTypes.func
}

const CreateFormEditor = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const isViewMode = location.pathname.includes('/view/') || location.pathname.includes('/test-form')

    const containerRef = useRef(null)
    const bpmnInstance = useRef(null)

    // State
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formName, setFormName] = useState('')
    const [formDescription, setFormDescription] = useState('')
    const [mode, setMode] = useState(isViewMode ? 'preview' : 'edit') // 'edit' | 'preview'
    const [formData, setFormData] = useState({})

    // Sections Management
    const [sections, setSections] = useState([])
    const [activeSectionId, setActiveSectionId] = useState(null)

    // --- Schema Templates ---

    const initialSchema = {
        schemaVersion: 4,
        exporter: { name: 'form-js', version: '0.1.0' },
        type: 'default',
        components: [],
    }

    const getEmptySchema = () => JSON.parse(JSON.stringify(initialSchema))

    const local = JSON.parse(localStorage.getItem('user-info'))
    const token = local?.token

    // --- Master Data for Dropdowns ---
    const [masterData, setMasterData] = useState({})

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {}
                const endpoints = [
                    { key: 'campuses', url: `${BASE_URL}/api/form-options/campuses`, map: d => ({ value: d.name, label: d.name }) },
                    { key: 'faculties', url: `${BASE_URL}/api/form-options/faculties`, map: d => ({ value: d.name, label: d.name }) },
                    { key: 'departments', url: `${BASE_URL}/api/form-options/departments`, map: d => ({ value: d.department_name, label: d.department_name }) },
                    { key: 'activityTypes', url: `${BASE_URL}/api/form-options/activityTypes`, map: d => ({ value: d.code, label: d.label || d.code }) },
                    { key: 'industrySectors', url: `${BASE_URL}/api/form-options/industrySectors`, map: d => ({ value: d, label: d }) },
                    { key: 'employers', url: `${BASE_URL}/api/form-options/employers`, map: d => ({ value: d, label: d }) },
                    { key: 'hods', url: `${BASE_URL}/api/form-options/hods`, map: d => ({ value: d.id, label: d.name }) }
                ]

                const results = await Promise.all(endpoints.map(async ep => {
                    try {
                        const res = await fetch(ep.url, { headers })
                        if (res.ok) {
                            let data = await res.json()
                            // Handle various response structures (data wrapper, etc)
                            // Generic unwrapper
                            const list = Array.isArray(data) ? data : (data.data && Array.isArray(data.data) ? data.data : [])

                            // Map if mapper provided
                            return { key: ep.key, data: list.map(item => ep.map(item)) }
                        }
                    } catch (e) {
                        console.error(`Failed to fetch ${ep.key}`, e)
                    }
                    return { key: ep.key, data: [] }
                }))

                const newData = {}
                results.forEach(r => {
                    if (r) newData[r.key] = r.data
                })
                setMasterData(newData)
            } catch (err) {
                console.error("Error loading master data", err)
            }
        }
        fetchMasterData()
    }, [])

    // --- DND Sensors ---
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

    // --- Editor/Viewer Logic ---

    // Save current active section schema to state before switching
    const saveCurrentSectionSchema = () => {
        if (!activeSectionId || !bpmnInstance.current || !sections.length) return

        try {
            // Check if we are in a state where saving is possible (Edit mode has .saveSchema)
            // Viewer (Preview) does not have saveSchema, but we shouldn't be editing in preview anyway
            if (mode === 'edit') {
                const currentSchema = bpmnInstance.current.saveSchema()
                setSections(prev => prev.map(s => s.id === activeSectionId ? { ...s, schema: currentSchema } : s))
            }
        } catch (err) {
            console.error('Error auto-saving section schema:', err)
        }
    }

    const initEditor = async (schema) => {
        if (!containerRef.current) return
        if (bpmnInstance.current) bpmnInstance.current.destroy()

        const editor = new FormEditor({ container: containerRef.current })
        bpmnInstance.current = editor

        try {
            const schemaToImport = schema || getEmptySchema()
            if (!schemaToImport.components) {
                schemaToImport.components = []
            }
            await editor.importSchema(schemaToImport)
        } catch (err) {
            // console.error('Failed to import schema into Editor', err)
            // Fallback if schema is invalid
            await editor.importSchema(getEmptySchema())
        }
    }

    const initViewer = async (schema) => {
        if (!containerRef.current) return
        if (bpmnInstance.current) bpmnInstance.current.destroy()

        const viewer = new Form({ container: containerRef.current })
        bpmnInstance.current = viewer

        try {
            const schemaToImport = schema || getEmptySchema()
            if (!schemaToImport.components) {
                schemaToImport.components = []
            }
            await viewer.importSchema(schemaToImport, masterData)
        } catch (err) {
            console.error('Failed to import schema into Viewer', err)
        }
    }

    // --- Effects ---

    // Load form on mount
    useEffect(() => {
        if (id) {
            fetchForm()
        } else {
            // New Form: Create 1 default section
            const defaultSection = { id: `sec-${Date.now()}`, name: 'Section 1', order: 0, schema: getEmptySchema() }
            setSections([defaultSection])
            setActiveSectionId(defaultSection.id)
        }
    }, [id])

    // Sync mode with view prop
    useEffect(() => {
        if (isViewMode) {
            setMode('preview')
        }
    }, [isViewMode])

    // Handle switching sections or modes
    // When activeSectionId changes, we load that schema into the editor
    useEffect(() => {
        if (!activeSectionId) return

        const activeSection = sections.find(s => s.id === activeSectionId)
        if (activeSection) {
            // console.log('Loading section:', activeSection.name)
            if (mode === 'edit') {
                initEditor(activeSection.schema)
            } else {
                initViewer(activeSection.schema)
            }
        }
    }, [activeSectionId, mode])


    // --- Actions ---

    const fetchForm = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await response.json()
            setFormName(data.name)
            setFormDescription(data.description)

            // Check for Sections
            if (data.sections && data.sections.length > 0) {
                // Map backend sections to our state
                const mappedSections = data.sections.map(s => ({
                    id: s.id || `sec-${Math.random()}`,
                    name: s.name,
                    order: s.order,
                    schema: s.schema || getEmptySchema()
                }))
                // Sort by order
                mappedSections.sort((a, b) => a.order - b.order)

                setSections(mappedSections)
                setActiveSectionId(mappedSections[0].id)
            } else if (data.schema) {
                // Backward compatibility: Single schema form, convert to 1 section
                const singleSection = { id: `sec-default`, name: 'Main Section', order: 0, schema: data.schema }
                setSections([singleSection])
                setActiveSectionId(singleSection.id)
            } else {
                // Empty
                const defaultSection = { id: `sec-${Date.now()}`, name: 'Section 1', order: 0, schema: getEmptySchema() }
                setSections([defaultSection])
                setActiveSectionId(defaultSection.id)
            }
        } catch (error) {
            console.error('Error fetching form:', error)
            message.error('Failed to fetch form details')
        } finally {
            setLoading(false)
        }
    }

    const addSection = () => {
        // Capture current schema manually to avoid race conditions with state updates
        const currentSchema = bpmnInstance.current && mode === 'edit' ? bpmnInstance.current.saveSchema() : null

        setSections(prevSections => {
            // Update current section if needed
            const updatedSections = prevSections.map(s =>
                s.id === activeSectionId && currentSchema
                    ? { ...s, schema: currentSchema }
                    : s
            )

            const newSection = {
                id: `sec-${Date.now()}`,
                name: `Section ${updatedSections.length + 1}`,
                order: updatedSections.length,
                schema: getEmptySchema()
            }

            // We can't side-effect set the active ID easily here, 
            // so we'll do it by effect or just set it after. 
            // But since this is sync, we can just grab the ID.
            setTimeout(() => setActiveSectionId(newSection.id), 0)

            return [...updatedSections, newSection]
        })
    }

    const switchSection = async (id) => {
        if (id === activeSectionId) return

        // 1. Capture current state
        let currentSchema = null
        try {
            currentSchema = bpmnInstance.current && mode === 'edit' ? bpmnInstance.current.saveSchema() : null
        } catch (e) {
            console.error('Failed to save current schema:', e)
        }

        // 2. Update local state
        // We need to calculate the NEW sections array to pass to the next render AND to the save function
        const updatedSections = sections.map(s =>
            s.id === activeSectionId && currentSchema
                ? { ...s, schema: currentSchema }
                : s
        )

        setSections(updatedSections)
        setActiveSectionId(id)

        // 3. Auto-save as draft
        // We use the updatedSections we just calculated
        // Only auto-save if we have a name (or meaningful data) to avoid creating junk
        if (formName) {
            await saveFormPayload(updatedSections, 'draft', true, id) // Pass target active ID
        }
    }

    const updateSectionName = (id, newName) => {
        setSections(sections.map(s => s.id === id ? { ...s, name: newName } : s))
    }

    const deleteSection = (id) => {
        if (sections.length <= 1) {
            message.warning('Forms must have at least one section.')
            return
        }

        Modal.confirm({
            title: 'Delete Section?',
            content: 'This will delete the section and all its fields.',
            onOk: () => {
                const newSections = sections.filter(s => s.id !== id)
                setSections(newSections)
                if (activeSectionId === id) {
                    setActiveSectionId(newSections[0].id)
                }
            }
        })
    }

    const handleDragEnd = (event) => {
        const { active, over } = event
        if (active.id !== over.id) {
            setSections((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id)
                const newIndex = items.findIndex(i => i.id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    const toggleMode = () => {
        saveCurrentSectionSchema()
        setMode(prev => prev === 'edit' ? 'preview' : 'edit')
    }

    const handleSave = async (status = 'active') => {
        if (!formName) {
            message.error('Please enter a form name')
            return
        }

        // Ensure current active section is up to date in state
        if (mode === 'edit' && bpmnInstance.current) {
            const currentSchema = bpmnInstance.current.saveSchema()
            const payloadSections = sections.map((s, index) => ({
                name: s.name,
                order: index,
                schema: s.id === activeSectionId ? currentSchema : s.schema
            }))

            await saveFormPayload(payloadSections, status)
        } else {
            const payloadSections = sections.map((s, index) => ({
                name: s.name,
                order: index,
                schema: s.schema
            }))
            await saveFormPayload(payloadSections, status)
        }
    }

    const saveFormPayload = async (sectionsPayload, status = 'active', silent = false, nextActiveId = null) => {
        const effectiveActiveId = nextActiveId ?? activeSectionId // Use intended (next) ID if provided, due to closure staleness
        if (!silent) setSaving(true)

        try {
            const payload = {
                name: formName,
                description: formDescription,
                status: status,
            }

            const method = id ? 'PUT' : 'POST'
            const url = id ? `${BASE_URL}/api/forms/${id}` : `${BASE_URL}/api/forms`

            // 1. Save Form Details
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            })

            let savedFormId = id
            if (response.ok) {
                const data = await response.json()
                savedFormId = data.id

                // 2. Save Structure (Sections)
                const structurePayload = { sections: sectionsPayload }

                const structRes = await fetch(`${BASE_URL}/api/forms/${savedFormId}/structure`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify(structurePayload),
                })

                if (structRes.ok) {
                    const savedData = await structRes.json()

                    if (savedData.sections && Array.isArray(savedData.sections)) {
                        // Sync local sections with backend response to get the new IDs
                        // We match by 'order' assuming the backend preserves it (which it does)
                        setSections(prevSections => {
                            const newSections = [...prevSections]
                            savedData.sections.forEach(backendSection => {
                                const localIndex = newSections.findIndex(s => s.order === backendSection.order)
                                if (localIndex !== -1) {
                                    // Allow the ID to update, but keep other local state if needed (though backend is source of truth)
                                    // If the active section ID changes, we must handle that separately or here.

                                    // Check if we are updating the active section's ID (Handle ID change for new sections)
                                    // Use effectiveActiveId to ensure we don't accidentally revert a user's switch
                                    if (newSections[localIndex].id === effectiveActiveId && newSections[localIndex].id !== backendSection.id) {
                                        setActiveSectionId(backendSection.id)
                                    }

                                    newSections[localIndex] = {
                                        ...newSections[localIndex],
                                        id: backendSection.id, // Update ID
                                        // Update other fields to ensure sync
                                        name: backendSection.name,
                                        schema: backendSection.schema
                                    }
                                }
                            })
                            return newSections
                        })
                    }

                    if (!silent) message.success(`Form saved as ${status} successfully`)
                    if (!id) {
                        // If it was a new form, navigate to the edit URL with the new ID
                        navigate(`/form-builder/edit/${savedFormId}`, { replace: true })
                    }
                } else {
                    if (!silent) message.error('Form details saved, but failed to save sections structure.')
                }
            } else {
                if (!silent) message.error('Failed to save form details')
            }
        } catch (error) {
            console.error('Error saving form:', error)
            if (!silent) message.error('Error saving form')
        } finally {
            if (!silent) setSaving(false)
        }
    }

    const handleSectionDataChange = (sectionId, data) => {
        setFormData(prev => ({
            ...prev,
            [sectionId]: data
        }))
    }

    const handleSubmitForm = async () => {
        // Merge section data
        let mergedData = {}
        Object.values(formData).forEach(sectionData => {
            mergedData = { ...mergedData, ...sectionData }
        })

        // Clean data: Remove masterData keys that might have polluted the form data
        if (masterData) {
            Object.keys(masterData).forEach(key => {
                delete mergedData[key]
            })
        }

        setLoading(true)
        try {
            const response = await fetch(`${BASE_URL}/api/forms/${id}/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({ data: mergedData })
            })

            const resData = await response.json()

            if (response.ok) {
                message.success('Form submitted successfully!')
            } else {
                if (resData.errors) {
                    const errorMsg = Object.values(resData.errors).flat()[0] || 'Submission invalid'
                    message.error(errorMsg)
                } else {
                    message.error(resData.message || 'Submission failed')
                }
            }
        } catch (error) {
            console.error('Submission error:', error)
            message.error('An error occurred during submission.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f5f5', overflow: 'hidden' }}>
            {/* Header */}
            <div className="editor-header">
                <Space>
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/form-builder')} type="text" style={{ fontSize: '16px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
                        <Input
                            placeholder="Form Name"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            variant="borderless"
                            style={{ fontSize: '18px', fontWeight: 'bold', padding: 0, height: '24px' }}
                        />
                        <Input
                            placeholder="Add description..."
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            variant="borderless"
                            size="small"
                            style={{ color: '#888', padding: 0, fontSize: '12px' }}
                        />
                    </div>
                </Space>
                <Space size="middle">
                    {!isViewMode && (
                        <div style={{ display: 'flex', alignItems: 'center', background: '#f0f2f5', padding: '4px 8px', borderRadius: '6px' }}>
                            <Text style={{ marginRight: 8, fontSize: '12px', fontWeight: 500, color: '#666' }}>{mode === 'edit' ? 'Design Mode' : 'Preview Mode'}</Text>
                            <Switch
                                checkedChildren={<EyeOutlined />}
                                unCheckedChildren={<EditOutlined />}
                                checked={mode === 'preview'}
                                onChange={toggleMode}
                                size="small"
                            />
                        </div>
                    )}
                    {!isViewMode && <Button type="default" icon={<SaveOutlined />} onClick={() => handleSave('draft')} loading={saving}>Save Draft</Button>}
                    {!isViewMode && <Button type="primary" icon={<SaveOutlined />} onClick={() => handleSave('active')} loading={saving} style={{ background: '#28B463', borderColor: '#28B463' }}>Save & Publish</Button>}
                </Space>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* Left Sidebar: Sections List and Data Sources */}
                {mode === 'edit' && (
                    <div className="editor-sidebar">
                        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
                            <Text strong style={{ fontSize: '14px' }}>Form Sections</Text>
                            <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={addSection}>Add</Button>
                        </div>

                        <div className="sidebar-list-container" style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                    {sections.map(section => (
                                        <div className="sidebar-section-item" key={section.id}>
                                            <SortableSectionItem
                                                section={section}
                                                isActive={activeSectionId === section.id}
                                                onClick={() => switchSection(section.id)}
                                                onDelete={deleteSection}
                                                onNameChange={updateSectionName}
                                            />
                                        </div>
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>

                        {/* Available Data Sources Help Panel */}
                        <div style={{ padding: '16px', borderTop: '1px solid #e8e8e8', background: '#fcfcfc' }}>
                            <div className="data-source-panel-header">
                                <Text strong style={{ fontSize: '12px', color: '#595959' }}>Master Data Keys</Text>
                            </div>

                            <div style={{ maxHeight: '150px', overflowY: 'auto' }} className="sidebar-list-container">
                                <List
                                    size="small"
                                    dataSource={Object.keys(masterData)}
                                    renderItem={key => (
                                        <List.Item style={{ padding: '6px 0', fontSize: '11px', borderBottom: '1px solid #f5f5f5' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                <span style={{ fontFamily: 'monospace', color: '#096dd9' }}>{key}</span>
                                                <Typography.Paragraph
                                                    copyable={{ text: key, tooltips: ['Copy', 'Copied!'] }}
                                                    style={{ margin: 0 }}
                                                />
                                            </div>
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <Text type="secondary" style={{ fontSize: '10px', display: 'block', marginTop: '8px', lineHeight: '1.4' }}>
                                Paste these keys into the <b>&quot;Values Key&quot;</b> property of Select components.
                            </Text>
                        </div>
                    </div>
                )}

                {/* Right Area: Form Editor Canvas / Preview */}
                <div className="editor-main-canvas-wrapper" style={{ background: mode === 'preview' ? '#f0f2f5' : undefined, overflowY: mode === 'preview' ? 'auto' : 'hidden' }}>
                    {/* Overlay Loader */}
                    {loading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.8)', zIndex: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(2px)' }}>
                            <Spin size="large" tip="Loading Form..." />
                        </div>
                    )}

                    {mode === 'edit' ? (
                        <div className="editor-paper-card">
                            <div className="section-header-bar">
                                <Text strong style={{ fontSize: '14px', color: '#333' }}>
                                    Form Designer
                                </Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    Active Section: <span style={{ color: '#1890ff', fontWeight: 500 }}>{sections.find(s => s.id === activeSectionId)?.name}</span>
                                </Text>
                            </div>
                            <div
                                ref={containerRef}
                                style={{ flex: 1, position: 'relative' }}
                            />
                        </div>
                    ) : (
                        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                                <Title level={2} style={{ marginBottom: 8 }}>{formName || 'Untitled Form'}</Title>
                                <Text type="secondary">{formDescription}</Text>
                            </div>

                            {sections.map(section => (
                                <SectionPreview
                                    key={section.id}
                                    section={section}
                                    masterData={masterData}
                                    onDataChange={handleSectionDataChange}
                                />
                            ))}

                            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40, paddingBottom: 40 }}>
                                <Button type="primary" size="large" style={{ minWidth: 200, height: 50, fontSize: 16 }} onClick={handleSubmitForm}>Submit Form</Button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

export default CreateFormEditor
