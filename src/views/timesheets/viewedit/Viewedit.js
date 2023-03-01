import { React } from 'react'
import { DatePicker, Button, Divider } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const weekFormat = 'MM/DD'

const { RangePicker } = DatePicker;

const Viewedit = () => {

  const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
  const customWeekStartEndFormat = (value) =>
    `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
      .endOf('week')
      .format(weekFormat)}`

  const mystyle = {
    padding: "0px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-start',
    color: '#3366ff',
  };
  const mystyle2 = {
    padding: "0px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-start',
    color: 'black',
  };
  const mystyle1 = {
    padding: "0px",
    fontFamily: "Arial",
    textAlign: 'center',
    alignSelf: 'flex-self',
    color: '#3366ff',
    backgroundColor: "#cccccc",
    borderRadius: "25px",
  };
  const style3 = {
    color: 'blue',
  }
  const style4 = {
    display: 'flex',
    justifyContent: 'flex-end',
    float: 'right',
  }
  const headingStyle = {
    color: 'blue',
  }
  const divider = {
    color: 'blue',
    height: '20px',
  }

  return (
    <>
      <h3 style={headingStyle}>View & Edit Timesheets</h3>

      <div className='row'>
        <div className='col-md-4'></div>

        <div className='col-md-4' style={mystyle1}>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-1'>
              <Button shape='round' size='large' type="link" style={mystyle2}>Daily</Button>
            </div>
            <div className='col-md-2'></div>
            <div className='col-md-1'>
              <Button shape='round' size='large' type="link" style={mystyle2}>Weekly</Button>
            </div>
            <div className='col-md-2'></div>
            <div className='col-md-1'>
              <Button shape='round' size='large' type="link" style={mystyle2}>Calendar</Button>
            </div>
            <div className='col-md-2'></div>
          </div>
        </div>

        <div className='col-md-4'></div>
      </div>

      <div className='row'>
        <div className='col-md 6'>
          <RangePicker />
        </div>
        <div className='col-md 6'>
          <Button style={style4}>Filter</Button>
        </div>
      </div>
      <br></br>

      <div className='row'>
        <input type="checkbox" />
        <Divider />
      </div>
    </>
  )
}

export default Viewedit