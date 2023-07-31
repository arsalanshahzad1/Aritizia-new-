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
import collectionback from "../../public/assets/images/Collection-background.png";
import collectionDp from "../../public/assets/images/collectionDp.png";
import CollectionCard from "../components/cards/CollectionCard";
import liked1 from "../../public/assets/images/liked1.png";
import liked2 from "../../public/assets/images/liked2.png";
import liked3 from "../../public/assets/images/liked3.png";
import liked4 from "../../public/assets/images/liked4.png";
import apis from "../service";
import { getAddress } from "../methods/methods";

const { ethereum } = window;
// import Web3 from "web3";
// import Web3Modal from "web3modal";

const CollectionProfile = ({ search, setSearch }) => {
  const [tabs, setTabs] = useState(0);
  const [collectionTabs, setCollectionTabs] = useState(0);
  const [FollowersTab, setFollowersTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [likedNfts, setLikedNfts] = useState([]);
  const [userAddress, setUserAddress] = useState("0x000000....");
  const [discountPrice, setDiscountPrice] = useState(0);

  const getProviderOrSigner = async (needSigner = false) => {
    console.log("getProviderOrSigner");

    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
        // params: [{ chainId: "0x7A69" }], // localhost's chainId
      });
    } catch (error) {
      // User rejected the network change or there was an error
      throw new Error("Change network to Sepolia to proceed.");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();

      return signer;
    }

    return web3Provider;
  };

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
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   postWalletAddress(accounts[0]);
  //   return accounts[0];
  // };

  // const postWalletAddress = async (address) => {
  //   console.log("postWalletAddress");
  //   if (localStorage.getItem("data")) {
  //     let storedWallet = JSON.parse(
  //       localStorage.getItem("data")
  //     ).wallet_address;
  //     storedWallet = storedWallet.toLowerCase();
  //     address = address.toLowerCase();

  //     // if (localStorage.getItem("data")) {
  //     if (storedWallet == address) {
  //       return console.log("data is avaliable");
  //     } else {
  //       const response = await apis.postWalletAddress({
  //         wallet_address: address,
  //       });
  //       localStorage.setItem("data", JSON.stringify(response.data.data));
  //       window.location.reload();
  //     }
  //   } else {
  //     const response = await apis.postWalletAddress({
  //       wallet_address: address,
  //     });
  //     localStorage.setItem("data", JSON.stringify(response.data.data));
  //     window.location.reload();
  //   }
  // };

  const getCollectionNfts = async () => {
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

    // let collectionTokens = await marketplaceContract.collection(0, 0);

    // console.log("collectionTokens", collectionTokens);

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

      const structData = await marketplaceContract._idToNFT(id);

      const fanNftData = await marketplaceContract._idToNFT2(id);

      let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

      setDiscountPrice(discountOnNFT);

      let auctionData = await marketplaceContract._idToAuction(id);

      listingType = structData.listingType;

      const price = ethers.utils.formatEther(structData.price.toString());

      let highestBid = ethers.utils.formatEther(
        auctionData.highestBid.toString()
      );

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");
          console.log("Dataa", data);

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

          ///////////////////////////
          ///////////////////////////
          // Collection k sath jo 0 compare ho rha h
          // wo database sey ayega
          ///////////////////////////
          ///////////////////////////

          if (collection == 0) {
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
                id: id,
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

              myAuctions.push(nftData);
              console.log("auction in function", myAuctions);
              setNftListAuction(myAuctions);
            }
          }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  let likedNftsFromDB = [];

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

    for (let i = 0; i < likedNftsFromDB.length; i++) {
      let id;

      id = +mintedTokens[i].tokenId.toString();

      const metaData = await nftContract.tokenURI(id);

      const structData = await marketplaceContract._idToNFT(id);

      const fanNftData = await marketplaceContract._idToNFT2(id);

      let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

      setDiscountPrice(discountOnNFT);

      let auctionData = await marketplaceContract._idToAuction(id);

      listingType = structData.listingType;

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
          console.log(nftData);
          setLikedNfts(nftData);
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  useEffect(() => {
    // connectWallet();
    getCollectionNfts();
    // getAddress();
  }, [userAddress]);

  useEffect(() => {
    getAddress();
  }, []);

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
            src={collectionback}
            alt=""
            width={"100%"}
          />
          <div className="user">
            <div className="user-wrap">
              <img
                className="user-pic"
                src={collectionDp}
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
                <div className="col-lg-4 col-md-4 col-12 followers-div">
                  <div>Following</div>
                  <div>Followers 50k+</div>
                </div>
                <div className="col-lg-4 col-md-4 col-6">
                  <h2 className="user-name">The land of the Dead by DR</h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6">
                  <SocialShare
                    style={{ fontSize: "28px", marginRight: "0px" }}
                  />
                </div>
              </div>
              <div className="row neg-margin">
                <div className="col-lg-3 col-md-3 col-12">
                  <p className="user-email user-email2">@monicaaa</p>
                  <div className="copy-url copy-url2">
                    <span>{userAddress}</span>
                    <button>Copy</button>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-12"></div>
                <div className="col-lg-3 col-md-3 col-12">
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
                              image={nft}
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
                {tabs === 1 && (
                  <>
                    <div className="row">
                      <CollectionCard image={liked1} />
                      <CollectionCard image={liked2} />
                      <CollectionCard image={liked3} />
                      <CollectionCard image={liked4} />
                      <CollectionCard image={liked1} />
                      <CollectionCard image={liked2} />
                      <CollectionCard image={liked3} />
                      <CollectionCard image={liked4} />
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

export default CollectionProfile;
