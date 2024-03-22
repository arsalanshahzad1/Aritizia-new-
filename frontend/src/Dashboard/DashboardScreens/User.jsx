import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import Header from "../../pages/landingpage/Header";
import { BsFillEnvelopeFill, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import NewItemCard from "../../components/cards/NewItemCard";
import Footer from "../../pages/landingpage/Footer";
import ProfileDrawer from "../../components/shared/ProfileDrawer";
import SocialShare from "../../components/shared/SocialShare";
import Search from "../../components/shared/Search";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import axios from "axios";
import SimpleCard from "../../components/cards/SimpleCard";
import MyNftCard from "../../components/cards/MyNftCard";
import Following from "../../pages/settingFolder/Following";
import Fan from "../../pages/settingFolder/Fan";
import Followers from "../../pages/settingFolder/Followers";
import apis from "../../service";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Gallery from "../../pages/Gallery";

// import { getAddress } from "../../methods/methods";
// import {
//   connectWallet,
//   getProviderOrSigner,
// } from "../../methods/walletManager";
import RejectedNFTSCard from "../../components/cards/RejectedNFTSCard";
import FollowersUserDashboard from "../../pages/settingFolder/FollowersUserDashboard";
import FollowingUserDashboard from "../../pages/settingFolder/FollowingUserDashboard";
import FanUserDaskboard from "../../pages/settingFolder/FanUserDaskboard";
import { Store } from "../../Context/Store";
import { toast } from "react-toastify";
import Loader from "../../components/shared/Loader";
import { FaFacebookF } from "react-icons/fa";
import SimpleCardDashboard from "../dashboardCards/SimpleCardDashboard";
import NewItemCardDashboard from "../dashboardCards/NewItemCardDashboard";
import MyNftCardDashboard from "../dashboardCards/MyNftCardDashboard";
import FavNftCardDashboard from "../dashboardCards/FavNftCardDashboard";
import RejectedNFTSCardDashboard from "../dashboardCards/RejectedNFTSCardDashboard";

const { ethereum } = window;
// import Web3 from "web3";
// import Web3Modal from "web3modal";

const User = ({ search, setSearch, loader, setLoader}) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userNFTs, setUserNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [likedNftsAuction, setLikedNftsAuction] = useState([]);
  const location = useLocation();
  // const [loader, setLoader] = useState(false)
  const searchParams = new URLSearchParams(location.search);
  const [userID, setUserID] = useState(searchParams.get("id"));
  const [userADDRESS, setUserADDRESS] = useState(searchParams.get("add"));
  const [userDetails, setUserDetails] = useState([]);
  const [likedNftLoader, setLikedNftLoader] = useState(false)
  const [nftLoader, setNftLoader] = useState(false)
  const { account, checkIsWalletConnected, getProviderMarketContrat, getProviderNFTContrat } = useContext(Store);
  const [likeNftTabs, setLikeNftTabsTabs] = useState(0);
  const [addedFans, setAddedFans] = useState({});
  const [discountPrice, setDiscountPrice] = useState(0)
  const [userNftLoader, setUserNftLoader] = useState(false)
  const [nftAuctionLoader, setNftAuctionLoader] = useState(false)
  const [likedNftAuctionLoader, setLikedNftAuctionLoader] = useState(false)
  const [fanToggle, setFanToggle] = useState(false)

  
  
  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  const getOtherUsersDetails = async (userID) => {
    const response = await apis.getOtherUser(userID);
    setUserDetails(response?.data?.data);
    console.log(response?.data?.data, "gfgfgfg");
  };

  const getNFTlikeListing = async () => {
    const response = await apis.getLikeNFTListing(userID);
    setLikedNfts(response?.data?.data);
  };

  useEffect(() => {
    getNFTlikeListing();
    getOtherUsersDetails(userID);
  }, []);

  let likedNftsFromDB = [];
  
  const getLikedNfts = async () => {

    let NFTId = await getLikedNftsList();

    let liked = [];
    let myAuctions = [];

    let emptyList = [];
    setLikedNfts(emptyList);
    setLikedNftsAuction(emptyList);


    if (NFTId?.length > 0 && NFTId != "") {
      for (let i = 0; i < NFTId?.length; i++) {
        let id;
        let collectionImage = NFTId[i].collection_image;
        id = +NFTId[i]?.token_id;
        // id =i;

        const metaData = await getProviderNFTContrat().tokenURI(id);

        const structData = await getProviderMarketContrat()._idToNFT(id);

        let auctionData = await getProviderMarketContrat()._idToAuction(id);

        const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

        let listingType = structData?.listingType;


        let response
        let nftLikes

        try {
          response = await apis.getNFTCollectionImage(structData?.collectionId?.toString());
        } catch (error) {
          console.log(error)
        }

        try {
          nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
        } catch (error) {
          console.log(error)
        }

  
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;
        const user_id = response?.data?.data?.user_id;
        

        const responses = await fetch(metaData)
        const metadata = await responses.json()

        if (listingType === 0) {
          const nftData = {
            id: id,
            title: metadata?.title,
            image: metadata?.image,
            price: structData?.price?.toString(),
            paymentMethod: structData?.paymentMethod,
            royalty: structData?.royalty,
            royaltyPrice: structData?.royaltyPrice,
            description: metadata?.description,
            collection: structData?.collectionId?.toString(),
            collectionImages: collectionImages,
            seller: structData?.seller,
            user_id: user_id
          };
          setLikedNfts((prev) => [...prev, nftData])
        } else if (listingType === 1) {
          const nftData = {
            id: id,
            isLive: auctionLive,
            title: metadata?.title,
            image: metadata?.image,
            description: metadata?.description,
            basePrice: structData?.price?.toString(),
            startTime: auctionData?.startTime?.toString(),
            endTime: auctionData?.endTime?.toString(),
            highestBidIntoETH: auctionData?.highestBidIntoETH?.toString(),
            highestBidIntoUSDT: auctionData?.highestBidIntoUSDT?.toString(),
            highestBidderAddress: auctionData?.highestBidder?.toString(),
            paymentMethod: structData?.paymentMethod,
            royaltyPrice: structData?.royaltyPrice,
            collection: structData?.collectionId?.toString(),
            collectionImages: collectionImages,
            seller: auctionData?.seller?.toString(),
            user_id: user_id,
            nft_like: nftLikes?.data?.data?.like_count
          };
          setLikedNftsAuction((prev) => [...prev, nftData]);
        }
      }
    }
  };



  //get Collection(Minted + Listed (fix + Auction) nft's BLC/DB)
  const getMyListedNfts = async (nftsList) => {

    let listingType;
    let collectionId;

    let mintedTokens = await getProviderMarketContrat().getMyListedNfts(userADDRESS);

    if (mintedTokens?.length === 0) {
      setNftLoader(false)
    }

    //Blockchain
    for (let i = 0; i < mintedTokens?.length; i++) {
      let id;
      id = mintedTokens?.[i].tokenId?.toString();

      const structData = await getProviderMarketContrat()._idToNFT(id);

      if (structData?.firstOwner != "0x0000000000000000000000000000000000000000" && structData?.listed) {

        const auctionData = await getProviderMarketContrat()._idToAuction(id);

        let response
        let nftLikes

        try {
          response = await apis.getNFTCollectionImage(structData?.collectionId?.toString());
        } catch (error) {
          console.log(error)
        }

        try {
          nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
        } catch (error) {
          console.log(error)
        }

        const collectionImages = response?.data?.data?.media?.[0]?.original_url;
        const user_id = response?.data?.data?.user_id;

        const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

        const price = structData?.price?.toString();
        const metaData = await getProviderNFTContrat().tokenURI(id);
        const responses = await fetch(metaData)
        const metadata = await responses.json()

        listingType = structData?.listingType;

        if (listingType === 0) {
          const nftData = {
            id: id,
            title: metadata?.title,
            image: metadata?.image,
            price: price,
            paymentMethod: structData?.paymentMethod,
            royalty: structData?.royalty,
            royaltyPrice: structData?.royaltyPrice,
            description: metadata?.description,
            collection: structData?.collectionId?.toString(),
            collectionImages: collectionImages,
            seller: structData?.seller,
            user_id: user_id
          };
          setNftListFP((prev) => [...prev, nftData]);
        } else if (listingType === 1) {
          const nftData = {
            id: id,
            isLive: auctionLive,
            title: metadata?.title,
            image: metadata?.image,
            description: metadata?.description,
            basePrice: price,
            startTime: auctionData?.startTime?.toString(),
            endTime: auctionData?.endTime?.toString(),
            highestBidIntoETH: auctionData?.highestBidIntoETH?.toString(),
            highestBidIntoUSDT: auctionData?.highestBidIntoUSDT?.toString(),
            highestBidderAddress: auctionData?.highestBidder?.toString(),
            paymentMethod: structData?.paymentMethod,
            royaltyPrice: structData?.royaltyPrice,
            collection: structData?.collectionId?.toString(),
            collectionImages: collectionImages,
            seller: auctionData?.seller?.toString(),
            user_id: user_id,
            nft_like: nftLikes?.data?.data?.like_count
          };
          setNftListAuction((prev) => [...prev, nftData]);
        }
      }
    }
    setNftLoader(false)
  };

  //get your purchase nft it show you purchased nft
  const getMyNfts = async (NFTid) => {
   
    // let emptyList = [];
    // setNftListAuction(emptyList);
    // setNftListFP(emptyList);

    if (NFTid?.length > 0) {
      //for database
      for (let i = 0; i < NFTid?.length; i++) {
        let id;
        id = NFTid[i]

        const structData = await getProviderMarketContrat()._idToNFT(id);

        //check if not listed
        if (!structData?.listed && structData?.owner?.toString()?.toLowerCase() === userADDRESS?.toString()?.toLowerCase()) {

          let response;

          try {
            response = await apis.getNFTByTokenId(id);
          } catch (error) {
            console.log(error.message)
          }

          const collectionImages = response?.data?.data?.collection?.media?.[0]?.original_url;
          const user_id = response?.data?.data?.owner?.id;

          const price = structData?.price?.toString();
          const metaData = await getProviderNFTContrat().tokenURI(id);
          const responses = await fetch(metaData)
          const metadata = await responses.json()

          const nftData = {
            id: id,
            title: metadata?.title,
            image: metadata?.image,
            price: price,
            paymentMethod: structData?.paymentMethod,
            royalty: structData?.royalty,
            royaltyPrice: structData?.royaltyPrice,
            description: metadata?.description,
            collection: structData?.collectionId?.toString(),
            collectionImages: collectionImages,
            seller: structData?.seller,
            user_id: user_id
          };
          setUserNfts((prev) => [...prev, nftData]);
        }
      }
    }
    else {

      let mintedTokens = await getProviderMarketContrat().getMyNfts(userADDRESS);

      for (let i = 0; i < mintedTokens?.length; i++) {
        let id;
        id = mintedTokens[i]?.tokenId?.toString();

        const structData = await getProviderMarketContrat()._idToNFT(id);

        //check if not listed
        if (!structData?.listed && structData?.owner?.toString()?.toLowerCase() === userADDRESS?.toString()?.toLowerCase()) {

          let response;

          try {
            response = await apis.getNFTByTokenId(id);
          } catch (error) {
            console.log(error.message)
          }

          const collectionImages = response?.data?.data?.collection?.media?.[0]?.original_url;
          const user_id = response?.data?.data?.owner?.id;

          const price = structData?.price?.toString();
          const metaData = await getProviderNFTContrat().tokenURI(id);
          const responses = await fetch(metaData)
          const metadata = await responses.json()

          const nftData = {
            id: id,
            title: metadata?.title,
            image: metadata?.image,
            price: price,
            paymentMethod: structData?.paymentMethod,
            royalty: structData?.royalty,
            royaltyPrice: structData?.royaltyPrice,
            description: metadata?.description,
            collection: structData?.collectionId?.toString(),
            collectionImages: collectionImages,
            seller: structData?.seller,
            user_id: user_id
          };
          setUserNfts((prev) => [...prev, nftData]);
        }
      }
    }
    setUserNftLoader(false)
  };


  useEffect(() => {
    getMyListedNfts();
    getMyNfts();
    // getLikedNfts();
  }, [userADDRESS]);

  const getLikedNftsList = async () => {
    const response = await apis.getLikeNFTList(userID);
    return response?.data?.data;
  };

  useEffect(() => {
    getLikedNfts();
  }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };


  let [followers, setFollwers] = useState([]);
  const getFollowersList = async () => {
    const response = await apis.getFollowersList(userID);
    if (response?.status) {
      setFollwers(response?.data?.data);
    } else {
      setFollwers("");
    }
  };

  useEffect(() => {
    getFollowersList(userID);
  }, []);

  const copyToClipboard = (link) => {
    console.log(link);
    navigator.clipboard.writeText(link);
    toast.success(`Copied Successfully/admin`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

console.log(userDetails,"userDetailsuserDetailsuserDetails")
  return (
    <>
      {loader && <Loader />}
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section">
          {userDetails?.cover_image == null ? (
            <img
              className="big-image"
              src="/assets/images/profile-1.png"
              alt=""
              width={"100%"}
            />
          ) : (
            <img
              className="big-image"
              src={userDetails?.cover_image}
              alt=""
              width={"100%"}
            />
          )}
          <div className="user">
            <div className="user-wrap">
              {userDetails?.profile_image == null ? (
                <img
                  className="user-pic"
                  src="/assets/images/user-none.png"
                  alt=""
                  width={"240px"}
                />
              ) : (
                <img
                  className="user-pic"
                  src={userDetails?.profile_image}
                  alt=""
                  width={"90%"}
                />
              )}
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
                  <h2 className="user-name">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto">
                  <div className="other-user-icons">
                  {
                    userDetails?.facebook_url && 
                    <a href={userDetails?.facebook_url} target="_blank"><FaFacebookF /></a>
                    
                  }
                   {
                    userDetails?.twitter_url && 
                    <a href={userDetails?.twitter_url} target="_blank"><BsTwitter /></a>
                  
                  }
                   {
                    userDetails?.instagram_url && 
                    <a href={userDetails?.instagram_url} target="_blank"><BsTwitter /></a>
                  
                  }
                   {
                    userDetails?.your_site && 
                    <a href={userDetails?.your_site} target="_blank"><BsTwitter /></a>
                  
                  }
                   </div>
                  </div>
              </div>
              <div className="row">
                <p className="user-email">@{userDetails?.username}</p>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-12"></div>
                <div className="col-lg-6 col-md-6 col-12">
                  {userADDRESS !== "null" ?
                    <div className="copy-url">
                      <span>{userDetails?.wallet_address}</span>
                      <button
                        onClick={() => {
                          copyToClipboard(userDetails?.wallet_address);
                        }}
                      >
                        Copy
                      </button>
                    </div>
                    :
                    <></>
                  }
                </div>
                <div className="col-lg-3 col-md-3 col-12 my-auto"></div>
              </div>
              <div className="row">
                <div className="profile-tabs">
                  {userDetails === "false" ? <></> : <>
                    <button
                      className={`${tabs === 1 ? "active" : ""}`}
                      onClick={() => setTabs(1)}
                    >
                      Gallery
                    </button>
                  </>}
                  {userADDRESS === "null" ? <></> : <>
                    <button
                      className={`${tabs === 0 ? "active" : ""}`}
                      onClick={() => setTabs(0)}
                    >
                      Collection
                    </button>


                    <button
                      className={`${tabs === 2 ? "active" : ""}`}
                      onClick={() => setTabs(2)}
                    >
                      My NFT
                    </button>
                  </>
                  }
                  <button
                    className={`${tabs === 3 ? "active" : ""}`}
                    onClick={() => setTabs(3)}
                  >
                    NFTs
                  </button>
                  <button
                    className={`${tabs === 4 ? "active" : ""}`}
                    onClick={() => setTabs(4)}
                  >
                    Followers
                  </button>
                  {userADDRESS === "null" ? <></> : <>
                    <button
                      className={`${tabs === 6 ? "active" : ""}`}
                      onClick={() => setTabs(6)}
                    >
                      Rejected NFTs
                    </button>
                  </>
                  }
                </div>
              </div>
              <div className="profile-buy-card">
                {tabs === 0 && (
                  <>
                    <div className="row">
                      <div className="Collection-tabs">
                        <div
                          onClick={() => setCollectionTabs(0)}
                          className={`${collectionTabs === 0 && "active-tab"}`}
                        >
                          On Sale
                        </div>
                        <div
                          onClick={() => setCollectionTabs(1)}
                          className={`${collectionTabs === 1 && "active-tab"}`}
                        >
                          Auction 
                        </div>
                      </div>
                      {collectionTabs === 0 && (
                        <>
                          {nftLoader ?
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                            :
                            nftListFP?.length > 0 ?
                              nftListFP?.map((item) => (
                                <SimpleCardDashboard
                                setLoader={setLoader}
                                  onOpen={onOpen}
                                  key={item?.id}
                                  id={item?.id}
                                  title={item?.title}
                                  image={item?.image}
                                  price={item?.price}
                                  paymentMethod={item?.paymentMethod}
                                  royalty={item?.royalty}
                                  royaltyPrice={item?.royaltyPrice}
                                  description={item?.description}
                                  collection={item?.collection}
                                  collectionImages={item?.collectionImages}
                                  seller={item?.seller}
                                  user_id={item?.user_id}
                                />
                              )) :
                              <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                          }
                        </>
                      )}
                      {collectionTabs === 1 && (
                        <>
                          {nftAuctionLoader ?
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                            :
                            nftListAuction.length > 0 ?
                              nftListAuction.map((item) => (
                                <NewItemCardDashboard
                                setLoader={setLoader}
                                  id={item?.id}
                                  isLive={item?.isLive}
                                  title={item?.title}
                                  image={item?.image}
                                  description={item?.description}
                                  basePrice={item?.basePrice}
                                  startTime={item?.startTime}
                                  endTime={item?.endTime}
                                  highestBidIntoETH={item?.highestBidIntoETH}
                                  highestBidIntoUSDT={item?.highestBidIntoUSDT}
                                  highestBidderAddress={item?.highestBidderAddress}
                                  royaltyPrice={item?.royaltyPrice}
                                  collection={item.collection}
                                  collectionImages={item?.collectionImages}
                                  seller={item?.seller}
                                  user_id={item?.user_id}
                                  nft_like={item?.nft_like}
                                  size={'col-lg-4'}
                                />
                              )) : <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                          }
                        </>
                      )}
                    </div>
                  </>
                )}
                {tabs === 1 && (
                  <>
                    <Gallery user="admin" />
                  </>
                )}
                {tabs === 2 && (
                  <>
                    <div className="row">
                      {
                        userNftLoader ?
                          <section className="sec-loading">
                            <div className="one"></div>
                          </section>
                          :
                          userNFTs?.length > 0 ?
                            <>
                              {userNFTs?.map((item) => (
                                <MyNftCardDashboard
                                setLoader={setLoader}
                                  onOpen={onOpen}
                                  key={item?.id}
                                  id={item?.id}
                                  title={item?.title}
                                  image={item?.image}
                                  price={item?.price}
                                  paymentMethod={item?.paymentMethod}
                                  royalty={item?.royalty}
                                  royaltyPrice={item?.royaltyPrice}
                                  description={item?.description}
                                  collection={item?.collection}
                                  collectionImages={item?.collectionImages}
                                  user_id={item?.user_id}
                                />
                              ))}
                            </>
                            :
                            <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                      }
                    </div>
                  </>
                )}
                {tabs === 3 && (
                  <>
                    <div className="row">
                      <div className="Collection-tabs">
                        <div
                          onClick={() => setLikeNftTabsTabs(0)}
                          className={`${likeNftTabs === 0 && "active-tab"}`}
                        >
                          On Sale
                        </div>
                        <div
                          onClick={() => setLikeNftTabsTabs(1)}
                          className={`${likeNftTabs === 1 && "active-tab"}`}
                        >
                          Auction 
                        </div>
                      </div>
                      {likeNftTabs === 0 && (
                        <>
                          {likedNftLoader ?
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                            :
                            likedNfts?.length > 0 ?
                              <>
                                {likedNfts?.map((item) => (
                                <SimpleCardDashboard
                                setLoader={setLoader}
                                onOpen={onOpen}
                                key={item?.id}
                                id={item?.id}
                                title={item?.title}
                                image={item?.image}
                                price={item?.price}
                                paymentMethod={item?.paymentMethod}
                                royalty={item?.royalty}
                                royaltyPrice={item?.royaltyPrice}
                                description={item?.description}
                                collection={item?.collection}
                                collectionImages={item?.collectionImages}
                                seller={item?.seller}
                                user_id={item?.user_id}
                                  />
                                ))}
                              </> :
                              <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                          }
                        </>
                      )}
                      {likeNftTabs === 1 && (
                        <>
                          {likedNftAuctionLoader ?
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                            :
                            likedNftsAuction?.length > 0 ?
                              <>
                            {likedNftsAuction?.map((item) => (
                                     <NewItemCardDashboard
                                     setLoader={setLoader}
                                     id={item?.id}
                                     isLive={item?.isLive}
                                     title={item?.title}
                                     image={item?.image}
                                     description={item?.description}
                                     basePrice={item?.basePrice}
                                     startTime={item?.startTime}
                                     endTime={item?.endTime}
                                     highestBidIntoETH={item?.highestBidIntoETH}
                                     highestBidIntoUSDT={item?.highestBidIntoUSDT}
                                     highestBidderAddress={item?.highestBidderAddress}
                                     royaltyPrice={item?.royaltyPrice}
                                     collection={item.collection}
                                     collectionImages={item?.collectionImages}
                                     seller={item?.seller}
                                     user_id={item?.user_id}
                                     nft_like={item?.nft_like}
                                     size={'col-lg-3'}
                                   />
                                ))}
                              </>
                              :
                              <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                          }
                        </>
                      )}
                    </div>
                  </>

                )}
                {tabs === 4 && (
                  <>
                    <div className="row">
                      <div className="Collection-tabs">
                        <div
                          onClick={() => setFollowersTab(0)}
                          className={`${FollowersTab === 0 && "active-tab"}`}
                        >
                          Followers
                        </div>
                        <div
                          onClick={() => setFollowersTab(1)}
                          className={`${FollowersTab === 1 && "active-tab"}`}
                        >
                          Following
                        </div>
                      </div>
                      <div className="followers-tab">
                        {FollowersTab === 0 ? (
                          <>
                            <Followers id={userID} />

                          </>
                        ) : (
                          <>
                            <Following id={userID} />
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {tabs === 6 && (
                  <>
                    <div className="row">
                      <RejectedNFTSCardDashboard userId={userID} />
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default User;
