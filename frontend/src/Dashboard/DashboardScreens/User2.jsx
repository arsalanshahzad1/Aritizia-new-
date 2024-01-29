import React from 'react'
import { useState, useEffect,useContext } from "react";
import Header from "../../pages/landingpage/Header";
import { Navigate, useNavigate } from "react-router-dom";
import SocialShare from "../../components/shared/SocialShare";
import { BsFillEnvelopeFill } from "react-icons/bs";
import NewItemCard from "../../components/cards/NewItemCard";
import BuyNow from "../../components/cards/BuyNow";
import nft from "../../../public/assets/images/nft-big.png";
import DashboardCard from "../DashboardComponents/DashboardCard";
import DashboardCard2 from "./DashboardCard2.jsx";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
// import {
//   connectWallet,
//   getProviderOrSigner,
// } from "../../methods/walletManager";
import apis from "../../service/index";
import axios from "axios";

function User2({ search, setSearch }) {
  const navigate = useNavigate();
  const [tabs, setTabs] = useState(0);

  const [nftList, setNftList] = useState([]);

  // let userAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const [isVisible, setIsVisible] = useState(false);

  const {account,checkIsWalletConnected}=useContext(Store);

  useEffect(()=>{
    checkIsWalletConnected()
  },[account])

  const onOpen = (action) => {
    setIsVisible(action);
  };

  useEffect(() => {
    getUsersNfts();
  }, []);

  const getUsersNfts = async () => {
   
    let emptyList = [];
    setNftList(emptyList);

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const userAddress = signer.getAddress();

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

    let listingType;

    let mintedTokens = await marketplaceContract.getUsersNfts(userAddress);
   
    let myNFTs = [];

    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId?.toString();

      let collectionId;
      collectionId = +mintedTokens[i]?.collectionId?.toString();

      const response = await apis.getNFTCollectionImage(collectionId);

      const collectionImages = response?.data?.data?.media?.[0]?.original_url;

      const metaData = await nftContract.tokenURI(id);

      const structData = await marketplaceContract._idToNFT(id);

      let auctionData = await marketplaceContract._idToAuction(id);

      listingType = structData?.listingType;

      const price = ethers.utils.formatEther(structData?.price?.toString());

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          const paymentMethod = data?.crypto;
          const title = data?.title;
          const image = data?.image;
          const royalty = data?.royalty;
          const description = data?.description;
          const collection = data?.collection;

          const nftData = {
            id: id, //
            title: title,
            image: image,
            price: price,
            paymentMethod: paymentMethod,
            royalty: royalty,
            description: description,
            collection: collection,
            collectionImages: collectionImages,
          };
          setNftList((prev) => [...prev, nftData]);
        })
        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  return (
    <div className="user">
      <div className="back-btn">
        <div onClick={() => navigate(-1)}>
          <svg
            width="32"
            height="20"
            viewBox="0 0 54 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.585785 13.5858C-0.195263 14.3668 -0.195263 15.6332 0.585785 16.4142L13.3137 29.1421C14.0948 29.9232 15.3611 29.9232 16.1421 29.1421C16.9232 28.3611 16.9232 27.0948 16.1421 26.3137L4.82843 15L16.1421 3.68629C16.9232 2.90524 16.9232 1.63891 16.1421 0.857861C15.3611 0.0768122 14.0948 0.0768121 13.3137 0.857861L0.585785 13.5858ZM54 13L2 13L2 17L54 17L54 13Z"
              fill="black"
            />
          </svg>
        </div>
      </div>
      <div>
        <div className="profile" style={{ position: "relative" }}>
          <div className="profile-first-section">
            <img
              className="big-image margin-top-35px"
              src="/assets/images/profile-1.png"
              alt=""
              width={"100%"}
            />
            <div className="user">
              <div className="user-wrap">
                <img
                  className="user-pic"
                  src="/assets/images/user-pic.png"
                  alt=""
                  width={"90%"}
                />
                <img
                  className="big-chack"
                  src="/assets/images/big-chack.png"
                  alt=""
                />
              </div>
            </div>
            <div className="detail">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-lg-4 col-md-4 col-12"></div>
                  <div className="col-lg-4 col-md-4 col-6">
                    <h2 className="user-name">Monica Lucas</h2>
                  </div>
                  {/* <div className="col-lg-4 col-md-4 col-6 my-auto">
                                        <SocialShare
                                            style={{ fontSize: "28px", marginRight: "0px" }}
                                        />
                                    </div> */}
                </div>
                <div className="row">
                  <p className="user-email">@monicaaa</p>
                </div>
                <div className="row">
                  <div className="col-lg-3 col-md-3 col-12"></div>
                  <div className="col-lg-6 col-md-6 col-12">
                    <div className="copy-url">
                      <span>DdzFFzCqrhshMSxb9....</span>
                      <button>Copy</button>
                    </div>
                  </div>
                </div>

                <div className="profile-buy-card">
                  {tabs === 0 && (
                    <>
                      <div className="row">
                        {nftList.map((item) => (
                          <DashboardCard2
                            onOpen={onOpen}
                            key={item.id}
                            id={item.id}
                            title={item?.title}
                            image={item?.image}
                            price={item?.price}
                            paymentMethod={item?.paymentMethod}
                            royalty={item?.royalty}
                            description={item?.description}
                            collection={item?.collection}
                            collectionImages={item?.collectionImages}
                          />
                        ))}
                      </div>
                    </>
                  )}
                 
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User2;
