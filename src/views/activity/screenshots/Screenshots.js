import { React, useState, useEffect, useCallback } from 'react'
import { Button, DatePicker, Select, Form } from 'antd'
import ImageViewer from 'react-simple-image-viewer'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import AspectRatio from '@mui/joy/AspectRatio'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardOverflow from '@mui/joy/CardOverflow'
import Divider from '@mui/joy/Divider'
import Typography from '@mui/joy/Typography'
import dayjs from 'dayjs'
// import Geocode from 'react-geocode'
import LoadingSpinner from 'src/components/Loader/Loader'
const BASE_URL = process.env.REACT_APP_BASE_URL
dayjs.extend(customParseFormat)

const Screenshots = () => {
  // Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))

  // CSS Styling
  const imageContainer = {
    display: 'flex',
    flexWrap: 'wrap',
  }

  const imageViewerStyle = {
    position: 'fixed',
    zIndex: 9999, // Set a higher z-index value
  }

  const userStyle = {
    color: 'black',
    fontSize: 18,
  }

  const cardStyle = {
    width: '100%',
  }

  const userStyle2 = {
    fontFamily: 'Arial',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0070FF ',
  }

  const [isEmployeeSelected, setIsEmployeeSelected] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [isRecordNotFound, setIsRecordNotFound] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isAdminLogin, setIsAdminLogin] = useState(true)

  useEffect(() => {
    if (local.Users.role === 3) {
      setIsAdminLogin(false)
    }
  }, [])

  function onDateChange(date, dateString) {
    setIsAdminLogin(true)
    setSelectedDate(dateString)
    if (date && (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7)) {
      getAllWorkedTimeByInterval(dateString, local.Users.user_id)
      getDateWiseScreenshots(dateString, local.Users.user_id)
    } else if (date && local.Users.role === 3) {
      getAllWorkedTimeByInterval(dateString, user_id)
      getDateWiseScreenshotsCompany(dateString, local.Users.company_id)
    }
  }

  function onTodayButtonClicked() {
    setIsAdminLogin(true)
    setAllTotalHours(null)
    setAllTotalMinutes(null)
    setAllTotalSeconds(null)
    setSelectedDate(null)
    getScreenshots()
  }

  // Array Declaration for API Calls
  const [images, setImages] = useState([])
  const [users, setUsers] = useState([])
  const [addresses, setAddresses] = useState([])
  const [user_id, setUserId] = useState('')
  const [alltotalhours, setAllTotalHours] = useState('')
  const [alltotalminutes, setAllTotalMinutes] = useState('')
  const [alltotalseconds, setAllTotalSeconds] = useState('')

  // Images URLs State
  const [imagesUrls, setImagesUrls] = useState([])

  // Initial rendering through useEffect
  useEffect(() => {
    getUsers()
    getScreenshots()
  }, [])

  //----------------------------
  // Get API Calls
  //----------------------------

  // User API Call
  function getUsers() {
    fetchPromise(`${BASE_URL}/api/get_users`)
      .then((response) => response.json())
      .then((data) => {
        let filteredUsers = []
        if (local.Users.role === 1) {
          filteredUsers = data.Users
        } else if (local.Users.role === 3) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id)
        } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
          filteredUsers = data.Users.filter((user) => user.id === user_id)
        }
        setUsers(filteredUsers.slice(1))
      })
      .catch((error) => console.log(error))
  }

  // Screen-Shots APIs
  async function getScreenshots() {
    setIsLoading(true)
    try {
      const response = await fetchPromise(`${BASE_URL}/api/get_Project_Screenshots`)
      const data = await response.json()

      let screenfilter = []

      if (local.Users.role === 1) {
        setIsEmployeeSelected(false)
        screenfilter = data.projectscreenshot
      } else if (local.Users.role === 3) {
        setIsEmployeeSelected(false)
        screenfilter = data.projectscreenshot.filter(
          (screenshot) => screenshot.company_id === local.Users.company_id,
        )
        if (user_id) {
          getAddresses(screenfilter[0].latitude, screenfilter[0].longitude)
        }
      } else if (local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7) {
        setIsEmployeeSelected(true)
        screenfilter = data.projectscreenshot.filter(
          (screenshot) => screenshot.user_id === local.Users.user_id,
        )
        if (screenfilter.length === 0) {
          setIsRecordNotFound(true)
        } else {
          const employeeId = screenfilter[0].user_id
          setUserId(employeeId)
        }
      }

      setImages(screenfilter)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function getDateWiseScreenshots(a, b) {
    setIsLoading(true)
    try {
      const response = await fetchPromise(`${BASE_URL}/api/get_projectscreenshot_by_date/${a}/${b}`)
      const data = await response.json()

      let screenfilter = []

      if (local.Users.role === 1 || local.Users.role === 3) {
        screenfilter = data.projectscreenshot
        getAddresses(screenfilter[0].latitude, screenfilter[0].longitude)
      } else {
        screenfilter = data.projectscreenshot.filter(
          (screenshot) => screenshot.user_id === local.Users.user_id,
        )
      }

      setImages(screenfilter)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function getDateWiseScreenshotsCompany(a, b) {
    setIsLoading(true)
    try {
      const response = await fetchPromise(
        `${BASE_URL}/api/get_projectscreenshot_by_compny_id/${a}/${b}`,
      )
      const data = await response.json()

      const screenfilter = data

      setImages(screenfilter)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Time-Interval APIs
  async function getTodayWorked(id) {
    try {
      const response = await fetchPromise(`${BASE_URL}/api/getTotalWorkbyUserId/${id}`)
      const data = await response.json()

      setAllTotalHours(data.hours)
      setAllTotalMinutes(data.minutes)
      setAllTotalSeconds(data.seconds)
    } catch (error) {
      console.log(error)
    }
  }

  async function getAllWorkedTimeByInterval(a, b) {
    try {
      const response = await fetchPromise(`${BASE_URL}/api/getSumByDateWithUserId/${a}/${b}`)
      const data = await response.json()

      setAllTotalHours(data.hours)
      setAllTotalMinutes(data.minutes)
      setAllTotalSeconds(data.seconds)
      getAddresses(data.projects[0].latitude, data.projects[0].longitude)
    } catch (error) {
      console.log(error)
    }
  }

  // Helper function to wrap fetch in a Promise
  function fetchPromise(url) {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
  }

  // Functions for Selected image
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const handleClick = useCallback((imageUrl) => {
    let urls = imageUrl.map((url) => `${BASE_URL}/screenshots/${url.path_url}`)
    setImagesUrls(urls)
    setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setImagesUrls(null)
    setIsViewerOpen(false)
  }

  const handleUserChange = (value) => {
    setIsEmployeeSelected(true)
    setIsAdminLogin(true)
    setUserId(value)
    if (selectedDate) {
      getAllWorkedTimeByInterval(selectedDate, value)
      getDateWiseScreenshots(selectedDate, value)
    } else {
      getTodayWorked(value)
      const today = new Date()
      const day = today.getDate()
      const month = today.getMonth() + 1
      const year = today.getFullYear()
      const todayDate = `${year}-${month}-${day}`
      getDateWiseScreenshots(todayDate, value)
    }
  }

  // Geolocation get using Google
  const getAddresses = async (lat, long) => {
    const apiKey = 'AIzaSyBSBflGv5OULqd9TPMLKecXIig07YXKW2A' // Replace with your own API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK') {
        const result = data.results.find((result) => result.geometry.location_type === 'ROOFTOP')
        const address = result ? result.formatted_address : data.results[0].formatted_address
        setAddresses(address)
      } else {
        console.error(data.status)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // Logic to concatenate the base URL with the image URL
  const url = (imageUrl) => {
    const concatinatedImage = `${BASE_URL}/screenshots/${imageUrl}`
    return concatinatedImage
  }

  // Static Messeges
  const renderEmployeeSelectionText = () => {
    if (local.Users.role !== 5 && local.Users.role !== 6 && local.Users.role !== 7) {
      return (
        <Box mt={2}>
          <Card style={cardStyle}>
            <Box className="row">
              <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
                PLEASE SELECT THE EMPLOYEE, WHOM YOU WANNA SEE SCREENSHOTS
              </Typography>
            </Box>
          </Card>
        </Box>
      )
    }
    return null
  }

  const renderNoRecordFoundMessage = () => {
    return (
      <Box mt={2}>
        <Card style={cardStyle}>
          <Box className="row">
            <Typography variant="h6" sx={{ color: '#9E9E9E', textAlign: 'center' }}>
              NO RECORDS FOUND
            </Typography>
          </Box>
        </Card>
      </Box>
    )
  }

  return (
    <>
      {local.Users.role === 3 ? (
        <div>
          {addresses.length > 0 ? (
            <h3>Location {addresses.length > 0 && <h3 style={userStyle}>{addresses}</h3>}</h3>
          ) : null}
          <br></br>
          {alltotalhours || alltotalminutes || alltotalseconds ? (
            <h3>
              Total Worked {alltotalhours}:{alltotalminutes}:{alltotalseconds}
            </h3>
          ) : null}
        </div>
      ) : null}
      {local.Users.role === 5 || local.Users.role === 6 || local.Users.role === 7 ? (
        <div>
          {alltotalhours || alltotalminutes || alltotalseconds ? (
            <h3>
              Total Worked {alltotalhours}:{alltotalminutes}:{alltotalseconds}
            </h3>
          ) : null}
        </div>
      ) : null}

      <div className="row mt-2 mb-2 justify-content-between">
        <div className="col-md-4">
          <div className="d-flex align-items-center">
            <DatePicker
              value={selectedDate ? dayjs(selectedDate, 'YYYY-MM-DD') : null}
              onChange={onDateChange}
              disabled={!user_id}
              clearIcon={null}
              style={{
                width: '100%',
              }}
            />
            <Button type="default" onClick={onTodayButtonClicked} className="ml-2">
              Today
            </Button>
          </div>
        </div>

        <div className="col-md-4">
          {local.Users.role === 1 || local.Users.role === 3 ? (
            <div className="d-flex align-items-center">
              <Form.Item
                name="select"
                hasFeedback
                style={{
                  width: '100%',
                }}
              >
                <Select placeholder="Members" onChange={handleUserChange} value={user_id}>
                  {users.map((user) => (
                    <Select.Option value={user.id} key={user.id}>
                      {user.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          ) : null}
        </div>
      </div>

      <Divider />
      {isAdminLogin && isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={imageContainer}>
          {user_id
            ? images
                .filter((image) => image.user_id === user_id)
                .map((image) => {
                  return (
                    <>
                      {image.get_timings.map((timing) => (
                        <div key={timing.id} style={{ cursor: 'pointer' }}>
                          <Card
                            variant="outlined"
                            sx={{ width: 240, my: 1, mx: 1 }}
                            onClick={() => handleClick(timing.getattechments)}
                          >
                            <CardOverflow>
                              <AspectRatio ratio="2">
                                {timing.getattechments.map((attach) => (
                                  <div key={attach.id} style={{ position: 'relative' }}>
                                    <img
                                      src={url(attach.path_url)}
                                      alt={attach.path_url}
                                      style={{ filter: 'blur(3px)' }}
                                    />
                                    <div
                                      style={{
                                        position: 'absolute',
                                        top: '32px',
                                        right: '84px',
                                        padding: '8px 18px',
                                        borderRadius: '50%',
                                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                        border: '4px solid black',
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: '#fff',
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                      }}
                                    >
                                      {timing.getattechments.length}
                                    </div>
                                  </div>
                                ))}
                              </AspectRatio>
                            </CardOverflow>
                            <Typography level="h2" sx={{ fontSize: 'md', mt: 1 }}>
                              {image.project_name}
                            </Typography>
                            <Typography level="body2" sx={{ mt: 0.5, mb: 1 }}>
                              {image.stream_name}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                mx: 'auto',
                                my: 0.5,
                              }}
                            >
                              {timing.getattechments.map((_, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    borderRadius: '50%',
                                    width: `max(${6 - index}px, 3px)`,
                                    height: `max(${6 - index}px, 3px)`,
                                    bgcolor: index === 0 ? 'primary.solidBg' : 'background.level3',
                                  }}
                                />
                              ))}
                            </Box>
                            <Divider />
                            <CardOverflow
                              variant="soft"
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 1,
                                py: 1,
                                px: 'var(--Card-padding)',
                                bgcolor: 'background.level1',
                              }}
                            >
                              <Typography
                                level="body3"
                                sx={{ fontWeight: 'md', color: 'text.secondary' }}
                              >
                                {new Date(timing.start_time)
                                  .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  .substring(0, 11)}{' '}
                                -
                                {new Date(timing.end_time)
                                  .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  .substring(0, 11)}
                              </Typography>
                              <Typography
                                level="body3"
                                sx={{ fontWeight: 'md', color: 'text.secondary' }}
                              >
                                {new Intl.DateTimeFormat('en-GB', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: '2-digit',
                                }).format(new Date(timing.created_at))}
                              </Typography>
                            </CardOverflow>
                          </Card>
                        </div>
                      ))}
                    </>
                  )
                })
            : images.map((image) => {
                return (
                  <>
                    {isEmployeeSelected === true
                      ? image.get_timings.map((timing) => (
                          <div key={timing.id} style={{ cursor: 'pointer' }}>
                            <Card
                              variant="outlined"
                              sx={{ width: 240, my: 1, mx: 1 }}
                              onClick={() => handleClick(timing.getattechments)}
                            >
                              <CardOverflow>
                                <AspectRatio ratio="2">
                                  {timing.getattechments.map((attach) => (
                                    <div key={attach.id} style={{ position: 'relative' }}>
                                      <img
                                        src={url(attach.path_url)}
                                        alt={attach.path_url}
                                        style={{ filter: 'blur(3px)' }}
                                      />
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: '32px',
                                          right: '84px',
                                          padding: '8px 18px',
                                          borderRadius: '50%',
                                          backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                          border: '4px solid black',
                                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                          color: '#fff',
                                          fontSize: '24px',
                                          fontWeight: 'bold',
                                        }}
                                      >
                                        {timing.getattechments.length}
                                      </div>
                                    </div>
                                  ))}
                                </AspectRatio>
                              </CardOverflow>
                              <Typography level="h2" sx={{ fontSize: 'md', mt: 1 }}>
                                {image.project_name}
                              </Typography>
                              <Typography level="body2" sx={{ mt: 0.5, mb: 1 }}>
                                {image.stream_name}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  mx: 'auto',
                                  my: 0.5,
                                }}
                              >
                                {timing.getattechments.map((_, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      borderRadius: '50%',
                                      width: `max(${6 - index}px, 3px)`,
                                      height: `max(${6 - index}px, 3px)`,
                                      bgcolor:
                                        index === 0 ? 'primary.solidBg' : 'background.level3',
                                    }}
                                  />
                                ))}
                              </Box>
                              <Divider />
                              <CardOverflow
                                variant="soft"
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  gap: 1,
                                  py: 1,
                                  px: 'var(--Card-padding)',
                                  bgcolor: 'background.level1',
                                }}
                              >
                                <Typography
                                  level="body3"
                                  sx={{ fontWeight: 'md', color: 'text.secondary' }}
                                >
                                  {new Date(timing.start_time)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    .substring(0, 11)}{' '}
                                  -
                                  {new Date(timing.end_time)
                                    .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    .substring(0, 11)}
                                </Typography>
                                <Typography
                                  level="body3"
                                  sx={{ fontWeight: 'md', color: 'text.secondary' }}
                                >
                                  {new Intl.DateTimeFormat('en-GB', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: '2-digit',
                                  }).format(new Date(timing.created_at))}
                                </Typography>
                              </CardOverflow>
                            </Card>
                          </div>
                        ))
                      : ''}
                  </>
                )
              })}
        </div>
      )}
      {!user_id && isEmployeeSelected === false ? renderEmployeeSelectionText() : ''}
      {!user_id && isRecordNotFound === true ? renderNoRecordFoundMessage() : ''}
      <div style={imageViewerStyle}>
        {isViewerOpen && imagesUrls && (
          <ImageViewer
            src={imagesUrls}
            currentIndex={0}
            disableScroll={false}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
            zIndex={9999}
          />
        )}
      </div>
    </>
  )
}

export default Screenshots
