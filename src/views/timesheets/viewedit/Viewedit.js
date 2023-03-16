import { React, useState } from 'react';
import { Divider, Button, DatePicker, Form, Select, Checkbox, Radio, Modal} from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
// const weekFormat = 'MM/DD'
const { Option } = Select;
const { RangePicker } = DatePicker;

const Viewedit = () => {

  // const customWeekStartEndFormat = (value) =>
  //   `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
  //     .endOf('week')
  //     .format(weekFormat)}`

  //CSS Styling
  const heading = {
    display: 'flex',
    justifyContent: 'flex-left',
    float: 'left',
  };

  const heading1 = {
    display: 'flex',
    justifyContent: 'flex-center',
    float: 'center',
  };

  const timezone = {
    color: "#787878",
    fontSize: "13px",
    fontWeight: "500",
  };

  const modalStyle = {
    position: "fixed",
    top: "25%",
    left: "40%",
  };

  //Functions for Filter Modal
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
      <div className='row'>
        <div className='col-md-4'>
          <h3>View & Edit</h3>
        </div>
        <div className='col-md-4 d-flex justify-content-center'>
          <Radio.Group defaultValue="a" size="medium" style={heading1}>
            <Radio.Button value="a">Daily</Radio.Button>
            <Radio.Button value="b">Weekly</Radio.Button>
            <Radio.Button value="c">Calendar</Radio.Button>
          </Radio.Group>
        </div>
        <div className='col-md-4'></div>
      </div>

      <div className='row'>
        <div className='col md-3'>
          <br></br>
          <RangePicker />
        </div>
        <div className='col-md-6'></div>
        <div className='col-md-3'>
          <div className='row'>
            <div className='col-md-6 mt-4'>
              <Form.Item name="select" hasFeedback>
                <Select placeholder="Members">
                  <Option value="Member 1">Member 1</Option>
                  <Option value="Member 2">Member 2</Option>
                  <Option value="Member 3">Member 3</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-6 mt-4'>
              <Button type="primary" onClick={showModal}>Filters</Button>
            </div>
          </div>
        </div>
      </div>

      <br></br>
      <div className='row'>
        <div className='col md-2'>
          <Checkbox></Checkbox>
        </div>
        {/* <div className='col md-3'></div> */}
        <div className='col md-2'>
          <h6 style={heading}>Project</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6 style={heading}>Activity</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6 style={heading}>Idle</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6 style={heading1}>Manual</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6 style={heading1}>Duration</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6 style={heading1}>Time</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6 style={heading1}>Actions</h6>
        </div>
        &nbsp;
        <Divider></Divider>
      </div>

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
  )
}

export default Viewedit