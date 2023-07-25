import { useNavigate } from 'react-router-dom'
import '../../App.css'

function Notification(props) {
    const { link, image, name, desc, msg, data } = props
    console.log(data);
    const navigate = useNavigate()
    const navigateToChat = (id) => {
        // if (link) {
            navigate(`/chat/${id}`)
        // }
    }
    return (
        <>
            {data.map((res, id) => {
                return (
                    <div onClick={() => navigateToChat(res?.chat_by)} className={`Notification-in-header ${res?.is_seen == 0 ? 'is_seen' : ''}`} >
                        <div className='image-holder'><img src={res?.user?.profile_image} alt="" /></div>
                        <div className='text-area'>
                            <div className='name-txt'>
                                <span>
                                    {res?.user?.first_name}
                                </span>
                                {desc}
                            </div>

                            {res.text == null ?
                                <div className='msg-txt'>
                                {res?.media?.at(-1)?.file_name}
                            </div>
                                :
                                <div className='msg-txt'>
                                    {res?.text}
                                </div>
                            }



                        </div>
                    </div>
                )
            })}
        </>

    )
}

export default Notification