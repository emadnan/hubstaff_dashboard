// UPDATED BUTTON SETTINGS - Replace the previous patch with this code
// ADD THIS CODE AFTER LINE 547 in DndComponents.js (after the File Upload Settings closing })

{/* Button Field Options */ }
{
    field.field_type === 'button' && (
        <div style={{
            marginTop: '16px',
            padding: '16px',
            background: '#f0f5ff',
            borderRadius: '8px',
            border: '1px solid #d6e4ff'
        }}>
            <Text strong style={{ fontSize: '13px', color: '#262626', display: 'block', marginBottom: '12px' }}>
                Button Settings
            </Text>
            <Space direction="vertical" style={{ width: '100%' }} size="small">
                <div>
                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Button Text</Text>
                    <Input
                        placeholder="e.g., Click Here, Learn More"
                        value={field.validation?.button_text || field.label}
                        onChange={(e) => updateField(sectionIndex, fieldIndex, {
                            validation: { ...(field.validation || {}), button_text: e.target.value }
                        })}
                        size="small"
                    />
                </div>
                <div>
                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Button Style</Text>
                    <Select
                        value={field.validation?.button_style || 'primary'}
                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                            validation: { ...(field.validation || {}), button_style: val }
                        })}
                        style={{ width: '100%' }}
                        size="small"
                    >
                        <Option value="primary">Primary (Blue)</Option>
                        <Option value="default">Default (White)</Option>
                        <Option value="dashed">Dashed</Option>
                        <Option value="link">Link</Option>
                    </Select>
                </div>
                <div>
                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Button Alignment</Text>
                    <Select
                        value={field.validation?.button_align || 'center'}
                        onChange={(val) => updateField(sectionIndex, fieldIndex, {
                            validation: { ...(field.validation || {}), button_align: val }
                        })}
                        style={{ width: '100%' }}
                        size="small"
                    >
                        <Option value="left">Left</Option>
                        <Option value="center">Center</Option>
                        <Option value="right">Right</Option>
                    </Select>
                </div>
                <div>
                    <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>Button Action URL</Text>
                    <Input
                        placeholder="https://example.com (optional)"
                        value={field.validation?.action_url || ''}
                        onChange={(e) => updateField(sectionIndex, fieldIndex, {
                            validation: { ...(field.validation || {}), action_url: e.target.value }
                        })}
                        size="small"
                    />
                </div>
            </Space>
        </div>
    )
}
