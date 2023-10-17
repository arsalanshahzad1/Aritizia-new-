import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import Header from "./landingpage/Header";
import { BsFillEnvelopeFill, BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import BuyNow from "../components/cards/BuyNow";
import NewItemCard from "../components/cards/NewItemCard";
import Footer from "./landingpage/Footer";
import Search from "../components/shared/Search";
import {  Contract, ethers } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../contractsData/ArtiziaNFT.json";
import axios from "axios";
import apis from "../service";

import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Store } from "../Context/Store";
import { FaFacebookF } from "react-icons/fa";
import EmailSigninPopup from "./Headers/EmailSigninPopup";
import Loader from "../components/shared/Loader";
const { ethereum } = window;
// import Web3 from "web3";
// import Web3Modal from "web3modal";

const OtherProfile = ({ search, setSearch }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [likeNftTabs, setLikeNftTabsTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [followUnfollowStatus, setFollowUnfollowStatus] = useState(false);
  const web3ModalRef = useRef();
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
  const [loader, setLoader] = useState(false)

  const { account, checkIsWalletConnected,getProviderMarketContrat,getProviderNFTContrat } = useContext(Store);

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
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer

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

    //this is API get Liked NFT's
    // let NFTId = await getLikedNftsList();

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


        const metaData = await nftContract.tokenURI(id);

        const structData = await marketplaceContract._idToNFT(id);

        const fanNftData = await marketplaceContract._idToNFT2(id);

        let discountOnNFT = +fanNftData?.fanDiscountPercent?.toString();

        // setDiscountPrice(discountOnNFT);

        let auctionData = await marketplaceContract._idToAuction(id);

        let listingType = structData?.listingType;

        let highestBid = ethers.utils.formatEther(
          auctionData?.highestBid?.toString()
        );

        // setDiscountPrice(discountOnNFT);

        let collectionId = structData?.collectionId?.toString();
        
        const response = await apis.getNFTCollectionImage(collectionId);
        const user_id = response?.data?.data?.user_id;
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;
        const price = ethers.utils.formatEther(structData?.price?.toString());
        
        let nftLikes
        try {
          // nftLikes = await getNFTLike(response?.data?.data?.user?.wallet_address , id);
          nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
          console.log(nftLikes?.data?.data?.like_count, 'ressssss');
        } catch (error) {
          
        }

        axios
          .get(metaData)
          .then((response) => {
            const meta = response?.data;
            let data = JSON.stringify(meta);

            data = data?.slice(2, -5);
            data = data?.replace(/\\/g, "");

            data = JSON.parse(data);
            const crypto = data?.crypto;
            const title = data?.title;
            const image = data?.image;
            const royalty = data?.royalty;
            const description = data?.description;
            const collection = data?.collection;

            if (listingType === 0) {
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
                user_id: user_id
              };
              liked.push(nftData);
              setLikedNfts(liked)
            } else if (listingType === 1) {
              const nftData = {
                id: id, //
                title: title,
                image: image,
                price: price,
                basePrice: price,
                collectionImages: collectionImages,
                endTime: auctionData?.endTime?.toString(),
                highestBid: highestBid,
                highestBidder: auctionData?.highestBidder?.toString(),
                seller: auctionData?.seller?.toString(),
                startTime: auctionData?.startTime?.toString(),
                user_id: user_id,
                nft_like:nftLikes?.data?.data?.like_count
              };
              setLikedNftsAuction((prev) => [...prev, nftData]);
            }
            setLikedNftLoader(false)
          })
          .catch((error) => {
            setNftLoader(false)
            setLikedNftLoader(false)
            console.error("Error fetching metadata:", error);
          });

      }
    }
    setLikedNftLoader(false)
    setNftLoader(false)
    // setLikedNftAuctionLoader(false)
  };



  // useEffect()

  // const getProviderOrSigner = async (needSigner = false) => {
  //   const provider = await web3ModalRef.current.connect();
  //   const web3Provider = new providers.Web3Provider(provider);
  //   const { chainId } = await web3Provider.getNetwork();

  //   if (chainId !== 31337) {
  //     window.alert("Change the network to Sepolia");
  //     throw new Error("Change network to Sepolia");
  //   }

  //   if (needSigner) {
  //     const signer = web3Provider.getSigner();

  //     return signer;
  //   }

  //   return web3Provider;
  // };

  // console.log("state", state.address);
  // useEffect(() => {
  //   //  navigate("/other-profile")
  //   getOtherUsersDetails(userADDRESS);
  // }, []);

  // const getProviderOrSigner = async (needSigner = false) => {
  //   console.log("getProviderOrSigner");

  //   const provider = await web3ModalRef.current.connect();
  //   const web3Provider = new providers.Web3Provider(provider);
  //   const { chainId } = await web3Provider.getNetwork();

  //   try {
  //     await ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       // params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
  //       params: [{ chainId: "0x7A69" }], // localhost's chainId
  //     });
  //   } catch (error) {
  //     // User rejected the network change or there was an error
  //     throw new Error("Change network to Sepolia to proceed.");
  //   }
  //   if (needSigner) {
  //     const signer = web3Provider.getSigner();

  //     return signer;
  //   }

  //   return web3Provider;
  // };

  // const connectWallet = async () => {
  //   try {
  //     // Get the provider from web3Modal, which in our case is MetaMask
  //     // When used for the first time, it prompts the user to connect their wallet
  //     await getProviderOrSigner();
  //     setWalletConnected(true);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
  //   if (!walletConnected) {
  //     // Assign the Web3Modal class to the reference object by setting it's `current` value
  //     // The `current` value is persisted throughout as long as this page is open
  //     web3ModalRef.current = new Web3Modal({
  //       network: "hardhat",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //     connectWallet();
  //     // numberOFICOTokens();
  //   }
  // }, [walletConnected]);

  // const getAddress = async () => {
  //     const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //     });
  //     setUserAddress(accounts[0]);
  //     // console.log("getAddress", accounts[0]);
  //     postWalletAddress(accounts[0]);

  // };

  // const postWalletAddress  = async (address) => {
  //     if (localStorage.getItem("data")) {
  //       return console.log("data is avaliable");
  //     } else {
  //     const response = await apis.postWalletAddress({wallet_address:  address})
  //     localStorage.setItem("data", JSON.stringify(response.data.data));
  //     window.location.reload();
  //     }

  //   };

  // console.log(userDetails, "userDetails")

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

    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // // Set signer
    // const signer = provider.getSigner()

    // console.log("Connected wallet", userAddress);
    // console.log("provider", provider);
    // const marketplaceContract = new Contract(
    //   MARKETPLACE_CONTRACT_ADDRESS.address,
    //   MARKETPLACE_CONTRACT_ABI.abi,
    //   provider
    // );

    // const nftContract = new Contract(
    //   NFT_CONTRACT_ADDRESS.address,
    //   NFT_CONTRACT_ABI.abi,
    //   provider
    // );
    // const signer = provider.getSigner();
    // const address = await signer.getAddress();

    // console.log("MYADDRESS", address);

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
      console.log("YESS");

      const metaData = await getProviderNFTContrat().tokenURI(id);

      let auctionData = await getProviderMarketContrat()._idToAuction(id);

      let collectionId;
      collectionId = +mintedTokens?.[i]?.collectionId?.toString();
      console.log(collectionId, "collectionId")
      const response = await apis.getNFTCollectionImage(collectionId);
      // console.log(response, "collectionImages")
      const collectionImages = response?.data?.data?.media?.[0]?.original_url;
      const user_id = response?.data?.data?.user_id;
      

      let nftLikes
        try {
          // nftLikes = await getNFTLike(response?.data?.data?.user?.wallet_address , id);
          nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
          console.log(nftLikes?.data?.data?.like_count, 'ressssss');
        } catch (error) {
          
        }


      axios
        .get(metaData)
        .then((response) => {
          const meta = response?.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          // Extracting values using dot notation
          const price = data?.price;
          listingType = data?.listingType;
          const crypto = data?.crypto;
          const title = data?.title;
          const image = data?.image;
          const royalty = data?.royalty;
          const description = data?.description;
          const collection = data?.collection;

          if (listingType === 0) {
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
              user_id: user_id
            };

            // console.log(nftData);
            // myNFTs.push(nftData);
            // setNftListFP(myNFTs);
            setNftListFP((prev) => [...prev, nftData]);
            console.log("myNFTs in function", myNFTs);
          } else if (listingType === 1) {
            const nftData = {
              id: id, //
              title: title,
              image: image,
              price: price,
              basePrice: price,
              endTime: auctionData?.endTime?.toString(),
              highestBid: auctionData?.highestBid?.toString(),
              highestBidder: auctionData?.highestBidder?.toString(),
              isLive: auctionData?.isLive?.toString(),
              seller: auctionData?.seller?.toString(),
              startTime: auctionData?.startTime?.toString(),
              collectionImages: collectionImages,
              user_id: user_id,
              nft_like:nftLikes?.data?.data?.like_count
            };

            // myAuctions.push(nftData);
            // console.log("auction in function", myAuctions);
            // setNftListAuction(myAuctions);
            setNftListAuction((prev) => [...prev, nftData]);
          }
          setNftLoader(false)
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  // const [FollowStatus, setFollowStatus] = useState(0);


  const postChatMeaage = async () => {
    console.log("clicking");
    const id = JSON.parse(localStorage?.getItem("data"));
    const user_id = id?.id;
    const response = await apis.postCheckChatMessage({
      sender_id: user_id,
      receiver_id: userDetails?.id,
    });
    if (response.status) {
      window.location.replace(`http://localhost:5173/chat/${userDetails?.id}`);
    }
  };

  const localStoragedata = JSON.parse(localStorage.getItem("data"));
  const RealUserId = localStoragedata?.id;

  // console.log(userDetails?.id, "arsalan data")


  // const [currentState, setCurrentState] = useState(false)

  const followOther = async () => {
    const response = await apis.postFollowAndUnfollow({
      follow_by: RealUserId,
      follow_to: userDetails?.id,
    });

    setFollowUnfollowStatus(response?.data?.data)

  };

  // useEffect(() => {

  //   const flag = userDetails?.followers?.some(
  //     (follower) => follower.id === RealUserId
  //   );

  //   console.log(flag, "flag");
  //   setFollowStatus(flag ? 1 : 0);
  // }, [userDetails]);



  // useEffect(() => {
  //   getOtherUsersDetails(userADDRESS);
  // }, [FollowStatus]);

  const copyToClipboard = (link) => {
    console.log(link);
    navigator.clipboard.writeText(link);
    toast.success(`Copied Successfully`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const [totalFollowers, setTotalFollowers] = useState(0);
  const [isFollow, setIsFollow] = useState(false)

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
  }, [userADDRESS , otherUsersId]);
  
  // useEffect(() => {
  //   getTotalFollowers()
  // }, [followUnfollowStatus])

  // useEffect(() => {
  //   getTotalFollowers()
  // }, [currentState, isFollow])

  const [nftLoader, setNftLoader] = useState(true)
  const [likedNftLoader, setLikedNftLoader] = useState(true)
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
                <div className="col-lg-4 col-md-4 col-12 followers-div">
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
                <div className="col-lg-4 col-md-4 col-6">
                  <h2 className="user-name">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto">
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
                <div className="col-lg-3 col-md-3 col-12 my-auto">
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
                                  onOpen={onOpen}
                                  // onClose={onClose}
                                  key={item.id}
                                  id={item.id}
                                  title={item?.title}
                                  image={item?.image}
                                  price={item?.price}
                                  crypto={item?.crypto}
                                  royalty={item?.royalty}
                                  description={item?.description}
                                  collection={item?.collection}
                                  collectionImages={item?.collectionImages}
                                  user_id={item?.user_id}
                                  userADDRESS={userADDRESS}
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
                                  key={item.id}
                                  id={item.id}
                                  title={item?.title}
                                  image={item?.image}
                                  price={item?.price}
                                  highestBid={item?.highestBid}
                                  isLive={item?.isLive}
                                  endTime={item?.endTime}
                                  startTime={item?.startTime}
                                  description={item?.description}
                                  collectionImages={item?.collectionImages}
                                  user_id={item?.user_id}
                                  userAddress={userADDRESS}
                                  size={'col-lg-3'}
                                  nft_like={item?.nft_like}
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
                                  crypto={item?.crypto}
                                  royalty={item?.royalty}
                                  description={item?.description}
                                  collection={item?.collection}
                                  collectionImages={item?.collectionImages}
                                  user_id={item?.user_id}
                                  userADDRESS={userADDRESS}
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
                                  key={item.id}
                                  id={item.id}
                                  title={item?.title}
                                  image={item?.image}
                                  price={item?.price}
                                  highestBid={item?.highestBid}
                                  isLive={item?.isLive}
                                  endTime={item?.endTime}
                                  startTime={item?.startTime}
                                  description={item?.description}
                                  collectionImages={item?.collectionImages}
                                  user_id={item?.user_id}
                                  userAddress={userADDRESS}
                                  size={'col-lg-3'}
                                  nft_like={item?.nft_like}
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
