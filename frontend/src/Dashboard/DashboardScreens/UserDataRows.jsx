import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function UserDataRows() {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const NavigateToUser = () => {
        navigate('/dashboard/user-management/user-1')
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (

        <tr onClick={NavigateToUser}>
            <td>01</td>
            <td>xasda2678xafasqw897654as</td>
            <td>Naqi</td>
            <td>120</td>
            <td>naqi@pluton.com</td>
            <td>00 000 0000000</td>
            <td>
                <div onClick={toggleOpen}>

                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                    </svg>
                </div>
                <div className='pos-rel'>
                    {isOpen &&
                        <div
                            className={`user-login-dropdown action-drop-down`}
                        >
                            <ul>
                                <li>
                                    Active
                                </li>
                                <li>
                                    Block
                                </li>
                                <li>
                                    Delete
                                </li>
                            </ul>
                        </div>
                    }
                </div>



            </td>
        </tr>

    )
}

export default UserDataRows