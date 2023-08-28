import React, { useRef, useCallback, useState, useEffect } from "react";
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
  TwitterShareButton,
} from "react-share";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";

const SimpleCard = ({
  onOpen,
  path,
  id,
  title,
  image,
  price,
  crypto,
  royalty,
  description,
  collection,
  collectionImages,
}) => {
  const [showLinks, setShowLinks] = useState(false);
  // const [walletConnected, setWalletConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  // const openDrawer = () => {
  //   if (showLinks === true) {
  //     return onOpen(false);
  //   } else {
  //     setIsVisible(true);
  //   }
  // };
  // const getProviderOrSigner = async () => {
  //   console.log("getProviderOrSigner")
  // }

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  console.log("USER in buy now", userAddress);

  const openDrawer = () => {
    if (showLinks === true) {
      return onOpen(false);
    } else {
      setIsVisible(true);
    }
  };

  const [showDiscountPopUp, setshowDiscountPopUp] = useState(false);
  const [discountPercentage, setdiscountPercentage] = useState("");
  const value = price;
  const [discountedValue, setdiscountedValue] = useState(value);

  useEffect(() => {
    if (discountPercentage < 0 || discountPercentage > 100) {
      alert("Discount percentage should be between 1 - 100");
      setdiscountPercentage(0);
    } else {
      handleDiscount();
    }
  }, [discountPercentage]);

  const giveDiscount = async () => {
    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    console.log("marketplaceContract", marketplaceContract);

    console.log("TokenId", id);
    console.log("Discount", discountPercentage);

    await (
      await marketplaceContract.changeFanDiscountPercent(id, discountPercentage)
    ).wait();
    setshowDiscountPopUp(false);
    setdiscountPercentage(0);
    toast.success("Discount added successfully", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const handleDiscount = () => {
    console.log("i am ruunign");
    const discountvalue = (value / 100) * discountPercentage;
    setdiscountedValue(value - discountvalue);
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
                <div className="social-media">
                  <InstapaperShareButton
                    url="http://artizia.pluton.ltd/profile"
                    title="Ali Khan"
                  >
                    <p>Instagram</p>
                  </InstapaperShareButton>
                  <TwitterShareButton
                    url="http://artizia.pluton.ltd/profile"
                    title="Ali Khan"
                  >
                    <p>Twitter</p>
                  </TwitterShareButton>
                  <FacebookShareButton
                    url="http://artizia.pluton.ltd/profile"
                    title="Ali Khan"
                  >
                    <p>Facebook</p>
                  </FacebookShareButton>
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
                    <svg
                      width="20"
                      height="19"
                      viewBox="0 0 24 23"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M23.599 14.2846C23.0471 16.4913 21.8517 18.4852 20.1641 20.014C18.4765 21.5429 16.3725 22.5382 14.118 22.874C11.8636 23.2098 9.55992 22.871 7.4984 21.9006C5.43688 20.9301 3.71004 19.3715 2.53625 17.4219C1.36245 15.4723 0.794409 13.2191 0.903943 10.9474C1.01348 8.67565 1.79567 6.48733 3.15162 4.65913C4.50757 2.83092 6.37637 1.44494 8.52175 0.676422C10.6671 -0.0920938 12.9927 -0.208627 15.2044 0.341555C16.6735 0.706569 18.0561 1.35686 19.2731 2.25526C20.4902 3.15366 21.5179 4.28256 22.2975 5.57744C23.0771 6.87231 23.5933 8.30779 23.8166 9.80182C24.0399 11.2958 23.966 12.8191 23.599 14.2846Z"
                        fill="#F7931A"
                      />
                      <path
                        d="M17.4988 9.86401C17.7274 8.33318 16.5595 7.5084 14.9626 6.96168L15.4824 4.88724L14.23 4.57482L13.7258 6.59303L12.6988 6.36496L13.2061 4.33427L11.9536 4.02185L11.437 6.09629C11.1614 6.0338 10.8922 5.97132 10.6292 5.90571L8.88512 5.47146L8.55008 6.81796C8.55008 6.81796 9.48942 7.03353 9.46751 7.04603C9.64273 7.06644 9.80282 7.15498 9.91302 7.29243C10.0232 7.42988 10.0747 7.60515 10.0562 7.7802L9.46437 10.1514L8.63776 13.4599C8.62129 13.519 8.59305 13.5742 8.55472 13.6221C8.5164 13.6701 8.46877 13.7098 8.4147 13.739C8.36062 13.7682 8.3012 13.7861 8.24 13.7919C8.1788 13.7976 8.11707 13.7909 8.0585 13.7723C8.0585 13.7911 7.13794 13.5443 7.13794 13.5443L6.51172 14.9907L8.15869 15.4C8.47181 15.475 8.763 15.5562 9.05733 15.6312L8.53443 17.7275L9.78688 18.0399L10.3066 15.9655C10.6511 16.0592 10.9861 16.1436 11.3117 16.2248L10.7951 18.2898L12.0476 18.6023L12.5736 16.5091C14.7278 16.9152 16.3529 16.7528 17.0323 14.8064C17.5834 13.2443 17.0073 12.3352 15.8707 11.7448C16.6973 11.5542 17.3204 11.0106 17.4863 9.89213L17.4988 9.86401ZM14.6088 13.9067C14.2174 15.4687 11.5748 14.6283 10.7168 14.4128L11.4088 11.6354C12.2667 11.8478 15.0159 12.2602 14.6088 13.9067ZM15.0002 9.84527C14.6433 11.273 12.4421 10.5482 11.7282 10.3701L12.3544 7.84893C13.0714 8.02076 15.3728 8.35192 15.0002 9.83902V9.84527Z"
                        fill="white"
                      />
                    </svg>

                    {price}
                  </div>
                </div>
              </div>
            </div>
            <div
              onClick={() => {
                setshowDiscountPopUp(true);
              }}
              className="add-discount-text"
            >
              Add Discount
            </div>
          </div>
        </Link>
      </div>
      {showDiscountPopUp && (
        <>
          <div className="discount-popup">
            <div className="discount-popup-inner">
              <h3>DISCOUNT</h3>
              <div className="line-2">
                <div className="discount-text">Total Value</div>
                <div className="total-value-div">{value} ETH</div>
              </div>
              <div className="line-2">
                <div className="discount-text">Percent</div>
                <div className="percentage-div">
                  <input
                    placeholder="0"
                    value={discountPercentage}
                    onChange={(e) => {
                      setdiscountPercentage(e.target.value);
                    }}
                    type="number"
                    className="input-percent"
                  />
                  <div>%</div>
                </div>
              </div>
              <div className="line-2">
                <div className="discount-text">Value</div>
                <div className="value-div">{discountedValue} ETH</div>
              </div>

              <div className="popUp-btn-group">
                <div onClick={giveDiscount} className="button-styling btnCC">
                  Add
                </div>
                <div
                  onClick={() => {
                    setshowDiscountPopUp(false), setdiscountPercentage(0);
                  }}
                  className="button-styling-outline btnCC"
                >
                  <div className="btnCCin">Cancel</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <ProfileDrawer
        isVisible={isVisible}
        onClose={onClose}
        id={id}
        title={title}
        image={image}
        price={price}
        paymentMethod={crypto}
        royalty={royalty}
        description={description}
        collection={collection}
        userAddress={userAddress}
      />
      <ToastContainer />
    </>
  );
};

export default SimpleCard;
