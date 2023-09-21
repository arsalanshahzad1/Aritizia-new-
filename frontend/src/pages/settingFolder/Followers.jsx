import { useEffect, useState } from "react";
import apis from "../../service";
import { useNavigate } from "react-router-dom";


const Followers = ({ data  , id}) => {
  const [followers, setFollwers] = useState([]);
  const localStoragedata = JSON.parse(localStorage.getItem("data"));
  const [followStatus, setFollowStatus] = useState(false)
  const RealUserId = localStoragedata?.id;

  // get user wallet address
  const [userWalletAddress, SetUserWalletAddress] = useState("");
  const navigate = useNavigate();

  const handleUserVisit = async (id)=> {
    const response = await apis.getUserData(id);
    SetUserWalletAddress( response?.data?.data?.wallet_address);
  }

  useEffect(()=>{
    if(userWalletAddress !== ""){
        navigate(`/other-profile?add=${userWalletAddress}`)
    }
  },[userWalletAddress])


  const getFollowersList = async () => {
    const response = await apis.getFollowersList(id);
    if(response.status){
      setFollwers(response?.data?.data);
      console.log(followers)
    }else{
      setFollwers('');
    }
  };

  const followOther = async (newId) => {
    const response = await apis.postFollowAndUnfollow({
      follow_by: id,
      follow_to: newId,
    });
    console.log(response?.data, "new data loading")
    setFollowStatus(!followStatus)
  };
  
  useEffect(() => {
    getFollowersList()
  }, [followStatus])
  return (
    <>
      {followers != ''
        ?
        <>
          {followers?.map((data, i) => {
            {console.log(data,"id data")}
            return (
              <div className="Follow-row" key={i}>
                <div className="left">
                  <div className="img-holder" onClick={()=> handleUserVisit(data.user_id)}>
                    {data?.profile_image == null ?
                      <img src='/assets/images/user-none.png' alt=""/>
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
                  <button onClick={() => followOther(data?.user_id)}>{data?.is_follow === true ? "Unfollow" : "Follow"}</button>
                  {console.log(data?.is_follow, "data")}

                 
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

export default Followers;
