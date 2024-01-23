import React, { useCallback, useEffect, useState, useContext } from "react";
import Header from "./landingpage/Header";
import BuyNow from "../components/cards/BuyNow";
import NewItemCard from "../components/cards/NewItemCard";
import Footer from "./landingpage/Footer";;
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../service";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { Store } from "../Context/Store";
import { toast } from "react-toastify";

const DateDisplay = ({ datetime }) => {
  const parsedDate = new Date(datetime);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate, " end time now")
  return formattedDate;
};

function CollectionProfile({ search, setSearch, loader, setLoader }) {

  const location = useLocation();

  const [collectionTabs, setCollectionTabs] = useState(0);
  const searchParams = new URLSearchParams(location.search);
  const [collectionID, setCollectionID] = useState(searchParams.get("id"));
  const [collectionData, setCollectionData] = useState([]);
  const [NftLoader, setNftLoader] = useState(true)
  const [autionNftLoader, setAutionNftLoader] = useState(true)
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);

  const { account, checkIsWalletConnected, getProviderNFTContrat, getProviderMarketContrat } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const userId = userData?.id;

  const viewNftCollectionProfile = async (id) => {
    setNftLoader(true)
    setAutionNftLoader(true)
    const response = await apis.viewNftCollectionProfile(id);
    try {
      setCollectionData(response?.data?.data);
      getCollectionNfts(response?.data?.data?.nfts)
    } catch (error) {
      toast.error(error.message);
      setNftLoader(false)
      setAutionNftLoader(false)
    }
  };

  useEffect(() => {
    viewNftCollectionProfile(collectionID);
  }, []);


  const getCollectionNfts = async (nftIds) => {

    let listingType;
    const myArray = nftIds;

    for (let i = 0; i < myArray?.length; i++) {
      let id = myArray[i];


      const structData = await getProviderMarketContrat()._idToNFT(id);


      let firstOwner = structData[i]?.firstOwner;
      if (firstOwner != "0x0000000000000000000000000000000000000000" && structData?.listed && structData?.listed) {

        const metaData = await getProviderNFTContrat()?.tokenURI(id);

        let collectionId = structData?.collectionId?.toString();

        let auctionData = await getProviderMarketContrat()._idToAuction(id);

        let collectionImages;
        let user_id;
        let response;
        let nftLikes;

        try {
          response = await apis.getNFTCollectionImage(collectionId);
          collectionImages = response?.data?.data?.media?.[0]?.original_url;
          user_id = response?.data?.data?.media?.[0]?.original_url;
        } catch (error) {
          console.log(error)
        }

        try { nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id) }
        catch (error) {
          console.log(error)
        }

        const auctionLive = await getProviderMarketContrat().getStatusOfAuction(id);

        const price = structData?.price?.toString();
        const responses = await fetch(metaData)
        const metadata = await responses.json()

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
            user_id: user_id
          };
          console.log(nftData, 'nftData');
          setNftListFP((prev) => [...prev, nftData]);
          setNftLoader(false)
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
            nft_like: nftLikes?.data?.data?.like_count
          };
          setNftListAuction((prev) => [...prev, nftData]);
          setAutionNftLoader(false)
        }
        // setTimeout(() => {
        //   setMyNftLoader(false)
        // }, 10000);
      }
    }
  };


  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section">
          <img
            className="big-image"
            src="/assets/images/other-user-cover.png"
            alt=""
            width={"100%"}
          />
          <div className="user">
            <div className="user-wrap">
              <img
                className="user-pic"
                src={collectionData?.media?.[0]?.original_url}
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
                  <h2 className="user-name">{collectionData?.name}</h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto">
                </div>
              </div>

              <div className="row">
                <div className="user-profile-line-one">
                  <h2>Supply {collectionData?.total_items}</h2>
                  <h2>·</h2>
                  <h2>
                    Created{" "}
                    <DateDisplay datetime={collectionData?.created_at} />
                  </h2>
                </div>
              </div>

              <div className="row">
                <div className="user-profile-line-two">
                  <div>
                    {/* {console.log("cgeeeeecl",collectionData?.flow_price?.toString(),collectionData?.eth_volume?.toString())} */}
                    <h2>{Number(ethers.utils.formatEther(collectionData?.eth_volume?.toString() !== undefined ? collectionData?.eth_volume?.toString() : "0"))?.toFixed(5)} ETH</h2>
                    <p>Total volume</p>
                  </div>
                  <div>
                    <h2>{Number(ethers.utils.formatEther(collectionData?.flow_price?.toString() !== undefined ? collectionData?.flow_price?.toString() : "0"))?.toFixed(5)} ETH</h2>
                    <p>Floor Price</p>
                  </div>
                  <div>
                    <h2>
                      {collectionData?.coll_status == null ? (
                        <>N/A</>
                      ) : (
                        <>
                          {collectionData?.coll_status > 0 ? (
                            <>+{collectionData?.coll_status}%</>
                          ) : (
                            <>{collectionData?.coll_status}%</>
                          )}
                        </>
                      )}
                    </h2>
                    <p>Status</p>
                  </div>
                  <div>
                    <h2>{collectionData?.total_owner}</h2>
                    <p>Owners</p>
                  </div>
                </div>
              </div>
              <div className="user-profile-buy-card">
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
                        <div className="row">
                          {NftLoader ?
                            <section className="sec-loading" style={{height : '300px'}}>
                              <div className="one"></div>
                            </section>
                            :
                            nftListFP.length > 0 ?
                              nftListFP?.map((item) => (
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
                                  size={'col-lg-3'}
                                />
                              ))
                              :
                              <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                          }

                        </div>
                      </>
                    )}
                    {collectionTabs === 1 && (
                      <>
                        <div className="row">
                          {autionNftLoader ?
                            <section className="sec-loading" style={{height : '300px'}}>
                              <div className="one"></div>
                            </section>
                            :
                            nftListAuction.length > 0 ?
                              nftListAuction.map((item) => (
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
                                  size={'col-lg-3'}
                                />
                              )) : <div className="data-not-avaliable"><h2>No data avaliable</h2></div>

                          }
                        </div>
                      </>
                    )}
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {/* <ProfileDrawer isVisible={isVisible} onClose={onClose} /> */}
    </>
  );
}

export default CollectionProfile;
