import React from 'react'

const ChatItem = (props) => {
    
    const { image, name, msg, data , ChatMessage } = props
    return (
        <div className='chat-item' onClick={()=>ChatMessage(data.id)}>
            <div className='image-holder'>
                <img src={data.profile_image} alt="" /></div>
            <div className='text-area'>
                <div className='name-txt'>
                    <span>
                        {data.first_name}
                    </span>
                </div>
                <div className='msg-txt'>
                    {data.last_message}
                </div>
            </div>
        </div>
    )
}

export default ChatItem