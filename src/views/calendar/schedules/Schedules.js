import { React } from 'react';
import { Button, DatePicker, Form, Select } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const { Option } = Select;
const Schedules = () => {

  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']

  const timezone = {
    color: "#787878",
    fontSize: "13px",
    fontWeight: "500",
  };

  return (
    <>
        <h3>Schedules</h3>
        <div className='row'>
            <div className='col md-4'>
                <br></br>
                <Button type="default" icon={<ArrowLeftOutlined />} />
                &nbsp;
                <Button type="default" icon={<ArrowRightOutlined />} />
                &nbsp;
                <DatePicker defaultValue={dayjs("01/01/2000", dateFormatList[2])} format={dateFormatList} />
                &nbsp;
                <Button type='default'>Today</Button>
            </div>
            <div className='col-md-4'></div>
        <div className='col-md-4'>
          <div className='row'>
            <div className='col-md-6'>
              <Form.Item name="select" hasFeedback>
                <label style={timezone}>Events</label>
                <Select placeholder="Select Event">
                  <Option value="Holidays">Holidays</Option>
                  <Option value="Shifts">Shifts</Option>
                  <Option value="Time Offs">Time Offs</Option>
                </Select>
              </Form.Item>
            </div>
            <div className='col-md-6'>
              <Form.Item name="select" hasFeedback>
                <label style={timezone}>Members</label>
                <Select placeholder="Select Member">
                  <Option value="Member1">Member1</Option>
                  <Option value="Member2">Member2</Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </div>
        </div>
    </>
);
}

export default Schedules