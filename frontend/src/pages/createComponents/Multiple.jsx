import React from "react";
import Header from "../landingpage/Header";
import Footer from "../landingpage/Footer";
import PageTopSection from "../../components/shared/PageTopSection";
import { useState, useEffect, useRef } from "react";
import { AiFillTag } from "react-icons/ai";
import { BsFillClockFill } from "react-icons/bs";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinanta";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import Search from "../../components/shared/Search";
import Duck from "../../../public/assets/images/duck.png";
import NftCard from "./NftCard";
import duck from "../../../public/assets/images/duck.png";
import { useNavigate } from "react-router-dom";
import apis from "../../service/index";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation } from "react-router-dom";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";

const fileTypes = ["JPG", "PNG", "GIF"];

const Multiple = ({ search, setSearch }) => {
  const [image, setImage] = useState("");
  const [listingType, setlistingType] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);
  // start end date control logic
  const [startingDate, setStartingDate] = useState("");
  const [endingDate, setEndingDate] = useState("");
  const [isMinted, setIsMinted] = useState(false);
  const [getMintedTokenss, setMintedTokensList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [royalty, setRoyalty] = useState(0);
  const [showProfileNFT, setshowProfileNFT] = useState(false);
  const [ShowMore, setShowMore] = useState(false);
  const [showCreateCollection, setshowCreateCollection] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagesNFT, setSelectedImagesNFT] = useState("");
  const [selectedUploadNFTImage, setSelectedUploadNFTImage] = useState([]);
  const [NFts, setNfts] = useState("");
  const [currentNFT, setCurrentNFT] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [choosenCollection, setChoosenCollection] = useState({});
  const [selectedImage2, setSelectedImage2] = useState(null);
  const [collectionFinalized, setcollectionFinalized] = useState(false);
  const [collectionOptions, setcollectionOptions] = useState([]);
  const [crypto, setCrypto] = useState({
    value: 0,
    label: "ETH",
  });

  const [collection, setCollection] = useState("");
  const [nftForm, setnftForm] = useState("");
  const [file, setFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showCollection, setshowcollection] = useState(false);
  const [collectionName, setCreateCollection] = useState("");
  const location = useLocation();

  useEffect(() =>{
    window.scrollTo(0,0)
  } ,[])


  console.log(location?.state?.artGallery, "asasasas");

  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("data"));
  const user_id = id?.id;
  const getCollection = async () => {
    const response = await apis.getNFTCollection();
    console.log("collection api", response);
    if (response.status) {
      setcollectionOptions("");

      for (let i = 0; i < response?.data?.data?.length; i++) {
        let type = response?.data?.data[i]?.payment_type;
        console.log(type == "eth", "eth", "TYpe", type);

        if (type == "eth") {
          setcollectionOptions((previousOptions) => [
            ...previousOptions,
            {
              collection_id: response?.data?.data[i]?.id,
              label: response?.data?.data[i]?.name,
              image: response?.data?.data[i]?.media[0]?.original_url,
              crypto: 0,
            },
          ]);
        }
        if (type == "usdt") {
          setcollectionOptions((previousOptions) => [
            ...previousOptions,
            {
              collection_id: response?.data?.data[i]?.id,
              label: response?.data?.data[i]?.name,
              image: response?.data?.data[i]?.media[0]?.original_url,
              crypto: 1,
            },
          ]);
        }
      }
    }
    console.log(collectionOptions, "collectionOptions");
  };

  const postSingleCollection = async () => {
    try {
      let cryptoType;
      console.log(user_id, collectionName, crypto, selectedImage2);
      if (collectionName.length < 1 || !selectedImage2) {
        toast.warning("Input Collection Name and image to Create", {
          position: toast.POSITION.TOP_CENTER,
        });
      } else {
        if (crypto.value === 0) {
          cryptoType = "eth";
        } else if (crypto.value === 1) {
          cryptoType = "usdt";
        }

        const sendData = new FormData();
        sendData.append("user_id", user_id);
        sendData.append("name", collectionName);
        sendData.append("payment_type", cryptoType);
        sendData.append("image", selectedImage2);
        const response = await apis.postNFTCollection(sendData);

        if (response.status) {
          getCollection();
          setshowCreateCollection(false);
        }
      }
    } catch (error) {
      toast.warning(error?.message, {
        position: toast.POSITION.TOP_CENTER,
      });
      console.log(error?.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0,0)
  }, []);
  useEffect(() => {
    getCollection();
  }, []);

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
      toast.warning(`End date should be after start date`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // alert("End date should be after start date");
      setEndingDate("");
    }
  }, [startingDate, endingDate]);

  let price = useRef(0);
  const title = useRef("");
  const description = useRef("");

  var item = {};

  let ipfsList = useRef([]);
  let urlList = useRef([]);
  let listOfMintedTokens = useRef([]);
  let ipfsImageList = useRef([]);
  let imageList = useRef([]);
  let priceList = useRef([]);
  let titleList = useRef([]);
  let descriptionList = useRef([]);
  let royaltyList = useRef([]);
  let startingDateList = useRef([]);
  let endingDateList = useRef([]);

  const cryptoOptions = [
    { value: "", label: "Select Crypto" },
    { value: 0, label: "ETH" },
    { value: 1, label: "USDT" },
  ];

  const defaultOption = collectionOptions[0];
  const defaultCrypto = cryptoOptions[0];

  // const item = {};

  const addURLInList = (newValue) => {
    urlList.push(newValue);
  };

  // let tempImageList = [];
  const addListOfMintedTokens = (newValue) => {
    console.log("newValue", newValue);
    listOfMintedTokens.push(newValue);
  };

  const addImageIPFSInList = (newValue) => {
    ipfsImageList.push(newValue);
  };
  // let tempIPFSList = [];
  const addListToPost = (newValue) => {
    // console.log("newValue",newValue)
    listToPost.current.push(newValue);
  };

  const addDataIPFSInList = (newValue) => {
    // console.log("newValue",newValue)
    ipfsList.current.push(newValue);
  };

  const web3ModalRef = useRef();
  // const getProviderOrSigner = async (needSigner = false) => {
  //   console.log("test1QWER");
  //   const provider = await web3ModalRef.current.connect();
  //   console.log("test1qq");

  //   const web3Provider = new providers.Web3Provider(provider);
  //   const { chainId } = await web3Provider.getNetwork();

  //   // if (chainId !== 31337) {
  //   //   window.alert("Change the network to Sepolia");
  //   //   throw new Error("Change network to Sepolia");
  //   // }

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
  //     // console.log("getSigner");

  //     return signer;
  //   }
  //   // console.log("getProvider");
  //   return web3Provider;
  // };

  // Upload image to IPFS
  const uploadToIPFS = async () => {
    // console.log("file in uploadTOIpfs", file);
    if (typeof imageList !== "undefined") {
      console.log("uploadToIPFS1", imageList);

      for (let i = 0; i < imageList.length; i++) {
        // try {
        //   console.log("uploadToIPFS2");

        //   console.log("this is imageList", i, imageList[i]);
        //   const result = await uploadFileToIPFS(imageList[i]);
        //   console.log("resut", result);
        //   console.log("resut.pinataURL image", result.pinataURL);

        //   addImageIPFSInList(result.pinataURL);
        //   console.log("uploadToIPFS3");
        // } catch (error) {
        //   console.log("ipfs image upload error: ", error);
        // }
        try {
          console.log("uploadToIPFS2");
          console.log("imageListtt", imageList);
          console.log("this is imageList", i, imageList[i]);
          console.log("selectedUploadNFTImage", selectedUploadNFTImage);

          const result = await uploadFileToIPFS(selectedUploadNFTImage[i]);
          console.log("resulttt", result);
          console.log("resulttt", result.pinataURL);

          // Extract the IPFS hash from the pinataURL
          const ipfsHash = result.pinataURL.split("/").pop();

          // Construct a new URL that directly points to the image
          const imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          console.log("imageUrl new final", ipfsHash);

          // Update your logic to use the imageUrl as needed
          addImageIPFSInList(imageUrl);

          console.log("uploadToIPFS3");
        } catch (error) {
          console.log("ipfs image upload error: ", error);
        }
      }

      console.log("ipfsImageList", ipfsImageList);

      createNFT();

      // if (imageList.length != 0) {
      // createNFT();
      // } else {
      //   window.alert("imageList list is empty");
      // }
    }
  };

  // Upload image and data to IPFS

  async function mintNFT(nftContract) {
    try {
      console.log("ipfsList.current", ipfsList.current);
      console.log("ipfsList.current.length", ipfsList.current.length);
      await (await nftContract.mint(ipfsList.current)).wait();
      console.log("NFT minting is complete!");

      let response = await nftContract.on(
        "NFTMinted",
        multiListing ? handleNFTMintedEvent : null
      );
      console.log("Response of mint event", response);
    } catch (error) {
      toast.error(`Error while minting NFT: ${error}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // console.error("Error while minting NFT:", error);
      throw error; // Rethrow the error to be caught in the higher level function if necessary
    }
  }

  let marketplaceContractGlobal;
  let nftContractGlobal;
  let listedddd = [];
  let listCalled = false;

  const handleNFTMintedEvent = async (mintedTokens) => {
    console.log("mintedTokens", mintedTokens);
    console.log("handleNFTMintedEvent");

    let id;
    let list = [];
    for (let i = 0; i < mintedTokens.length; i++) {
      id = +mintedTokens[i].toString();
      list.push(id);
      listedddd.push(id);
      console.log("ids", id);
      addListOfMintedTokens(id);
    }
    console.log("aaaa ipfsList", ipfsList.current.length);
    console.log("aaaa listOfListedTokens", list.length);

    if (list.length == ipfsList.current.length) {
      console.log("listcount event");
      if (!listCalled) {
        console.log("listcount event in if");
        listNFT(marketplaceContractGlobal, nftContractGlobal, list);
      }
    }

    console.log("brrr listOfMintedTokens", listOfMintedTokens.length);
    console.log("brrr imageList", imageList.length);
  };
  let listcount = 0;

  async function listNFT(marketplaceContract, nftContract, listOfTokens) {
    listcount = listcount + 1;
    console.log("listcount", listcount);
    console.log("listcountt");

    // if (isMinted) {
    try {
      console.log("listOfMintedTokensInListNFT", listOfMintedTokens);

      let mintedTokens = listOfTokens;
      console.log("listOfTokensInLISTNFT ", mintedTokens);
      console.log("listOfTokensInLISTNFT.length ", mintedTokens.length);
      console.log("minAndList 2");

      let multi = false;
      if (mintedTokens.length > 1) {
        console.log("minAndList 3");

        multi = true;
        // let listOfTokens = [];
        // for (let i = 0; i < mintedTokens.length; i++) {
        //   console.log("mintedTokens[i]", mintedTokens[i].toString());
        //   listOfTokens.push(Number(mintedTokens[i].toString()));
        // }
        mintedTokens = listOfTokens;
        console.log("listOfTokensInIFFF", listOfTokens);
      } else {
        mintedTokens = Number(mintedTokens);
      }

      // // UNCOMMENT this
      let ethParsedList = [];

      console.log("collection ", collection);
      console.log("collection .value", collection.collection_id);
      console.log("collection .crypto", collection.crypto);

      for (let i = 0; i < priceList.length; i++) {
        console.log("Yahoo4");
        console.log("priceList[i]", priceList[i]);
        let ethPrice = ethers.utils
          .parseEther(priceList[i].toString())
          .toString();
        console.log("ethPrice", ethPrice);
        ethParsedList.push(ethPrice);
      }
      if (!listCalled) {
        console.log("yeet collection", collection);
        console.log(
          "yeet",
          nftContract.address,
          multi ? mintedTokens : [mintedTokens],
          ethParsedList,
          royaltyList,
          listingType,
          startingDateList,
          endingDateList,
          // [startingDateList[0] + 5 * 60 * 1000],
          collection.collection_id, // collection number
          collection.crypto
        );
        console.log("zzz listingType", listingType);
        console.log("zzz startingDateList", startingDateList);
        console.log("zzz endingDateList", endingDateList);
        console.log("zzz collection.crypto", collection.crypto);

        console.log("listcount actually listing", mintedTokens);
        await (
          await marketplaceContract.listNft(
            nftContract.address,
            multi ? mintedTokens : [mintedTokens],
            ethParsedList,
            royaltyList,
            listingType,
            startingDateList,
            endingDateList,
            // [startingDateList[0] + 5 * 60 * 1000],
            collection.collection_id, // collection number
            collection.crypto
          )
        ).wait();
      }
      listCalled = true;
      setLoading(false);
      console.log("NFT listing is complete!");
    } catch (error) {
      toast.error(`Error while minting NFT: ${error}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // console.error("Error while listing NFT:", error);
      throw error; // Rethrow the error to be caught in the higher level function if necessary
    }

    console.log("multiListing", multiListing);

    let response = await marketplaceContract.on(
      "NFTListed",
      multiListing ? handleNFTListedEvent : null
    );

    console.log("Response of list event", response);
  }

  // mint the NFT then list
  const mintThenList = async () => {
    console.log("test1");

    const signer = await getProviderOrSigner(true);
    // console.log("Get the signer", signer);
    console.log("test3");

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      signer
    );

    console.log("ipfsList", ipfsList);

    // await (await nftContract.mint(ipfsList.current)).wait();
    // console.log("minAndList 1");

    // let mintedTokens = await nftContract.getMintedTokensList();
    // console.log("mintedTokens ", mintedTokens);
    // console.log("mintedTokens.length ", mintedTokens.length);
    // console.log("minAndList 2");

    // let multi = false;
    // if (mintedTokens.length > 1) {
    //   console.log("minAndList 3");

    //   multi = true;
    //   let listOfTokens = [];
    //   for (let i = 0; i < mintedTokens.length; i++) {
    //     console.log("mintedTokens[i]", mintedTokens[i].toString());
    //     listOfTokens.push(Number(mintedTokens[i].toString()));
    //   }
    //   mintedTokens = listOfTokens;
    //   console.log("listOfTokens", listOfTokens);
    // } else {
    //   mintedTokens = Number(mintedTokens);
    // }

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );
    // console.log("Yahoo2");

    // // console.log("startTimestamp in if", startingDate);
    // // console.log("endTimestamp in if", startingDate);

    // // if (listingType == 0) {
    // //   console.log("startTimestamp in if", startingDate);
    // //   console.log("endTimestamp in if", startingDate);
    // //   setStartingDate(0);
    // //   setEndingDate(0);
    // // } else if (listingType == 1) {
    // //   const startDate = new Date(startingDate);
    // //   const endDate = new Date(endingDate);

    // //   // Convert start date to Unix timestamp (seconds)
    // //   const startTimestamp = Math.floor(startDate.getTime() / 1000);

    // //   // Convert end date to Unix timestamp (seconds)
    // //   const endTimestamp = Math.floor(endDate.getTime() / 1000);

    // //   console.log("startTimestamp in else", startTimestamp);
    // //   console.log("endTimestamp in else", endTimestamp);
    // // }

    // // console.log("mintedTokens", mintedTokens);
    // // console.log("item.price", item.price);
    // // console.log("royalty", royalty);
    // // console.log("listingType", listingType);
    // // console.log("item.crypto", crypto);

    // // // UNCOMMENT this
    // let ethParsedList = [];
    // console.log("Yahoo3");

    // for (let i = 0; i < priceList.length; i++) {
    //   console.log("Yahoo4");
    //   console.log("priceList[i]", priceList[i]);
    //   let ethPrice = ethers.utils.parseEther(priceList[i]);
    //   ethParsedList.push(ethPrice);
    // }

    // console.log("nftContract.address", nftContract.address);
    // console.log("mintedTokens", mintedTokens);
    // console.log("priceList", priceList);
    // console.log("ethParsedList", ethParsedList);
    // console.log("royaltyList", royaltyList);
    // console.log("listingType", listingType);
    // console.log("startingDateList", startingDateList);
    // console.log("endingDateList", endingDateList);
    // console.log("crypto", crypto);
    // console.log("PAyment method", crypto);

    // await (
    //   await marketplaceContract.listNft(
    //     nftContract.address,
    //     multi ? mintedTokens : [mintedTokens],
    //     ethParsedList,
    //     royaltyList,
    //     listingType,
    //     startingDateList,
    //     endingDateList,
    //     // [startingDateList[0] + 5 * 60 * 1000],
    //     0,
    //     crypto
    //   )
    // ).wait();
    // setLoading(false);

    marketplaceContractGlobal = marketplaceContract;
    nftContractGlobal = nftContract;
    try {
      // Use Promise.race to wait for either minting or listing to complete
      await Promise.race([
        await mintNFT(nftContract),
        // await listNFT(marketplaceContract, nftContract),
      ]);

      console.log("NFT minting completed!");
    } catch (error) {
      toast.error(`Error while minting NFT: ${error}`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // console.error("Error while minting and listing NFT:", error);
    }

    // let response = await marketplaceContract.on(
    //   "NFTListed",
    //   handleNFTListedEvent
    // );

    // console.log("Response of list event", response);
  };
  let listOfListedTokens = [];
  // const [listToPost, setListToPost] = useState([]);

  let listToPost = useRef([]);
  let count = 0;

  const handleNFTListedEvent = async (
    nftContract,
    tokenId,
    seller,
    owner,
    price,
    collectionId
  ) => {
    console.log("in multi list handler");
    console.log("count", count);
    console.log(" titleList.current[count]", titleList[count]);

    if (multiListing) {
      let listedData = {
        // nftContract: nftContract.toString(),
        title: titleList[count],
        token_id: tokenId.toString(),
        seller: seller.toString(),
        owner: owner.toString(),
        price: ethers.utils.formatEther(price.toString()),
        collection_id: collectionId.toString(),
        listing_type: listingType.toString(), // add [i]
      };
      count += 1;

      // testVariable =
      listOfListedTokens.push(listedData);
      addListToPost(listedData);

      // console.log("qqq ipfsList", ipfsList.current.length);

      if (ipfsList.current.length == listOfListedTokens.length) {
        nftDataPost();

        multiListing = false;
        toast.success(`NFTs minted`, {
          position: toast.POSITION.TOP_CENTER,
        });
        // alert("NFTs minted");

        // setTimeout(() => {
        //   navigate("/profile");
        //   window.location.reload();
        // }, 3000);
      } else {
        console.log("Nhi mili");
      }
    }
  };

  // const testPost = async () => {
  //   console.log("listToPost", listToPost);
  // };

  const nftDataPost = async () => {
    console.log("postListNft");
    console.log("listToPost.current", listToPost.current);
    console.log("listToPost.current", listToPost.current.length);
    console.log("listToPost.current.length", listToPost.current.length);

    for (let i = 0; i < listToPost.current.length; i++) {
      console.log("listToPost.current[i]", listToPost.current[i]);
      const response = await apis.postListNft(listToPost.current[i]);
      console.log("response", response);
    }
    // setTimeout(() => {
    //   navigate("/profile");
    // }, 3000);
  };

  const handlechange = (file) => {
    setFile(file);
  };

  const handleSliderChange = (value) => {
    // Update the value or perform any other actions
    console.log("Slider value:", value);
    setRoyalty(value);
    // ...
  };
  // const handleSliderChange = (value) => {
  //   // setRoyalty(value);
  //   if (value === 33) {
  //     setRoyalty(5);
  //   } else if (value === 66) {
  //     setRoyalty(10);
  //   } else if (value === 100) {
  //     setRoyalty(15);
  //   }
  // };

  useEffect(() => {}, [
    price,
    title,
    description,
    startingDate,
    endingDate,
    ipfsList,
    imageList,
  ]);

  let multiListing = false;
  const createItemMulti = (e) => {
    multiListing = true;
    listOfMintedTokens = [];

    ipfsImageList = [];
    ipfsList.current = [];
    imageList = [];
    priceList = [];
    titleList = [];
    descriptionList = [];
    royaltyList = [];
    startingDateList = [];
    endingDateList = [];

    console.log("NFts", NFts);
    console.log("listingType", listingType);

    for (let i = 0; i < NFts.length; i++) {
      if (listingType === 0) {
        console.log("Iterating nfts image", NFts[i].image); // diff
        console.log("Iterating nfts listingType", NFts[i].listingType);
        console.log("Iterating nfts price", NFts[i].price); // diff
        console.log("Iterating nfts crypto", NFts[i].crypto);
        console.log("Iterating nfts collection", NFts[i].collection);
        console.log("Iterating nfts title", NFts[i].title); // diff
        console.log("Iterating nfts description", NFts[i].description); // diff
        console.log("Iterating nfts royalty", NFts[i].royalty); // diff

        let imageFile = new File([NFts[i].image], `image${i}.jpg`, {
          type: "image/jpeg",
        });
        console.log("new image", imageFile);
        imageList.push(imageFile);
        priceList.push(NFts[i].price);
        titleList.push(NFts[i].title);
        descriptionList.push(NFts[i].description);
        royaltyList.push(NFts[i].royalty);

        startingDateList.push(0);
        endingDateList.push(0);
      } else {
        // listingType
        console.log("Iterating nfts startingDate", NFts[i].startingDate);
        console.log("Iterating nfts endingDate", NFts[i].endingDate);
        console.log("Iterating nfts image", NFts[i].image); // diff
        console.log("Iterating nfts listingType", NFts[i].listingType);
        console.log("Iterating nfts price", NFts[i].price); // diff
        console.log("Iterating nfts crypto", NFts[i].crypto);
        console.log("Iterating nfts collection", NFts[i].collection);
        console.log("Iterating nfts title", NFts[i].title); // diff
        console.log("Iterating nfts description", NFts[i].description); // diff
        console.log("Iterating nfts royalty", NFts[i].royalty); // diff

        let imageFile = new File([NFts[i].image], "image.jpg", {
          type: "image/jpeg",
        });
        console.log("new image", imageFile);

        imageList.push(imageFile);
        priceList.push(NFts[i].price);
        titleList.push(NFts[i].title);
        descriptionList.push(NFts[i].description);
        royaltyList.push(NFts[i].royalty);
        startingDateList.push(NFts[i].startingDate);
        endingDateList.push(NFts[i].endingDate);
      }
    }

    console.log("imageList", imageList);
    console.log("priceList", priceList);
    console.log("titleList", titleList);
    console.log("descriptionList", descriptionList);
    console.log("royaltyList", royaltyList);

    uploadToIPFS();
  };

  const createItemOld = (e) => {
    setLoading(true);
    e.preventDefault();
    price = inputValue;

    // console.log("crypto in check", crypto);

    // console.log("startTimestamp in if", startingDate);
    // console.log("endTimestamp in if", endingDate);

    // if (listingType == 0) {
    //   console.log("startTimestamp in if", startingDate);
    //   console.log("endTimestamp in if", endingDate);
    //   setStartingDate(0);
    //   setEndingDate(0);
    //   startTime = 0;
    //   endTime = 0;
    // } else if (listingType == 1) {
    //   const startDate = new Date(startingDate);
    //   const endDate = new Date(endingDate);

    //   // Convert start date to Unix timestamp (seconds)
    //   const startTimestamp = Math.floor(startDate.getTime() / 1000);

    //   // Convert end date to Unix timestamp (seconds)
    //   const endTimestamp = Math.floor(endDate.getTime() / 1000);

    //   console.log("startTimestamp in else", startTimestamp);
    //   console.log("endTimestamp in else", endTimestamp);
    //   setStartingDate(startTimestamp);
    //   setEndingDate(endTimestamp);
    //   startTime = startTimestamp;
    //   endTime = startTimestamp;
    // }

    // console.log("CHECK startingDate", startTime);
    // console.log("CHECK endingDate", endTime);

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

    uploadToIPFS(file);
  };

  // const connectWallet = async () => {
  //   try {
  //     await getProviderOrSigner();
  //     setWalletConnected(true);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
  //   if (!walletConnected) {
  //     web3ModalRef.current = new Web3Modal({
  //       network: "hardhat",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //     connectWallet();
  //     // numberOFICOTokens();
  //   }
  // }, [walletConnected, price]);

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
  // const [collectionOptions, setcollectionOptions] = useState([
  //   { value: "", label: "Select Collection" },
  //   { value: "usdt", label: "USDT" },
  // ]);

  const AddCollection = () => {
    if (CreateCollection.length < 1) {
      toast.warning(`Input Collection Name to Create`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // alert("Input Collection Name to Create");
    } else {
      setcollectionOptions((previousOptions) => [
        ...previousOptions,
        { value: CreateCollection.toLowerCase(), label: CreateCollection },
      ]);
      console.log(collectionOptions, "collection updated");
      hideCreateCollection();
    }
  };
  const hideCreateCollection = () => {
    setCreateCollection("");
    setshowCreateCollection(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(URL.createObjectURL(file));
  };

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const fileInputRef2 = useRef(null);

  const handleButtonClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleFileUpload = (event) => {
    console.log("calling");
    const files = event.target.files;
    console.log(files, "event");
    // const im
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );

    console.log(imageUrls, "eventttt");
    setSelectedImagesNFT([...selectedImagesNFT, ...imageUrls]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(files[i], "files[i]");
      setSelectedUploadNFTImage((prevState) => [...prevState, file]);
    }
    console.log("selectedUploadNFTImage", selectedUploadNFTImage);
  };

  const handleArtGalleryUpload = (event) => {
    const files = event;
    console.log(files, "event");
    // const im
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImagesNFT([...selectedImagesNFT, ...imageUrls]);
    console.log("selectedUploadNFTImage", selectedImagesNFT);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(files[i], "files[i]");
      console.log("working");
      setSelectedUploadNFTImage((prevState) => [...prevState, file]);
    }
    console.log("selectedUploadNFTImage", selectedUploadNFTImage);
  };

  // useEffect(() => {
  //   if(location?.state?.artGallery){
  //     handleArtGalleryUpload(location?.state?.artGallery)
  //   }
  // }, [selectedUploadNFTImage])

  const handleRemoveImage = (index) => {
    const newArray = [...selectedImagesNFT];
    newArray.splice(index, 1);
    setSelectedImagesNFT(newArray);
  };

  useEffect(() => {
    if (selectedImagesNFT.length > 0) {
      if (listingType === 0) {
        const newNFTs = selectedImagesNFT.map((image, index) => ({
          image,
          price: "",
          description: "",
          status: "",
          title: "",
          royalty: royalty,
          collection: choosenCollection.collection_id,
          crypto: crypto,
          listingType: listingType,
        }));
        setNfts((prevNFTs) => [...prevNFTs, ...newNFTs.slice(prevNFTs.length)]);
      } else if (listingType === 1) {
        const newNFTs = selectedImagesNFT.map((image, index) => ({
          image,
          price: "",
          startingDate: "",
          endingDate: "",
          description: "",
          status: "",
          title: "",
          royalty: royalty,
          collection: choosenCollection.collection_id,
          crypto: crypto,
          listingType: listingType,
        }));
        setNfts((prevNFTs) => [...prevNFTs, ...newNFTs.slice(prevNFTs.length)]);
      }
    }
  }, [selectedImagesNFT]);

  const handleRemoveCompletedNft = (index) => {
    handleRemoveImage(index);
    const newArray = [...NFts];
    newArray.splice(index, 1);
    setNfts(newArray);
  };

  useEffect(() => {
    if (listingType === 0) {
      setnftForm({
        price: "",
        desc: "",
        title: "",
      });
    } else if (listingType === 1) {
      setnftForm({
        desc: "",
        title: "",
        bid: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [listingType]);

  const handleNftForm = (e) => {
    if (e.target.name == "price" || e.target.name == "bid") {
      console.log("handling", e.target.name, e.target.value);
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value) || value === "") {
        setnftForm({ ...nftForm, [e.target.name]: e.target.value });
        setShowWarning(false);
      } else {
        setShowWarning(true);
      }
    } else {
      console.log("handling", e.target.name, e.target.value);
      setnftForm({ ...nftForm, [e.target.name]: e.target.value });
    }
  };
  const saveNFT = () => {
    if (listingType === 0) {
      if (!nftForm.price || !nftForm.desc) {
        toast.warning(`Fill all fields to save a NFT`, {
          position: toast.POSITION.TOP_CENTER,
        });
        // alert("Fill all fields to save a NFT");
      } else {
        // const imageFile = new File([NFts[currentNFT].image], "image.jpg", {
        //   type: "image/jpeg",
        // });
        const Data = {
          price: nftForm.price,
          description: nftForm.desc,
          image: NFts[currentNFT].image,
          status: "completed",
          title: nftForm.title,
        };
        setnftForm({
          price: "",
          desc: "",
          title: "",
        });
        updateCompleted(currentNFT, Data);
      }
    } else if (listingType === 1) {
      if (
        !nftForm.bid ||
        !nftForm.desc ||
        !nftForm.startDate ||
        !nftForm.endDate
      ) {
        toast.warning(`Fill all fields to save a NFT`, {
          position: toast.POSITION.TOP_CENTER,
        });
        // alert("Fill all fields to save a NFT");
      } else {
        const startDate = new Date(nftForm.startDate);
        const endDate = new Date(nftForm.endDate);
        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);
        const Data = {
          title: nftForm.title,
          price: nftForm.bid,
          startingDate: startTimestamp,
          endingDate: endTimestamp,
          description: nftForm.desc,
          image: NFts[currentNFT].image,
          status: "completed",
        };
        setnftForm({
          bid: "",
          desc: "",
          startDate: "",
          endDate: "",
          image: "",
          status: "",
          title: "",
        });
        updateCompleted(currentNFT, Data);
      }
    }
  };

  const createNFT = async () => {
    console.log("collection  in createNFT", collection);

    let tempCollection = collection;

    for (let i = 0; i < imageList.length; i++) {
      console.log(" ipfsImageList[i] in createNFT", ipfsImageList[i]);
      let image = ipfsImageList[i];
      let price = priceList[i];
      console.log("priceList in createNFT", priceList);

      console.log(
        "collection.collection_id in createNFT",
        tempCollection.collection_id
      );
      console.log("collection.crypto in createNFT", tempCollection.crypto);
      let crypto = tempCollection.crypto;
      let collection = tempCollection.collection_id;
      let title = titleList[i];
      let description = descriptionList[i];

      // console.log("listingType", listingType);
      if (listingType == 0) {
        try {
          console.log("image", image);

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
          console.log("result", result);
          addDataIPFSInList(result.pinataURL);
          console.log("ipfsList. from fun", ipfsList);

          console.log("result.pinataURL", result.pinataURL);
        } catch (error) {
          console.log("ipfs uri upload error: ", error);
        }
      } else {
        let startingDate = startingDateList[i];
        let endingDate = endingDateList[i];
        try {
          const dataInJSON = JSON.stringify({
            image,
            listingType,
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

    console.log("test1");

    if (ipfsList.length != 0) {
      console.log("test2");
      mintThenList();
    } else {
      toast.warning(`IPFS list is empty`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // window.alert("IPFS list is empty");
    }
  };

  useEffect(() => {
    console.log(NFts, "final data");
    console.log(currentNFT, "Current NFT");
  }, [currentNFT, NFts]);

  const updateCompleted = (index, updatedData) => {
    setNfts((prevNFTs) => {
      const updatedNFTs = [...prevNFTs];
      updatedNFTs[index] = { ...updatedNFTs[index], ...updatedData };
      return updatedNFTs;
    });
  };

  useEffect(() => {
    if (NFts.length > 0) {
      if (NFts[0].status !== "completed") {
        setCurrentNFT(0);
      }
    }
    if (NFts.length > 0) {
      for (let i = 1; i < NFts.length; i++) {
        if (
          NFts[i - 1].status === "completed" &&
          NFts[i].status !== "completed"
        ) {
          setCurrentNFT(i);
          break;
        }
      }
    }
    console.log("curent nft is", currentNFT);
  }, [NFts]);

  // Create an array of the desired length

  useEffect(() => {
    if (listingType === 1) {
      if (
        nftForm.startDate &&
        nftForm.endDate &&
        nftForm.endDate < nftForm.startDate
      ) {
        // alert("End date should be after start date");
        toast.warning(`End date should be after start date`, {
          position: toast.POSITION.TOP_CENTER,
        });
        setnftForm((prevForm) => ({
          ...prevForm,
          endDate: "", // Replace with your desired end date value
        }));
      }
    }
  }, [nftForm.startDate, nftForm.endDate]);

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() - 1); // Subtract 1 day from today's date
    const selectedStartDate = new Date(nftForm.startDate);

    if (selectedStartDate < today) {
      toast.warning(`Start date should not be before today's date`, {
        position: toast.POSITION.TOP_CENTER,
      });
      // alert("Start date should not be before today's date");
      setnftForm((prevForm) => ({
        ...prevForm,
        startDate: "", // Replace with your desired start date value
      }));
    }
  }, [nftForm.startDate]);

  useEffect(() => {
    setChoosenCollection(collection);
    console.log("choosen", choosenCollection);
  }, [collection]);

  const handleInputChange2 = (e) => {
    const file = e.target.files[0];
    setSelectedImage2(file);
  };

  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="create-single">
        <PageTopSection title={"Create Multiple Collectible"} />
        <div className="create-single-section-wrap">
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
                            <div
                              className="custom-drop-down"
                              onClick={() => setshowcollection(!showCollection)}
                            >
                              <div className="drop-down-select">
                                {collection == "" ? (
                                  <p>Select collection...</p>
                                ) : (
                                  <p>{collection?.label}</p>
                                )}
                                {collectionOptions?.length > 0 && (
                                  <MdOutlineKeyboardArrowDown />
                                )}
                              </div>
                              <div className="dropdown-list-wrap">
                                {showCollection && (
                                  <ul>
                                    {collectionOptions.map((value, index) => {
                                      return (
                                        <li
                                          key={index}
                                          className={`${
                                            collection?.label === value?.label
                                              ? "is-selected"
                                              : ""
                                          }`}
                                          onClick={() => {
                                            setCollection(
                                              collectionOptions[index]
                                            );

                                            console.log(
                                              "collection select",
                                              collection
                                            );
                                            // setCrypto(collection.crypto);
                                          }}
                                        >
                                          {value?.label}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            </div>
                            {/* <Dropdown
                           options={collectionOptions}
                           onChange={(e) => {
                           }}
                           defaultValue={collection.collection_id}
                         /> */}
                            <div
                              className="create-collection-btn"
                              onClick={() => setshowCreateCollection(true)}
                            >
                              <svg
                                enableBackground="new 0 0 50 50"
                                height="25px"
                                id="Layer_1"
                                version="1.1"
                                viewBox="0 0 50 50"
                                width="25px"
                                xmlSpace="preserve"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                              >
                                <rect fill="none" height="50" width="50" />
                                <line
                                  fill="#2638CC"
                                  stroke="#2638CC"
                                  strokeMiterlimit="10"
                                  strokeWidth="4"
                                  x1="9"
                                  x2="41"
                                  y1="25"
                                  y2="25"
                                />
                                <line
                                  fill="#2638CC"
                                  stroke="#2638CC"
                                  strokeMiterlimit="10"
                                  strokeWidth="4"
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
                                  <div className="Create-collection-wrap">
                                    <div className="left">
                                      <p>Collection Name</p>
                                      <input
                                        // value={collectionName}
                                        value={collectionName}
                                        onChange={(e) =>
                                          setCreateCollection(e.target.value)
                                        }
                                        type="text"
                                        placeholder="Enter collection name"
                                      />
                                    </div>
                                    <div className="right">
                                      <h2>Crypto</h2>
                                      <Dropdown
                                        options={cryptoOptions}
                                        onChange={(e) => {
                                          setCrypto(e);
                                          console.log("ALIMONIS", crypto);
                                        }}
                                        value={defaultCrypto.value}
                                      />
                                    </div>
                                  </div>
                                  <p className="txt-2">Upload image</p>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleInputChange2}
                                  />

                                  <div className="popUp-btn-group">
                                    <div
                                      onClick={hideCreateCollection}
                                      className="button-styling-outline btnCC"
                                    >
                                      <div className="btnCCin">Cancel</div>
                                    </div>
                                    <div
                                      className="button-styling btnCC"
                                      onClick={postSingleCollection}
                                    >
                                      Create
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {collection == "" ? (
                              <div
                                className="browse-btn my-5 button-styling"
                                style={{
                                  background: "gray",
                                  marginLeft: "auto",
                                }}
                              >
                                Next
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setcollectionFinalized(true);
                                  // notify();
                                }}
                                className="browse-btn my-5 button-styling"
                              >
                                Next
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  {collectionFinalized && (
                    <>
                      <div className="col-lg-12">
                        {!showProfileNFT && (
                          <>
                            <div className="row">
                              <div className="col-lg-12">
                                <h2>Select method</h2>
                              </div>
                              <div className="col-lg-3 col-md-4 col-6">
                                <div
                                  onClick={() => {
                                    setlistingType(0);
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
                                    setlistingType(1);
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
                            <br />
                            <br />

                            {/* <div className="line-three">
                          <div className="row">
                            <div className="col-lg-12">
                              <h2>Choose collection</h2>
                              <div className="row">
                                <div className="col-lg-9">
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
                                      xml: space="preserve"
                                      xmlns="http://www.w3.org/2000/svg"
                                      xmlns: xlink="http://www.w3.org/1999/xlink"
                                    >
                                      <rect fill="none" height="50" width="50" />
                                      <line
                                        fill="#2638CC"
                                        stroke="#2638CC"
                                        strokeMiterlimit="10"
                                        strokeWidth="4"
                                        x1="9"
                                        x2="41"
                                        y1="25"
                                        y2="25"
                                      />
                                      <line
                                        fill="#2638CC"
                                        stroke="#2638CC"
                                        strokeMiterlimit="10"
                                        strokeWidth="4"
                                        x1="25"
                                        x2="25"
                                        y1="9"
                                        y2="41"
                                      />
                                    </svg>
                                    Create Collection
                                  </div>
                                </div>
                                <div className="col-lg-3 col-md-3 col-5">
                                  <p>Crypto</p>
                                  <Dropdown
                                    options={cryptoOptions}
                                    onChange={(e) => {
                                      setCrypto(e.value);
                                    }}
                                    value={defaultCrypto.value}
                                  />
                                </div>
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
                                    <div className="popUp-btn-group">
                                      <button
                                        className="button-styling"
                                        onClick={() => AddCollection()}
                                      >
                                        Next
                                      </button>
                                      <button
                                        onClick={hideCreateCollection}
                                        className="button-styling-outline"
                                      >
                                        <div>Cancel</div>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                          </div>
                        </div> */}
                            {/* <div className="line-four">
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
                            </div> */}
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
                                  <div className="royality-value">
                                    {royalty} %
                                  </div>
                                </div>
                                {/* <div className="col-lg-4 col-md-4 col-5 mt-5">
                                  <p>Crypto</p>
                                  <Dropdown
                                    options={cryptoOptions}
                                    onChange={(e) => {
                                      setCrypto(e.value);
                                    }}
                                    value={defaultCrypto.value}
                                  />
                                </div> */}
                              </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                              {!location?.state?.artGallery ? (
                                <button
                                  className="button-styling"
                                  onClick={() => setshowProfileNFT(true)}
                                >
                                  Next
                                </button>
                              ) : (
                                <button
                                  className="button-styling"
                                  onClick={() => {
                                    setshowProfileNFT(true);
                                    handleArtGalleryUpload(
                                      location?.state?.artGallery
                                    );
                                  }}
                                >
                                  Next
                                </button>
                              )}
                            </div>
                          </>
                        )}
                        {showProfileNFT && (
                          <div>
                            {/* <h2>Profile NFT</h2> */}
                            {/* <div className="profile-nft-row1">
                              <div className="NFT-image-holder">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  style={{ display: "none" }}
                                  onChange={handleImageUpload}
                                />
                                {selectedImage ? (
                                  <img src={selectedImage} alt="Uploaded" />
                                ) : (
                                  <img src={Duck} alt="" />
                                )}
                              </div>
                              <div className="NFT-image-upload-txt">
                                <p>
                                  PNG, JPG, GIF, WEBP <br /> or MP4. Max 200mb.
                                </p>
                                <button
                                  onClick={handleButtonClick}
                                  className="button-styling browse-btn"
                                >
                                  Browse
                                </button>
                              </div>
                            </div> */}

                            <div className="col-lg-8 mx-auto collectionDivPreview">
                              <div className="img-holder">
                                <img src={collection.image} alt="" />
                              </div>
                              {/* <div className="title">
                            Collection Name
                          </div> */}
                              <div className="title-txt">
                                {choosenCollection.label}
                              </div>
                            </div>
                            <br />
                            <div>
                              <div>
                                <h2>Upload NFT</h2>
                                {NFts.length < 1 ? (
                                  <div className="Create-Collection-div">
                                    <p>
                                      PNG, JPG, GIF, WEBP or MP4. Max 200mb.
                                    </p>
                                    <br />
                                    <input
                                      ref={fileInputRef2}
                                      type="file"
                                      accept="image/*"
                                      style={{ display: "none" }}
                                      multiple
                                      onChange={handleFileUpload}
                                    />
                                    <button
                                      onClick={handleButtonClick2}
                                      className="button-styling "
                                    >
                                      Browse
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <div className="NFT-thumbnail-holder">
                                      <div className="NFT-inner">
                                        {NFts.length > 0 &&
                                          NFts.map((nft, index) => {
                                            if (
                                              index >= tabIndex &&
                                              index < Number(tabIndex + 10)
                                            ) {
                                              return (
                                                <NftCard
                                                  isCompleted={
                                                    nft.status === "completed"
                                                      ? "true"
                                                      : "false"
                                                  }
                                                  isClicked={
                                                    currentNFT === index
                                                      ? "true"
                                                      : "false"
                                                  }
                                                  index={index}
                                                  img={nft.image}
                                                  handleRemoveImage={
                                                    handleRemoveCompletedNft
                                                  }
                                                />
                                              );
                                            }
                                          })}
                                      </div>
                                    </div>
                                    <div className="control-main-div">
                                      <input
                                        ref={fileInputRef2}
                                        type="file"
                                        style={{ display: "none" }}
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                      />
                                      <div
                                        style={{
                                          textAlign: "right",
                                          width: "100%",
                                        }}
                                      >
                                        <button
                                          onClick={handleButtonClick2}
                                          className="button-styling "
                                        >
                                          Add More
                                        </button>
                                      </div>
                                      {NFts.length > Number(10) && (
                                        <div className="controlsDiv">
                                          {NFts.length > Number(10) && (
                                            <>
                                              <svg
                                                onClick={() => setTabIndex(0)}
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="7"
                                                  cy="7"
                                                  r="7"
                                                  fill={`${
                                                    tabIndex === 0
                                                      ? "#B601D1"
                                                      : "#D9D9D9"
                                                  }`}
                                                />
                                              </svg>
                                              <svg
                                                onClick={() => setTabIndex(10)}
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <circle
                                                  cx="7"
                                                  cy="7"
                                                  r="7"
                                                  fill={`${
                                                    tabIndex === 10
                                                      ? "#B601D1"
                                                      : "#D9D9D9"
                                                  }`}
                                                />
                                              </svg>
                                            </>
                                          )}

                                          {NFts.length > Number(20) && (
                                            <svg
                                              onClick={() => setTabIndex(20)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 20
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(30) && (
                                            <svg
                                              onClick={() => setTabIndex(30)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 30
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(40) && (
                                            <svg
                                              onClick={() => setTabIndex(40)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 40
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(50) && (
                                            <svg
                                              onClick={() => setTabIndex(50)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 50
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(60) && (
                                            <svg
                                              onClick={() => setTabIndex(60)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 60
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(70) && (
                                            <svg
                                              onClick={() => setTabIndex(70)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 70
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(80) && (
                                            <svg
                                              onClick={() => setTabIndex(80)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 80
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(90) && (
                                            <svg
                                              onClick={() => setTabIndex(90)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 90
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                          {NFts.length > Number(100) && (
                                            <svg
                                              onClick={() => setTabIndex(100)}
                                              width="14"
                                              height="14"
                                              viewBox="0 0 14 14"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <circle
                                                cx="7"
                                                cy="7"
                                                r="7"
                                                fill={`${
                                                  tabIndex === 100
                                                    ? "#B601D1"
                                                    : "#D9D9D9"
                                                }`}
                                              />
                                            </svg>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <br />
                            <br />

                            {ShowMore &&
                              NFts.length > 0 &&
                              NFts[NFts.length - 1].status !== "completed" && (
                                <div>
                                  <div className="line-four">
                                    <div className="row">
                                      <div className="col-lg-9">
                                        <h2>Title</h2>
                                        <input
                                          type="text"
                                          placeholder="e.g. ‘Crypto Funk"
                                          // defaultValue={title.current.value}
                                          value={nftForm.title}
                                          onChange={handleNftForm}
                                          name="title"
                                          minLength={3}
                                          maxLength={20}

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
                                          minLength={3}
                                          maxLength={50}
                                          type="text"
                                          placeholder="e.g. ‘This is very limited item’"
                                          value={nftForm.desc}
                                          onChange={handleNftForm}
                                          name="desc"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  {listingType === 0 ? (
                                    <div className="line-two">
                                      <div className="row">
                                        <div className="col-lg-8 col-md-8 col-6">
                                          <h2>Price</h2>
                                          <input
                                            type="number"
                                            value={nftForm.price}
                                            onChange={handleNftForm}
                                            name="price"
                                            // type="number"
                                            // placeholder="0.00"
                                            // ref={price}
                                          />
                                          {showWarning && (
                                            <p style={{ color: "red" }}>
                                              Please enter a valid positive
                                              number.
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="line-two">
                                        <div className="row">
                                          <div className="col-lg-8">
                                            <h2>Minimum bid</h2>
                                            <input
                                              type="text"
                                              value={nftForm.bid}
                                              onChange={handleNftForm}
                                              name="bid"
                                              // type="number"
                                              // placeholder="0.00"
                                              // ref={price}
                                            />
                                            {showWarning && (
                                              <p style={{ color: "red" }}>
                                                Please enter a valid positive
                                                number.
                                              </p>
                                            )}
                                          </div>
                                          <div className="col-lg-4 col-md-4 col-6"></div>
                                        </div>
                                      </div>
                                      <div className="line-two">
                                        <div className="row">
                                          <div className="col-lg-6 col-md-6 col-6">
                                            <h2>Starting date</h2>
                                            <input
                                              id="startingTime"
                                              type="date"
                                              name="startDate"
                                              placeholder="mm/dd/yyyy"
                                              style={{
                                                padding: "6px 10px 6px 15px",
                                              }}
                                              value={nftForm.startDate}
                                              min={
                                                new Date()
                                                  .toISOString()
                                                  .split("T")[0]
                                              }
                                              // onChange={(e) =>
                                              //   setStartingDate(e.target.value)
                                              // }
                                              onChange={handleNftForm}
                                            />
                                          </div>
                                          <div className="col-lg-6 col-md-6 col-6">
                                            <h2>Expiration date</h2>
                                            <input
                                              id="endTime"
                                              type="date"
                                              name="endDate"
                                              placeholder="mm/dd/yyyy"
                                              style={{
                                                padding: "6px 10px 6px 15px",
                                              }}
                                              value={nftForm.endDate}
                                              // onChange={(e) => setEndingDate(e.target.value)}
                                              onChange={handleNftForm}
                                              min={nftForm.startDate}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                  {/* <div className="line-seven">
                                <div className="row">
                                  <div className="col-lg-8">
                                    <button type="submit" className="button-styling">
                                      Create Item
                                    </button>
                                  </div>
                                </div>
                              </div> */}
                                </div>
                              )}
                            {!ShowMore ? (
                              <div
                                className="Button-holding-div"
                                style={{ justifyContent: "end" }}
                              >
                                <button
                                  className="button-styling"
                                  onClick={() => setShowMore(true)}
                                >
                                  Done
                                </button>
                                {/* <button className="button-styling-outline">
                              <div>Add More</div>
                            </button> */}
                              </div>
                            ) : (
                              <div className="Button-holding-div">
                                {NFts.length > 0 &&
                                NFts[NFts.length - 1].status !== "completed" ? (
                                  <button
                                    onClick={saveNFT}
                                    className="button-styling"
                                  >
                                    Next
                                  </button>
                                ) : (
                                  <button className="disabledButton">
                                    Next
                                  </button>
                                )}
                                {NFts.length > 0 &&
                                NFts[NFts.length - 1].status === "completed" ? (
                                  <button
                                    onClick={createItemMulti}
                                    className="button-styling ml-auto"
                                  >
                                    <div>List</div>
                                  </button>
                                ) : (
                                  <button
                                    className="disabledButton"
                                    // onClick={createItem}
                                  >
                                    List
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {/* <button onClick={nftDataPost}>Test post api</button> */}
                    </>
                  )}

                  <div className="line-one"></div>
                </div>
              </div>
            </div>
          </div>

          {/* <button onClick={getItem} className="button-styling">
            Get NFTS data
          </button> */}
        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
};

export default Multiple;
