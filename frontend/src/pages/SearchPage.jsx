import React, { useEffect, useRef, useState } from "react";
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

const SearchPage = ({ search, setSearch }) => {
  const [status, setStatus] = useState({ value: "one", label: "New" });
  const [categories, setCategories] = useState({ value: "art", label: "Art" });
  const [item, setItem] = useState({ value: "all", label: "All" });
  const [sortBy, setSortBy] = useState({ value: "all", label: "All" });
  const [rating, setRating] = useState({ value: "all", label: "All" });
  const [chain, setChain] = useState({ value: "all", label: "All" });
  const [currency, setCurrency] = useState({ value: "eth", label: "ETH" });
  const [slider, setSlider] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 }); // initial price range

  // Receiving data from URL parameters
  // const { data } = useParams();

  const [walletConnected, setWalletConnected] = useState(false);
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  const [userAddress, setUserAddress] = useState("0x000000....");
  const [searchedNfts, setSearchedNfts] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const [name, setName] = useState("");

  let searchedNft = useRef([]);

  const [searchText, setSearchText] = useState("");

  let searchTexts = useRef();

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    searchTexts = event.target.value;
    getSearchedNfts();
  };

  useEffect(() => {
    if (searchParams.get("name") || searchParams.get("name") == "") {
      setSearchText(searchParams.get("name"));
      console.log(searchParams.get("name"), "call");
      navigate("/search");
    }
  }, []);

  const web3ModalRef = useRef();

  const connectWallet = async () => {
    // console.log("Connect wallet");
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };
  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
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

  const getSearchedNfts = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

    let priceETH = 0.00000002;
    let priceInETH = dollarPriceOfETH.toString() / 1e18;

    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = priceETH;
    priceInUSD = oneETHInUSD * priceInUSD;

    console.log("priceInUSD", priceInUSD);

    let title;
    let searched;
    let nfts = [];
    setSearchedNfts(nfts);

    //////////////////
    // demo variables///
    //////////////////

    // Fix front end then call those functions

    let listingCheck = false;
    let priceCheck = false;
    let selectedListingType = 0;
    let minRange = 100;
    let maxRange = 1000;
    console.log("searchText", searchText);

    console.log("Check1");
    console.log("nftListFP.length", nftListFP.length);

    for (let i = 0; i < nftListFP.length; i++) {
      title = nftListFP[i].title.toLowerCase();
      let priceOfNft = Number(nftListFP[i].price);
      console.log("Check2");

      let priceETH = priceOfNft;
      let priceInETH = dollarPriceOfETH.toString() / 1e18;
      console.log("Check3");

      let oneETHInUSD = 1 / priceInETH;
      let priceInUSD = priceETH;

      priceInUSD = oneETHInUSD * priceInUSD;
      // console.log("searchTextas", typeof searchTexts);
      // console.log("searchText", searchTexts.toString());
      console.log("searchText", searchText);
      // searched = searchTexts.toLowerCase();
      // console.log("Title", title);
      // console.log("searched", searched);

      if (searchedNfts == "") {
        nfts.push(nftListFP[i]);
        console.log("Found khaali", title);
      } else if (title.includes(searchTexts.toLowerCase())) {
        console.log("nftListFP", nftListFP[i]);
        console.log("price", Number(nftListFP[i].price));
        nfts.push(nftListFP[i]);

        /////////////////////////
        /////////////////////////
        /////////////////////////  Uncomment the below comments to add the logics
        /////////////////////////

        // listing block
        // if (selectedListingType == 100) {
        //   // true
        //   listingCheck = true;
        // } else if (selectedListingType == 0 && nftListFP[i].listingType == 0) {
        //   listingCheck = true;
        // } else if (selectedListingType == 1 && nftListFP[i].listingType == 1) {
        //   listingCheck = true;
        // }

        // if (priceInUSD >= minRange && priceInUSD <= maxRange) {
        //   priceCheck = true;
        // }

        // if (priceCheck && listingCheck) {
        //   nfts.push(nftListFP[i]);
        // }
      }

      // price block
    }

    setSearchedNfts(nfts);
    // searchedNft = nfts;

    // if (title.toLowerCase().includes(searchText.toLowerCase())) {
    //   console.log("Name of nft", title);
  };

  const getListedNfts = async () => {
    console.log("in getListedNfts");
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
    console.log("nftListFP.length2", nftListFP.length);

    let mintedTokens = await marketplaceContract.getListedNfts();
    let myNFTs = [];
    let myAuctions = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();

      const metaData = await nftContract.tokenURI(id);
      console.log("in getListedNfts");

      let auctionData = await marketplaceContract._idToAuction(id);

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          // Extracting values using dot notation
          const price = data.price;
          listingType = data.listingType;
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          const collection = data.collection;
          const paymentMethod = data.crypto;
          console.log("in getListedNfts");

          const nftData = {
            id: id, //
            title: title,
            image: image,
            price: price,
            crypto: crypto,
            royalty: royalty,
            description: description,
            collection: collection,
            paymentMethod: paymentMethod,
            listingType: listingType,
          };

          console.log("in getListedNfts");
          // console.log(nftData);
          myNFTs.push(nftData);
          console.log("Setting list");
          setNftListFP(myNFTs);
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
    // console.log("getAddress", accounts[0]);
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "sepolia",
        providerOptions: {},
        disableInjectedProvider: false,
      });
    }
  }, [walletConnected, searchedNfts, nftListFP]);

  useEffect(() => {
    connectWallet();
    getListedNfts();
    getAddress();
    getSearchedNfts();
  }, [userAddress]);

  const statusOptions = [
    { value: "one", label: "New" },
    { value: "two", label: "Old" },
    { value: "three", label: "Used" },
  ];
  const categoriesOptions = [
    { value: "one", label: "Art" },
    { value: "two", label: "Game" },
    { value: "three", label: "Carton" },
  ];

  const itemOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];
  const sortByOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];

  const ratingOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];
  const chainOptions = [
    { value: "one", label: "All" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
  ];
  const currencyOptions = [
    { value: "one", label: "ETH" },
    { value: "two", label: "All" },
    { value: "three", label: "All" },
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
      <Header search={search} setSearch={setSearch} />
      <div className="search-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-9 mx-auto">
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
          <div></div>
          <div className="filter-card-wrap">
            <div className="row">
              <div className="col-lg-3 hide-on-desktop-screen-app">
                <div className="search-filter">
                  <div className="l-1">
                    <img src="/assets/images/filter.png" alt="" />{" "}
                    <span>Filter</span>
                  </div>
                  <div className="l-2">
                    <p>Status</p>
                    <Dropdown
                      options={statusOptions}
                      onChange={(e) => {
                        setStatus(e);
                      }}
                      value={status.label}
                    />
                  </div>
                  <div className="l-3">
                    <p>Categories</p>
                    <Dropdown
                      options={categoriesOptions}
                      onChange={(e) => {
                        setCategories(e);
                      }}
                      value={categories.label}
                    />
                  </div>
                  <div className="l-4">
                    <p>Items</p>
                    <Dropdown
                      options={itemOptions}
                      onChange={(e) => {
                        setItem(e);
                      }}
                      value={item.label}
                    />
                  </div>
                  <div className="l-5">
                    <p>Sort byasd</p>
                    <Dropdown
                      options={sortByOptions}
                      onChange={(e) => {
                        setSortBy(e);
                      }}
                      value={sortBy.label}
                    />
                  </div>
                  <div className="l-6">
                    <p>Rating</p>
                    <Dropdown
                      options={ratingOptions}
                      onChange={(e) => {
                        setRating(e);
                      }}
                      value={rating.label}
                    />
                  </div>
                  <div className="l-7">
                    <p>Chain</p>
                    <Dropdown
                      options={chainOptions}
                      onChange={(e) => {
                        setChain(e);
                      }}
                      value={chain.label}
                    />
                  </div>
                  <div className="l-8">
                    <p>Price range</p>
                    <Slider
                      range
                      min={0}
                      max={100000}
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
                  <div className="l-9">
                    <p>Currency</p>
                    <Dropdown
                      options={currencyOptions}
                      onChange={(e) => {
                        setCurrency(e);
                      }}
                      value={currency.label}
                    />
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12">
                <div className="row">
                  {searchedNfts.map((item) => (
                    <SearchNftCards
                      key={item?.id}
                      id={item?.id}
                      title={item?.title}
                      image={item?.image}
                      price={item?.price}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
        <Search search={search} setSearch={setSearch} />
      </div>

      <div
        class="modal modal_outer left_modal fade"
        id="get_quote_modal"
        tabindex="-1"
        role="dialog"
        aria-labelledby="myModalLabel2"
      >
        <div class="modal-dialog" role="document">
          <form method="post" id="get_quote_frm">
            <div class="modal-content ">
              <div class="modal-header">
                <div className="l-1">
                  <img src="/assets/images/filter.png" alt="" />{" "}
                  <span>Filter</span>
                </div>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body get_quote_view_modal_body">
                <div className="search-filter">
                  <div className="l-2">
                    <p>Status</p>
                    <Dropdown
                      options={statusOptions}
                      onChange={(e) => {
                        setStatus(e);
                      }}
                      value={status.label}
                    />
                  </div>
                  <div className="l-3">
                    <p>Categories</p>
                    <Dropdown
                      options={categoriesOptions}
                      onChange={(e) => {
                        setCategories(e);
                      }}
                      value={categories.label}
                    />
                  </div>
                  <div className="l-4">
                    <p>Items</p>
                    <Dropdown
                      options={itemOptions}
                      onChange={(e) => {
                        setItem(e);
                      }}
                      value={item.label}
                    />
                  </div>
                  <div className="l-5">
                    <p>Sort by</p>
                    <Dropdown
                      options={sortByOptions}
                      onChange={(e) => {
                        setSortBy(e);
                      }}
                      value={sortBy.label}
                    />
                  </div>
                  <div className="l-6">
                    <p>Rating</p>
                    <Dropdown
                      options={ratingOptions}
                      onChange={(e) => {
                        setRating(e);
                      }}
                      value={rating.label}
                    />
                  </div>
                  <div className="l-7">
                    <p>Chain</p>
                    <Dropdown
                      options={chainOptions}
                      onChange={(e) => {
                        setChain(e);
                      }}
                      value={chain.label}
                    />
                  </div>
                  <div className="l-8">
                    <p>Price range</p>
                    <Slider
                      range
                      min={0}
                      max={100000}
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
                  <div className="l-9">
                    <p>Currency</p>
                    <Dropdown
                      options={currencyOptions}
                      onChange={(e) => {
                        setCurrency(e);
                      }}
                      value={currency.label}
                    />
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
