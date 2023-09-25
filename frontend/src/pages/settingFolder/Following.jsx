import { useState, useEffect } from "react";
import apis from "../../service";
const Following = ({ data, id }) => {
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
      console.log(response?.data?.data, " ");
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
                <div className="left">
                  <div className="img-holder">
                    {data?.profile_image == null ?
                      <img src='/assets/images/user-none.png' alt="" srcset="" />
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
                  <button
                    className="unfollow"
                    onClick={() => followOther(data?.user_id)}
                  >
                    Unfollow
                  </button>
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

export default Following;
