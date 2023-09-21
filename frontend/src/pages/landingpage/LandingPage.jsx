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
import DummyCard from "../../components/cards/DummyCard";
import { Link } from "react-router-dom";
// import MetaDecorator from "../../Meta/MetaDecorator";

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
  const userAddress = userData?.wallet_address;

  async function getBalance() {
    const provider = await getProviderOrSigner();

    // Create a provider using any Ethereum node URL
    provider
      .getBalance(MARKETPLACE_CONTRACT_ADDRESS.address)
      .then((balanceWei) => {
        const balanceEther = ethers.utils.formatEther(balanceWei);
        console.log(`Balance ${balanceEther} ETH`);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  async function getProvider() {
    // Create a provider using any Ethereum node URL
    const provider = new ethers.providers.JsonRpcProvider(
      // "https://eth-mainnet.g.alchemy.com/v2/hmgNbqVFAngktTuwmAB2KceU06IJx-Fh"   // Eth mainnet
      // "http://localhost:8545"
      "https://rpc.ankr.com/eth_goerli" //Goerli
      // "https://rpc.sepolia.org"   // Sepolia
    );

    return provider;
  }

  const getListedNfts = async () => {
    // const provider = await getProvider();
    const provider = await getProviderOrSigner();
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    let addr = await getAddress();
    

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

    let listingType;
    // console.log("Active Method", listingType);
    console.log("time", Date.now());

    // let dollarPriceOfETH = 1831;

    // UNCOMMENT THIS
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

    let priceInETH = dollarPriceOfETH.toString() / 1e18;
    console.log("dollarPriceOfETH", dollarPriceOfETH);

    let demo = await marketplaceContract.owner();
    console.log("owner of MP", demo);

    let mintedTokens = await marketplaceContract.getListedNfts();
    console.log("mintedTokens", mintedTokens);
    let myNFTs = [];
    let myAuctions = [];

    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();
      console.log("YESS", id);

      let firstOwner = mintedTokens[i].firstOwner;
      if (firstOwner != "0x0000000000000000000000000000000000000000") {
        console.log("idd", id);
        const metaData = await nftContract.tokenURI(id);

        const structData = await marketplaceContract._idToNFT(id);

        console.log("metaData", metaData);
        console.log("structData", structData);
        console.log("firstownerr", mintedTokens[i].firstOwner);
        let collectionId = structData.collectionId.toString();

        const fanNftData = await marketplaceContract._idToNFT2(id);

        let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

        setDiscountPrice(discountOnNFT);
        let seller = structData.seller;

        console.log("discountOnNFT", discountOnNFT);
        console.log("discountOnNFT", typeof discountOnNFT);

        let auctionData = await marketplaceContract._idToAuction(id);
        console.log("111");

        let highestBid = ethers.utils.formatEther(
          auctionData.highestBid.toString()
        );
        console.log("2222");

        listingType = structData.listingType;
        let listed = structData.listed;
        console.log("3333");

        console.log("collectionId", collectionId);
        const response = await apis.getNFTCollectionImage(collectionId);
        console.log(response.data, "saad landing");
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;
        console.log(
          response?.data?.data?.media?.[0]?.original_url,
          "collectionImagesss"
        );

        const price = ethers.utils.formatEther(structData.price.toString());
        console.log("priceee", price);

        axios
          .get(metaData)
          .then((response) => {
            const meta = response.data;
            console.log("first");
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
                collectionImages: collectionImages,
                seller: seller,
              };

              myNFTs.push(nftData);
              // setNftListFP(myNFTs);
              setNftListFP((prev) => [...prev, nftData]);
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
                collectionImages: collectionImages,
                seller: auctionData.seller.toString(),
              };

              myAuctions.push(nftData);
              // setNftListAuction(myAuctions);
              setNftListAuction((prev) => [...prev, nftData]);
            }
          })

          .catch((error) => {
            console.error("Error fetching metadata:", error);
          });
      }
    }
  };

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

  
  const [counterData, setCounterData] = useState("");
  const viewLandingPageDetail = async () => {
    try {
      const response = await apis.viewLandingPageDetail();
      console.log(response?.data?.data, "ccccccc");
      setCounterData(response?.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    viewLandingPageDetail();
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
                          {/* <h3>{isVisible ? <CountUp end={counterData?.total_users} /> : 0}K+</h3> */}
                          <h3>
                            {isVisible ? (
                              <CountUp
                                end={counterData?.total_users}
                                prefix="0"
                              />
                            ) : (
                              0
                            )}
                          </h3>
                          <p>Total Users</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-6">
                        <div className="inner-wrap">
                          <h3>
                            {isVisible ? (
                              <CountUp
                                end={counterData?.total_nfts}
                                prefix="0"
                              />
                            ) : (
                              0
                            )}
                          </h3>
                          <p>Total NFTs</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-12">
                        <div className="inner-wrap">
                          <h3>
                            {isVisible ? (
                              <CountUp
                                end={counterData?.total_artgallery}
                                prefix="0"
                              />
                            ) : (
                              0
                            )}
                          </h3>
                          <p>Total Arts</p>
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
                    {/* <button onClick={getBalance}>Get Balance</button> */}
                    <div className="left">NFT</div>
                    <Link to="/search">
                      <div className="right">View more</div>
                    </Link>
                  </div>
                </div>
                <div>
                  {/* <button onClick={approveUSDT}>Approve</button> */}
                </div>
                {nftListFP.length > 0 ? (
                  <>
                    {nftListFP?.slice(0,nftListFP.length>4? 4 : nftListFP.list).map((item, index) => (
                      <>
                      {console.log(nftListFP,"list")}
                      {/* {console.log(item.seller, userAddress, JSON.parse(localStorage.getItem("data")).wallet_address, "items here")} */}
                      <BuyNow
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
                        collectionImages={item?.collectionImages}
                        userAddress={userAddress}
                        seller={item?.seller}
                      />
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <DummyCard />
                    <DummyCard />
                    <DummyCard />
                    <DummyCard />
                  </>
                )}
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
                  <Link to="/search">
                    <div className="right">View more markets</div>
                  </Link>
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
            <div className="row mb-5">
              <div className="col-lg-12">
                <div className="header">
                  <div className="left">Auction NFTs</div>
                  <Link to="/search">
                    <div className="right">View more</div>
                  </Link>
                  {/* <div className="right">View more markets</div> */}
                </div>
              </div>
              <div className="d-flex">
                {nftListAuction.length > 0 ? (
                  <>
                    {console.log(nftListAuction, "nft list auction")}
                    {nftListAuction.slice(0,nftListAuction.length > 4 ? 4 : nftListAuction.length ).map((item) => (
                      <>
                      {console.log(item?.seller, userAddress, "seller now")}
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
                        seller={item?.seller}
                      />
                      </>
                    ))}
                  </>
                ) : (
                  <>
                    <DummyCard />
                    <DummyCard />
                    <DummyCard />
                    <DummyCard />
                  </>
                )}
              </div>
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
