import React from "react";
import Header from "../landingpage/Header";
import Footer from "../landingpage/Footer";
import PageTopSection from "../../components/shared/PageTopSection";
import { useState, useEffect, useRef } from "react";
import { FileUploader } from "react-drag-drop-files";
import { AiFillTag } from "react-icons/ai";
import { BsFillClockFill } from "react-icons/bs";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinanta";
import { create as ipfsHttpClient } from "ipfs-http-client";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import Search from "../../components/shared/Search";
import duck from "../../../public/assets/images/duck.png";
import { useNavigate } from "react-router-dom";
import apis from "../../service/index";

const fileTypes = ["JPG", "PNG", "GIF"];

const Single = ({ search, setSearch }) => {
  // const [image, setImage] = useState("");
  let image = "";
  // const [price, setPrice] = useState(null);
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [minimumBid, setMinimumBid] = useState("");
  const [listingType, setListingType] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");

  var startTime = useRef(0);
  var endTime = useRef(0);
  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      price = Number(value);
      console.log("Price", price);
      setInputValue(value);
      setShowWarning(false);
    } else {
      setShowWarning(true);
    }
  };

  useEffect(() => {
    if (listingType == 1) {
      if (startingDate && endingDate && endingDate < startingDate) {
        alert("End date should be after start date");
        setEndingDate("");
      }
    }
  }, [startingDate, endingDate]);

  useEffect(() => {
    if (listingType == 1) {
      const today = new Date();
      today.setDate(today.getDate() - 1); // Subtract 1 day from today's date
      const selectedStartDate = new Date(startingDate);

      if (selectedStartDate < today) {
        alert("Start date should not be before today's date");
        setStartingDate("");
      }
    }
  }, [startingDate]);

  const web3ModalRef = useRef();

  var item = {};

  let price = useRef(0);
  const title = useRef("");
  const description = useRef("");

  let mintcounter = 0;
  let listcounter = 0;

  // Helper function to fetch a Provider/Signer instance from Metamask
  const getProviderOrSigner = async (needSigner = false) => {
    console.log("In provider");
    const provider = await web3ModalRef.current.connect();
    console.log("In provider2");
    const web3Provider = new providers.Web3Provider(provider);
    console.log("In provider3");
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 31337) {
      window.alert("Change the network to Sepolia");
      throw new Error("Change network to Sepolia");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      // console.log("getSigner");

      return signer;
    }
    // console.log("getProvider");
    return web3Provider;
  };

  // Upload image to IPFS
  const uploadToIPFS = async (event) => {
    if (typeof selectedImage !== "undefined") {
      try {
        setLoading(true);
        console.log("this is image selectedImage ", selectedImage);
        console.log("this is image item.file ", item.file);
        const resut = await uploadFileToIPFS(item.file);
        //const result = await client.add(file)
        console.log("!!!!!!!!!!!!!!!!!!", resut);
        console.log("Result.pinata", resut.pinataURL);
        // setImage(resut.pinataURL);
        image = resut.pinataURL;
        setLoading(false);
        // create nft using image IPFS and other data
        console.log("Calling the createNFT function");
        createNFT();
      } catch (error) {
        setLoading(false);
        console.log("ipfs image upload error: ", error);
      }
    }
  };

  // Upload image and data to IPFS
  const createNFT = async () => {
    if (listingType == 0) {
      let price = item.price;
      let crypto = item.crypto;
      let collection = 0; // collection id hardcoded dey hrey hn
      let title = item.title;
      let description = item.description;

      console.log("collection", collection);

      try {
        const dataInJSON = JSON.stringify({
          image,
          listingType,
          price,
          crypto,
          collection,
          title,
          description,
          royalty,
        });
        console.log("dataInJSON", dataInJSON);
        const result = await uploadJSONToIPFS(dataInJSON);
        console.log("uploadJSONToIPFS", result.pinataURL);
        mintThenList(result.pinataURL);

        //   }
      } catch (error) {
        console.log("ipfs uri upload error: ", error);
      }
    } else {
      let price = item.price;
      let crypto = item.crypto;
      let collection = 0;
      let title = item.title;
      let description = item.description;

      try {
        const dataInJSON = JSON.stringify({
          image,
          listingType,
          price,
          // crypto, uncommment this after fixing frontend
          startTime,
          endTime,
          collection,
          title,
          description,
          royalty,
        });

        console.log("dataInJSON", dataInJSON);
        const result = await uploadJSONToIPFS(dataInJSON);

        console.log("RESULT", result);
        mintThenList(result.pinataURL);
      } catch (error) {
        console.log("ipfs uri upload error: ", error);
      }
    }
  };

  const [listedEvents, setListed] = useState([]);
  const [isMinted, setIsMinted] = useState(false);

  const mintNFT = async (result, nftContract) => {
    mintcounter += 1;
    console.log("mintcounter", mintcounter);
    try {
      console.log("result", result);
      await (await nftContract.mint([result])).wait();
      console.log("NFT minting is complete!");

      let response = await nftContract.on(
        "NFTMinted",
        singleMinting ? handleNFTMintedEvent2 : null
      );

      console.log("Response of mint event", response);
    } catch (error) {
      console.error("Error while minting NFT:", error);
      throw error; // Rethrow the error to be caught in the higher level function if necessary
    }
  };
  const [getMintedTokens, setMintedTokensList] = useState();
  let marketplaceContractGlobal;
  let nftContractGlobal;
  // let listedToken;
  // let getMintedTokens = useRef(0);

  const handleNFTMintedEvent2 = async (mintedTokens) => {
    let tokenId = +mintedTokens[0].toString();
    // console.log("mintedTokens returned", tokenId);
    // console.log("mintedTokens", typeof tokenId);
    // listedToken = tokenId;
    setMintedTokensList(tokenId);
    // getMintedTokens = tokenId;
    // setIsMinted(true);
    // singleMinting? console.log("listedData", listedData): null;

    singleMinting
      ? listNFT(marketplaceContractGlobal, nftContractGlobal, tokenId)
      : null;
  };

  // async function fetchMintedTokens() {
  //   const signer = await getProviderOrSigner(true);
  //   console.log("In mintThenList");

  //   const nftContract = new Contract(
  //     NFT_CONTRACT_ADDRESS.address,
  //     NFT_CONTRACT_ABI.abi,
  //     signer
  //   );
  //   let mintedTokens = await nftContract.getMintedTokensList();
  //   let tokens = [];
  //   for (let i = 0; i < mintedTokens.length; i++) {
  //     let id;
  //     id = +mintedTokens[i].toString();
  //     console.log("id", id);
  //     tokens.push(id);
  //   }
  //   setMintedTokensList(tokens);
  // }

  async function listNFT(marketplaceContract, nftContract, listedToken) {
    console.log("in ListNFT");
    listcounter += 1;
    console.log("listcounter", listcounter);
    try {
      console.log("nftContract", nftContract);

      let mintedTokens = listedToken;

      console.log("listedToken", listedToken);
      console.log("getMintedTokens", mintedTokens);

      console.log("qqq startTime", startTime);
      console.log("startTime typeof", typeof startTime);
      console.log("qqq endTime", endTime);
      let currentTime = Date.now();
      console.log("aaa f currentTime:", currentTime);
      // let addedTime = currentTime + 300000;

      currentTime = Math.floor(currentTime / 1000);
      console.log("aaa currentTime:", currentTime);
      let addedTime = currentTime + 500000;
      console.log("aaa addedTime:", addedTime);

      await (
        await marketplaceContract.listNft(
          nftContract.address,
          [mintedTokens],
          [ethers.utils.parseEther(item.price)], // list
          royalty,
          listingType,
          // [currentTime],
          // [addedTime],
          [startTime], // list
          [endTime], // list
          1, // collection number
          crypto,
          {
            gasLimit: ethers.BigNumber.from("500000"),
          }
        )
      ).wait();
      console.log("NFT listing is complete!");
    } catch (error) {
      console.error("Error while listing NFT:", error);
      throw error; // Rethrow the error to be caught in the higher level function if necessary
    }
    console.log("singleMinting", singleMinting);

    let response = await marketplaceContract.on(
      "NFTListed",
      singleMinting ? handleNFTListedEvent2 : null
    );

    console.log("Response of list event", response);
  }

  // mint the NFT then list
  const mintThenList = async (result) => {
    console.log("In mintThenList");

    const signer = await getProviderOrSigner(true);
    console.log("In mintThenList");

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      signer
    );

    console.log("In result", result);

    // await (await nftContract.mint([result])).wait();

    // console.log("In mintThenList");

    // let mintedTokens = await nftContract.getMintedTokensList();

    // console.log("In mintThenList");
    // mintedTokens = Number(mintedTokens);

    // console.log("mintedTokens", mintedTokens);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    // console.log("PAyment method", crypto);

    // // List hn y tou list me kro
    // await (
    //   await marketplaceContract.listNft(
    //     nftContract.address,
    //     [mintedTokens],
    //     [ethers.utils.parseEther(item.price)], // list
    //     royalty,
    //     listingType,
    //     [startTime], // list
    //     [endTime], // list
    //     0, // collection number
    //     crypto
    //   )
    // ).wait();

    marketplaceContractGlobal = marketplaceContract;
    nftContractGlobal = nftContract;
    await mintNFT(result, nftContract);
    // try {
    //   // Use Promise.race to wait for either minting or listing to complete
    //   await Promise.race([
    //     await mintNFT(result, nftContract),
    //     // await listNFT(marketplaceContract, nftContract),
    //   ]);

    //   console.log("NFT minting and listing completed!");
    // } catch (error) {
    //   console.error("Error while minting and listing NFT:", error);
    // }

    // let response = await marketplaceContract.on(
    //   "NFTListed",
    //   handleNFTListedEvent
    // );

    // console.log("Response of bid even", response);
  };

  let listToPost = useRef([]);

  const addListToPost = (newValue) => {
    // console.log("newValue",newValue)
    listToPost.current.push(newValue);
  };

  const handleNFTListedEvent2 = async (
    nftContract,
    tokenId,
    seller,
    owner,
    price,
    collectionId,
    listingType
  ) => {
    if (singleMinting) {
      let listedData = {
        title: item.title,
        token_id: tokenId.toString(),
        seller: seller.toString(),
        owner: owner.toString(),
        price: ethers.utils.formatEther(price.toString()),
        collection_id: collectionId.toString(),
        listing_type: listingType.toString(),
      };
      console.log("singleMinting", singleMinting);
      console.log("collectionId", collectionId.toString());
      addListToPost(listedData);

      console.log("listedData", listedData);
      singleMinting = false;
      console.log("singleMinting", singleMinting);

      nftDataPost();
      // alert("Nft listed");
    }
  };

  const nftDataPost = async () => {
    console.log("postListNft");
    console.log("listToPost.current[0]", listToPost.current[0]);

    const response = await apis.postListNft(listToPost.current[0]);
    console.log("response", response);
    // navigate("/profile");
  };

  // useEffect(() => {
  //   getProviderOrSigner();
  //   fetchMintedTokens();
  // }, []);

  const [file, setFile] = useState(null);
  const [crypto, setCrypto] = useState({ value: 0, label: "ETH" });

  const [collection, setCollection] = useState({
    value: "USDT",
    label: "Select Collection",
    image: { duck },
  });

  const handlechange = (file) => {
    setFile(file);
  };

  const [royalty, setRoyalty] = useState(0);

  const cryptoOptions = [
    { value: "", label: "Select Crypto" },
    { value: 0, label: "ETH" },
    { value: 1, label: "USDT" },
  ];

  const [collectionOptions, setcollectionOptions] = useState([
    { value: "", label: "Select Collection", image: duck },
    { value: "usdt", label: "USDT", image: duck },
  ]);

  const defaultOption = collectionOptions[0];
  const defaultCrypto = cryptoOptions[0];

  const handleSliderChange = (value) => {
    // Update the value or perform any other actions
    console.log("Slider value:", value);
    setRoyalty(value);
    // ...
  };

  useEffect(() => {}, [price, title, description]);
  let singleMinting = false;

  function createItem(e) {
    e.preventDefault();
    price = inputValue;
    singleMinting = true;

    console.log("crypto in check", crypto);

    console.log("startTimestamp in if", startingDate);
    console.log("endTimestamp in if", endingDate);

    if (listingType == 0) {
      console.log("startTimestamp in if", startingDate);
      console.log("endTimestamp in if", endingDate);
      setStartingDate(0);
      setEndingDate(0);
      startTime = 0;
      endTime = 0;
    } else if (listingType == 1) {
      // const startDate = new Date(startingDate);
      // const endDate = new Date(endingDate);

      const startDate = new Date("2023-05-21");
      const endDate = new Date("2023-06-21");

      console.log("startDate", startDate.getTime());
      console.log("endDate", endDate.getTime());

      const startTimestamp = Math.floor(startDate.getTime() / 1000);

      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      console.log("startTimestamp qqq", startTimestamp);
      console.log("endTimestamp qqq", endTimestamp);
      setStartingDate(startTimestamp);
      setEndingDate(endTimestamp);
      startTime = startTimestamp;
      endTime = endTimestamp;
    }

    console.log("CHECK startingDate", startTime);
    console.log("CHECK endingDate", endTime);

    console.log("price", price);

    console.log("title", title.current.value);

    console.log("description", description.current.value);

    console.log("collection", collection);

    console.log("crypto", crypto);
    console.log("selectedImage", selectedImage);
    // setSelectedImage(null);
    console.log("file", file);
    let demoCollection = 0;
    item = {
      title: title.current.value,
      price: price,
      description: description.current.value,
      crypto: crypto,
      file: selectedImage,
      collection: demoCollection,
    };

    console.log("item", item);

    if (
      item.title != null &&
      item.price != null &&
      item.description != null &&
      item.crypto != null &&
      item.file != null &&
      item.collection != null
    ) {
      //  UNCOMMENT THIS
      uploadToIPFS(file);
    } else {
      window.alert("Fill all the fields to continue");
    }
  }

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "hardhat",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      // numberOFICOTokens();
    }
  }, [walletConnected]);

  const getItem = async () => {
    try {
      const provider = await getProviderOrSigner();

      const marketplaceContract = new Contract(
        MARKETPLACE_CONTRACT_ADDRESS.address,
        MARKETPLACE_CONTRACT_ABI.abi,
        provider
      );
      const _listedNfts = await marketplaceContract.getListedNfts();

      console.log("listedNfts", _listedNfts);

      for (let i = 0; i < _listedNfts.length; i++) {
        console.log("_listedNfts", _listedNfts[i]);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const [CreateCollection, setCreateCollection] = useState("");
  const [showCreateCollection, setshowCreateCollection] = useState(false);

  const AddCollection = () => {
    if (CreateCollection.length < 1 || !selectedImage2) {
      alert("Input Collection Name and image to Create");
    } else {
      setcollectionOptions((previousOptions) => [
        ...previousOptions,
        {
          value: CreateCollection.toLowerCase(),
          label: CreateCollection,
          image: selectedImage2,
        },
      ]);
      console.log(collectionOptions, "collection updated");
      hideCreateCollection();
    }
  };
  useEffect(() => {
    console.log("collection updated", collectionOptions);
  }, [collectionOptions]);

  const hideCreateCollection = () => {
    setCreateCollection("");
    setshowCreateCollection(false);
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    // setSelectedImage(URL.createObjectURL(file));
    setSelectedImage(file);
  };
  const fileInputRef = useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const [selectedImage2, setSelectedImage2] = useState(null);
  const handleInputChange2 = (e) => {
    const file = e.target.files[0];
    setSelectedImage2(file);
  };

  const [choosenCollection, setChoosenCollection] = useState("");
  useEffect(() => {
    setChoosenCollection(collection);
    console.log("choosen", choosenCollection);
  }, [collection]);

  const [collectionFinalized, setcollectionFinalized] = useState(false);

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="create-single">
        <PageTopSection title={"Create Single Collectible"} />
        <div className="create-single-section-wrap">
          <form onSubmit={createItem}>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="row">
                    {!collectionFinalized && (
                      <>
                        <div className="line-three">
                          <div className="row">
                            <div className="col-lg-12">
                              <h2>Choose collection</h2>
                              <p>
                                This is the collection where your item will
                                appear.
                              </p>
                              <Dropdown
                                options={collectionOptions}
                                onChange={(e) => {
                                  console.log("important", e);
                                  setCollection(e);
                                }}
                                value={collection.value}
                              />
                              <div
                                className="create-collection-btn"
                                onClick={() => setshowCreateCollection(true)}
                              >
                                <svg
                                  enable-background="new 0 0 50 50"
                                  height="25px"
                                  id="Layer_1"
                                  version="1.1"
                                  viewBox="0 0 50 50"
                                  width="25px"
                                  xml:space="preserve"
                                  xmlns="http://www.w3.org/2000/svg"
                                  xmlns:xlink="http://www.w3.org/1999/xlink"
                                >
                                  <rect fill="none" height="50" width="50" />
                                  <line
                                    fill="#2638CC"
                                    stroke="#2638CC"
                                    stroke-miterlimit="10"
                                    stroke-width="4"
                                    x1="9"
                                    x2="41"
                                    y1="25"
                                    y2="25"
                                  />
                                  <line
                                    fill="#2638CC"
                                    stroke="#2638CC"
                                    stroke-miterlimit="10"
                                    stroke-width="4"
                                    x1="25"
                                    x2="25"
                                    y1="9"
                                    y2="41"
                                  />
                                </svg>
                                Create Collection
                              </div>
                              {showCreateCollection && (
                                <div className="Create-collection-popup">
                                  <div className="Create-collection-popup-inner">
                                    <p>Collection Name</p>
                                    <input
                                      value={CreateCollection}
                                      onChange={(e) =>
                                        setCreateCollection(e.target.value)
                                      }
                                      type="text"
                                      placeholder="Enter collection name"
                                    />
                                    <p className="txt-2">Upload image</p>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={handleInputChange2}
                                    />

                                    <div className="popUp-btn-group">
                                      <div
                                        className="button-styling btnCC"
                                        onClick={() => AddCollection()}
                                      >
                                        Next
                                      </div>
                                      <div
                                        onClick={hideCreateCollection}
                                        className="button-styling-outline btnCC"
                                      >
                                        <div className="btnCCin">Cancel</div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              <div
                                onClick={() => setcollectionFinalized(true)}
                                className="browse-btn my-5 button-styling"
                              >
                                Next
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                    {collectionFinalized && (
                      <>
                        <div className="col-lg-8 mx-auto collectionDivPreview">
                          <div className="img-holder">
                            <img src={duck} alt="" />
                          </div>
                          {/* <div className="title">
                            Collection Name

                          </div> */}
                          <div className="title-txt">
                            {choosenCollection.value}
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="upload-file">
                            <h2>Upload file</h2>
                            <div className="browseforSingle">
                              {!selectedImage ? (
                                <p>PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                              ) : (
                                <p>
                                  Uploaded successfully, want to upload another?
                                </p>
                              )}
                              <input
                                ref={fileInputRef}
                                type="file"
                                style={{ display: "none" }}
                                onChange={handleImageUpload}
                              />
                              <div
                                onClick={handleButtonClick}
                                className="button-styling browse-btn"
                              >
                                Browse
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="line-one">
                          <div className="row">
                            <div className="col-lg-12">
                              <h2>Select method</h2>
                            </div>
                            <div className="col-lg-3 col-md-4 col-6">
                              <div
                                onClick={() => {
                                  setListingType(0);
                                }}
                                className={` create-single-card ${
                                  listingType === 0 ? "active" : ""
                                }`}
                              >
                                <AiFillTag />
                                <h3>Fixed Price</h3>
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-4 col-6">
                              <div
                                onClick={() => {
                                  setListingType(1);
                                }}
                                className={` create-single-card ${
                                  listingType === 1 ? "active" : ""
                                }`}
                              >
                                <BsFillClockFill />
                                <h3>Timed Auction</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                        {listingType === 0 ? (
                          <div className="line-two">
                            <div className="row">
                              <div className="col-lg-9 col-md-9 col-7">
                                <h2>Price</h2>
                                <input
                                  type="text"
                                  value={inputValue}
                                  onChange={handleInputChange}
                                  // type="number"
                                  // placeholder="0.00"
                                  // ref={price}
                                />
                                {showWarning && (
                                  <p style={{ color: "red" }}>
                                    Please enter a valid positive number.
                                  </p>
                                )}
                              </div>
                              <div className="col-lg-3 col-md-3 col-5">
                                <h2>Crypto</h2>
                                <Dropdown
                                  options={cryptoOptions}
                                  onChange={(e) => {
                                    setCrypto(e.value);
                                  }}
                                  value={defaultCrypto.value}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="line-two">
                              <div className="row">
                                <div className="col-lg-9">
                                  <h2>Minimum bid</h2>
                                  <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    // type="number"
                                    // placeholder="0.00"
                                    // ref={price}
                                  />
                                  {showWarning && (
                                    <p style={{ color: "red" }}>
                                      Please enter a valid positive number.
                                    </p>
                                  )}
                                </div>
                                <div className="col-lg-3 col-md-3 col-5">
                                  <h2>Crypto</h2>
                                  <Dropdown
                                    options={cryptoOptions}
                                    onChange={(e) => {
                                      setCrypto(e.value);
                                    }}
                                    value={defaultCrypto.value}
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="line-two">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-6">
                                  <h2>Starting date</h2>
                                  <input
                                    id="startingTime"
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    style={{ padding: "6px 10px 6px 15px" }}
                                    value={startingDate}
                                    onChange={(e) =>
                                      setStartingDate(e.target.value)
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                  />
                                </div>
                                <div className="col-lg-6 col-md-6 col-6">
                                  <h2>Expiration date</h2>
                                  <input
                                    id="endTime"
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    style={{ padding: "6px 10px 6px 15px" }}
                                    value={endingDate}
                                    onChange={(e) =>
                                      setEndingDate(e.target.value)
                                    }
                                    min={startingDate}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="line-four">
                          <div className="row">
                            <div className="col-lg-9">
                              <h2>Title</h2>
                              <input
                                type="text"
                                placeholder="e.g. ‘Crypto Funk"
                                // defaultValue={title.current.value}
                                ref={title}
                                // onChange={(e) => setTitle(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="line-five">
                          <div className="row">
                            <div className="col-lg-9">
                              <h2>Description</h2>
                              <input
                                type="text"
                                placeholder="e.g. ‘This is very limited item’"
                                ref={description}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="line-six">
                          <div className="row">
                            <div className="col-lg-9">
                              <h2>Royalties</h2>
                              <Slider
                                min={0}
                                max={15}
                                defaultValue={0}
                                // step={null}
                                onChange={handleSliderChange}
                                value={royalty}
                              />
                            </div>
                            <div className="col-lg-3 ">
                              <div className="royality-value">{royalty} %</div>
                            </div>
                          </div>
                        </div>
                        <div className="line-seven">
                          <div className="row">
                            <div className="col-lg-8">
                              <button type="submit" className="button-styling">
                                Create Item
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
          <button onClick={nftDataPost}>Test Post</button>
          <br></br>
          {/* <button onClick={getItem} className="button-styling">
            Get NFTS data
          </button> */}
        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default Single;
