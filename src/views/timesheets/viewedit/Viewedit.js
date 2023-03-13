import { React } from 'react';
import { Divider, Button, DatePicker, Form, Select, Checkbox, Radio } from 'antd'
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

  // const timezone = {
  //   color: "#787878",
  //   fontSize: "13px",
  //   fontWeight: "500",
  // };

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
              <Button type="primary">Filters</Button>
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
    </>
  )
}

export default Viewedit