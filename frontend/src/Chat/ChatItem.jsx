import React from 'react'

const ChatItem = (props) => {
    const { image, name, msg } = props
    return (
        <div className='chat-item'>
            <div className='image-holder'><img src={image} alt="" /></div>
            <div className='text-area'>
                <div className='name-txt'>
                    <span>
                        {name}
                    </span>
                </div>
                <div className='msg-txt'>
                    {msg}
                </div>
            </div>
        </div>
    )
}

export default ChatItem