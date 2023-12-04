import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import nft from '../../../public/assets/images/nft-2.png'
function ControllingDataRows({ data, listCount }) {
   

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate()

    const NavigateToUser = (id) => {
        navigate(`/dashboard/user-management/${id}`)
    }
    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {
                data?.data?.map((list, index) => {
                    return (
                        <>
                            <tr onClick={() =>NavigateToUser(list?.user_id)}>
                                <td>{index + listCount + 1}</td>
                                <td>{list?.token_id}</td>
                                <td>{list?.user?.username == null ? 'User' : list?.user?.username}</td>
                                <td><p style={{width : '250px'}}>{list?.user?.wallet_address} </p></td>
                                <td>{list?.user?.email == null ? 'user@gamil.com' : list?.user?.email}</td>
                                <td>{list?.user?.phone_no == null ? '00 000 0000000' : list?.user?.phone_no}</td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                        </>
                    )
                })
            }
        </>


    )
}

export default ControllingDataRows