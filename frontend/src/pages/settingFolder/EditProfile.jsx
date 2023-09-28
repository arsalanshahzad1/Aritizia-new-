import React, { useEffect, useRef, useState } from "react";
import { CiUser } from "react-icons/ci";
import apis from "../../service";

const EditProfile = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const [data, setData] = useState("");

  useEffect(() => {
    const localstorageData = JSON.parse(localStorage.getItem("data"));
    setData(localstorageData);
    setProfileImage(localstorageData?.profile_image);
    setCoverImage(localstorageData?.cover_image);
  }, []);

  console.log(data, "DATA");
  const handleProfileUpload = (event) => {
    setProfileImage(URL.createObjectURL(event.target.files[0]));
    setData((prevState) => ({
      ...prevState,
      profile_image: event.target.files[0],
    }));
  };
  const handleCoverUpload = (event) => {
    setCoverImage(URL.createObjectURL(event.target.files[0]));
    setData((prevState) => ({
      ...prevState,
      cover_image: event.target.files[0],
    }));
  };

  console.log(data,"user edit")

  const onChangeHandler = (e) => {
    const { files, value, name } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
    console.log(data);
  };

  const handleProfileClick = () => {
    profileInputRef.current.click();
  };
  const handleCoverClick = () => {
    coverInputRef.current.click();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const sendData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if(key !== "wallet_address" && key !== "email" && key !== "id"){
        sendData.append(key, value);
      }
      if(key == "id"){
        sendData.append("user_id", 3)
      }
    }

    const response = await apis.editProfile(sendData);
    if (response?.data?.user) {
      localStorage.setItem("data", JSON.stringify(response.data.user));
      // window.location.reload();
    }
  };

  return (
    <>
      <div className="col-lg-7 col-md-7">
        <div className="inputfield-edit-profile">
          <div>
            <div>
              <p>First Name</p> <p></p>
            </div>
            <input
              value={data?.first_name}
              type="text"
              placeholder="First Name"
              name="first_name"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Last Name</p> <p></p>
            </div>
            <input
              defaultValue={data?.last_name}
              type="text"
              placeholder="Last Name"
              name="last_name"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Username</p> <p></p>
            </div>
            <input
              defaultValue={data?.username}
              type="text"
              placeholder="Enter username"
              name="username"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Custom URL</p> <p></p>
            </div>
            <input
              defaultValue={data?.custom_url}
              type="url"
              placeholder="Enter your custom URL"
              name="custom_url"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Bio</p> <p></p>
            </div>
            <input
              defaultValue={data?.bio}
              type="text"
              placeholder="Tell the world who are you!"
              name="bio"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Email Address*</p> <p></p>
            </div>
            <input
              defaultValue={data?.email}
              type="email"
              placeholder="Enter email"
              name="email"
              // onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Your site</p> <p>optional</p>
            </div>
            <input
              defaultValue={data?.your_site}
              type="url"
              placeholder="Enter website URL"
              name="your_site"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              {" "}
              <p>Twitter URL</p> <p></p>
            </div>
            <input
              defaultValue={data?.twitter_url}
              type="url"
              placeholder="Enter instagram URL"
              name="twitter_url"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Instagram URL</p>
              <p></p>
            </div>
            <input
              defaultValue={data?.instagram_url}
              type="url"
              placeholder="Enter twitter URL"
              name="instagram_url"
              onChange={onChangeHandler}
            />
          </div>

          <div>
            <div>
              <p>Wallet Address</p> <p></p>
            </div>
            <input
              defaultValue={data?.wallet_address}
              type="text"
              placeholder="Enter wallet address"
              name="wallet_address"
              onChange={onChangeHandler}
              disabled
            />
          </div>

          <div>
            <div>
              {" "}
              <p>Phone Number</p> <p></p>
            </div>
            <input
              defaultValue={data?.phone_no}
              type="tel"
              placeholder="Enter your phone number"
              name="phone_no"
              onChange={onChangeHandler}
            />
          </div>
          {/* 
                    <div>
                        <button>Update Profile</button>
                    </div> */}
        </div>
      </div>
      <div className="col-lg-5 col-md-5">
        <div className="upload-image-cover">
          <div className="upload-img">
            <h2>Profile Image</h2>
            {profileImage ? (
              <img src={profileImage} alt="" width={"100%"} />
            ) : (
              <CiUser />
            )}
            <input
              ref={profileInputRef}
              name="image"
              type="file"
              style={{ display: "none" }}
              onChange={handleProfileUpload}
              accept="image/png, image/gif, image/jpeg"
            />
            <button onClick={handleProfileClick}>Upload</button>
          </div>
          <div className="upload-img">
            <h2>Cover Image</h2>
            {coverImage ? (
              <img src={coverImage} alt="" width={"100%"} />
            ) : (
              <CiUser />
            )}
            <input
              ref={coverInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleCoverUpload}
              accept="image/png, image/gif, image/jpeg"
            />
            <button onClick={handleCoverClick}>Upload</button>
          </div>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="update-profile-wrap">
          <button onClick={(e) => submitHandler(e)}>Update Profile</button>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
