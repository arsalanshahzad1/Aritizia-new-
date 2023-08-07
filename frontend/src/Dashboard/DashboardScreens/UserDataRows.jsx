import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import adminApis from '../../service/adminIndex';
import apis from '../../service/adminIndex';

function UserDataRows({ data, index, listCount, handleToggleOpen, isOpen, setIsOpen , viewUserList }) {
    console.log(listCount, 'reciving data');


    const navigate = useNavigate()
    const NavigateToUser = (id) => {
        navigate(`/dashboard/user-management/${id}`)
    }

    const updateUserStatuss = async (id) =>{
        const response = await apis.updateUserStatus(id)
        if(response.status){
            viewUserList(data?.pagination?.page)
            console.log(response);
        }
    }

    useEffect(() => { }, [isOpen])




    // <tr onClick={NavigateToUser}>
    return (
        <>
            {data?.data?.map((data, index) => {
                return (
                    <>
                        <tr>
                            <td>{index + listCount + 1}</td>
                            <td><p>{data?.wallet_address}</p> </td>
                            <td><p>{data?.username == null ? 'Null' : data?.username}</p></td>
                            <td>{data?.total_nfts}</td>
                            <td><p>{data?.email == null ? 'Null' : data?.email}</p></td>
                            <td><p>{data?.phone_no == null ? 'Null' : data?.phone_no}</p></td>
                            <td>
                                <div onClick={() => handleToggleOpen(data)}>
                                    <svg width="25" height="6" viewBox="0 0 25 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="3" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="13" cy="3" r="3" fill="#B600D1" />
                                        <circle cx="22" cy="3" r="3" fill="#B600D1" />
                                    </svg>
                                </div>
                                <div className={`pos-rel`}>
                                    {data?.id === isOpen ?
                                        <div className={`user-login-dropdown action-drop-down`}>
                                            <ul>
                                                <li onClick={() =>NavigateToUser(data?.id)}>View Profile</li>
                                                {data?.status == 1 ? 
                                                <li onClick={() =>updateUserStatuss(data?.id)}>Block</li> : 
                                                <li onClick={() =>updateUserStatuss(data?.id)}>Unblock</li>}
                                                {/* <li>Delete</li> */}
                                            </ul>
                                        </div>
                                        :
                                        null
                                    }
                                </div>
                            </td>
                        </tr>
                        <hr className='space-between-rows'></hr>
                    </>
                )
            })}
        </>


    )
}

export default UserDataRows