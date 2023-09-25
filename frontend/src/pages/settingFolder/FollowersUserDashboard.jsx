import { useEffect, useState } from "react";
import apis from "../../service";
import { useNavigate } from "react-router-dom";
// import apis from "../../service";

const FollowersUserDashboard = ({ data, id }) => {
    const [showOptions, setshowOptions] = useState(false);
    const [followers, setFollwers] = useState([]);
    const [userWalletAddress, SetUserWalletAddress] = useState("");
    const navigate = useNavigate();

    const handleUserVisit = async (id)=> {
    const response = await apis.getUserData(id);
    SetUserWalletAddress( response?.data?.data?.wallet_address);
    }

    useEffect(()=>{
    if(userWalletAddress){
        navigate(`/other-profile?add=${userWalletAddress}`)
    }
    },[userWalletAddress])

    const localStoragedata = JSON.parse(localStorage.getItem("data"));
    const RealUserId = localStoragedata?.id;

    const getFollowersList = async () => {
        const response = await apis.getFollowersList(id);
        if (response.status) {
            setFollwers(response?.data?.data);
        } else {
            setFollwers('');
        }
    };

    const followOther = async (id) => {
        const response = await apis.postFollowAndUnfollow({
            follow_by: RealUserId,
            follow_to: id,
        });
    };

    useEffect(() => {
        getFollowersList()
    }, [])

    
    return (
        <>
            {followers != ''
                ?
                <>
                    {followers?.map((data, i) => {
                        console.log(data, "data value")
                        return (
                            <div className="Follow-row" key={i}>
                                <div className="left">
                                    <div className="img-holder" 
                                        onClick={() =>{
                                            handleUserVisit(data?.user_id)
                                            }
                                          }
                                    >
                                        {data?.profile_image == null ?
                                            <img src='/assets/images/user-none.png' alt="" />
                                            :
                                            <img src={data?.profile_image} alt="" />
                                        }
                                    </div>
                                    <div className="txt">
                                        <p>{data?.username}</p>
                                        <p>{data?.count_follower} Followers</p>
                                    </div>
                                </div>
                                <div className="right">
                                    {/* <button></button> */}
                                    {/* <button onClick={() => followOther(data?.user_id)}>Follow</button> */}

                                    {/* <span
                                        onClick={() => {
                                            setshowOptions(!showOptions);
                                        }}
                                    >
                                        <svg width="10" height="38" viewBox="0 0 10 38" fill="none" xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle cx="5" cy="5" r="5" fill="#B5B5B5" />
                                            <circle cx="5" cy="19" r="5" fill="#B5B5B5" />
                                            <circle cx="5" cy="33" r="5" fill="#B5B5B5" />
                                        </svg>
                                    </span>
                                    {showOptions && (
                                        <div className="options">
                                            <div>Report</div>
                                            <div>Block</div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        );
                    })}
                </>
                :
                <>
                    <div className="data-not-avaliable">
                        <h2>No data avaliable</h2>
                    </div>
                </>
            }
        </>
    );
};

export default FollowersUserDashboard;
