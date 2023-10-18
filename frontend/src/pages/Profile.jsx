import React, { useCallback, useState, useEffect, useContext } from "react";

import NewItemCard from "../components/cards/NewItemCard";
import Footer from "./landingpage/Footer";
import SocialShare from "../components/shared/SocialShare";
import Search from "../components/shared/Search";
import { Contract, ethers } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../contractsData/ArtiziaNFT.json";
import axios from "axios";
import SimpleCard from "../components/cards/SimpleCard";
import MyNftCard from "../components/cards/MyNftCard";
import Following from "./settingFolder/Following";
import Fan from "./settingFolder/Fan";
import Followers from "./settingFolder/Followers";
import apis from "../service";
import { useNavigate } from "react-router-dom";
import Gallery from "./Gallery";
import RejectedNFTSCard from "../components/cards/RejectedNFTSCard";
import { toast } from "react-toastify";
import Loader from "../components/shared/Loader";
import Header from "./landingpage/Header";
import { Store } from "../Context/Store";
import { CiGlass, CiLight } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { BsInstagram, BsLinkedin, BsTwitter } from "react-icons/bs";
import FavNftCard from "../components/cards/FavNftCard";

const Profile = ({ search, setSearch }) => {
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
  const [loader, setLoader] = useState(true)
  const [userNftLoader, setUserNftLoader] = useState(true)
  const [nftLoader, setNftLoader] = useState(true)
  const [nftAuctionLoader, setNftAuctionLoader] = useState(true)
  const [likedNftLoader, setLikedNftLoader] = useState(true)
  const [likedNftAuctionLoader, setLikedNftAuctionLoader] = useState(true)
  const [fanToggle, setFanToggle] = useState(false)

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const userId = userData?.id;

  const navigate = useNavigate();

  const { account, checkIsWalletConnected } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  //////////////////////// API Section ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  const getLikedNftsList = async () => {
    const response = await apis.getLikeNFTList(userId);
    return response?.data?.data;
  };

  const viewAllNfts = async () => {
    try {
      // const response = await apis.viewAllMyNfts(userId);
      console.log("response")
      getMyListedNfts();

      //Need to fiix this API
      // if (response?.data?.data?.length > 0) {
      //   getMyListedNfts(response?.data?.data)
      // }else{
      //   setNftLoader(false)
      // }
      setNftLoader(false)
      setNftAuctionLoader(false)
    } catch (error) {
      console.log(error, "errrrr")
      setNftAuctionLoader(false)
    }

  };

  const getPurchasedNfts = async () => {
    try {
      const response = await apis.getPurchasedNfts(userId);
      console.log(response,"response")
      //Blockchain
      // getMyNfts();
      if (response?.data?.data?.length > 0) {
        getMyNfts(response?.data?.data);
      } else {
        getMyNfts(0);
        setNftLoader(false)
      }
      setNftAuctionLoader(false)
    } catch (error) {
      setNftLoader(false)
      console.log(error, "errrrr")
      setNftAuctionLoader(false)
    }

  };



  // //get Liked nft on Sale
  // const getNFTlikeListing = async () => {
  //   try {
  //     const response = await apis.getLikeNFTListing(userId);
  //     if (response?.data?.data?.length > 0) {
  //       setLikedNfts(response?.data?.data);
  //     }
  //     setLikedNftLoader(false)

  //   } catch (error) {
  //     setLikedNftLoader(false)
  //   }
  // };

  const getLikedNfts = async () => {
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
    let NFTId = await getLikedNftsList();

    if (NFTId.length == 0) {
      setLikedNftLoader(false)
    }


    let liked = [];
    // let emptyList = [];
    // setLikedNfts(emptyList);
    // setLikedNftsAuction(emptyList);
    if (NFTId?.length > 0 && NFTId != "") {
      for (let i = 0; i < NFTId?.length; i++) {
        let id;
        id = +NFTId?.[i]?.token_id?.toString();


        const metaData = await nftContract.tokenURI(id);

        const structData = await marketplaceContract._idToNFT(id);

        // const fanNftData = await marketplaceContract._idToNFT2(id);

        // let discountOnNFT = +fanNftData?.fanDiscountPercent?.toString();

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
          // nft_like:nftLikes?.data?.data?.like_count
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
                nft_like: nftLikes?.data?.data?.like_count
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
    setLikedNftAuctionLoader(false)
  };



  useEffect(() => {
    // getNFTlikeListing();
    viewAllNfts();
    getLikedNfts();
    getPurchasedNfts();
    setLoader(false)
  }, []);

  //////////////////////// Functions Section ///////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////



  const validateFanAddresses = (addresses) => {
    for (const address of addresses) {
      if (address === "") {
        return false;
      }
    }
    return true;
  };

  ///Add fans list ///// start
  const addFanList = async () => {
    try {
      if (validateFanAddresses(FansAddress)) {
        setLoader(true)

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // Set signer
        const signer = provider.getSigner()

        const marketplaceContract = new Contract(
          MARKETPLACE_CONTRACT_ADDRESS.address,
          MARKETPLACE_CONTRACT_ABI.abi,
          signer
        );

        console.log("FansAddressFansAddress",FansAddress)

        let fanadd = await (
          await marketplaceContract.addFans(FansAddress)
        ).wait();

        let response = marketplaceContract.on("addedFans", handleAddedFansEvent);

        setshowAddFanPopUp(0);
        setLoader(false)

      } else {
        toast.warning("There is an empty wallet address", {
          position: toast.POSITION.TOP_CENTER,
        });
      }
      // fanList()
    } catch (error) {
      toast.warning("Wrong wallet address", {
        position: toast.POSITION.TOP_CENTER,
      });
      setLoader(false)
      setshowAddFanPopUp(0);

    }
  };

  const handleAddedFansEvent = async (fanList) => {
    setAddedFans(fanList);
    postFanList();
    setLoader(false)
  };

  const postFanList = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    let fanList = await marketplaceContract.getFans(userAddress);
    // console.log(fanList, "newwwwwwwwwww")
    const response = await apis.postAddFans({
      fan_by_wallet: userAddress,
      fan_to_array_wallet: fanList,
    });


    setTimeout(() => {
      navigate("/profile");
    }, 1000);
  };
  ////// end

  //get Collection(Minted + Listed (fix + Auction) nft's BLC/DB)
  const getMyListedNfts = async (nftsList) => {

    // let emptyList = [];
    // setNftListAuction(emptyList)
    // setNftListFP(emptyList);

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

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
    // const signer = provider.getSigner();
    const address = await signer.getAddress();


    let listingType;


    let mintedTokens = await marketplaceContract.getMyListedNfts(userAddress);

    if (mintedTokens?.length === 0) {
      setNftLoader(false)
    }

    //blockchain Side
    for (let i = 0; i < mintedTokens?.length; i++) {
      let id;
      id = mintedTokens?.[i]?.tokenId?.toString();

      //for Detabase 
      // for (let i = 0; i < nftsList?.length; i++) {
      //   let id;
      //   id = nftsList?.[i];

      console.log(id, "mintedTokens")

      let collectionId;
      collectionId = +mintedTokens?.[i]?.collectionId?.toString();
      console.log(collectionId, "collectionId")
      const response = await apis.getNFTCollectionImage(collectionId);
      const collectionImages = response?.data?.data?.media?.[0]?.original_url;
      const user_id = response?.data?.data?.user_id;
      console.log(collectionImages, "collectionImages")

      const metaData = await nftContract.tokenURI(id);

      const structData = await marketplaceContract._idToNFT(id);

      // const fanNftData = await marketplaceContract._idToNFT2(id);

      // let discountOnNFT = +fanNftData?.fanDiscountPercent?.toString();
      // setDiscountPrice(discountOnNFT);

      listingType = structData?.listingType;

      let auctionData = await marketplaceContract._idToAuction(id);


      let highestBid = ethers.utils.formatEther(
        auctionData?.highestBid?.toString()
      );

      const price = ethers.utils.formatEther(structData?.price?.toString());

      let nftLikes
      try {
        nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)  
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
          console.log("data", data?.crypto)
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
            setNftListFP((prev) => [...prev, nftData]);

          } else if (listingType === 1) {

            const nftData = {
              id: id,
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
              nft_like: nftLikes?.data?.data?.like_count

            };
            setNftListAuction((prev) => [...prev, nftData]);
          }
          setNftLoader(false)
        })
        .catch((error) => {
          setNftLoader(false)
          console.error("Error fetching metadata:", error);
        });
      setNftLoader(false)
    }
    setNftLoader(false)
  };


  //get your purchase nft it show you purchased nft
  const getMyNfts = async (NFTid) => {
    console.log(NFTid, "NFTid")
    // let emptyList = [];
    // setNftListAuction(emptyList);
    // setNftListFP(emptyList);

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // const provider = await getProviderOrSigner();
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

    if(NFTid?.length > 0 ) {
       //for database
      for (let i = 0; i < NFTid?.length; i++) {
        let id;
        id = NFTid[i]

        const structData = await marketplaceContract._idToNFT(id);
    
        //check if not listed
        if (!structData?.listed && structData.owner.toString().toLowerCase() === userAddress.toString().toLowerCase()) {
          
          let response;
  
          try {
            response = await apis.getNFTByTokenId(id);
          } catch (error) {
            console.log(error.message)
          }
  
          const collectionImages = response?.data?.data?.collection?.media?.[0]?.original_url;
          const user_id = response?.data?.data?.owner?.id;
          // console.log("1asdasdasdasdasdaqsd" , response?.data?.data?.owner?.id)
  
          const metaData = await nftContract.tokenURI(id);
  
          const price = ethers.utils.formatEther(structData?.price?.toString());
  
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
                user_id: user_id
              };
              console.log(nftData, "nftDatanftData")
              setUserNfts((prev) => [...prev, nftData]);
            })
            .catch((error) => {
              console.error("Error fetching metadata:", error);
           });
        }
      }
      }

   else {

       // for blockchian
       let mintedTokens = await marketplaceContract.getMyNfts(userAddress);
       console.log("mintedTokens",mintedTokens)
       // for blockchian
       for (let i = 0; i < mintedTokens?.length; i++) {
        let id;
        id = mintedTokens[i]?.tokenId?.toString();

       let collectionId = +mintedTokens?.[i]?.collectionId?.toString();
        console.log(collectionId, "collectionId")

        const structData = await marketplaceContract._idToNFT(id);
        console.log("structData", structData)
        //check if not listed
        if (!structData?.listed && structData.owner.toString().toLowerCase() === userAddress.toString().toLowerCase()) {
          
          let response;
  
          try {
            response = await apis.getNFTByTokenId(id);
          } catch (error) {
            console.log(error.message)
          }
  
          const collectionImages = response?.data?.data?.collection?.media?.[0]?.original_url;
          const user_id = response?.data?.data?.owner?.id;
          console.log("1asdasdasdasdasdaqsd" , response)
  
          const metaData = await nftContract.tokenURI(id);
  
          const price = ethers.utils.formatEther(structData?.price?.toString());
  
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
                user_id: user_id
              };
              console.log(nftData, "nftDatanftData")
              setUserNfts((prev) => [...prev, nftData]);
            })
            .catch((error) => {
              console.error("Error fetching metadata:", error);
           });
        }
      }
    }
    setUserNftLoader(false)
  };

  // useEffect(() => {
  //   // getMyListedNfts();
  //   // getMyNfts();
  //   // getLikedNfts();
  //   setLoader(false)
  // }, [userAddress]);

  // useEffect(() => {
  //   // getLikedNfts();
  //   // getAddress();
  //   // getProviderOrSigner();
  // }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  const [FansAddress, setFansAddress] = useState([""]);

  const fansAddressHandle = () => {
    console.log(FansAddress?.[FansAddress?.length - 1], "SSSSSSSSSSS")
    if (FansAddress?.[FansAddress?.length - 1]) {
      setFansAddress([...FansAddress, ""])
    }
    else {
      toast.error("Required wallet address field empty")
    }
  }

  const [showAddFanPopUp, setshowAddFanPopUp] = useState(0);

  const handleChangeAddressInput = (e, index) => {
    const newArray = [...FansAddress];
    newArray[index] = e.target.value;
    setFansAddress(newArray);
  };

  const [addingFanList, setAddingFanList] = useState([]);

  const handleCheckboxChange = (id) => {
    setAddFanlisting((prevCheckboxes) => {
      const updatedCheckboxes = prevCheckboxes?.map((data) => {
        if (data?.user_id === id) {
          if (addingFanList?.includes(id)) {
            setAddingFanList((prev) => prev?.filter((userId) => userId !== id));
          } else {
            setAddingFanList((prev) => [...prev, id]);
          }

          return {
            ...data,
            is_check: !data?.is_check,
          };
        }
        return data;
      });

      return updatedCheckboxes;
    });
  };

  const [followers, setFollwers] = useState([]);
  const [addFanlisting, setAddFanlisting] = useState([]);

  const getFollowersList = async () => {
    const response = await apis.getFollowersList(userId);
    if (response?.status) {
      setFollwers(response?.data?.data);
    } else {
      setFollwers("");
    }
  };

  const getFollowersForFan = async (id) => {
    const response = await apis.getFollowersForFan(id);
    if (response?.status) {
      setAddFanlisting(response?.data?.data);
      console.log(response?.data?.data, 'response');
    } else {
      setAddFanlisting("");
    }
  };

  useEffect(() => {
    getFollowersList(userId);
  }, []);

  const addFans = async () => {
    if (addingFanList?.length > 0) {
      const response = await apis.postUserFans({
        fan_by: userData?.id,
        fan_to_array: addingFanList,
      });
      if (response?.status) {
        setAddingFanList([]);
        getFollowersList();
      }
    } else {
      console.log("empty");
    }
    setshowAddFanPopUp(0)
    setFanToggle(!fanToggle)
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);

    toast.success(`Copied Successfully`, {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const userWalletAddress = localStorage.getItem("userAddress")

  console.log(window.location.hash, 'asdasdasdas');
  console.log(window.location.host, 'asdasdasdasss');
  console.log(window.location.href, 'asdasdasdasssss');

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
                  <div className="other-user-icons">
                    <a href={userData?.facebook_url} target="_blank"><FaFacebookF /></a>
                    <a href={userData?.twitter_url} target="_blank"><BsTwitter /></a>
                    <a href={userData?.instagram_url} target="_blank"><BsInstagram /></a>
                    <a href={userData?.your_site} target="_blank"><BsLinkedin /></a>
                  </div>
                  {/* <SocialShare
                    style={{ fontSize: "22px", marginRight: "10px" }}
                  /> */}
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
                    Favorite
                  </button>
                  <button
                    className={`${tabs === 4 ? "active" : ""}`}
                    onClick={() => setTabs(4)}
                  >
                    Followers
                  </button>
                  {userWalletAddress === "false" ? <></> : <>

                    {/* <button
                      className={`${tabs === 5 ? "active" : ""}`}
                      onClick={() => setTabs(5)}
                    >
                      Fan List
                    </button> */}
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
                                <SimpleCard
                                  onOpen={onOpen}
                                  key={item?.id}
                                  id={item?.id}
                                  title={item?.title}
                                  image={item?.image}
                                  price={item?.price}
                                  crypto={item?.crypto}
                                  royalty={item?.royalty}
                                  description={item?.description}
                                  collection={item?.collection}
                                  collectionImages={item?.collectionImages}
                                  userAddress
                                  sellerWallet={userAddress}
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
                                <NewItemCard
                                  key={item?.id}
                                  id={item?.id}
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
                                  seller={item?.seller}
                                  user_id={item?.user_id}
                                  nft_like={item?.nft_like}
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
                          </section> :
                          userNFTs?.length > 0 ?
                            <>
                              {userNFTs?.map((item) => (
                                <MyNftCard
                                  onOpen={onOpen}
                                  key={item?.id}
                                  id={item?.id}
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
                                    onOpen={onOpen}
                                    // onClose={onClose}
                                    key={item?.id}
                                    id={item?.id}
                                    title={item?.title}
                                    image={item?.image}
                                    price={item?.price}
                                    crypto={item?.crypto}
                                    royalty={item?.royalty}
                                    description={item?.description}
                                    collection={item?.collection}
                                    collectionImages={item?.collectionImages}
                                    userAddress
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
                                  <NewItemCard
                                    key={item?.id}
                                    id={item?.id}
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
                                    user_id={item?.user_id}
                                    nft_like={item?.nft_like}
                                    
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
                {/* {tabs === 5 && (
                  <>
                    <div className="FanListPage"></div>
                    <Fan id={userId} fanToggle={fanToggle} />

                    <div
                      onClick={() => {
                        setshowAddFanPopUp(1);
                        getFollowersForFan(userData?.id);
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
                              {FansAddress?.map((address, Index) => (
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
                                fansAddressHandle()
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
                              {addFanlisting?.length > 0 ? (
                                <>
                                  {addFanlisting?.map((data, Index) => (
                                    <div
                                      key={Index}
                                      className="follower-in-fan-list"
                                    >
                                      <div className="inner">
                                        <div className="num">{Index + 1}</div>
                                        <div className="inner2">
                                          <div className="img-holder">
                                            <img
                                              src={data?.profile_image !== null ? data?.profile_image : '/assets/images/user-none.png'}
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
                                <div className="data-not-avaliable"> <h2>List is Empty</h2></div>
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
                )} */}

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
      {/* <ToastContainer /> */}
    </>
  );
};

export default Profile;
