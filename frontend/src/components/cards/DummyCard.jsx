import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "./Cards.css";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import ProfileDrawer from "../shared/ProfileDrawer";

const DummyCard = () => {

  return (
    <>
      <div className="col-lg-3 col-md-4 mt-5">
        <Link>
          <div className="css-vurnku" style={{ position: "relative" , pointerEvents : 'none' , marginBottom : '0px' }}>
            <a className="css-118gt74" style={{ background: "rgb(196 196 196)" , pointerEvents : 'none' , filter : 'blur(10px)'}}>
              <div className="css-15eyh94">
                <div className="css-2r2ti0">
                  <div className="css-15xcape">
                    <span
                      className="lazy-load-image-custom-wrapper lazy-load-image-background  lazy-load-image-loaded"
                      style={{
                        display: "flex",
                        width: "100% ",
                        height: "100%",
                        borderRadius: "8px 8px 0px 0px",
                      }}
                    >
                      <img src='/assets/images/liked4-Copy.png' className="J-image" />
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="J-bottom css-1xg74gr"
                style={{ position: "relative" , background: "rgb(196 196 196)", pointerEvents : 'none' }}
              >
                <BiDotsHorizontalRounded className="doted-icon" />
                <div className="css-fwx73e">
                  <div className="css-10nf7hq detail-wrap">
                    <div className="center-icon">
                      <div className="icon">
                        <img src='/assets/images/duck.png' alt="" />
                        <img src="/assets/images/chack.png" alt="" />
                      </div>
                    </div>
                    <div className="top">
                      <div className="left">AAAAA</div>
                      <div className="right">12</div>
                    </div>
                    <div className="bottom">
                      <div className="left">Price</div>
                      <div className="right">
                        <img src="/assets/images/bitCoin.png" alt="" />
                        12345
                      </div>
                    </div>
                    <div className="css-x2gp5l"></div>
                  </div>
                </div>
              </div>
            </a>
            {/* <img src="/assets/images/btc.png" alt="" className='btc-gray-logo' onClick={() => { setShowLinks(!showLinks) }} /> */}
          </div>
        </Link>

        {/* <button onClick={buyWithETH}>Buy with ETH</button>
                                    <button onClick={buyWithUSDT}>Buy with USDT</button> */}
      </div>
    </>
  );
};

export default DummyCard;

