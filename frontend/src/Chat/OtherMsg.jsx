import React from 'react'

const OtherMsg = ({ img, time, msg , data }) => {
    return (
        <div className='other-msg'>
            <div className='img-holder'>
                <img src={img} alt="" />
            </div>
            <div className='msg'>
                {data.text}
            </div>
            <div className='time'>
                {data.date}
            </div>
        </div>
    )
}

export default OtherMsg