import React, { useRef, useCallback, useState, useEffect } from "react";
import Header from "../../pages/landingpage/Header";
import { BsFillEnvelopeFill } from "react-icons/bs";
import BuyNow from "../../components/cards/BuyNow";
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
import { getAddress } from "../../methods/methods";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";
import RejectedNFTSCard from "../../components/cards/RejectedNFTSCard";
import FollowersUserDashboard from "../../pages/settingFolder/FollowersUserDashboard";
import FollowingUserDashboard from "../../pages/settingFolder/FollowingUserDashboard";
import FanUserDaskboard from "../../pages/settingFolder/FanUserDaskboard";

const { ethereum } = window;
// import Web3 from "web3";
// import Web3Modal from "web3modal";

const User = ({ search, setSearch }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userNFTs, setUserNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [likedNftsAuction, setLikedNftsAuction] = useState([]);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [addedFans, setAddedFans] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [userID, setUserID] = useState(searchParams.get("id"));
  const [userADDRESS, setUserADDRESS] = useState(searchParams.get("add"));
  const [userDetails, setUserDetails] = useState([]);

  const getOtherUsersDetails = async (userADDRESS) => {
    const response = await apis.getOtherUser(userADDRESS);
    setUserDetails(response?.data?.data);
    console.log(response?.data?.data, "gfgfgfg");
    // getNFTlikeListing(response?.data?.data?.id);
  };

  const getNFTlikeListing = async () => {
    const response = await apis.getLikeNFTListing(userID);
    setLikedNfts(response?.data?.data);
    console.log(response, "other-users");
  };

  useEffect(() => {
    getNFTlikeListing();
    getOtherUsersDetails(userID);
  }, []);

  let likedNftsFromDB = [];

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userADDRESS;

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
              // setLikedNfts(liked);
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
              // ((prev) => [...prev, nftData]);
              // setLikedNftsAuction(myAuctions);
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

    //  0x32e65857f0E0c6045F7b77cf3a9f8b7469f853Cd
    // 0x92E665119CD1DBd96fd6899bC7375Ac296aF370D
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    //

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
            console.log(nftData);
            // myNFTs.push(nftData);
            // setNftListFP(myNFTs);
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

            // setNftListAuction(myAuctions);
            setNftListAuction((prev) => [...prev, nftData]);
            // console.log(nftListAuction, "nftData");
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

    let mintedTokens = await marketplaceContract.getMyNfts(userAddress);
    console.log("five");
    // let mintedTokens = [1, 4, 2];
    // console.log("mintedTokens", mintedTokens);
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
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          const collection = data.collection;

          const nftData = {
            id: id,
            title: title,
            image: image,
            price: price,
            crypto: crypto,
            royalty: royalty,
            description: description,
            collection: collection,
            collectionImages: collectionImages,
          };

          //   myNFTs.push(nftData);

          setUserNfts((prev) => [...prev, nftData]);
          //   setUserNfts(myNFTs);
          console.log("myNFTs in function", myNFTs);
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  useEffect(() => {
    getAddress();
    getProviderOrSigner();
  }, []);

  useEffect(() => {
    getMyListedNfts();
    getMyNfts();
    getLikedNfts();
  }, [userAddress]);

  const getLikedNftsList = async () => {
    const response = await apis.getLikeNFTList(userID);
    return response.data.data;
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
    setFollwers((prevCheckboxes) => {
      const updatedCheckboxes = prevCheckboxes.map((data) => {
        if (data?.user_id === id) {
          // Check if the user_id is already in the addingFanList
          if (addingFanList.includes(id)) {
            setAddingFanList((prev) => prev.filter((userId) => userId !== id));
          } else {
            setAddingFanList((prev) => [...prev, id]);
          }
          console.log(addingFanList, "addingFanList");

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
    const response = await apis.getFollowersList(userID);
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
    getFollowersList(userID);
  }, []);

  // const addFans = async () => {
  //     if (addingFanList.length > 0) {
  //         const response = await apis.postUserFans({
  //             fan_by: userID,
  //             fan_to_array: addingFanList,
  //         });
  //         if (response.status) {
  //             setAddingFanList([]);
  //             getFollowersList();
  //         }
  //     } else {
  //         console.log("empty");
  //     }
  // };

  // const getMyListedNfts = async () => {
  //     console.log("aaaa");
  //     console.log("Connected wallet", userAddress);
  //     let emptyList = [];
  //     setNftListAuction(emptyList);
  //     setNftListFP(emptyList);
  //     const provider = await getProviderOrSigner();
  //     console.log("111111");
  //     // console.log("provider", provider);

  //     const marketplaceContract = new Contract(
  //       MARKETPLACE_CONTRACT_ADDRESS.address,
  //       MARKETPLACE_CONTRACT_ABI.abi,
  //       provider
  //     );
  //     console.log("222222");

  //     const nftContract = new Contract(
  //       NFT_CONTRACT_ADDRESS.address,
  //       NFT_CONTRACT_ABI.abi,
  //       provider
  //     );
  //     const signer = provider.getSigner();
  //     const address = await signer.getAddress();

  //     // console.log("MYADDRESS", address);
  //     console.log("333333");

  //     let listingType;

  //     let mintedTokens = await marketplaceContract.getMyListedNfts(userAddress);

  //     // let mintedTokens = [1, 4, 2];
  //     console.log("mintedTokens", mintedTokens);
  //     let NFTId = await getLikedNftsList();
  //     let myNFTs = [];
  //     let myAuctions = [];
  //     for (let i = 0; i < mintedTokens.length; i++) {
  //       let id;
  //       id = +mintedTokens[i].tokenId.toString();

  //       let collectionId;
  //       collectionId = +mintedTokens[i].collectionId.toString();
  //       console.log("YESS", id);

  //       const response = await apis.getNFTCollectionImage(collectionId);
  //       console.log(response, "responses");
  //       const collectionImages = response?.data?.data?.media?.[0]?.original_url;
  //       console.log(response?.data?.data?.media?.[0]?.original_url, "responsess");
  //       console.log(collectionImages, "trrrr");

  //       const metaData = await nftContract.tokenURI(id);

  //       const structData = await marketplaceContract._idToNFT(id);

  //       const fanNftData = await marketplaceContract._idToNFT2(id);

  //       let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

  //       setDiscountPrice(discountOnNFT);

  //       let auctionData = await marketplaceContract._idToAuction(id);

  //       listingType = structData.listingType;

  //       let highestBid = ethers.utils.formatEther(
  //         auctionData.highestBid.toString()
  //       );

  //       const price = ethers.utils.formatEther(structData.price.toString());

  //       axios
  //         .get(metaData)
  //         .then((response) => {
  //           const meta = response.data;
  //           let data = JSON.stringify(meta);

  //           data = data.slice(2, -5);
  //           data = data.replace(/\\/g, "");

  //           data = JSON.parse(data);
  //           const crypto = data.crypto;
  //           const title = data.title;
  //           const image = data.image;
  //           const royalty = data.royalty;
  //           const description = data.description;
  //           const collection = data.collection;

  //           if (listingType === 0) {
  //             const nftData = {
  //               id: id, //
  //               title: title,
  //               image: image,
  //               price: price,
  //               crypto: crypto,
  //               royalty: royalty,
  //               description: description,
  //               collection: collection,
  //               collectionImages: collectionImages,
  //             };
  //             console.log(nftData);
  //             myNFTs.push(nftData);
  //             setNftListFP(myNFTs);
  //           } else if (listingType === 1) {
  //             const nftData = {
  //               id: id, //
  //               title: title,
  //               image: image,
  //               price: price,
  //               basePrice: price,
  //               collectionImages: collectionImages,
  //               endTime: auctionData.endTime.toString(),
  //               highestBid: highestBid,
  //               highestBidder: auctionData.highestBidder.toString(),
  //               seller: auctionData.seller.toString(),
  //               startTime: auctionData.startTime.toString(),
  //             };
  //             myAuctions.push(nftData);
  //             setNftListAuction(myAuctions);
  //             console.log(nftListAuction, "nftData");
  //           }
  //         })

  //         .catch((error) => {
  //           console.error("Error fetching metadata:", error);
  //         });
  //     }
  //   };

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section" style={{ margin: "0px" }}>
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
          <div className="detail" style={{ padding: "0px" }}>
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-12"></div>
                <div className="col-lg-4 col-md-4 col-6">
                  <h2 className="user-name">
                    {userDetails?.first_name} {userDetails?.last_name}
                  </h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto">
                  {/* <SocialShare
                                        style={{ fontSize: "28px", marginRight: "0px" }}
                                    /> */}
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
                      {userNFTs.length > 0 ? userNFTs.map((item) => (
                        <MyNftCard
                          onOpen={onOpen}
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
                      )) : 
                      <div className="data-not-avaliable">
                        <h2>No data avaliable</h2>
                      </div>
                    }
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
                              size={'col-lg-3'}
                            />
                          ))}
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
                            <FollowersUserDashboard id={userID} />
                          </>
                        ) : (
                          <>
                            <FollowingUserDashboard id={userID} />
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
                {tabs === 5 && (
                  <>
                    <div className="FanListPage"></div>
                    <FanUserDaskboard id={userID} />
                  </>
                )}
                {tabs === 6 && (
                  <>
                    <div className="row">
                      <RejectedNFTSCard userId={userID} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <Search search={search} setSearch={setSearch} />
      </div>
      {/* <ProfileDrawer  isVisible={isVisible} onClose={onClose} /> */}
    </>
  );
};

export default User;
