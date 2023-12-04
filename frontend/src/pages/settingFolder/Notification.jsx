import React from 'react'
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import apis from "../../service";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/shared/Loader";

const Notification = () => {
  const [data, setData] = useState("");
  const userData = JSON.parse(localStorage.getItem("data"));

  const getNotificationSetting = async () => {
    try{
      const response = await apis.getCurrentNotificationSettings(userData?.id);
      console.log(response?.status, "igotit");
      if (response?.status === 200) {
        setData(response.data.data);
      }
      setLoader(false)
    }catch(err){
      setLoader(false)
    }
  };

  const updateNotificationSetting = async (e) => {
    e.preventDefault();
    setLoader(true)
    const settings = data;
    settings["user_id"] = userData?.id;
    console.log(settings, "settings data");
    const response = await apis.updateNotificationSettings(settings);
    console.log(response, "igotitupdated");

    if (response?.status === 201) {
      toast.success("Notification settings updated", {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoader(false)
    }
    else{
      toast.warning("Failed", {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoader(false)
    }

  };

  useEffect(() => {
    getNotificationSetting();
  }, []);

  const handleSwitchChange = (e) => {
    const { checked, name } = e.target;
    console.log(data, "this is checked");
    const newValue = checked ? 1 : 0;
    setData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const [loader, setLoader] = useState(true)
  return (
    <>
    {loader && <Loader/>}
    <div className="col-lg-10 mx-auto">
      <Form>
        <div className="row">
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Item Sold</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.item_sold === 1 ? true : false}
                  name="item_sold"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p> When someone purchased your item.</p>
              </div>
            </div>
          </div>
          {/* <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Add Fan</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.add_fan === 1 ? true : false}
                  name="add_fan"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p>When someone adds you in a Fan list</p>
              </div>
            </div>
          </div> */}
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Bid Activity</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.bid_activity === 1 ? true : false}
                  name="bid_activity"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p>When someone bids on your NFT.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Follow</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.follow === 1 ? true : false}
                  name="follow"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p>When someone followed you.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Like</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.like === 1 ? true : false}
                  name="like"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p>When someone liked your NFT.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Successful Purchase</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.successful_purchase === 1 ? true : false}
                  name="successful_purchase"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p> When you successfully purchased an NFT.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="notification-button-styling">
            <button
              onClick={updateNotificationSetting}
              className="button-styling"
            >
              Update Settings
            </button>
            
          </div>
        </div>
      </Form>
    </div>
    </>
  );
};

export default Notification;
