import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import "../DashboardComponents/DashboardCard.css";
import { Link } from "react-router-dom";
import nft from "../../../public/assets/images/nft-big.png";
import { BsCheck } from "react-icons/bs";
import NftControllingDrawer from "../userControllingNft/NftControllingDrawer";
import { ethers } from "ethers";

const
  DashboardCard2 = ({
    onOpen,
    path,
    id,
    title,
    image,
    price,
    paymentMethod,
    royalty,
    description,
    collection,
    getSelectedId,
    index,
    selectedNTFIds,
    approveNFT,
    collectionImages,
    is_unapproved
  }) => {

  
    const [showLinks, setShowLinks] = useState(false);
    const userData = JSON.parse(localStorage.getItem("data"));
    const userAddress = userData?.wallet_address;
    const [showEditSidebar, setshowEditSidebar] = useState(false);
    const [chack, setChack] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
  
    
    
    const onClose = async () => {
        setIsVisible(false);
    };

    const openDrawer = () => {
      setIsVisible(true);
    };

    return (
      <>
        <div className="col-lg-3 col-md-4" key={index}>
          <div
            className="seven-line-nft-card" onClick={() => { setChack(!chack); getSelectedId(id); }}>
            <span>
              <BsCheck className={`${selectedNTFIds.includes(id) ? "red" : "transparent"}`} />
            </span>
          </div>
          <Link to={path} style={{ position: 'relative' }}>
            {is_unapproved && <div className="disable-nft-card"></div>}

            <div className="css-vurnkuu" style={{ position: "relative", height: "auto !important" }}>
              <a className="css-118gt75">
                <div className="css-15eyh94" >
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
                        <img src={image} className="J-image" />
                        {!is_unapproved &&
                          <>
                            {true && (
                              <div className="social-links1">
                                <ul>
                                  <li onClick={() => openDrawer()}>
                                    <a href="">VIEW</a>
                                  </li>
                                </ul>
                              </div>
                            )}
                          </>
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="J1-bottom css-1xg74gr"
                  style={{ position: "relative" }}
                >
                  <BiDotsHorizontalRounded className="doted-icon" />
                  <div className="css-fwx73e">
                    <div className="css-10nf7hq detail-wrap">
                      <div className="center-icon">
                        <div className="icon">
                          <img src={collectionImages} alt="" />
                          <img src="/assets/images/chack.png" alt="" />
                        </div>
                      </div>
                      <div className="top">
                        <div className="left">{title}</div>
                        <div className="right">{id}</div>
                      </div>
                      <div className="bottom">
                        <div className="left">Price</div>
                        <div className="right">
                          <img src="/assets/images/bitCoin.png" alt="" />
                          {Number(ethers.utils.formatEther(price?.toString()))?.toFixed(5)}
                        </div>
                      </div>
                      <div className="css-x2gp5l"></div>
                    </div>
                    {selectedNTFIds?.length > 0 ? null : (
                      <div className="nft-card-btn-holder">
                        {!is_unapproved &&  <button onClick={() => approveNFT(false, [id])}>Unapprove</button>}
                      </div>
                    )}
                  </div>
                </div>
              </a>
            </div>
          </Link>
        </div>
        <NftControllingDrawer
          isVisible={isVisible}
          onClose={onClose}
          id={id}
          title={title}
          image={image}
          price={price}
          paymentMethod={paymentMethod}
          royalty={royalty}
          description={description}
          collection={collection}
          userAddress={userAddress}
          showBuyNow={false}
          ShowAcceptbtn={true}
        />
      </>
    );
  };

export default DashboardCard2;
