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

const fileTypes = ["JPG", "PNG", "GIF"];

const Multiple = () => {
  const [image, setImage] = useState("");
  // const [price, setPrice] = useState(0);
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [minimumBid, setMinimumBid] = useState("");
  // const [startingTime, setStartingTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  const [activeMethod, setActiveMethod] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  // const [imageList, setImageList] = useState([]);
  // const [ipfsList, setIPFSList] = useState([]);
  // const [urlList, setURLList] = useState([]);
  // start end date control logic
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);

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

  var startTime = useRef(0);
  var endTime = useRef(0);

  useEffect(() => {
    if (startingDate && endingDate && endingDate < startingDate) {
      alert("End date should be after start date");
      setEndingDate("");
    }
  }, [startingDate, endingDate]);

  let price = useRef(0);
  const title = useRef("");
  const description = useRef("");

  var item = {};

  let imageList = useRef([]);
  let ipfsList = useRef([]);
  let urlList = useRef([]);

  const [crypto, setCrypto] = useState({
    value: 0,
    label: "ETH",
  });

  const [collection, setCollection] = useState({
    value: "USDT",
    label: "Select Collection",
  });
  // const collection = useRef("");

  const cryptoOptions = [
    { value: "", label: "Select Crypto" },
    { value: 0, label: "ETH" },
    { value: 1, label: "USDT" },
  ];

  const collectionOptions = [
    { value: "", label: "Select Collection" },
    { value: "usdt", label: "USDT" },
  ];
  const defaultOption = collectionOptions[0];
  const defaultCrypto = cryptoOptions[0];

  // const item = {};
  const [loading, setLoading] = useState(false);

  const addURLInList = (newValue) => {
    urlList.push(newValue);
  };

  // let tempImageList = [];
  const addImageIPFSInList = (newValue) => {
    imageList.push(newValue);
  };

  // let tempIPFSList = [];
  const addDataIPFSInList = (newValue) => {
    ipfsList.push(newValue);
  };

  const web3ModalRef = useRef();
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
      // console.log("getSigner");

      return signer;
    }
    // console.log("getProvider");
    return web3Provider;
  };

  // Upload image to IPFS
  const uploadToIPFS = async (event) => {
    // console.log("file in uploadTOIpfs", file);
    if (typeof file !== "undefined") {
      for (let i = 0; i < file.length; i++) {
        try {
          // console.log("this is image file no", i, file[i]);
          const resut = await uploadFileToIPFS(file[i]);
          console.log("resut.pinataURL", resut.pinataURL);
          addImageIPFSInList(resut.pinataURL);
        } catch (error) {
          console.log("ipfs image upload error: ", error);
        }
      }

      // console.log("imageList", imageList);
      if (imageList.length != 0) {
        createNFT();
      } else {
        window.alert("imageList list is empty");
      }
    }
  };

  // Upload image and data to IPFS
  const createNFT = async () => {
    // console.log("CreateNFT");
    for (let i = 0; i < imageList.length; i++) {
      let image = imageList[i];
      let price = item.price;
      let crypto = 0;
      let collection = item.collection;
      let title = item.title;
      let description = item.description;
      // console.log("activeMethod", activeMethod);
      if (activeMethod == 0) {
        try {
          console.log("image", image);

          const dataInJSON = JSON.stringify({
            image,
            activeMethod,
            price,
            crypto,
            collection,
            title,
            description,
            royalty,
          });
          console.log("dataInJSON", dataInJSON);
          const result = await uploadJSONToIPFS(dataInJSON);
          addDataIPFSInList(result.pinataURL);

          console.log("result.pinataURL", result.pinataURL);
        } catch (error) {
          console.log("ipfs uri upload error: ", error);
        }
      } else {
        try {
          const dataInJSON = JSON.stringify({
            image,
            activeMethod,
            price,
            startingDate,
            endingDate,
            crypto,
            collection,
            title,
            description,
            royalty,
          });

          const result = await uploadJSONToIPFS(dataInJSON);

          addDataIPFSInList(result.pinataURL);

          console.log("RESULT.pinataURL", result.pinataURL);
        } catch (error) {
          console.log("ipfs uri upload error: ", error);
        }
      }
    }

    if (ipfsList.length != 0) {
      mintThenList();
    } else {
      window.alert("IPFS list is empty");
    }
  };

  // mint the NFT then list
  const mintThenList = async () => {
    const signer = await getProviderOrSigner(true);
    // console.log("Get the signer", signer);

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      signer
    );

    // console.log("NFT", nftContract);
    // console.log("NFT contract address", nftContract.address);
    // console.log("ipfsList", ipfsList);
    console.log("ipfsList", ipfsList);

    await (await nftContract.mint(ipfsList)).wait();

    let mintedTokens = await nftContract.getMintedTokensList();
    // console.log("mintedTokens before", mintedTokens);
    let multi = false;
    if (mintedTokens.length > 1) {
      multi = true;
      let listOfTokens = [];
      for (let i = 0; i < mintedTokens.length; i++) {
        console.log("mintedTokens[i]", mintedTokens[i].toString());
        listOfTokens.push(Number(mintedTokens[i].toString()));
      }
      mintedTokens = listOfTokens;
    } else {
      mintedTokens = Number(mintedTokens);
    }

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    // console.log("startTimestamp in if", startingDate);
    // console.log("endTimestamp in if", startingDate);

    // if (activeMethod == 0) {
    //   console.log("startTimestamp in if", startingDate);
    //   console.log("endTimestamp in if", startingDate);
    //   setStartingDate(0);
    //   setEndingDate(0);
    // } else if (activeMethod == 1) {
    //   const startDate = new Date(startingDate);
    //   const endDate = new Date(endingDate);

    //   // Convert start date to Unix timestamp (seconds)
    //   const startTimestamp = Math.floor(startDate.getTime() / 1000);

    //   // Convert end date to Unix timestamp (seconds)
    //   const endTimestamp = Math.floor(endDate.getTime() / 1000);

    //   console.log("startTimestamp in else", startTimestamp);
    //   console.log("endTimestamp in else", endTimestamp);
    // }

    // console.log("mintedTokens", mintedTokens);
    // console.log("item.price", item.price);
    // console.log("royalty", royalty);
    // console.log("activeMethod", activeMethod);
    // console.log("item.crypto", crypto);

    // UNCOMMENT this

    await (
      await marketplaceContract.listNft(
        nftContract.address,
        multi ? mintedTokens : [mintedTokens],
        ethers.utils.parseEther(item.price),
        royalty,
        activeMethod,
        startTime,
        endTime,
        crypto
      )
    ).wait();
    setLoading(false);
  };

  const [file, setFile] = useState(null);

  const handlechange = (file) => {
    setFile(file);
  };

  const [royalty, setRoyalty] = useState(0);

  const handleSliderChange = (value) => {
    // setRoyalty(value);
    if (value === 33) {
      setRoyalty(5);
    } else if (value === 66) {
      setRoyalty(10);
    } else if (value === 100) {
      setRoyalty(15);
    }
  };

  useEffect(() => {}, [
    price,
    title,
    description,
    startingDate,
    endingDate,
    ipfsList,
    imageList,
  ]);

  const createItem = (e) => {
    setLoading(true);
    e.preventDefault();
    price = inputValue;

    console.log("crypto in check", crypto);

    console.log("startTimestamp in if", startingDate);
    console.log("endTimestamp in if", endingDate);

    if (activeMethod == 0) {
      console.log("startTimestamp in if", startingDate);
      console.log("endTimestamp in if", endingDate);
      setStartingDate(0);
      setEndingDate(0);
      startTime = 0;
      endTime = 0;
    } else if (activeMethod == 1) {
      const startDate = new Date(startingDate);
      const endDate = new Date(endingDate);

      // Convert start date to Unix timestamp (seconds)
      const startTimestamp = Math.floor(startDate.getTime() / 1000);

      // Convert end date to Unix timestamp (seconds)
      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      console.log("startTimestamp in else", startTimestamp);
      console.log("endTimestamp in else", endTimestamp);
      setStartingDate(startTimestamp);
      setEndingDate(endTimestamp);
      startTime = startTimestamp;
      endTime = startTimestamp;
    }

    console.log("CHECK startingDate", startTime);
    console.log("CHECK endingDate", endTime);

    imageList = [];
    ipfsList = [];
    urlList = [];

    item = {
      title: title.current.value,
      price: price,
      description: description.current.value,
      crypto: 0,
      file: file,
      collection: collection,
    };

    // console.log("file", file);
    if (
      item.title != null &&
      item.price != null &&
      item.description != null &&
      item.crypto != null &&
      item.file != null &&
      item.collection != null
    ) {
      uploadToIPFS(file);
    } else {
      window.alert("Fill all the fields to continue");
    }
  };

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
  }, [walletConnected, price]);

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

      // setTokenIdsMinted(_tokenIds.toString());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="create-single">
        <PageTopSection title={"Create Multiple Collectible"} />
        <div className="create-single-section-wrap">
          <form onSubmit={createItem}>
            <div className="container">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="upload-file">
                        <h2>Upload file</h2>
                        <FileUploader
                          handleChange={(e) => handlechange(e)}
                          multiple
                          name="file"
                          types={fileTypes}
                          label="PNG, JPG, GIF, WEBP or MP4. Max 200mb."
                        />
                        <button
                          handleChange={(e) => handlechange(e)}
                          className="button-styling single-button"
                        >
                          Browse
                        </button>
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
                              setActiveMethod(0);
                            }}
                            className={` create-single-card ${
                              activeMethod === 0 ? "active" : ""
                            }`}
                          >
                            <AiFillTag />
                            <h3>Fixed Price</h3>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-4 col-6">
                          <div
                            onClick={() => {
                              setActiveMethod(1);
                            }}
                            className={` create-single-card ${
                              activeMethod === 1 ? "active" : ""
                            }`}
                          >
                            <BsFillClockFill />
                            <h3>Timed Auction</h3>
                          </div>
                        </div>
                      </div>
                    </div>
                    {activeMethod === 0 ? (
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
                                onChange={(e) => setEndingDate(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="line-three">
                      <div className="row">
                        <div className="col-lg-12">
                          <h2>Choose collection</h2>
                          <p>
                            This is the collection where your item will appear.
                          </p>
                          <Dropdown
                            options={collectionOptions}
                            onChange={(e) => {
                              setCollection(e.value);
                            }}
                            value={defaultOption.value}
                          />
                        </div>
                      </div>
                    </div>
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
                            defaultValue={0}
                            marks={{ 0: "0%", 33: "5%", 66: "10%", 100: "15%" }}
                            step={null}
                            onChange={handleSliderChange}
                          />
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
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* <button onClick={getItem} className="button-styling">
            Get NFTS data
          </button> */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Multiple;
