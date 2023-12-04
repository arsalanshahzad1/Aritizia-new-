import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../../App.css'

function Notification(props) {
    const { data } = props
    const navigate = useNavigate()
    const navigateToChat = (id) => {
        navigate(`/chat/${id}`)
    }
    return (
        <>
            {data.map((res, id) => {
                return (
                    <div onClick={() => navigateToChat(res?.chat_by)} className={`Notification-in-header ${res?.is_seen == 0 ? 'is_seen' : ''}`} >
                        <div className='image-holder'>
                            {res?.user?.profile_image == null ?
                                <img src='/assets/images/user-none.png' alt="" />
                                :
                                <img src={res?.user?.profile_image} alt="" />
                            }
                        </div>
                        <div className='text-area'>
                            <div className='name-txt'>
                                <span>{res?.user?.first_name}</span>
                                Sent you message
                            </div>

                            {res.text == null ?
                                <div className='msg-txt'>{res?.media?.at(-1)?.file_name}</div>
                                :
                                <div className='msg-txt'>{res?.text}</div>
                            }
                        </div>
                    </div>
                )
            })}
        </>

    )
}

export default Notification