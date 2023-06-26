import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import nft from '../../../public/assets/images/nft-2.png'
function ControllingDataRows() {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const NavigateToUser = () => {
        navigate('/dashboard/controlling-content/user-1')
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (

        <tr onClick={NavigateToUser}>
            <td>01</td>
            <td>
                <div className='nft-thumbnail-holder'>
                    <img src={nft} alt="" />
                </div>
            </td>
            <td>xasda2678xafasqw897654as</td>
            <td>Naqi</td>
            <td>0.39 ETH</td>
            <td>xasda2678xafasqw897654as</td>
            <td>Naqi</td>
            <td>0.39 ETH</td>


        </tr>

    )
}

export default ControllingDataRows