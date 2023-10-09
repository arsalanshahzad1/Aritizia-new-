import React, { useContext, useEffect, useRef, useState } from "react";
import Footer from "./landingpage/Footer";
import Header from "./landingpage/Header";
import Search from "../components/shared/Search";
import SearchNftCards from "../components/cards/SearchNftCards";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import Web3Modal from "web3modal";
import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../contractsData/ArtiziaNFT.json";
import axios from "axios";
import apis from "../service";
// import { getAddress } from "../methods/methods";
// import { connectWallet, getProviderOrSigner } from "../methods/walletManager";
import BuyNow from "../components/cards/BuyNow";
import NewItemCard from "../components/cards/NewItemCard";
import { Store } from "../Context/Store";

const SearchPage = ({ search, setSearch }) => {
  const [status, setStatus] = useState({ value: "", label: "Select" });
  const [categories, setCategories] = useState({ value: "", label: "Select" });
  const [item, setItem] = useState({ value: "all", label: "All" });
  const [sortBy, setSortBy] = useState({ value: "all", label: "All" });
  const [rating, setRating] = useState({ value: "all", label: "All" });
  const [chain, setChain] = useState({ value: "all", label: "All" });
  const [currency, setCurrency] = useState({ value: "", label: "Select" });
  const [slider, setSlider] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 }); // initial price range

  // Receiving data from URL parameters
  // const { data } = useParams();

  const [walletConnected, setWalletConnected] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [searchedNfts, setSearchedNfts] = useState([]);
  const [discountPrice, setDiscountPrice] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const [searchText, setSearchText] = useState("");
  const [nftIds, setNftIds] = useState([]);
  let searchedNft = useRef([]);
  let searchTexts = useRef();

  const {account,checkIsWalletConnected}=useContext(Store);

  useEffect(()=>{
    checkIsWalletConnected()
  },[account])

  const viewFilteredNfts = async (currency_type, listed_type, min_price, max_price, sort_by_price, count, search) => {
    try {
      const response = await apis.viewFilteredNfts(currency_type, listed_type, min_price, max_price, sort_by_price, count, search)
      console.log(response?.data, 'filter response');
      setNftIds(response?.data)
      console.log(response?.data?.data, 'fdsfdsdf')
      console.log(nftIds, 'fdsfdsdf');
      getListedNfts(response?.data?.data)
      // setPriceRange({ min: 0, max: response?.data?.highest_price })
    } catch (error) {

    }
  }

  useEffect(() => {
    viewFilteredNfts(currency.value, status.value, priceRange.min, priceRange.max, categories.value, 1, searchText)
  }, [])

  const handleSearchChange = (event) => {
    console.log(event.target.value);
    setSearchText(event.target.value);
    viewFilteredNfts(currency.value, status.value, priceRange.min, priceRange.max, categories.value, 1, event.target.value)
    setNftListFP([])
    getListedNfts(response?.data?.data)
    // searchTexts = event.target.value;
    // getSearchedNfts();
  };

  const searchNftCards = async (event) => {
    event.preventDefault()
    await viewFilteredNfts(currency.value, status.value, priceRange.min, priceRange.max, categories.value, 1, searchText)
    setNftListFP([])
  }

  useEffect(() => {
    if (searchParams.get("name") || searchParams.get("name") == "") {
      setSearchText(searchParams.get("name"));
      console.log(searchParams.get("name"), "call");
      navigate("/search");
    }
  }, []);

  // const web3ModalRef = useRef();

  // const connectWallet = async () => {
  //   // console.log("Connect wallet");
  //   try {
  //     await getProviderOrSigner();
  //     setWalletConnected(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // const getProviderOrSigner = async (needSigner = false) => {
  //   console.log("getProviderOrSigner");

  //   const provider = await web3ModalRef.current.connect();
  //   const web3Provider = new providers.Web3Provider(provider);
  //   const { chainId } = await web3Provider.getNetwork();
  //   try {
  //     await ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       // params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
  //       params: [{ chainId: "0x7A69" }], // localhost's chainId
  //     });
  //   } catch (error) {
  //     // User rejected the network change or there was an error
  //     throw new Error("Change network to Sepolia to proceed.");
  //   }

  //   if (needSigner) {
  //     const signer = web3Provider.getSigner();
  //     return signer;
  //   }
  //   return web3Provider;
  // };

  // const getSearchedNfts = async () => {
  //   const provider = await getProviderOrSigner();

  //   const marketplaceContract = new Contract(
  //     MARKETPLACE_CONTRACT_ADDRESS.address,
  //     MARKETPLACE_CONTRACT_ABI.abi,
  //     provider
  //   );
  //   // let dollarPriceOfETH = 1831;
  //   let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
  //   let priceETH = 0.00000002;
  //   let priceInETH = dollarPriceOfETH.toString() / 1e18;
  //   let oneETHInUSD = 1 / priceInETH;
  //   let priceInUSD = priceETH;
  //   priceInUSD = oneETHInUSD * priceInUSD;
  //   console.log("priceInUSD", priceInUSD);

  //   let title;
  //   let searched;
  //   let nfts = [];
  //   setSearchedNfts(nfts);

  //   //////////////////
  //   // demo variables///
  //   //////////////////

  //   // Fix front end then call those functions

  //   let listingCheck = false;
  //   let priceCheck = false;
  //   let selectedListingType = 0;
  //   // let minRange = 100;
  //   // let maxRange = 1000;

  //   for (let i = 0; i < nftListFP.length; i++) {
  //     title = nftListFP[i].title.toLowerCase();
  //     let priceOfNft = Number(nftListFP[i].price);
  //     let priceETH = priceOfNft;
  //     let priceInETH = dollarPriceOfETH.toString() / 1e18;
  //     let oneETHInUSD = 1 / priceInETH;
  //     let priceInUSD = priceETH;
  //     priceInUSD = oneETHInUSD * priceInUSD;

  //     if (searchedNfts == "") {
  //       nfts.push(nftListFP[i]);
  //       console.log("Found khaali", title);
  //     } else if (title.includes(searchTexts.toLowerCase())) {
  //       console.log("nftListFP", nftListFP[i]);
  //       console.log("price", Number(nftListFP[i].price));
  //       nfts.push(nftListFP[i]);

  //       /////////////////////////
  //       /////////////////////////
  //       /////////////////////////  Uncomment the below comments to add the logics
  //       /////////////////////////

  //       // listing block
  //       // if (selectedListingType == 100) {
  //       //   // true
  //       //   listingCheck = true;
  //       // } else if (selectedListingType == 0 && nftListFP[i].listingType == 0) {
  //       //   listingCheck = true;
  //       // } else if (selectedListingType == 1 && nftListFP[i].listingType == 1) {
  //       //   listingCheck = true;
  //       // }

  //       // if (priceInUSD >= minRange && priceInUSD <= maxRange) {
  //       //   priceCheck = true;
  //       // }

  //       // if (priceCheck && listingCheck) {
  //       //   nfts.push(nftListFP[i]);
  //       // }
  //     }

  //     // price block
  //   }

  //   setSearchedNfts(nfts);
  //   // searchedNft = nfts;
  //   // if (title.toLowerCase().includes(searchText.toLowerCase())) {
  //   //   console.log("Name of nft", title);
  // };

  const getListedNfts = async (ids) => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    // const provider = await getProvider();
    // const provider = await getProviderOrSigner();
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // let addr = await getAddress();
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

    let listingType;

    // UNCOMMENT THIS
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

    let priceInETH = dollarPriceOfETH.toString() / 1e18;

    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = 1.3;

    let demo = await marketplaceContract.owner();

    let mintedTokens = await marketplaceContract.getListedNfts();
    let myNFTs = [];
    let myAuctions = [];

    for (let i = 0; i < ids.length; i++) {
      let id;
      id = ids[i];

      let firstOwner = mintedTokens[i].firstOwner;
      if (firstOwner != "0x0000000000000000000000000000000000000000") {
        const metaData = await nftContract.tokenURI(id);
        const structData = await marketplaceContract._idToNFT(id);
        let collectionId = structData.collectionId.toString();
        const fanNftData = await marketplaceContract._idToNFT2(id);
        let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

        setDiscountPrice(discountOnNFT);
        let seller = structData?.seller;

        let auctionData = await marketplaceContract._idToAuction(id);

        let highestBid = ethers.utils.formatEther(
          auctionData.highestBid.toString()
        );

        listingType = structData?.listingType;
        let listed = structData?.listed;

        const response = await apis.getNFTCollectionImage(collectionId);
        const collectionImages = response?.data?.data?.media?.[0]?.original_url;

        const price = ethers.utils.formatEther(structData.price.toString());

        axios
          .get(metaData)
          .then((response) => {
            const meta = response.data;
            console.log("first");
            let data = JSON.stringify(meta);

            data = data.slice(2, -5);
            data = data.replace(/\\/g, "");
            data = JSON.parse(data);

            const crypto = data?.crypto;
            const title = data?.title;
            const image = data?.image;
            const royalty = data?.royalty;
            const description = data?.description;
            const collection = data?.collection;

            if (listingType === 0) {
              console.log("id",id );
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
                listingType: listingType
              };

              // myNFTs.push(nftData);
              setNftListFP((prev) => [...prev, nftData]);
            } else if (listingType === 1) {
              console.log("idddd",id, listingType );
              const nftData = {
                id: id, //
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
                listingType: listingType
              };

              // myAuctions.push(nftData);
              setNftListFP((prev) => [...prev, nftData]);
            }
          })

          .catch((error) => {
            console.error("Error fetching metadata:", error);
          });
      }
    }
    // console.log("nftListFPmain", myNFTs);
    // console.log("nftListAuctionmain", myAuctions);
  };

  // const getListedNfts = async (ids) => {
  //   console.log("in getListedNfts", ids);
  //   const provider = await getProviderOrSigner();
  //   console.log("111111");

  //   const marketplaceContract = new Contract(
  //     MARKETPLACE_CONTRACT_ADDRESS.address,
  //     MARKETPLACE_CONTRACT_ABI.abi,
  //     provider
  //   );

  //   const nftContract = new Contract(
  //     NFT_CONTRACT_ADDRESS.address,
  //     NFT_CONTRACT_ABI.abi,
  //     provider
  //   );
  //   let listingType;
  //   console.log("22222");
  //   console.log("nftIds", nftIds);

  //   // let mintedTokens = await marketplaceContract.getListedNfts();
  //   // let myNFTs = [];
  //   // let myAuctions = [];
  //   for (let i = 0; i < ids.length; i++) {
  //     console.log("4444");
  //     let id;
  //     // id = +mintedTokens[i].tokenId.toString();
  //     id = ids[i];
  //     const metaData = await nftContract.tokenURI(id);
  //     let auctionData = await marketplaceContract._idToAuction(id);
  //     const structData = await marketplaceContract._idToNFT(id);
  //     const fanNftData = await marketplaceContract._idToNFT2(id);
  //     const price = ethers.utils.formatEther(structData.price.toString());
  //     let discountOnNFT = +fanNftData.fanDiscountPercent.toString();
  //     listingType = structData.listingType;

  //     setDiscountPrice(discountOnNFT);

  //     let highestBid = ethers.utils.formatEther(
  //       auctionData.highestBid.toString()
  //     );
  //     console.log("33333");

  //     axios
  //       .get(metaData)
  //       .then((response) => {
  //         const meta = response.data;
  //         let data = JSON.stringify(meta);

  //         data = data.slice(2, -5);
  //         data = data.replace(/\\/g, "");

  //         data = JSON.parse(data);
  //         // Extracting values using dot notation
  //         // const price = data.price;
  //         // listingType = data.listingType;
  //         const crypto = data.crypto;
  //         const title = data.title;
  //         const image = data.image;
  //         const royalty = data.royalty;
  //         const description = data.description;
  //         const collection = data.collection;
  //         const paymentMethod = data.crypto;
  //         console.log("in getListedNfts");

  //         const nftData = {
  //           id: id, //
  //           title: title,
  //           image: image,
  //           price: price,
  //           crypto: crypto,
  //           royalty: royalty,
  //           description: description,
  //           collection: collection,
  //           paymentMethod: paymentMethod,
  //           listingType: listingType,
  //         };

  //         console.log("in getListedNfts", nftData);
  //         // console.log(nftData);
  //         // myNFTs.push(nftData);
  //         console.log("Setting list");

  //         // setNftListFP(myNFTs);
  //         setNftListFP((prev) => [...prev, nftData]);
  //         // console.log("myNFTs in function", myNFTs);
  //         // if (listingType === 0) {
  //         //   const nftData = {
  //         //     id: id, //
  //         //     title: title,
  //         //     image: image,
  //         //     price: price,
  //         //     crypto: crypto,
  //         //     royalty: royalty,
  //         //     description: description,
  //         //     collection: collection,
  //         //   };

  //         //   console.log(nftData);
  //         //   myNFTs.push(nftData);
  //         //   setNftListFP(myNFTs);
  //         //   console.log("myNFTs in function", myNFTs);
  //         // } else if (listingType === 1) {
  //         //   const nftData = {
  //         //     id: id, //
  //         //     title: title,
  //         //     image: image,
  //         //     price: price,
  //         //     basePrice: auctionData.basePrice.toString(),
  //         //     endTime: auctionData.endTime.toString(),
  //         //     highestBid: auctionData.highestBid.toString(),
  //         //     highestBidder: auctionData.highestBidder.toString(),
  //         //     isLive: auctionData.isLive.toString(),
  //         //     seller: auctionData.seller.toString(),
  //         //     startTime: auctionData.startTime.toString(),
  //         //   };

  //         //   myAuctions.push(nftData);
  //         //   console.log("auction in function", myAuctions);
  //         //   setNftListAuction(myAuctions);
  //         // }
  //       })

  //       .catch((error) => {
  //         console.error("Error fetching metadata:", error);
  //       });
  //   }
  // };

  // const getAddress = async () => {
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   setUserAddress(accounts[0]);
  //   localStorage.setItem("walletAddress", accounts[0]);
  //   // console.log("getAddress", accounts[0]);
  //   postWalletAddress(accounts[0]);

  // };

  // const postWalletAddress  = async (address) => {
  //   if (localStorage.getItem("data")) {
  //     return console.log("data is avaliable");
  //   } else {
  //   const response = await apis.postWalletAddress({wallet_address:  address})
  //   localStorage.setItem("data", JSON.stringify(response.data.data));
  //   window.location.reload();
  //   }
  //   // if (localStorage.getItem("data")) {
  //   //   return console.log("data is avaliable");
  //   // } else {
  //   //   const postData = {
  //   //     wallet_address: address,
  //   //   };

  //   //   axios
  //   //     .post("https://artizia-backend.pluton.ltd/api/connect-wallet", postData)
  //   //     .then((response) => {
  //   //       localStorage.setItem("data", JSON.stringify(response.data.data));
  //   //     })
  //   //     .catch((error) => {
  //   //       console.error(error);
  //   //     });
  //   // }
  // };nftListFP

  // useEffect(() => {
  //   if (!walletConnected) {
  //     web3ModalRef.current = new Web3Modal({
  //       network: "sepolia",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //   }
  // }, [walletConnected]);

  useEffect(() => { }, [nftListFP,searchedNfts,priceRange]);
  // useEffect(() => {
  //   getSearchedNfts();
  // }, [search]);

  // useEffect(() => { }, [searchedNfts]);

  // useEffect(() => {
  //   connectWallet();
  //   // getListedNfts();
  //   // getSearchedNfts();
  // }, [userAddress]);

  // TODO change by ali Monis
  // useEffect(() => {
  //   getAddress();
  // }, []);

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

  // useEffect(() => { }, [priceRange])
  // const [scroll, setScroll] = useState(true)

  // useEffect(()=>{
  //   if(scroll){
  //     window.scrollTo(0,0)
  //     setScroll(false)
  //   }
  // },[])

  return (
    <>
      <Header search={search} setSearch={setSearch} />
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
                      defaultValue={[priceRange.min, priceRange.max]}
                      onChange={handleSliderChange}
                    />
                    <div className="range-number">
                      {/* <div>0</div> */}
                      <div>
                        ${priceRange.min} - ${priceRange.max}
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
                        placeholder="Search for nft item"
                        value={searchText}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  {nftListFP.length > 0 ?
                    <>
                      {nftListFP.map((item) => {
                        if (item?.listingType === 1) {
                          return (
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
                              size={'col-lg-4'}
                            />
                          )
                        } if (item?.listingType === 0) {
                          return (
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
                              size={'col-lg-4'}
                            />
                          )
                        }


                      })}
                    </>
                    :
                    <div class="data-not-avaliable"><h2>No data avaliable</h2></div>
                  }
                </div>
                {nftListFP.length > 0 &&
                  <div style={{ textAlign: 'center' }}>
                    <button className={`controling-Nft-Load-More ${nftIds?.pagination?.remaining == 0 ? "disable" : ""}`}
                      onClick={() => { viewFilteredNfts(currency.value, status.value, priceRange.min, priceRange.max, categories.value, +nftIds?.pagination?.page + 1, searchText) }}>
                      Load More
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
                        ${priceRange.min} - ${priceRange.max}
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
