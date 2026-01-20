import { React, useState, useEffect } from 'react'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import moment from 'moment'
import { Modal, Button, Form, Select, Radio, Space } from 'antd'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert';

const BASE_URL = process.env.REACT_APP_BASE_URL

const TaskAssignmentUserSide = () => {
  const ITEMS_PER_PAGE = 10
  //CSS Styling
  const mystyle = {
    color: 'white',
    backgroundColor: '#0070FF ',
    padding: '15px',
    fontFamily: 'Arial',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const mystyle2 = {
    backgroundColor: 'white ',
  }

  const modalStyle2 = {
    position: "fixed",
    top: "80%",
    left: "55%",
    transform: "translateX(-50%)",
  }

  const local = JSON.parse(localStorage.getItem('user-info'))
  const session = JSON.parse(sessionStorage.getItem('user-info'))
  const team_lead_id = local.Users.id;
  const session_token = session.token

  //States
  const [user_id, setUserId] = useState('')
  const [project_id, setProjectId] = useState('')
  const [task_id, setTaskId] = useState()
  const [project_name, setProjectName] = useState('')
  const [user_name, setUserName] = useState('')
  const [task_description, setTaskDescription] = useState('')
  const [teamlead_name, setTeamleadName] = useState()
  const [start_date, setStartDate] = useState('')
  const [dead_line, setDeadLine] = useState('')
  const [taskPriority, setTaskPriority] = useState()
  const [taskStatus, setTaskStatus] = useState()
  const [taskComment, setTaskComment] = useState()


  const [isPendingTasksTab, setIsPendingTasksTab] = useState(true)
  const [isInProgressTasksTab, setIsInProgressTasksTab] = useState(false)
  const [isCompletedTaskTab, setIsCompletedTasksTab] = useState(false)

  const [pendingTasks, setPendingTasks] = useState([])
  const [inProgressTasks, setInProgressTasks] = useState([])
  const [completedTask, setCompletedTasks] = useState([])

  const [currentPagePending, setCurrentPagePending] = useState(1)
  const [totalItemsPending, setTotalItemsPending] = useState(0)
  const [currentItemsPending, setCurrentItemsPending] = useState([])

  const [currentPageInProgress, setCurrentPageInProgress] = useState(1)
  const [totalItemsInProgress, setTotalItemsInProgress] = useState(0)
  const [currentItemsInProgress, setCurrentItemsInProgress] = useState([])

  const [currentPageCompleted, setCurrentPageCompleted] = useState(1)
  const [totalItemsCompleted, setTotalItemsCompleted] = useState(0)
  const [currentItemsCompleted, setCurrentItemsCompleted] = useState([])


  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [messages, setMessages] = useState([]);




  const [projects, setProjects] = useState([])

  let [form] = Form.useForm()

  // Component is initially mounted
  useEffect(() => {
    getTasks()
    getProjects()
  }, [])

  useEffect(() => {
    setCurrentItemsPending(slicedItemsPending)
  }, [currentPagePending, pendingTasks])

  useEffect(() => {
    setCurrentItemsInProgress(slicedItemsInProgress)
  }, [currentPageInProgress, inProgressTasks])

  useEffect(() => {
    setCurrentItemsCompleted(slicedItemsCompleted)
  }, [currentPageCompleted, completedTask])

  const getProjects = async () => {
    let filteredProjects = []
    await fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 5) {
          filteredProjects = data.projects.filter(
            (project) => project.company_id === local.Users.company_id,
          )
          setProjects(filteredProjects)
        }
      })
      .catch((error) => console.log(error))
  }

  // Functions for Show Task Modal
  const [isModalOpenToTakeAction, setIsModalOpenToTakeAction] = useState(false)
  const openModalToTakeActionAgainstTask = (id) => {
    setIsModalOpenToTakeAction(true)
    setTaskId(id)
    getTaskById(id)
  }

  const updateTaskStatus = async (taskId, task_status, task_comment) => {
    let formData = new FormData()
    formData.append('id', taskId)
    formData.append('status', task_status)
    formData.append('comment', task_comment)

    await fetch(`${BASE_URL}/api/updateStatusByUserTask`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        getTasks()
        setTaskComment('')
        handleButtonClick1()
      })
      .catch((error) => {
        handleButtonClick2()
      })
  }

  async function getTasks() {
    await fetch(`${BASE_URL}/api/getTasks`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 5) {
          const filteredUsersTask = data.task.filter((user) => user.user_id === local.Users.id)
          const todoTasks = filteredUsersTask.filter((task) => task.status === 'Pending')
          const in_progressTasks = filteredUsersTask.filter((task) => task.status === 'InProgress')
          const doneTasks = filteredUsersTask.filter((task) => task.status === 'Completed')
          setPendingTasks(todoTasks)
          setInProgressTasks(in_progressTasks)
          setCompletedTasks(doneTasks)
          setTotalItemsPending(todoTasks.length)
          setTotalItemsInProgress(in_progressTasks.length)
          setTotalItemsCompleted(doneTasks.length)
        }
      })
      .catch((error) => console.log(error))
  }

  const getTaskById = async (id) => {
    if (!id) {
      console.error('Task ID is missing')
      return
    }

    if (!session_token) {
      console.error('Authorization token is missing. Please login again.')
      return
    }

    // console.log('Fetching task with ID:', id)
    // console.log('API URL:', `${BASE_URL}/api/getTaskById/${id}`)
    // console.log('Token available:', session_token ? 'Yes' : 'No')

    try {
      const response = await fetch(`${BASE_URL}/api/getTaskById/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session_token}`,
        },
      })

      // console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('API Error Response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      // console.log('API Response Data:', data)

      if (!data || !data.task) {
        console.error('Task data not found in response. Response structure:', data)
        return
      }

      console.log('Task data:', data.task)

      // Set all the state values
      setUserId(data.task.user_id || '')
      setUserName(data.task.name || '')
      setProjectId(data.task.project_id || '')
      setProjectName(data.task.project_name || '')
      setTaskDescription(data.task.task_description || '')
      setTaskPriority(data.task.priorites || 'LOW')
      setTaskId(data.task.task_managements_id || '')
      setTaskStatus(data.task.status || '')
      setTaskComment(data.task.comment || '')


      if (data.task.comments) { // if comments are available, set the messages

        const mappedMessages = data.task.comments.map((comment) => ({
          id: comment.id || comment.comment_id || comment.task_comment_id,
          text: comment.comment,
          sender:
            comment.user_id === data.task.team_lead_id ? 'admin' : 'user',
          user_name: comment.user.name,
        }));


        // console.log('Mapped messages:', mappedMessages); // Debug: see mapped structure
        setMessages(mappedMessages);
      } else { // if comments are not available, set the messages as empty
        setMessages([])
      }

      // Format dates safely
      if (data.task.task_managements_start_date) {
        const formattedStartDate = moment(data.task.task_managements_start_date).format('YYYY-MM-DD')
        setStartDate(formattedStartDate)
        // console.log('Start date set:', formattedStartDate)
      } else {
        setStartDate('')
      }

      if (data.task.task_managements_dead_line) {
        const formattedDeadLine = moment(data.task.task_managements_dead_line).format('YYYY-MM-DD')
        setDeadLine(formattedDeadLine)
        // console.log('Deadline set:', formattedDeadLine)
      } else {
        setDeadLine('')
      }

      // console.log('Task data loaded successfully')
    } catch (error) {
      console.error('Error fetching task by ID:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
  }


 
 
 
 
 
  const handleAddComment =  async () => {
    // Prevent empty comments
    if (!taskComment.trim()) {
      alert("Please write a comment before adding.");
      return;
    }

    try {
  
      const response = await fetch(
        `${BASE_URL}/api/updateStatusByUserTask`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session_token}`,
          },
          body: JSON.stringify({
            id: task_id,
            status: taskStatus, // keep same or update
            comment: taskComment,
          }),
        }
      );
  
      const data = await response.json();
  
      if (response.ok) {
        // ✅ Update UI after DB success
        getTaskById(task_id);
        
  
        setTaskComment(""); // clear input
      } else {
        console.error("API error:", data);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

 // Open modal only for user comments
 const handleCommentClick = (index) => {
  console.log('Comment clicked:', index)
  if (messages[index].sender === "admin") {
    const commentId = messages[index].id;
    setSelectedIndex(commentId); // Store the comment ID, not the index
    // console.log('Selected comment ID: ', commentId)
    setShowAdminModal(true);
  } 
};

// Confirm delete
const handleDeleteComment = async () => {
  if (!selectedIndex) {
    console.error('No comment ID selected for deletion');
    setShowAdminModal(false);
    return;
  }

  try {
    // console.log('Deleting comment with ID:', selectedIndex);
    
    const response = await fetch(
      `${BASE_URL}/api/task-comment/${selectedIndex}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      // ✅ Remove from UI after DB delete
      getTaskById(task_id);
      setSelectedIndex(null); // Clear the selected index
      setShowAdminModal(false);
    } else {
      console.error("Delete failed:", data.message || data);
      alert(`Failed to delete comment: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Delete error:", error);
    alert('Error deleting comment. Please try again.');
  }
};


// Cancel delete
const handleCancelComment = () => {
  setSelectedIndex(null); // Clear the selected index
  setShowAdminModal(false);
};









  const getTaskByProjectChange = async (projectId) => {
    await fetch(`${BASE_URL}/api/getTaskByProjectId/${projectId}`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 5) {
          const filteredUsersTask = data.task.filter((user) => user.user_id === local.Users.id)
          const todoTasks = filteredUsersTask.filter((task) => task.status === 'Pending')
          const in_progressTasks = filteredUsersTask.filter((task) => task.status === 'InProgress')
          const doneTasks = filteredUsersTask.filter((task) => task.status === 'Completed')
          setPendingTasks(todoTasks)
          setInProgressTasks(in_progressTasks)
          setCompletedTasks(doneTasks)
          setTotalItemsPending(todoTasks.length)
          setTotalItemsInProgress(in_progressTasks.length)
          setTotalItemsCompleted(doneTasks.length)
        }
      })
      .catch((error) => console.log(error))
  }

  const clearFilters = async () => {
    form.resetFields()
    getTasks()
  }

  const changeTab = (e) => {
    if (e.target.value === 'Completed') {
      setIsPendingTasksTab(false)
      setIsInProgressTasksTab(false)
      setIsCompletedTasksTab(true)
    } else if (e.target.value === 'InProgress') {
      setIsPendingTasksTab(false)
      setIsInProgressTasksTab(true)
      setIsCompletedTasksTab(false)
    } else {
      setIsPendingTasksTab(true)
      setIsInProgressTasksTab(false)
      setIsCompletedTasksTab(false)
    }
  }

  const handleOkToTakeActionAgainstTask = async () => {
    updateTaskStatus(task_id, taskStatus, taskComment)
    setIsModalOpenToTakeAction(false)
  }

  const handleCancelToTakeActionAgainstTask = async () => {
    setTaskComment('')
    setIsModalOpenToTakeAction(false)
  }

  const handleFilterTaskOnProjectChange = (projectId) => {
    getTaskByProjectChange(projectId)
  }

  //------------------
  // Pagination logic
  //------------------
  // Pagination for Pending task table
  const indexOfLastItemPending = currentPagePending * ITEMS_PER_PAGE
  const indexOfFirstItemPending = indexOfLastItemPending - ITEMS_PER_PAGE
  const slicedItemsPending = pendingTasks.slice(indexOfFirstItemPending, indexOfLastItemPending)

  // Pagination for In-progress task table
  const indexOfLastItemInProgress = currentPageInProgress * ITEMS_PER_PAGE
  const indexOfFirstItemInProgress = indexOfLastItemInProgress - ITEMS_PER_PAGE
  const slicedItemsInProgress = inProgressTasks.slice(
    indexOfFirstItemInProgress,
    indexOfLastItemInProgress,
  )

  // Pagination for Completed task table
  const indexOfLastItemCompleted = currentPageCompleted * ITEMS_PER_PAGE
  const indexOfFirstItemCompleted = indexOfLastItemCompleted - ITEMS_PER_PAGE
  const slicedItemsCompleted = completedTask.slice(
    indexOfFirstItemCompleted,
    indexOfLastItemCompleted,
  )

  // Handle page change
  const handlePendingTaskPageChange = (pageNumber) => {
    setCurrentPagePending(pageNumber)
  }

  // Handle page change
  const handleInProgressTaskPageChange = (pageNumber) => {
    setCurrentPageInProgress(pageNumber)
  }

  // Handle page change
  const handleCompletedTaskPageChange = (pageNumber) => {
    setCurrentPageCompleted(pageNumber)
  }

  //Priorty Color Change
  const getPriorityColor = (priority) => {
    if (priority === 'HIGH') {
      return 'red'
    } else if (priority === 'MEDIUM') {
      return 'green'
    } else {
      return 'blue'
    }
  }

  // Functions for Status Change Success
  const [showAlert1, setShowAlert1] = useState(false);

  function handleButtonClick1() {
    setShowAlert1(true);
  }

  function handleCloseAlert1() {
    setShowAlert1(false);
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert1]);

  // Functions for Status Change Failure
  const [showAlert2, setShowAlert2] = useState(false);

  function handleButtonClick2() {
    setShowAlert2(true);
  }

  function handleCloseAlert2() {
    setShowAlert2(false);
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showAlert2]);

  return (
    <>
      <div className="row">
        <div className="col-md 6">
          <h3>Assigned Tasks: {totalItemsPending + totalItemsInProgress + totalItemsCompleted}</h3>
        </div>
      </div>
      <hr />
      <div className="row">
        <Box className="col-md-4">
          <Space
            style={{
              marginBottom: 24,
            }}
          >
            <Radio.Group onChange={changeTab}>
              <Radio.Button value="Pending">To Do</Radio.Button>
              <Radio.Button value="InProgress">In-Progress</Radio.Button>
              <Radio.Button value="Completed">Done</Radio.Button>
            </Radio.Group>
          </Space>
        </Box>
        <Box className="col-md-4">
          <Form form={form}>
            <Form.Item name="select" hasFeedback>
              <Select
                placeholder="SELECT PROJECT"
                onChange={handleFilterTaskOnProjectChange}
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {projects.map((project) => (
                  <Select.Option value={project.id} key={project.id}>
                    {project.project_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
        </Box>
        <Box className="col-md-4">
          <Button type="default" onClick={clearFilters}>
            Clear Filter
          </Button>
        </Box>
      </div>
      <div>
        {isPendingTasksTab === true && currentItemsPending.length > 0 ? (
          <div>
            <div className="row">
              <div className="col-md 6">
                <h4>To-Do Tasks: {totalItemsPending}</h4>
              </div>
            </div>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                {/* Task Assignment table heading */}
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task No.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Dead Line
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItemsPending.map((task, index) => (
                  <CTableRow key={task.task_managements_id}>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name} - {task.task_managements_id}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {task.team_lead_details?.name}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {new Date(task.task_managements_start_date)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        .replace(/\//g, '-')}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {new Date(task.task_managements_dead_line)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        .replace(/\//g, '-')}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{
                        ...mystyle2,
                        color: 'white',
                        backgroundColor: getPriorityColor(task.priorites), // Apply color based on priority value
                      }}
                    >
                      {task.priorites}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      <IconButton
                        aria-label="View"
                        onClick={() => openModalToTakeActionAgainstTask(task.task_managements_id)}
                      >
                        <VisibilityIcon htmlColor="#0070ff" />
                      </IconButton>
                    </CTableHeaderCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPagePending === 1}
                onClick={() => handlePendingTaskPageChange(currentPagePending - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from({ length: Math.ceil(totalItemsPending / ITEMS_PER_PAGE) }, (_, index) => (
                <CPaginationItem
                  key={index + 1}
                  active={index + 1 === currentPagePending}
                  onClick={() => handlePendingTaskPageChange(index + 1)}
                >
                  {index + 1}
                </CPaginationItem>
              ))}
              <CPaginationItem
                disabled={currentPagePending === Math.ceil(totalItemsPending / ITEMS_PER_PAGE)}
                onClick={() => handlePendingTaskPageChange(currentPagePending + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </CPaginationItem>
            </CPagination>
          </div>
        ) : (
          ''
        )}

        {isInProgressTasksTab === true && currentItemsInProgress.length > 0 ? (
          <div>
            <div className="row">
              <div className="col-md 6">
                <h4>In-Progress Tasks: {totalItemsInProgress}</h4>
              </div>
            </div>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                {/* Task Assignment table heading */}
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task No.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Dead Line
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItemsInProgress.map((task, index) => (
                  <CTableRow key={task.task_managements_id}>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name} - {task.task_managements_id}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {task.team_lead_details?.name}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {new Date(task.task_managements_start_date)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        .replace(/\//g, '-')}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {new Date(task.task_managements_dead_line)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        .replace(/\//g, '-')}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{
                        ...mystyle2,
                        color: 'white',
                        backgroundColor: getPriorityColor(task.priorites), // Apply color based on priority value
                      }}
                    >
                      {task.priorites}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      <IconButton
                        aria-label="View"
                        onClick={() => openModalToTakeActionAgainstTask(task.task_managements_id)}
                      >
                        <VisibilityIcon htmlColor="#0070ff" />
                      </IconButton>
                    </CTableHeaderCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPageInProgress === 1}
                onClick={() => handleInProgressTaskPageChange(currentPageInProgress - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from(
                { length: Math.ceil(totalItemsInProgress / ITEMS_PER_PAGE) },
                (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={index + 1 === currentPageInProgress}
                    onClick={() => handleInProgressTaskPageChange(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ),
              )}
              <CPaginationItem
                disabled={
                  currentPageInProgress === Math.ceil(totalItemsInProgress / ITEMS_PER_PAGE)
                }
                onClick={() => handleInProgressTaskPageChange(currentPageInProgress + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </CPaginationItem>
            </CPagination>
          </div>
        ) : (
          ''
        )}

        {isCompletedTaskTab === true && currentItemsCompleted.length > 0 ? (
          <div>
            <div className="row">
              <div className="col-md 6">
                <h4>Done Tasks: {totalItemsCompleted}</h4>
              </div>
            </div>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              style={{ marginTop: '20px' }}
            >
              <CTableHead color="light">
                {/* Task Assignment table heading */}
                <CTableRow>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task No.
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned by
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Project
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Assigned Date
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Dead Line
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Task Priority
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={mystyle}>
                    Actions
                  </CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItemsCompleted.map((task, index) => (
                  <CTableRow key={task.task_managements_id}>
                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name} - {task.task_managements_id}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {task.team_lead_details?.name}
                    </CTableHeaderCell>

                    <CTableHeaderCell
                      className="text-center"
                      style={{ ...mystyle2, textAlign: 'left', width: '200px' }}
                    >
                      {task.project_name}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {new Date(task.task_managements_start_date)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        .replace(/\//g, '-')}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      {new Date(task.task_managements_dead_line)
                        .toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })
                        .replace(/\//g, '-')}
                    </CTableHeaderCell>
                    <CTableHeaderCell
                      className="text-center"
                      style={{
                        ...mystyle2,
                        color: 'white',
                        backgroundColor: getPriorityColor(task.priorites), // Apply color based on priority value
                      }}
                    >
                      {task.priorites}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center" style={mystyle2}>
                      <IconButton
                        aria-label="View"
                        onClick={() => openModalToTakeActionAgainstTask(task.task_managements_id)}
                      >
                        <VisibilityIcon htmlColor="#0070ff" />
                      </IconButton>
                    </CTableHeaderCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <CPagination aria-label="Page navigation example">
              <CPaginationItem
                disabled={currentPageCompleted === 1}
                onClick={() => handleCompletedTaskPageChange(currentPageCompleted - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </CPaginationItem>
              {Array.from(
                { length: Math.ceil(totalItemsCompleted / ITEMS_PER_PAGE) },
                (_, index) => (
                  <CPaginationItem
                    key={index + 1}
                    active={index + 1 === currentPageCompleted}
                    onClick={() => handleCompletedTaskPageChange(index + 1)}
                  >
                    {index + 1}
                  </CPaginationItem>
                ),
              )}
              <CPaginationItem
                disabled={currentPageCompleted === Math.ceil(totalItemsCompleted / ITEMS_PER_PAGE)}
                onClick={() => handleCompletedTaskPageChange(currentPageCompleted + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">»</span>
              </CPaginationItem>
            </CPagination>
          </div>
        ) : (
          ''
        )}
      </div>
      <div>
        <Modal
          title={<div style={{ textAlign: 'center' }}>Task Details</div>}
          open={isModalOpenToTakeAction}
          centered
          onOk={handleOkToTakeActionAgainstTask}
          okButtonProps={{ style: { background: 'blue' } }}
          onCancel={handleCancelToTakeActionAgainstTask}
          maskClosable={false}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '5px 20px' }}>
                <div>
                  <b>Details:</b>
                  <p>{task_description}</p>
                </div>
                <div>
                  <b>Projects:</b>
                  <p>{project_name}</p>
                </div>
                <div>
                  <b>Priority:</b>
                  <p>{taskPriority}</p>
                </div>
                <div>
                  <b>Assigned by:</b>
                  <p>{teamlead_name}</p>
                </div>
                <div>
                  <b>Assigned Date:</b>
                  <p>{moment(start_date).format('DD-MM-YYYY')}</p>
                </div>
                <div>
                  <b>Completion Dead Line:</b>
                  <p>{moment(dead_line).format('DD-MM-YYYY')}</p>
                </div>
              </div>

              <hr />
              <div style={{ width: '100%' }}>
                <div style={{ marginBottom: '10px' }}>
                  <label>Status:</label>
                  <Form.Item>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select Task Status"
                      onChange={(value) => setTaskStatus(value)}
                      value={taskStatus}
                    >
                      <Select.Option value="Pending" key="Pending">
                        Pending
                      </Select.Option>
                      <Select.Option value="InProgress" key="InProgress">
                        In-Progress
                      </Select.Option>
                      <Select.Option value="Completed" key="Completed">
                        Completed
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </div>




                {/* Add Comment  */}
                <div>
                  <label>Add Comments Related to the Task:</label>

                  {/* Display Messages */}
                  <div
                    className="mt-3 border p-2"
                    style={{ borderRadius: "2%", height: "200px", overflowY: "auto" }}
                  >
                    {messages.length > 0 ? (
                      messages.map((message, index) => (
                        <div
                          key={index}
                          className={`d-flex mb-2 ${message.sender === "user"
                            ? "justify-content-end"
                            : "justify-content-start"
                            }`}
                          onClick={() => handleCommentClick(index)}
                          style={{ cursor: message.sender === "user" ? "pointer" : "default" }}
                        >
                          <div
                            className={`p-2 rounded ${message.sender === "user"
                              ? "bg-success text-white"
                              : "bg-light border"
                              }`}
                            style={{ maxWidth: "75%" }}
                          >
                            <small className="fw-bold d-block">
                              {message.sender === "user" ? "You" : message.user_name || "Admin"}
                            </small>
                            <span>{message.text}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted text-center mb-0">No comments yet</p>
                    )}
                  </div>




                  {/* Comment Input */}
                  <textarea
                    rows="2"
                    className="form-control mt-2"
                    placeholder="Write your comment here..."
                    value={taskComment}
                    onChange={(e) => setTaskComment(e.target.value)}
                  />

                  <button
                    type="button"
                    className="btn btn-primary mt-2 bg-success"
                    onClick={handleAddComment}
                  >
                    Add Comment
                  </button>
                </div>



                {showAdminModal && (
                  <>
                    <div className="modal fade show d-block" tabIndex={-1}>
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Delete Comment</h5>
                            <button
                              type="button"
                              className="btn-close"
                              onClick={handleCancelComment}
                            ></button>
                          </div>
                          <div className="modal-body">
                            Are you sure you want to delete this comment?
                          </div>
                          <div className="modal-footer">
                            <button
                              className="btn btn-secondary"
                              onClick={handleCancelComment}
                            >
                              Cancel
                            </button>
                            <button className="btn btn-danger" onClick={handleDeleteComment}>
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="modal-backdrop fade show"
                      onClick={handleCancelComment}
                    ></div>
                  </>
                )}





              </div>
            </div>
          </div>
        </Modal>

        {/* Alert for Status Change Success*/}
        {showAlert1 && (
          <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
            Task Status Changed Successfully
          </Alert>
        )}

        {/* Alert for Status Change Failure*/}
        {showAlert2 && (
          <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
            Failed to Change Task Status
          </Alert>
        )}

      </div>
    </>
  )
}

export default TaskAssignmentUserSide
