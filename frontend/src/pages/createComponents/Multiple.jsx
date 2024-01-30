import React from "react";
import Header from "../landingpage/Header";
import Footer from "../landingpage/Footer";
import PageTopSection from "../../components/shared/PageTopSection";
import { useState, useEffect, useRef, useContext } from "react";
import { AiFillTag } from "react-icons/ai";
import { BsFillClockFill } from "react-icons/bs";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Slider from "rc-slider";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinanta";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import Search from "../../components/shared/Search";
import NftCard from "./NftCard";
import { useNavigate } from "react-router-dom";
import apis from "../../service/index";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation } from 'react-router-dom';
import Loader from "../../components/shared/Loader";
import { Store } from "../../Context/Store";

const fileTypes = ["JPG", "PNG", "GIF"];

const Multiple = ({ search, setSearch }) => {

  const [image, setImage] = useState("");
  const [listingType, setlistingType] = useState(0);
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
  const [collection, setCollection] = useState("");
  const [nftForm, setnftForm] = useState("");
  const [file, setFile] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [showCollection, setshowcollection] = useState(false);
  const [collectionName, setCreateCollection] = useState("");
  const [navigateTrue, setNavigateTrue] = useState(false)
  const [crypto, setCrypto] = useState({
    value: 0,
    label: "ETH",
  });

  const cryptoOptions = [
    { value: "", label: "Select Crypto" },
    { value: 0, label: "ETH" },
    { value: 1, label: "USDT" },
  ];

  const { account, checkIsWalletConnected, getSignerNFTContrat, getSignerMarketContrat } = useContext(Store);

  const location = useLocation();

  const navigate = useNavigate();
  const id = JSON.parse(localStorage.getItem("data"));
  const user_id = id?.id;
  let price = useRef(0);
  const title = useRef("");
  const description = useRef("");
  let ipfsList = useRef([]);
  let listOfMintedTokens = useRef([]);
  let ipfsImageList = useRef([]);
  let imageList = useRef([]);
  let priceList = useRef([]);
  let titleList = useRef([]);
  let descriptionList = useRef([]);
  let royaltyList = useRef([]);
  let startingDateList = useRef([]);
  let endingDateList = useRef([]);
  let listedddd = [];
  let listCalled = false;
  let listcount = 0;
  let multiListing = false;
  let listOfListedTokens = [];
  let listToPost = useRef([]);
  let count = 0;

  const [myList, setMyList] = useState(false)
  const fileInputRef2 = useRef(null);
  const defaultCrypto = cryptoOptions[0];

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  const getCollection = async () => {
    try {
      const response = await apis.getNFTCollection(user_id);
      // console.log("collection api", response);
      if (response?.status) {
        setcollectionOptions("");

        for (let i = 0; i < response?.data?.data?.length; i++) {
          let type = response?.data?.data[i]?.payment_type;
          // console.log(type == "eth", "eth", "TYpe", type);

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
      // console.log(collectionOptions, "collectionOptions");
    } catch (error) {
      console.log(error.message);
    }

  };

  const postSingleCollection = async () => {
    try {
      let cryptoType;
      // console.log(user_id, collectionName, crypto, selectedImage2);
      if (collectionName.length < 1 || !selectedImage2) {
        toast.warning("All Fields are required", {
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

  const addListOfMintedTokens = (newValue) => {
    // console.log("newValue", newValue);
    listOfMintedTokens.push(newValue);
  };

  const addImageIPFSInList = (newValue) => {
    ipfsImageList.push(newValue);
  };

  const addListToPost = (newValue) => {
    // console.log("newValue",newValue)
    listToPost.current.push(newValue);
  };

  const addDataIPFSInList = (newValue) => {
    // console.log("newValue",newValue)
    ipfsList.current.push(newValue);
  };

  const hideCreateCollection = () => {
    setCreateCollection("");
    setshowCreateCollection(false);
  };

  const handleButtonClick2 = () => {
    fileInputRef2.current.click();
  };

  const handleFileUpload = (event) => {
    const files = event.target.files;
    // const im
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImagesNFT([...selectedImagesNFT, ...imageUrls]);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setSelectedUploadNFTImage((prevState) => [...prevState, file]);
    }
    // console.log("selectedUploadNFTImage", selectedUploadNFTImage);
  };

  const handleArtGalleryUpload = (event) => {
    const files = event;
    // console.log(files, 'event');
    // const im
    const imageUrls = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setSelectedImagesNFT([...selectedImagesNFT, ...imageUrls]);
    // console.log("selectedUploadNFTImage", selectedImagesNFT);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // console.log(files[i], 'files[i]');
      // console.log('working');
      setSelectedUploadNFTImage((prevState) => [...prevState, file]);
    }
    // console.log("selectedUploadNFTImage", selectedUploadNFTImage);
  };

  const handleRemoveImage = (index) => {
    const newArray = [...selectedImagesNFT];
    newArray.splice(index, 1);
    setSelectedImagesNFT(newArray);
  };

  const handleRemoveCompletedNft = (index) => {
    handleRemoveImage(index);
    const newArray = [...NFts];
    newArray.splice(index, 1);
    setNfts(newArray);
  };

  const handleNftForm = (e) => {
    if (e.target.name == 'price' || e.target.name == 'bid') {
      // console.log("handling", e.target.name, e.target.value);
      const value = e.target.value;
      if (/^\d*\.?\d*$/.test(value) || value === "") {
        setnftForm({ ...nftForm, [e.target.name]: e.target.value });
        setShowWarning(false);
      } else {
        setShowWarning(true);
      }
    } else {
      // console.log("handling", e.target.name, e.target.value);
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
      } else {
        const startDate = new Date(nftForm.startDate);
        const endDate = new Date(nftForm.endDate);

        const startTimestamp = Math.floor(startDate.getTime() / 1000);
        const endTimestamp = Math.floor(endDate.getTime() / 1000);

        if (startTimestamp >= endTimestamp) return setEndingDate(""), toast.error("Expire date must be grather than start date", {
          position: toast.POSITION.TOP_CENTER,
        });

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

  const updateCompleted = (index, updatedData) => {
    setNfts((prevNFTs) => {
      const updatedNFTs = [...prevNFTs];
      updatedNFTs[index] = { ...updatedNFTs[index], ...updatedData };
      return updatedNFTs;
    });
  };

  const handleInputChange2 = (e) => {
    const file = e.target.files[0];
    setSelectedImage2(file);
  };

  const handleSliderChange = (value) => {
    // Update the value or perform any other actions
    // console.log("Slider value:", value);
    setRoyalty(value);
  };

  useEffect(() => {
    getCollection();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);

  useEffect(() => {
    if (startingDate && endingDate && endingDate < startingDate) {
      toast.warning(`End date should be after start date`, {
        position: toast.POSITION.TOP_CENTER,
      });
      setEndingDate("");
    }
  }, [startingDate, endingDate]);

  useEffect(() => {
    if (navigateTrue) {
      setMyList(false)
      toast.success(`NFTs minted`, {
        position: toast.POSITION.TOP_CENTER,
      });

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    }
  }, [navigateTrue])

  useEffect(() => { }, [
    price,
    title,
    description,
    startingDate,
    endingDate,
    ipfsList,
    imageList,
  ]);

  //step 1
  const createItemMulti = (e) => {
    e.preventDefault();
    setMyList(true)

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

    for (let i = 0; i < NFts.length; i++) {
      if (listingType === 0) {
        let imageFile = new File([NFts[i].image], `image${i}.jpg`, {
          type: "image/jpeg",
        });
        // console.log("new image", imageFile);
        imageList.push(imageFile);
        priceList.push(ethers.utils.parseEther(NFts[i]?.price?.toString()));
        titleList.push(NFts[i]?.title);
        descriptionList.push(NFts[i]?.description);
        royaltyList.push(+NFts[i]?.royalty * 100);
        startingDateList.push(0);
        endingDateList.push(0);

      } else {
        let imageFile = new File([NFts[i].image], "image.jpg", {
          type: "image/jpeg",
        });

        imageList.push(imageFile);
        priceList.push(ethers.utils.parseEther(NFts[i]?.price?.toString()));
        titleList.push(NFts[i]?.title);
        descriptionList.push(NFts[i]?.description);
        royaltyList.push(+NFts[i]?.royalty * 100);
        startingDateList.push(NFts[i]?.startingDate);
        endingDateList.push(NFts[i]?.endingDate);
      }
    }

    // console.log("imageList", imageList);
    // console.log("priceList", priceList);
    // console.log("titleList", titleList);
    // console.log("descriptionList", descriptionList);
    // console.log("royaltyList", royaltyList);

    uploadToIPFS();
  };

  //step 2
  // Upload image to IPFS
  const uploadToIPFS = async () => {

    if (typeof imageList !== "undefined") {
      for (let i = 0; i < imageList.length; i++) {

        try {
          const result = await uploadFileToIPFS(selectedUploadNFTImage[i]);
          // console.log("resulttt", result.pinataURL);

          // Extract the IPFS hash from the pinataURL
          const ipfsHash = result.pinataURL.split("/").pop();
          // console.log("resulttt", ipfsHash);
          // Construct a new URL that directly points to the image
          const imageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
          // console.log("imageUrl new final", ipfsHash);
          // Update your logic to use the imageUrl as needed
          addImageIPFSInList(imageUrl);
        } catch (error) {
          console.log("ipfs image upload error: ", error);
        }
      }
      createNFT();
    }
  };

  //step3
  const createNFT = async () => {
    let tempCollection = collection;

    for (let i = 0; i < imageList.length; i++) {

      let image = ipfsImageList[i];
      let price = priceList[i];
      let crypto = tempCollection.crypto;
      let collection = tempCollection.collection_id;
      let title = titleList[i];
      let description = descriptionList[i];

      if (listingType == 0) {
        try {
          const nftJSON = {
            "description": `${description}`,
            "image": `${image}`,
            "title": `${title}`
            // "collection": `${1}`,
            // "listingType": `${listingType}`,
            // "price": `${price}`,
            // "crypto": `${collection?.crypto}`,
            // "royalty": `${royaltyValue}`
          }
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
          // console.log("dataInJSON", nftJSON);
          const result = await uploadJSONToIPFS(nftJSON);
          // console.log("result", result);
          addDataIPFSInList(result.pinataURL);
          // console.log("result.pinataURL", result.pinataURL);
        } catch (error) {
          console.log("ipfs uri upload error: ", error);
        }
      } else {
        let startingDate = startingDateList[i];
        let endingDate = endingDateList[i];
        try {
          const nftJSON = {
            "description": `${description}`,
            "image": `${image}`,
            "title": `${title}`
            // "collection": `${1}`,
            // "listingType": `${listingType}`,
            // "price": `${price}`,
            // "crypto": `${collection?.crypto}`,
            // "royalty": `${royaltyValue}`
          }

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
          const result = await uploadJSONToIPFS(nftJSON);
          addDataIPFSInList(result.pinataURL);
          // console.log("RESULT.pinataURL", result.pinataURL);
        } catch (error) {
          console.log("ipfs uri upload error: ", error);
        }
      }
    }

    if (ipfsList.length != 0) {
      mintThenList();
    } else {
      toast.warning(`IPFS list is empty`, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const mintThenList = async () => {
    try {
      let minted = await getSignerNFTContrat().mint(ipfsList.current, {
        gasLimit: ethers.BigNumber.from("5000000"),
      });
      minted.wait();
      // console.log("NFT minting is complete!", minted);
      await getSignerNFTContrat().on("NFTMinted", handleNFTMintedEvent2);
    } catch (error) {
      setIsSingleSubmit(false)
      console.error("Error while minting NFT:", error);
      throw error;
    }

  }


  //step4
  // mint the NFT then list
  // const mintThenList = async () => {
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     // Set signer
  //     const signer = provider.getSigner()
  //     // console.log("Get the signer", signer);
  //     const nftContract = new Contract(
  //       NFT_CONTRACT_ADDRESS.address,
  //       NFT_CONTRACT_ABI.abi,
  //       signer
  //     );

  //     const marketplaceContract = new Contract(
  //       MARKETPLACE_CONTRACT_ADDRESS.address,
  //       MARKETPLACE_CONTRACT_ABI.abi,
  //       signer
  //     );

  //     marketplaceContractGlobal = marketplaceContract;
  //     nftContractGlobal = nftContract;
  //     try {
  //       // Use Promise.race to wait for either minting or listing to complete
  //       await Promise.race([
  //         await mintNFT(nftContract),
  //       ]);
  //       console.log("NFT minting completed!");
  //     } catch (error) {
  //       toast.error(`Error while minting NFT: ${error}`, {
  //         position: toast.POSITION.TOP_CENTER,
  //       });
  //     }

  // };

  //step5
  // Upload image and data to IPFS
  // async function mintNFT(nftContract) {
  //   try {
  //     await (await nftContract.mint(ipfsList.current)).wait();
  //     console.log("NFT minting is complete!");

  //     let response = await nftContract.on(
  //       "NFTMinted",
  //       multiListing ? handleNFTMintedEvent : null
  //     );
  //     console.log("Response of mint event", response);
  //   } catch (error) {
  //     setMyList(false)
  //     throw error;
  //   }
  // }

  //step6
  // const handleNFTMintedEvent = async (mintedTokens) => {
  //     let id;
  //     let list = [];
  //     for (let i = 0; i < mintedTokens.length; i++) {
  //       id = +mintedTokens[i]?.toString();
  //       list.push(id);
  //       listedddd.push(id);
  //       addListOfMintedTokens(id);
  //     }
  //     if (list?.length == ipfsList?.current?.length) {
  //       if (!listCalled) {
  //         listNFT(marketplaceContractGlobal, nftContractGlobal, list);
  //       }
  //     }
  // };

  const handleNFTMintedEvent2 = async (mintedTokens) => {
    let id;
    let list = [];
    // console.log("check mintedTokens", mintedTokens);
    for (let i = 0; i < mintedTokens.length; i++) {
      id = +mintedTokens[i]?.toString();
      // console.log("check mintedTokens", id);
      list.push(id);
      listedddd.push(id);
      addListOfMintedTokens(id);
    }

    if (list?.length == ipfsList?.current?.length) {

      if (!listCalled) {
        listcount = listcount + 1;
        try {
          let mintedTokens = list;
          let multi = false;
          if (mintedTokens?.length > 1) {
            multi = true;
            mintedTokens = list;
          } else {
            mintedTokens = Number(mintedTokens);
          }
          // // UNCOMMENT this
          let ethParsedList = [];
          for (let i = 0; i < priceList.length; i++) {
            let ethPrice = priceList[i]?.toString();
            ethParsedList.push(ethPrice);
          }

          if (!listCalled) {

            // console.log("ListingDSat", NFT_CONTRACT_ADDRESS?.address,
            //   multi ? mintedTokens : [mintedTokens],
            //   ethParsedList,
            //   royaltyList,
            //   listingType,
            //   startingDateList,
            //   endingDateList,
            //   collection?.collection_id,
            //   collection?.crypto);

            let list = await getSignerMarketContrat().listNft(
              NFT_CONTRACT_ADDRESS?.address,
              multi ? mintedTokens : [mintedTokens],
              ethParsedList,
              royaltyList,
              listingType,
              startingDateList,
              endingDateList,
              collection?.collection_id,
              collection?.crypto,
              user_id
            );
            
            list.wait();
            await getSignerMarketContrat().on("NFTListed", handleNFTListedEvent2);
            listCalled = true;
            setLoading(false);
          }
        } catch (error) {
          toast.error(`Error while minting NFT: ${error}`, {
            position: toast.POSITION.TOP_CENTER,
          });
          throw error;
        }
      }
    }
    // console.log("GOOODTRY");
  };

  //step7
  // async function listNFT(marketplaceContract, nftContract, listOfTokens) {
  //   listcount = listcount + 1;
  //   try {
  //     let mintedTokens = listOfTokens;
  //     let multi = false;
  //     if (mintedTokens?.length > 1) {
  //       multi = true;
  //       mintedTokens = listOfTokens;
  //     } else {
  //       mintedTokens = Number(mintedTokens);
  //     }
  //     // // UNCOMMENT this
  //     let ethParsedList = [];
  //     for (let i = 0; i < priceList.length; i++) {
  //       let ethPrice = ethers.utils.parseEther(priceList[i]?.toString())?.toString();
  //       ethParsedList.push(ethPrice);
  //     }
  //     if (!listCalled) {
  //       console.log( "ListingDSat",nftContract?.address,
  //         multi ? mintedTokens : [mintedTokens],
  //         ethParsedList,
  //         royaltyList,
  //         listingType,
  //         startingDateList,
  //         endingDateList,
  //         collection?.collection_id,
  //         collection?.crypto);
  //           await (
  //             await marketplaceContract.listNft(
  //               nftContract?.address,
  //               multi ? mintedTokens : [mintedTokens],
  //               ethParsedList,
  //               royaltyList,
  //               listingType,
  //               startingDateList,
  //               endingDateList,
  //               collection?.collection_id,
  //               collection?.crypto
  //             )
  //           ).wait();
  //     }
  //     listCalled = true;
  //     setLoading(false);
  //     console.log("NFT listing is complete!");
  //   } catch (error) {
  //     toast.error(`Error while minting NFT: ${error}`, {
  //       position: toast.POSITION.TOP_CENTER,
  //     });
  //     throw error; 
  //   }
  //   let response = await marketplaceContract.on(
  //     "NFTListed",
  //     multiListing ? handleNFTListedEvent : null
  //   );
  // }

  //step8
  const handleNFTListedEvent2 = async (
    nftContract,
    tokenId,
    seller,
    owner,
    price,
    collectionId,
    listingType
  ) => {
    // console.log("checck",
    //   tokenId?.toString(),
    //   seller?.toString(),
    //   owner?.toString(),
    //   price,
    //   collectionId,
    //   listingType);
    if (multiListing) {
      let listedData = {
        title: titleList[count],
        token_id: tokenId?.toString(),
        seller: seller?.toString(),
        owner: owner?.toString(),
        price: price?.toString(),
        collection_id: collectionId?.toString(),
        listing_type: listingType?.toString(), // add [i]
        user_id: user_id
      };
      count += 1;
      // testVariable =
      listOfListedTokens.push(listedData);
      addListToPost(listedData);
      if (ipfsList.current.length == listOfListedTokens.length) {
        nftDataPost();
        multiListing = false;
        // toast.success(`NFTs minted`, {
        //   position: toast.POSITION.TOP_CENTER,
        // });

        // navigate('/')
        // alert("NFTs minted");

        // setTimeout(() => {
        //   navigate("/profile");
        //   window.location.reload();
        // }, 3000);
      } else {
        // console.log("Nhi mili");
      }
    }
  };

  //step9
  const nftDataPost = async () => {
    for (let i = 0; i < listToPost?.current?.length; i++) {
      // console.log("listToPost.current[i]", listToPost.current[i]);
      // const response = await apis.postListNft(listToPost?.current[i]); //TODO
      // console.log("response", response);
    }
    setNavigateTrue(true)
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

  useEffect(() => {
    // console.log(NFts, "final data");
    // console.log(currentNFT, "Current NFT");
  }, [currentNFT, NFts]);

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
    // console.log("curent nft is", currentNFT);
  }, [NFts]);

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
    // console.log("choosen", choosenCollection);
  }, [collection]);

  return (
    <>
      {myList && <Loader />}
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
                                          className={`${collection?.label === value?.label
                                            ? "is-selected"
                                            : ""
                                            }`}
                                          onClick={() => {
                                            setCollection(
                                              collectionOptions[index]
                                            );

                                            // console.log(
                                            //   "collection select",
                                            //   collection
                                            // );

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

                                        value={collectionName}
                                        onChange={(e) =>{
                                          const newValue = e.target.value.replace(/[^a-zA-Z]/g, '');
                                          setCreateCollection(newValue)
                                        }}
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
                                          // console.log("ALIMONIS", crypto);
                                        }}
                                        value={defaultCrypto.value}
                                      />
                                    </div>
                                  </div>
                                  <p className="txt-2">Upload Collection Image</p>
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
                                style={{ background: "gray", marginLeft: 'auto' }}
                              >
                                Next
                              </div>
                            ) : (
                              <div
                                onClick={() => {
                                  setcollectionFinalized(true);

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
                                  className={` create-single-card ${listingType === 0 ? "active" : ""
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
                                  className={` create-single-card ${listingType === 1 ? "active" : ""
                                    }`}
                                >
                                  <BsFillClockFill />
                                  <h3>Timed Auction</h3>
                                </div>
                              </div>
                            </div>
                            <br />
                            <br />
                            <div className="line-six">
                              <div className="row">
                                <div className="col-lg-9">
                                  <h2>Royalties</h2>
                                  <Slider
                                    min={0}
                                    max={15}
                                    defaultValue={0}

                                    onChange={handleSliderChange}
                                    value={royalty}
                                  />
                                </div>
                                <div className="col-lg-3 ">
                                  <div className="royality-value">
                                    {royalty} %
                                  </div>
                                </div>

                              </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              {!location?.state?.artGallery ?
                                <button
                                  className="button-styling"
                                  onClick={() => setshowProfileNFT(true)}
                                >
                                  Next
                                </button>
                                :
                                <button
                                  className="button-styling"
                                  onClick={() => { setshowProfileNFT(true); handleArtGalleryUpload(location?.state?.artGallery) }}
                                >
                                  Next
                                </button>
                              }
                            </div>
                          </>
                        )}
                        {showProfileNFT && (
                          <div>
                            <div className="col-lg-8 mx-auto collectionDivPreview">
                              <div className="img-holder">
                                <img src={collection.image} alt="" />
                              </div>

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
                                      <div style={{ textAlign: 'right', width: '100%' }}>
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
                                                  fill={`${tabIndex === 0
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
                                                  fill={`${tabIndex === 10
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
                                                fill={`${tabIndex === 20
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
                                                fill={`${tabIndex === 30
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
                                                fill={`${tabIndex === 40
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
                                                fill={`${tabIndex === 50
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
                                                fill={`${tabIndex === 60
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
                                                fill={`${tabIndex === 70
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
                                                fill={`${tabIndex === 80
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
                                                fill={`${tabIndex === 90
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
                                                fill={`${tabIndex === 100
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

                                          value={nftForm.title}
                                          onChange={handleNftForm}
                                          name="title"
                                          minLength={3}
                                          maxLength={20}

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

                                              onChange={handleNftForm}
                                              min={nftForm.startDate}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </>
                                  )}

                                </div>
                              )}
                            {!ShowMore ? (
                              <div className="Button-holding-div" style={{ justifyContent: 'end' }}>
                                <button
                                  className="button-styling"
                                  onClick={() => setShowMore(true)}
                                >
                                  Done
                                </button>

                              </div>
                            ) : (
                              <div className="Button-holding-div">
                                {NFts.length > 0 &&
                                  NFts[NFts.length - 1].status !== "completed" && (
                                    <button
                                      onClick={saveNFT}
                                      className="button-styling"
                                    >
                                      Next
                                    </button>
                                  )}
                                {NFts.length > 0 &&
                                  NFts[NFts.length - 1].status === "completed" ? (
                                  <button
                                    onClick={createItemMulti}

                                    className="button-styling ml-auto"
                                  >
                                    <div>Mint</div>
                                  </button>
                                ) : (
                                  null
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </>
                  )}

                  <div className="line-one"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default Multiple;
