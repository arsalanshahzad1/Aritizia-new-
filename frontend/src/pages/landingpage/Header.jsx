import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";

const Header = ({ search, setSearch, connectWallet }) => {
  const [scrolled, setScrolled] = useState(false);
  const [toggleUserDropdown, setToggleUserDropdown] = useState(false);
  const [toggleSettingDropdown, setToggleSettingDropdown] = useState(false);

  const location = useLocation();
  const path = location.pathname;

  

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <>
      <header id={`${scrolled ? "active" : ""}`}>
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-4 col-3">
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
            <div className="col-lg-6 col-md-8 col-9">
              <div className="left">
                {path === "/" ? (
                  <>
                    <FiSearch
                      className={`search ${
                        scrolled ? "black-color" : "white-color"
                      }`}
                      onClick={() => setSearch(true)}
                    />
                    <button
                      onClick={connectWallet}
                      className={`header-connect-wallet ${
                        scrolled ? "black-color" : "white-color"
                      }`}
                    >
                      Connect Wallet
                    </button>
                  </>
                ) : (
                  <>
                    <FiSearch
                      className="search black-color"
                      onClick={() => setSearch(true)}
                    />
                    <button className="header-connect-wallet black-color">
                      Connect Wallet
                    </button>
                  </>
                )}
                {/* <Link to={'/profile'}> */}
                {/* <FaRegUser className={`user ${scrolled ? 'black-color' : 'white-color'}`}/> */}
                {/* </Link> */}

                <div className="login-user-profile">
                  <img
                    src="/assets/images/user-image.png"
                    alt=""
                    onClick={() => {
                      setToggleUserDropdown(!toggleUserDropdown);
                    }}
                  />
                  {toggleUserDropdown && (
                    <div
                      className={`user-login-dropdown ${
                        scrolled ? "active" : ""
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
                          className={`setting ${
                            toggleSettingDropdown ? "seeting-active" : ""
                          }`}
                          onClick={() =>
                            setToggleSettingDropdown(!toggleSettingDropdown)
                          }
                        >
                          Setting +
                          {toggleSettingDropdown ? (
                            <div>
                              <ul>
                                <li>Notifications</li>
                                <li>Appearance</li>
                                <li>Earning</li>
                                <li>
                                  <Link to={"/setting"}>Edit</Link>
                                </li>
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
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
