import React from 'react'
import { useState, useEffect } from "react";
import apis from "../../service";
import { Link } from "react-router-dom";
const FollowingUserDashboard = ({ data, id }) => {
    const [showOptions, setshowOptions] = useState(false);
    const [following, setFollwing] = useState([]);
    const localStoragedata = JSON.parse(localStorage.getItem("data"));
    const RealUserId = localStoragedata?.id;

    const followOther = async (id) => {
        const response = await apis.postFollowAndUnfollow({
            follow_by: RealUserId,
            follow_to: id,
        });
        getFollowingList(id)
        setFollwing([])
    };

    const getFollowingList = async () => {
        const response = await apis.getFollowingList(id);
        if (response.status) {
            // console.log(response?.data?.data, " ");
            setFollwing(response?.data?.data);
        }
        else {
            setFollwing([]);
        }
    };


    useEffect(() => {
        getFollowingList(id);
    }, [])
    return (
        <>
            {following != "" ? (
                <>
                    {following?.map((data, i) => {
                        return (
                            <div className="Follow-row" key={i}>
                                <Link to={`/other-profile?add=${data?.user_id}`}>
                                <div className="left">
                                    <div className="img-holder">
                                        {data?.profile_image == null ?
                                            <img src='/assets/images/user-none.png' alt="" srcset="" />
                                            :
                                            <img src={data?.profile_image} alt="" />
                                        }
                                    </div>
                                    <div className="txt">
                                        <p>{data?.first_name}</p>
                                        <p>{data?.count_follower} Followers</p>
                                    </div>
                                </div>
                                </Link>
                                <div className="right">
                                    {/* <button
                                        className="unfollow"
                                        onClick={()=> followOther(data?.user_id)}
                                    >
                                        Unfollow
                                    </button>

                                    <span
                                        onClick={() => {
                                            setshowOptions(!showOptions);
                                        }}
                                    >
                                        <svg
                                            width="10"
                                            height="38"
                                            viewBox="0 0 10 38"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
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
            ) : (
                <>
                    <div className="data-not-avaliable">
                        <h2>No data avaliable</h2>
                    </div>
                </>
            )}
        </>
    );
};

export default FollowingUserDashboard;
