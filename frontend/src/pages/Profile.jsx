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
import Following from "./settingFolder/Following";
import Fan from "./settingFolder/Fan";
import followerImg from "../../public/assets/images/user-pic.png";
import Followers from "./settingFolder/Followers";
import apis from "../service";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Gallery from "./Gallery";
import { getAddress } from "../methods/methods";
import { connectWallet, getProviderOrSigner } from "../methods/walletManager";
import RejectedNFTSCard from "../components/cards/RejectedNFTSCard";
// import MetaDecorator from "../Meta/MetaDecorator";

const { ethereum } = window;
// import Web3 from "web3";
// import Web3Modal from "web3modal";

const Profile = ({ search, setSearch }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [likedTabs, setLikedTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userNFTs, setUserNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [likedNftsAuction, setLikedNftsAuction] = useState([]);
  // const [userAddress, setUserAddress] = useState("0x000000....");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [addedFans, setAddedFans] = useState({});

  // const [followers, setFollwers] = useState([]);
  const navigate = useNavigate();

  const getNFTlikeListing = async () => {
    console.log("getNFTlikeListing");
    const response = await apis.getLikeNFTListing(userData?.id);
    setLikedNfts(response?.data?.data);
    console.log(response, "liked-nfts");
  };

  useEffect(() => {
    getNFTlikeListing();
  }, []);

  let likedNftsFromDB = [];

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const userId = userData?.id;

  const getLikedNfts = async () => {
    const provider = await getProviderOrSigner();

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
    let NFTId = await getLikedNftsList();
    console.log("NFTId", NFTId);

    let liked = [];
    let myAuctions = [];

    let emptyList = [];
    setLikedNfts(emptyList);
    setLikedNftsAuction(emptyList);

    // console.log("NFTId", NFTId);

    console.log("Running");
    if (NFTId.length > 0 && NFTId != "") {
      for (let i = 0; i < NFTId.length; i++) {
        let id;
        let collectionImage = NFTId[i].collection_image;
        id = +NFTId[i].token_id;
        // id =i;

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
        console.log(response.data, "saad");
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;
        console.log(
          response?.data?.data?.media?.[0]?.original_url,
          "collectionImagesss"
        );

        console.log("zayyan", id);

        // let auctionData = await marketplaceContract._idToAuction(id);

        // let listingType = structData.listingType;

        const price = ethers.utils.formatEther(structData.price.toString());
        console.log("likednfts price", price);
        axios
          .get(metaData)
          .then((response) => {
            const meta = response.data;
            let data = JSON.stringify(meta);

            data = data.slice(2, -5);
            data = data.replace(/\\/g, "");

            data = JSON.parse(data);
            console.log("likednfts data", data);

            // Extracting values using dot notation
            // const price = data.price;
            // listingType = data.listingType;
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
                collectionImages: collectionImages,
              };
              console.log("nftData", nftData);
              // liked.push(nftData);
              setLikedNfts((prev) => [...prev, nftData]);
            } else if (listingType === 1) {
              const nftData = {
                id: id, //
                title: title,
                image: image,
                price: price,
                basePrice: price,
                collectionImages: collectionImages,
                endTime: auctionData.endTime.toString(),
                highestBid: highestBid,
                highestBidder: auctionData.highestBidder.toString(),
                seller: auctionData.seller.toString(),
                startTime: auctionData.startTime.toString(),
              };
              // myAuctions.push(nftData);
              setLikedNftsAuction((prev) => [...prev, nftData]);
              console.log(nftListAuction, "nftData");
            }

            // setLikedNfts((prevState) => ([ ...prevState, nftData ]));
          })

          .catch((error) => {
            console.error("Error fetching metadata:", error);
          });
      }
    }
  };

  const addFanList = async () => {
    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    // 0x32e65857f0E0c6045F7b77cf3a9f8b7469f853Cd
    // 0x92E665119CD1DBd96fd6899bC7375Ac296aF370D
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    // 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f  account 8
    // 0x71bE63f3384f5fb98995898A86B02Fb2426c5788  account 9

    console.log("FansAddress", FansAddress);

    let fanadd = await (await marketplaceContract.addFans(FansAddress)).wait();
    console.log("fanadd", fanadd);
    console.log("asdasdasd");

    let response = marketplaceContract.on("addedFans", handleAddedFansEvent);

    console.log("Response of addedFans event", response);
  };

  const handleAddedFansEvent = async (fanList) => {
    // let fanList2 = {
    //   fanList: fanList.toString(),
    // };

    // fansTesting = fanList.toString();
    setAddedFans(fanList);
    console.log("fanList", fanList);
    // console.log("fanList2", fanList2);
    postFanList();
  };

  const postFanList = async () => {
    console.log("ssss postFanList");
    console.log("ssss userAddress", userAddress);
    console.log("ssss addedFans", addedFans);

    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    let fanList = await marketplaceContract.getFans(userAddress);

    console.log("ssssr fanList", fanList);
    console.log("ssssr userAddress", userAddress);

    const response = await apis.postAddFans({
      fan_by_wallet: userAddress,
      fan_to_array_wallet: fanList,
    });

    console.log("DATA", response);

    setTimeout(() => {
      navigate("/profile");
      // window.location.reload();
    }, 1000);
  };

  const getMyListedNfts = async () => {
    console.log("aaaa");
    console.log("Connected wallet", userAddress);
    let emptyList = [];
    setNftListAuction(emptyList);
    setNftListFP(emptyList);
    const provider = await getProviderOrSigner();
    console.log("111111");
    // console.log("provider", provider);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );
    console.log("222222");

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      provider
    );
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // console.log("MYADDRESS", address);
    console.log("333333");

    let listingType;

    console.log("userAddress", userAddress);

    let mintedTokens = await marketplaceContract.getMyListedNfts(userAddress);

    // let mintedTokens = [1, 4, 2];
    console.log("mintedTokens", mintedTokens);
    let NFTId = await getLikedNftsList();
    let myNFTs = [];
    let myAuctions = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();

      let collectionId;
      collectionId = +mintedTokens[i].collectionId.toString();
      console.log("YESS", id);

      const response = await apis.getNFTCollectionImage(collectionId);
      console.log(response, "responses");
      const collectionImages = response?.data?.data?.media?.[0]?.original_url;
      console.log(response?.data?.data?.media?.[0]?.original_url, "responsess");
      console.log(collectionImages, "trrrr");

      const metaData = await nftContract.tokenURI(id);

      const structData = await marketplaceContract._idToNFT(id);

      const fanNftData = await marketplaceContract._idToNFT2(id);

      let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

      setDiscountPrice(discountOnNFT);

      let auctionData = await marketplaceContract._idToAuction(id);

      listingType = structData.listingType;

      let highestBid = ethers.utils.formatEther(
        auctionData.highestBid.toString()
      );

      const price = ethers.utils.formatEther(structData.price.toString());

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          const crypto = data.crypto;ro
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
              collectionImages: collectionImages,
            };
            console.log(nftData);
            // myNFTs.push(nftData);
            setNftListFP((prev) => [...prev, nftData]);
          } else if (listingType === 1) {
            const nftData = {
              id: id, //
              title: title,
              image: image,
              price: price,
              basePrice: price,
              collectionImages: collectionImages,
              endTime: auctionData.endTime.toString(),
              highestBid: highestBid,
              highestBidder: auctionData.highestBidder.toString(),
              seller: auctionData.seller.toString(),
              startTime: auctionData.startTime.toString(),
            };
            // myAuctions.push(nftData);
            setNftListAuction((prev) => [...prev, nftData]);
            console.log(nftListAuction, "nftData");
          }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  const getMyNfts = async () => {
    console.log("first");
    let emptyList = [];
    setNftListAuction(emptyList);
    setNftListFP(emptyList);
    const provider = await getProviderOrSigner();
    console.log("two");
    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );
    console.log("three");
    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      provider
    );

    console.log("four");
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    // console.log("MYADDRESS", address);

    let listingType;
    console.log("userAddress", userAddress);

    let mintedTokens = await marketplaceContract.getMyNfts(userAddress);
    console.log("five");
    // let mintedTokens = [1, 4, 2];
    console.log("mintedTokens mynft", mintedTokens);
    let NFTId = await getLikedNftsList();
    let myNFTs = [];
    // let myAuctions = [];
    console.log(mintedTokens.length);
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();
      let collectionId;
      collectionId = +mintedTokens[i].collectionId.toString();
      console.log("YESSss", collectionId);

      const response = await apis.getNFTCollectionImage(collectionId);
      console.log(response.data, "saad");
      const collectionImages = response?.data?.data?.media?.[0]?.original_url;
      console.log(
        response?.data?.data?.media?.[0]?.original_url,
        "collectionImagesss"
      );
      const metaData = await nftContract.tokenURI(id);

      console.log(response.data, "workig");

      const structData = await marketplaceContract._idToNFT(id);

      console.log(structData, "structDataABC");

      let auctionData = await marketplaceContract._idToAuction(id);

      listingType = structData.listingType;

      console.log("Owner of nft", structData.owner);

      const price = ethers.utils.formatEther(structData.price.toString());

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          console.log("Dataa", data);

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

          // myNFTs.push(nftData);
          // setUserNfts(myNFTs);
          setUserNfts((prev) => [...prev, nftData]);

          console.log("myNFTs in function", myNFTs);
          // } else if (listingType === 1) {
          //   const nftData = {
          //     id: id, //
          //     title: title,
          //     image: image,
          //     price: price,
          //     basePrice: auctionData.basePrice.toString(),
          //     endTime: auctionData.endTime.toString(),
          //     highestBid: auctionData.highestBid.toString(),
          //     highestBidder: auctionData.highestBidder.toString(),
          //     isLive: auctionData.isLive.toString(),
          //     seller: auctionData.seller.toString(),
          //     startTime: auctionData.startTime.toString(),
          //   };

          //   myAuctions.push(nftData);
          //   console.log("auction in function", myAuctions);
          //   setNftListAuction(myAuctions);
          // }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  // useEffect(() => {
  //   window.scroll(0, 0);
  // });

  useEffect(() => {
    getAddress();
    getProviderOrSigner();
  }, []);

  useEffect(() => {
    // connectWallet();
    getMyListedNfts();
    getMyNfts();
    getLikedNfts();
  }, [userAddress]);

  const getLikedNftsList = async () => {
    const response = await apis.getLikeNFTList(userId);
    console.log("NFTId", response);
    return response.data.data;
  };

  // const getFollowersList = async () => {
  //   const response = await apis.getFollowersList();
  //   if(response.status){
  //   console.log(response.data.data, "followers");
  //   setFollwers(response.data.data);
  //   }else{
  //     setFollwers('');
  //   }
  // };

  useEffect(() => {
    getLikedNfts();
  }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  const [FansAddress, setFansAddress] = useState([""]);
  const [showAddFanPopUp, setshowAddFanPopUp] = useState(0);

  const handleChangeAddressInput = (e, index) => {
    const newArray = [...FansAddress];
    newArray[index] = e.target.value;
    setFansAddress(newArray);
    console.log(FansAddress);
  };

  const [addingFanList, setAddingFanList] = useState([]);

  const handleCheckboxChange = (id) => {
    console.log(addingFanList, "idddddddddd");
    setAddFanlisting((prevCheckboxes) => {
      const updatedCheckboxes = prevCheckboxes.map((data) => {
        if (data?.user_id === id) {
          // Check if the user_id is already in the addingFanList
          if (addingFanList.includes(id)) {
            setAddingFanList((prev) => prev.filter((userId) => userId !== id));
          } else {
            setAddingFanList((prev) => [...prev, id]);
          }
          console.log(addingFanList, "addingFanList");
          console.log(data, "important");

          return {
            ...data,
            is_check: !data.is_check,
          };
        }
        return data;
      });

      return updatedCheckboxes;
    });
  };

  let [followers, setFollwers] = useState([]);
  let [addFanlisting, setAddFanlisting] = useState([]);

  const getFollowersList = async () => {
    const response = await apis.getFollowersList(userId);
    if (response.status) {
      setFollwers(response.data.data);
    } else {
      setFollwers("");
    }
  };
  const getFollowersForFan = async () => {
    const response = await apis.getFollowersForFan();
    if (response.status) {
      console.log(response.data.data, "fan");
      setAddFanlisting(response.data.data);
    } else {
      setAddFanlisting("");
    }
  };

  useEffect(() => {
    getFollowersList(userId);
    // getFollowersForFan('')
  }, []);

  const addFans = async () => {
    if (addingFanList.length > 0) {
      const response = await apis.postUserFans({
        fan_by: userData?.id,
        fan_to_array: addingFanList,
      });
      if (response.status) {
        setAddingFanList([]);
        getFollowersList();
      }
    } else {
      console.log("empty");
    }
  };

  return (
    <>
      {/* <MetaDecorator
        title={'Artizia'}
        description={'The Best NFT Marketplace In The World'}
        imageAlt={'Artizia'}
        url={userData?.cover_image} /> */}
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
                  <SocialShare
                    style={{ fontSize: "28px", marginRight: "0px" }}
                  />
                </div>
              </div>
              <div className="row">
                <p className="user-email">@{userData?.username}</p>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-12"></div>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="copy-url">
                    <span>{userData?.wallet_address}</span>
                    <button>Copy</button>
                  </div>
                </div>
                <div className="col-lg-3 col-md-3 col-12 my-auto"></div>
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
                    Gallery
                  </button>
                  <button
                    className={`${tabs === 2 ? "active" : ""}`}
                    onClick={() => setTabs(2)}
                  >
                    My NFT
                  </button>
                  <button
                    className={`${tabs === 3 ? "active" : ""}`}
                    onClick={() => setTabs(3)}
                  >
                    Liked
                  </button>
                  <button
                    className={`${tabs === 4 ? "active" : ""}`}
                    onClick={() => setTabs(4)}
                  >
                    Followers
                  </button>
                  <button
                    className={`${tabs === 5 ? "active" : ""}`}
                    onClick={() => setTabs(5)}
                  >
                    Fan List
                  </button>
                  <button
                    className={`${tabs === 6 ? "active" : ""}`}
                    onClick={() => setTabs(6)}
                  >
                    Rejected NFTs
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
                      {collectionTabs === 0 && (
                        <>
                          {nftListFP.map((item) => (
                            <SimpleCard
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
                              userAddress
                            />
                          ))}
                        </>
                      )}
                      {collectionTabs === 1 && (
                        <>
                          {nftListAuction.map((item) => (
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
                              userAddress={userAddress}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </>
                )}
                {tabs === 1 && (
                  <>
                    <Gallery />
                  </>
                )}
                {tabs === 2 && (
                  <>
                    <div className="row">
                      {userNFTs.map((item) => (
                        <MyNftCard
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
                          getMyNfts={getMyNfts}
                          userAddress
                        />
                      ))}
                    </div>
                  </>
                )}

                {tabs === 3 && (
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
                          {likedNfts.map((item) => (
                            <SimpleCard
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
                              userAddress
                            />
                          ))}
                        </>
                      )}
                      {collectionTabs === 1 && (
                        <>
                          {likedNftsAuction.map((item) => (
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
                              userAddress={userAddress}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </>
                  // <>
                  //   <div className="row">
                  //     {likedNfts?.map((item) => (
                  //       <NewItemCard
                  //         key={item?.id}
                  //         id={item?.id}
                  //         title={item?.title}
                  //         image={item?.image}
                  //         price={item?.price}
                  //         crypto={item?.crypto}
                  //         royalty={item?.royalty}
                  //         description={item?.description}
                  //         collection={item?.collection}
                  //         collectionImages={item?.collectionImages}
                  //         userAddress
                  //       />
                  //     ))}
                  //   </div>
                  // </>
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
                            {/* <Follow followed={true} />
                            <Follow followed={true} />
                            <Follow followed={true} />
                            <Follow followed={true} />
                            <Follow followed={true} />
                            <Follow followed={true} />
                            <Follow followed={true} /> */}
                          </>
                        ) : (
                          <>
                            <Following id={userId} />
                            {/* <Follow followed={false} />
                            <Follow followed={false} />
                            <Follow followed={false} />
                            <Follow followed={false} />
                            <Follow followed={false} /> */}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {tabs === 5 && (
                  <>
                    <div className="FanListPage"></div>
                    <Fan id={userId} />

                    <div
                      onClick={() => {
                        setshowAddFanPopUp(1);
                        getFollowersForFan();
                      }}
                      className="Add-Fan-btn"
                    >
                      <svg
                        width="30"
                        height="31"
                        viewBox="0 0 44 45"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M25.3432 25.6915V26.7529C25.3432 31.3246 25.3432 35.8964 25.3432 40.4681C25.3758 40.9526 25.3063 41.4385 25.1392 41.8945C24.9721 42.3504 24.711 42.7662 24.3731 43.115C24.0352 43.4637 23.6279 43.7377 23.1775 43.9191C22.727 44.1005 22.2434 44.1853 21.7581 44.1681C21.2728 44.1509 20.7966 44.0319 20.3602 43.8191C19.9237 43.6062 19.5369 43.3041 19.2246 42.9322C18.9123 42.5604 18.6813 42.127 18.5469 41.6604C18.4126 41.1937 18.378 40.7041 18.4448 40.2231V25.6915H3.70893C3.13241 25.7106 2.56045 25.5839 2.04592 25.3232C1.53138 25.0624 1.09092 24.6761 0.765339 24.1999C0.439761 23.7238 0.23962 23.1732 0.183349 22.5991C0.127079 22.025 0.216526 21.4461 0.443451 20.9158C0.705285 20.2337 1.1806 19.6545 1.79852 19.2646C2.41644 18.8747 3.14397 18.695 3.87236 18.7524H18.4448V17.7319C18.4448 13.1601 18.4448 8.58835 18.4448 4.01662C18.4296 3.43826 18.5609 2.86551 18.8267 2.35162C19.0925 1.83773 19.484 1.3995 19.9648 1.07764C20.4456 0.755776 20.9998 0.560789 21.5762 0.510847C22.1526 0.460904 22.7325 0.557625 23.2614 0.792001C23.9218 1.05643 24.4822 1.52201 24.8631 2.12278C25.2441 2.72355 25.4262 3.42895 25.3838 4.13907C25.3838 8.66998 25.3838 13.1601 25.3838 17.691V18.7524H40.0788C40.6501 18.7398 41.2156 18.8686 41.7252 19.1272C42.2347 19.3858 42.6724 19.7663 42.9995 20.2347C43.3266 20.7032 43.5329 21.2452 43.6002 21.8127C43.6674 22.3801 43.5937 22.9554 43.3852 23.4874C43.1268 24.1663 42.6594 24.7456 42.0505 25.1418C41.4416 25.538 40.7225 25.7304 39.9971 25.6915H25.3838H25.3432Z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    {showAddFanPopUp === 1 && (
                      <>
                        <div className="BackScreen-dark">
                          <div className="choose-add-fan-method">
                            <div
                              onClick={() => setshowAddFanPopUp(0)}
                              className="close-btn"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 27 27"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M25.0157 0H25.3602C25.637 0.0762734 25.8902 0.220569 26.097 0.419655C26.3038 0.61874 26.4575 0.866292 26.544 1.13987C26.6306 1.41346 26.6474 1.70429 26.5928 1.98598C26.5381 2.26766 26.4139 2.53122 26.2313 2.75265L25.9679 3.03604C22.6257 6.35545 19.3037 9.69508 15.9818 13.0145L15.6779 13.217L15.9818 13.4598C19.3442 16.7995 22.6864 20.1594 26.1096 23.58C26.3425 23.7813 26.5165 24.0419 26.6128 24.3342C26.7091 24.6265 26.7242 24.9395 26.6566 25.2397C26.5969 25.5247 26.4659 25.7899 26.2758 26.0104C26.0856 26.231 25.8423 26.3998 25.5691 26.5009C25.2959 26.602 25.0014 26.6322 24.7133 26.5886C24.4252 26.545 24.1531 26.4291 23.9221 26.2517L23.6182 25.9683L13.6523 15.9899C13.5683 15.9109 13.4936 15.8226 13.4295 15.7267L13.1662 15.9696L3.03835 26.0898C2.81125 26.3346 2.52056 26.5116 2.19865 26.601C1.87674 26.6903 1.53624 26.6885 1.21529 26.5958C0.95016 26.5202 0.708757 26.3783 0.51381 26.1835C0.318863 25.9887 0.176967 25.7475 0.101377 25.4826L0 25.2397V24.6729C0.141895 24.1796 0.431818 23.7416 0.830552 23.418L10.6545 13.6015C10.7459 13.5203 10.8482 13.4521 10.9584 13.3991L10.6342 13.1359C7.37307 9.87724 4.11197 6.59838 0.830552 3.3397C0.441664 3.00729 0.153859 2.57252 0 2.08481V1.51802C0.0491955 1.27542 0.148531 1.04576 0.291522 0.843633C0.434513 0.641507 0.618089 0.471322 0.830552 0.34405C1.08222 0.219853 1.34729 0.124876 1.62055 0.0607802H1.82306C2.41002 0.177363 2.93912 0.491743 3.32196 0.951358L13.1054 10.7273L13.3687 10.9702C13.4176 10.8748 13.4791 10.7864 13.5512 10.7071L23.294 0.951358C23.6786 0.483773 24.2171 0.1681 24.8132 0.0607802L25.0157 0Z"
                                  fill="#6A6A6A"
                                />
                              </svg>
                            </div>
                            <div className="main-holder">
                              <h2>SELECT</h2>
                              <div className="method-holder">
                                <div onClick={() => setshowAddFanPopUp(2)}>
                                  Add Custom
                                </div>
                                <div onClick={() => setshowAddFanPopUp(3)}>
                                  Add from <br /> Followers
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {showAddFanPopUp === 2 && (
                      <>
                        <div className="BackScreen-dark">
                          <div className="Custom-add-fan">
                            <h3 className="center-align">ADD FAN</h3>
                            <p className="wallet-text">Wallet address</p>
                            <div className="Address-holder">
                              {FansAddress.map((address, Index) => (
                                <input
                                  key={Index}
                                  onChange={(e) =>
                                    handleChangeAddressInput(e, Index)
                                  }
                                  value={address}
                                  type="text"
                                  placeholder="Enter Wallet Address"
                                />
                              ))}
                            </div>
                            <p
                              onClick={() =>
                                setFansAddress([...FansAddress, ""])
                              }
                              className="add-more-fan"
                            >
                              Add More Fan
                            </p>
                            <div className="popUp-btn-group">
                              <div
                                onClick={() => setshowAddFanPopUp(0)}
                                className="button-styling-outline btnCC"
                              >
                                <div
                                  onClick={() => setFansAddress([""])}
                                  className="btnCCin"
                                >
                                  Cancel
                                </div>
                              </div>
                              <div
                                onClick={addFanList}
                                className="button-styling btnCC"
                              >
                                Add
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {showAddFanPopUp === 3 && (
                      <>
                        <div className="BackScreen-dark">
                          <div className="Custom-add-fan">
                            <h3 className="center-align">ADD TO FAN LIST</h3>
                            <div className="line-1-selector">
                              <div>No.</div>
                              <div></div>
                            </div>
                            <div className="Address-holder">
                              {addFanlisting.length > 0 ? (
                                <>
                                  {addFanlisting.map((data, Index) => (
                                    <div
                                      key={Index}
                                      className="follower-in-fan-list"
                                    >
                                      <div className="inner">
                                        <div className="num">{Index + 1}</div>
                                        <div className="inner2">
                                          <div className="img-holder">
                                            <img
                                              src={data?.profile_image}
                                              alt=""
                                            />
                                          </div>
                                          <div className="Text-follower-fan">
                                            {data?.username} <br />{" "}
                                            <span>
                                              {" "}
                                              {
                                                data?.count_follower
                                              } Followers{" "}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div>
                                        <input
                                          checked={data?.is_check}
                                          onChange={() =>
                                            handleCheckboxChange(data?.user_id)
                                          }
                                          className="separate-checkbox-follower"
                                          type="checkbox"
                                          name=""
                                          id=""
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <div>List is Empty</div>
                              )}
                            </div>
                            <div className="popUp-btn-group">
                              <div
                                onClick={() => setshowAddFanPopUp(0)}
                                className="button-styling-outline btnCC"
                              >
                                <div
                                  onClick={() => setFansAddress([""])}
                                  className="btnCCin"
                                >
                                  Cancel
                                </div>
                              </div>
                              <div
                                className="button-styling btnCC"
                                onClick={addFans}
                              >
                                Add
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
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
      {/* <ProfileDrawer  isVisible={isVisible} onClose={onClose} /> */}
    </>
  );
};

export default Profile;
