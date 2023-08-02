import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import Header from "./Header";
import Footer from "./Footer";
import BuyNow from "../../components/cards/BuyNow";
import Table from "react-bootstrap/Table";
import NewItemCard from "../../components/cards/NewItemCard";
import TableData from "../../components/cards/TableData";
import Search from "../../components/shared/Search";
import SliderImage from "../../components/shared/SliderImage";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal, { local } from "web3modal";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import axios from "axios";
import apis from "../../service";
import { getAddress } from "../../methods/methods";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";

const LandingPage = ({ search, setSearch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  // const [userAddress, setUserAddress] = useState("0x000000....");
  const [walletConnected, setWalletConnected] = useState(false);
  const [discountPrice, setDiscountPrice] = useState(0);

  const web3ModalRef = useRef();

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData.wallet_address;

  // const connectWallet = async () => {
  //   try {
  //     await getProviderOrSigner();
  //     setWalletConnected(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  async function getProvider() {
    // Create a provider using any Ethereum node URL
    const provider = new ethers.providers.JsonRpcProvider(
      // "https://eth-mainnet.g.alchemy.com/v2/hmgNbqVFAngktTuwmAB2KceU06IJx-Fh"
      // "http://localhost:8545"
      "https://rpc.sepolia.org"
    );

    return provider;
  }

  // Helper function to fetch a Provider/Signer instance from Metamask
  // const getProviderOrSigner = async (needSigner = false) => {
  //   console.log("In get provider or signer1");

  //   // console.log("In try");
  //   const provider = await web3ModalRef.current.connect();
  //   console.log("In get provider or signer12");

  //   const web3Provider = new providers.Web3Provider(provider);
  //   // console.log("In get provider or signer");
  //   console.log("In get provider or signer13");

  //   // If user is not connected to the Sepolia network, let them know and throw an error
  //   const { chainId } = await web3Provider.getNetwork();
  //   console.log("In get provider or signer14");

  //   try {
  //     await ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       // params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
  //       params: [{ chainId: "0x7A69" }], // localhost's chainId
  //     });
  //     console.log("In get provider or signer15");
  //   } catch (error) {
  //     // User rejected the network change or there was an error
  //     throw new Error("Change network to Sepolia to proceed.");
  //   }
  //   console.log("In get provider or signer16");
  //   if (needSigner) {
  //     const signer = web3Provider.getSigner();
  //     return signer;
  //   }
  //   console.log("In get provider or signer7");

  //   return web3Provider;
  // };

  const getListedNfts = async () => {
    // const provider = await getProvider();
    const provider = await getProviderOrSigner();
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    let addr = await getAddress();
    console.log("ZZZZZZ", addr);

    console.log("Provider", provider);

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

    console.log("nftContract", nftContract);
    console.log("marketplaceContract", marketplaceContract);
    // console.log("zayyan", await (await nftContract.mintedTokensList()).wait());

    let listingType;
    // console.log("Active Method", listingType);
    console.log("time", Date.now());
    // let dollarPriceOfETH = 123123;

    // UNCOMMENT THIS
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

    let priceInETH = dollarPriceOfETH.toString() / 1e18;
    console.log("dollarPriceOfETH", dollarPriceOfETH);

    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = 1.3;

    let demo = await marketplaceContract.owner();
    console.log("demo", demo);

    let mintedTokens = await marketplaceContract.getListedNfts();
    let myNFTs = [];
    let myAuctions = [];

    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();
      console.log("idd", id);
      const metaData = await nftContract.tokenURI(id);

      const structData = await marketplaceContract._idToNFT(id);

      const fanNftData = await marketplaceContract._idToNFT2(id);

      let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

      setDiscountPrice(discountOnNFT);

      console.log("discountOnNFT", discountOnNFT);
      console.log("discountOnNFT", typeof discountOnNFT);

      let auctionData = await marketplaceContract._idToAuction(id);

      let highestBid = ethers.utils.formatEther(
        auctionData.highestBid.toString()
      );

      listingType = structData.listingType;
      let listed = structData.listed;
      console.log("auctionData.owner", auctionData.owner);
      console.log("auctionData.seller", auctionData.seller);
      console.log("structData.seller", structData.seller);
      console.log("structData.owner", structData.owner);
      console.log("listed", listed);

      const price = ethers.utils.formatEther(structData.price.toString());
      console.log("2222s22");

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");
          data = JSON.parse(data);

          console.log("Dataa", data);
          // Extracting values using dot notation
          // const price = data.price;
          // listingType = data.listingType;
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          const collection = data.collection;
          // console.log("data.listingType", typeof data.listingType);

          console.log("listingType", listingType);

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

            myNFTs.push(nftData);
            setNftListFP(myNFTs);
          } else if (listingType === 1) {
            const nftData = {
              id: id, //
              title: title,
              image: image,
              price: price,
              paymentMethod: crypto,
              basePrice: price,
              startTime: auctionData.startTime.toString(),
              endTime: auctionData.endTime.toString(),
              highestBid: highestBid,
              highestBidder: auctionData.highestBidder.toString(),
              // isLive: auctionData.isLive.toString(),
              seller: auctionData.seller.toString(),
            };

            myAuctions.push(nftData);
            setNftListAuction(myAuctions);
          }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
    // console.log("nftListFPmain", myNFTs);
    // console.log("nftListAuctionmain", myAuctions);
  };

  // const getAddress = async () => {
  //   const meth = await getAddresss();
  //   console.log("methods", meth);
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   setUserAddress(accounts[0]);
  //   postWalletAddress(accounts[0]);
  // };

  // const postWalletAddress = async (address) => {
  //   console.log("postWalletAddress");
  //   if (localStorage.getItem("data")) {
  //     let storedWallet = JSON.parse(
  //       localStorage.getItem("data")
  //     ).wallet_address;
  //     // console.log("fffbb StoredWallet", storedWallet == address);
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

  // const swapUSDTForETH = async () => {
  //   const signer = await getProviderOrSigner(true);

  //   const marketplaceContract = new Contract(
  //     MARKETPLACE_CONTRACT_ADDRESS.address,
  //     MARKETPLACE_CONTRACT_ABI.abi,
  //     signer
  //   );

  //   await marketplaceContract.swapUSDTForETH(20);
  // };

  // const swapETHForUSDT = async () => {
  //   const signer = await getProviderOrSigner(true);

  //   const marketplaceContract = new Contract(
  //     MARKETPLACE_CONTRACT_ADDRESS.address,
  //     MARKETPLACE_CONTRACT_ABI.abi,
  //     signer
  //   );

  //   await marketplaceContract.swapETHForUSDT(20);
  // localStorage.removeItem("data");
  // };

  // useEffect(() => {
  //   if (!walletConnected) {
  //     web3ModalRef.current = new Web3Modal({
  //       network: "sepolia",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //   }
  // }, [walletConnected]);

  useEffect(() => {
    connectWallet();
    getProviderOrSigner();
    getListedNfts();
  }, [userAddress]);

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    const options = {
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, options);

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <Header
        connectWallet={connectWallet}
        search={search}
        setSearch={setSearch}
      />
      <div className="home-page" style={{ position: "relative" }}>
        <SliderImage />
        <section className="home-second-sec counter" ref={targetRef}>
          <div className="bg-overlay"></div>
          <div className="container">
            <div className="row">
              <div className="col-lg-9 mx-auto">
                <h2 className="title">
                  Join Our Thriving Community of Digital Artists, Buyers, and
                  Collectors
                </h2>
                <p className="para">
                  The World's first all-in-one marketplace, where AI-generated
                  Art Meets the Exciting World of Non-Fungible Tokens (NFTs).
                  Create, Showcase, Sell, and Engage with Your Audience{" "}
                </p>
                <div className="row">
                  <div className="col-lg-10 mx-auto">
                    <div className="row">
                      <div className="col-lg-4 col-md-4 col-6">
                        <div className="inner-wrap">
                          <h3>{isVisible ? <CountUp end={10} /> : 0}K+</h3>
                          <p>RARE NFT</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-6">
                        <div className="inner-wrap">
                          <h3>{isVisible ? <CountUp end={70} /> : 0}K+</h3>
                          <p>RARE NFT</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-12">
                        <div className="inner-wrap">
                          <h3>
                            {isVisible ? <CountUp end={5} prefix="0" /> : 0}K+
                          </h3>
                          <p>RARE NFT</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="home-three-sec">
          <div className="sec-three-wrap">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="header">
                    <div className="left">NFT Collection</div>
                    <div className="right">View more</div>
                  </div>
                </div>
                <div>
                  {/* <button onClick={approveUSDT}>Approve</button> */}
                </div>
                {nftListFP.map((item) => (
                  <BuyNow
                    // onOpen={onOpen}
                    // onClose={onClose}
                    key={item?.id}
                    id={item?.id}
                    title={item?.title}
                    image={item?.image}
                    price={item?.price}
                    discountPrice={item?.discountPrice}
                    crypto={item?.crypto}
                    royalty={item?.royalty}
                    description={item?.description}
                    collection={item?.collection}
                    userAddress={userAddress}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        <section className="home-four-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="header">
                  <div className="left">Top Collection</div>
                  <div className="right">View more markets</div>
                </div>
              </div>
              <div className="col-lg-12">
                <TableData />
              </div>
            </div>
          </div>
        </section>
        <section className="home-five-sec">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="header">
                  <div className="left">New Items</div>
                  {/* <div className="right">View more markets</div> */}
                </div>
              </div>
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
            </div>
          </div>
        </section>
        <div>
          {/* <button onClick={swapUSDTForETH}>swapUSDTForETH</button>
          <button onClick={swapETHForUSDT}>swapETHForUSDT</button> */}
        </div>
        <section className="home-six-sec"></section>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
