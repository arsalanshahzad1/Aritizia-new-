import { useEffect, useState } from 'react';
import apis from "../../service";
function Fan() {
    
    const [fanListing, setFanListing] = useState([])
    const getFanListing = async () => {
        const response = await apis.getFanList()
        setFanListing(response?.data?.data)
        console.log(response?.data?.data, 'fanlist');
    }
    const getRemoveFan = async (id) => {
        const response = await apis.getremovedFan(id)
        setFanListing(response?.data?.data)
        getFanListing()
        setFanListing([])
    }

    useEffect(() => {
        getFanListing()
    }, [])
    return (
        <>
            {fanListing.map((data, index) => {
                return (
                    <div className='Follow-row' key={index}>
                        <div className='left'>
                            <div className='img-holder'>
                                <img src={data?.profile_image} alt="" />
                            </div>
                            <div className='txt'>
                                <p>{data?.username}</p>
                                <p>{data?.count_fan} Fans</p>
                            </div>
                        </div>
                        <div className='right'>
                            <button className='unfollow' onClick={() =>{getRemoveFan(data?.fan_id)}}>Remove</button>
                        </div>
                    </div>
                )
            })}
        </>
    )
}
export default Fan