import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "../../Dashboard/DashboardComponents/DashboardCard.css";
import { Link } from "react-router-dom";
import "./Cards.css";
import duck from "../../../public/assets/images/duck.png";
import chack from "../../../public/assets/images/chack.png";
import NftDrawer from "../../components/shared/NftDrawer";
import nft from "../../../public/assets/images/nft-big.png";
import ProfileDrawer from "../shared/ProfileDrawer";
import { ethers } from "ethers";

const MyNftCard = ({
  setLoader,
  onOpen,
  path,
  nftId,
  title,
  image,
  price,
  royalty,
  royaltyPrice,
  description,
  collection,
  collectionImages,
  user_id
}) => {

  const [showLinks, setShowLinks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  
  const onClose = () => {
    setIsVisible(false);
  };


  const [CreateCollection, setCreateCollection] = useState("");
  const [showCreateCollection, setshowCreateCollection] = useState(false);

  const [nftListingType, setNftListingType] = useState(0);
  

  const ListingNft =(listingType, openModel)=>{
    setNftListingType(listingType);
    setIsVisible(openModel);
  }


  return (
    <>
      <div className="col-lg-3 col-md-4">
          <div
            className="simple-card-main"
            style={{ position: "relative" }}
          >
            <div className="top">
              <div className="image-holder">
                <img src={image} alt="" />
              </div>

              {true && (
                <div className="social-media">
                  <p
                    onClick={() => ListingNft(0,true)}
                    
                    className="nft-fix-price"
                  >
                    Fix Price Resale
                  </p>
                  <p
                    onClick={() => ListingNft(1,true)}
                    className="nft-fix-price"
                  >
                    Auction Resale
                  </p>
                </div>
              )}
              
            </div>
            <div className="bottom">
              <div className="nft-icon">
                <img src={collectionImages} alt="" />

                <span className="checked-icon">
                  <img src={chack} alt="" />
                </span>
              </div>
              <div className="text-area">
                <div className="line-1" style={{marginTop:"12px"}}>
                  <div>{title}</div>
                  <div>{nftId}</div>
                </div>
                <div className="line-1">
                  <div>Price</div>
                  <div>
                  <div className="right" style={{ display: "flex", alignItems: "center", margin: "5px 0px" }}>
                  <img src="/assets/images/bitCoin.png" alt="" style={{ marginRight: "5px" }} />
                      {Number(ethers.utils.formatEther(price?.toString()))?.toFixed(5)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </Link> */}
      </div>
      <NftDrawer
      setLoader={setLoader} 
      nftId={nftId}
        isVisible={isVisible}
        onClose={onClose}
        nftListingType={nftListingType}
        image={image}
        title={title}
        royalty={royalty}
        royaltyPrice={royaltyPrice}
        description={description}
        collection={collection}
      />
    </>
  );
};

export default MyNftCard;
