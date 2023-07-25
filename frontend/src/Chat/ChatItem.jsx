import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BiUserCircle } from 'react-icons/bi'

const ChatItem = ({ data, activeUserId }) => {
    const navigate = useNavigate()
    const navigateToChat = (id) => {
        navigate(`/chat/${id}`)
    }

    console.log(data.user_id, 'data?.chat_by');
    console.log(activeUserId, 'activeUserId');

    return (
        <div className={`chat-item ${activeUserId == data?.user_id ? 'active' : ''} ${data?.unseen_count > 0 && activeUserId != data?.user_id ? 'un_seen' : ''}`}
            onClick={() => { navigateToChat(data?.user_id) }}
            style={{ position: 'relative' }}
        >
            <div className='image-holder'>
                {data?.profile_image == null ?
                    <img src='../public/assets/images/user-none.png' alt="" />
                    :
                    <img src={data?.profile_image} alt="" />
                }
            </div>
            <div className='text-area'>
                <div className='name-txt'>
                    <span>
                        {data.first_name == null ?
                            'User' + data?.id
                            :
                            data?.first_name
                        }
                    </span>
                </div>
                <div className='msg-txt'>
                    {data?.last_message == null ?
                        <>
                            {data?.file_media.at(-1).file_name}
                        </>
                        :
                        <>
                            {data?.last_message}
                        </>
                    }
                </div>
            </div>
            {data?.unseen_count > 0 &&
                <span className='message-count'>

                    {data?.unseen_count}

                </span>
            }

        </div>
    )
}

export default ChatItem