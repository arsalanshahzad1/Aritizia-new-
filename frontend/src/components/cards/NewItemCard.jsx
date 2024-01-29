import React, { useEffect, useCallback, useState, useContext } from "react";
import { AiFillHeart } from "react-icons/ai";
import "./Cards.css";
import PlaceABidDrawer from "../shared/PlaceABidDrawer";
import NftCountdown from "../shared/NftCountdown";
import MarketplaceAddress from "../../contractsData/ArtiziaMarketplace-address.json";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import { ethers } from "ethers";
import { Store } from "../../Context/Store";

const NewItemCard = ({
  setLoader,
  nftId,
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
  owner,
  firstOwner,
  user_id,
  nft_like,
  size
}) => {


  // const [showLinks, setShowLinks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [endDate, setEndDate] = useState("");

  const [isLive, setIsLive] = useState(false);

  // const {isLive, getLiveStatus}= useContext(Store)


  const unixTimestamp = Math.floor(Date.now() / 1000);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  function convertTimestampToCustomFormat() {
    if(unixTimestamp > startTime && unixTimestamp < endTime){
      setIsLive(true)
    }
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
  }, [endDate,startTime]);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const openDrawer = () => {
    // if (showLinks === true) {
    //   return onOpen(false);
    // } else {
      setIsVisible(true);
    // }
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
                startTime > unixTimestamp ? 
                "Coming Soon" 
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
                  {+highestBidIntoETH > +basePrice ? `${Number(ethers.utils.formatEther(highestBidIntoETH?.toString()))?.toFixed(5)} ETH` : `${Number(ethers.utils.formatEther(basePrice?.toString()))?.toFixed(5)} ETH`}
                </span>
              </div>
              <div
                className="right"
                style={{ cursor: "pointer", padding: "15px 0px 15px 20px" }}
              >
                {nftId}
              </div>
            </div>
            <div className="bottom">
              {startTime > unixTimestamp ?
                <div className="left" >
                  <p>Coming Soon</p>
                </div>
                :
                owner?.toUpperCase() === MarketplaceAddress?.address?.toUpperCase() && (
                  seller?.toString()?.toUpperCase() === userAddress?.toString()?.toUpperCase() ?
                    <div className="left">
                      <p>Your NFT</p>
                    </div> :
                    isLive ?
                      <div className="left" >
                        <p>Place a bid</p>
                      </div>
                      :
                      <div className="left" >
                        <p>Auction Ended</p>
                      </div>
                )}
              <div className="right">
                <AiFillHeart />
                <span>{nft_like}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlaceABidDrawer
        setLoader={setLoader}
        isVisible={isVisible}
        onClose={onClose}
        isLive={isLive}
        nftId={nftId}
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
        owner={owner}
        firstOwner={firstOwner}
        user_id={user_id}
        nft_like={nft_like}
      />
    </>
  );
};

export default NewItemCard;
