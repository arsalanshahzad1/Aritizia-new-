import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "./Cards.css";
import duck from "../../../public/assets/images/duck.png";
import chack from "../../../public/assets/images/chack.png";
import { Link } from "react-router-dom";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import ProfileDrawer from "../shared/ProfileDrawer";
import Web3Modal from "web3modal";
import { ToastContainer, toast } from "react-toastify";

import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import {
  FacebookShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";
import { Store } from "../../Context/Store";

const SimpleCard = ({
  onOpen,
  path,
  id,
  title,
  image,
  price,
  paymentMethod,
  royalty,
  royaltyPrice,
  description,
  collection,
  collectionImages,
  seller,
  user_id,
  setLoader
}) => {
  const [showLinks, setShowLinks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const openDrawer = () => {
    if (showLinks === true) {
      return onOpen(false);
    } else {
      setIsVisible(true);
    }
  };

  const {
    account,
    checkIsWalletConnected,
    getSignerMarketContrat,
    cancelListing,
    getSignerNFTContrat,
  } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected();
  }, [account]);

  const cancelList = async () => {
    try {
      setLoader(true)
      let cancel = await getSignerMarketContrat().cancelListing(
        getSignerNFTContrat().address,
        id,
        userData?.id
      );
      cancel.wait();
      setTimeout(() => {
        setLoader(false);
      }, [10000]);
      setLoader(false)
      window.location.reload();
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  };

  return (
    <>
      <div className="col-lg-3 col-md-4">
        <Link to={path}>
          <div className="simple-card-main" style={{ position: "relative" }}>
            <div className="top">
              <div className="image-holder">
                <img src={image} alt="" />
              </div>
              <div
                onClick={() => setShowLinks(!showLinks)}
                className="share-icon"
              >
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="18" cy="18" r="18" fill="#7F7E7E" />
                  <path
                    d="M19.5324 23.8685C17.615 22.7393 15.6631 21.6218 13.7419 20.4926C13.5079 20.3559 13.4159 20.52 13.2855 20.6215C12.8541 20.9665 12.3444 21.1952 11.8034 21.2866C11.2624 21.378 10.7075 21.3293 10.1899 21.1448C9.67224 20.9603 9.20851 20.646 8.84142 20.2309C8.47434 19.8158 8.2157 19.3132 8.08935 18.7695C7.93586 18.115 7.98089 17.4285 8.21848 16.8006C8.45607 16.1727 8.87504 15.6331 9.42003 15.253C9.96773 14.8617 10.6223 14.6557 11.2912 14.6641C11.96 14.6725 12.6094 14.8949 13.1475 15.2998C13.2661 15.4163 13.4224 15.4846 13.587 15.4918C13.7515 15.499 13.913 15.4446 14.041 15.3389C15.8587 14.2566 17.6917 13.2016 19.5133 12.1428C19.379 9.96251 20.2112 8.55589 21.9023 8.10655C22.6327 7.91407 23.4059 7.98382 24.0918 8.30405C24.7777 8.62428 25.3343 9.17546 25.6681 9.86483C25.9915 10.5496 26.0781 11.3257 25.9138 12.067C25.7494 12.8083 25.3439 13.4712 24.7631 13.9479C24.11 14.4631 23.2927 14.7135 22.4691 14.6508C21.6454 14.588 20.8738 14.2165 20.3032 13.608L14.436 17.0151C14.4888 17.3358 14.5233 17.6594 14.5395 17.9841C14.5235 18.3232 14.489 18.661 14.436 18.9961L20.3109 22.3955C20.6706 22.0054 21.1163 21.7081 21.611 21.528C22.1058 21.348 22.6354 21.2904 23.1563 21.36C23.8609 21.444 24.5166 21.7691 25.0162 22.2821C25.5554 22.819 25.8958 23.5294 25.9797 24.2928C26.0636 25.0562 25.8858 25.8257 25.4764 26.4707C25.0691 27.1174 24.4546 27.6004 23.7373 27.8376C23.02 28.0748 22.2442 28.0516 21.5419 27.7719C20.0348 27.178 19.2448 25.6619 19.5324 23.8685Z"
                    fill="white"
                  />
                </svg>
              </div>
              {showLinks && (
                <div className="social-links">
                  <ul>
                    <li>
                      <a>
                        <LinkedinShareButton
                          url={`https://${window.location.host}/other-profile?add=${user_id}`}
                          title="Artizia"
                        >
                          <p>Linkedin</p>
                        </LinkedinShareButton>
                      </a>
                    </li>
                    <li>
                      <a>
                        <TwitterShareButton
                          url={`https://${window.location.host}/other-profile?add=${user_id}`}
                          title="Artizia"
                        >
                          <p>Twitter</p>
                        </TwitterShareButton>
                      </a>
                    </li>
                    <li>
                      <a>
                        <FacebookShareButton
                          url={`https://${window.location.host}/other-profile?add=${user_id}`}
                          title="Artizia"
                        >
                          <p>Facebook</p>
                        </FacebookShareButton>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div onClick={openDrawer} className="bottom">
              <div className="nft-icon">
                <img src={collectionImages} alt="" />
                <span className="checked-icon">
                  <img src={chack} alt="" />
                </span>
              </div>
              <div className="text-area">
                <div className="line-1">
                  <div>{title}</div>
                  <div>{id}</div>
                </div>
                <div className="line-1">
                  <div>Price</div>
                  <div>
                    <div
                      className="right"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        margin: "5px 0px",
                      }}
                    >
                      <img
                        src="/assets/images/bitCoin.png"
                        alt=""
                        style={{ marginRight: "5px" }}
                      />
                      {Number(
                        ethers.utils.formatEther(price?.toString())
                      )?.toFixed(5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
              {account?.toUpperCase() === seller?.toUpperCase() && (
            <div className="J-buynow css-1elubna">
                <div className="button css-pxd23z" onClick={() => cancelList()}>
                  <p>Cancel Listing</p>
                </div>
            </div>
              )}
          </div>
        </Link>
      </div>
      <ProfileDrawer
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
        collectionImages={collectionImages}
        setIsVisible={setIsVisible}
        seller={seller}
        user_id={user_id}
        royaltyPrice={royaltyPrice}
      />
    </>
  );
};

export default SimpleCard;
