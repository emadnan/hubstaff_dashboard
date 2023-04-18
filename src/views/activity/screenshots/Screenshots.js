import { React, useState, useEffect } from 'react';
import { Button, DatePicker, Select, Form, Divider } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
dayjs.extend(customParseFormat)
// const { Option } = Select;
// const weekFormat = 'MM/DD'

const Screenshots = () => {

    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
    // const customWeekStartEndFormat = (value) =>
    //     `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    //         .endOf('week')
    //         .format(weekFormat)}`

    // const timezone = {
    //     color: "#787878",
    //     fontSize: "13px",
    //     fontWeight: "500",
    // };

    const local = JSON.parse(localStorage.getItem('user-info'));

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
        fontSize: 30,
    };

    function onRangeChange(dates, dateStrings) {
        if (dates) {
            console.log('From: ', dates[0], ', to: ', dates[1]);
            console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
            getDateWiseScreenshots(dateStrings[0], dateStrings[1], local.Users.user_id);
        } else {
            console.log('Clear');
        }
    };

    const [images, setImages] = useState([]);
    const [users, setUsers] = useState([]);
    const [project, setProject] = useState([]);
    const [user_id, setUserId] = useState("");
    const [project_id, setProjectId] = useState("");
    const userdata = local.Users;
    var filteredUsers = [];
    var screenfilter = [];

    // Get API call
    function getScreenshots() {
        fetch("http://10.3.3.80/api/get_Project_Screenshots")
            .then((response) => response.json())
            .then((data) => {
                if(local.Users.role === "1"){
                    screenfilter = data.projectscreenshot;
                }
                else if (local.Users.role === "3"){
                    screenfilter = data.projectscreenshot.filter((screenshot) => screenshot.company_id === local.Users.company_id);
                }
                else{
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
            if(local.Users.role === "1" || local.Users.role === "3"){
                screenfilter = data.projectscreenshot;
            }else{
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

    useEffect(() => {
        getUsers()
        getProjects()
        getScreenshots()
    }, []);

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

    const currentDate = new Date().toISOString().slice(0, 10);

    return (
        <>
            <h6 style={userStyle}>{userdata.name}</h6>
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
                                                <a href={attach.path_url}>
                                                    <img className='card' src={attach.path_url} style={{ width: '100%', height: 'auto' }} alt="" onClick={() => handleClick(attach.path_url)} />
                                                </a>
                                                <h6 style={projectTimeStyle}>{new Date(timing.start_time).toLocaleTimeString().substring(0, 11)}</h6>
                                            </div>
                                        ))}
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

            {/* <Modal title="Filters" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

                <div className="form-outline mb-3">
                    <Form.Item name="select" hasFeedback>
                        <label style={timezone}>TIMEZONE</label>
                        <Select placeholder="Timezone">
                            <Option value="Member's Time Zone">Member&apos;s Time Zone</Option>
                            <Option value="My Time Zone">My Time Zone</Option>
                            <Option value="Biafotech Time Zone">Biafotech Time Zone</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="form-outline mb-3">
                    <Form.Item name="select" hasFeedback>
                        <label style={timezone}>ACTIVITY LEVEL</label>
                        <Select placeholder="All levels">
                            <Option value="95%">&#62;95%</Option>
                            <Option value="85%">&#62;85%</Option>
                            <Option value="75%">&#62;75%</Option>
                            <Option value="65%">&#62;65%</Option>
                            <Option value="55%">&#62;55%</Option>
                            <Option value="45%">&#62;45%</Option>
                            <Option value="35%">&#62;35%</Option>
                            <Option value="25%">&#62;25%</Option>
                            <Option value="15%">&#62;15%</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="form-outline mb-3">
                    <Form.Item name="select" hasFeedback>
                        <label style={timezone}>SOURCE</label>
                        <Select placeholder="All types">
                            <Option value="Desktop">Desktop</Option>
                            <Option value="Mobile">Mobile</Option>
                            <Option value="Browser">Browser</Option>
                            <Option value="Web Timer">Web Timer</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="form-outline mb-3">
                    <Form.Item name="select" hasFeedback>
                        <label style={timezone}>TIME TYPE</label>
                        <Select placeholder="All types">
                            <Option value="Normal">Normal</Option>
                            <Option value="Idle">Idle</Option>
                            <Option value="Resumed">Resumed</Option>
                            <Option value="Manual">Manual</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="form-outline mb-3">
                    <Form.Item name="select" hasFeedback>
                        <label style={timezone}>PROJECT</label>
                        <Select placeholder="All projects">
                            <Option value="Office Work">Office Work</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className="form-outline mb-3">
                    <Form.Item name="select" hasFeedback>
                        <label style={timezone}>MEMBER</label>
                        <Select placeholder="Members">
                            <Option value="Demo Member">Demo Member</Option>
                        </Select>
                    </Form.Item>
                </div>

            </Modal> */}

        </>
    );
}

export default Screenshots
