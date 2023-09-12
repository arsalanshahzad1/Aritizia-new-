import React, { useRef, useCallback, useState, useEffect } from "react";
import Header from "./landingpage/Header";
import { BsFillEnvelopeFill } from "react-icons/bs";
import BuyNow from "../components/cards/BuyNow";
import NewItemCard from "../components/cards/NewItemCard";
import Footer from "./landingpage/Footer";
import ProfileDrawer from "../components/shared/ProfileDrawer";
import SocialShare from "../components/shared/SocialShare";
import Search from "../components/shared/Search";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../contractsData/ArtiziaNFT.json";
import axios from "axios";
import nft from "../../public/assets/images/NFTImage.png";
import bird from "../../public/assets/images/bird.png";
import SimpleCard from "../components/cards/SimpleCard";
import MyNftCard from "../components/cards/MyNftCard";
import nftimage2 from "../../public/assets/images/nftimage2.png";

import OtherUser from "../../public/assets/images/OtherUser.png";
import OtherUserBackground from "../../public/assets/images/OtherUserBackground.png";
import CollectionCard from "../components/cards/CollectionCard";
import liked1 from "../../public/assets/images/liked1.png";
import liked2 from "../../public/assets/images/liked2.png";
import collection from "../../public/assets/images/Collection-card-image.png";
import apis from "../service";
import { getAddress } from "../methods/methods";
import { connectWallet, getProviderOrSigner } from "../methods/walletManager";

import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
const { ethereum } = window;
// import Web3 from "web3";
// import Web3Modal from "web3modal";

const OtherProfile = ({ search, setSearch }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  // const [userAddress, setUserAddress] = useState("0x000000....");
  const [userDetails, setUserDetails] = useState("");
  const [likedNfts, setLikedNfts] = useState([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { state } = useLocation();

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const navigate = useNavigate();
  const [userID, setUserID] = useState(searchParams.get("id"));
  const [userADDRESS, setUserADDRESS] = useState(searchParams.get("add"));

  // const getOtherUsersDetails = async (address) => {
  //   const response = await apis.getOtherUser(address);
  //   setUserDetails(response?.data?.data);
  //   console.log(response, "other-users");

  const getNFTlikeListing = async (id) => {
    const response = await apis.getLikeNFTListing(id);
    setLikedNfts(response?.data?.data);
    console.log(response, "other-users");
  };

  const getOtherUsersDetails = async (address) => {
    const response = await apis.getOtherUser(address);
    setUserDetails(response?.data?.data);
    getNFTlikeListing(response?.data?.data?.id);
  };

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

  const getMyListedNfts = async () => {
    let emptyList = [];
    setNftListAuction(emptyList);
    setNftListFP(emptyList);
    const provider = await getProviderOrSigner();
    console.log("Connected wallet", userAddress);
    console.log("provider", provider);
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
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    console.log("MYADDRESS", address);

    let listingType;

    let mintedTokens = await marketplaceContract.getListedNfts();

    // let mintedTokens = [1, 4, 2];
    console.log("mintedTokens", mintedTokens);

    let myNFTs = [];
    let myAuctions = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();
      // id = mintedTokens[i];
      console.log("YESS");

      const metaData = await nftContract.tokenURI(id);

      let auctionData = await marketplaceContract._idToAuction(id);

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          // Extracting values using dot notation
          const price = data.price;
          listingType = data.listingType;
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          const collection = data.collection;

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
              endTime: auctionData.endTime.toString(),
              highestBid: auctionData.highestBid.toString(),
              highestBidder: auctionData.highestBidder.toString(),
              isLive: auctionData.isLive.toString(),
              seller: auctionData.seller.toString(),
              startTime: auctionData.startTime.toString(),
            };

            // myAuctions.push(nftData);
            // console.log("auction in function", myAuctions);
            // setNftListAuction(myAuctions);
            setNftListAuction((prev) => [...prev, nftData]);
          }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  useEffect(() => {
    // connectWallet();
    getMyListedNfts();
  }, [userADDRESS]);

  useEffect(() => {
    getAddress();
  }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  const [FollowStatus, setFollowStatus] = useState(0);

  const postChatMeaage = async () => {
    console.log("clicking");
    const id = JSON.parse(localStorage.getItem("data"));
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

  const followOther = async (id) => {
    const response = await apis.postFollowAndUnfollow({
      follow_by: RealUserId,
      follow_to: userDetails?.id,
    });
    if (response.status === 201) {
      setFollowStatus(response.data.data.is_follow);
    }
    console.log(response, "this is reponse");
    console.log(FollowStatus, "this is follow status");
  };
  useEffect(() => {
    console.log(userDetails, "this is user");
    console.log(userDetails?.followers, "this is followers");
    const flag = userDetails?.followers?.some(
      (follower) => follower.id === RealUserId
    );

    console.log(flag, "flag");
    setFollowStatus(flag ? 1 : 0);
  }, [userDetails]);

  useEffect(() => {
    getOtherUsersDetails(userADDRESS);
  }, [FollowStatus]);

  const copyToClipboard = (link) => {
    console.log(link);
    navigator.clipboard.writeText(link);
    toast.success(`Copied Successfully`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  return (
    <>
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
                  {FollowStatus ? (
                    <div onClick={followOther} style={{ cursor: "pointer" }}>
                      Follow
                    </div>
                  ) : (
                    <div onClick={followOther} style={{ cursor: "pointer" }}>
                      Unfollow
                    </div>
                  )}
                  <div>Followers {userDetails?.followers?.length}</div>
                </div>
                <div className="col-lg-4 col-md-4 col-6">
                  <h2 className="user-name">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto">
                  <SocialShare
                    style={{ fontSize: "28px", marginRight: "0px" }}
                  />
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
                  <div
                    className="message-btn"
                    onClick={() => {
                      postChatMeaage();
                    }}
                  >
                    <button>
                      <BsFillEnvelopeFill />
                      MESSAGE
                    </button>
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
                      <div className="d-flex other-profile-cards">
                        {collectionTabs === 0 && (
                          <>
                            {nftListFP.length > 0 ? nftListFP.map((item) => (
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
                                userADDRESS={userADDRESS}
                              />
                            )) : 
                            <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                            }
                          </>
                        )}
                      </div>
                      <div className="d-flex">
                        {collectionTabs === 1 && (
                          <>
                            {nftListAuction.length > 0 ? nftListAuction.map((item) => (
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
                                userAddress={userADDRESS}
                              />
                            )):
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
                      {likedNfts?.length > 0 ? likedNfts?.map((item) => (
                        <NewItemCard
                          key={item?.id}
                          id={item?.id}
                          title={item?.title}
                          image={item?.image}
                          price={item?.price}
                          crypto={item?.crypto}
                          royalty={item?.royalty}
                          description={item?.description}
                          collection={item?.collection}
                          collectionImage={item?.collectionImage}
                          userADDRESS={userADDRESS}
                        />
                      )):
                      <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                      }
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
        <ToastContainer />
      </div>
      {/* <ProfileDrawer  isVisible={isVisible} onClose={onClose} /> */}
    </>
  );
};

export default OtherProfile;
