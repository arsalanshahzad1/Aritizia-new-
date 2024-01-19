import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function UserNotification(props) {
    const { data } = props;
    const userData = JSON.parse(localStorage.getItem('data'))
    console.log(typeof userData?.id, 'adsfhf');
    const navigate = useNavigate();
    const navigateToProfile = (id) => {

        if (userData?.id === id) {
            navigate(`/profile`)
        } else {
            navigate(`/other-profile?add=${id}`)
        }
        console.log(typeof id, 'adsfhf');
        // navigate(`/profile/${id}`)
    }

    // Additional check to ensure data is an array before using map()
    if (!Array.isArray(data)) {
        return null; // or handle the case when data is not an array
    }

    return (
        <>
            {data?.map((res, id) => (
                <div key={id} onClick={() => navigateToProfile(res?.user?.id)} className={`Notification-in-header ${res?.is_seen == 0 ? 'is_seen' : ''}`} >
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
                        </div>
                        <div className='msg-txt'>
                            {res?.description}
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default UserNotification;
