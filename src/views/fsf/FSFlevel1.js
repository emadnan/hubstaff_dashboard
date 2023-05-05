import React from 'react'
import {Card} from 'antd'

function FSFlevel1() {

  const heading = {
    textAlign: 'center',
  };

  return (
    <>
      <div className='row'>
        <div className='col-md 6'></div>
        <div className='col-md 6'>
          <h3 style={heading}>Functional Specification Form</h3>
        </div>
        <div className='col-md 6'></div>
      </div>
      <br></br>
      <div className='row'>
        <div className='col-md 6'></div>
        <div className='col-md 6'>
          <h4 style={heading}>Level 1</h4>
        </div>
        <div className='col-md 6'></div>
      </div>
      <br></br>
      <Card style={{ width: 300 }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </>
  )
}

export default FSFlevel1