import React from 'react'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { DatePicker, Button, Card } from 'antd'
const { RangePicker } = DatePicker;

const Weekly = () => {

  const arrowStyle = {
    padding: "2px",
    width: "40px",
    color: "black",
  };

  const cardStyle = {
    width: "100%",
  };

  const head = {
    color: "#9E9E9E",
  };

  const subhead = {
    color: "#28B463",
  };

  return (
    <>
      <div className='row'>
        <div className='col-md 6'>
          <h4>Weekly Reports</h4>
        </div>
      </div>
      <br></br>
      <div className='col-md-6'></div>
      <div className='row justify-content-end'>
        <div className='col-md-6'>
          <Button type="default" style={arrowStyle} icon={<ArrowLeftOutlined />} />
          &nbsp;
          <Button type="default" style={arrowStyle} icon={<ArrowRightOutlined />} />
          &nbsp;
          <RangePicker />
          &nbsp; &nbsp;
          <Button type="default">Today</Button>
          &nbsp; &nbsp;
          <Button type="primary">Filters</Button>
        </div>
      </div>
      <br></br>
      <Card style={cardStyle}>
        <div className='row'>
          <div className='col-md-3'>
            <h6 style={head}>PROJECTS WORKED</h6>
            <h3 style={subhead}>1</h3>
          </div>
          <div className='col-md-3'>
          <h6 style={head}>AVG. HOURS PER DAY</h6>
          <h3 style={subhead}>5:35</h3>
          </div>
          <div className='col-md-3'>
          <h6 style={head}>AVG. ACTIVITY</h6>
          <h3 style={subhead}>82%</h3>
          </div>
          <div className='col-md-3'>
          <h6 style={head}>EARNING</h6>
          <h3 style={subhead}>-</h3>
          </div>
        </div>
      </Card>
    </>
  )
}

export default Weekly