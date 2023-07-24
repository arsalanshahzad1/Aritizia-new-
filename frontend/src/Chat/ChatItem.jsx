import React from 'react'
import { BiUserCircle } from 'react-icons/bi'

const ChatItem = (props) => {

    const { index, data, ChatMessage, chatIndex } = props
    return (
        <div className={`chat-item ${index == chatIndex ? 'active' : ''}`} onClick={() => ChatMessage(data?.id, index)}>
            <div className='image-holder'>
                {data?.profile_image == null ?
                    <BiUserCircle/>
                    :
                    <img src={data?.profile_image} alt="" />
                }
            </div>
            <div className='text-area'>
                <div className='name-txt'>
                    <span>
                        {data.first_name == null?
                        'User'+ data?.id
                        :
                        data?.first_name
                    }
                    </span>
                </div>
                <div className='msg-txt'>
                    {data?.last_message == null ?
                        <>
                            {data?.file_media.at(-1).file_name}
                            {/* {data?.file_media.lastIndexOf()} */}
                        </>
                        :
                        <>
                            {data?.last_message}
                        </>
                    }
                </div>
            </div>
        </div>
    )
}

export default ChatItem