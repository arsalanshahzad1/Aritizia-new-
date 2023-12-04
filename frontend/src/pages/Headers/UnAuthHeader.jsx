import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import HeaderConnectPopup from "./HeaderConnectPopup";

const UnAuthHeader = ({ search, setSearch }) => {
  const [scrolled, setScrolled] = useState(false);
  const [connectPopup, setConnectPopup] = useState(false);
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
                    <Link to={'/search'}>
                  <FiSearch className={`search ${scrolled ? "black-color" : "white-color"}`} />
                  </Link>
                    <span className={`icon-for-header ${scrolled ? "black-svgs" : ""}`}>
                      <svg width="1" height="22" viewBox="0 0 1 22" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
                        <rect width="1" height="22" fill="#ffffff" />
                      </svg>
                    </span>
                    <button className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"}`} style={{ margin: "0px 0px 0px 3px" }} onClick={() => setConnectPopup(true)}>
                      Create Account
                    </button>
                    <Link to={'/login'}>
                      <button className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"}`} style={{ margin: "0px 0px 0px 3px" }}>
                        Login
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={'/search'}>
                  <FiSearch className="search black-color" />
                  </Link>
                    <span className="icon-for-header">
                      <svg width="1" height="22" viewBox="0 0 1 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="1" height="22" fill="#111111" />
                      </svg>
                    </span>

                    <button className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"}`} style={{ margin: "0px 0px 0px 3px" }} onClick={() => setConnectPopup(true)}>
                      Create Account
                    </button>
                    <Link to={'/login'}>
                      <button className={`header-connect-wallet ${scrolled ? "black-color" : "white-color"}`} style={{ margin: "0px 0px 0px 3px" }}>
                        Login
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      <HeaderConnectPopup connectPopup={connectPopup} setConnectPopup={setConnectPopup} />
    </>
  );
};

export default UnAuthHeader;
