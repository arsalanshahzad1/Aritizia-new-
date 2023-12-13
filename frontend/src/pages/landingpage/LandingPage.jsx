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
  // const [loader, setLoader] = useState(false)
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
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
  const viewAllNfts = async () => {
    try {
      const response = await apis.viewAllNfts();
      if (response?.data?.data?.length > 0) {
        getListedNfts(response?.data?.data);
      } else {
        getListedNfts();
      }
    } catch (error) {
      getListedNfts();
      console.error("Error:", error);
    }
  };

  const getListedNfts = async (allNftIds) => {

    let listingType;

    if (allNftIds?.length > 0) {
      for (let i = 0; i < allNftIds?.length; i++) {
        let id;
        id = allNftIds?.[i]?.id;

        const structData = await getProviderMarketContrat()._idToNFT(id);

        if (
          structData?.firstOwner !=
          "0x0000000000000000000000000000000000000000" &&
          structData?.listed &&
          structData?.approve
        ) {
          const auctionData = await getProviderMarketContrat()._idToAuction(id);

          let response;
          let nftLikes;

          try {
            response = await apis.getNFTCollectionImage(
              structData?.collectionId?.toString()
            );
          } catch (error) {
            console.log(error);
          }

          try {
            nftLikes = await apis.getLikeNFT(
              response?.data?.data?.user?.id,
              id
            );
          } catch (error) {
            console.log(error);
          }

          const collectionImages =
            response?.data?.data?.media?.[0]?.original_url;
          const user_id = response?.data?.data?.user_id;

          const auctionLive =
            await getProviderMarketContrat().getStatusOfAuction(id);

          const price = structData?.price?.toString();
          const metaData = await getProviderNFTContrat().tokenURI(id);
          const responses = await fetch(metaData);
          const metadata = await responses.json();

          listingType = structData?.listingType;

          if (listingType === 0) {
            const nftData = {
              id: id,
              title: metadata?.title,
              image: metadata?.image,
              price: price,
              paymentMethod: structData?.paymentMethod,
              royalty: structData?.royalty,
              royaltyPrice: structData?.royaltyPrice,
              description: metadata?.description,
              collection: structData?.collectionId?.toString(),
              collectionImages: collectionImages,
              seller: structData?.seller,
              owner: structData?.owner,
              firstOwner: structData?.firstOwner,
              user_id: user_id,
              is_unapproved: structData?.approve,
            };

            setNftListFP((prev) => [...prev, nftData]);
          } else if (listingType === 1) {
            const nftData = {
              id: id,
              isLive: auctionLive,
              title: metadata?.title,
              image: metadata?.image,
              description: metadata?.description,
              basePrice: price,
              startTime: auctionData?.startTime?.toString(),
              endTime: auctionData?.endTime?.toString(),
              highestBidIntoETH: auctionData?.highestBidIntoETH?.toString(),
              highestBidIntoUSDT: auctionData?.highestBidIntoUSDT?.toString(),
              highestBidderAddress: auctionData?.highestBidder?.toString(),
              paymentMethod: structData?.paymentMethod,
              royaltyPrice: structData?.royaltyPrice,
              collection: structData?.collectionId?.toString(),
              collectionImages: collectionImages,
              seller: auctionData?.seller,
              owner: structData?.owner,
              firstOwner: structData?.firstOwner,
              user_id: user_id,
              is_unapproved: structData?.approve,
              nft_like: nftLikes?.data?.data?.like_count,
            };
            setNftListAuction((prev) => [...prev, nftData]);
          }
        }
      }
    }
    // else {
    //   //Blockchain
    //   let mintedTokens = await getProviderMarketContrat().getListedNfts();
    //   for (let i = 0; i < mintedTokens?.length; i++) {
    //     let id;
    //     id = mintedTokens?.[i].tokenId?.toString();

    //     const structData = await getProviderMarketContrat()._idToNFT(id);

    //     if (
    //       structData?.firstOwner !=
    //         "0x0000000000000000000000000000000000000000" &&
    //       structData?.listed &&
    //       structData?.approve
    //     ) {
    //       const auctionData = await getProviderMarketContrat()._idToAuction(id);

    //       let response;
    //       let nftLikes;

    //       try {
    //         response = await apis.getNFTCollectionImage(
    //           structData?.collectionId?.toString()
    //         );
    //       } catch (error) {
    //         console.log(error);
    //       }

    //       try {
    //         nftLikes = await apis.getLikeNFT(
    //           response?.data?.data?.user?.id,
    //           id
    //         );
    //       } catch (error) {
    //         console.log(error);
    //       }

    //       const collectionImages =
    //         response?.data?.data?.media?.[0]?.original_url;
    //       const user_id = response?.data?.data?.user_id;

    //       const auctionLive =
    //         await getProviderMarketContrat().getStatusOfAuction(id);

    //       const price = structData?.price?.toString();
    //       const metaData = await getProviderNFTContrat().tokenURI(id);
    //       const responses = await fetch(metaData);
    //       const metadata = await responses.json();
    //       console.log("structData", structData?.seller);

    //       listingType = structData?.listingType;

    //       if (listingType === 0) {
    //         const nftData = {
    //           id: id,
    //           title: metadata?.title,
    //           image: metadata?.image,
    //           price: price,
    //           paymentMethod: structData?.paymentMethod,
    //           royalty: structData?.royalty,
    //           royaltyPrice: structData?.royaltyPrice,
    //           description: metadata?.description,
    //           collection: structData?.collectionId?.toString(),
    //           collectionImages: collectionImages,
    //           seller: structData?.seller,
    //           owner: structData?.owner,
    //           firstOwner: structData?.firstOwner,
    //           user_id: user_id,
    //           is_unapproved: structData?.approve,
    //         };
    //         setNftListFP((prev) => [...prev, nftData]);
    //       } else if (listingType === 1) {
    //         const nftData = {
    //           id: id,
    //           isLive: auctionLive,
    //           title: metadata?.title,
    //           image: metadata?.image,
    //           description: metadata?.description,
    //           basePrice: price,
    //           startTime: auctionData?.startTime?.toString(),
    //           endTime: auctionData?.endTime?.toString(),
    //           highestBidIntoETH: auctionData?.highestBidIntoETH?.toString(),
    //           highestBidIntoUSDT: auctionData?.highestBidIntoUSDT?.toString(),
    //           highestBidderAddress: auctionData?.highestBidder?.toString(),
    //           paymentMethod: structData?.paymentMethod,
    //           royaltyPrice: structData?.royaltyPrice,
    //           collection: structData?.collectionId?.toString(),
    //           collectionImages: collectionImages,
    //           seller: auctionData?.seller,
    //           owner: structData?.owner,
    //           firstOwner: structData?.firstOwner,
    //           user_id: user_id,
    //           is_unapproved: structData?.approve,
    //           nft_like: nftLikes?.data?.data?.like_count,
    //         };
    //         setNftListAuction((prev) => [...prev, nftData]);
    //       }
    //     }
    //   }
    // }

  };

  useEffect(() => {
    viewAllNfts();
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

  const [counterData, setCounterData] = useState("");
  const viewLandingPageDetail = async () => {
    try {
      const response = await apis.viewLandingPageDetail();
      if (response?.data) {
        setCounterData(response?.data?.data);
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
                                  prefix={counterData?.total_users <= 9 ? "0" : ""}
                                />
                                {counterData?.total_users > 999 ? 'k' : ''}
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
                                  prefix={counterData?.total_nfts <= 9 ? "0" : ""}
                                />
                                {counterData?.total_users > 999 ? 'k' : ''}
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
                                  prefix={counterData?.total_artgallery <= 9 ? "0" : ""}
                                />
                                {counterData?.total_users > 999 ? 'k' : ''}
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
                    <div className="left">NFT</div>
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
                              key={item?.id}
                              id={item?.id}
                              title={item?.title}
                              image={item?.image}
                              price={item?.price}
                              paymentMethod={item?.paymentMethod}
                              royalty={item?.royalty}
                              royaltyPrice={item?.royaltyPrice}
                              description={item?.description}
                              collection={item?.collection}
                              collectionImages={item?.collectionImages}
                              seller={item?.seller}
                              owner={item?.owner}
                              firstOwner={item?.firstOwner}
                              user_id={item?.user_id}
                              is_unapproved={item?.approve}
                              size={"col-lg-3"}
                            />
                          </>
                        ))}
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
                {nftListAuction?.length > 0 ? (
                  <>
                    {nftListAuction
                      ?.slice(
                        0,
                        nftListAuction?.length > 4 ? 4 : nftListAuction?.length
                      )
                      .map((item) => (
                        <>
                          <NewItemCard
                            setLoader={setLoader}
                            id={item?.id}
                            isLive={item?.isLive}
                            title={item?.title}
                            image={item?.image}
                            description={item?.description}
                            basePrice={item?.basePrice}
                            startTime={item?.startTime}
                            endTime={item?.endTime}
                            highestBidIntoETH={item?.highestBidIntoETH}
                            highestBidIntoUSDT={item?.highestBidIntoUSDT}
                            highestBidderAddress={item?.highestBidderAddress}
                            royaltyPrice={item?.royaltyPrice}
                            collection={item.collection}
                            collectionImages={item?.collectionImages}
                            seller={item?.seller}
                            owner={item?.owner}
                            firstOwner={item?.firstOwner}
                            user_id={item?.user_id}
                            nft_like={item?.nft_like}
                            is_unapproved={item?.approve}
                            size={"col-lg-3"}
                          />
                        </>
                      ))}
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
