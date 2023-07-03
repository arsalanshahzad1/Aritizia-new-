import React from 'react'
import './Chat.css'
const MyMsg = ({ time, msg }) => {
    return (
        <div className='My-message'>
            <div className='time'>
                {time}
            </div>
            <div className='msg'>
                {msg}
            </div>
        </div>
    )
}

export default MyMsg