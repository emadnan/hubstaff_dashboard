import { React, useState, useEffect } from 'react';
import { Button, DatePicker, Select, Form, Divider } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs';
import Geocode from "react-geocode";
const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat)

const Screenshots = () => {

    //Local Storage data
    const local = JSON.parse(localStorage.getItem('user-info'));

    //CSS Styling
    const imageContainer = {
        display: "flex",
        flexWrap: "wrap",
    };

    const projectNameStyle = {
        color: "#0070ff",
        fontWeight: "bold",
        textAlign: "center",
    };

    const projectTimeStyle = {
        color: "#0070ff",
        fontWeight: "bold",
        textAlign: "center",
    };

    const imageWrapper = {
        margin: "10px",
        display: "flex",
        flexDirection: "row",
    };

    const timingStyle = {
        display: "flex",
        flexDirection: "row",
    };

    const userStyle = {
        color: "black",
        fontSize: 18,
    };

    const cardStyle = {
        color: "#0070ff",
        display: "flex",
    };

    //Functions for Date handling
    function onRangeChange(dates, dateStrings) {
        if (dates) {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            getDateWiseScreenshots(dateStrings[0], dateStrings[1], local.Users.user_id);
        } else {
            console.log('Clear');
        }
    };

    //Array declaration for API calls
    const [images, setImages] = useState([]);
    const [users, setUsers] = useState([]);
    const [project, setProject] = useState([]);
    const [user_id, setUserId] = useState("");
    const [project_id, setProjectId] = useState("");
    const userdata = local.Users;
    const [address, setAddress] = useState("");
    var filteredUsers = [];
    var screenfilter = [];
    var addressLocate = "";

    //Initial rendering through useEffect
    useEffect(() => {
        getUsers()
        getProjects()
        getScreenshots()
    }, []);

    // Get API calls
    function getScreenshots() {
        fetch("http://10.3.3.80/api/get_Project_Screenshots")
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === "1") {
                    screenfilter = data.projectscreenshot;
                }
                else if (local.Users.role === "3") {
                    screenfilter = data.projectscreenshot.filter((screenshot) => screenshot.company_id === local.Users.company_id);
                }
                else {
                    screenfilter = data.projectscreenshot.filter((screenshot) => screenshot.user_id === local.Users.user_id);
                }
                setImages(screenfilter);
            })
            .catch((error) => console.log(error));
    };

    function getUsers() {
        fetch("http://10.3.3.80/api/get_users")
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === "1") {
                    filteredUsers = data.Users;
                }
                else if (local.Users.role === "3") {
                    filteredUsers = data.Users.filter((user) => user.company_id === local.Users.company_id);
                }
                else if (local.Users.role === "5") {
                    filteredUsers = data.Users.filter((user) => user.id === local.Users.user_id);
                }
                setUsers(filteredUsers.slice(1));
            })
            .catch((error) => console.log(error));
    };

    function getDateWiseScreenshots(a, b, c) {
        fetch(`http://10.3.3.80/api/get_projectscreenshot_by_date/${a}/${b}/${c}`)
            .then((response) => response.json())
            .then((data) => {
                if (local.Users.role === "1" || local.Users.role === "3") {
                    screenfilter = data.projectscreenshot;
                } else {
                    screenfilter = data.projectscreenshot.filter((screenshot) => screenshot.user_id === local.Users.user_id);
                }
                setImages(screenfilter);
            })
            .catch((error) => console.log(error));
    };

    function getProjects() {
        fetch("http://10.3.3.80/api/getproject")
            .then((response) => response.json())
            .then((data) => setProject(data.projects))
            .catch((error) => console.log(error));
    };

    //Functions for Selected image
    const [selectedImage, setSelectedImage] = useState(null);

    const handleClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    }

    const handleCloseModal = () => {
        setSelectedImage(null);
    }

    const handleUserChange = (value) => {
        setUserId(value);
        console.log(user_id);
    };

    //Geolocation get using Google
    Geocode.setApiKey("AIzaSyBSBflGv5OULqd9TPMLKecXIig07YXKW2A");
    Geocode.setLanguage("en");
    Geocode.setRegion("pk");
    Geocode.setLocationType("ROOFTOP");
    images.filter((locate) => {
        if (local.Users.role === "3") {
            return locate.user_id === user_id;
        } else if (local.Users.role === "5") {
            return locate.user_id === local.Users.user_id;
        }
        return false;
    }).forEach((locate) => {
        Geocode.fromLatLng(locate.latitude, locate.longitude).then(
            (response) => {
                setAddress(response.results[0].formatted_address);
                console.log(address);
            },
            (error) => {
                console.error(error);
            }
        );
    });

    return (
        <>
            <h6 style={userStyle}>{address}</h6>
            <div className='row'>
                <div className='col-md-4'>
                    <br></br>
                    <Button type="default" icon={<ArrowLeftOutlined />} />
                    &nbsp;
                    <Button type="default" icon={<ArrowRightOutlined />} />
                    &nbsp;
                    <RangePicker
                        format="YYYY-MM-DD"
                        onChange={onRangeChange}
                    />
                    <Button type='default' onClick={getScreenshots}>Today</Button>
                </div>
                <div className='col-md-4'></div>
                {
                    local.Users.role === "1" || local.Users.role === "3" ? (
                        <div className='col-md-4 mt-4'>
                            <div className='row'>
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
                    ) : null
                }


            </div>
            <Divider></Divider>
            <div style={imageContainer}>
                {user_id ? images.filter((image) => image.user_id === user_id).map((image) => {

                    return (
                        <div key={image.id}>
                            {image.get_timings.map((timing) => (
                                <div key={timing.id} style={timingStyle}>
                                    {timing.getattechments.map((attach) => (
                                        <div key={attach.id} style={{ marginRight: '10px' }}>
                                            <h6 style={projectNameStyle}>{image.project_name}-{image.stream_name}</h6>
                                            <br></br>
                                            <a href={attach.path_url}>
                                                <img className='card' src={attach.path_url} style={{ width: '100%', height: 'auto' }} alt="" onClick={() => handleClick(attach.path_url)} />
                                            </a>
                                            <h6 style={projectTimeStyle}>{new Date(timing.start_time).toLocaleTimeString().substring(0, 11)}</h6>
                                        </div>
                                    ))}
                                    <br></br>
                                </div>
                            ))}
                        </div>
                    );

                })
                    : images.map((image) => {

                        return (
                            <div key={image.id}>
                                {image.get_timings.map((timing) => (
                                    <div key={timing.id} style={timingStyle}>
                                        {timing.getattechments.map((attach) => (
                                            <div key={attach.id} style={{ marginRight: '10px' }}>
                                                <h6 style={projectNameStyle}>{image.project_name}-{image.stream_name}</h6>
                                                <br></br>
                                                <a href={attach.path_url}>
                                                    <img className='card' src={attach.path_url} style={{ width: '100%', height: 'auto' }} alt="" onClick={() => handleClick(attach.path_url)} />
                                                </a>
                                                <h6 style={projectTimeStyle}>{new Date(timing.start_time).toLocaleTimeString().substring(0, 11)}</h6>
                                            </div>
                                        ))}
                                        <br></br>
                                    </div>
                                ))}
                            </div>
                        );

                    })}

                {selectedImage && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={handleCloseModal}>
                                &times;
                            </span>
                            <img src={selectedImage} alt="" />
                        </div>
                    </div>
                )}

            </div>
        </>
    );
}

export default Screenshots