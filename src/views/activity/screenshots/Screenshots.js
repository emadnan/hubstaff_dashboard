import { React, useState } from 'react';
import { Button, DatePicker, Select, Form, Divider, Modal } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import screen1 from 'src/assets/screenshots/screen1.png';
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const { Option } = Select;
// const weekFormat = 'MM/DD'

const Screenshots = () => {

    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
    // const customWeekStartEndFormat = (value) =>
    //     `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    //         .endOf('week')
    //         .format(weekFormat)}`

    const timezone = {
        color: "#787878",
        fontSize: "13px",
        fontWeight: "500",
    };

    // const heading = {
    //     display: 'flex',
    //     justifyContent: 'flex-center',
    //     float: 'center',
    // };

    // const heading1 = {
    //     display: 'flex',
    //     justifyContent: 'flex-center',
    //     float: 'right',
    // };

    // const dater = {
    //     display: 'flex',
    //     justifyContent: 'flex-start',
    //     float: 'left',
    //     color: "blue",
    //     backgroundColor: "green",
    // };

    const modalStyle = {
        position: "fixed",
        top: "25%",
        left: "40%",
    };

    // Functions of Add Company Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <h3>Screenshots</h3>
            <div className='row'>
                <div className='col-md-4'>
                    <br></br>
                    <Button type="default" icon={<ArrowLeftOutlined />} />
                    &nbsp;
                    <Button type="default" icon={<ArrowRightOutlined />} />
                    &nbsp;
                    <DatePicker defaultValue={dayjs("01/01/2000", dateFormatList[2])} format={dateFormatList} />
                </div>
                <div className='col-md-4'></div>
                <div className='col-md-4 mt-4'>
                    <div className='row'>
                        <div className='col-md-8'>
                            <Form.Item name="select" hasFeedback>
                                <Select placeholder="Members">
                                    <Option value="Member 1">Member 1</Option>
                                    <Option value="Member 2">Member 2</Option>
                                    <Option value="Member 3">Member 3</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <div className='col-md-4'>
                            <Button type="primary" onClick={showModal}>Filters</Button>
                        </div>
                    </div>
                </div>
            </div>
            <Divider></Divider>

            <img src={screen1} width={350} height={250} alt='' />
            <img src={screen1} width={350} height={250} alt='' />

            <Modal title="Filters" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} style={modalStyle}>

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


            </Modal>
        </>
    );
}

export default Screenshots
