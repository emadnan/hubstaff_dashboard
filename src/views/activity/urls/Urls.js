import { React } from 'react';
import { Divider, Button, DatePicker, Form, Select } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
// const weekFormat = 'MM/DD'

const { Option } = Select;

const Card = () => {

  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
  // const customWeekStartEndFormat = (value) =>
  //   `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
  //     .endOf('week')
  //     .format(weekFormat)}`

  const timezone = {
    color: "#787878",
    fontSize: "13px",
    fontWeight: "500",
  };

  const heading = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  };

  // const dater = {
  //   display: 'flex',
  //   justifyContent: 'flex-start',
  //   float: 'left',
  //   color: "blue",
  //   backgroundColor: "green",
  // };

  return (
    <>
      <h3>URL Activity</h3>
      <div className='row'>
        <div className='col md-4'>
          <br></br>
          <Button type="default" icon={<ArrowLeftOutlined />} />
          &nbsp;
          <Button type="default" icon={<ArrowRightOutlined />} />
          &nbsp;
          <DatePicker defaultValue={dayjs("01/01/2000", dateFormatList[2])} format={dateFormatList} />
          &nbsp;
          <Button>Today</Button>
          &nbsp;
          <Button>All Notes</Button>
        </div>
        <div className='col-md-2'></div>
        <div className='col-md-6'>
          <div className='row'>
            <div className='col-md-4'>
              <Form.Item name="select" hasFeedback>
                <label style={timezone}>TIMEZONE</label>
                <Select placeholder="Timezone">
                  <Option value="Member's Time Zone">Member&apos;s Time Zone</Option>
                  <Option value="My Time Zone">My Time Zone</Option>
                  <Option value="Biafotech Time Zone">Biafotech Time Zone</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-4'>
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
            <div className='col-md-4'>
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
            <div className='col-md-4'>
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
            <div className='col-md-4'>
              <Form.Item name="select" hasFeedback>
                <label style={timezone}>PROJECT</label>
                <Select placeholder="All projects">
                  <Option value="Office Work">Office Work</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-4'>
              <Form.Item name="select" hasFeedback>
                <label style={timezone}>MEMBER</label>
                <Select placeholder="Members">
                  <Option value="Demo Member">Demo Member</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>

        <div className='col md-2'>
          <h6>Project</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6>Site</h6>
        </div>
        <div className='col md-3'></div>
        <div className='col md-2'>
          <h6 style={heading}>Time Spent(hrs)</h6>
        </div>
        &nbsp;
        <Divider></Divider>
      </div>
    </>
  );
}

export default Card;

