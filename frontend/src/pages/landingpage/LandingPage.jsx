import React, { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";
import Header from "./Header";
import Footer from "./Footer";
import BuyNow from "../../components/cards/BuyNow";
import NewItemCard from "../../components/cards/NewItemCard";
import TableData from "../../components/cards/TableData";
import Search from "../../components/shared/Search";
import SliderImage from "../../components/shared/SliderImage";
import {  Contract, ethers } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
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
import Loader from "../../components/shared/Loader";
import { CiLight } from "react-icons/ci";

const LandingPage = ({ search, setSearch }) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  
  const viewAllNfts = async () => {
    try {
      const response = await apis.viewAllNfts();
      if(response?.data?.data?.length > 0)
      {
        console.log(response?.data?.data,"response?.data?.dataresponse?.data?.data")
        getListedNfts(response?.data?.data)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await viewAllNfts();
    };

    fetchData();
  }, []);


  const getListedNfts = async (allNftIds) => {
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

    let listingType;
    


    let mintedTokens = await marketplaceContract.getListedNfts();
    console.log("mintedTokens",mintedTokens)
    let myNFTs = [];
    let myAuctions = [];

    

    for (let i = 0; i < allNftIds?.length; i++) {
      let id;
      id = allNftIds?.[i];

      
      let firstOwner = mintedTokens?.[i]?.firstOwner;
      if (firstOwner != "0x0000000000000000000000000000000000000000") {
        console.log("firstOwner",id)

        const metaData = await nftContract.tokenURI(id);
        console.log(metaData,"metaDataID")
       const structData = await marketplaceContract._idToNFT(id);
        let collectionId = structData?.collectionId?.toString();

      

        let seller = structData?.seller;

        
        let auctionData = await marketplaceContract._idToAuction(id);

        let highestBid = ethers.utils.formatEther(
          auctionData.highestBid.toString()
        );

        listingType = structData?.listingType;
     
        const response = await apis.getNFTCollectionImage(collectionId);
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;
    

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
              console.log("aaaa",nftData);
              myNFTs.push(nftData);
              setNftListFP((prev) => [...prev, nftData]);
            } else if (listingType === 1) {
              const nftData = {
                id: id, 
                title: title,
                image: image,
                price: price,
                paymentMethod: crypto,
                basePrice: price,
                startTime: auctionData?.startTime?.toString(),
                endTime: auctionData?.endTime?.toString(),
                highestBid: highestBid,
                highestBidder: auctionData?.highestBidder?.toString(),
                collectionImages: collectionImages,
                seller: auctionData?.seller?.toString(),
              };
              
              console.log("aaaa",nftData);
              myAuctions.push(nftData);
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
    // getListedNfts();
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




const [counterData , setCounterData] = useState('')
  const viewLandingPageDetail = async () =>{
    try {
      const response = await apis.viewLandingPageDetail()
   if(response?.data)
   {
     setCounterData(response?.data?.data)
   }
      setLoader(false)
    } catch (error) {
      setLoader(false)
    }
    
  }

  useEffect(() =>{
    viewLandingPageDetail()
  }, [])

  const [loader, setLoader] = useState(true)

  return (
    <>
      {loader && <Loader />}
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
                          <h3>{isVisible ? <CountUp end={counterData?.total_users} prefix="0"/> : 0}</h3>
                          <p>Total Users</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-6">
                        <div className="inner-wrap">
                          <h3>{isVisible ? <CountUp end={counterData?.total_nfts} prefix="0"/> : 0}</h3>
                          <p>Total NFTs</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-12">
                        <div className="inner-wrap">
                          <h3>
                            {isVisible ? <CountUp end={counterData?.total_artgallery} prefix="0" /> : 0}
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
                   <div className="left">NFT</div>
                    <Link to="/search">
                      <div className="right">View more</div>
                    </Link>
                  </div>
                </div>
                <div>
                    </div>
                <div className="row">
                {nftListFP?.length > 0 ? (
                  <>
                    {nftListFP?.slice(0,nftListFP?.length>4? 4 : nftListFP?.list).map((item, index) => (
                      <>
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
                        size={'col-lg-3'}
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
                   </div>
              </div>
              <div className="d-flex">
                {nftListAuction?.length > 0 ? (
                  <>
                    {nftListAuction?.slice(0,nftListAuction?.length > 4 ? 4 : nftListAuction?.length ).map((item) => (
                      <>
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
                        seller={item?.seller}
                        size={'col-lg-3'}
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
            </div>
        <section className="home-six-sec"></section>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
