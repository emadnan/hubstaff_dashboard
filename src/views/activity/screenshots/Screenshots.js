import { React, useState, useEffect, useCallback } from 'react'
import { Button, DatePicker, Select, Form } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import ImageViewer from 'react-simple-image-viewer'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import AspectRatio from '@mui/joy/AspectRatio'
import Box from '@mui/joy/Box'
import Card from '@mui/joy/Card'
import CardOverflow from '@mui/joy/CardOverflow'
import Divider from '@mui/joy/Divider'
import Typography from '@mui/joy/Typography'
import dayjs from 'dayjs'
import Geocode from 'react-geocode'
const { RangePicker } = DatePicker
dayjs.extend(customParseFormat)

const Screenshots = () => {
  //Local Storage data
  const local = JSON.parse(localStorage.getItem('user-info'))

  //CSS Styling
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
  };

  const userStyle2 = {
    fontFamily: "Arial",
    fontSize: 20,
    fontWeight: "bold",
    color: "#0070FF ",
  };

  //Functions for Date handling
  function onRangeChange(dates, dateStrings) {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
      getDateWiseScreenshots(dateStrings[0], dateStrings[1], local.Users.user_id)
    } else {
      console.log('Clear')
    }
  }

  //Array declaration for API calls
  const [images, setImages] = useState([])
  const [users, setUsers] = useState([])
  const [project, setProject] = useState([])
  const [addresses, setAddresses] = useState([])
  const [user_id, setUserId] = useState('')
  const [project_id, setProjectId] = useState('')
  const userdata = local.Users
  const [address, setAddress] = useState('')
  const [todayWork, setTodayWork] = useState([])
  const [totalhours, setTotalHours] = useState("");
  const [totalminutes, setTotalMinutes] = useState("");
  const [totalseconds, setTotalSeconds] = useState("");
  var filteredUsers = []
  var screenfilter = []
  var addressLocate = ''

  const [imagesUrls, setImagesUrls] = useState([])
  //Initial rendering through useEffect
  useEffect(() => {
    getUsers()
    getProjects()
    getScreenshots()
  }, [])

  // Get API calls
  function getScreenshots() {
    fetch('http://10.3.3.80/api/get_Project_Screenshots')
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          screenfilter = data.projectscreenshot
        } else if (local.Users.role === 3) {
          screenfilter = data.projectscreenshot.filter(
            (screenshot) => screenshot.company_id === local.Users.company_id,
          )
        } else if (local.Users.role === 5) {
          screenfilter = data.projectscreenshot.filter(
            (screenshot) => screenshot.user_id === local.Users.user_id,
          )
        }
        setImages(screenfilter)
      })
      .catch((error) => console.log(error))
  }

  function getUsers() {
    fetch('http://10.3.3.80/api/get_users')
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1) {
          filteredUsers = data.Users
        } else if (local.Users.role === 3) {
          filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id)
        } else if (local.Users.role === 5) {
          filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id)
        }
        setUsers(filteredUsers.slice(1))
      })
      .catch((error) => console.log(error))
  }

  function getDateWiseScreenshots(a, b, c) {
    fetch(`http://10.3.3.80/api/get_projectscreenshot_by_date/${a}/${b}/${c}`)
      .then((response) => response.json())
      .then((data) => {
        if (local.Users.role === 1 || local.Users.role === 3) {
          screenfilter = data.projectscreenshot
        } else {
          screenfilter = data.projectscreenshot.filter(
            (screenshot) => screenshot.user_id === local.Users.user_id,
          )
        }
        setImages(screenfilter)
      })
      .catch((error) => console.log(error))
  }

  function getProjects() {
    fetch('http://10.3.3.80/api/getproject')
      .then((response) => response.json())
      .then((data) => setProject(data.projects))
      .catch((error) => console.log(error))
  }

  function getTodayWorkedTime() {
    setTotalHours('');
    setTotalMinutes('');
    setTotalSeconds('');
    getTodayWorked(user_id);
  }

  function getTodayWorked(id) {
    fetch(`http://10.3.3.80/api/getTotalWorkbyUserId/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTotalHours(data.hours);
        setTotalMinutes(data.minutes);
        setTotalSeconds(data.seconds);
      })
      .catch((error) => console.log(error));
  };

  //Functions for Selected image
  const [isViewerOpen, setIsViewerOpen] = useState(false)

  const handleClick = useCallback((imageUrl) => {
    let urls = imageUrl.map(function (url) {
      return url['path_url']
    })
    setImagesUrls(urls)
    setIsViewerOpen(true)
  }, [])

  const closeImageViewer = () => {
    setImagesUrls(null)
    setIsViewerOpen(false)
  }

  const handleUserChange = (value) => {
    setUserId(value)
    getTodayWorked(value)
    const locations = images.filter((locate) => {
      if (local.Users.role === 3) {
        return locate.user_id === value
      } else {
        return locate.user_id === value
      }
    })
    // getTodayWorkedTime();
    getAddresses(locations[0].latitude, locations[0].longitude)
  }

  //Geolocation get using Google

  const getAddresses = async (lat, long) => {
    const apiKey = 'AIzaSyBSBflGv5OULqd9TPMLKecXIig07YXKW2A' // Replace with your own API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (data.status === 'OK') {
        const result = data.results.find((result) => result.geometry.location_type === 'ROOFTOP')
        const address = result ? result.formatted_address : data.results[0].formatted_address
        console.log(address)
        console.log(data)
        setAddresses(address)
      } else {
        console.error(data.status)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {
        local.Users.role === 3 ? (
          <div>
            <h3>Location {addresses.length > 0 && <h3 style={userStyle}>{addresses}</h3>}</h3>
            <br></br>
            <h3>Today Worked {totalhours}:{totalminutes}:{totalseconds}</h3>
          </div>
        ) : local.Users.role === 5 ? (
          <h3 style={userStyle2}>{local.Users.name}</h3>
        ) : null
      }
      <div className="row">
        <div className="col-md-4">
          <br></br>
          <Button type="default" icon={<ArrowLeftOutlined />} />
          &nbsp;
          <Button type="default" icon={<ArrowRightOutlined />} />
          &nbsp;
          <RangePicker format="YYYY-MM-DD" onChange={onRangeChange} />
          <Button type="default" onClick={getScreenshots}>
            Today
          </Button>
        </div>
        <div className="col-md-4"></div>
        {local.Users.role === 1 || local.Users.role === 3 ? (
          <div className="col-md-4 mt-4">
            <div className="row">
              <div className="col-md-4"></div>
              <div className="col-md-8">
                <Form.Item name="select" hasFeedback>
                  <Select placeholder="Members" onChange={handleUserChange} value={user_id}>
                    {users.map((user) => (
                      <Select.Option value={user.id} key={user.id}>
                        {user.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <Divider></Divider>
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
                                <img src={attach.path_url} alt={attach.path_url} />
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backdropFilter: 'blur(10px)',
                                    padding: '8px',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                  }}
                                >
                                  {/* Replace the count with your desired value */}
                                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                    {timing.getattechments.length}
                                  </span>
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
                              <img src={attach.path_url} alt={attach.path_url} />
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '50%',
                                  left: '50%',
                                  transform: 'translate(-50%, -50%)',
                                  backdropFilter: 'blur(10px)',
                                  padding: '8px',
                                  borderRadius: '4px',
                                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                }}
                              >
                                {/* Replace the count with your desired value */}
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                  {timing.getattechments.length}
                                </span>
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
          })}
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
      </div>
    </>
  )
}

export default Screenshots
