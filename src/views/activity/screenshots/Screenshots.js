import React from 'react'
import { DatePicker, Button } from 'antd'
import dayjs from 'dayjs'
import { Select, Form } from 'antd'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
const weekFormat = 'MM/DD'

const Screenshots = () => {
    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
    const customWeekStartEndFormat = (value) =>
        `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
            .endOf('week')
            .format(weekFormat)}`

    const mystyle = {
        color: "white",
        backgroundColor: "DodgerBlue",
        padding: "15px",
        fontFamily: "Arial",
        textAlign: 'center',
        alignSelf: 'flex-end',
    };

    return (
        <>
            <div>Screenshots</div>
            <div className='row'>
                <div className='col md-2'>
                    <Button type="primary">Prev</Button>
                    &nbsp;&nbsp;
                    <DatePicker defaultValue={dayjs("01/01/2000", dateFormatList[2])} format={dateFormatList} />
                    &nbsp;&nbsp;
                    <Button type="primary">Next</Button>
                </div>
                <div className='col md-2'>
                    <div className='row'>
                        <div className='col md-2'>
                            <Form.Item>
                                <Select>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="superadmin">Super Admin</Select.Option>
                                    <Select.Option value="user">User</Select.Option>
                                </Select>
                            </Form.Item>
                            <div className='row '>
                                <Button type="primary">Next</Button>
                            </div>
                            {/* <Button style={{ marginLeft: "50px" }}>Filter</Button> */}
                        </div>
                    </div>
                </div>
            </div>
            <div className='row md-2'>
                <Button type="primary">Next</Button>
            </div>
        </>
    )
}

export default Screenshots
