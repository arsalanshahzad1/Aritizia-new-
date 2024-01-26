import React, { useEffect, useRef, useState, useContext } from "react";
import CountUp from "react-countup";
import Header from "./Header";
import Footer from "./Footer";
import BuyNow from "../../components/cards/BuyNow";
import NewItemCard from "../../components/cards/NewItemCard";
import TableData from "../../components/cards/TableData";
import Search from "../../components/shared/Search";
import SliderImage from "../../components/shared/SliderImage";
import { ethers } from "ethers";
import axios from "axios";
import apis from "../../service";
import DummyCard from "../../components/cards/DummyCard";
import { Link } from "react-router-dom";
import Loader from "../../components/shared/Loader";
import { CiLight } from "react-icons/ci";
import { Store } from "../../Context/Store";

const LandingPage = ({ search, setSearch, loader, setLoader }) => {
  const [isVisible, setIsVisible] = useState(true);
  const targetRef = useRef(null);
  const [nftListFP, setNftListFP] = useState("");
  const [nftListAuction, setNftListAuction] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalNfts, setTotalNfts] = useState(0);
  const [totalArts, setTotalArts] = useState(0);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const {
    getProviderMarketContrat,
    getProviderNFTContrat,
    account,
    checkIsWalletConnected,
  } = useContext(Store);

  //API CALL HERE WITH FUNCTION
  // const viewAllNfts = async () => {
  //   try {
  //     const response = await apis.viewAllNfts();
  //     if (response?.data?.data?.length > 0) {
  //       getListedNfts(response?.data?.data);
  //     } else {
  //       getListedNfts();
  //     }
  //   } catch (error) {
  //     getListedNfts();
  //     console.error("Error:", error);
  //   }
  // };

  // const getListedNfts = async (allNftIds) => {
  //   let listingType;
  //   console.log(allNftIds , 'allNftIds');
    
  //   if (allNftIds?.length > 0) {
  //     for (let i = 0; i < allNftIds?.length; i++) {
  //       let id;
  //       id = allNftIds?.[i]?.token_id;
        
  //       console.log(id , 'allNftIds');

  //       const structData = await getProviderMarketContrat()?._idToNFT(id);

  //       if (
  //         structData?.firstOwner !=
  //         "0x0000000000000000000000000000000000000000" &&
  //         structData?.listed &&
  //         structData?.approve
  //       ) {
  //         const auctionData = await getProviderMarketContrat()?._idToAuction(id);

  //         let response;
  //         let nftLikes;

  //         try {
  //           response = await apis.getNFTCollectionImage(
  //             structData?.collectionId?.toString()
  //           );
  //         } catch (error) {
  //           console.log(error);
  //         }

  //         try {
  //           nftLikes = await apis.getLikeNFT(
  //             response?.data?.data?.user?.id,
  //             id
  //           );
  //         } catch (error) {
  //           console.log(error);
  //         }

  //         const collectionImages =
  //           response?.data?.data?.media?.[0]?.original_url;
  //         const user_id = response?.data?.data?.user_id;

  //         const auctionLive =
  //           await getProviderMarketContrat()?.getStatusOfAuction(id);

  //         const price = structData?.price?.toString();
  //         const metaData = await getProviderNFTContrat()?.tokenURI(id);
  //         const responses = await fetch(metaData);
  //         const metadata = await responses.json();

  //         listingType = structData?.listingType;
  //         console.log(listingType,"listingType")

  //         if (listingType === 0) {
  //           const nftData = {
  //             id: id,
  //             title: metadata?.title,
  //             image: metadata?.image,
  //             price: price,
  //             paymentMethod: structData?.paymentMethod,
  //             royalty: structData?.royalty,
  //             royaltyPrice: structData?.royaltyPrice,
  //             description: metadata?.description,
  //             collection: structData?.collectionId?.toString(),
  //             collectionImages: collectionImages,
  //             seller: structData?.seller,
  //             owner: structData?.owner,
  //             firstOwner: structData?.firstOwner,
  //             user_id: user_id,
  //             is_unapproved: structData?.approve,
  //           };

  //           setNftListFP((prev) => [...prev, nftData]);
  //         } else if (listingType === 1) {
  //           const nftData = {
  //             id: id,
  //             isLive: auctionLive,
  //             title: metadata?.title,
  //             image: metadata?.image,
  //             description: metadata?.description,
  //             basePrice: price,
  //             startTime: auctionData?.startTime?.toString(),
  //             endTime: auctionData?.endTime?.toString(),
  //             highestBidIntoETH: auctionData?.highestBidIntoETH?.toString(),
  //             highestBidIntoUSDT: auctionData?.highestBidIntoUSDT?.toString(),
  //             highestBidderAddress: auctionData?.highestBidder?.toString(),
  //             paymentMethod: structData?.paymentMethod,
  //             royaltyPrice: structData?.royaltyPrice,
  //             collection: structData?.collectionId?.toString(),
  //             collectionImages: collectionImages,
  //             seller: auctionData?.seller,
  //             owner: structData?.owner,
  //             firstOwner: structData?.firstOwner,
  //             user_id: user_id,
  //             is_unapproved: structData?.approve,
  //             nft_like: nftLikes?.data?.data?.like_count,
  //           };
  //           setNftListAuction((prev) => [...prev, nftData]);
  //         }
  //       }
  //     }
  //   }
  // };

  useEffect(() => {
    // viewAllNfts();
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

  useEffect(() => {
    checkIsWalletConnected();
  }, [account]);

  const [pageData, setPageData] = useState("");

  const viewLandingPageDetail = async () => {
    try {
      // const response = await apis.viewLandingPageDetail();
      const response = await apis.getLandingPageData();
      if (response?.data) {
        setPageData(response?.data?.data);
        setNftListFP(response?.data?.data?.all_nfts?.onsale);
        setNftListAuction(response?.data?.data?.all_nfts?.auction);
        console.log(response?.data?.data, 'total');
        if (response?.data?.data?.total_users > 999) {
          console.log();
          setTotalUsers(Math.floor(response?.data?.data?.total_users / 1000))
        } else {
          setTotalUsers(response?.data?.data?.total_users)
        }
        if (response?.data?.data?.total_nfts > 999) {
          setTotalNfts(`${Math.floor(response?.data?.data?.total_nfts / 1000)}k`)
        } else {
          setTotalNfts(response?.data?.data?.total_nfts)
        }
        if (response?.data?.data?.total_artgallery > 999) {
          setTotalArts(`${Math.floor(response?.data?.data?.total_artgallery / 1000)}k`)
        } else {
          setTotalArts(response?.data?.data?.total_artgallery)
        }

      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
    }
  };

  useEffect(() => {
    viewLandingPageDetail();
  }, []);

  return (
    <>
      {loader && <Loader />}
      <Header search={search} setSearch={setSearch} />
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
                          <h3>
                            {isVisible ? (
                              <>
                                <CountUp
                                  end={totalUsers}
                                  prefix={pageData?.total_users <= 9 ? "0" : ""}
                                />
                                {pageData?.total_users > 999 ? 'k' : ''}
                              </>
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
                              <>
                                <CountUp
                                  end={totalNfts}
                                  prefix={pageData?.total_nfts <= 9 ? "0" : ""}
                                />
                                {pageData?.total_users > 999 ? 'k' : ''}
                              </>
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
                              <>
                                <CountUp
                                  end={totalArts}
                                  prefix={pageData?.total_artgallery <= 9 ? "0" : ""}
                                />
                                {pageData?.total_users > 999 ? 'k' : ''}
                              </>
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
                    <div className="left">NFTs</div>
                    <Link to="/search">
                      <div className="right">View more</div>
                    </Link>
                  </div>
                </div>
                <div></div>
                <div className="row mx-auto">
                  {nftListFP?.length > 0 ? (
                    <>
                      {nftListFP
                        ?.slice(0, nftListFP?.length > 4 ? 4 : nftListFP?.list)
                        .map((item, index) => (
                          <>
                            <BuyNow
                              setLoader={setLoader}
                              nftId={item?.token_id}
                              title={item?.title}
                              image={item?.image_url}
                              price={item?.price}
                              description={item?.description}
                              collection={item?.collection_id}
                              collectionImages={item?.collection?.media[0]?.original_url}
                              seller={item?.seller_address}
                              owner={item?.owner_address}
                              firstOwner={item?.creator_address}
                              user_id={item?.user_id}
                              size={"col-lg-3"}
                              index={index}
                            />
                          </>
                        ))}
                      <>
                        {(nftListFP?.length != 1 && nftListFP?.length < 2) && <DummyCard />}
                        {(nftListFP?.length != 2 && nftListFP?.length < 3) && <DummyCard />}
                        {(nftListFP?.length != 3 && nftListFP?.length < 4) && <DummyCard />}
                        {(nftListFP?.length != 4 && nftListFP?.length < 5) && <DummyCard />}
                      </>
                    </>
                  ) : (
                    <>
                      <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                      <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                      <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                      <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                      <DummyCard classNam={'mb-3'} id={'hide-on-desktop'} />

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
                  <Link to="/top-collection">
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
                {console.log(nftListAuction,"nftListAuction" )}
                {nftListAuction?.length > 0 ? (
                  <>
                    <>
                      {nftListAuction?.slice(0, nftListAuction?.length > 4 ? 4 : nftListAuction?.length)
                        .map((item, index) => (
                          <>
                            <NewItemCard
                              setLoader={setLoader}
                              nftId={item?.token_id}
                              title={item?.title}
                              image={item?.image_url}
                              description={item?.description}
                              basePrice={item?.price}
                              startTime={item?.start_time}
                              endTime={item?.end_time}

                              highestBidIntoETH={item?.bidding[0]?.bidding_price_eth ? item?.bidding[0]?.bidding_price_eth : 0 }
                              highestBidIntoUSDT={item?.bidding[0]?.bidding_price_usdt ? item?.bidding[0]?.bidding_price_usdt : 0}
                              highestBidderAddress={item?.bidding[0]?.bidder ? item?.bidding[0]?.bidder : 0}
          
                              collection={item.collection_id}
                              collectionImages={item?.collection?.media[0]?.original_url}
                              seller={item?.seller_address}
                              owner={item?.owner_address}
                              firstOwner={item?.creator_address}
                              user_id={item?.user_id}
                              size={"col-lg-3"}
                              index={index}
                            />
                          </>
                        ))}
                        <>
                        {(nftListAuction?.length != 1 && nftListAuction?.length < 2) && <DummyCard />}
                        {(nftListAuction?.length != 2 && nftListAuction?.length < 3) && <DummyCard />}
                        {(nftListAuction?.length != 3 && nftListAuction?.length < 4) && <DummyCard />}
                        {(nftListAuction?.length != 4 && nftListAuction?.length < 5) && <DummyCard />}
                      </>
                    </>
                  </>
                ) : (
                  <>
                    <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                    <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                    <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                    <DummyCard classNam={'mb-5'} id={'hide-on-mobile'} />
                    <DummyCard classNam={'mb-3'} id={'hide-on-desktop'} />
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        <div></div>
        <section className="home-six-sec"></section>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default LandingPage;
