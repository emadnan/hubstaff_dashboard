import { React } from 'react';
import { Button, DatePicker } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
// const weekFormat = 'MM/DD'

// const { Option } = Select;

const Screenshots = () => {

    const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']
    // const customWeekStartEndFormat = (value) =>
    //     `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    //         .endOf('week')
    //         .format(weekFormat)}`

    // const timezone = {
    //     color: "#787878",
    //     fontSize: "13px",
    //     fontWeight: "500",
    // };

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

    return (
        <>
            <h3>Screenshots</h3>
            <div className='row'>
                <div className='col md-4'>
                    <br></br>
                    <Button type="default" icon={<ArrowLeftOutlined />} />
                    &nbsp;
                    <Button type="default" icon={<ArrowRightOutlined />} />
                    &nbsp;
                    <DatePicker defaultValue={dayjs("01/01/2000", dateFormatList[2])} format={dateFormatList} />
                    &nbsp;
                </div>
            </div>
        </>
    );
}

export default Screenshots
