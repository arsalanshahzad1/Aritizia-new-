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

const { ethereum } = window;
// import Web3 from "web3";
// import Web3Modal from "web3modal";

const Profile = ({ search, setSearch }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userNFTs, setUserNfts] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [userAddress, setUserAddress] = useState("0x000000....");
  const [discountPrice, setDiscountPrice] = useState(0);
  const [addedFans, setAddedFans] = useState({});
  const [following, setFollwing] = useState([]);
  const [followers, setFollwers] = useState([]);
  const navigate = useNavigate();

  let likedNftsFromDB = [];

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 31337) {
      window.alert("Change the network to Sepolia");
      throw new Error("Change network to Sepolia");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();

      return signer;
    }

    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setUserAddress(accounts[0]);
    console.log("getAddress", accounts[0]);
    postWalletAddress(accounts[0]);
  };
  const postWalletAddress = async (address) => {
    if (localStorage.getItem("data")) {
      return console.log("data is avaliable");
    } else {
      const response = await apis.postWalletAddress({
        wallet_address: address,
      });
      localStorage.setItem("data", JSON.stringify(response.data.data));
      window.location.reload();
    }
    // if (localStorage.getItem("data")) {
    //   return console.log("data is avaliable");
    // } else {
    //   const postData = {
    //     wallet_address: address,
    //   };

    //   axios
    //     .post("https://artizia-backend.pluton.ltd/api/connect-wallet", postData)
    //     .then((response) => {
    //       localStorage.setItem("data", JSON.stringify(response.data.data));
    //     })
    //     .catch((error) => {
    //       console.error(error);
    //     });
    // }
  };

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

    console.log("NFTId", NFTId);

    console.log("Running");

    for (let i = 0; i < NFTId.length; i++) {
      let id;
      let collectionImage = NFTId[i].collection_image;
      id = +NFTId[i].token_id;
      // id =i;

      console.log("zayyan", id);

      const metaData = await nftContract.tokenURI(id);

      const structData = await marketplaceContract._idToNFT(id);

      console.log("structData", structData);

      const fanNftData = await marketplaceContract._idToNFT2(id);

      let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

      setDiscountPrice(discountOnNFT);

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

          // if (listingType === 0) {
          const nftData = {
            id: id, //
            title: title,
            image: image,
            price: price,
            crypto: crypto,
            royalty: royalty,
            description: description,
            collection: collection,
            collectionImage: collectionImage,
          };
          console.log("nftData", nftData);
          liked.push(nftData);
          setLikedNfts(liked);

          // setLikedNfts((prevState) => ([ ...prevState, nftData ]));
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
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

    await (await marketplaceContract.addFans(FansAddress)).wait();
    console.log("asdasdasd");

    // const fans = await marketplaceContract.getFans();

    // console.log("fans", fans);

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
  };

  const testFans = async () => {
    console.log("testFans");
    console.log("addedFans hook ", addedFans);
    console.log("addedFans hook ", addedFans[0]);
    console.log("userAddress", userAddress);

    postFanList();
  };

  const postFanList = async () => {
    const response = await apis.postAddFans({
      fan_by_wallet: userAddress,
      fan_to_array_wallet: addedFans,
    });

    console.log("DATA", response);
  };

  const getMyListedNfts = async () => {
    let emptyList = [];
    setNftListAuction(emptyList);
    setNftListFP(emptyList);
    const provider = await getProviderOrSigner();
    // console.log("Connected wallet", userAddress);
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

    let myNFTs = [];
    let myAuctions = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();
      // id = mintedTokens[i];
      console.log("YESS");

      const metaData = await nftContract.tokenURI(id);
      console.log("1111");

      const structData = await marketplaceContract._idToNFT(id);
      console.log("222");

      const fanNftData = await marketplaceContract._idToNFT2(id);

      let discountOnNFT = +fanNftData.fanDiscountPercent.toString();
      console.log("333");

      setDiscountPrice(discountOnNFT);

      let auctionData = await marketplaceContract._idToAuction(id);
      console.log("444");

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
            };
            console.log(nftData);
            myNFTs.push(nftData);
            setNftListFP(myNFTs);
            // console.log("myNFTs in function", myNFTs);
          } else if (listingType === 1) {
            const nftData = {
              id: id, //
              title: title,
              image: image,
              price: price,
              basePrice: price,
              endTime: auctionData.endTime.toString(),
              highestBid: highestBid,
              highestBidder: auctionData.highestBidder.toString(),
              // isLive: auctionData.isLive.toString(),
              seller: auctionData.seller.toString(),
              startTime: auctionData.startTime.toString(),
            };
            // console.log("auction in function", myAuctions);

            myAuctions.push(nftData);
            // console.log("auction in function", myAuctions);
            setNftListAuction(myAuctions);
          }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  const getMyNfts = async () => {
    let emptyList = [];
    setNftListAuction(emptyList);
    setNftListFP(emptyList);
    const provider = await getProviderOrSigner();
    // console.log("Connected wallet", userAddress);
    // console.log("provider", provider);

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

    // console.log("MYADDRESS", address);

    let listingType;

    let mintedTokens = await marketplaceContract.getMyNfts(userAddress);

    // let mintedTokens = [1, 4, 2];
    // console.log("mintedTokens", mintedTokens);

    let myNFTs = [];
    // let myAuctions = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();
      // id = mintedTokens[i];
      console.log("YESS", id);
      console.log("mintedTokens[i].tokenId", mintedTokens[i].tokenId);
      const metaData = await nftContract.tokenURI(id);

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
          // Extracting values using dot notation
          // const price = data.price;
          // listingType = data.listingType;
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          const collection = data.collection;

          // if (listingType === 0) {
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
          myNFTs.push(nftData);
          setUserNfts(myNFTs);
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

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      // Assign the Web3Modal class to the reference object by setting it's `current` value
      // The `current` value is persisted throughout as long as this page is open
      web3ModalRef.current = new Web3Modal({
        network: "hardhat",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      // numberOFICOTokens();
    }
  }, [walletConnected]);
  // useEffect(() => {
  //   window.scroll(0, 0);
  // });
  useEffect(() => {
    connectWallet();
    getMyListedNfts();
    getAddress();
    getMyNfts();
    getLikedNfts();
  }, [userAddress]);

  const getLikedNftsList = async () => {
    const response = await apis.getLikeNFTList();
    return response.data.data;
  };

  const getFollowingList = async () => {
    const response = await apis.getFollowingList();
    console.log(response.data.data, "following");
    setFollwing(response.data.data);
  };
  const getFollowersList = async () => {
    const response = await apis.getFollowersList();
    console.log(response.data.data, "followers");
    setFollwers(response.data.data);
  };

  useEffect(() => {
    getLikedNfts();
    getFollowingList();
    getFollowersList();
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

  const initialCheckboxData = [
    {
      id: 1,
      label: "Checkbox 1",
      checked: false,
      FollowerName: "Monica Lucas",
      FollowersCount: "100k",
      FollowerImg: followerImg,
    },
    {
      id: 2,
      label: "Checkbox 2",
      checked: false,
      FollowerName: "Monica Lucas",
      FollowersCount: "100k",
      FollowerImg: followerImg,
    },
    {
      id: 3,
      label: "Checkbox 3",
      checked: false,
      FollowerName: "Monica Lucas",
      FollowersCount: "100k",
      FollowerImg: followerImg,
    },
    {
      id: 4,
      label: "Checkbox 4",
      checked: false,
      FollowerName: "Monica Lucas",
      FollowersCount: "100k",
      FollowerImg: followerImg,
    },
    {
      id: 5,
      label: "Checkbox 5",
      checked: false,
      FollowerName: "Monica Lucas",
      FollowersCount: "100k",
      FollowerImg: followerImg,
    },
    {
      id: 6,
      label: "Checkbox 6",
      checked: false,
      FollowerName: "Monica Lucas",
      FollowersCount: "100k",
      FollowerImg: followerImg,
    },
    {
      id: 7,
      label: "Checkbox 7",
      checked: false,
      FollowerName: "Monica Lucas",
      FollowersCount: "100k",
      FollowerImg: followerImg,
    },

    // Add more checkbox data objects as needed
  ];

  const [checkboxes, setCheckboxes] = useState(initialCheckboxData);

  const handleCheckboxChange = (id) => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = prevCheckboxes.map((checkbox) => {
        if (checkbox.id === id) {
          return {
            ...checkbox,
            checked: !checkbox.checked,
          };
        }
        return checkbox;
      });

      return updatedCheckboxes;
    });
  };

  const checkAllCheckboxes = () => {
    setCheckboxes((prevCheckboxes) => {
      const updatedCheckboxes = prevCheckboxes.map((checkbox) => ({
        ...checkbox,
        checked: true,
      }));

      return updatedCheckboxes;
    });
  };

  const postChatMeaage = async () => {
    console.log("clicking");
    const id = JSON.parse(localStorage.getItem("data"));
    const user_id = id.id;
    const response = await apis.postCheckChatMessage({
      sender_id: user_id,
      receiver_id: "5",
    });
    if (response.status) {
      window.location.replace("http://localhost:5173/chat/5");
    }
  };

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section">
          <img
            className="big-image"
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
                <div className="col-lg-4 col-md-4 col-6 my-auto">
                  <SocialShare
                    style={{ fontSize: "28px", marginRight: "0px" }}
                  />
                </div>
              </div>
              <div className="row">
                <p className="user-email">@monicaaa</p>
              </div>
              <div className="row">
                <div className="col-lg-3 col-md-3 col-12"></div>
                <div className="col-lg-6 col-md-6 col-12">
                  <div className="copy-url">
                    <span>{userAddress}</span>
                    <button>Copy</button>
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
                    Gallery
                  </button>
                  <button
                    className={`${tabs === 1 ? "active" : ""}`}
                    onClick={() => setTabs(1)}
                  >
                    Collection
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
                </div>
              </div>
              <button onClick={testFans}>Test Fans</button>
              <div className="profile-buy-card">
                {tabs === 0 && (
                  <>
                    <Gallery />
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
                              userAddress={userAddress}
                            />
                          ))}
                        </>
                      )}
                    </div>
                  </>
                )}
                {tabs === 2 && (
                  <>
                    <div className="row">
                      {/* {nftListAuction.map((item) => (
                        <NewItemCard
                          key={item.id}
                          id={item.id}
                          title={item?.title}
                          image={nft}
                          price={item?.price}
                          highestBid={item?.highestBid}
                          isLive={item?.isLive}
                          endTime={item?.endTime}
                          userAddress
                        />
                      ))} */}
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
                          userAddress
                        />
                      ))}
                    </div>
                  </>
                )}
                {tabs === 3 && (
                  <>
                    <div className="row">
                      {likedNfts?.map((item) => (
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
                          userAddress
                        />
                      ))}
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
                            <Followers data={followers} />
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
                            <Following data={following} />
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
                    <Fan />
                    <Fan />
                    <Fan />
                    <Fan />
                    <Fan />
                    <Fan />
                    <Fan />
                    <Fan />
                    <Fan />

                    <div
                      onClick={() => setshowAddFanPopUp(1)}
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
                              <div>
                                Select All{" "}
                                <input
                                  onClick={checkAllCheckboxes}
                                  className="check-all-fans"
                                  type="checkbox"
                                />{" "}
                              </div>
                            </div>
                            <div className="Address-holder">
                              {checkboxes.map((checkbox, Index) => (
                                <div
                                  key={checkbox.id}
                                  className="follower-in-fan-list"
                                >
                                  <div className="inner">
                                    <div className="num">{Index + 1}</div>
                                    <div className="inner2">
                                      <div className="img-holder">
                                        <img
                                          src={checkbox.FollowerImg}
                                          alt=""
                                        />
                                      </div>
                                      <div className="Text-follower-fan">
                                        {checkbox.FollowerName} <br />{" "}
                                        <span>
                                          {" "}
                                          {
                                            checkbox.FollowersCount
                                          } Followers{" "}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <input
                                      checked={checkbox.checked}
                                      onChange={() =>
                                        handleCheckboxChange(checkbox.id)
                                      }
                                      className="separate-checkbox-follower"
                                      type="checkbox"
                                      name=""
                                      id=""
                                    />
                                  </div>
                                </div>
                              ))}
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
                              <div className="button-styling btnCC">Add</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
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
