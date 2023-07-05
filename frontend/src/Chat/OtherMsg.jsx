import React from 'react'

const OtherMsg = ({ img, time, msg }) => {
    return (
        <div className='other-msg'>
            <div className='img-holder'>
                <img src={img} alt="" />
            </div>
            <div className='msg'>
                {msg}
            </div>
            <div className='time'>
                {time}
            </div>
        </div>
    )
}

export default OtherMsg