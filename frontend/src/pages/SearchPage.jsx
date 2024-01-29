import React, { useContext, useEffect, useRef, useState } from "react";
import Footer from "./landingpage/Footer";
import Header from "./landingpage/Header";
import Search from "../components/shared/Search";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import apis from "../service";
import BuyNow from "../components/cards/BuyNow";
import NewItemCard from "../components/cards/NewItemCard";
import { Store } from "../Context/Store";
import Loader from "../components/shared/Loader";

const SearchPage = ({ search, setSearch, loader, setLoader, user }) => {
  const [status, setStatus] = useState({ value: "", label: "Select" });
  const [categories, setCategories] = useState({ value: "", label: "Select" });
  const [currency, setCurrency] = useState({ value: "", label: "Select" });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [nftListFP, setNftListFP] = useState([]);

  const [auction, setAuctionNft] = useState([]);
  const [onSale, setOnSaleNft] = useState([]);

  const [nftLoader, setNftLoader] = useState(true);

  const userData = JSON.parse(localStorage.getItem("data"));
  const [searchText, setSearchText] = useState("");
  const [nftIds, setNftIds] = useState([]);
  const {
    account,
    checkIsWalletConnected,
    getProviderMarketContrat,
    getProviderNFTContrat,
  } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected();
  }, [account]);

  const viewFilteredNfts = async (
    currency_type,
    listed_type,
    min_price,
    max_price,
    sort_by_price,
    count,
    search
  ) => {
    setNftLoader(true)
    try {
      // setNftListFP([]);
      const response = await apis.viewFilteredNfts(
        currency_type,
        listed_type,
        min_price,
        max_price,
        sort_by_price,
        count,
        search
      );
    
      setNftIds(response?.data?.data);
      // console.log(response?.data?.data,"datadata");
      // setNftListFP(response?.data?.auction,response?.data?.onSlae);
      setAuctionNft(response?.data?.data?.auction);
      setOnSaleNft(response?.data?.data?.onsale);
      setNftLoader(false);

      // setNftListFP()
      // getAllListedNfts(response?.data?.data);

      // setPriceRange({ min: 0, max: response?.data?.highest_price })
    } catch (error) { 
      setNftLoader(false)
    }
  };

  useEffect(() => {
    viewFilteredNfts(
      currency.value,
      status.value,
      priceRange.min,
      priceRange.max * 10 ** 18,
      categories.value,
      1,
      searchText
    );
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (searchText.trim() !== '') {
        // Perform search when Enter key is pressed and search text is not empty
        viewFilteredNfts(
          currency.value,
          status.value,
          priceRange.min,
          priceRange.max * 10 ** 18,
          categories.value,
          1,
          searchText
        );
      } else {
        // Reload all NFTs when Enter key is pressed and search text is empty
        // You may need to adjust this part based on how you fetch the original list
        // viewFilteredNfts(
        //   currency.value,
        //   status.value,
        //   priceRange.min,
        //   priceRange.max * 10 ** 18,
        //   categories.value,
        //   1,
        //   searchText
        // );
      }
    }
  };

  // const handleSearchChange = (event) => {
  //   // console.log(event.target.value);
  //   setSearchText(event.target.value);
  //   setNftListFP([]);

  //   viewFilteredNfts(
  //     currency.value,
  //     status.value,
  //     priceRange.min,
  //     priceRange.max * 10 ** 18,
  //     categories.value,
  //     1,
  //     event.target.value
  //   );
  // };

  const searchNftCards = async (event) => {
    event.preventDefault();
    setNftListFP([]);
    await viewFilteredNfts(
      currency.value,
      status.value,
      priceRange.min,
      priceRange.max * 10 ** 18,
      categories.value,
      1,
      searchText
    );
  };

  // const getAllListedNfts = async (ids) => {
  //   console.log(ids, "ids")
  //   // setNftListFP([]);

  //   let listingType;
  //   if (ids?.length > 0) {
  //     for (let i = 0; i < ids.length; i++) {
  //       let id;
  //       id = ids[i];

  //       const structData = await getProviderMarketContrat()._idToNFT(id);
  //       console.log(structData?.listed, 'aaaassss');
  //       console.log(structData?.approve, 'aaaassss');

  //       if (structData?.firstOwner != "0x0000000000000000000000000000000000000000" && structData?.listed && structData?.approve) {
  //         const auctionData = await getProviderMarketContrat()._idToAuction(id);
  //         let response;
  //         let nftLikes;

  //         try {
  //           response = await apis.getNFTCollectionImage(
  //             structData?.collectionId?.toString()
  //           );
  //         } catch (error) {
  //           console.error(error);
  //         }

  //         try {
  //           nftLikes = await apis.getLikeNFT(
  //             response?.data?.data?.user?.id,
  //             id
  //           );
  //         } catch (error) {
  //           console.error(error);
  //         }

  //         const collectionImages =
  //           response?.data?.data?.media?.[0]?.original_url;
  //         const user_id = response?.data?.data?.user_id;

  //         const auctionLive =
  //           await getProviderMarketContrat().getStatusOfAuction(id);

  //         const price = structData?.price?.toString();
  //         const metaData = await getProviderNFTContrat().tokenURI(id);
  //         const responses = await fetch(metaData);
  //         const metadata = await responses.json();

  //         listingType = structData?.listingType;

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
  //             listingType: listingType,

  //           };
  //           if (!nftListFP.map(item => item.id).includes(nftData.id)) {
  //             setNftListFP(prev => [...prev, nftData]);
  //           }

  //         }
  //         else if (listingType === 1) {
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
  //             seller: auctionData?.seller?.toString(),
  //             owner: structData?.owner,
  //             firstOwner: structData?.firstOwner,
  //             user_id: user_id,
  //             is_unapproved: structData?.approve,
  //             nft_like: nftLikes?.data?.data?.like_count,
  //             listingType: listingType,
  //           };
  //           if (!nftListFP.map(item => item.id).includes(nftData.id)) {
  //             setNftListFP(prev => [...prev, nftData]);
  //           }
  //         }
  //       }
  //       setNftLoader(false)
  //     }
  //   }
  //   setNftLoader(false)
  // };


  const statusOptions = [
    { value: "0", label: "Fixed Price" },
    { value: "1", label: "Auction" },
  ];

  const categoriesOptions = [
    { value: "0", label: "Low to high" },
    { value: "1", label: "High to low" },
  ];
  const currencyOptions = [
    { value: "0", label: "ETH" },
    { value: "1", label: "USDT" },
  ];

  const handleSliderChange = (value) => {
    setPriceRange({
      min: value[0],
      max: value[1],
    });
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setNftListFP([]);
  };

  return (
    <>
      {loader && <Loader />}
      <Header search={search} setSearch={setSearch} user={user} />
      <div className="search-page">
        <div className="container">
          <div className="filter-card-wrap">
            <div className="row">
              <div className="col-lg-3 hide-on-desktop-screen-app">
                <div className="search-filterr search-filter">
                  <div className="l-1">
                    <img src="/assets/images/filter.png" alt="" />{" "}
                    <span>Filter</span>
                  </div>
                  <div className="l-9">
                    <p>Currency Type</p>
                    <Dropdown
                      options={currencyOptions}
                      onChange={(e) => {
                        setCurrency(e);
                      }}
                      value={currency.label}
                    />
                  </div>
                  <div className="l-2">
                    <p>Listed Type</p>
                    <Dropdown
                      options={statusOptions}
                      onChange={(e) => {
                        setStatus(e);
                      }}
                      value={status?.label}
                    />
                  </div>
                  <div className="l-3">
                    <p>Sort by price</p>
                    <Dropdown
                      options={categoriesOptions}
                      onChange={(e) => {
                        setCategories(e);
                      }}
                      value={categories.label}
                    />
                  </div>
                  <div className="l-8">
                    <p>Price range</p>
                    <Slider
                      range
                      min={0}
                      max={1000}
                      defaultValue={[priceRange.min, priceRange.max]}
                      onChange={handleSliderChange}
                    />
                    <div className="range-number">
                      {/* <div>0</div> */}
                      <div>
                        ETH {priceRange.min} - ETH {priceRange.max}
                      </div>
                      {/* <div>100000</div> */}
                    </div>
                  </div>
                  <div className="l-11">
                    <button onClick={searchNftCards}>Search</button>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12">
                <div className="row">
                  <div className="col-lg-12 mx-auto">
                    <div className="search-input">
                      <div
                        className="l-1 hide-on-mobile-screen-app"
                        id="modal_view_left"
                        data-toggle="modal"
                        data-target="#get_quote_modal"
                      >
                        <div style={{ cursor: "pointer" }}>
                          <img src="/assets/images/filter.png" alt="" />{" "}
                          <span>Filter</span>
                        </div>
                      </div>
                      <input
                       type="search"
                       placeholder="Search for NFT item"
                       value={searchText}
                       onChange={handleSearchChange}
                       onKeyPress={handleKeyPress}
                      />
                    </div>
                  </div>
                </div>
<div className="row">
  {nftLoader ? (
    <section className="sec-loading" style={{ height: '400px' }}>
      <div className="one"></div>
    </section>
  ) : (
    <>
      {auction?.length > 0 || onSale?.length > 0 ? (
        <>
          {auction?.map((item) => (
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
            nft_like={item?.nft_like}
            size={'col-lg-4'}
            />
          ))}
          {onSale?.map((item) => (
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
            size={'col-lg-4'}
            />
          ))}
        </>
      ) : (
        <div className="data-not-avaliable">
          <h2>No data available</h2>
        </div>
      )}
    </>
  )}
</div>


                {nftIds?.pagination?.remaining === 0 && !
                nftLoader ?
                  <div style={{ textAlign: "center" }}>
                    <button className={`controling-Nft-Load-More disable`}>
                      Load More
                    </button>
                  </div>
                  :
                  nftListFP.length > 0 &&
                  <div style={{ textAlign: "center" }}>
                    <button
                      className={`controling-Nft-Load-More ${(nftIds?.pagination?.remaining !== 0 && nftListFP.length % 9 == 0) ? "" : "disable"
                        }`}
                      onClick={() => {
                        viewFilteredNfts(
                          currency.value,
                          status.value,
                          priceRange.min,
                          priceRange.max * 10 ** 18,
                          categories.value,
                          +nftIds?.pagination?.page + 1,
                          searchText
                        );
                      }}
                    >
                      {nftIds?.pagination?.remaining !== 0 && nftListFP.length % 9 == 0 ?
                        'Load More'
                        :
                        'Loading NFTs'
                      }
                    </button>
                  </div>

                }
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Search search={search} setSearch={setSearch} />
      </div>

      <div
        className="modal modal_outer left_modal fade"
        id="get_quote_modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="myModalLabel2"
      >
        <div className="modal-dialog" role="document">
          <form method="post" id="get_quote_frm">
            <div className="modal-content ">
              <div className="modal-header">
                <div className="l-1">
                  <img src="/assets/images/filter.png" alt="" />{" "}
                  <span>Filter</span>
                </div>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body get_quote_view_modal_body">
                <div className="search-filter">
                  <div className="l-1">
                    <img src="/assets/images/filter.png" alt="" />{" "}
                    <span>Filter</span>
                  </div>
                  <div className="l-9">
                    <p>Currency Type</p>
                    <Dropdown
                      options={currencyOptions}
                      onChange={(e) => {
                        setCurrency(e);
                      }}
                      value={currency.label}
                    />
                  </div>
                  <div className="l-2">
                    <p>Listed Type</p>
                    <Dropdown
                      options={statusOptions}
                      onChange={(e) => {
                        setStatus(e);
                      }}
                      value={status.label}
                    />
                  </div>
                  <div className="l-3">
                    <p>Sort by price</p>
                    <Dropdown
                      options={categoriesOptions}
                      onChange={(e) => {
                        setCategories(e);
                      }}
                      value={categories.label}
                    />
                  </div>
                  <div className="l-8">
                    <p>Price range</p>
                    <Slider
                      range
                      min={0}
                      max={1000}
                      value={[priceRange.min, priceRange.max]}
                      onChange={handleSliderChange}
                    />
                    <div className="range-number">
                      {/* <div>0</div> */}
                      <div>
                        ETH {priceRange.min} - ETH {priceRange.max}
                      </div>
                      {/* <div>100000</div> */}
                    </div>
                  </div>
                  <div className="l-11">
                    <button onClick={searchNftCards}>Search</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
