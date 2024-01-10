import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import Header from "./landingpage/Header";
import { BsFillEnvelopeFill, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import BuyNow from "../components/cards/BuyNow";
import NewItemCard from "../components/cards/NewItemCard";
import Footer from "./landingpage/Footer";
import Search from "../components/shared/Search";
import apis from "../service";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaFacebookF } from "react-icons/fa";
import EmailSigninPopup from "./Headers/EmailSigninPopup";
import Loader from "../components/shared/Loader";
import { Store } from "../Context/Store";
const { ethereum } = window;

const OtherProfile = ({ search, setSearch, loader, setLoader }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [likeNftTabs, setLikeNftTabsTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [followUnfollowStatus, setFollowUnfollowStatus] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userDetails, setUserDetails] = useState("");
  const [likedNfts, setLikedNfts] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userData = JSON.parse(localStorage.getItem("data"));
  const navigate = useNavigate();
  const [userID, setUserID] = useState(searchParams.get("id"));
  const otherUsersId = searchParams.get("add");
  const [userADDRESS, setUserADDRESS] = useState(otherUsersId);
  const [likedNftsAuction, setLikedNftsAuction] = useState([]);
  const [emailSigninPopup, setEmailSigninPopup] = useState(false);
  // const [loader, setLoader] = useState(false)
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [isFollow, setIsFollow] = useState(false)
  const [nftLoader, setNftLoader] = useState(true)
  const [likedNftLoader, setLikedNftLoader] = useState(true)

  const { account, checkIsWalletConnected, getProviderMarketContrat, getProviderNFTContrat, getSignerMarketContrat, getSignerNFTContrat } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  const getOtherUsersDetails = async (address) => {
    setLoader(true)
    try {
      const response = await apis.getOtherUser(address);
      setUserDetails(response?.data?.data);
      setFollowUnfollowStatus({
        follower_count: response?.data?.data?.total_followers,
        is_follow: response?.data?.data?.is_follow
      })
      await viewAllNfts(response?.data?.data?.id)
      await getNFTlikeListing(response?.data?.data?.id);
      setLoader(false)
    } catch (error) {
      setLoader(false)
      toast.error("getting some error");

    }
  };

  const getNFTlikeListing = async (id) => {
    try {
      const response = await apis.getLikeNFTListing(id);
      getLikedNfts(response?.data?.data)
      setLikedNftLoader(false)
    } catch (error) {
      toast.error("getting some error");
    }
  };

  const getLikedNfts = async (nftIds) => {

    if (nftIds.length == 0) {
      setLikedNftLoader(false)
    }

    let liked = [];
    let emptyList = [];
    setLikedNfts(emptyList);
    setLikedNftsAuction(emptyList);
    if (nftIds?.length > 0 && nftIds != "") {
      for (let i = 0; i < nftIds?.length; i++) {
        let id;
        id = nftIds?.[i];

        const structData = await getProviderMarketContrat()._idToNFT(id);

        let auctionData = await getProviderMarketContrat()._idToAuction(id);

        const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

        let price = structData?.price?.toString();
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
          nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)

        } catch (error) {

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
          setLikedNfts(nftData)
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
    setLikedNftLoader(false)
    setNftLoader(false)
  };

  const viewAllNfts = async (data) => {
    try {
      const response = await apis.viewAllMyNfts(data);
      getMyListedNfts(response?.data?.data)
    } catch (error) {
      setNftLoader(false)
    }
  };

  const getMyListedNfts = async (allMyNfts) => {
    console.log(allMyNfts, "yesssss")

    let emptyList = [];
    setNftListAuction(emptyList);
    setNftListFP(emptyList);

    let listingType;

    let mintedTokens = await getProviderMarketContrat().getListedNfts();

    // let mintedTokens = [1, 4, 2];
    console.log("mintedTokens", mintedTokens);

    let myNFTs = [];
    let myAuctions = [];

    for (let i = 0; i < allMyNfts?.length; i++) {
      let id;
      id = allMyNfts[i]?.id
      // id = mintedTokens[i];

      const metaData = await getProviderNFTContrat().tokenURI(id);
      const responses = await fetch(metaData)
      const metadata = await responses.json()

      let auctionData = await getProviderMarketContrat()._idToAuction(id);
      const structData = await getProviderMarketContrat()._idToNFT(id);
      const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

      let collectionId;
      collectionId = +mintedTokens?.[i]?.collectionId?.toString();
      let price = structData?.price?.toString();
      const response = await apis.getNFTCollectionImage(collectionId);
      const collectionImages = response?.data?.data?.media?.[0]?.original_url;
      const user_id = response?.data?.data?.user_id;

      let nftLikes
      try {
        nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
        console.log(nftLikes?.data?.data?.like_count, 'ressssss');
      } catch (error) {

      }

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
          owner: structData?.owner,
          firstOwner: structData?.firstOwner,
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
          owner: structData?.owner,
          firstOwner: structData?.firstOwner,
          user_id: user_id,
          nft_like: nftLikes?.data?.data?.like_count
        };
        setNftListAuction((prev) => [...prev, nftData]);
      }
    }
  };

  const onClose = () => {
    setIsVisible(false);
  }

  const onOpen = (action) => {
    setIsVisible(action);
  }

  const postChatMeaage = async () => {
    console.log("clicking");
    const id = JSON.parse(localStorage?.getItem("data"));
    const user_id = id?.id;
    const response = await apis.postCheckChatMessage({
      sender_id: user_id,
      receiver_id: userDetails?.id,
    });
    if (response.status) {
      window.location.replace(`/chat/${userDetails?.id}`);
    }
  };

  const localStoragedata = JSON.parse(localStorage.getItem("data"));
  const RealUserId = localStoragedata?.id;

  const followOther = async () => {
    const response = await apis.postFollowAndUnfollow({
      follow_by: RealUserId,
      follow_to: userDetails?.id,
    });

    setFollowUnfollowStatus(response?.data?.data)

  };


  const copyToClipboard = (link) => {
    console.log(link);
    navigator.clipboard.writeText(link);
    toast.success(`Copied Successfully`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const getTotalFollowers = async () => {
    try {
      const response = await apis.getCountFollow(userDetails?.id)
      setTotalFollowers(response?.data?.data?.follower_count)
      setIsFollow(response?.data?.data?.is_follow)
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    getOtherUsersDetails(otherUsersId);
  }, [userADDRESS, otherUsersId]);

  return (
    <>
      {loader && <Loader />}
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section">
          {userDetails?.cover_image ? (
            <img
              className="big-image"
              src={userDetails?.cover_image}
              alt=""
              width={"100%"}
            />
          ) : (
            <img
              className="big-image"
              src="assets/images/profile-1.png"
              alt=""
              width={"100%"}
            />
          )}
          <div className="user">
            <div className="user-wrap">
              {userDetails?.profile_image ? (
                <img
                  className="user-pic"
                  src={userDetails?.profile_image}
                  alt=""
                  width={"90%"}
                />
              ) : (
                <img
                  className="user-pic"
                  src="assets/images/user-none.png"
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
                <div className="col-lg-4 col-md-4 col-12 followers-div" id="hide-on-mobile">
                  {userData?.email !== null ?
                    <>
                      {followUnfollowStatus.is_follow === 1 ? (
                        <div onClick={followOther} style={{ cursor: "pointer" }}>
                          Unfollow
                        </div>
                      ) : (
                        <div onClick={followOther} style={{ cursor: "pointer" }}>
                          Follow
                        </div>
                      )}
                    </>
                    :
                    <>
                      {followUnfollowStatus.is_follow === 1 ? (
                        <div onClick={() => setEmailSigninPopup(true)} style={{ cursor: "pointer" }}>
                          Unfollow
                        </div>
                      ) : (
                        <div onClick={() => setEmailSigninPopup(true)} style={{ cursor: "pointer" }}>
                          Follow
                        </div>
                      )}
                    </>
                  }
                  <div>Followers {followUnfollowStatus?.follower_count}</div>
                </div>
                <div className="col-lg-4 col-md-4 col-12">
                  <h2 className="user-name">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto" id="hide-on-mobile" style={{justifyContent : 'end'}}>
                  <div className="other-user-icons">
                    <a href={userDetails?.facebook_url} target="_blank"><FaFacebookF /></a>
                    <a href={userDetails?.twitter_url} target="_blank"><BsTwitter /></a>
                    <a href={userDetails?.instagram_url} target="_blank"><BsInstagram /></a>
                    <a href={userDetails?.your_site} target="_blank"><BsLinkedin /></a>
                  </div>
                </div>
              </div>
              <div className="row">
                <p className="user-email">@{userDetails?.username}</p>
              </div>
              <div className="row">
                <div className="col-lg-4 col-md-4 col-12 followers-div justify-content-center" id="hide-on-desktop">
                  {userData?.email !== null ?
                    <>
                      {followUnfollowStatus.is_follow === 1 ? (
                        <div onClick={followOther} style={{ cursor: "pointer" }}>
                          Unfollow
                        </div>
                      ) : (
                        <div onClick={followOther} style={{ cursor: "pointer" }}>
                          Follow
                        </div>
                      )}
                    </>
                    :
                    <>
                      {followUnfollowStatus.is_follow === 1 ? (
                        <div onClick={() => setEmailSigninPopup(true)} style={{ cursor: "pointer" }}>
                          Unfollow
                        </div>
                      ) : (
                        <div onClick={() => setEmailSigninPopup(true)} style={{ cursor: "pointer" }}>
                          Follow
                        </div>
                      )}
                    </>
                  }
                  <div>Followers {followUnfollowStatus?.follower_count}</div>
                </div>
              </div>
              <div className="row mt-2">
              <div className="col-lg-3 col-md-3 col-6 my-auto" id="hide-on-desktop">
                  {userData?.email !== null ?
                    <>
                      <div className="message-btn" onClick={() => { postChatMeaage(); }}>
                        <button>
                          <BsFillEnvelopeFill />
                          MESSAGE
                        </button>
                      </div>
                    </>
                    :
                    <>
                      <div className="message-btn" onClick={() => { setEmailSigninPopup(true) }}>
                        <button>
                          <BsFillEnvelopeFill />
                          MESSAGE
                        </button>
                      </div>
                    </>
                  }
                </div>
              <div className="col-lg-4 col-md-4 col-6 justify-content-center" id="hide-on-desktop">
                  <div className="other-user-icons">
                    <a href={userDetails?.facebook_url} style={{marginRight : '0px' , marginLeft : '0'}} target="_blank"><FaFacebookF style={{marginRight : '0px'}}/></a>
                    <a href={userDetails?.twitter_url} style={{marginRight : '0px' , marginLeft : '7px'}} target="_blank"><BsTwitter style={{marginRight : '0px'}}/></a>
                    <a href={userDetails?.instagram_url} style={{marginRight : '0px' , marginLeft : '7px'}} target="_blank"><BsInstagram style={{marginRight : '0px'}}/></a>
                    <a href={userDetails?.your_site} style={{marginRight : '0px' , marginLeft : '7px'}}  target="_blank"><BsLinkedin style={{marginRight : '0px'}}/></a>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-12"></div>
                <div className="col-lg-6 col-md-6 col-12">
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
                </div>
                <div className="col-lg-3 col-md-3 col-12 my-auto" id="hide-on-mobile" style={{justifyContent :'end'}}>
                  {userData?.email !== null ?
                    <>
                      <div className="message-btn" onClick={() => { postChatMeaage(); }}>
                        <button>
                          <BsFillEnvelopeFill />
                          MESSAGE
                        </button>
                      </div>
                    </>
                    :
                    <>
                      <div className="message-btn" onClick={() => { setEmailSigninPopup(true) }}>
                        <button>
                          <BsFillEnvelopeFill />
                          MESSAGE
                        </button>
                      </div>
                    </>
                  }
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="profile-bio">
                    <p className="">{userDetails?.bio}</p>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="profile-tabs">
                  <button
                    className={`${tabs === 0 ? "active" : ""}`}
                    onClick={() => setTabs(0)}
                  >
                    Collection
                  </button>

                  <button
                    className={`${tabs === 1 ? "active" : ""}`}
                    onClick={() => setTabs(1)}
                  >
                    Liked
                  </button>
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
                      <div className="d-flex other-profile-cards d-flex flex-wrap">
                        {collectionTabs === 0 && (
                          <>
                            {nftLoader ?
                              <section className="sec-loading">
                                <div className="one"></div>
                              </section>
                              :
                              nftListFP?.length > 0 ? nftListFP?.map((item) => (
                                <BuyNow
                                  setLoader={setLoader}
                                  onOpen={onOpen}
                                  // onClose={onClose}
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
                                  user_id={item?.user_id}
                                  royaltyPrice={item?.royaltyPrice}
                                  seller={item?.seller}
                                  size={'col-lg-3'}
                                />
                              )) :
                                <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                            }
                          </>
                        )}
                      </div>
                      <div className="d-flex other-profile-cards d-flex flex-wrap">
                        {collectionTabs === 1 && (
                          <>
                            {nftLoader ?
                              <section className="sec-loading">
                                <div className="one"></div>
                              </section>
                              :
                              nftListAuction?.length > 0 ? nftListAuction?.map((item) => (
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
                                  size={'col-lg-3'}
                                />
                              )) :
                                <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                            }
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {tabs === 1 && (
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
                      <div className="d-flex other-profile-cards d-flex flex-wrap">
                        {likeNftTabs === 0 && (
                          <>
                            {nftLoader ?
                              <section className="sec-loading">
                                <div className="one"></div>
                              </section>
                              :
                              likedNfts?.length > 0 ? nftListFP?.map((item) => (
                                <BuyNow
                                  onOpen={onOpen}
                                  // onClose={onClose}
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
                                  owner={item?.owner}
                                  firstOwner={item?.firstOwner}
                                  user_id={item?.user_id}
                                  size={'col-lg-3'}
                                />
                              )) :
                                <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                            }
                          </>
                        )}
                      </div>
                      <div className="d-flex">
                        {likeNftTabs === 1 && (
                          <>
                            {nftLoader ?
                              <section className="sec-loading">
                                <div className="one"></div>
                              </section>
                              :
                              likedNftsAuction?.length > 0 ? nftListAuction?.map((item) => (
                                <NewItemCard
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
                              )) :
                                <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                            }
                          </>
                        )}
                      </div>
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
      {/* <ProfileDrawer  isVisible={isVisible} onClose={onClose} /> */}
      <EmailSigninPopup emailSigninPopup={emailSigninPopup} setEmailSigninPopup={setEmailSigninPopup} />
    </>
  );
};

export default OtherProfile;
