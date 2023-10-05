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
    SetUserWalletAddress( response?.data?.data?.id);
  }

  useEffect(()=>{
    if(userWalletAddress !== ""){
        navigate(`/other-profile?add=${userWalletAddress}`)
    }
  },[userWalletAddress])


  const getFollowersList = async () => {
    const response = await apis.getFollowersList(id);
    if(response?.status){
      setFollwers(response?.data?.data);
      console.log(followers)
    }else{
      setFollwers('');
    }
    setLoader(false)
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

  const [loader, setLoader] = useState(true)

  if(loader){
    return(
      <>
        <section className="sec-loading">
          <div className="one"></div>
        </section>
      </>
    )
  }
  
  return (
    <>


      {followers != ''
        ?
        <>
          {followers?.map((data, i) => {
            return (
              <div className="Follow-row" key={i}>
                <div className="left">
                  <div className="img-holder" onClick={()=> handleUserVisit(data?.user_id)}>
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

export default Followers;