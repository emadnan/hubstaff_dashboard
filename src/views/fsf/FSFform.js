import { React, useState, useEffect, useRef } from 'react'
import { Modal, Form, Select } from 'antd'
import {
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CTable,
} from '@coreui/react'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Alert from '@mui/material/Alert'
import { useNavigate } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'

import { Card, CardContent, MenuItem, Button } from '@mui/material'
import { Box, TextField, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
const BASE_URL = process.env.REACT_APP_BASE_URL

function FSFform() {
  const local = JSON.parse(localStorage.getItem('user-info'))

  //Variable declarations
  const [fsfdescription, setFsfDescription] =  useState('')
  const [reference_id, setReferenceId] = useState('')
  const [module_id, setModuleId] = useState('')
  const [moduleName, setModuleName] = useState('')
  const [project_id, setProjectId] = useState('')
  const [projectName, setProjectName] = useState('')
  const [functional_lead_id, setFunctionalLeadId] = useState(local.Users.id)
  const [ABAP_team_lead_id, setABAPTeamLeadId] = useState('')
  const [wricef_id, setWRicefId] = useState('')
  const [type_of_development, setTypeOfDevelopment] = useState('')
  const [requested_date, setRequestedDate] = useState('')
  const [priority, setPriority] = useState('')
  const [usage_frequency, setUsageFrequency] = useState('')
  const [transaction_code, setTransactionCode] = useState('')
  const [authorization_role, setAuthorizationRole] = useState('')
  const [development_logic, setDevelopmentLogic] = useState('')
  const [attachment, setAttachment] = useState(null)

  const [fsf_id, setFsfId] = useState('')
  const [description, setDescription] = useState('')
  const [input_parameter_name, setInputParameterName] = useState('')
  const [output_parameter_name, setOutputParameterName] = useState('')
  const [field_technical_name, setFieldTechnicalName] = useState('')
  const [field_length, setFieldLength] = useState('')
  const [field_type, setFieldType] = useState('')
  const [field_table_name, setFieldTableName] = useState('')
  const [mandatory_or_optional, setMandatoryOrOptional] = useState('')
  const [parameter_or_selection, setParameterOrSelection] = useState('')

  const [project, setProjects] = useState([])
  const [fsfHasInputParameter, setFsfHasInputParameter] = useState([])
  const [fsfHasOutputParameter, setFsfHasOutputParameter] = useState([])
  const [ref_id, setRef_id] = useState()
  const [users, setUsers] = useState([])
  const [teamlead, setTeamLeads] = useState([])
  const [projectmodule, setProjectModule] = useState([])
  const [fsfwricef, setFsfWricef] = useState([])
  const [fsf_input, setFsfInput] = useState([])
  const [fsf_output, setFsfOutput] = useState([])
  var filteredUsers = []

  const navigate = useNavigate()

  const [isFocused, setIsFocused] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageError, setImageError] = useState(false)
  const [selectedImage2, setSelectedImage2] = useState(null)
  const [imageError2, setImageError2] = useState(false)
  // const [selectedImage3, setSelectedImage3] = useState(null);
  const [imageError3, setImageError3] = useState(false)

  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    const formattedDate = `${year}-${month}-${day}`
    return formattedDate
  }

  const fileInputRef = useRef(null)
  const fileInputRef2 = useRef(null)
  const fileInputRef3 = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target.result)
        setImageError(false)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImage(null)
      setImageError(true)
    }
  }

  const handleFileUpload2 = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage2(event.target.result)
        setImageError2(false)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedImage2(null)
      setImageError2(true)
    }
  }

  const handleFileUpload3 = (event) => {
    const file = event.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAttachment(event.target.result)
        setImageError3(false)
      }
      reader.readAsDataURL(file)
    } else {
      setAttachment(null)
      setImageError3(true)
    }
  }

  useEffect(() => {
    const currentDate = getCurrentDate();
    setRequestedDate(currentDate);
    
    // const uniqueNumber = Math.floor(Math.random() * 1000);
    const concatenatedId = `Biafo-${projectName}-${moduleName}`;
    setWRicefId(concatenatedId);
  }, [projectName, moduleName]);
  

  const editorConfig = {
    height: 200,
    menubar: 'file edit view insert format',
    plugins: [
      'advlist autolink lists image charmap print preview',
      'searchreplace visualblocks code fullscreen',
      'insertdatetime  paste code help wordcount',
    ],
    toolbar: `undo redo | formatselect | bold italic backcolor |
      alignleft aligncenter alignright alignjustify |
      bullist numlist outdent indent | removeformat | help`,
    file_picker_types: 'file image media',
    file_picker_callback: function (callback, value, meta) {
      const input = document.createElement('input')
      input.setAttribute('type', 'file')
      input.setAttribute('accept', 'image/*')
      input.onchange = function () {
        const file = this.files[0]
        const reader = new FileReader()
        reader.onload = function () {
          // Pass the image URL to the callback function
          callback(reader.result)
        }
        reader.readAsDataURL(file)
      }
      input.click()
    },
  }

  const handleEditorChange = (content, editor) => {
    const regex = /<img.*?src="(.*?)"/g
    const matches = [...content.matchAll(regex)]

    const images = matches.map((match) => {
      const base64Data = match[1].split(',')[1]
      return `data:image/png;base64,${base64Data}`
    })

    imageToLink(content, images)
  }

  const [formErrors, setFormErrors] = useState({
    fsfdescription: '',
    reference_id: '',
    module_id: '',
    project_id: '',
    type_of_development: '',
    ABAP_team_lead_id: '',
    requested_date: '',
    priority: '',
    usage_frequency: '',
    transaction_code: '',
    authorization_role: '',
    development_logic: '',
    input_parameter_name: '',
    output_parameter_name: '',
    description: '',
    field_technical_name: '',
    field_length: '',
    field_type: '',
    field_table_name: '',
    mandatory_or_optional: '',
    parameter_or_selection: '',
  })

  const handleFocus = (e) => {
    const { name } = e.target

    setFormErrors((prevFormErrors) => ({
      ...prevFormErrors,
      [name]: '',
    }))
  }

  //CSS Styling
  const [isHoveredPrimary, setIsHoveredPrimary] = useState(false)

  const [isHoveredDanger, setIsHoveredDanger] = useState(false)

  const [isHoveredSuccess, setIsHoveredSuccess] = useState(false)

  const mystyle = {
    color: 'black',
    backgroundColor: 'white',
    padding: '15px',
    textAlign: 'center',
    alignSelf: 'flex-end',
  }

  const buttonStyle = {
    float: 'right',
    padding: '2px',
    width: '120px',
    backgroundColor: '#0070ff',
    fontWeight: 'bold',
    color: 'white',
  }

  const modalStyle2 = {
    position: 'fixed',
    top: '80%',
    left: '55%',
    transform: 'translateX(-50%)',
  }

  const handleInputFocus = () => {
    setIsFocused(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
  }

  const primaryButtonStyle = {
    backgroundColor: isHoveredPrimary ? '#6699CC' : 'blue',
    color: 'white',
    transition: 'background-color 0.3s',
  }

  const dangerButtonStyle = {
    backgroundColor: isHoveredDanger ? '#FAA0A0' : 'red',
    color: 'white',
    transition: 'background-color 0.3s',
  }

  const successButtonStyle = {
    backgroundColor: isHoveredSuccess ? '#90EE90' : 'green',
    color: 'white',
    transition: 'background-color 0.3s',
  }

  const handleMouseEnterPrimary = () => {
    setIsHoveredPrimary(true)
  }

  const handleMouseLeavePrimary = () => {
    setIsHoveredPrimary(false)
  }

  const handleMouseEnterDanger = () => {
    setIsHoveredDanger(true)
  }

  const handleMouseLeaveDanger = () => {
    setIsHoveredDanger(false)
  }

  const handleMouseEnterSuccess = () => {
    setIsHoveredSuccess(true)
  }

  const handleMouseLeaveSuccess = () => {
    setIsHoveredSuccess(false)
  }

  //GET calls handling
  const handleModuleChange = (value, option) => {
    setModuleId(value)
    setModuleName(option.module_name)
  }

  const handleProjectChange = (value, option) => {
    setProjectId(value)
    setProjectName(option.project_name)
  }

  const handleTypeOfDevelopmentChange = (value) => {
    setTypeOfDevelopment(value)
  }

  const handleFunctionalLeadChange = (value) => {
    setFunctionalLeadId(value)
  }

  const handleReferenceIdChange = (value) => {
    setReferenceId(value)
  }

  const handleAbapTeamLeadId = (value) => {
    setABAPTeamLeadId(value)
  }

  const handlePriorityChange = (value) => {
    setPriority(value)
  }

  const handleUsageFrequencyChange = (value) => {
    setUsageFrequency(value)
  }

  const handleMandatoryOrOptionalChange = (value) => {
    setMandatoryOrOptional(value)
  }

  const handleParameterOrSelection = (value) => {
    setParameterOrSelection(value)
  }

  // Functions of Add Input Parameter Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    const errors = {}
    if (!input_parameter_name) {
      errors.input_parameter_name = 'Input Parameter Name is required'
    }
    if (!description) {
      errors.description = 'Description is required'
    }
    if (!field_technical_name) {
      errors.field_technical_name = 'Field Technical Name is required'
    }
    if (!field_length) {
      errors.field_length = 'Field Length is required'
    }
    if (!field_type) {
      errors.field_type = 'Field Type is required'
    }
    if (!field_table_name) {
      errors.field_table_name = 'Field Table Name is required'
    }
    if (!mandatory_or_optional) {
      errors.mandatory_or_optional = 'Selection is required'
    }
    if (!parameter_or_selection) {
      errors.parameter_or_selection = 'Selection is required'
    }
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      addInputParameter()
      setIsModalOpen(false)
      setInputParameterName('')
      setDescription('')
      setFieldTechnicalName('')
      setFieldLength('')
      setFieldType('')
      setFieldTableName('')
      setMandatoryOrOptional('')
      setParameterOrSelection('')
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setInputParameterName('')
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  // Functions of Add Output Parameter Modal
  const [isModalOpen2, setIsModalOpen2] = useState(false)
  const showModal2 = () => {
    setIsModalOpen2(true)
  }

  const handleOk2 = () => {
    const errors = {}
    if (!output_parameter_name) {
      errors.output_parameter_name = 'Output Parameter Name is required'
    }
    if (!description) {
      errors.description = 'Description is required'
    }
    if (!field_technical_name) {
      errors.field_technical_name = 'Field Technical Name is required'
    }
    if (!field_length) {
      errors.field_length = 'Field Length is required'
    }
    if (!field_type) {
      errors.field_type = 'Field Type is required'
    }
    if (!field_table_name) {
      errors.field_table_name = 'Field Table Name is required'
    }
    if (!mandatory_or_optional) {
      errors.mandatory_or_optional = 'Selection is required'
    }
    if (!parameter_or_selection) {
      errors.parameter_or_selection = 'Selection is required'
    }
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      addOutputParameter()
      setIsModalOpen2(false)
      setOutputParameterName('')
      setDescription('')
      setFieldTechnicalName('')
      setFieldLength('')
      setFieldType('')
      setFieldTableName('')
      setMandatoryOrOptional('')
      setParameterOrSelection('')
    }
  }

  const handleCancel2 = () => {
    setIsModalOpen2(false)
    setOutputParameterName('')
    setDescription('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  // Functions for Delete FSF Input Parameter Modal
  const [isModalOpen3, setIsModalOpen3] = useState(false)
  const showModal3 = (id) => {
    setIsModalOpen3(id)
  }

  const handleOk3 = () => {
    deleteFSF(isModalOpen3)
    setIsModalOpen3(false)
  }

  const handleCancel3 = () => {
    setIsModalOpen3(false)
  }

  // Functions for Update FSF Output Parameter Modal
  const [isModalOpen4, setIsModalOpen4] = useState(false)
  const showModal4 = (id) => {
    getFsfHasParameterByFsfId(id)
    setIsModalOpen4(id)
  }

  const handleOk4 = () => {
    const errors = {}
    if (!input_parameter_name) {
      errors.input_parameter_name = 'Input Parameter Name is required'
    }
    if (!description) {
      errors.description = 'Description is required'
    }
    if (!field_technical_name) {
      errors.field_technical_name = 'Field Technical Name is required'
    }
    if (!field_length) {
      errors.field_length = 'Field Length is required'
    }
    if (!field_type) {
      errors.field_type = 'Field Type is required'
    }
    if (!field_table_name) {
      errors.field_table_name = 'Field Table Name is required'
    }
    if (!mandatory_or_optional) {
      errors.mandatory_or_optional = 'Selection is required'
    }
    if (!parameter_or_selection) {
      errors.parameter_or_selection = 'Selection is required'
    }
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      updateFSF(isModalOpen4)
      setIsModalOpen4(false)
      setDescription('')
      setInputParameterName('')
      setFieldTechnicalName('')
      setFieldLength('')
      setFieldType('')
      setFieldTableName('')
      setMandatoryOrOptional('')
      setParameterOrSelection('')
    }
  }

  const handleCancel4 = () => {
    setIsModalOpen4(false)
    setDescription('')
    setInputParameterName('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  // Functions for Delete FSF Output Parameter Modal
  const [isModalOpen5, setIsModalOpen5] = useState(false)
  const showModal5 = (id) => {
    setIsModalOpen5(id)
  }

  const handleOk5 = () => {
    deleteOutputFSF(isModalOpen5)
    setIsModalOpen5(false)
  }

  const handleCancel5 = () => {
    setIsModalOpen5(false)
  }

  // Functions for Update FSF Output Parameter Modal
  const [isModalOpen6, setIsModalOpen6] = useState(false)
  const showModal6 = (id) => {
    getFsfHasOutputParameterByFsfId(id)
    setIsModalOpen6(id)
  }

  const handleOk6 = () => {
    const errors = {}
    if (!output_parameter_name) {
      errors.output_parameter_name = 'Output Parameter Name is required'
    }
    if (!description) {
      errors.description = 'Description is required'
    }
    if (!field_technical_name) {
      errors.field_technical_name = 'Field Technical Name is required'
    }
    if (!field_length) {
      errors.field_length = 'Field Length is required'
    }
    if (!field_type) {
      errors.field_type = 'Field Type is required'
    }
    if (!field_table_name) {
      errors.field_table_name = 'Field Table Name is required'
    }
    if (!mandatory_or_optional) {
      errors.mandatory_or_optional = 'Selection is required'
    }
    if (!parameter_or_selection) {
      errors.parameter_or_selection = 'Selection is required'
    }
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      updateOutputFSF(isModalOpen6)
      setIsModalOpen6(false)
      setDescription('')
      setOutputParameterName('')
      setFieldTechnicalName('')
      setFieldLength('')
      setFieldType('')
      setFieldTableName('')
      setMandatoryOrOptional('')
      setParameterOrSelection('')
    }
  }

  const handleCancel6 = () => {
    setIsModalOpen6(false)
    setDescription('')
    setOutputParameterName('')
    setFieldTechnicalName('')
    setFieldLength('')
    setFieldType('')
    setFieldTableName('')
    setMandatoryOrOptional('')
    setParameterOrSelection('')
  }

  //DIV handlings
  const [showLevel1, setShowLevel1] = useState(true)
  const [showLevel2, setShowLevel2] = useState(false)
  const [showLevel3, setShowLevel3] = useState(false)
  const [showLevel4, setShowLevel4] = useState(false)
  const [showLevel5, setShowLevel5] = useState(false)
  const [showLevel6, setShowLevel6] = useState(false)
  const [showLevel7, setShowLevel7] = useState(false)

  const handleNext1 = () => {
    const errors = {}
    if (!fsfdescription) {
      errors.fsfdescription = 'Fsf Description is required'
    }
    if (!reference_id) {
      errors.reference_id = 'Reference Id is required'
    }
    if (!module_id) {
      errors.module_id = 'Module Name is required'
    }
    if (!project_id) {
      errors.project_id = 'Project Name is required'
    }
    if (!type_of_development) {
      errors.type_of_development = 'Type of Development is required'
    }
    setFormErrors(errors)
    if (Object.keys(errors).length === 0) {
      setShowLevel1(false)
      setShowLevel2(true)
    }

    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack2 = () => {
    setShowLevel2(false)
    setShowLevel1(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext2 = () => {
    const errors = {}
    if (!ABAP_team_lead_id) {
      errors.ABAP_team_lead_id = 'ABAP Team Lead is required'
    }
    if (!requested_date) {
      errors.requested_date = 'Requested Date is required'
    }
    if (!priority) {
      errors.priority = 'Priority is required'
    }
    if (!usage_frequency) {
      errors.usage_frequency = 'Usage Frequency is required'
    }
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      setShowLevel2(false)
      setShowLevel3(true)
    }

    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack3 = () => {
    setShowLevel3(false)
    setShowLevel2(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext3 = () => {
    const errors = {}
    if (!authorization_role) {
      errors.authorization_role = 'Development Logic is required'
    }
    if (!development_logic) {
      errors.development_logic = 'Development Logic is required'
    }
    setFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      setShowLevel3(false)
      setShowLevel4(true)
    }

    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
    addFsfForm()
  }

  const handleBack4 = () => {
    setShowLevel4(false)
    setShowLevel3(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext4 = () => {
    setShowLevel4(false)
    setShowLevel5(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack5 = () => {
    setShowLevel5(false)
    setShowLevel4(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext5 = (id) => {
    setShowLevel5(false)
    setShowLevel6(true)
    inputImagePost(id)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack6 = () => {
    setShowLevel6(false)
    setShowLevel5(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleNext6 = () => {
    setShowLevel6(false)
    setShowLevel7(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  const handleBack7 = () => {
    setShowLevel7(false)
    setShowLevel6(true)
    setIsHoveredPrimary(false)
    setIsHoveredDanger(false)
  }

  function submitHandle(id) {
    outputImagePost(id)
    handleButtonClick15()
    setTimeout(() => {
      navigate('/fsf')
    }, 2000)
  }

  // Functions for Alerts
  const [showAlert1, setShowAlert1] = useState(false)

  function handleButtonClick1() {
    setShowAlert1(true)
  }

  function handleCloseAlert1() {
    setShowAlert1(false)
  }

  useEffect(() => {
    if (showAlert1) {
      const timer = setTimeout(() => {
        setShowAlert1(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert1])

  //function 2 for fsf failure
  const [showAlert2, setShowAlert2] = useState(false)

  function handleButtonClick2() {
    setShowAlert2(true)
  }

  function handleCloseAlert2() {
    setShowAlert2(false)
  }

  useEffect(() => {
    if (showAlert2) {
      const timer = setTimeout(() => {
        setShowAlert2(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert2])

  //function 3 for fsf failure
  const [showAlert3, setShowAlert3] = useState(false)

  function handleButtonClick3() {
    setShowAlert3(true)
  }

  function handleCloseAlert3() {
    setShowAlert3(false)
  }

  useEffect(() => {
    if (showAlert3) {
      const timer = setTimeout(() => {
        setShowAlert3(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert3])

  //function 4 for fsf failure
  const [showAlert4, setShowAlert4] = useState(false)

  function handleButtonClick4() {
    setShowAlert4(true)
  }

  function handleCloseAlert4() {
    setShowAlert4(false)
  }

  useEffect(() => {
    if (showAlert4) {
      const timer = setTimeout(() => {
        setShowAlert4(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert4])

  //function 4 for fsf failure
  const [showAlert5, setShowAlert5] = useState(false)

  function handleButtonClick5() {
    setShowAlert5(true)
  }

  function handleCloseAlert5() {
    setShowAlert5(false)
  }

  useEffect(() => {
    if (showAlert5) {
      const timer = setTimeout(() => {
        setShowAlert5(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert5])

  //function 4 for fsf failure
  const [showAlert6, setShowAlert6] = useState(false)

  function handleButtonClick6() {
    setShowAlert6(true)
  }

  function handleCloseAlert6() {
    setShowAlert6(false)
  }

  useEffect(() => {
    if (showAlert6) {
      const timer = setTimeout(() => {
        setShowAlert6(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert6])

  //function 4 for fsf failure
  const [showAlert7, setShowAlert7] = useState(false)

  function handleButtonClick7() {
    setShowAlert7(true)
  }

  function handleCloseAlert7() {
    setShowAlert7(false)
  }

  useEffect(() => {
    if (showAlert7) {
      const timer = setTimeout(() => {
        setShowAlert7(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert7])

  //function 4 for fsf failure
  const [showAlert8, setShowAlert8] = useState(false)

  function handleButtonClick8() {
    setShowAlert8(true)
  }

  function handleCloseAlert8() {
    setShowAlert8(false)
  }

  useEffect(() => {
    if (showAlert8) {
      const timer = setTimeout(() => {
        setShowAlert8(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert8])

  //function 4 for fsf failure
  const [showAlert9, setShowAlert9] = useState(false)

  function handleButtonClick9() {
    setShowAlert9(true)
  }

  function handleCloseAlert9() {
    setShowAlert9(false)
  }

  useEffect(() => {
    if (showAlert9) {
      const timer = setTimeout(() => {
        setShowAlert9(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert9])

  //function 4 for fsf failure
  const [showAlert10, setShowAlert10] = useState(false)

  function handleButtonClick10() {
    setShowAlert10(true)
  }

  function handleCloseAlert10() {
    setShowAlert10(false)
  }

  useEffect(() => {
    if (showAlert10) {
      const timer = setTimeout(() => {
        setShowAlert10(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert10])

  //function 4 for fsf failure
  const [showAlert11, setShowAlert11] = useState(false)

  function handleButtonClick11() {
    setShowAlert11(true)
  }

  function handleCloseAlert11() {
    setShowAlert11(false)
  }

  useEffect(() => {
    if (showAlert11) {
      const timer = setTimeout(() => {
        setShowAlert11(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert11])

  //function 4 for fsf failure
  const [showAlert12, setShowAlert12] = useState(false)

  function handleButtonClick12() {
    setShowAlert12(true)
  }

  function handleCloseAlert12() {
    setShowAlert12(false)
  }

  useEffect(() => {
    if (showAlert12) {
      const timer = setTimeout(() => {
        setShowAlert12(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert12])

  //function 4 for fsf failure
  const [showAlert13, setShowAlert13] = useState(false)

  function handleButtonClick13() {
    setShowAlert13(true)
  }

  function handleCloseAlert13() {
    setShowAlert13(false)
  }

  useEffect(() => {
    if (showAlert13) {
      const timer = setTimeout(() => {
        setShowAlert13(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert13])

  //function 4 for fsf failure
  const [showAlert14, setShowAlert14] = useState(false)

  function handleButtonClick14() {
    setShowAlert14(true)
  }

  function handleCloseAlert14() {
    setShowAlert14(false)
  }

  useEffect(() => {
    if (showAlert14) {
      const timer = setTimeout(() => {
        setShowAlert14(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert14])

  //function 4 for fsf failure
  const [showAlert15, setShowAlert15] = useState(false)

  function handleButtonClick15() {
    setShowAlert15(true)
  }

  function handleCloseAlert15() {
    setShowAlert15(false)
  }

  useEffect(() => {
    if (showAlert15) {
      const timer = setTimeout(() => {
        setShowAlert15(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [showAlert15])

  //Initial rendering
  useEffect(() => {
    getProjects()
    getUsers()
    getTeamLeads(local.Users.company_id)
    getProjectModules()
    getFsfWricefId()
  }, [])

  //GET API calls
  async function getProjects() {
    await fetch(`${BASE_URL}/api/getproject`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.projects
        } else if (local.Users.role === 3) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        } else if (local.Users.role === 6) {
          filteredUsers = data.projects.filter((user) => user.company_id === local.Users.company_id)
        }
        setProjects(filteredUsers)
      })
      .catch((error) => console.log(error))
  }

  async function getUsers() {
    await fetch(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.Users
        } else if (local.Users.role === 3) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id)
        }
        setUsers(filteredUsers.slice(1))
      })
      .catch((error) => console.log(error))
  }

  async function getTeamLeads(id) {
    await fetch(`${BASE_URL}/api/getTeamLeadByCompanyId/${id}`)
      .then((response) => response.json())
      .then((data) => setTeamLeads(data.Team_Leads))
      .catch((error) => console.log(error))
  }

  async function getProjectModules() {
    await fetch(`${BASE_URL}/api/getModules`)
      .then((response) => response.json())
      .then((data) => setProjectModule(data.Module))
      .catch((error) => console.log(error))
  }

  async function getFsfWricefId() {
    await fetch(`${BASE_URL}/api/getFunctionalSpecificationForm`)
      .then((response) => response.json())
      .then((data) => setFsfWricef(data.Functional))
      .catch((error) => console.log(error))
  }

  async function getFSFInputParameters() {
    await fetch(`${BASE_URL}/api/getFsfHasParameterByFsfId/${ref_id}`)
      .then((response) => response.json())
      .then((data) => setFsfInput(data.fsf_has_parameter))
      .catch((error) => console.log(error))
  }

  async function getFSFOutputParameters() {
    await fetch(`${BASE_URL}/api/getFsfHasOutputParameters/${ref_id}`)
      .then((response) => response.json())
      .then((data) => setFsfOutput(data.fsf_has_output_parameters))
      .catch((error) => console.log(error))
  }

  async function getFsfHasParameterByFsfId(id) {
    await fetch(`${BASE_URL}/api/getFsfHasParameterById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFsfHasInputParameter(data.fsf)
        setInputParameterName(data.fsf[0].input_parameter_name)
        setDescription(data.fsf[0].description)
        setFieldTechnicalName(data.fsf[0].field_technical_name)
        setFieldLength(data.fsf[0].field_length)
        setFieldType(data.fsf[0].field_type)
        setFieldTableName(data.fsf[0].field_table_name)
        setMandatoryOrOptional(data.fsf[0].mandatory_or_optional)
        setParameterOrSelection(data.fsf[0].parameter_or_selection)
      })
      .catch((error) => console.log(error))
  }

  async function getFsfHasOutputParameterByFsfId(id) {
    await fetch(`${BASE_URL}/api/getFsfHasOutputParameterById/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setFsfHasOutputParameter(data.fsf_has_output_parameter)
        setOutputParameterName(data.fsf_has_output_parameter[0].output_parameter_name)
        setDescription(data.fsf_has_output_parameter[0].description)
        setFieldTechnicalName(data.fsf_has_output_parameter[0].field_technical_name)
        setFieldLength(data.fsf_has_output_parameter[0].field_length)
        setFieldType(data.fsf_has_output_parameter[0].field_type)
        setFieldTableName(data.fsf_has_output_parameter[0].field_table_name)
        setMandatoryOrOptional(data.fsf_has_output_parameter[0].mandatory_or_optional)
        setParameterOrSelection(data.fsf_has_output_parameter[0].parameter_or_selection)
      })
      .catch((error) => console.log(error))
  }

  // Add FSF API call
  async function addFsfForm() {
    let data = {
      description: fsfdescription,
      reference_id,
      company_id: local.Users.company_id,
      module_id,
      project_id,
      type_of_development,
      wricef_id,
      functional_lead_id,
      ABAP_team_lead_id,
      requested_date,
      priority,
      usage_frequency,
      transaction_code,
      authorization_role,
      development_logic,
      attachment,
    }

    await fetch(`${BASE_URL}/api/addFunctionalSpecificationForm`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          handleButtonClick2()
        }
      })
      .then((data) => {
        setRef_id(data.id)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Add Input FSF API call
  async function addInputParameter() {
    let inputfsf = {
      fsf_id: ref_id,
      description,
      input_parameter_name,
      field_technical_name,
      field_length,
      field_type,
      field_table_name,
      mandatory_or_optional,
      parameter_or_selection,
    }
    console.log(inputfsf)

    await fetch(`${BASE_URL}/api/addFsfHasInputParameters`, {
      method: 'POST',
      body: JSON.stringify(inputfsf),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          handleButtonClick3()
          getFSFInputParameters()
        } else {
          handleButtonClick4()
        }
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Add Output FSF API call
  async function addOutputParameter() {
    let inputfsf = {
      fsf_id: ref_id,
      description,
      output_parameter_name,
      field_technical_name,
      field_length,
      field_type,
      field_table_name,
      mandatory_or_optional,
      parameter_or_selection,
    }
    console.log(inputfsf)

    await fetch(`${BASE_URL}/api/addFsfOutputParameters`, {
      method: 'POST',
      body: JSON.stringify(inputfsf),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getFSFOutputParameters()
          handleButtonClick9()
        } else {
          handleButtonClick10()
        }
      })
      .then((data) => {
        console.log(data)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete FSF Parameter Input API call
  async function deleteFSF(id) {
    await fetch(`${BASE_URL}/api/DeleteFsfHasParameterByFsfId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getFSFInputParameters()
          handleButtonClick7()
        } else {
          handleButtonClick8()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update FSF Parameter Input API call
  async function updateFSF(newid) {
    await fetch(`${BASE_URL}/api/UpdateFsfHasInputParameterByFsfId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        fsf_id: ref_id,
        input_parameter_name: input_parameter_name,
        description: description,
        field_technical_name: field_technical_name,
        field_length: field_length,
        field_type: field_type,
        field_table_name: field_table_name,
        mandatory_or_optional: mandatory_or_optional,
        parameter_or_selection: parameter_or_selection,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getFSFInputParameters()
          handleButtonClick5()
        } else {
          handleButtonClick6()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Delete FSF Parameter Output API call
  async function deleteOutputFSF(id) {
    await fetch(`${BASE_URL}/api/DeleteFsfHasOutputParameterByFsfId/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          getFSFOutputParameters()
          handleButtonClick13()
        } else {
          handleButtonClick14()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Update FSF Parameter Output API call
  async function updateOutputFSF(newid) {
    await fetch(`${BASE_URL}/api/UpdateFsfHasOutputParameterByFsfId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newid,
        fsf_id: ref_id,
        output_parameter_name: output_parameter_name,
        description: description,
        field_technical_name: field_technical_name,
        field_length: field_length,
        field_type: field_type,
        field_table_name: field_table_name,
        mandatory_or_optional: mandatory_or_optional,
        parameter_or_selection: parameter_or_selection,
      }),
    })
      .then((response) => {
        if (response.ok) {
          getFSFOutputParameters()
          handleButtonClick11()
        } else {
          handleButtonClick12()
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // POST Input Image API call
  async function inputImagePost(id) {
    await fetch(`${BASE_URL}/api/addInputScreen/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        screenShots: selectedImage,
      }),
    })
      .then((response) => {
        if (response.ok) {
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // POST Output Image API call
  async function outputImagePost(id) {
    await fetch(`${BASE_URL}/api/addOutputScreen/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        screenShots: selectedImage2,
      }),
    })
      .then((response) => {
        if (response.ok) {
        }
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // POST Image conversion API call
  async function imageToLink(content, images) {
    let updatedContent = content

    await Promise.all(
      images.map(async (image) => {
        try {
          const response = await fetch(`${BASE_URL}/api/addDevelopmentLogicIntoFsfForm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              screenShots: image,
            }),
          })

          if (response.ok) {
            const imageUrl = await response.text()
            updatedContent = updatedContent.replace(image, imageUrl)
          }
        } catch (error) {
          console.error(error)
        }
      }),
    )

    setDevelopmentLogic(updatedContent)
  }

  return (
    <>
      {/* FSF Level 1 Form Starts */}
      {showLevel1 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Development Request Data
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 1
              </Typography>
            </Box>
          </Box>

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 800, justifyContent: 'center', padding: '20px' }}>
              <CardContent>

              <div className="form-outline mb-3">
                  <label>Description</label>
                  <Form.Item
                    validateStatus={formErrors.fsfdescription ? 'error' : ''}
                    help={formErrors.fsfdescription}
                  >
                    <input
                      type="text"
                      value={fsfdescription}
                      onChange={(e) => setFsfDescription(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter FSF Description"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Reference Id</label>
                  <Form.Item
                    validateStatus={formErrors.reference_id ? 'error' : ''}
                    help={formErrors.reference_id}
                  >
                    <Select
                      placeholder="Select Reference Id"
                      onChange={handleReferenceIdChange}
                      value={reference_id}
                      name="reference_id"
                      onFocus={handleFocus}
                    >
                      <Select.Option value="0" key="none">
                        None
                      </Select.Option>
                      {fsfwricef.map((fsf) => (
                        <Select.Option value={fsf.id} key={fsf.id}>
                          {fsf.wricef_id}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Module</label>
                  <Form.Item
                    validateStatus={formErrors.module_id ? 'error' : ''}
                    help={formErrors.module_id}
                  >
                    <Select
                      placeholder="Select Module"
                      onChange={handleModuleChange}
                      value={module_id}
                      name="module_id"
                      onFocus={handleFocus}
                    >
                      {projectmodule.map((proj) => (
                        <Select.Option value={proj.id} key={proj.id} module_name={proj.name}>
                          {proj.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Project</label>
                  <Form.Item
                    validateStatus={formErrors.project_id ? 'error' : ''}
                    help={formErrors.project_id}
                  >
                    <Select
                      placeholder="Select Project"
                      onChange={handleProjectChange}
                      value={project_id}
                      name="project_id"
                      onFocus={handleFocus}
                    >
                      {project.map((pro) => (
                        <Select.Option value={pro.id} key={pro.id} project_name={pro.project_name}>
                          {pro.project_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Type of Development</label>
                  <Form.Item
                    validateStatus={formErrors.type_of_development ? 'error' : ''}
                    help={formErrors.type_of_development}
                  >
                    <Select
                      placeholder="Select Type of Development"
                      onChange={handleTypeOfDevelopmentChange}
                      value={type_of_development}
                      name="type_of_development"
                      onFocus={handleFocus}
                    >
                      <Select.Option value="Workflow">Workflow</Select.Option>
                      <Select.Option value="Report">Report</Select.Option>
                      <Select.Option value="Enhancement">Enhancement</Select.Option>
                      <Select.Option value="Interface">Interface</Select.Option>
                      <Select.Option value="Customization">Customization</Select.Option>
                      <Select.Option value="Form">Form</Select.Option>
                      <Select.Option value="Upload">Upload</Select.Option>
                      <Select.Option value="Integration">Integration</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <Button
                  onClick={handleNext1}
                  style={primaryButtonStyle}
                  onMouseEnter={handleMouseEnterPrimary}
                  onMouseLeave={handleMouseLeavePrimary}
                >
                  Next
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {/* FSF Level 1 Form Ends */}

      {/* FSF Level 2 Form Starts */}
      {showLevel2 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Development Request Data
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 2
              </Typography>
            </Box>
          </Box>

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 800, justifyContent: 'center', padding: '20px' }}>
              <CardContent>
                <div className="form-outline mb-3">
                  <label>ABAP Team Lead</label>
                  <Form.Item
                    validateStatus={formErrors.ABAP_team_lead_id ? 'error' : ''}
                    help={formErrors.ABAP_team_lead_id}
                  >
                    <Select
                      placeholder="Select ABAP Team Lead"
                      onChange={handleAbapTeamLeadId}
                      value={ABAP_team_lead_id}
                    >
                      {teamlead.map((team) => (
                        <Select.Option value={team.id} key={team.id}>
                          {team.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                {/* <div className="form-outline mb-3">
                  <label>Requested Date</label>
                  <Form.Item
                    validateStatus={formErrors.requested_date ? 'error' : ''}
                    help={formErrors.requested_date}
                  >
                    <input
                      type="date"
                      value={requested_date}
                      onChange={(e) => setRequestedDate(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Requested Date"
                    />
                  </Form.Item>
                </div> */}

                <div className="form-outline mb-3">
                  <label>Priority</label>
                  <Form.Item
                    validateStatus={formErrors.priority ? 'error' : ''}
                    help={formErrors.priority}
                  >
                    <Select
                      placeholder="Select Priority"
                      onChange={handlePriorityChange}
                      value={priority}
                    >
                      <Select.Option value="Low">Low</Select.Option>
                      <Select.Option value="Medium">Medium</Select.Option>
                      <Select.Option value="High">High</Select.Option>
                      <Select.Option value="Go-Live Critical">Go-Live Critical</Select.Option>
                      <Select.Option value="After Go-Live">After Go-Live</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Usage Frequency</label>
                  <Form.Item
                    validateStatus={formErrors.usage_frequency ? 'error' : ''}
                    help={formErrors.usage_frequency}
                  >
                    <Select
                      placeholder="Select Usage Frequency"
                      onChange={handleUsageFrequencyChange}
                      value={usage_frequency}
                    >
                      <Select.Option value="Daily">Daily</Select.Option>
                      <Select.Option value="Weekly">Weekly</Select.Option>
                      <Select.Option value="Monthly">Monthly</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    onClick={handleBack2}
                    style={dangerButtonStyle}
                    onMouseEnter={handleMouseEnterDanger}
                    onMouseLeave={handleMouseLeaveDanger}
                  >
                    Back
                  </Button>

                  <Button
                    onClick={handleNext2}
                    style={primaryButtonStyle}
                    onMouseEnter={handleMouseEnterPrimary}
                    onMouseLeave={handleMouseLeavePrimary}
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {/* FSF Level 2 Form Ends */}

      {/* FSF Level 3 Form Starts */}
      {showLevel3 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Development Logic
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 3
              </Typography>
            </Box>
          </Box>

          <br />
          <div className="row justify-content-center">
            <Card sx={{ maxWidth: 800, justifyContent: 'center', padding: '20px' }}>
              <CardContent>
                <div className="form-outline mb-3">
                  <label>Custom Transaction Code</label>
                  <input
                    type="text"
                    value={transaction_code}
                    onChange={(e) => setTransactionCode(e.target.value)}
                    className="form-control form-control-lg"
                    placeholder="Enter Custom Transaction Code"
                  />
                </div>

                <div className="form-outline mb-3">
                  <label>Authorization Role</label>
                  <Form.Item
                    validateStatus={formErrors.authorization_role ? 'error' : ''}
                    help={formErrors.authorization_role}
                  >
                    <input
                      type="text"
                      value={authorization_role}
                      onChange={(e) => setAuthorizationRole(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Authorization Role"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Development Logic</label>
                  <Form.Item
                    validateStatus={formErrors.development_logic ? 'error' : ''}
                    help={formErrors.development_logic}
                  >
                    <textarea
                      value={development_logic}
                      onChange={(e) => setDevelopmentLogic(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Development Logic"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <input
                    type="file"
                    onChange={handleFileUpload3}
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef3}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => fileInputRef3.current.click()}
                    style={primaryButtonStyle}
                    onMouseEnter={handleMouseEnterSuccess}
                    onMouseLeave={handleMouseLeaveSuccess}
                  >
                    Upload Image
                  </Button>
                </div>

                {imageError && <p>Error: Please select a valid image file.</p>}

                {attachment && (
                  <div>
                    {/* <h4>Selected Image:</h4> */}
                    <img src={attachment} alt="Attachment" />
                  </div>
                )}

                {/* <Editor
                  apiKey="46tu7q2m7kbsfpbdoc5mwnyn5hs97kdpefj8dnpuvz65aknl"
                  cloudChannel="dev"
                  init={editorConfig}
                  onEditorChange={handleEditorChange}
                /> */}

                <br></br>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Button
                    onClick={handleBack3}
                    style={dangerButtonStyle}
                    onMouseEnter={handleMouseEnterDanger}
                    onMouseLeave={handleMouseLeaveDanger}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext3}
                    style={primaryButtonStyle}
                    onMouseEnter={handleMouseEnterPrimary}
                    onMouseLeave={handleMouseLeavePrimary}
                  >
                    Next
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {/* FSF Level 3 Form Ends */}

      {/* FSF Level 4 Form Starts */}
      {showLevel4 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Input Screen
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 4
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 2,
              mb: 2,
            }}
          >
            {/* <Button
              onClick={handleBack4}
              style={dangerButtonStyle}
              onMouseEnter={handleMouseEnterDanger}
              onMouseLeave={handleMouseLeaveDanger}
            >
              Back
            </Button> */}
            <input
              type="file"
              onChange={handleFileUpload}
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <Button
              onClick={() => fileInputRef.current.click()}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Upload Image
            </Button>
            <Button
              onClick={handleNext4}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Next
            </Button>
          </Box>

          {imageError && <p>Error: Please select a valid image file.</p>}

          {selectedImage && (
            <div>
              {/* <h4>Selected Image:</h4> */}
              <img src={selectedImage} alt="Selected" />
            </div>
          )}
        </div>
      )}
      {/* FSF Level 4 Form Ends */}

      {/* FSF Level 5 Form Starts */}
      {showLevel5 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Input Screen Parameters
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 5
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 3,
              mb: 1,
            }}
          >
            <Tooltip title="Add Parameters">
              <Button
                style={primaryButtonStyle}
                onClick={showModal}
                onMouseEnter={handleMouseEnterPrimary}
                onMouseLeave={handleMouseLeavePrimary}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          </Box>

          <CTable
            align="middle"
            className="mb-0 border"
            hover
            responsive
            style={{ marginTop: '20px' }}
          >
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Sr No.
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Parameter Name
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Technical Name
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Length
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Type
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Table Name
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Mandatory/Optional
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Parameter/Selection
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Actions
                </CTableHeaderCell>
                {/* Add Actions column */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {fsf_input.map((data, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.input_parameter_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.description}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_technical_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_length}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_type}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_table_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.mandatory_or_optional}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.parameter_or_selection}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    <IconButton aria-label="Update" onClick={() => showModal4(data.id)}>
                      <EditIcon htmlColor="#28B463" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => showModal3(data.id)}>
                      <DeleteIcon htmlColor="#FF0000" />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}

              {/* Modal for Add Parameter */}
              <Modal
                open={isModalOpen}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      OK
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Add a Parameter
                </Typography>

                <div className="form-outline mb-3">
                  <label>Parameter Name</label>
                  <Form.Item
                    validateStatus={formErrors.input_parameter_name ? 'error' : ''}
                    help={formErrors.input_parameter_name}
                  >
                    <input
                      type="text"
                      value={input_parameter_name}
                      onChange={(e) => setInputParameterName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Input Parameter Name"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Description</label>
                  <Form.Item
                    validateStatus={formErrors.description ? 'error' : ''}
                    help={formErrors.description}
                  >
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Description"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Technical Name</label>
                  <Form.Item
                    validateStatus={formErrors.field_technical_name ? 'error' : ''}
                    help={formErrors.field_technical_name}
                  >
                    <input
                      type="text"
                      value={field_technical_name}
                      onChange={(e) => setFieldTechnicalName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Technical Name"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Length</label>
                  <Form.Item
                    validateStatus={formErrors.field_length ? 'error' : ''}
                    help={formErrors.field_length}
                  >
                    <input
                      type="number"
                      value={field_length}
                      onChange={(e) => setFieldLength(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Length"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Type</label>
                  <Form.Item
                    validateStatus={formErrors.field_type ? 'error' : ''}
                    help={formErrors.field_type}
                  >
                    <input
                      type="text"
                      value={field_type}
                      onChange={(e) => setFieldType(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Type"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Table Name</label>
                  <Form.Item
                    validateStatus={formErrors.field_table_name ? 'error' : ''}
                    help={formErrors.field_table_name}
                  >
                    <input
                      type="text"
                      value={field_table_name}
                      onChange={(e) => setFieldTableName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Table Name"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Mandatory or Optional</label>
                  <Form.Item
                    validateStatus={formErrors.mandatory_or_optional ? 'error' : ''}
                    help={formErrors.mandatory_or_optional}
                  >
                    <Select
                      placeholder="Select"
                      onChange={handleMandatoryOrOptionalChange}
                      value={mandatory_or_optional}
                    >
                      <Select.Option value="Mandatory">Mandatory</Select.Option>
                      <Select.Option value="Optional">Optional</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Parameter or Selection</label>
                  <Form.Item
                    validateStatus={formErrors.parameter_or_selection ? 'error' : ''}
                    help={formErrors.parameter_or_selection}
                  >
                    <Select
                      placeholder="Select"
                      onChange={handleParameterOrSelection}
                      value={parameter_or_selection}
                    >
                      <Select.Option value="Parameter">Parameter</Select.Option>
                      <Select.Option value="Selection">Selection</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Modal>

              {/* Modal for Update FSF Parameters */}
              <Modal
                open={isModalOpen4}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel4} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel4}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk4}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      Update
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Update a Parameter
                </Typography>
                {fsfHasInputParameter.map((fsf) => (
                  <div key={fsf.id}>
                    <div className="form-outline mb-3">
                      <label>Parameter Name</label>
                      <Form.Item
                        validateStatus={formErrors.input_parameter_name ? 'error' : ''}
                        help={formErrors.input_parameter_name}
                      >
                        <input
                          type="text"
                          value={input_parameter_name}
                          onChange={(e) => setInputParameterName(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Input Parameter Name"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Description</label>
                      <Form.Item
                        validateStatus={formErrors.description ? 'error' : ''}
                        help={formErrors.description}
                      >
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Description"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Technical Name</label>
                      <Form.Item
                        validateStatus={formErrors.field_technical_name ? 'error' : ''}
                        help={formErrors.field_technical_name}
                      >
                        <input
                          type="text"
                          value={field_technical_name}
                          onChange={(e) => setFieldTechnicalName(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Technical Name"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Length</label>
                      <Form.Item
                        validateStatus={formErrors.field_length ? 'error' : ''}
                        help={formErrors.field_length}
                      >
                        <input
                          type="number"
                          value={field_length}
                          onChange={(e) => setFieldLength(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Length"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Type</label>
                      <Form.Item
                        validateStatus={formErrors.field_type ? 'error' : ''}
                        help={formErrors.field_type}
                      >
                        <input
                          type="text"
                          value={field_type}
                          onChange={(e) => setFieldType(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Type"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Table Name</label>
                      <Form.Item
                        validateStatus={formErrors.field_table_name ? 'error' : ''}
                        help={formErrors.field_table_name}
                      >
                        <input
                          type="text"
                          value={field_table_name}
                          onChange={(e) => setFieldTableName(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Table Name"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Mandatory or Optional</label>
                      <Form.Item
                        validateStatus={formErrors.mandatory_or_optional ? 'error' : ''}
                        help={formErrors.mandatory_or_optional}
                      >
                        <Select
                          placeholder="Select"
                          onChange={handleMandatoryOrOptionalChange}
                          value={mandatory_or_optional}
                        >
                          <Select.Option value="Mandatory">Mandatory</Select.Option>
                          <Select.Option value="Optional">Optional</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Parameter or Selection</label>
                      <Form.Item
                        validateStatus={formErrors.parameter_or_selection ? 'error' : ''}
                        help={formErrors.parameter_or_selection}
                      >
                        <Select
                          placeholder="Select"
                          onChange={handleParameterOrSelection}
                          value={parameter_or_selection}
                        >
                          <Select.Option value="Parameter">Parameter</Select.Option>
                          <Select.Option value="Selection">Selection</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </Modal>

              {/* Modal for Deletion Confirmation */}
              <Modal
                open={isModalOpen3}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel3} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel3}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk3}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      OK
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Are you sure you want to delete?
                </Typography>
              </Modal>
            </CTableBody>
          </CTable>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 2,
              mb: 2,
            }}
          >
            <Button
              onClick={handleBack5}
              style={dangerButtonStyle}
              onMouseEnter={handleMouseEnterDanger}
              onMouseLeave={handleMouseLeaveDanger}
            >
              Back
            </Button>
            <Button
              onClick={() => handleNext5(ref_id)}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Next
            </Button>
          </Box>
        </div>
      )}
      {/* FSF Level 5 Form Ends */}

      {/* FSF Level 6 Form Starts */}
      {showLevel6 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Output Screen
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 6
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 2,
              mb: 2,
            }}
          >
            {/* <Button
          onClick={handleBack6}
          style={dangerButtonStyle}
          onMouseEnter={handleMouseEnterDanger}
          onMouseLeave={handleMouseLeaveDanger}
        >
          Back
        </Button> */}
            <input
              type="file"
              onChange={handleFileUpload2}
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef2}
            />
            <Button
              onClick={() => fileInputRef2.current.click()}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Upload Image
            </Button>
            <Button
              onClick={handleNext6}
              style={primaryButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Next
            </Button>
          </Box>

          {imageError2 && <p>Error: Please select a valid image file.</p>}

          {selectedImage2 && (
            <div>
              {/* <h4>Selected Image:</h4> */}
              <img src={selectedImage2} alt="Selected" />
            </div>
          )}
        </div>
      )}
      {/* FSF Level 6 Form Ends */}

      {/* FSF Level 7 Form Starts */}
      {showLevel7 && (
        <div>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h3" component="h3" align="center">
                Output Screen Parameters
              </Typography>
            </Box>
          </Box>

          <br />

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ maxWidth: 'md' }}>
              <Typography variant="h4" component="h4" align="center">
                Level 7
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 3,
              mb: 1,
            }}
          >
            <Tooltip title="Add Parameters">
              <Button
                style={primaryButtonStyle}
                onClick={showModal2}
                onMouseEnter={handleMouseEnterPrimary}
                onMouseLeave={handleMouseLeavePrimary}
              >
                <AddIcon />
              </Button>
            </Tooltip>
          </Box>

          <CTable
            align="middle"
            className="mb-0 border"
            hover
            responsive
            style={{ marginTop: '20px' }}
          >
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Sr No.
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Parameter Name
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Description
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Technical Name
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Length
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Type
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Field Table Name
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Mandatory/Optional
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Parameter/Selection
                </CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={mystyle}>
                  Actions
                </CTableHeaderCell>
                {/* Add Actions column */}
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {fsf_output.map((data, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {index + 1}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.output_parameter_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.description}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_technical_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_length}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_type}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.field_table_name}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.mandatory_or_optional}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    {data.parameter_or_selection}
                  </CTableDataCell>
                  <CTableDataCell className="text-center" style={mystyle}>
                    <IconButton aria-label="Update" onClick={() => showModal6(data.id)}>
                      <EditIcon htmlColor="#28B463" />
                    </IconButton>
                    <IconButton aria-label="Delete" onClick={() => showModal5(data.id)}>
                      <DeleteIcon htmlColor="#FF0000" />
                    </IconButton>
                  </CTableDataCell>
                </CTableRow>
              ))}

              {/* Modal for Add Parameter */}
              <Modal
                open={isModalOpen2}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel2} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel2}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk2}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      OK
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Add a Parameter
                </Typography>

                <div className="form-outline mb-3">
                  <label>Parameter Name</label>
                  <Form.Item
                    validateStatus={formErrors.output_parameter_name ? 'error' : ''}
                    help={formErrors.output_parameter_name}
                  >
                    <input
                      type="text"
                      value={output_parameter_name}
                      onChange={(e) => setOutputParameterName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Output Parameter Name"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Description</label>
                  <Form.Item
                    validateStatus={formErrors.description ? 'error' : ''}
                    help={formErrors.description}
                  >
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Description"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Technical Name</label>
                  <Form.Item
                    validateStatus={formErrors.field_technical_name ? 'error' : ''}
                    help={formErrors.field_technical_name}
                  >
                    <input
                      type="text"
                      value={field_technical_name}
                      onChange={(e) => setFieldTechnicalName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Technical Name"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Length</label>
                  <Form.Item
                    validateStatus={formErrors.field_length ? 'error' : ''}
                    help={formErrors.field_length}
                  >
                    <input
                      type="number"
                      value={field_length}
                      onChange={(e) => setFieldLength(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Length"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Type</label>
                  <Form.Item
                    validateStatus={formErrors.field_type ? 'error' : ''}
                    help={formErrors.field_type}
                  >
                    <input
                      type="text"
                      value={field_type}
                      onChange={(e) => setFieldType(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Type"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Field Table Name</label>
                  <Form.Item
                    validateStatus={formErrors.field_table_name ? 'error' : ''}
                    help={formErrors.field_table_name}
                  >
                    <input
                      type="text"
                      value={field_table_name}
                      onChange={(e) => setFieldTableName(e.target.value)}
                      className="form-control form-control-lg"
                      placeholder="Enter Field Table Name"
                    />
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Mandatory or Optional</label>
                  <Form.Item
                    validateStatus={formErrors.mandatory_or_optional ? 'error' : ''}
                    help={formErrors.mandatory_or_optional}
                  >
                    <Select
                      placeholder="Select"
                      onChange={handleMandatoryOrOptionalChange}
                      value={mandatory_or_optional}
                    >
                      <Select.Option value="Mandatory">Mandatory</Select.Option>
                      <Select.Option value="Optional">Optional</Select.Option>
                    </Select>
                  </Form.Item>
                </div>

                <div className="form-outline mb-3">
                  <label>Parameter or Selection</label>
                  <Form.Item
                    validateStatus={formErrors.parameter_or_selection ? 'error' : ''}
                    help={formErrors.parameter_or_selection}
                  >
                    <Select
                      placeholder="Select"
                      onChange={handleParameterOrSelection}
                      value={parameter_or_selection}
                    >
                      <Select.Option value="Parameter">Parameter</Select.Option>
                      <Select.Option value="Selection">Selection</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Modal>

              {/* Modal for Update FSF Parameters */}
              <Modal
                open={isModalOpen6}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel6} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel6}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk6}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      Update
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Update a Parameter
                </Typography>
                {fsfHasOutputParameter.map((fsf) => (
                  <div key={fsf.id}>
                    <div className="form-outline mb-3">
                      <label>Parameter Name</label>
                      <Form.Item
                        validateStatus={formErrors.output_parameter_name ? 'error' : ''}
                        help={formErrors.output_parameter_name}
                      >
                        <input
                          type="text"
                          value={output_parameter_name}
                          onChange={(e) => setOutputParameterName(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Output Parameter Name"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Description</label>
                      <Form.Item
                        validateStatus={formErrors.description ? 'error' : ''}
                        help={formErrors.description}
                      >
                        <input
                          type="text"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Description"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Technical Name</label>
                      <Form.Item
                        validateStatus={formErrors.field_technical_name ? 'error' : ''}
                        help={formErrors.field_technical_name}
                      >
                        <input
                          type="text"
                          value={field_technical_name}
                          onChange={(e) => setFieldTechnicalName(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Technical Name"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Length</label>
                      <Form.Item
                        validateStatus={formErrors.field_length ? 'error' : ''}
                        help={formErrors.field_length}
                      >
                        <input
                          type="number"
                          value={field_length}
                          onChange={(e) => setFieldLength(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Length"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Type</label>
                      <Form.Item
                        validateStatus={formErrors.field_type ? 'error' : ''}
                        help={formErrors.field_type}
                      >
                        <input
                          type="text"
                          value={field_type}
                          onChange={(e) => setFieldType(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Type"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Field Table Name</label>
                      <Form.Item
                        validateStatus={formErrors.field_table_name ? 'error' : ''}
                        help={formErrors.field_table_name}
                      >
                        <input
                          type="text"
                          value={field_table_name}
                          onChange={(e) => setFieldTableName(e.target.value)}
                          className="form-control form-control-lg"
                          placeholder="Enter Field Table Name"
                        />
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Mandatory or Optional</label>
                      <Form.Item
                        validateStatus={formErrors.mandatory_or_optional ? 'error' : ''}
                        help={formErrors.mandatory_or_optional}
                      >
                        <Select
                          placeholder="Select"
                          onChange={handleMandatoryOrOptionalChange}
                          value={mandatory_or_optional}
                        >
                          <Select.Option value="Mandatory">Mandatory</Select.Option>
                          <Select.Option value="Optional">Optional</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>

                    <div className="form-outline mb-3">
                      <label>Parameter or Selection</label>
                      <Form.Item
                        validateStatus={formErrors.parameter_or_selection ? 'error' : ''}
                        help={formErrors.parameter_or_selection}
                      >
                        <Select
                          placeholder="Select"
                          onChange={handleParameterOrSelection}
                          value={parameter_or_selection}
                        >
                          <Select.Option value="Parameter">Parameter</Select.Option>
                          <Select.Option value="Selection">Selection</Select.Option>
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                ))}
              </Modal>

              {/* Modal for Deletion Confirmation */}
              <Modal
                open={isModalOpen5}
                maskClosable={false}
                closeIcon={<CloseIcon onClick={handleCancel5} />}
                footer={
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}
                  >
                    <Button
                      onClick={handleCancel5}
                      style={dangerButtonStyle}
                      onMouseEnter={handleMouseEnterDanger}
                      onMouseLeave={handleMouseLeaveDanger}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleOk5}
                      style={primaryButtonStyle}
                      onMouseEnter={handleMouseEnterPrimary}
                      onMouseLeave={handleMouseLeavePrimary}
                    >
                      OK
                    </Button>
                  </div>
                }
              >
                <Typography variant="h5" component="div" sx={{ marginBottom: '10px' }}>
                  Are you sure you want to delete?
                </Typography>
              </Modal>
            </CTableBody>
          </CTable>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              mt: 2,
              mb: 2,
            }}
          >
            <Button
              onClick={handleBack7}
              style={dangerButtonStyle}
              onMouseEnter={handleMouseEnterDanger}
              onMouseLeave={handleMouseLeaveDanger}
            >
              Back
            </Button>
            <Button
              onClick={() => submitHandle(ref_id)}
              style={successButtonStyle}
              onMouseEnter={handleMouseEnterSuccess}
              onMouseLeave={handleMouseLeaveSuccess}
            >
              Submit
            </Button>
          </Box>
        </div>
      )}
      {/* FSF Level 7 Form Ends */}

      {showAlert1 && (
        <Alert onClose={handleCloseAlert1} severity="success" style={modalStyle2}>
          FSF Forms Submitted Successfully
        </Alert>
      )}
      {showAlert2 && (
        <Alert onClose={handleCloseAlert2} severity="error" style={modalStyle2}>
          Failed to Submit FSF Forms
        </Alert>
      )}
      {showAlert3 && (
        <Alert onClose={handleCloseAlert3} severity="success" style={modalStyle2}>
          Input Parameter Added
        </Alert>
      )}
      {showAlert4 && (
        <Alert onClose={handleCloseAlert4} severity="error" style={modalStyle2}>
          Failed to Add Input Parameter
        </Alert>
      )}
      {showAlert5 && (
        <Alert onClose={handleCloseAlert5} severity="success" style={modalStyle2}>
          Input Parameter Updated
        </Alert>
      )}
      {showAlert6 && (
        <Alert onClose={handleCloseAlert6} severity="error" style={modalStyle2}>
          Failed to Update Input Parameter
        </Alert>
      )}
      {showAlert7 && (
        <Alert onClose={handleCloseAlert7} severity="success" style={modalStyle2}>
          Input Parameter Deleted
        </Alert>
      )}
      {showAlert8 && (
        <Alert onClose={handleCloseAlert8} severity="error" style={modalStyle2}>
          Failed to Delete Input Parameter
        </Alert>
      )}
      {showAlert9 && (
        <Alert onClose={handleCloseAlert9} severity="success" style={modalStyle2}>
          Output Parameter Added
        </Alert>
      )}
      {showAlert10 && (
        <Alert onClose={handleCloseAlert10} severity="error" style={modalStyle2}>
          Failed to Add Output Parameter
        </Alert>
      )}
      {showAlert11 && (
        <Alert onClose={handleCloseAlert11} severity="success" style={modalStyle2}>
          Output Parameter Updated
        </Alert>
      )}
      {showAlert12 && (
        <Alert onClose={handleCloseAlert12} severity="error" style={modalStyle2}>
          Failed to Update Output Parameter
        </Alert>
      )}
      {showAlert13 && (
        <Alert onClose={handleCloseAlert13} severity="success" style={modalStyle2}>
          Output Parameter Deleted
        </Alert>
      )}
      {showAlert14 && (
        <Alert onClose={handleCloseAlert14} severity="error" style={modalStyle2}>
          Failed to Delete Output Parameter
        </Alert>
      )}
      {showAlert15 && (
        <Alert onClose={handleCloseAlert15} severity="success" style={modalStyle2}>
          FsF Form Submitted Success
        </Alert>
      )}
    </>
  )
}

export default FSFform
