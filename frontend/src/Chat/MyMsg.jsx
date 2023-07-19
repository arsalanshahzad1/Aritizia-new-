import React from 'react'
import './Chat.css'
const MyMsg = ({ time, msg , data }) => {
    return (
        <div className='My-message'>
            <div className='time'>
                {data.date}
            </div>
            <div className='msg'>
                {data.text}
            </div>
        </div>
    )
}

export default MyMsg