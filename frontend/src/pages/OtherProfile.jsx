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
import Follow from "./settingFolder/Follow";

import OtherUser from "../../public/assets/images/OtherUser.png";
import OtherUserBackground from "../../public/assets/images/OtherUserBackground.png";
import CollectionCard from "../components/cards/CollectionCard";
import liked1 from "../../public/assets/images/liked1.png";
import liked2 from "../../public/assets/images/liked2.png";
import collection from "../../public/assets/images/Collection-card-image.png";

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
  const [userAddress, setUserAddress] = useState("0x000000....");

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
    localStorage.setItem("walletAddress", accounts[0]);
    postWalletAddress(accounts[0]);
  };

  const postWalletAddress = (address) => {
    console.log("in post wallet 1");
    const postData = {
      // Specify the data you want to send in the POST request
      // For example:
      walletAddress: address,
    };

    axios
      .post("https://artizia-backend.pluton.ltd/api/connect-wallet", postData)
      .then((response) => {
        // Handle the response from the server/API
        console.log(response.data);
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
    console.log("in post wallet 2");
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

            console.log(nftData);
            myNFTs.push(nftData);
            setNftListFP(myNFTs);
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

            myAuctions.push(nftData);
            console.log("auction in function", myAuctions);
            setNftListAuction(myAuctions);
          }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  useEffect(() => {
    connectWallet();
    getMyListedNfts();
    getAddress();
  }, [userAddress]);

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section">
          <img
            className="big-image"
            src={OtherUserBackground}
            alt=""
            width={"100%"}
          />
          <div className="user">
            <div className="user-wrap">
              <img className="user-pic" src={OtherUser} alt="" width={"90%"} />
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
                  <div>Following</div>
                  <div>Followers 50k+</div>
                </div>
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
                  <div className="message-btn">
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
                      <CollectionCard image={collection} />
                      <CollectionCard image={collection} />
                      <CollectionCard image={collection} />
                      <CollectionCard image={collection} />
                      <CollectionCard image={collection} />
                      <CollectionCard image={collection} />
                      <CollectionCard image={collection} />
                      <CollectionCard image={collection} />
                    </div>
                  </>
                )}
                {tabs === 1 && (
                  <>
                    <div className="row">
                      <BuyNow
                        onOpen={onOpen}
                        // onClose={onClose}
                        key={"3"}
                        id={"3"}
                        title={"abcefg"}
                        image={nftimage2}
                        price={"1010"}
                        crypto={"ETH"}
                        royalty={"10%"}
                        description={
                          "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                        }
                        collection={"abc def ghi"}
                        userAddress
                      />

                      <BuyNow
                        onOpen={onOpen}
                        // onClose={onClose}
                        key={"3"}
                        id={"3"}
                        title={"abcefg"}
                        image={nftimage2}
                        price={"1010"}
                        crypto={"ETH"}
                        royalty={"10%"}
                        description={
                          "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                        }
                        collection={"abc def ghi"}
                        userAddress
                      />

                      <BuyNow
                        onOpen={onOpen}
                        // onClose={onClose}
                        key={"3"}
                        id={"3"}
                        title={"abcefg"}
                        image={nftimage2}
                        price={"1010"}
                        crypto={"ETH"}
                        royalty={"10%"}
                        description={
                          "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                        }
                        collection={"abc def ghi"}
                        userAddress
                      />

                      <BuyNow
                        onOpen={onOpen}
                        // onClose={onClose}
                        key={"3"}
                        id={"3"}
                        title={"abcefg"}
                        image={nftimage2}
                        price={"1010"}
                        crypto={"ETH"}
                        royalty={"10%"}
                        description={
                          "lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum"
                        }
                        collection={"abc def ghi"}
                        userAddress
                      />
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

export default OtherProfile;
