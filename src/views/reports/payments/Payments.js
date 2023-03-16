import React from 'react'
import { DatePicker, Button, Card } from 'antd'
const { RangePicker } = DatePicker;

const Payments = () => {
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
          <h4>Payments Reports</h4>
        </div>
      </div>
      <br></br>
      <div className='col-md-6'></div>
      <div className='row justify-content-end'>
        <div className='col-md-6'>
          <RangePicker />
          &nbsp; &nbsp;
          <Button type="primary">Filters</Button>
        </div>
      </div>
      <br></br>
      <Card style={cardStyle}>
        <div className='row'>
          <div className='col-md-6'>
            <h6 style={head}>PAYMENTS</h6>
            <h3 style={subhead}>-</h3>
          </div>
          <div className='col-md-6'>
            <h6 style={head}>AMOUNT</h6>
            <h3 style={subhead}>-</h3>
          </div>
        </div>
      </Card>
    </>
  )
}

export default Payments