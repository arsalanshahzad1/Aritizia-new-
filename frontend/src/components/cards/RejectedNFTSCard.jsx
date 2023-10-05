import React, { useRef, useCallback, useState, useEffect } from "react";
import "./Cards.css";
import chack from "../../../public/assets/images/chack.png";
import { Link } from "react-router-dom";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import axios from "axios";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";

import {
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
} from "react-share";
import { getProviderOrSigner } from "../../methods/walletManager";
import apis from "../../service";

const RejectedNFTSCard = ({
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
  userId,
}) => {
  const [showLinks, setShowLinks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [rejectedNfts, setRejectedNfts] = useState([]);

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

  // const [rejectedList, setRejectedList] = useState([]);

  const viewRejectedNftList = async (userId) => {
    console.log("userId", userId);
    try {
      const response = await apis.viewRejectedNftList(userId);
      console.log("response.data.data", response.data.data);

      if (response.status) {
        // setRejectedList(response.data.data);
        getRejecteNfts(response.data.data);
      } else {
      }
    } catch (e) {
      console.log("Error: ", e);
    }
    setLoader(false)
  };

  const getRejecteNfts = async (rejectedList) => {
    const provider = await getProviderOrSigner();

    console.log("LISY", rejectedList);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      provider
    );
    // console.log("rejectedList", rejectedList);

    let rejected = [];
    let emptyList = [];
    setRejectedNfts(emptyList);

    // console.log("rejectedList", rejectedList);

    console.log("Running");
    if (rejectedList.length > 0 && rejectedList != "") {
      for (let i = 0; i < rejectedList.length; i++) {
        let id;
        let collectionImage = rejectedList[i].collection_image;
        id = +rejectedList[i];
        // id =i;
        console.log("zzz", id);

        const metaData = await nftContract.tokenURI(id);

        const structData = await marketplaceContract._idToNFT(id);

        const fanNftData = await marketplaceContract._idToNFT2(id);

        let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

        setDiscountPrice(discountOnNFT);

        let auctionData = await marketplaceContract._idToAuction(id);

        let listingType = structData.listingType;

        let highestBid = ethers.utils.formatEther(
          auctionData.highestBid.toString()
        );

        setDiscountPrice(discountOnNFT);

        let collectionId = structData.collectionId.toString();

        console.log("collectionId", collectionId);
        const response = await apis.getNFTCollectionImage(collectionId);
        if (response.status) {
          console.log(response.data, "saad");
          const collectionImages =
            response?.data?.data?.media?.[0]?.original_url;
          console.log(
            response?.data?.data?.media?.[0]?.original_url,
            "collectionImagesss"
          );

          console.log("zayyan", id);

          // let auctionData = await marketplaceContract._idToAuction(id);

          // let listingType = structData.listingType;

          const price = ethers.utils.formatEther(structData.price.toString());

          axios
            .get(metaData)
            .then((response) => {
              const meta = response.data;
              let data = JSON.stringify(meta);

              data = data.slice(2, -5);
              data = data.replace(/\\/g, "");

              data = JSON.parse(data);
              // Extracting values using dot notation
              // const price = data.price;
              // listingType = data.listingType;
              const crypto = data.crypto;
              const title = data.title;
              const image = data.image;
              const royalty = data.royalty;
              const description = data.description;
              const collection = data.collection;

              const nftData = {
                id: id, //
                title: title,
                image: image,
                price: price,
                crypto: crypto,
                royalty: royalty,
                description: description,
                collection: collection,
                collectionImages: collectionImages,
              };
              console.log("nftData", nftData);
              // rejected.push(nftData);
              setRejectedNfts((prev) => [...prev, nftData]);
            })

            .catch((error) => {
              console.error("Error fetching metadata:", error);
            });
        } else {
          console.log("error:", response?.data?.message);
        }
      }
    }
  };

  useEffect(() => {
    viewRejectedNftList(userId);
  }, []);

  useEffect(() => {}, [rejectedNfts]);

  const [loader, setLoader] = useState(true)

  if(loader){
    return(
      <>
        <section className="sec-loading">
          <div className="one"></div>
        </section>
      </>
    )
  }

  return (
    <>
      {rejectedNfts.length > 0 ? (
        <>
          {rejectedNfts.map((item) => {
            return (
              <div className="col-lg-3 col-md-4">
                <Link to={path}>
                  <div
                    className="simple-card-main"
                    style={{ position: "relative" }}
                  >
                    <div className="top">
                      <div className="image-holder">
                        <img src={item?.image} alt="" />
                      </div>
                    </div>
                    <div className="bottom">
                      <div className="nft-icon">
                        <img src={item?.collectionImages} alt="" />
                        <span className="checked-icon">
                          <img src={chack} alt="" />
                        </span>
                      </div>
                      <div className="text-area">
                        <div className="line-1">
                          <div>{item?.title}</div>
                          <div>{item?.id}</div>
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

                            {item?.price}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </>
      ) : (
        <>
          <div className="data-not-avaliable">
            <h2>No data avaliable</h2>
          </div>
        </>
      )}
    </>
  );
};

export default RejectedNFTSCard;
