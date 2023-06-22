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
import Web3Modal from "web3modal";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import axios from "axios";

const LandingPage = ({ search, setSearch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  const [walletConnected, setWalletConnected] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userAddress, setUserAddress] = useState("0x000000....");

  const web3ModalRef = useRef();

  const connectWallet = async () => {
    console.log("Connect wallet");
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Helper function to fetch a Provider/Signer instance from Metamask
  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Sepolia network, let them know and throw an error
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

  const getListedNfts = async () => {
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
    let activeMethod;

    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
    console.log("Dollar price", dollarPriceOfETH.toString());
    let priceInETH = dollarPriceOfETH.toString() / 1e18;
    console.log("priceInETH", priceInETH);

    let oneETHInUSD = 1 / priceInETH;
    console.log("oneETHInUSD", oneETHInUSD);
    let priceInUSD = 1.3;
    console.log("1.3 ETH in USD", oneETHInUSD * priceInUSD);

    let mintedTokens = await marketplaceContract.getListedNfts();
    console.log("mintedTokens", mintedTokens);
    let myNFTs = [];
    let myAuctions = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();

      const metaData = await nftContract.tokenURI(id);

      let auctionData = await marketplaceContract._idToAuction(id);
      // console.log("metadata", meta);
      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);

          console.log("Data", data);
          // Extracting values using dot notation
          const price = data.price;
          activeMethod = data.activeMethod;
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          const collection = data.collection;

          if (activeMethod === 0) {
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
          } else if (activeMethod === 1) {
            const nftData = {
              id: id, //
              title: title,
              image: image,
              price: price,
              crypto: crypto,
              paymentMethod: paymentMethod,
              basePrice: auctionData.basePrice.toString(),
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

  const getAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setUserAddress(accounts[0]);
    console.log("getAddress", accounts[0]);
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected]);

  useEffect(() => {
    connectWallet();
    getListedNfts();
    getAddress();
  }, [userAddress]);

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
                {nftListFP.map((item) => (
                  <BuyNow
                    // onOpen={onOpen}
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
                    userAddress
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
                  userAddress
                />
              ))}
            </div>
          </div>
        </section>
        <section className="home-six-sec"></section>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
