import { useEffect, useState } from "react";
import apis from "../../service";
const Followers = ({ data  , id}) => {
  const [followers, setFollwers] = useState([]);
  const localStoragedata = JSON.parse(localStorage.getItem("data"));
  const RealUserId = localStoragedata?.id;

  const getFollowersList = async () => {
    const response = await apis.getFollowersList(id);
    if(response.status){
    setFollwers(response?.data?.data);
    }else{
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
            return (
              <div className="Follow-row" key={i}>
                <div className="left">
                  <div className="img-holder">
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
                  <button onClick={() => followOther(data?.user_id)}>Follow</button>

                 
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
