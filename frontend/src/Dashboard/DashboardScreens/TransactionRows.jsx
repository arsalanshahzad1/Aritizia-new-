import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import nft from '../../../public/assets/images/nft-2.png'
import './../DashboardScreens/Dashboard.css'
function TransactionRows({data , index , listCount}) {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()
    const NavigateToUser = () => {
        navigate('/dashboard/controlling-content/user-1')
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (

        <tr className='transaction-row' key={index}>
            <td>{index + listCount + 1}</td>
            <td>
                <div className='nft-thumbnail-holder'>
                    <img src={nft} alt="" />
                </div>
            </td>
            <td><p>{data?.user?.wallet_address}</p> </td>
            <td><p>{data?.user?.username}</p></td>
            <td><p>{data?.price} ETH</p></td>
            <td><p>{data?.buyer?.wallet_address}</p></td>
            <td><p>{data?.buyer?.username}</p></td>
            <td><p>{data?.buyer?.buying_price} ETH</p> </td>


        </tr>

    )
}

export default TransactionRows