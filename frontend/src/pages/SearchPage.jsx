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

const SearchPage = ({ search, setSearch,loader,setLoader , user}) => {
  const [status, setStatus] = useState({ value: "", label: "Select" });
  const [categories, setCategories] = useState({ value: "", label: "Select" });
  const [currency, setCurrency] = useState({ value: "", label: "Select" });
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [nftListFP, setNftListFP] = useState([]);
  const [nftLoader,setNftLoader]=useState(true);

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
    try {
      setNftListFP([]);
      const response = await apis.viewFilteredNfts(
        currency_type,
        listed_type,
        min_price,
        max_price,
        sort_by_price,
        count,
        search
      );
      setNftIds(response?.data);
      getAllListedNfts(response?.data?.data);

      // setPriceRange({ min: 0, max: response?.data?.highest_price })
    } catch (error) { }
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

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearchText(event.target.value);
    setNftListFP([]);

    viewFilteredNfts(
      currency.value,
      status.value,
      priceRange.min,
      priceRange.max * 10 ** 18,
      categories.value,
      1,
      event.target.value
    );
    // getListedNfts(response?.data?.data)
    // searchTexts = event.target.value;
    // getSearchedNfts();
  };

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

  // useEffect(() => {
  //   if (searchParams.get("name") || searchParams.get("name") == "") {
  //     setSearchText(searchParams.get("name"));
  //     console.log(searchParams.get("name"), "call");
  //     navigate("/search");
  //   }
  // }, []);

  const getAllListedNfts = async (ids) => {
    setNftListFP([]);

    let listingType;
    if (ids?.length > 0) {
      for (let i = 0; i < ids.length; i++) {
        let id;
        id = ids[i];

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
              listingType: listingType,

            };
            // setNftListFP((prev) => [...prev, nftData]);
            if (!nftListFP.map(item => item.id).includes(nftData.id)) {
              setNftListFP(prev => [...prev, nftData]);
            }

          }
          else if (listingType === 1) {
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
              seller: auctionData?.seller?.toString(),
              owner: structData?.owner,
              firstOwner: structData?.firstOwner,
              user_id: user_id,
              is_unapproved: structData?.approve,
              nft_like: nftLikes?.data?.data?.like_count,
              listingType: listingType,
            };
            // setNftListFP((prev) => [...prev, nftData]);
            if (!nftListFP.map(item => item.id).includes(nftData.id)) {
              setNftListFP(prev => [...prev, nftData]);
            }
          }
        }
        setNftLoader(false)
      }
    }
    setNftLoader(false)
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
    //         // setNftListFP((prev) => [...prev, nftData]);
    //         if (!nftListFP.some((item) => item.id === nftData.id)) {
    //           setNftListFP((prev) => [...prev, nftData]);
    //         }
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
    //         // setNftListAuction((prev) => [...prev, nftData]);
    //         if (!nftListFP.some((item) => item.id === nftData.id)) {
    //           setNftListFP((prev) => [...prev, nftData]);
    //         }
    //       }
    //     }
    //   }
    // }
  };

  // useEffect(() => { }, [nftListFP,searchedNfts,priceRange]);

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
    // update the price range when slider value changes
    setPriceRange({
      min: value[0],
      max: value[1],
    });
  };

  return (
    <>
     {loader && <Loader />}
      <Header search={search} setSearch={setSearch} user={user}/>
      <div className="search-page">
        <div className="container">
          <div className="filter-card-wrap">
            <div className="row">
              <div className="col-lg-3 hide-on-desktop-screen-app">
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
                      />
                    </div>
                  </div>
                </div>
                <div className="row">         
                {nftLoader ?
                          <section className="sec-loading">
                            <div className="one"></div>
                          </section>
                          :
                 nftListFP?.length > 0 ? (
                    <>
                      {nftListFP
                        .filter((item, index, array) => array.findIndex(t => t.id === item.id) === index)
                        .map((uniqueItem) => {
                          if (uniqueItem?.listingType === 1) {
                            return (
                              <NewItemCard
                              setLoader={setLoader}
                                id={uniqueItem?.id}
                                isLive={uniqueItem?.isLive}
                                title={uniqueItem?.title}
                                image={uniqueItem?.image}
                                description={uniqueItem?.description}
                                basePrice={uniqueItem?.basePrice}
                                startTime={uniqueItem?.startTime}
                                endTime={uniqueItem?.endTime}
                                highestBidIntoETH={uniqueItem?.highestBidIntoETH}
                                highestBidIntoUSDT={uniqueItem?.highestBidIntoUSDT}
                                highestBidderAddress={uniqueItem?.highestBidderAddress}
                                royaltyPrice={uniqueItem?.royaltyPrice}
                                collection={uniqueItem.collection}
                                collectionImages={uniqueItem?.collectionImages}
                                seller={uniqueItem?.seller}
                                owner={uniqueItem?.owner}
                                firstOwner={uniqueItem?.firstOwner}
                                user_id={uniqueItem?.user_id}
                                nft_like={uniqueItem?.nft_like}
                                is_unapproved={uniqueItem?.approve}
                                size={"col-lg-3"}
                              />
                            );
                          }
                          if (uniqueItem?.listingType === 0) {
                            return (
                              <BuyNow
                              setLoader={setLoader}
                                key={uniqueItem?.id}
                                id={uniqueItem?.id}
                                title={uniqueItem?.title}
                                image={uniqueItem?.image}
                                price={uniqueItem?.price}
                                paymentMethod={uniqueItem?.paymentMethod}
                                royalty={uniqueItem?.royalty}
                                royaltyPrice={uniqueItem?.royaltyPrice}
                                description={uniqueItem?.description}
                                collection={uniqueItem?.collection}
                                collectionImages={uniqueItem?.collectionImages}
                                seller={uniqueItem?.seller}
                                owner={uniqueItem?.owner}
                                firstOwner={uniqueItem?.firstOwner}
                                user_id={uniqueItem?.user_id}
                                is_unapproved={uniqueItem?.approve}
                                size={"col-lg-3"}
                              />
                            );
                          }
                        })}

                      {/* {nftListFP.map((item) => {

                      })} */}
                    </>
                  ) : (
                    <div class="data-not-avaliable">
                      <h2>No data avaliable</h2>
                    </div>
                  )}
                </div>
                {nftListFP.length > 0 && (
                  <div style={{ textAlign: "center" }}>
                    <button
                      className={`controling-Nft-Load-More ${nftIds?.pagination?.remaining == 0 ? "disable" : ""
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
                      Load More
                    </button>
                  </div>
                )}
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
