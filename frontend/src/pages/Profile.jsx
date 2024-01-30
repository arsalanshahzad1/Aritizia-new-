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
  const [nftListFP, setNftListFP] = useState("");
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userNFTs, setUserNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [likedNftsAuction, setLikedNftsAuction] = useState([]);
  const [addedFans, setAddedFans] = useState({});
  const [discountPrice, setDiscountPrice] = useState(0);
  const [nftLoader, setNftLoader] = useState(true); //collection nft
  const [myNftLoader, setMyNftLoader] = useState(true);
  const [pNftLoader, setpNftLoader] = useState(true);
  const [pautionNftLoader, setAutionNftLoader] = useState(true);
  const [likedNftLoader, setLikedNftLoader] = useState(true);
  const [followers, setFollwers] = useState([]);

  const { setactiveTabsSetting } = useContext(GlobalContext);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const userId = userData?.id;

  const navigate = useNavigate();

  const {
    account,
    checkIsWalletConnected,
    getSignerMarketContrat,
    getSignerNFTContrat,
    getProviderMarketContrat,
    getProviderNFTContrat,
  } = useContext(Store);

  //////////////////////// API Section ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  const getProfileData = async () => {
    try {
      const response = await apis.getProfileData(userId);
      return response?.data?.data;
    } catch (error) {
      setLikedNftLoader(false);
    }
  };

  const manageAPIData = async () => {
    try {
      let APIData = await getProfileData();
      console.log(APIData, "APIData");
      // console.log(APIData?.nft_stock?.onsale[0],"APIData");
      setFollwers(APIData?.data?.follower);
      setNftListFP(APIData?.nft_stock?.onsale);
      setNftListAuction(APIData?.nft_stock?.auction);
      setUserNfts(APIData?.my_nfts);
      setLikedNfts(APIData?.liked_nft?.onsale)
      setLikedNftsAuction(APIData?.liked_nft?.auction)
      setLoader(false);
      setNftLoader(false);
      setpNftLoader(false);
      setAutionNftLoader(false);
    } catch (error) {
      console.log(error);
      window.location.reload();
    }
  };

  // const getLikedNftsList = async () => {
  //   try {
  //     const response = await apis.getLikeNFTList(userId);
  //     return response?.data?.data;

  //   } catch (error) {
  //     setLikedNftLoader(false)
  //   }

  // };

  // const getPurchasedNfts = async () => {
  //   try {
  //     setMyNftLoader(true)
  //     setpNftLoader(true)
  //     setAutionNftLoader(true)
  //     const response = await apis.getPurchasedNfts(userId);
  //     if (response?.data?.data?.length > 0) {
  //       getMyNfts(response?.data?.data);
  //     }
  //     else {
  //       setMyNftLoader(false)
  //       setpNftLoader(false)
  //       setAutionNftLoader(false)
  //     }
  //   } catch (error) {
  //     setMyNftLoader(false)
  //     setpNftLoader(false)
  //       setAutionNftLoader(false)
  //     console.error(error, "error")
  //   }

  // };

  // const viewAllNfts = async () => {
  //   try {
  //     setNftLoader(true);
  //     const response = await apis.viewAllMyNfts(userId);
  //     if (response?.data?.data?.length > 0) {
  //       getMyListedNfts(response?.data?.data);
  //     }
  //     else {
  //       setNftLoader(false)
  //     }
  //     // // setNftLoader(false)
  //     // setNftAuctionLoader(false)
  //   } catch (error) {
  //     setNftLoader(false)
  //     console.log(error, "errrrr")
  //   }

  // };

  // let listingType;
  // const getLikedNfts = async () => {
  //   //this is API get Liked NFT's
  //   let NFTId = await getLikedNftsList();
  //   if (NFTId.length < 1) {
  //     setLikedNftLoader(false)
  //   }

  //   if (NFTId?.length > 0 && NFTId != "") {
  //     for (let i = 0; i < NFTId?.length; i++) {
  //       let id;
  //       id = +NFTId?.[i]?.token_id?.toString();

  //       const structData = await getProviderMarketContrat()._idToNFT(id);

  //       let auctionData = await getProviderMarketContrat()._idToAuction(id);

  //       const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

  //       const price = structData?.price?.toString();
  //       const metaData = await getProviderNFTContrat().tokenURI(id);
  //       const responses = await fetch(metaData)
  //       const metadata = await responses.json()

  //       listingType = structData?.listingType;

  //       let collectionId = structData?.collectionId?.toString();

  //       const response = await apis.getNFTCollectionImage(collectionId);
  //       const user_id = response?.data?.data?.user_id;
  //       const collectionImages = response?.data?.data?.media?.[0]?.original_url;

  //       let nftLikes
  //       try {
  //         nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
  //       } catch (error) {
  //         console.error(error);
  //       }

  //       if (listingType === 0) {

  //         const nftData = {
  //           id: id,
  //           title: metadata?.title,
  //           image: metadata?.image,
  //           price: price,
  //           paymentMethod: structData?.paymentMethod,
  //           royalty: structData?.royalty,
  //           royaltyPrice: structData?.royaltyPrice,
  //           description: metadata?.description,
  //           collection: structData?.collectionId?.toString(),
  //           collectionImages: collectionImages,
  //           seller: structData?.seller,
  //           owner: structData?.owner,
  //           firstOwner: structData?.firstOwner,
  //           user_id: user_id
  //         };
  //         setLikedNfts((prev) => [...prev, nftData])
  //         setpNftLoader(false)

  //       } else if (listingType === 1) {
  //         const nftData = {
  //           id: id,
  //           isLive: auctionLive,
  //           title: metadata?.title,
  //           image: metadata?.image,
  //           description: metadata?.description,
  //           basePrice: price,
  //           startTime: auctionData?.startTime?.toString(),
  //           endTime: auctionData?.endTime?.toString(),
  //           highestBidIntoETH: auctionData?.highestBidIntoETH?.toString(),
  //           highestBidIntoUSDT: auctionData?.highestBidIntoUSDT?.toString(),
  //           highestBidderAddress: auctionData?.highestBidder?.toString(),
  //           paymentMethod: structData?.paymentMethod,
  //           royaltyPrice: structData?.royaltyPrice,
  //           collection: structData?.collectionId?.toString(),
  //           collectionImages: collectionImages,
  //           seller: auctionData?.seller?.toString(),
  //           owner: structData?.owner,
  //           firstOwner: structData?.firstOwner,
  //           user_id: user_id,
  //           nft_like: nftLikes?.data?.data?.like_count
  //         };
  //         setLikedNftsAuction((prev) => [...prev, nftData]);
  //         setAutionNftLoader(false)
  //       }
  //     }
  //   }
  // };

  //////////////////////// Functions Section ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  //get Collection(Minted + Listed (fix + Auction) nft's BLC/DB)
  // const getMyListedNfts = async (nftsList) => {

  //   setNftLoader(true);

  //   let listingType;
  //   let collectionId;

  //   // let mintedTokens = await getSignerMarketContrat().getMyListedNfts(userAddress);
  //   //Blockchain
  //   // for (let i = 0; i < mintedTokens?.length; i++) {
  //   //   let id;
  //   //   id = mintedTokens?.[i].tokenId?.toString();

  //   //DataBase
  //   for (let i = 0; i < nftsList?.length; i++) {
  //     let id;
  //     id = nftsList[i]?.id;
  //     console.log("checckdart", nftsList[i]?.id)

  //     const structData = await getProviderMarketContrat()._idToNFT(id);

  //     if (structData?.firstOwner != "0x0000000000000000000000000000000000000000" && structData?.listed && structData?.approve) {

  //       const auctionData = await getProviderMarketContrat()._idToAuction(id);

  //       let response
  //       let nftLikes

  //       try {
  //         response = await apis.getNFTCollectionImage(structData?.collectionId?.toString());
  //       } catch (error) {
  //         console.log(error)
  //       }

  //       try {
  //         nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
  //       } catch (error) {
  //         console.log(error)
  //       }

  //       const collectionImages = response?.data?.data?.media?.[0]?.original_url;
  //       const user_id = response?.data?.data?.user_id;

  //       const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

  //       const price = structData?.price?.toString();
  //       const metaData = await getProviderNFTContrat().tokenURI(id);
  //       const responses = await fetch(metaData)
  //       const metadata = await responses.json()

  //       listingType = structData?.listingType;

  //       if (listingType === 0) {
  //         const nftData = {
  //           id: id,
  //           title: metadata?.title,
  //           image: metadata?.image,
  //           price: price,
  //           paymentMethod: structData?.paymentMethod,
  //           royalty: structData?.royalty,
  //           royaltyPrice: structData?.royaltyPrice,
  //           description: metadata?.description,
  //           collection: structData?.collectionId?.toString(),
  //           collectionImages: collectionImages,
  //           seller: structData?.seller,
  //           user_id: user_id
  //         };
  //         setNftListFP((prev) => [...prev, nftData]);
  //       } else if (listingType === 1) {
  //         const nftData = {
  //           id: id,
  //           isLive: auctionLive,
  //           title: metadata?.title,
  //           image: metadata?.image,
  //           description: metadata?.description,
  //           basePrice: price,
  //           startTime: auctionData?.startTime?.toString(),
  //           endTime: auctionData?.endTime?.toString(),
  //           highestBidIntoETH: auctionData?.highestBidIntoETH?.toString(),
  //           highestBidIntoUSDT: auctionData?.highestBidIntoUSDT?.toString(),
  //           highestBidderAddress: auctionData?.highestBidder?.toString(),
  //           paymentMethod: structData?.paymentMethod,
  //           royaltyPrice: structData?.royaltyPrice,
  //           collection: structData?.collectionId?.toString(),
  //           collectionImages: collectionImages,
  //           seller: auctionData?.seller?.toString(),
  //           user_id: user_id,
  //           nft_like: nftLikes?.data?.data?.like_count
  //         };
  //         setNftListAuction((prev) => [...prev, nftData]);
  //       }
  //     }
  //     setNftLoader(false);
  //   }
  // };

  // //get your purchase nft it show you purchased nft
  // const getMyNfts = async (NFTid) => {

  //   if (NFTid?.length > 0) {
  //     //for database
  //     for (let i = 0; i < NFTid?.length; i++) {
  //       let id;
  //       id = NFTid[i]

  //       const structData = await getSignerMarketContrat()._idToNFT(id);

  //       //check if not listed
  //       if (!structData?.listed && structData?.owner?.toString()?.toLowerCase() === userAddress?.toString()?.toLowerCase()) {

  //         let response;

  //         try {
  //           response = await apis.getNFTByTokenId(id);
  //         } catch (error) {
  //           console.log(error.message)
  //         }

  //         const collectionImages = response?.data?.data?.collection?.media?.[0]?.original_url;
  //         const user_id = response?.data?.data?.owner?.id;

  //         const price = structData?.price?.toString();
  //         const metaData = await getProviderNFTContrat().tokenURI(id);
  //         const responses = await fetch(metaData)
  //         const metadata = await responses.json()

  //         const nftData = {
  //           id: id,
  //           title: metadata?.title,
  //           image: metadata?.image,
  //           price: price,
  //           paymentMethod: structData?.paymentMethod,
  //           royalty: structData?.royalty,
  //           royaltyPrice: structData?.royaltyPrice,
  //           description: metadata?.description,
  //           collection: structData?.collectionId?.toString(),
  //           collectionImages: collectionImages,
  //           seller: structData?.seller,
  //           user_id: user_id
  //         };
  //         setUserNfts((prev) => [...prev, nftData]);
  //       }
  //       setTimeout(() => {
  //         setMyNftLoader(false)
  //       }, 7000);
  //     }
  //   }
  // };

  // const onClose = useCallback(() => {
  //   setIsVisible(false);
  // }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  // const getFollowersList = async () => {
  //   const response = await apis.getFollowersList(userId);
  //   if (response?.status) {
  //     setFollwers(response?.data?.data);
  //   } else {
  //     setFollwers("");
  //   }
  // };

  // useEffect(() => {
  //   getFollowersList(userId);
  // }, []);

  useEffect(() => {
    checkIsWalletConnected();
  }, [account]);

  useEffect(() => {
    // viewAllNfts();
    // getLikedNfts();
    // getPurchasedNfts();
    manageAPIData();
    setLoader(false);
  }, []);

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    toast.success(`Copied Successfully`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const userWalletAddress = localStorage.getItem("userAddress");
  const accountAddress = localStorage.getItem("userAddress");
  // console.log(nftListFP,"nftListFP")
  console.log(likedNfts,likedNftsAuction, "nftListAuctionnftListAuction");

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
                <div className="col-lg-4 col-md-4 col-4"></div>
                <div className="col-lg-4 col-md-4 col-4">
                  <h2 className="user-name">
                    {userData?.first_name} {userData?.last_name}
                  </h2>
                </div>
                <div className="col-lg-4 col-md-4 col-4 my-auto">
                  <div id="hide-on-mobile" style={{ flexDirection: "column" }}>
                    <div className="edit-profile-icon">
                      <Link
                        to={"/setting"}
                        onClick={() => setactiveTabsSetting("Edit")}
                      >
                        <FaUserEdit />
                      </Link>
                    </div>
                    <div className="other-user-icons">
                      <a href={userData?.facebook_url} target="_blank">
                        <FaFacebookF />
                      </a>
                      <a href={userData?.twitter_url} target="_blank">
                        <BsTwitter />
                      </a>
                      <a href={userData?.instagram_url} target="_blank">
                        <BsInstagram />
                      </a>
                      <a href={userData?.your_site} target="_blank">
                        <BsLinkedin />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <p className="user-email">@{userData?.username}</p>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div
                    id="hide-on-desktop"
                    style={{
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0",
                    }}
                  >
                    <div className="other-user-icons">
                      <a href={userData?.facebook_url} target="_blank">
                        <FaFacebookF />
                      </a>
                      <a href={userData?.twitter_url} target="_blank">
                        <BsTwitter />
                      </a>
                      <a href={userData?.instagram_url} target="_blank">
                        <BsInstagram />
                      </a>
                      <a href={userData?.your_site} target="_blank">
                        <BsLinkedin />
                      </a>
                    </div>
                    <div className="edit-profile-icon">
                      <Link
                        to={"/setting"}
                        onClick={() => setactiveTabsSetting("Edit")}
                      >
                        <FaUserEdit />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-12"></div>
                <div className="col-lg-6 col-md-6 col-12">
                  {accountAddress !== "false" ? (
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
                  ) : (
                    <></>
                  )}
                </div>
                <div className="col-lg-3 col-md-3 col-12 my-auto"></div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <div className="profile-bio">
                    {userData?.bio !== "null" && (
                      <p className="">{userData?.bio}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="profile-tabs">
                  {userData === "false" ? (
                    <></>
                  ) : (
                    <>
                      <button
                        className={`${tabs === 0 ? "active" : ""}`}
                        onClick={() => setTabs(0)}
                      >
                        Gallery
                      </button>
                    </>
                  )}
                  {userWalletAddress === "false" ? (
                    <></>
                  ) : (
                    <>
                      <button
                        className={`${tabs === 1 ? "active" : ""}`}
                        onClick={() => setTabs(1)}
                      >
                        Collection
                      </button>

                      <button
                        className={`${tabs === 2 ? "active" : ""}`}
                        onClick={() => {
                          setTabs(2);
                          // getPurchasedNfts();
                        }}
                      >
                        My NFT
                      </button>
                    </>
                  )}
                  <button
                    className={`${tabs === 3 ? "active" : ""}`}
                    onClick={() => setTabs(3)}
                  >
                    Favorites
                  </button>
                  <button
                    className={`${tabs === 4 ? "active" : ""}`}
                    onClick={() => setTabs(4)}
                  >
                    Followers
                  </button>
                </div>
              </div>
              <div className="profile-buy-card">
                {tabs === 0 && (
                  <>
                    <Gallery
                      setLoader={setLoader}
                      loader={loader}
                      user="admin"
                    />
                  </>
                )}
                {tabs === 1 && (
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
                          {loader ? (
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                          ) : nftListFP?.length > 0 ? (
                            nftListFP?.map((item) => (
                              <SimpleCard
                                setLoader={setLoader}
                                onOpen={onOpen}
                                key={item?.id}
                                nftId={item?.token_id}
                                title={item?.title}
                                image={item?.image_url}
                                price={item?.price}
                                paymentMethod={0}
                                royaltyPrice={item?.royality}
                                description={item?.description}
                                collection={item?.collection_id}
                                collectionImages={
                                  item?.collection?.media[0]?.original_url
                                }
                                seller={item?.seller_address}
                                owner={item?.owner_address}
                                firstOwner={item?.creator_address}
                                user_id={item?.user_id}
                              />
                            ))
                          ) : (
                            <div className="data-not-avaliable">
                              <h2>No data avaliable</h2>
                            </div>
                          )}
                        </>
                      )}
                      {collectionTabs === 1 && (
                        <>
                          {nftLoader ? (
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                          ) : nftListAuction.length > 0 ? (
                            nftListAuction.map((item, index) => (
                              <NewItemCard
                                setLoader={setLoader}
                                nftId={item?.token_id}
                                title={item?.title}
                                image={item?.image_url}
                                description={item?.description}
                                basePrice={item?.price}
                                startTime={item?.start_time}
                                endTime={item?.end_time}
                                highestBidIntoETH={
                                  item?.bidding?.length > 0
                                    ? item?.bidding[0]?.bidding_price_eth
                                    : 0
                                }
                                highestBidIntoUSDT={
                                  item?.bidding?.length > 0
                                    ? item?.bidding[0]?.bidding_price_usdt
                                    : 0
                                }
                                highestBidderAddress={
                                  item?.bidding?.length > 0
                                    ? item?.bidding[0]?.bidder
                                    : 0
                                }
                                collection={item.collection_id}
                                collectionImages={
                                  item?.collection?.media[0]?.original_url
                                }
                                seller={item?.seller_address}
                                royaltyPrice={item?.royality}
                                owner={item?.owner_address}
                                firstOwner={item?.creator_address}
                                user_id={item?.user_id}
                                nft_like={item?.nft_like}
                                size={"col-lg-4"}
                              />
                            ))
                          ) : (
                            <div className="data-not-avaliable">
                              <h2>No data avaliable</h2>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </>
                )}
                {tabs === 2 && (
                  <>
                    <div className="row">
                      {pNftLoader ? (
                        <section className="sec-loading">
                          <div className="one"></div>
                          {/* {console.log(userNFTs,"userNFTsuserNFTs")} */}
                        </section>
                      ) : userNFTs?.length > 0 ? (
                        <>
                          {userNFTs?.map((item) => (
                            <MyNftCard
                              setLoader={setLoader}
                              onOpen={onOpen}
                              key={item?.id}
                              nftId={item?.token_id}
                              title={item?.title}
                              image={item?.image_url}
                              price={item?.price}
                              royaltyPrice={item?.royality}
                              description={item?.description}
                              collection={item?.collection_id}
                              collectionImages={
                                item?.collection?.media[0]?.original_url
                              }
                              owner={item?.owner_address}
                              firstOwner={item?.creator_address}
                              user_id={item?.user_id}
                            />
                          ))}
                        </>
                      ) : (
                        <div className="data-not-avaliable">
                          <h2>No data avaliable</h2>
                        </div>
                      )}
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
                          {pNftLoader ? (
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                          ) : likedNfts?.length > 0 ? (
                            <>
                              {likedNfts?.map((item) => (
                                <FavNftCard
                                  setLoader={setLoader}
                                  onOpen={onOpen}
                                  key={item?.id}
                                  id={item?.token_id}
                                  title={item?.title}
                                  image={item?.image_url}
                                  price={item?.price}
                                  paymentMethod={item?.paymentMethod}
                                  royaltyPrice={item?.royality}
                                  description={item?.description}
                                  collection={item.collection_id}
                                  collectionImages={
                                    item?.collection?.media[0]?.original_url
                                  }
                                  seller={item?.seller_address}
                                  owner={item?.owner_address}
                                  firstOwner={item?.creator_address}
                                  user_id={item?.user_id}
                                  size={"col-lg-4"}
                                />
                              ))}
                            </>
                          ) : (
                            <div className="data-not-avaliable">
                              <h2>No data avaliable</h2>
                            </div>
                          )}
                        </>
                      )}
                      {likeNftTabs === 1 && (
                        <>
                          {pautionNftLoader ? (
                            <section className="sec-loading">
                              <div className="one"></div>
                            </section>
                          ) : likedNftsAuction?.length > 0 ? (
                            <>
                              {likedNftsAuction?.map((item) => (
                                <NewItemCard
                                  setLoader={setLoader}
                                  id={item?.token_id}
                                  isLive={item?.isLive}
                                  title={item?.title}
                                  image={item?.image_url}
                                  description={item?.description}
                                  basePrice={item?.price}
                                  startTime={item?.start_time}
                                  endTime={item?.end_time}
                                  highestBidIntoETH={
                                    item?.bidding?.length > 0
                                      ? item?.bidding[0]?.bidding_price_eth
                                      : 0
                                  }
                                  highestBidIntoUSDT={
                                    item?.bidding?.length > 0
                                      ? item?.bidding[0]?.bidding_price_usdt
                                      : 0
                                  }
                                  highestBidderAddress={
                                    item?.bidding?.length > 0
                                      ? item?.bidding[0]?.bidder
                                      : 0
                                  }
                                  royaltyPrice={item?.royality}
                                  collection={item.collection_id}
                                  collectionImages={
                                    item?.collection?.media[0]?.original_url
                                  }
                                  seller={item?.seller_address}
                                  user_id={item?.user_id}
                                  nft_like={item?.nft_like}
                                  owner={item?.owner_address}
                                  firstOwner={item?.creator_address}
                                  size={"col-lg-4"}
                                />
                              ))}
                            </>
                          ) : (
                            <div className="data-not-avaliable">
                              <h2>No data avaliable</h2>
                            </div>
                          )}
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
