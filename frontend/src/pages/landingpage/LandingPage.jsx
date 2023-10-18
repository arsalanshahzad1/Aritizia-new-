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

const LandingPage = ({ search, setSearch }) => {
  const [isVisible, setIsVisible] = useState(true);
  const targetRef = useRef(null);
  const [loader, setLoader] = useState(false)
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const { getProviderMarketContrat, getProviderNFTContrat, account, checkIsWalletConnected } = useContext(Store)

  //API CALL HERE WITH FUNCTION
  const viewAllNfts = async () => {
    try {
      getListedNfts();
      // const response = await apis.viewAllNfts();
      // if(response?.data?.data?.length > 0)
      // {
      //   console.log(response?.data?.data,"response?.data?.dataresponse?.data?.data")
      //   getListedNfts(response?.data?.data)
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getNFTLike = async (address, id) => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.getLikeNFT(address, id);
    return response?.data?.data
    // setLikeAndViewData(response.data.data);
  };



  const getListedNfts = async (allNftIds) => {

    let listingType;

    let mintedTokens = await getProviderMarketContrat().getListedNfts();
    console.log("mintedTokens", mintedTokens)
    // let myNFTs = [];
    // let myAuctions = [];

    //Database
    // for (let i = 0; i < allNftIds?.length; i++) {
    //   let id;
    //   id = allNftIds?.[i];

    //Blockchain
    for (let i = 0; i < mintedTokens?.length; i++) {
      let id;
      id = mintedTokens?.[i].tokenId?.toString();



      let firstOwner = mintedTokens?.[i]?.firstOwner;
      const structData = await getProviderMarketContrat()._idToNFT(id);

      if (firstOwner != "0x0000000000000000000000000000000000000000" && structData?.listed) {
        console.log("firstOwner", id)

        const metaData = await getProviderNFTContrat().tokenURI(id);
        // const responses = await fetch(metaData)
        // const metadata = await responses.json()

        // const extractedData = {};

        // for (const key in metadata) {
        //   if (metadata.hasOwnProperty(key)) {
        //     const keyObject = JSON.parse(key);
        //     Object.assign(extractedData, keyObject);
        //   }
        // }

        const structData = await getProviderMarketContrat()._idToNFT(id);
        let collectionId = structData?.collectionId?.toString();
        let seller = structData?.seller;
        let auctionData = await getProviderMarketContrat()._idToAuction(id);
        let highestBid = ethers.utils.formatEther(auctionData?.highestBid?.toString());
        listingType = structData?.listingType;

        let response
        let nftLikes

        try {
          response = await apis.getNFTCollectionImage(collectionId);
          console.log(response?.data?.data, 'ressssss');
        } catch (error) {
          console.log(error)
        }

        try {
          // nftLikes = await getNFTLike(response?.data?.data?.user?.wallet_address , id);
          nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id)
          console.log(nftLikes?.data?.data?.like_count, 'ressssss');
        } catch (error) {

        }
        console.log(response?.data?.data, 'ddddddd');
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;
        const user_id = response?.data?.data?.user_id;
        const price = ethers.utils.formatEther(structData?.price?.toString());

        // axios
        // .get(metaData)
        // .then((response) => {
        //   const meta = response?.data;
        //   let data = JSON.stringify(meta);
        //   data = data?.slice(2, -5);
        //   data = data?.replace(/\\/g, "");
        //   data = JSON.parse(data);
        //   const crypto = data?.crypto;
        //   const title = data?.title;
        //   const image = data?.image;
        //   const royalty = data?.royalty;
        //   const description = data?.description;
        //   const collection = data?.collection;


        //     const nftData = {
        //       id: id, //
        //       title: title,
        //       image: image,
        //       price: price,
        //       crypto: crypto,
        //       royalty: royalty,
        //       description: description,
        //       collection: collection,
        //       seller: seller,
        //       listingType:listingType,
        //       paymentMethod: crypto,
        //       basePrice: price,
        //       startTime: auctionData?.startTime?.toString(),
        //       endTime: auctionData?.endTime?.toString(),
        //       highestBid: highestBid,
        //       highestBidder: auctionData?.highestBidder?.toString(),
        //       collectionImages: collectionImages,
        //       auctionSeller: auctionData?.seller?.toString(),
        //     };

        //     console.log(nftData, 'nftData');

        //     setNftListFP((prev) => [...prev, nftData]);

        // })
        // .catch((error) => {
        //   console.error("Error fetching metadata:", error);
        // });


        // const testingNft = async () => await axios
        // .get(metaData)
        // .then((response)=> {
        //   return response
        // })
        // console.log(await testingNft()  , 'testingNft');

        axios
          .get(metaData)
          .then((response) => {
            const meta = response?.data;
            let data = JSON.stringify(meta);
            data = data?.slice(2, -5);
            data = data?.replace(/\\/g, "");
            data = JSON.parse(data);
            console.log(data, 'testingNft');
            const crypto = data?.crypto;
            const title = data?.title;
            const replacedUrl = data?.image;
            const image = replacedUrl.replace('https://ipfs.io/ipfs/', 'https://dweb.link/ipfs/');
            console.log('ReplacedURL:', image);
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
                user_id: user_id
              };
              console.log("aaaa", nftData);
              // myNFTs.push(nftData);
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
                user_id: user_id,
                nft_like: nftLikes?.data?.data?.like_count
              };
              // myAuctions.push(nftData);
              setNftListAuction((prev) => [...prev, nftData]);
            }
          })
          .catch((error) => {
            console.error("Error fetching metadata:", error);
            axios
              .get(metaData)
              .then((response) => {
                const meta = response?.data;
                let data = JSON.stringify(meta);
                data = data?.slice(2, -5);
                data = data?.replace(/\\/g, "");
                data = JSON.parse(data);
                console.log(data, 'testingNft');
                const crypto = data?.crypto;
                const title = data?.title;
                const replacedUrl = data?.image;
                const image = replacedUrl.replace('https://ipfs.io/ipfs/', 'https://storry.tv/ipfs/');
                console.log('ReplacedURL:', image);
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
                    user_id: user_id
                  };
                  console.log("aaaa", nftData);
                  // myNFTs.push(nftData);
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
                    user_id: user_id,
                    nft_like: nftLikes?.data?.data?.like_count
                  };
                  // myAuctions.push(nftData);
                  setNftListAuction((prev) => [...prev, nftData]);
                }

              })
              .catch((error) => {
                console.error("Error fetching metadata:", error);
                axios
                  .get(metaData)
                  .then((response) => {
                    const meta = response?.data;
                    let data = JSON.stringify(meta);
                    data = data?.slice(2, -5);
                    data = data?.replace(/\\/g, "");
                    data = JSON.parse(data);
                    console.log(data, 'testingNft');
                    const crypto = data?.crypto;
                    const title = data?.title;
                    const replacedUrl = data?.image;
                    const image = replacedUrl.replace('https://ipfs.io/ipfs/', 'https://w3s.link/ipfs/');
                    console.log('ReplacedURL:', image);
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
                        user_id: user_id
                      };
                      console.log("aaaa", nftData);
                      // myNFTs.push(nftData);
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
                        user_id: user_id,
                        nft_like: nftLikes?.data?.data?.like_count
                      };
                      // myAuctions.push(nftData);
                      setNftListAuction((prev) => [...prev, nftData]);
                    }
                  })
                  .catch((error) => {

                    console.error("Error fetching metadata:", error);

                  });

              });

          });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await viewAllNfts();
    };
    fetchData();
    // viewAllNfts();
  }, []);





  // useEffect(() => {
  //   connectWallet();
  //   getProviderOrSigner();
  //   // getListedNfts();
  // }, [userAddress]);

  // useEffect(() => {
  //   getAddress();
  // }, []);

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
    checkIsWalletConnected()
  }, [account])


  const [counterData, setCounterData] = useState('')
  const viewLandingPageDetail = async () => {
    try {
      const response = await apis.viewLandingPageDetail()
      if (response?.data) {
        setCounterData(response?.data?.data)
      }
      setLoader(false)
    } catch (error) {
      setLoader(false)
    }

  }

  useEffect(() => {
    viewLandingPageDetail()
  }, [])


  console.log("firstsssss", nftListFP?.length)

  return (
    <>
      {loader && <Loader />}
      <Header
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
                          <h3>{isVisible ? <CountUp end={counterData?.total_users} prefix="0" /> : 0}</h3>
                          <p>Total Users</p>
                        </div>
                      </div>
                      <div className="col-lg-4 col-md-4 col-6">
                        <div className="inner-wrap">
                          <h3>{isVisible ? <CountUp end={counterData?.total_nfts} prefix="0" /> : 0}</h3>
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
                      {nftListFP?.slice(0, nftListFP?.length > 4 ? 4 : nftListFP?.list).map((item, index) => (
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
                            user_id={item?.user_id}
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
                    {nftListAuction?.slice(0, nftListAuction?.length > 4 ? 4 : nftListAuction?.length).map((item) => (
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
                          user_id={item?.user_id}
                          nft_like={item?.nft_like}
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
