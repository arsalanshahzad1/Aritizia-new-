import React, { useEffect, useRef, useState, useContext } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { GlobalContext } from "../../Context/GlobalContext";
import Notification from "./Notification";
import laravelEcho from "../../socket/index";
import apis from "../../service";
import Web3Modal from "web3modal";
import UserNotification from "./UserNotification";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
// import { getAddress } from "../../methods/methods";
import { IoIosArrowDropdownCircle, IoIosArrowDropupCircle } from 'react-icons/io'
// import {
//   connectWallet,
//   getProviderOrSigner,
// } from "../../methods/walletManager";
import UnAuthHeader from "../Headers/UnAuthHeader";
import EmailHeader from "../Headers/EmailHeader";
import { Store } from "../../Context/Store";
import { GiHamburgerMenu } from "react-icons/gi";



const Header = ({ search, setSearch }) => {


  let navigate = useNavigate()
  const { setactiveTabsSetting } = useContext(GlobalContext);
  const [showMessage, setshowMessage] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toggleUserDropdown, setToggleUserDropdown] = useState(false);
  const [toggleSettingDropdown, setToggleSettingDropdown] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("data"));
  const [messageArrive, setMessageArrive] = useState(false);
  const [notificationArrive, setNotificationArrive] = useState(false);
  const [chatNotificationRes, setChatNotificationRes] = useState([]);
  const [notificationRes, setNotificationRes] = useState([]);
  const [loader, setloader] = useState(false);
  const location = useLocation();
  const path = location.pathname;
  const [countLength, setCountLength] = useState('');
  const data = JSON.parse(localStorage.getItem("data"));
  const [userData, setUserData] = useState(data)
  const id = JSON.parse(localStorage.getItem("data"));
  const user_id = id?.id;
  const [show, setShow] = useState(false);



  const { account, checkIsWalletConnected, connectWallet, walletConnected } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  useEffect(() => {
    const channel = laravelEcho.channel("chat-channel-" + user_id);
    channel.listen(".chat-event", (data) => {
      // console.log(data, 'data');
      // Handle the received event data
      setMessageArrive(true);
    });

    return () => {
      channel.stopListening(".chat-event");
    };
  }, []);

  useEffect(() => {
    const channel = laravelEcho.channel("notification-channel-" + user_id);
    channel.listen(".notification-event", (data) => {
      // Handle the received event data
      setNotificationArrive(true);
    });

    return () => {
      channel.stopListening("notification-event");
    };
  }, []);

  const [accountChange, setAccountChange] = useState(false);


  function handleDisconnect() {
    // Handle wallet disconnection here
    // console.log(
    //   "Wallet disconnected. Updating state and clearing local storage..."
    // );
    // Clear localStorage:
    localStorage.clear();
  }

  useEffect(() => {
    window.addEventListener("ethereum#disconnect", handleDisconnect);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("ethereum#disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
        setToggleUserDropdown(false);
      } else {
        setScrolled(false);
        setToggleUserDropdown(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [messageArrive, notificationArrive]);

  const getChatnotification = async (name, count) => {
    if (name == "message") {
      setChatNotificationRes("");
      setloader(true);
    }
    const response = await apis.getChatNotification(user_id, count);
    if (response.status) {
      // console.log(response, 'response');
      setChatNotificationRes((prevState) => [
        ...prevState,
        ...response?.data?.data,
      ]);
      // console.log(response?.data?.total_count);
      setCountLength(response?.data?.total_count)
      // console.log(countLength)
      setloader(false);
    } else {
      setloader(false);
      setChatNotificationRes([]);
    }
  };

  const viewNotification = async (name, count) => {
    if (name == "notification") {
      setNotificationRes("");
      setloader(true);
    }
    const response = await apis.viewNotification(user_id , count);
    if (response.status) {
      setloader(false);
      setNotificationRes((prevState) => [
        ...prevState,
        ...response?.data?.data,
      ]);
    } else {
      setloader(false);
      setNotificationRes([]);
    }
  };


  let accountAddress = localStorage.getItem("userAddress")

  // console.log(typeof accountAddress, "accountAddressaccountAddress")

  // console.log( parse, "userParse")
  // console.log( user.email, "userParse")
  // const parse = localStorage.getItem("data")
  // const userParse = JSON.parse(parse)

  const [userParse, setUserParse] = useState(JSON.parse(localStorage.getItem("data")));

  useEffect(() => {
  }, [data, userParse])
  useEffect(() => {
    setTimeout(() => {
      setUserParse(JSON.parse(localStorage.getItem("data")))
    }, 3000);
    // setUserDatalocalStorage.getItem("data")
  }, [])
  // console.log(userParse?.email, "userParse")


  // console.log("data", data)

  // console.log("accountAddress", accountAddress)
  useEffect(() => {
    if (accountAddress == null && data == null) {
      window.location.reload()
    }
  }, [accountAddress, data])

  return (
    <>
      {

        data !== "false" && accountAddress !== "false" ?
          <>
            <header id={`${scrolled ? "active" : ""}`}>
              <div className="container">
                <div className="row">
                  <div className="col-lg-6 col-md-4 col-6">
                    {path === "/" ? (
                      <div className="logo">
                        <Link
                          to={"/"}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <img src="/assets/logo/logo.png" alt="" />
                          </div>
                          {scrolled ? (
                            <div>
                              <img src="/assets/logo/logo-title-dark.png" alt="" />
                            </div>
                          ) : (
                            <div>
                              <img src="/assets/logo/logo-title-light.png" alt="" />
                            </div>
                          )}
                        </Link>
                      </div>
                    ) : (
                      <div className="logo">
                        <Link
                          to={"/"}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <img src="/assets/logo/logo.png" alt="" />
                          </div>
                          <div>
                            <img src="/assets/logo/logo-title-dark.png" alt="" />
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-8 col-6">
                    <div className="left" id="hide-on-mobile" style={{ alignItems: 'center', justifyContent: "end" }}>
                      {path === "/" ? (
                        <>
                          <Link to={'/search'}>
                            <FiSearch className={`search ${scrolled ? "black-color" : "white-color"
                              }`} />
                          </Link>

                          <span
                            className={`icon-for-header ${scrolled ? "black-svgs" : ""
                              }`}
                          >
                            <svg
                              width="1"
                              height="22"
                              viewBox="0 0 1 22"
                              fill="#ffffff"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect width="1" height="22" fill="#ffffff" />
                            </svg>
                          </span>
                          {user && (
                            <span
                              onClick={() => {
                                setshowMessage(!showMessage),
                                  setShowNotification(false),
                                  getChatnotification("message", 0);
                                setMessageArrive(false);
                              }}
                              className={`icon-for-header ${scrolled ? "black-svgs" : ""
                                }`}
                              style={{ zIndex: `${showMessage ? "21" : "10"}` }}
                            >
                              <svg
                                width="36"
                                height="26"
                                viewBox="0 0 46 32"
                                fill="#ffffff"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3.85972 31.9842C1.41169 31.9842 0 30.5807 0 28.149V6.85099C0 4.40296 1.41169 3.01577 3.85972 3.01577H37.5529C38.0644 2.96705 38.5804 3.03153 39.0642 3.20464C39.548 3.37774 39.9877 3.6553 40.3522 4.01746C40.7167 4.37963 40.997 4.81758 41.1732 5.30025C41.3494 5.78293 41.4172 6.29833 41.3718 6.81015C41.3718 13.9367 41.3718 21.0633 41.3718 28.1898C41.4172 28.7017 41.3494 29.2171 41.1732 29.6998C40.997 30.1824 40.7167 30.6204 40.3522 30.9825C39.9877 31.3447 39.548 31.6223 39.0642 31.7954C38.5804 31.9685 38.0644 32.033 37.5529 31.9842H3.85972ZM3.85972 29.9279H37.7161L26.7408 19.0748L25.6472 20.1684C24.9373 20.8865 24.2029 21.629 23.4604 22.3634C23.1157 22.761 22.6895 23.0798 22.2108 23.2984C21.7322 23.5169 21.212 23.6301 20.6858 23.6301C20.1596 23.6301 19.6396 23.5169 19.161 23.2984C18.6823 23.0798 18.2561 22.761 17.9114 22.3634L14.7291 19.1892L3.85972 29.9279ZM2.10518 28.3367L12.9582 17.5653L2.10518 6.81015V28.3367ZM28.4054 17.4755L39.2746 28.2387V6.68783L28.4054 17.4755ZM4.03105 5.38213C4.08151 5.58837 4.20275 5.77043 4.37372 5.89632L4.4554 5.9778L14.8596 16.4065L19.2008 20.7641C19.3813 20.9924 19.6055 21.1821 19.8606 21.3223C20.1157 21.4624 20.3963 21.5501 20.6858 21.5801C20.9739 21.5491 21.253 21.461 21.5066 21.3209C21.7602 21.1808 21.9833 20.9914 22.1628 20.7641L36.8511 6.02681L37.1776 5.68415L37.6834 5.12115H3.96571L4.03105 5.38213Z"
                                  fill="#ffffff"
                                />
                                {messageArrive && (
                                  <circle
                                    cx="39.834"
                                    cy="5.5"
                                    r="5.5"
                                    fill="#2636D9"
                                  />
                                )}
                              </svg>
                            </span>
                          )}
                          {showMessage && (
                            <div className="notification-card" style={{ left: "16%" }}>
                              <>
                                {loader ? (
                                  <section className="sec-loading">
                                    <div className="one"></div>
                                  </section>
                                ) : (
                                  <>
                                    {chatNotificationRes?.length > 0 ? (
                                      <Notification data={chatNotificationRes} />
                                    ) : (
                                      <section className="header-empty-record"> <a href={`/chat/${user_id}`}> Inbox</a></section>
                                    )}
                                    {chatNotificationRes.length < countLength &&
                                      chatNotificationRes.length > 0 ? (
                                      <button
                                        className="loadmore-mgs-notofication"
                                        onClick={() =>
                                          getChatnotification(
                                            "loadmore",
                                            chatNotificationRes.length
                                          )
                                        }
                                      >
                                        load more
                                      </button>
                                    ) : null}
                                  </>
                                )}
                              </>
                            </div>
                          )}
                          {user && (
                            <span
                              onClick={() => {
                                setShowNotification(!showNotification);
                                setshowMessage(false);
                                viewNotification("notification", 0);
                                setNotificationArrive(false);
                              }}
                              className={`icon-for-header ${scrolled ? "black-svgs" : ""
                                }`}
                            >
                              <svg
                                width="24"
                                height="30"
                                viewBox="0 0 29 38"
                                fill="#ffffff"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.6609 32.3687C11.3252 32.1312 8.4255 31.953 5.57521 31.5175C4.55181 31.3557 3.58245 30.9491 2.74992 30.3323C1.9174 29.7156 1.24634 28.907 0.793509 27.9751C0.340673 27.0432 0.119542 26.0156 0.149103 24.9799C0.178663 23.9442 0.457875 22.9311 0.963128 22.0266C3.45713 17.6324 2.94257 18.8101 3.02175 13.8518C3.11576 10.9368 4.34183 8.17313 6.43974 6.14717C8.53764 4.12121 11.3422 2.99231 14.2586 3.00004C17.1751 3.00777 19.974 4.15144 22.0611 6.18849C24.1482 8.22553 25.3594 10.9956 25.438 13.911C25.4627 14.3197 25.4627 14.7295 25.438 15.1382C25.2056 17.37 25.8241 19.6074 27.17 21.403C27.7204 22.1667 28.0888 23.0462 28.2466 23.9743C28.4045 24.9024 28.3477 25.8543 28.0806 26.7571C27.7973 27.9898 27.1457 29.1074 26.2124 29.9612C25.2791 30.815 24.1081 31.3647 22.8551 31.5373C21.5487 31.7748 20.2126 31.9035 18.8963 32.0222C17.3326 32.1608 15.7689 32.2302 13.6609 32.3687ZM14.2548 29.9636C17.0259 29.6766 19.7771 29.4293 22.5185 29.0928C23.3226 28.9672 24.0667 28.5919 24.6457 28.02C25.2247 27.4481 25.6093 26.7085 25.7449 25.9061C25.8657 25.3528 25.8683 24.7801 25.7524 24.2258C25.6364 23.6715 25.4045 23.148 25.0719 22.6896C23.4434 20.5167 22.694 17.8095 22.9737 15.1085C22.9984 14.6733 22.9984 14.2374 22.9737 13.8022C22.9397 11.7226 22.1644 9.72357 20.7873 8.16496C19.4101 6.60634 17.5217 5.59054 15.4622 5.30077C13.3129 4.97193 11.1188 5.47035 9.32253 6.69541C7.52627 7.92047 6.26148 9.78094 5.78301 11.9019C5.51917 13.5373 5.42296 15.1954 5.49596 16.8503C5.51178 18.2625 5.14952 19.6533 4.44684 20.8784C4.02127 21.6404 3.53649 22.3629 3.13072 23.1349C2.81586 23.6958 2.63984 24.324 2.61751 24.9669C2.59519 25.6097 2.72698 26.2484 3.00218 26.8298C3.27737 27.4112 3.68785 27.9183 4.19917 28.3085C4.7105 28.6988 5.30787 28.9609 5.94127 29.073C8.70249 29.4689 11.4836 29.6766 14.2548 29.9636Z"
                                  fill="#ffffff"
                                />
                                <path
                                  d="M14.2053 38C13.333 37.9938 12.4747 37.7794 11.7018 37.3749C10.929 36.9704 10.2638 36.3873 9.76158 35.6741C9.64789 35.5518 9.56067 35.4073 9.5057 35.2496C9.45074 35.0919 9.42914 34.9246 9.44216 34.7582C9.45518 34.5917 9.50252 34.4296 9.58133 34.2824C9.66015 34.1352 9.7687 34.006 9.90003 33.9028C10.034 33.793 10.1898 33.7128 10.3569 33.6675C10.5241 33.6222 10.6991 33.6126 10.8701 33.6397C11.0412 33.6668 11.2045 33.73 11.3495 33.8248C11.4945 33.9195 11.6178 34.0438 11.7112 34.1896C13.265 35.9908 15.2049 36.0007 16.7389 34.1896C16.8275 34.0407 16.9465 33.9122 17.0883 33.8127C17.2301 33.7131 17.3915 33.6449 17.5616 33.6121C17.7318 33.5794 17.9069 33.5832 18.0756 33.623C18.2442 33.6629 18.4024 33.738 18.54 33.8434C18.6752 33.9513 18.7871 34.0856 18.8683 34.2384C18.9496 34.3912 18.9987 34.5591 19.0126 34.7316C19.0265 34.9041 19.0048 35.0776 18.949 35.2414C18.8933 35.4052 18.8048 35.5558 18.6886 35.6841C18.1802 36.3997 17.508 36.9834 16.728 37.3863C15.9481 37.7892 15.0831 37.9996 14.2053 38Z"
                                  fill="#ffffff"
                                />
                                {notificationArrive && (
                                  <circle cx="20.5" cy="5.5" r="5.5" fill="#2636D9" />
                                )}
                              </svg>
                            </span>
                          )}

                          {showNotification && (
                            <div
                              className="notification-card"
                              style={{ left: "22%" }}
                            >
                              <>
                                {loader ? (
                                  <section className="sec-loading">
                                    <div className="one"></div>
                                  </section>
                                ) : (
                                  <>
                                    {notificationRes?.length > 0 ? (
                                      <UserNotification data={notificationRes} />
                                    ) : (
                                      <section className="header-empty-record"> <span> No record found </span> </section>
                                    )}
                                    {notificationRes.length < countLength &&
                                      notificationRes.length > 0 ? (
                                      <button
                                        className="loadmore-mgs-notofication"
                                        onClick={() =>
                                          viewNotification(
                                            "loadmore",
                                            notificationRes.length
                                          )
                                        }
                                      >
                                        load more
                                      </button>
                                    ) : null}
                                  </>
                                )}
                              </>
                            </div>
                          )}
                          <button
                            onClick={connectWallet}
                            className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"
                              }`}
                            style={{
                              margin: user ? "0px 10px 0px 15px" : "0px 0px 0px 3px",
                            }}
                          >
                            {accountAddress !== "false" && walletConnected ? "Connected" : "Connect Wallet"}
                          </button>
                          {userParse?.email === null &&
                            <Link to={'/login'}>
                              <button className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"}`}
                                style={{ margin: user ? "0px 20px 0px 0px" : "0px 0px 0px 3px" }}>Login</button>
                            </Link>
                          }
                        </>
                      ) : (
                        <>
                          <Link to={'/search'}>
                            <FiSearch className="search black-color" />
                          </Link>

                          <span className='icon-for-header black-svgs'>
                            <svg width="1" height="22" viewBox="0 0 1 22" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                              <rect width="1" height="22" fill="#ffffff" />
                            </svg>
                          </span>
                          {user && (
                            <span
                              onClick={() => {
                                setshowMessage(!showMessage),
                                  setShowNotification(false),
                                  getChatnotification("message", 0);
                                setMessageArrive(false);
                              }}
                              className='icon-for-header black-svgs'
                              style={{ zIndex: `${showMessage ? "21" : "10"}` }}
                            >
                              <svg
                                width="36"
                                height="26"
                                viewBox="0 0 46 32"
                                fill="#ffffff"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M3.85972 31.9842C1.41169 31.9842 0 30.5807 0 28.149V6.85099C0 4.40296 1.41169 3.01577 3.85972 3.01577H37.5529C38.0644 2.96705 38.5804 3.03153 39.0642 3.20464C39.548 3.37774 39.9877 3.6553 40.3522 4.01746C40.7167 4.37963 40.997 4.81758 41.1732 5.30025C41.3494 5.78293 41.4172 6.29833 41.3718 6.81015C41.3718 13.9367 41.3718 21.0633 41.3718 28.1898C41.4172 28.7017 41.3494 29.2171 41.1732 29.6998C40.997 30.1824 40.7167 30.6204 40.3522 30.9825C39.9877 31.3447 39.548 31.6223 39.0642 31.7954C38.5804 31.9685 38.0644 32.033 37.5529 31.9842H3.85972ZM3.85972 29.9279H37.7161L26.7408 19.0748L25.6472 20.1684C24.9373 20.8865 24.2029 21.629 23.4604 22.3634C23.1157 22.761 22.6895 23.0798 22.2108 23.2984C21.7322 23.5169 21.212 23.6301 20.6858 23.6301C20.1596 23.6301 19.6396 23.5169 19.161 23.2984C18.6823 23.0798 18.2561 22.761 17.9114 22.3634L14.7291 19.1892L3.85972 29.9279ZM2.10518 28.3367L12.9582 17.5653L2.10518 6.81015V28.3367ZM28.4054 17.4755L39.2746 28.2387V6.68783L28.4054 17.4755ZM4.03105 5.38213C4.08151 5.58837 4.20275 5.77043 4.37372 5.89632L4.4554 5.9778L14.8596 16.4065L19.2008 20.7641C19.3813 20.9924 19.6055 21.1821 19.8606 21.3223C20.1157 21.4624 20.3963 21.5501 20.6858 21.5801C20.9739 21.5491 21.253 21.461 21.5066 21.3209C21.7602 21.1808 21.9833 20.9914 22.1628 20.7641L36.8511 6.02681L37.1776 5.68415L37.6834 5.12115H3.96571L4.03105 5.38213Z"
                                  fill="#ffffff"
                                />
                                {messageArrive && (
                                  <circle
                                    cx="39.834"
                                    cy="5.5"
                                    r="5.5"
                                    fill="#2636D9"
                                  />
                                )}
                              </svg>
                            </span>
                          )}
                          {showMessage && (
                            <div className="notification-card" style={{ left: "16%" }}>
                              <>
                                {loader ? (
                                  <section className="sec-loading">
                                    <div className="one"></div>
                                  </section>
                                ) : (
                                  <>
                                    {chatNotificationRes?.length > 0 ? (
                                      <Notification data={chatNotificationRes} />
                                    ) : (
                                      <section className="header-empty-record"><a href={`/chat/${user_id}`}> Inbox</a> </section>
                                    )}
                                    {chatNotificationRes.length < countLength &&
                                      chatNotificationRes.length > 0 ? (
                                      <button
                                        className="loadmore-mgs-notofication"
                                        onClick={() =>
                                          getChatnotification(
                                            "loadmore",
                                            chatNotificationRes.length
                                          )
                                        }
                                      >
                                        load more
                                      </button>
                                    ) : null}
                                  </>
                                )}
                              </>
                            </div>
                          )}
                          {user && (
                            <span
                              onClick={() => {
                                setShowNotification(!showNotification);
                                setshowMessage(false);
                                viewNotification("notification", 0);
                                setNotificationArrive(false);
                              }}
                              className='icon-for-header black-svgs'
                            >
                              <svg
                                width="24"
                                height="30"
                                viewBox="0 0 29 38"
                                fill="#ffffff"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.6609 32.3687C11.3252 32.1312 8.4255 31.953 5.57521 31.5175C4.55181 31.3557 3.58245 30.9491 2.74992 30.3323C1.9174 29.7156 1.24634 28.907 0.793509 27.9751C0.340673 27.0432 0.119542 26.0156 0.149103 24.9799C0.178663 23.9442 0.457875 22.9311 0.963128 22.0266C3.45713 17.6324 2.94257 18.8101 3.02175 13.8518C3.11576 10.9368 4.34183 8.17313 6.43974 6.14717C8.53764 4.12121 11.3422 2.99231 14.2586 3.00004C17.1751 3.00777 19.974 4.15144 22.0611 6.18849C24.1482 8.22553 25.3594 10.9956 25.438 13.911C25.4627 14.3197 25.4627 14.7295 25.438 15.1382C25.2056 17.37 25.8241 19.6074 27.17 21.403C27.7204 22.1667 28.0888 23.0462 28.2466 23.9743C28.4045 24.9024 28.3477 25.8543 28.0806 26.7571C27.7973 27.9898 27.1457 29.1074 26.2124 29.9612C25.2791 30.815 24.1081 31.3647 22.8551 31.5373C21.5487 31.7748 20.2126 31.9035 18.8963 32.0222C17.3326 32.1608 15.7689 32.2302 13.6609 32.3687ZM14.2548 29.9636C17.0259 29.6766 19.7771 29.4293 22.5185 29.0928C23.3226 28.9672 24.0667 28.5919 24.6457 28.02C25.2247 27.4481 25.6093 26.7085 25.7449 25.9061C25.8657 25.3528 25.8683 24.7801 25.7524 24.2258C25.6364 23.6715 25.4045 23.148 25.0719 22.6896C23.4434 20.5167 22.694 17.8095 22.9737 15.1085C22.9984 14.6733 22.9984 14.2374 22.9737 13.8022C22.9397 11.7226 22.1644 9.72357 20.7873 8.16496C19.4101 6.60634 17.5217 5.59054 15.4622 5.30077C13.3129 4.97193 11.1188 5.47035 9.32253 6.69541C7.52627 7.92047 6.26148 9.78094 5.78301 11.9019C5.51917 13.5373 5.42296 15.1954 5.49596 16.8503C5.51178 18.2625 5.14952 19.6533 4.44684 20.8784C4.02127 21.6404 3.53649 22.3629 3.13072 23.1349C2.81586 23.6958 2.63984 24.324 2.61751 24.9669C2.59519 25.6097 2.72698 26.2484 3.00218 26.8298C3.27737 27.4112 3.68785 27.9183 4.19917 28.3085C4.7105 28.6988 5.30787 28.9609 5.94127 29.073C8.70249 29.4689 11.4836 29.6766 14.2548 29.9636Z"
                                  fill="#ffffff"
                                />
                                <path
                                  d="M14.2053 38C13.333 37.9938 12.4747 37.7794 11.7018 37.3749C10.929 36.9704 10.2638 36.3873 9.76158 35.6741C9.64789 35.5518 9.56067 35.4073 9.5057 35.2496C9.45074 35.0919 9.42914 34.9246 9.44216 34.7582C9.45518 34.5917 9.50252 34.4296 9.58133 34.2824C9.66015 34.1352 9.7687 34.006 9.90003 33.9028C10.034 33.793 10.1898 33.7128 10.3569 33.6675C10.5241 33.6222 10.6991 33.6126 10.8701 33.6397C11.0412 33.6668 11.2045 33.73 11.3495 33.8248C11.4945 33.9195 11.6178 34.0438 11.7112 34.1896C13.265 35.9908 15.2049 36.0007 16.7389 34.1896C16.8275 34.0407 16.9465 33.9122 17.0883 33.8127C17.2301 33.7131 17.3915 33.6449 17.5616 33.6121C17.7318 33.5794 17.9069 33.5832 18.0756 33.623C18.2442 33.6629 18.4024 33.738 18.54 33.8434C18.6752 33.9513 18.7871 34.0856 18.8683 34.2384C18.9496 34.3912 18.9987 34.5591 19.0126 34.7316C19.0265 34.9041 19.0048 35.0776 18.949 35.2414C18.8933 35.4052 18.8048 35.5558 18.6886 35.6841C18.1802 36.3997 17.508 36.9834 16.728 37.3863C15.9481 37.7892 15.0831 37.9996 14.2053 38Z"
                                  fill="#ffffff"
                                />
                                {notificationArrive && (
                                  <circle cx="20.5" cy="5.5" r="5.5" fill="#2636D9" />
                                )}
                              </svg>
                            </span>
                          )}

                          {showNotification && (
                            <div className="notification-card" style={{ left: "22%" }}>
                              <>
                                {loader ? (
                                  <section className="sec-loading">
                                    <div className="one"></div>
                                  </section>
                                ) : (
                                  <>
                                    {notificationRes?.length > 0 ? (
                                      <UserNotification data={notificationRes} />
                                    ) : (
                                      <section className="header-empty-record"> <span> No record found </span> </section>
                                    )}
                                    {notificationRes.length < countLength &&
                                      notificationRes.length > 0 ? (
                                      <button
                                        className="loadmore-mgs-notofication"
                                        onClick={() =>
                                          viewNotification(
                                            "loadmore",
                                            notificationRes.length
                                          )
                                        }
                                      >
                                        load more
                                      </button>
                                    ) : null}
                                  </>
                                )}
                              </>
                            </div>
                          )}
                          <button
                            onClick={connectWallet}
                            className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"
                              }`}
                            style={{
                              margin: user ? "0px 10px 0px 15px" : "0px 0px 0px 3px",
                            }}
                          >
                            {accountAddress !== "false" && walletConnected ? "Connected" : "Connect Wallet"}
                          </button>
                          {userParse?.email === null &&
                            <Link to={'/login'}>
                              <button className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"}`}
                                style={{ margin: user ? "0px 20px 0px 0px" : "0px 0px 0px 3px" }}>Login</button>
                            </Link> 
                          }
                        </>
                      )}
                      {user && (
                        <div className="login-user-profile">
                          {userData?.profile_image == null ? (
                            <img
                              src="/assets/images/user-none.png"
                              alt="profile-image"
                              onClick={() => {
                                setToggleUserDropdown(!toggleUserDropdown);
                              }}
                            />
                          ) : (
                            <img
                              src={userData?.profile_image}
                              alt=""
                              onClick={() => {
                                setToggleUserDropdown(!toggleUserDropdown);
                              }}
                            />
                          )}
                          {toggleUserDropdown && (
                            <div
                              className={`user-login-dropdown ${scrolled ? "active" : ""
                                }`}
                            >
                              <ul>
                                <li>
                                  <Link to={"/profile"}>My Profile</Link>
                                </li>
                                <li>
                                  <Link to={"/wallet"}>Wallet</Link>
                                </li>
                                <li>
                                  <Link to={"/create"}>Create</Link>
                                </li>

                                <li
                                  className={`setting ${toggleSettingDropdown ? "seeting-active" : ""
                                    }`}
                                  onClick={() =>
                                    setToggleSettingDropdown(!toggleSettingDropdown)
                                  }
                                >

                                  Settings {toggleSettingDropdown ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}
                                  {toggleSettingDropdown ? (
                                    <div>
                                      <ul>
                                        <Link to={"/setting"}>
                                          <li
                                            onClick={() =>
                                              setactiveTabsSetting("Notification")
                                            }
                                          >
                                            Notifications
                                          </li>
                                        </Link>
                                        <Link to={"/setting"}>
                                          <li
                                            onClick={() =>
                                              setactiveTabsSetting("Purchase")
                                            }
                                          >
                                            Purchase
                                          </li>
                                        </Link>
                                        <Link to={"/setting"}>
                                          <li
                                            onClick={() =>
                                              setactiveTabsSetting("Earnings")
                                            }
                                          >
                                            Earning
                                          </li>
                                        </Link>
                                        <Link to={"/setting"}>
                                          <li
                                            onClick={() =>
                                              setactiveTabsSetting("Edit")
                                            }
                                          >
                                            Edit
                                          </li>
                                        </Link>
                                      </ul>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </li>
                                <li>
                                  <Link to={"/subscription"}>Subscription</Link>
                                </li>

                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="left" id="hide-on-desktop" style={{ alignItems: 'center', justifyContent: "end" }}>
                      <div className="monile-hamburgur">
                        <Link to={'/search'}>
                          <FiSearch className={`search ${scrolled ? "black-color" : "white-color"}`} />
                        </Link>
                        <span className={`icon-for-header ${scrolled ? "black-svgs" : ""}`}>
                          <svg width="1" height="22" viewBox="0 0 1 22" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                            <rect width="1" height="22" fill="#ffffff" />
                          </svg>
                        </span>
                        <GiHamburgerMenu className="GiHamburgerMenu" onClick={() => setShow(true)} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`mobile-nav ${show ? 'show' : ''}`} id="hide-on-desktop">
                <span onClick={() => setShow(false)} className="closee">x</span>
                <div className="mobile-nav-wrap" style={{ marginTop: '80px', justifyContent: 'start' }}>
                  <div className="user-noti-mgs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <span
                      onClick={() => { setshowMessage(!showMessage), setShowNotification(false), getChatnotification("message", 0); setMessageArrive(false); setToggleUserDropdown(false); }}
                      className={`icon-for-header`}
                      style={{ zIndex: `${showMessage ? "21" : "10"}`, position: 'relative', margin: '0px' }}
                    >
                      <svg
                        width="36"
                        height="26"
                        viewBox="0 0 46 32"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <path
                          d="M3.85972 31.9842C1.41169 31.9842 0 30.5807 0 28.149V6.85099C0 4.40296 1.41169 3.01577 3.85972 3.01577H37.5529C38.0644 2.96705 38.5804 3.03153 39.0642 3.20464C39.548 3.37774 39.9877 3.6553 40.3522 4.01746C40.7167 4.37963 40.997 4.81758 41.1732 5.30025C41.3494 5.78293 41.4172 6.29833 41.3718 6.81015C41.3718 13.9367 41.3718 21.0633 41.3718 28.1898C41.4172 28.7017 41.3494 29.2171 41.1732 29.6998C40.997 30.1824 40.7167 30.6204 40.3522 30.9825C39.9877 31.3447 39.548 31.6223 39.0642 31.7954C38.5804 31.9685 38.0644 32.033 37.5529 31.9842H3.85972ZM3.85972 29.9279H37.7161L26.7408 19.0748L25.6472 20.1684C24.9373 20.8865 24.2029 21.629 23.4604 22.3634C23.1157 22.761 22.6895 23.0798 22.2108 23.2984C21.7322 23.5169 21.212 23.6301 20.6858 23.6301C20.1596 23.6301 19.6396 23.5169 19.161 23.2984C18.6823 23.0798 18.2561 22.761 17.9114 22.3634L14.7291 19.1892L3.85972 29.9279ZM2.10518 28.3367L12.9582 17.5653L2.10518 6.81015V28.3367ZM28.4054 17.4755L39.2746 28.2387V6.68783L28.4054 17.4755ZM4.03105 5.38213C4.08151 5.58837 4.20275 5.77043 4.37372 5.89632L4.4554 5.9778L14.8596 16.4065L19.2008 20.7641C19.3813 20.9924 19.6055 21.1821 19.8606 21.3223C20.1157 21.4624 20.3963 21.5501 20.6858 21.5801C20.9739 21.5491 21.253 21.461 21.5066 21.3209C21.7602 21.1808 21.9833 20.9914 22.1628 20.7641L36.8511 6.02681L37.1776 5.68415L37.6834 5.12115H3.96571L4.03105 5.38213Z"
                          fill="#ffffff"
                        />
                        {messageArrive && (
                          <circle
                            cx="39.834"
                            cy="5.5"
                            r="5.5"
                            fill="#2636D9"
                          />
                        )}
                      </svg>
                      {showMessage && (
                        <div className="notification-card" style={{ left: "50%", transform: 'translateX(-30%)' }}>
                          <>
                            {loader ? (
                              <section className="sec-loading">
                                <div className="one"></div>
                              </section>
                            ) : (
                              <>
                                {chatNotificationRes?.length > 0 ? (
                                  <Notification data={chatNotificationRes} />
                                ) : (
                                  <section className="header-empty-record"> <a href={`/chat/${user_id}`}> Inbox</a> </section>
                                )}
                                {chatNotificationRes.length < countLength &&
                                  chatNotificationRes.length > 0 ? (
                                  <button
                                    className="loadmore-mgs-notofication"
                                    onClick={() =>
                                      getChatnotification(
                                        "loadmore",
                                        chatNotificationRes.length
                                      )
                                    }
                                  >
                                    load more
                                  </button>
                                ) : null}
                              </>
                            )}
                          </>
                        </div>
                      )}
                    </span>

                    <span
                      onClick={() => {
                        setShowNotification(!showNotification);
                        setshowMessage(false);
                        viewNotification("notification", 0);
                        setNotificationArrive(false);
                        setToggleUserDropdown(false);
                      }}
                      style={{ position: 'relative', margin: '0px' }}
                      className={`icon-for-header}`}
                    >
                      <svg
                        width="24"
                        height="30"
                        viewBox="0 0 29 38"
                        fill="#ffffff"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ width: '40px', height: '40px' }}
                      >
                        <path
                          d="M13.6609 32.3687C11.3252 32.1312 8.4255 31.953 5.57521 31.5175C4.55181 31.3557 3.58245 30.9491 2.74992 30.3323C1.9174 29.7156 1.24634 28.907 0.793509 27.9751C0.340673 27.0432 0.119542 26.0156 0.149103 24.9799C0.178663 23.9442 0.457875 22.9311 0.963128 22.0266C3.45713 17.6324 2.94257 18.8101 3.02175 13.8518C3.11576 10.9368 4.34183 8.17313 6.43974 6.14717C8.53764 4.12121 11.3422 2.99231 14.2586 3.00004C17.1751 3.00777 19.974 4.15144 22.0611 6.18849C24.1482 8.22553 25.3594 10.9956 25.438 13.911C25.4627 14.3197 25.4627 14.7295 25.438 15.1382C25.2056 17.37 25.8241 19.6074 27.17 21.403C27.7204 22.1667 28.0888 23.0462 28.2466 23.9743C28.4045 24.9024 28.3477 25.8543 28.0806 26.7571C27.7973 27.9898 27.1457 29.1074 26.2124 29.9612C25.2791 30.815 24.1081 31.3647 22.8551 31.5373C21.5487 31.7748 20.2126 31.9035 18.8963 32.0222C17.3326 32.1608 15.7689 32.2302 13.6609 32.3687ZM14.2548 29.9636C17.0259 29.6766 19.7771 29.4293 22.5185 29.0928C23.3226 28.9672 24.0667 28.5919 24.6457 28.02C25.2247 27.4481 25.6093 26.7085 25.7449 25.9061C25.8657 25.3528 25.8683 24.7801 25.7524 24.2258C25.6364 23.6715 25.4045 23.148 25.0719 22.6896C23.4434 20.5167 22.694 17.8095 22.9737 15.1085C22.9984 14.6733 22.9984 14.2374 22.9737 13.8022C22.9397 11.7226 22.1644 9.72357 20.7873 8.16496C19.4101 6.60634 17.5217 5.59054 15.4622 5.30077C13.3129 4.97193 11.1188 5.47035 9.32253 6.69541C7.52627 7.92047 6.26148 9.78094 5.78301 11.9019C5.51917 13.5373 5.42296 15.1954 5.49596 16.8503C5.51178 18.2625 5.14952 19.6533 4.44684 20.8784C4.02127 21.6404 3.53649 22.3629 3.13072 23.1349C2.81586 23.6958 2.63984 24.324 2.61751 24.9669C2.59519 25.6097 2.72698 26.2484 3.00218 26.8298C3.27737 27.4112 3.68785 27.9183 4.19917 28.3085C4.7105 28.6988 5.30787 28.9609 5.94127 29.073C8.70249 29.4689 11.4836 29.6766 14.2548 29.9636Z"
                          fill="#ffffff"
                        />
                        <path
                          d="M14.2053 38C13.333 37.9938 12.4747 37.7794 11.7018 37.3749C10.929 36.9704 10.2638 36.3873 9.76158 35.6741C9.64789 35.5518 9.56067 35.4073 9.5057 35.2496C9.45074 35.0919 9.42914 34.9246 9.44216 34.7582C9.45518 34.5917 9.50252 34.4296 9.58133 34.2824C9.66015 34.1352 9.7687 34.006 9.90003 33.9028C10.034 33.793 10.1898 33.7128 10.3569 33.6675C10.5241 33.6222 10.6991 33.6126 10.8701 33.6397C11.0412 33.6668 11.2045 33.73 11.3495 33.8248C11.4945 33.9195 11.6178 34.0438 11.7112 34.1896C13.265 35.9908 15.2049 36.0007 16.7389 34.1896C16.8275 34.0407 16.9465 33.9122 17.0883 33.8127C17.2301 33.7131 17.3915 33.6449 17.5616 33.6121C17.7318 33.5794 17.9069 33.5832 18.0756 33.623C18.2442 33.6629 18.4024 33.738 18.54 33.8434C18.6752 33.9513 18.7871 34.0856 18.8683 34.2384C18.9496 34.3912 18.9987 34.5591 19.0126 34.7316C19.0265 34.9041 19.0048 35.0776 18.949 35.2414C18.8933 35.4052 18.8048 35.5558 18.6886 35.6841C18.1802 36.3997 17.508 36.9834 16.728 37.3863C15.9481 37.7892 15.0831 37.9996 14.2053 38Z"
                          fill="#ffffff"
                        />
                        {notificationArrive && (
                          <circle cx="20.5" cy="5.5" r="5.5" fill="#2636D9" />
                        )}
                      </svg>
                      {showNotification && (
                        <div className="notification-card" style={{ left: "50%", transform: 'translateX(-50%)' }}>
                          <>
                            {loader ? (
                              <section className="sec-loading">
                                <div className="one"></div>
                              </section>
                            ) : (
                              <>
                                {notificationRes?.length > 0 ? (
                                  <UserNotification data={notificationRes} />
                                ) : (
                                  <section className="header-empty-record"> <span> No record found </span> </section>
                                )}
                                {notificationRes.length < countLength &&
                                  notificationRes.length > 0 ? (
                                  <button
                                    className="loadmore-mgs-notofication"
                                    onClick={() =>
                                      viewNotification(
                                        "loadmore",
                                        notificationRes.length
                                      )
                                    }
                                  >
                                    load more
                                  </button>
                                ) : null}
                              </>
                            )}
                          </>
                        </div>
                      )}
                    </span>

                    <div className="login-user-profile">
                      {userData?.profile_image == null ? (
                        <img
                          src="/assets/images/user-none.png"
                          alt="profile-image"
                          style={{ width: '40px' }}
                          onClick={() => {
                            setToggleUserDropdown(!toggleUserDropdown);
                            setshowMessage(false);
                            setShowNotification(false)
                          }}
                        />
                      ) : (
                        <img
                          src={userData?.profile_image}
                          alt=""
                          onClick={() => {
                            setToggleUserDropdown(!toggleUserDropdown);
                          }}
                        />
                      )}
                      {toggleUserDropdown && (
                        <div
                          className={`user-login-dropdown ${scrolled ? "active" : ""
                            }`}
                        >
                          <ul>
                            <li>
                              <Link to={"/profile"}>My Profile</Link>
                            </li>
                            <li>
                              <Link to={"/wallet"}>Wallet</Link>
                            </li>
                            <li>
                              <Link to={"/create"}>Create</Link>
                            </li>

                            <li
                              className={`setting ${toggleSettingDropdown ? "seeting-active" : ""
                                }`}
                              onClick={() =>
                                setToggleSettingDropdown(!toggleSettingDropdown)
                              }
                            >

                              Settings {toggleSettingDropdown ? <IoIosArrowDropupCircle /> : <IoIosArrowDropdownCircle />}
                              {toggleSettingDropdown ? (
                                <div>
                                  <ul>
                                    <Link to={"/setting"}>
                                      <li
                                        onClick={() =>
                                          setactiveTabsSetting("Notification")
                                        }
                                      >
                                        Notifications
                                      </li>
                                    </Link>
                                    <Link to={"/setting"}>
                                      <li
                                        onClick={() =>
                                          setactiveTabsSetting("Purchase")
                                        }
                                      >
                                        Purchase
                                      </li>
                                    </Link>
                                    <Link to={"/setting"}>
                                      <li
                                        onClick={() =>
                                          setactiveTabsSetting("Earnings")
                                        }
                                      >
                                        Earning
                                      </li>
                                    </Link>
                                    <Link to={"/setting"}>
                                      <li
                                        onClick={() =>
                                          setactiveTabsSetting("Edit")
                                        }
                                      >
                                        Edit
                                      </li>
                                    </Link>
                                  </ul>
                                </div>
                              ) : (
                                ""
                              )}
                            </li>
                            <li>
                              <Link to={"/subscription"}>Subscription</Link>
                            </li>

                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={connectWallet}
                    className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"
                      }`}
                    style={{
                      margin: user ? "0px 10px 0px 15px" : "0px 0px 0px 3px",
                    }}
                  >
                    {accountAddress !== "false" && walletConnected ? "Connected" : "Connect Wallet"}
                  </button>
                  {userParse?.email === null &&
                    <Link to={'/login'}>
                      <button className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"}`}
                        style={{ margin: '0px' }}>Login</button>
                    </Link>}
                </div>
              </div>
            </header>
            <div
              style={
                (showNotification || showMessage) // Check if either is true
                  ? {
                    width: "100vw",
                    height: "100vh",
                    position: "fixed",
                    top: "0",
                    left: "0",
                    backgroundColor: "transparent",
                    zIndex: "5"
                  }
                  : {
                    display: "none"
                  } // Null style when neither is true
              }
              onClick={() => {
                setShowNotification(false);
                setshowMessage(false);
              }}
            ></div>
          </>
          : data !== false && accountAddress == "false" ?
            <>
              <EmailHeader search={search} setSearch={setSearch} />
            </>
            :
            <>
              <UnAuthHeader search={search} setSearch={setSearch} />
            </>
      }
    </>
  );
};

export default Header;
