import React from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';
import { Card, Button, Space, Input, Select, Switch, Divider, Tooltip, Typography, Radio, Tag, InputNumber, Spin } from 'antd';
import {
    MenuOutlined,
    DeleteOutlined,
    PlusOutlined,
    CloseOutlined,
    DatabaseOutlined,
    EditOutlined,
    CopyOutlined,
    HolderOutlined,
    StarFilled,
    EyeOutlined,
    EyeInvisibleOutlined
} from '@ant-design/icons';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';

const { Option } = Select;
const { Text, Title } = Typography;

// Design tokens matching website
const PRIMARY_COLOR = '#0070FF';
const CARD_STYLE = {
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
    border: 'none'
};

// Available Dynamic Data Sources
const DATA_SOURCES = [
    { label: 'Campuses', value: 'campuses' },
    { label: 'Departments', value: 'departments' },
    { label: 'Faculties', value: 'faculties' },
    { label: 'Users/Employees', value: 'users' },
    { label: 'Activity Types', value: 'activity_types' },
    { label: 'HOD Names', value: 'department_hods' },
    { label: 'Industry Sectors', value: 'industry_sectors' },
    { label: 'Proposed Employers', value: 'employers' }
];


// Draggable Field Template for Floating Toolbar
export const DraggableFieldTemplate = ({ type, label, icon, onClick }) => {
    return (
        <Tooltip title={label} placement="left">
            <Button
                type="text"
                icon={React.cloneElement(icon, { style: { fontSize: '18px', color: PRIMARY_COLOR } })}
                onClick={() => onClick(type)}
                style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    transition: 'all 0.2s',
                    marginBottom: '4px'
                }}
                className="toolbar-btn"
            />
        </Tooltip>
    );
};

DraggableFieldTemplate.propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired
};

// Sortable Field Item
export const SortableFieldItem = ({
    id,
    field,
    sectionIndex,
    fieldIndex,
    updateField,
    removeField,
    isActive,
    onFocus,
    duplicateField,
    dynamicData,
    getOptionsForField
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id,
        data: {
            type: 'field',
            sectionIndex,
            fieldIndex
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 1000 : 1,
        marginBottom: '16px',
        position: 'relative'
    };

    const isOptionType = ['select', 'radio', 'checkbox'].includes(field.field_type);

    const handleAddOption = () => {
        const currentOptions = field.options || [];
        updateField(sectionIndex, fieldIndex, {
            options: [...currentOptions, { label: `Option ${currentOptions.length + 1}`, value: `option_${currentOptions.length + 1}` }]
        });
    };

    const handleUpdateOption = (optIdx, key, val) => {
        const newOptions = [...(field.options || [])];
        newOptions[optIdx][key] = val;
        updateField(sectionIndex, fieldIndex, { options: newOptions });
    };

    const handleRemoveOption = (optIdx) => {
        const newOptions = (field.options || []).filter((_, i) => i !== optIdx);
        updateField(sectionIndex, fieldIndex, { options: newOptions });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onFocus(id)}
        >
            <Card
                size="small"
                className={`form-field-card ${isActive ? 'active' : ''}`}
                style={{
                    ...CARD_STYLE,
                    border: isActive ? `2px solid ${PRIMARY_COLOR}` : '1px solid #f0f0f0',
                    background: '#ffffff',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                }}
                bodyStyle={{ padding: isActive ? '20px' : '16px' }}
            >
                {/* Drag Handle */}
                <div
                    {...listeners}
                    {...attributes}
                    style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        cursor: 'grab',
                        opacity: isActive ? 0.6 : 0.3,
                        transition: 'opacity 0.2s'
                    }}
                    className="drag-handle"
                >
                    <HolderOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
                </div>

                {/* Required Badge */}
                {field.is_required && !isActive && (
                    <Tag color="error" style={{ position: 'absolute', top: '12px', right: '12px', margin: 0 }}>
                        <StarFilled style={{ fontSize: '10px' }} /> Required
                    </Tag>
                )}

                {/* Field Content */}
                <div style={{ paddingLeft: isActive ? '0' : '32px' }}>
                    <MDBRow className="mb-3">
                        <MDBCol md={isActive ? 6 : 12}>
                            <Input
                                placeholder="Field Label"
                                value={field.label}
                                onChange={(e) => updateField(sectionIndex, fieldIndex, { label: e.target.value })}
                                style={{
                                    fontSize: '15px',
                                    fontWeight: '500',
                                    borderRadius: '6px',
                                    border: isActive ? '1px solid #d9d9d9' : 'none',
                                    background: isActive ? '#fff' : 'transparent',
                                    padding: isActive ? '4px 11px' : '0',
                                    cursor: isActive ? 'text' : 'pointer'
                                }}
                                bordered={isActive}
                            />
                        </MDBCol>
                        {isActive && (
                            <>
                                <MDBCol md={3}>
                                    <Select
                                        style={{ width: '100%' }}
                                        value={field.field_type}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, { field_type: val })}
                                        size="middle"
                                    >
                                        <Option value="text">Text Input</Option>
                                        <Option value="textarea">Long Text</Option>
                                        <Option value="name">Name (First/Last)</Option>
                                        <Option value="email">Email</Option>
                                        <Option value="phone">Phone Number</Option>
                                        <Option value="password">Password</Option>
                                        <Option value="url">URL/Website</Option>
                                        <Option value="number">Number</Option>
                                        <Option value="date">Date</Option>
                                        <Option value="time">Time</Option>
                                        <Option value="radio">Multiple Choice</Option>
                                        <Option value="checkbox">Checkboxes</Option>
                                        <Option value="select">Dropdown</Option>
                                        <Option value="file">File Upload</Option>
                                        <Option value="rating">Rating/Stars</Option>
                                        <Option value="button">Button</Option>
                                    </Select>
                                </MDBCol>
                                <MDBCol md={3}>
                                    <Select
                                        style={{ width: '100%' }}
                                        value={field.column_width || 'full'}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, { column_width: val })}
                                        size="middle"
                                        placeholder="Width"
                                    >
                                        <Option value="full">Full Width</Option>
                                        <Option value="half">Half (1/2)</Option>
                                        <Option value="third">Third (1/3)</Option>
                                        <Option value="quarter">Quarter (1/4)</Option>
                                    </Select>
                                </MDBCol>
                            </>
                        )}
                    </MDBRow>

                    {/* Field Preview/Edit Area */}
                    {isActive && isOptionType && (
                        <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                            <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                                <Radio.Group
                                    size="small"
                                    value={field.data_source ? 'dynamic' : 'static'}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        if (e.target.value === 'static') {
                                            updateField(sectionIndex, fieldIndex, { data_source: null });
                                        } else {
                                            updateField(sectionIndex, fieldIndex, { data_source: DATA_SOURCES[0].value, options: [] });
                                        }
                                    }}
                                    buttonStyle="solid"
                                >
                                    <Radio.Button value="static"><EditOutlined /> Manual</Radio.Button>
                                    <Radio.Button value="dynamic"><DatabaseOutlined /> Dynamic</Radio.Button>
                                </Radio.Group>
                            </div>

                            {field.data_source ? (
                                <div
                                    style={{
                                        padding: '16px',
                                        background: '#f0f5ff',
                                        borderRadius: '8px',
                                        border: '1px solid #d6e4ff'
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: '500' }}>
                                            <DatabaseOutlined /> Data Source
                                        </Text>
                                        <Select
                                            style={{ width: '100%' }}
                                            value={field.data_source}
                                            onChange={(val) => {
                                                updateField(sectionIndex, fieldIndex, { data_source: val });
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            dropdownStyle={{ zIndex: 9999 }}
                                        >
                                            {DATA_SOURCES.map(source => (
                                                <Option key={source.value} value={source.value}>{source.label}</Option>
                                            ))}
                                        </Select>
                                        <Text type="secondary" style={{ fontSize: '11px' }}>
                                            Options will be loaded from the selected data source
                                        </Text>

                                        {/* Preview of loaded options */}
                                        {getOptionsForField && (() => {
                                            const loadedOptions = getOptionsForField(field);
                                            if (loadedOptions && loadedOptions.length > 0) {
                                                return (
                                                    <div style={{ marginTop: '12px' }}>
                                                        <Divider style={{ margin: '8px 0' }} />
                                                        <Text strong style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                                                            Loaded Options ({loadedOptions.length}):
                                                        </Text>
                                                        <div style={{
                                                            maxHeight: '150px',
                                                            overflowY: 'auto',
                                                            padding: '8px',
                                                            background: 'white',
                                                            borderRadius: '6px',
                                                            border: '1px solid #d6e4ff'
                                                        }}>
                                                            {loadedOptions.slice(0, 10).map((opt, idx) => (
                                                                <div key={idx} style={{
                                                                    padding: '4px 8px',
                                                                    marginBottom: '4px',
                                                                    background: '#f8fafc',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px'
                                                                }}>
                                                                    {field.field_type === 'checkbox' ?
                                                                        <span>☑️</span> :
                                                                        <span>🔘</span>
                                                                    } {opt.label}
                                                                </div>
                                                            ))}
                                                            {loadedOptions.length > 10 && (
                                                                <Text type="secondary" style={{ fontSize: '11px', fontStyle: 'italic' }}>
                                                                    ... and {loadedOptions.length - 10} more
                                                                </Text>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            } else if (dynamicData && !dynamicData[field.data_source]) {
                                                return (
                                                    <div style={{ marginTop: '12px', textAlign: 'center' }}>
                                                        <Spin size="small" />
                                                        <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginTop: '4px' }}>
                                                            Loading options...
                                                        </Text>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </Space>
                                </div>
                            ) : (
                                <div>
                                    {(field.options || []).map((opt, oIdx) => (
                                        <div key={oIdx} className="d-flex align-items-center mb-2" style={{ gap: '8px' }}>
                                            {field.field_type === 'checkbox' ?
                                                <div style={{ width: '16px', height: '16px', border: `2px solid ${PRIMARY_COLOR}`, borderRadius: '4px' }} /> :
                                                <div style={{ width: '16px', height: '16px', border: `2px solid ${PRIMARY_COLOR}`, borderRadius: '50%' }} />
                                            }
                                            <Input
                                                size="small"
                                                value={opt.label}
                                                placeholder={`Option ${oIdx + 1}`}
                                                onChange={(e) => handleUpdateOption(oIdx, 'label', e.target.value)}
                                                onBlur={(e) => handleUpdateOption(oIdx, 'value', e.target.value.toLowerCase().replace(/ /g, '_'))}
                                                style={{ flex: 1, borderRadius: '6px' }}
                                            />
                                            <Button
                                                type="text"
                                                danger
                                                icon={<CloseOutlined />}
                                                size="small"
                                                onClick={() => handleRemoveOption(oIdx)}
                                            />
                                        </div>
                                    ))}
                                    <Button
                                        type="dashed"
                                        icon={<PlusOutlined />}
                                        onClick={handleAddOption}
                                        size="small"
                                        style={{ marginTop: '8px', borderRadius: '6px' }}
                                    >
                                        Add Option
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Text Input Validation Options */}
                    {field.field_type === 'text' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Text Input Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Placeholder Text</Text>
                                    <Input
                                        placeholder="Enter placeholder..."
                                        value={field.validation?.placeholder || ''}
                                        onChange={(e) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), placeholder: e.target.value }
                                        })}
                                        size="small"
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Min Length</Text>
                                        <InputNumber
                                            min={0}
                                            max={1000}
                                            value={field.validation?.min_length || 0}
                                            onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                validation: { ...(field.validation || {}), min_length: val }
                                            })}
                                            style={{ width: '100%' }}
                                            size="small"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Max Length</Text>
                                        <InputNumber
                                            min={0}
                                            max={1000}
                                            value={field.validation?.max_length || 255}
                                            onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                validation: { ...(field.validation || {}), max_length: val }
                                            })}
                                            style={{ width: '100%' }}
                                            size="small"
                                        />
                                    </div>
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* Email Validation Options */}
                    {field.field_type === 'email' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Email Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Placeholder Text</Text>
                                    <Input
                                        placeholder="e.g., user@example.com"
                                        value={field.validation?.placeholder || ''}
                                        onChange={(e) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), placeholder: e.target.value }
                                        })}
                                        size="small"
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Allow Multiple Emails</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.allow_multiple || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), allow_multiple: val }
                                        })}
                                    />
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* Number Validation Options */}
                    {field.field_type === 'number' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Number Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Min Value</Text>
                                        <InputNumber
                                            value={field.validation?.min_value}
                                            onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                validation: { ...(field.validation || {}), min_value: val }
                                            })}
                                            style={{ width: '100%' }}
                                            size="small"
                                            placeholder="No min"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Max Value</Text>
                                        <InputNumber
                                            value={field.validation?.max_value}
                                            onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                validation: { ...(field.validation || {}), max_value: val }
                                            })}
                                            style={{ width: '100%' }}
                                            size="small"
                                            placeholder="No max"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Allow Decimals</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.allow_decimals !== false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), allow_decimals: val }
                                        })}
                                    />
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* Phone Validation Options */}
                    {field.field_type === 'phone' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Phone Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Format</Text>
                                    <Select
                                        value={field.validation?.format || 'any'}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), format: val }
                                        })}
                                        style={{ width: '100%' }}
                                        size="small"
                                    >
                                        <Option value="any">Any Format</Option>
                                        <Option value="us">US Format</Option>
                                        <Option value="international">International (+)</Option>
                                    </Select>
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* File Upload Options */}
                    {field.field_type === 'file' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                File Upload Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Allowed File Types</Text>
                                    <Input
                                        placeholder="e.g., .pdf, .doc, .jpg"
                                        value={field.validation?.allowed_types || ''}
                                        onChange={(e) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), allowed_types: e.target.value }
                                        })}
                                        size="small"
                                    />
                                </div>
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Max File Size (MB)</Text>
                                    <InputNumber
                                        min={1}
                                        max={100}
                                        value={field.validation?.max_size || 10}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), max_size: val }
                                        })}
                                        style={{ width: '100%' }}
                                        size="small"
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Allow Multiple Files</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.allow_multiple || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), allow_multiple: val }
                                        })}
                                    />
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* Password Validation Options */}
                    {field.field_type === 'password' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Password Validation Rules
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Minimum Length</Text>
                                    <InputNumber
                                        min={1}
                                        max={50}
                                        value={field.validation?.min_length || 8}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), min_length: val }
                                        })}
                                        style={{ width: '80px' }}
                                        size="small"
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Require Numbers</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.require_numbers || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), require_numbers: val }
                                        })}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Require Uppercase</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.require_uppercase || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), require_uppercase: val }
                                        })}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Require Special Characters</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.require_special || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), require_special: val }
                                        })}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>
                                        <EyeOutlined style={{ marginRight: '6px' }} />
                                        Allow Show Password
                                    </Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.allow_show_password !== false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), allow_show_password: val }
                                        })}
                                    />
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* Dropdown (Select) Settings */}
                    {field.field_type === 'select' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Dropdown Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Allow Multiple Selection</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.allow_multiple || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), allow_multiple: val }
                                        })}
                                    />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Enable Search</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.searchable || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), searchable: val }
                                        })}
                                    />
                                </div>
                                {field.validation?.allow_multiple && (
                                    <>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ flex: 1 }}>
                                                <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Min Selections</Text>
                                                <InputNumber
                                                    min={0}
                                                    max={field.options?.length || 10}
                                                    value={field.validation?.min_selections || 0}
                                                    onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                        validation: { ...(field.validation || {}), min_selections: val }
                                                    })}
                                                    style={{ width: '100%' }}
                                                    size="small"
                                                    placeholder="No min"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Max Selections</Text>
                                                <InputNumber
                                                    min={1}
                                                    max={field.options?.length || 10}
                                                    value={field.validation?.max_selections}
                                                    onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                        validation: { ...(field.validation || {}), max_selections: val }
                                                    })}
                                                    style={{ width: '100%' }}
                                                    size="small"
                                                    placeholder="No max"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Placeholder Text</Text>
                                    <Input
                                        placeholder="e.g., Select an option..."
                                        value={field.validation?.placeholder || ''}
                                        onChange={(e) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), placeholder: e.target.value }
                                        })}
                                        size="small"
                                    />
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* Radio Button Settings */}
                    {field.field_type === 'radio' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Radio Button Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Layout</Text>
                                    <Select
                                        value={field.validation?.layout || 'vertical'}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), layout: val }
                                        })}
                                        style={{ width: '100%' }}
                                        size="small"
                                    >
                                        <Option value="vertical">Vertical (Stacked)</Option>
                                        <Option value="horizontal">Horizontal (Inline)</Option>
                                    </Select>
                                </div>
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Default Selection</Text>
                                    <Select
                                        value={field.validation?.default_value || ''}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), default_value: val }
                                        })}
                                        style={{ width: '100%' }}
                                        size="small"
                                        allowClear
                                        placeholder="None"
                                    >
                                        {(field.options || []).map((opt, idx) => (
                                            <Option key={idx} value={opt.value}>{opt.label}</Option>
                                        ))}
                                    </Select>
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* Checkbox Settings */}
                    {field.field_type === 'checkbox' && (
                        <div style={{
                            marginTop: '16px',
                            padding: '16px',
                            background: '#f0f5ff',
                            borderRadius: '8px',
                            border: '1px solid #d6e4ff'
                        }}>
                            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                                Checkbox Settings
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }} size="small">
                                <div>
                                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Layout</Text>
                                    <Select
                                        value={field.validation?.layout || 'vertical'}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), layout: val }
                                        })}
                                        style={{ width: '100%' }}
                                        size="small"
                                    >
                                        <Option value="vertical">Vertical (Stacked)</Option>
                                        <Option value="horizontal">Horizontal (Inline)</Option>
                                    </Select>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1 }}>
                                        <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Min Selections</Text>
                                        <InputNumber
                                            min={0}
                                            max={field.options?.length || 10}
                                            value={field.validation?.min_selections || 0}
                                            onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                validation: { ...(field.validation || {}), min_selections: val }
                                            })}
                                            style={{ width: '100%' }}
                                            size="small"
                                            placeholder="No min"
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Max Selections</Text>
                                        <InputNumber
                                            min={1}
                                            max={field.options?.length || 10}
                                            value={field.validation?.max_selections}
                                            onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                                validation: { ...(field.validation || {}), max_selections: val }
                                            })}
                                            style={{ width: '100%' }}
                                            size="small"
                                            placeholder="No max"
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={{ fontSize: '13px' }}>Select All Option</Text>
                                    <Switch
                                        size="small"
                                        checked={field.validation?.show_select_all || false}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                                            validation: { ...(field.validation || {}), show_select_all: val }
                                        })}
                                    />
                                </div>
                            </Space>
                        </div>
                    )}
                </div>

                {/* Field Actions */}
                {isActive && (
                    <>
                        <Divider style={{ margin: '16px 0' }} />
                        <div className="d-flex justify-content-between align-items-center">
                            <Space size="small">
                                <Tooltip title="Duplicate">
                                    <Button
                                        type="text"
                                        icon={<CopyOutlined />}
                                        onClick={(e) => { e.stopPropagation(); duplicateField(sectionIndex, fieldIndex); }}
                                        style={{ borderRadius: '6px' }}
                                    />
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <Button
                                        type="text"
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={(e) => { e.stopPropagation(); removeField(sectionIndex, fieldIndex); }}
                                        style={{ borderRadius: '6px' }}
                                    />
                                </Tooltip>
                            </Space>
                            <Space size="middle">
                                <Space size="small">
                                    <Text style={{ fontSize: '13px', color: '#595959' }}>Required</Text>
                                    <Switch
                                        size="small"
                                        checked={field.is_required}
                                        onChange={(val) => updateField(sectionIndex, fieldIndex, { is_required: val })}
                                    />
                                </Space>
                            </Space>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

SortableFieldItem.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    field: PropTypes.shape({
        label: PropTypes.string,
        field_type: PropTypes.string,
        name: PropTypes.string,
        is_required: PropTypes.bool,
        options: PropTypes.array,
        default_value: PropTypes.string,
        data_source: PropTypes.string,
        column_width: PropTypes.string,
        validation: PropTypes.object
    }).isRequired,
    sectionIndex: PropTypes.number.isRequired,
    fieldIndex: PropTypes.number.isRequired,
    updateField: PropTypes.func.isRequired,
    removeField: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    onFocus: PropTypes.func.isRequired,
    duplicateField: PropTypes.func.isRequired,
    dynamicData: PropTypes.object,
    getOptionsForField: PropTypes.func
};

// Sortable Section Container
export const SortableSection = ({
    id,
    section,
    index,
    updateSectionName,
    removeSection,
    children,
    onFocus,
    isActive,
    sections,
    setSections
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id,
        data: {
            type: 'section',
            index
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        marginBottom: '24px',
        position: 'relative'
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onFocus(id)}
        >
            <Card
                className={`form-section-card ${isActive ? 'active' : ''}`}
                style={{
                    ...CARD_STYLE,
                    border: isActive ? `2px solid ${PRIMARY_COLOR}` : '1px solid #f0f0f0',
                    background: '#ffffff'
                }}
                bodyStyle={{ padding: '0' }}
            >
                <div style={{ padding: '24px' }}>
                    {/* Drag Handle */}
                    <div
                        {...listeners}
                        {...attributes}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            left: '20px',
                            cursor: 'grab',
                            opacity: 0.4
                        }}
                    >
                        <HolderOutlined style={{ fontSize: '16px', color: '#8c8c8c' }} />
                    </div>

                    {isActive ? (
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <Input
                                value={section.name}
                                onChange={(e) => updateSectionName(index, e.target.value)}
                                placeholder="Section Title"
                                style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    paddingLeft: '32px',
                                    borderRadius: '6px',
                                    flex: 1
                                }}
                            />
                            <Select
                                value={section.columns_per_row || 1}
                                onChange={(val) => {
                                    const newSections = [...sections];
                                    newSections[index].columns_per_row = val;
                                    setSections(newSections);
                                }}
                                style={{ width: '180px' }}
                                size="middle"
                            >
                                <Option value={1}>1 Column</Option>
                                <Option value={2}>2 Columns</Option>
                                <Option value={3}>3 Columns</Option>
                                <Option value={4}>4 Columns</Option>
                            </Select>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Title level={index === 0 ? 4 : 5} style={{ margin: 0, paddingLeft: '32px', color: '#262626' }}>
                                {section.name || 'Untitled Section'}
                            </Title>
                            <Tag color="blue" style={{ margin: 0 }}>
                                {section.columns_per_row || 1} Column{(section.columns_per_row || 1) > 1 ? 's' : ''}
                            </Tag>
                        </div>
                    )}
                </div>

                <div style={{ padding: '0 24px 24px 24px' }}>
                    {children}
                </div>

                {isActive && (
                    <div className="d-flex justify-content-end p-3" style={{ borderTop: '1px solid #f0f0f0' }}>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeSection(index)}
                            style={{ borderRadius: '6px' }}
                        >
                            Delete Section
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

SortableSection.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    section: PropTypes.shape({
        name: PropTypes.string,
        fields: PropTypes.array,
        columns_per_row: PropTypes.number
    }).isRequired,
    index: PropTypes.number.isRequired,
    updateSectionName: PropTypes.func.isRequired,
    removeSection: PropTypes.func.isRequired,
    children: PropTypes.node,
    onFocus: PropTypes.func.isRequired,
    isActive: PropTypes.bool,
    sections: PropTypes.array.isRequired,
    setSections: PropTypes.func.isRequired
};
