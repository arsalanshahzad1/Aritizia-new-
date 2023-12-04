import React, { useCallback, useState, useEffect, useContext } from "react";
import Footer from "./landingpage/Footer";
import SocialShare from "../components/shared/SocialShare";
import Search from "../components/shared/Search";
import axios from "axios";
import SimpleCard from "../components/cards/SimpleCard";
import MyNftCard from "../components/cards/MyNftCard";
import Following from "./settingFolder/Following";
import Followers from "./settingFolder/Followers";
import apis from "../service";
import { Link, useNavigate } from "react-router-dom";
import Gallery from "./Gallery";
import RejectedNFTSCard from "../components/cards/RejectedNFTSCard";
import { toast } from "react-toastify";
import Loader from "../components/shared/Loader";
import Header from "./landingpage/Header";
import { Store } from "../Context/Store";
import { FaFacebookF, FaUserEdit } from "react-icons/fa";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import FavNftCard from "../components/cards/FavNftCard";
import NewItemCard from "../components/cards/NewItemCard";
import { GlobalContext } from "../Context/GlobalContext";

const Profile = ({ search, setSearch, loader, setLoader }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [likeNftTabs, setLikeNftTabsTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userNFTs, setUserNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [likedNftsAuction, setLikedNftsAuction] = useState([]);
  const [addedFans, setAddedFans] = useState({});
  const [discountPrice, setDiscountPrice] = useState(0)
  // const [loader, setLoader] = useState(true)

  const [nftLoader, setNftLoader] = useState(true) //collection nft
  const [myNftLoader, setMyNftLoader] = useState(true)
  const [likedNftLoader, setLikedNftLoader] = useState(true)

  const { setactiveTabsSetting } = useContext(GlobalContext);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const userId = userData?.id;

  const navigate = useNavigate();

  const { account, checkIsWalletConnected, getSignerMarketContrat, getSignerNFTContrat, getProviderMarketContrat, getProviderNFTContrat } = useContext(Store);
  
  console.log("accountaccount", account);


  //////////////////////// API Section ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  const getLikedNftsList = async () => {
    try {    
      const response = await apis.getLikeNFTList(userId);
      return response?.data?.data;
    } catch (error) { 
      setLikedNftLoader(false)
    }

  };

  const getPurchasedNfts = async () => {
    try {
      const response = await apis.getPurchasedNfts(userId);
      if (response?.data?.data?.length > 0) {
        getMyNfts(response?.data?.data);
      } 
      else {
      //   getMyNfts(0);
      setMyNftLoader(false)
      }
    } catch (error) {
      setMyNftLoader(false)
      console.log(error, "errrrr")
    }

  };

  const viewAllNfts = async () => {
    try {
      setNftLoader(true);
      const response = await apis.viewAllMyNfts(userId);
      if (response?.data?.data?.length > 0) {
        getMyListedNfts(response?.data?.data);
      }
      else{
      setNftLoader(false)
      }
      // // setNftLoader(false)
      // setNftAuctionLoader(false)
    } catch (error) {
      setNftLoader(false)
      console.log(error, "errrrr")
    }

  };

  let listingType;
  const getLikedNfts = async () => {

    //this is API get Liked NFT's
    let NFTId = await getLikedNftsList();
    if (NFTId.length == 0) {
      setLikedNftLoader(false)
    }

    // let emptyList = [];
    // setLikedNfts(emptyList);
    // setLikedNftsAuction(emptyList);

    if (NFTId?.length > 0 && NFTId != "") {
      for (let i = 0; i < NFTId?.length; i++) {
        let id;
        id = +NFTId?.[i]?.token_id?.toString();

        const structData = await getProviderMarketContrat()._idToNFT(id);

        let auctionData = await getProviderMarketContrat()._idToAuction(id);

        const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

        const price = structData?.price?.toString();
        const metaData = await getProviderNFTContrat().tokenURI(id);
        const responses = await fetch(metaData)
        const metadata = await responses.json()

        listingType = structData?.listingType;

        let collectionId = structData?.collectionId?.toString();

        const response = await apis.getNFTCollectionImage(collectionId);
        const user_id = response?.data?.data?.user_id;
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;


        let nftLikes
        try {
          // nftLikes = await getNFTLike(response?.data?.data?.user?.wallet_address , id);
          nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
          console.log(nftLikes?.data?.data?.like_count, 'ressssss');
          // nft_like:nftLikes?.data?.data?.like_count
        } catch (error) {
          console.log(error);
        }

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
            owner: structData?.owner,
            firstOwner: structData?.firstOwner,
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
            owner: structData?.owner,
            firstOwner: structData?.firstOwner,
            user_id: user_id,
            nft_like: nftLikes?.data?.data?.like_count
          };
          setLikedNftsAuction((prev) => [...prev, nftData]);
        }
        setLikedNftLoader(false)
      }
    }
  };

  //////////////////////// Functions Section ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  //get Collection(Minted + Listed (fix + Auction) nft's BLC/DB)
  const getMyListedNfts = async (nftsList) => {
    
    setNftLoader(true);

    let listingType;
    let collectionId;

    // let mintedTokens = await getSignerMarketContrat().getMyListedNfts(userAddress);
    //Blockchain
    // for (let i = 0; i < mintedTokens?.length; i++) {
    //   let id;
    //   id = mintedTokens?.[i].tokenId?.toString();


    //DataBase
    for (let i = 0; i < nftsList?.length; i++) {
      let id;
      id = nftsList[i]?.id;
      console.log("checckdart",nftsList[i]?.id)

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
      setNftLoader(false);
    }
  };

  //get your purchase nft it show you purchased nft
  const getMyNfts = async (NFTid) => {
    console.log(NFTid, "NFTid")
    // let emptyList = [];
    // setNftListAuction(emptyList);
    // setNftListFP(emptyList);

    if (NFTid?.length > 0) {
      //for database
      for (let i = 0; i < NFTid?.length; i++) {
        let id;
        id = NFTid[i]

        const structData = await getSignerMarketContrat()._idToNFT(id);

        //check if not listed
        if (!structData?.listed && structData?.owner?.toString()?.toLowerCase() === userAddress?.toString()?.toLowerCase()) {

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
        setMyNftLoader(false)
      }
    }
    // else {

    //   let mintedTokens = await getSignerMarketContrat().getMyNfts(account);

    //   for (let i = 0; i < mintedTokens?.length; i++) {
    //     let id;
    //     id = mintedTokens[i]?.tokenId?.toString();

    //     const structData = await getSignerMarketContrat()._idToNFT(id);

    //     //check if not listed
    //     if (!structData?.listed && structData?.owner?.toString()?.toLowerCase() === account?.toString()?.toLowerCase()) {

    //       let response;

    //       try {
    //         response = await apis.getNFTByTokenId(id);
    //       } catch (error) {
    //         console.log(error.message)
    //       }

    //       const collectionImages = response?.data?.data?.collection?.media?.[0]?.original_url;
    //       const user_id = response?.data?.data?.owner?.id;

    //       const price = structData?.price?.toString();
    //       const metaData = await getSignerNFTContrat().tokenURI(id);
    //       const responses = await fetch(metaData)
    //       const metadata = await responses.json()

    //       const nftData = {
    //         id: id,
    //         title: metadata?.title,
    //         image: metadata?.image,
    //         price: price,
    //         paymentMethod: structData?.paymentMethod,
    //         royalty: structData?.royalty,
    //         royaltyPrice: structData?.royaltyPrice,
    //         description: metadata?.description,
    //         collection: structData?.collectionId?.toString(),
    //         collectionImages: collectionImages,
    //         seller: structData?.seller,
    //         user_id: user_id
    //       };
    //       setUserNfts((prev) => [...prev, nftData]);
    //     }
    //   }
    // }
   
  };

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  const [followers, setFollwers] = useState([]);

  const getFollowersList = async () => {
    const response = await apis.getFollowersList(userId);
    if (response?.status) {
      setFollwers(response?.data?.data);
    } else {
      setFollwers("");
    }
  };

  useEffect(() => {
    getFollowersList(userId);
  }, []);

  useEffect(() => {
    checkIsWalletConnected();
  }, [account])

  useEffect(() => {
    viewAllNfts();
    getLikedNfts();
    getPurchasedNfts();
    setLoader(false)
  }, [])

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    toast.success(`Copied Successfully`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const userWalletAddress = localStorage.getItem("userAddress")
  const accountAddress = localStorage.getItem("userAddress")

  return (
    <>
      {loader && <Loader />}
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section">
          {userData?.cover_image == null ? (
            <img
              className="big-image"
              src="/assets/images/profile-1.png"
              alt=""
              width={"100%"}
            />
          ) : (
            <img
              className="big-image"
              src={userData?.cover_image}
              alt=""
              width={"100%"}
            />
          )}
          <div className="user">
            <div className="user-wrap">
              {userData?.profile_image == null ? (
                <img
                  className="user-pic"
                  src="/assets/images/user-none.png"
                  alt=""
                  width={"240px"}
                />
              ) : (
                <img
                  className="user-pic"
                  src={userData?.profile_image}
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
                    {userData?.first_name} {userData?.last_name}
                  </h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto">
                  <div className="edit-profile-icon">
                    <Link to={"/setting"} onClick={() => setactiveTabsSetting("Edit")}>
                      <FaUserEdit />
                    </Link>

                  </div>
                  <div className="other-user-icons">
                    <a href={userData?.facebook_url} target="_blank"><FaFacebookF /></a>
                    <a href={userData?.twitter_url} target="_blank"><BsTwitter /></a>
                    <a href={userData?.instagram_url} target="_blank"><BsInstagram /></a>
                    <a href={userData?.your_site} target="_blank"><BsLinkedin /></a>
                  </div>
                </div>
              </div>
              <div className="row">
                <p className="user-email">@{userData?.username}</p>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-12"></div>
                <div className="col-lg-6 col-md-6 col-12">
                  {accountAddress !== "false" ?
                    <div className="copy-url">
                      <span>{userData?.wallet_address}</span>
                      <button
                        onClick={() => {
                          copyToClipboard(userData?.wallet_address);
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
                <div className="col-lg-12">
                  <div className="profile-bio">
                  <p className="">{userData?.bio}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="profile-tabs">
                  {userData === "false" ? <></> : <>
                    <button
                      className={`${tabs === 1 ? "active" : ""}`}
                      onClick={() => setTabs(1)}
                    >
                      Gallery
                    </button>
                  </>}
                  {userWalletAddress === "false" ? <></> : <>
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
                    Favourites
                  </button>
                  <button
                    className={`${tabs === 4 ? "active" : ""}`}
                    onClick={() => setTabs(4)}
                  >
                    Followers
                  </button>
                  {/* {userWalletAddress === "false" ? <></> : <>
                    <button
                      className={`${tabs === 6 ? "active" : ""}`}
                      onClick={() => setTabs(6)}
                    >
                      Rejected NFTs
                    </button>
                  </>
                  } */}
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
                                <SimpleCard
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
                                  owner={item?.owner}
                                  firstOwner={item?.firstOwner}
                                  user_id={item?.user_id}
                                />
                              ))                               
                              :
                              <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                          }
                        </>
                      )}
                      {collectionTabs === 1 && (
                        <>
                          {nftLoader ?
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                            :
                            nftListAuction.length > 0 ?
                              nftListAuction.map((item) => (
                                <NewItemCard
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
                                  owner={item?.owner}
                                  firstOwner={item?.firstOwner}
                                  user_id={item?.user_id}
                                  nft_like={item?.nft_like}
                                  size={'col-lg-3'}
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
                    <Gallery setLoader={setLoader} loader={loader} user="admin" />
                  </>
                )}
                {tabs === 2 && (
                  <>
                    <div className="row">
                      {
                        myNftLoader ?
                          <section className="sec-loading">
                            <div className="one"></div>
                          </section>
                          :
                          userNFTs?.length > 0 ?
                            <>
                              {userNFTs?.map((item) => (
                                <MyNftCard
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
                                  owner={item?.owner}
                                  firstOwner={item?.firstOwner}
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
                                  <FavNftCard
                                    setLoader={setLoader}
                                    onOpen={onOpen}
                                    // onClose={onClose}
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
                                    owner={item?.owner}
                                    firstOwner={item?.firstOwner}
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
                          {likedNftLoader ?
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                            :
                            likedNftsAuction?.length > 0 ?
                              <>
                                {likedNftsAuction?.map((item) => (
                                  <NewItemCard
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
                                    owner={item?.owner}
                                    firstOwner={item?.firstOwner}
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
                            <Followers id={userId} />

                          </>
                        ) : (
                          <>
                            <Following id={userId} />
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {tabs === 6 && (
                  <>
                    <div className="row">
                      <RejectedNFTSCard userId={userId} />
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

export default Profile;
