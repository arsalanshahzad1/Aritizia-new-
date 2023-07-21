import { useNavigate } from 'react-router-dom'
import '../../App.css'

function Notification(props) {
    const { link, image, name, desc, msg, data } = props
    console.log(data);
    const navigate = useNavigate()
    const navigateToChat = () => {
        // if (link) {
            navigate('/chat')
        // }
    }
    return (
        <>
            {data.map((res, id) => {
                return (
                    <div onClick={navigateToChat} className='Notification-in-header'>
                        <div className='image-holder'><img src={res.user.profile_image} alt="" /></div>
                        <div className='text-area'>
                            <div className='name-txt'>
                                <span>
                                    {res.user.first_name}
                                </span>
                                {desc}
                            </div>

                            {res.text == null ?
                                <div className='msg-txt'>
                                {res?.media?.at(-1)?.file_name}
                            </div>
                                :
                                <div className='msg-txt'>
                                    {res.text}
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