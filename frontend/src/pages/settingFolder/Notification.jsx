import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import apis from "../../service";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/shared/Loader";

const Notification = () => {
  const [data, setData] = useState("");
  const userData = JSON.parse(localStorage.getItem("data"));

  const getNotificationSetting = async () => {
    const response = await apis.getCurrentNotificationSettings(userData?.id);
    console.log(response?.status, "igotit");
    if (response?.status === 200) {
      setData(response.data.data);
    }
    setLoader(false)
  };

  const updateNotificationSetting = async (e) => {
    e.preventDefault();
    const settings = data;
    settings["user_id"] = userData?.id;
    console.log(settings, "settings data");
    const response = await apis.updateNotificationSettings(settings);
    console.log(response, "igotitupdated");

    if (response?.status === 201) {
      toast.success("Notification settings updated", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    else{
      toast.warning("Failed", {
        position: toast.POSITION.TOP_CENTER,
      });
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
                <p>When someone purhased your item.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Auction Expiration</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.auction_expiration === 1 ? true : false}
                  name="auction_expiration"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p>When an auction you created ends.</p>
              </div>
            </div>
          </div>
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
                <p>When someone purhased your item.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Outbid</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.outbid === 1 ? true : false}
                  name="outbid"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p>When an offer you placed is exceeded by another user.</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-12">
            <div className="notification-sec-wrap">
              <div>
                <h2>Price Change</h2>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={data?.price_change === 1 ? true : false}
                  name="price_change"
                  onChange={(e) => handleSwitchChange(e)}
                />
              </div>
              <div>
                <p>When an item you made an offer on changes in price.</p>
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
                <p>When you successfully buy an item.</p>
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
              Update Profile
            </button>
          </div>
        </div>
      </Form>
      <ToastContainer />
    </div>
    </>
  );
};

export default Notification;
