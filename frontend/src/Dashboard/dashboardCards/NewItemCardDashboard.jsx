import React, { useEffect, useCallback, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import "../../components/cards/Cards.css";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { ethers } from "ethers";
import NftCountdown from "../../components/shared/NftCountdown";
import PlaceABidDrawerDashboard from "./PlaceABidDrawerDashboard";

const NewItemCardDashboard = ({
  setLoader,
  id,
  isLive,
  title,
  image,
  description,
  basePrice,
  startTime,
  endTime,
  highestBidIntoETH,
  highestBidIntoUSDT,
  highestBidderAddress,
  royaltyPrice,
  collection,
  collectionImages,
  seller,
  user_id,
  nft_like,
  size,
  is_unapproved
}) => {

  const [showLinks, setShowLinks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [endDate, setEndDate] = useState("");


  function convertTimestampToCustomFormat() {
    const date = new Date(endTime * 1000);

    const day = date.getDate();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTimestamp = `${day} ${year} ${hours}:${minutes}`;
    setEndDate(formattedTimestamp);
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    convertTimestampToCustomFormat();
  }, [endDate]);

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

  return (
    <>
      <div className={`${size} col-md-4 col-12 new-item-card`}>
        <div className="sec-five-wrap" onClick={() => openDrawer()}>
          <div className="image">
            <img src={image} alt="" width={"100%"} />
            <span>
            {isLive ?
                <NftCountdown endDateTime={new Date(endTime * 1000)} />
              :
              "Auction Ended"
              }
            </span>
          </div>
          <div className="detail-wrap">
            <div className="center-icon">
              <div className="icon">
                <img src={collectionImages} alt="" />
                <img src="/assets/images/chack.png" alt="" />
              </div>
            </div>
            <div className="topsection">
              <div className="left">
                <p>{title}</p>
                <span>
                  {+highestBidIntoETH > basePrice ? `${Number(ethers.utils.formatEther(highestBidIntoETH?.toString()))?.toFixed(5)} ETH` : `${Number(ethers.utils.formatEther(basePrice?.toString()))?.toFixed(5)} ETH`}
                </span>
              </div>
              <div
                className="right"
                style={{ cursor: "pointer", padding: "15px 0px 15px 20px" }}
              >
                {id}
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlaceABidDrawerDashboard
      setLoader={setLoader}
        isVisible={isVisible}
        onClose={onClose}
        id={id}
        isLive={isLive}
        title={title}
        image={image}
        description={description}
        basePrice={basePrice}
        startTime={startTime}
        endTime={endTime}
        highestBidIntoETH={highestBidIntoETH}
        highestBidIntoUSDT={highestBidIntoUSDT}
        highestBidderAddress={highestBidderAddress}
        royaltyPrice={royaltyPrice}
        collection={collection}
        collectionImages={collectionImages}
        seller={seller}
        user_id={user_id}
        is_unapproved={is_unapproved}
        nft_like={nft_like}
      />
    </>
  );
};

export default NewItemCardDashboard;
