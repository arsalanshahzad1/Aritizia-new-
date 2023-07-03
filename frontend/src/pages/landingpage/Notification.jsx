import { useNavigate } from 'react-router-dom'
import '../../App.css'

function Notification(props) {
    const { link, image, name, desc, msg } = props
    const navigate = useNavigate()
    const navigateToChat = () => {
        if (link) {
            navigate(link)
        }
    }
    return (
        <div onClick={navigateToChat} className='Notification-in-header'>
            <div className='image-holder'><img src={image} alt="" /></div>
            <div className='text-area'>
                <div className='name-txt'>
                    <span>
                        {name}
                    </span>
                    {desc}
                </div>
                {msg &&
                    <div className='msg-txt'>
                        {msg}
                    </div>
                }
            </div>
        </div>

    )
}

export default Notification