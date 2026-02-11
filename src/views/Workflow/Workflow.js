import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
    CCard,
    CCardBody,
    CCol,
    CRow,
    CButton,
    CContainer,
    CFormSelect,
    CFormInput,
    CFormLabel,
    CCardHeader
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilCheckCircle, cilXCircle, cilBan, cilCalendar, cilDiamond, cilSquare, cilCursor } from '@coreui/icons';

// --- Improved Shape Styles ---

// 1. Role Node (The "Who")
const roleNodeStyle = (color = '#fff') => ({
    background: color,
    border: '1px solid #777',
    borderRadius: '5px',
    padding: '10px',
    textAlign: 'center',
    minWidth: '120px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    nodeType: 'role', // Add identifier
});

// 2. Status Node (The "Where" - Circle)
const statusNodeStyle = (color = '#00CED1') => ({
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    nodeType: 'state', // Add identifier
});

// 3. Action Node (The "Label" - Capsule/Rounded)
const actionNodeStyle = (color = '#f8f9fa') => ({
    background: color,
    border: '1px solid #777',
    borderRadius: '20px',
    padding: '8px 20px',
    textAlign: 'center',
    minWidth: '100px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#555',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    nodeType: 'action', // Add identifier
});


const Workflow = () => {
    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const [forms, setForms] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedForm, setSelectedForm] = useState('');
    const [workflowId, setWorkflowId] = useState(null);
    const [workflowName, setWorkflowName] = useState('');

    // Edit State
    const [selectedElement, setSelectedElement] = useState(null);
    const [elementType, setElementType] = useState(null);
    const [editLabel, setEditLabel] = useState('');
    const [editColor, setEditColor] = useState('#ffffff');

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    // Initial template with Draft status
    const initialNodes = [
        { id: 'role-1', data: { label: 'Initiator' }, position: { x: 50, y: 100 }, style: roleNodeStyle() },
        { id: 'action-1', data: { label: 'Submit' }, position: { x: 250, y: 110 }, style: actionNodeStyle('#e9ecef') },
        { id: 'status-1', data: { label: 'Draft' }, position: { x: 450, y: 95 }, style: statusNodeStyle('#9CA3AF') },
        { id: 'status-2', data: { label: 'Pending HOD' }, position: { x: 650, y: 95 }, style: statusNodeStyle('#00CED1') },
    ];
    const initialEdges = [
        { id: 'e1-2', source: 'role-1', target: 'action-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
        { id: 'e2-3', source: 'action-1', target: 'status-1', animated: true, markerEnd: { type: MarkerType.ArrowClosed } },
        { id: 'e3-4', source: 'status-1', target: 'status-2', animated: true, label: 'submit', markerEnd: { type: MarkerType.ArrowClosed } },
    ];


    // Fetch Forms and Roles
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('user-info'));
                const token = userInfo?.token;

                // Fetch Forms
                const formsResponse = await fetch(`${BASE_URL}/api/forms`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (formsResponse.ok) {
                    const result = await formsResponse.json();
                    setForms(Array.isArray(result) ? result : result.data || []);
                }

                // Fetch Roles
                const rolesResponse = await fetch(`${BASE_URL}/api/getroles`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (rolesResponse.ok) {
                    const result = await rolesResponse.json();
                    setRoles(result.roles || []);
                }
            } catch (error) {
                console.error('Failed to fetch initial data', error);
            }
        };
        fetchInitialData();
    }, [BASE_URL]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge({
        ...params,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed }
    }, eds)), [setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event) => {
            event.preventDefault();

            const shape = event.dataTransfer.getData('application/shape');
            const label = event.dataTransfer.getData('application/label');
            const color = event.dataTransfer.getData('application/color');

            if (!shape) return;

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowWrapper.current.getBoundingClientRect().left,
                y: event.clientY - reactFlowWrapper.current.getBoundingClientRect().top,
            });

            let style = {};
            if (shape === 'role') style = roleNodeStyle(color);
            if (shape === 'status') style = statusNodeStyle(color);
            if (shape === 'action') style = actionNodeStyle(color);


            const newNode = {
                id: `dndnode_${Date.now()}`,
                type: 'default',
                position,
                data: { label: label, nodeType: shape }, // Store node type in data
                style: style,
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    // Selection Handlers
    const onNodeClick = (event, node) => {
        setSelectedElement(node);
        setElementType('node');
        setEditLabel(node.data.label);
        setEditColor(node.style.background || '#ffffff');
    };

    const onEdgeClick = (event, edge) => {
        setSelectedElement(edge);
        setElementType('edge');
        setEditLabel(edge.label || '');
        setEditColor('#000000');
    };

    const onPaneClick = () => {
        setSelectedElement(null);
        setElementType(null);
    }

    // Update Logic
    const handleUpdate = () => {
        if (!selectedElement) return;

        if (elementType === 'node') {
            setNodes((nds) => nds.map((node) => {
                if (node.id === selectedElement.id) {
                    return {
                        ...node,
                        data: { ...node.data, label: editLabel },
                        style: { ...node.style, background: editColor }
                    };
                }
                return node;
            }));
        } else {
            setEdges((eds) => eds.map((edge) => {
                if (edge.id === selectedElement.id) {
                    return { ...edge, label: editLabel };
                }
                return edge;
            }));
        }
        setSelectedElement(null);
        setElementType(null);
    };

    const deleteSelected = () => {
        if (!selectedElement) return;
        if (elementType === 'node') {
            setNodes((nds) => nds.filter((n) => n.id !== selectedElement.id));
            setEdges((eds) => eds.filter((e) => e.source !== selectedElement.id && e.target !== selectedElement.id));
        } else {
            setEdges((eds) => eds.filter((e) => e.id !== selectedElement.id));
        }
        setSelectedElement(null);
        setElementType(null);
    }

    const handleFormChange = async (e) => {
        const formId = e.target.value;
        setSelectedForm(formId);
        setWorkflowId(null);
        setNodes([]);
        setEdges([]);
        setSelectedElement(null);

        if (formId) {
            try {
                const userInfo = JSON.parse(localStorage.getItem('user-info'));
                const token = userInfo?.token;
                const response = await fetch(`${BASE_URL}/api/workflows`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const workflows = await response.json();
                    const list = Array.isArray(workflows) ? workflows : workflows.data || [];
                    const workflow = list.find(w => w.form_id == formId);

                    if (workflow) {
                        setWorkflowId(workflow.id);
                        setWorkflowName(workflow.name || '');
                        if (workflow.steps) {
                            try {
                                const flow = JSON.parse(workflow.steps);
                                setNodes(flow.nodes || []);
                                setEdges(flow.edges || []);
                            } catch (parseErr) {
                                setNodes(initialNodes);
                                setEdges(initialEdges);
                            }
                        }
                    } else {
                        setNodes(initialNodes);
                        setEdges(initialEdges);
                        setWorkflowName('');
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    // IMPROVED: Helper function to determine node type
    const getNodeType = (node) => {
        if (!node) return 'step';

        // First check if nodeType is stored in data (for newly created nodes)
        if (node.data?.nodeType) {
            return node.data.nodeType === 'status' ? 'state' : node.data.nodeType;
        }

        // Check if nodeType is stored in style (from our style functions)
        if (node.style?.nodeType) {
            return node.style.nodeType;
        }

        // Fallback: Check border radius
        const style = node.style || {};
        const borderRadius = style.borderRadius;

        if (borderRadius === '50%') return 'state';
        if (borderRadius === '20px') return 'action';
        if (borderRadius === '5px') {
            // Additional check for role vs generic rectangle
            const label = (node.data?.label || '').toLowerCase();
            const roleKeywords = ['initiator', 'hod', 'head', 'manager', 'officer', 'admin',
                'supervisor', 'director', 'ceo', 'cfo', 'coo', 'linkage', 'dept'];

            if (roleKeywords.some(kw => label.includes(kw))) {
                return 'role';
            }
        }

        return 'step';
    };

    const saveWorkflow = async () => {
        if (!selectedForm) {
            alert('Please select a form first');
            return;
        }

        try {
            const flow = reactFlowInstance.toObject();

            // --- IMPROVED EXTRACTION LOGIC ---
            const extractedSteps = nodes.map((node, index) => {
                const nodeType = getNodeType(node);
                const style = node.style || {};

                return {
                    step_id: node.id,
                    name: "form",
                    type: nodeType,
                    color: style.background || '#ffffff',
                    role: nodeType === 'role' ? node.data.label : null,
                    status: nodeType === 'state' ? node.data.label : null,
                    action: nodeType === 'action' ? node.data.label : null,
                    sequence: index + 1,
                    metadata: {
                        position: node.position,
                        style: style,
                        type: node.type,
                    }
                };
            });

            // --- FIXED TRANSITIONS EXTRACTION ---
            // Helper function to find the previous status in the workflow chain
            const findPreviousStatus = (currentNodeId, processedEdges = new Set()) => {
                // Prevent infinite loops
                if (processedEdges.has(currentNodeId)) {
                    return 'draft'; // Fallback to draft
                }
                processedEdges.add(currentNodeId);

                // Find edges that lead TO this node
                const incomingEdges = edges.filter(e => e.target === currentNodeId);

                for (const inEdge of incomingEdges) {
                    const sourceNode = nodes.find(n => n.id === inEdge.source);
                    if (!sourceNode) continue;

                    const sourceType = getNodeType(sourceNode);

                    // If source is a status node, that's our previous status
                    if (sourceType === 'state') {
                        return sourceNode.data.label;
                    }

                    // If source is a role, look further back
                    if (sourceType === 'role') {
                        const prevStatus = findPreviousStatus(sourceNode.id, processedEdges);
                        if (prevStatus) return prevStatus;
                    }
                }

                // If no previous status found, default to 'draft'
                return 'draft';
            };

            const extractedTransitions = edges.map((edge, index) => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                const targetNode = nodes.find(n => n.id === edge.target);

                if (!sourceNode || !targetNode) {
                    console.error(`Missing node for edge ${edge.id}`);
                    return null;
                }

                const sourceType = getNodeType(sourceNode);
                const targetType = getNodeType(targetNode);

                console.log(`\n--- Processing Edge ${index + 1}: ${edge.id} ---`);
                console.log(`Source: ${sourceNode.data.label} (${sourceType})`);
                console.log(`Target: ${targetNode.data.label} (${targetType})`);
                console.log(`Edge Label: "${edge.label || '(none)'}"`);

                // Determine action label
                let actionLabel = edge.label || 'proceed';

                // Check if there's an action node in the flow
                // Action typically comes from edge label or from a connecting action node
                if (sourceType === 'action') {
                    actionLabel = sourceNode.data.label;
                } else if (edge.label) {
                    actionLabel = edge.label;
                }

                // FIXED: Properly extract from_role, from_status, to_role, to_status
                let fromRole = null;
                let fromStatus = null;
                let toRole = null;
                let toStatus = null;

                // FROM node analysis
                if (sourceType === 'role') {
                    fromRole = sourceNode.data.label;
                    // For role nodes, find the previous status in the chain
                    fromStatus = findPreviousStatus(sourceNode.id);
                } else if (sourceType === 'state') {
                    fromStatus = sourceNode.data.label;
                }

                // TO node analysis
                if (targetType === 'role') {
                    toRole = targetNode.data.label;
                } else if (targetType === 'state') {
                    toStatus = targetNode.data.label;
                }

                // FILTER OUT REDUNDANT TRANSITIONS:
                // Skip "proceed" transitions from status to role (they're just visual flow)
                // We only need role → status transitions (actual actions)
                const isRedundantProceed = (
                    sourceType === 'state' &&
                    targetType === 'role' &&
                    (actionLabel === 'proceed' || actionLabel.toLowerCase() === 'proceed')
                );

                if (isRedundantProceed) {
                    console.log(`Skipping redundant transition: ${edge.id} (${sourceNode.data.label} → ${targetNode.data.label})`);
                    return null; // Skip this transition
                }

                return {
                    transition_id: edge.id,
                    from_step_id: edge.source,
                    to_step_id: edge.target,
                    action_label: actionLabel,
                    from_role: fromRole,
                    from_status: fromStatus,
                    to_role: toRole,
                    to_status: toStatus,
                    sequence: index + 1,
                    metadata: {
                        type: edge.type,
                        markerEnd: edge.markerEnd,
                        animated: edge.animated,
                        sourceType: sourceType,
                        targetType: targetType
                    }
                };
            }).filter(t => t !== null);

            console.log('\n=== WORKFLOW SAVE SUMMARY ===');
            console.log(`Total Edges: ${edges.length}`);
            console.log(`Transitions to Save: ${extractedTransitions.length}`);
            console.log('\nTransitions Being Saved:');
            extractedTransitions.forEach((t, i) => {
                console.log(`${i + 1}. ${t.from_role || t.from_status} → ${t.to_role || t.to_status} [${t.action_label}]`);
            });
            console.log('=========================\n');

            const userInfo = JSON.parse(localStorage.getItem('user-info'));
            const token = userInfo?.token;

            const url = workflowId
                ? `${BASE_URL}/api/workflows/${workflowId}`
                : `${BASE_URL}/api/workflows`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    form_id: selectedForm,
                    name: workflowName,
                    steps: JSON.stringify(flow),
                    step_workflows: extractedSteps,
                    workflow_transitions: extractedTransitions
                }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Workflow saved successfully!');
                if (data.id) setWorkflowId(data.id);
            } else {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                alert('Failed to save workflow: ' + (errorData.message || 'Unknown error'));
            }

        } catch (err) {
            console.error('Save error:', err);
            alert('Error saving workflow: ' + err.message);
        }
    };

    const onDragStart = (event, shape, label, color) => {
        event.dataTransfer.setData('application/shape', shape);
        event.dataTransfer.setData('application/label', label);
        event.dataTransfer.setData('application/color', color);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <CContainer fluid>
            <CRow>
                {/* Unified Sidebar Palette */}
                <CCol md={2} className="bg-light p-3 border-end" style={{ height: '92vh', overflowY: 'auto' }}>
                    <h5 className="mb-4">Workflow Palette</h5>

                    {/* 1. ROLES */}
                    <div className="text-uppercase text-muted small fw-bold mb-3 mt-2">1. The &quot;Who&quot; (Roles)</div>
                    <div
                        className="mb-3 p-2 border-2 rounded bg-white text-center shadow-sm"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'role', 'New Role', '#ffffff')}
                        style={{ cursor: 'grab', border: '2px solid #333', fontWeight: '800' }}
                    >
                        <CIcon icon={cilUser} className="me-2" /> Role Node
                    </div>

                    {/* 2. ACTIONS */}
                    <div className="text-uppercase text-muted small fw-bold mb-3 mt-4">2. The &quot;What&quot; (Actions)</div>
                    <div
                        className="mb-3 p-2 border rounded-pill bg-white text-center shadow-sm"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'action', 'Action Label', '#f8f9fa')}
                        style={{ cursor: 'grab', fontSize: '13px', border: '1px solid #777' }}
                    >
                        <CIcon icon={cilCursor} className="me-2" /> Label / Action
                    </div>

                    {/* 3. STATUSES */}
                    <div className="text-uppercase text-muted small fw-bold mb-3 mt-4">3. The &quot;Where&quot; (Statuses)</div>
                    {[
                        { label: 'Draft', color: '#9CA3AF' },
                        { label: 'Pending', color: '#00CED1' },
                        { label: 'Approved', color: '#32CD32' },
                        { label: 'Rejected', color: '#FF4500' }
                    ].map(status => (
                        <div
                            key={status.label}
                            className="mb-2 p-3 border-0 text-center text-white fw-bold shadow-sm"
                            draggable
                            onDragStart={(event) => onDragStart(event, 'status', status.label, status.color)}
                            style={{
                                cursor: 'grab',
                                background: status.color,
                                borderRadius: '50%',
                                width: '100px',
                                height: '100px',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px'
                            }}
                        >
                            {status.label}
                        </div>
                    ))}
                </CCol>

                {/* Canvas Area */}
                <CCol md={7} className="p-0 bg-white">
                    <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ height: '92vh' }}>
                        <ReactFlow
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onInit={setReactFlowInstance}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                            onNodeClick={onNodeClick}
                            onEdgeClick={onEdgeClick}
                            onPaneClick={onPaneClick}
                            snapToGrid
                            snapGrid={[15, 15]}
                            fitView
                        >
                            <MiniMap />
                            <Controls />
                            <Background color="#f0f0f0" gap={15} />
                        </ReactFlow>
                    </div>
                </CCol>

                {/* Properties Panel */}
                <CCol md={3} className="bg-white p-3 border-start shadow-sm" style={{ height: '92vh', overflowY: 'auto' }}>
                    <h4 className="mb-4">Properties</h4>

                    <div className="mb-4">
                        <CFormLabel>Workflow Name</CFormLabel>
                        <CFormInput
                            placeholder="e.g. Leave Approval Process"
                            value={workflowName}
                            onChange={(e) => setWorkflowName(e.target.value)}
                            className="border-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <CFormLabel>Linking Form</CFormLabel>
                        <CFormSelect value={selectedForm} onChange={handleFormChange} className="border-primary">
                            <option value="">-- Choose a Form --</option>
                            {forms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </CFormSelect>
                    </div>

                    <hr />

                    {selectedElement ? (
                        <CCard className="border-0 bg-light shadow-sm">
                            <CCardHeader className="bg-dark text-white fw-bold py-2">
                                {elementType === 'node' ? 'Edit Element' : 'Edit Connection'}
                            </CCardHeader>
                            <CCardBody>
                                <div className="mb-3">
                                    <CFormLabel>Label / Display Name</CFormLabel>
                                    {elementType === 'node' && getNodeType(selectedElement) === 'role' ? (
                                        <CFormSelect
                                            value={editLabel}
                                            onChange={(e) => setEditLabel(e.target.value)}
                                            className="bg-white"
                                        >
                                            <option value="">-- Select Role --</option>
                                            {roles.map(r => (
                                                <option key={r.id} value={r.name}>{r.name}</option>
                                            ))}
                                        </CFormSelect>
                                    ) : (
                                        <CFormInput
                                            value={editLabel}
                                            onChange={(e) => setEditLabel(e.target.value)}
                                            className="bg-white"
                                        />
                                    )}
                                </div>

                                {elementType === 'node' && (
                                    <div className="mb-3">
                                        <CFormLabel>Fill Color</CFormLabel>
                                        <CFormInput
                                            type="color"
                                            value={editColor}
                                            onChange={(e) => setEditColor(e.target.value)}
                                            className="p-1 w-100 h-100"
                                            style={{ minHeight: '40px' }}
                                        />
                                    </div>
                                )}

                                <div className="d-grid gap-2 mt-4">
                                    <CButton color="primary" onClick={handleUpdate}>Apply Changes</CButton>
                                    <CButton color="danger" variant="outline" onClick={deleteSelected}>Remove item</CButton>
                                </div>
                            </CCardBody>
                        </CCard>
                    ) : (
                        <div className="text-center text-muted p-5 border-2 border-dashed rounded bg-light">
                            <CIcon icon={cilCursor} size="xl" className="mb-2" />
                            <p>Select a Role, Action or Status on the map to modify its properties.</p>
                        </div>
                    )}

                    <div className="mt-auto pt-5 d-grid">
                        <CButton color="success" size="lg" onClick={saveWorkflow} className="fw-bold shadow">
                            <CIcon icon={cilCheckCircle} className="me-2" />
                            SAVE WORKFLOW
                        </CButton>
                    </div>
                </CCol>
            </CRow>
        </CContainer>
    );
};

export default Workflow;