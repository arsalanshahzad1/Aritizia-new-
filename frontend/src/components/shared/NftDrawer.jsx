import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiFillTag, AiOutlineHeart } from "react-icons/ai";
import { BsCheck, BsFillClockFill } from "react-icons/bs";
import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import SocialShare from "./SocialShare";
import Details from "./profileDrawerTabs/Details";
import Bids from "./profileDrawerTabs/Bids";
import History from "./profileDrawerTabs/History";
import Form from "react-bootstrap/Form";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Web3Modal from "web3modal";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import "../../App.css";
import nft from "../../../public/assets/images/nft-2.png";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import ChartForEarning from "../../pages/settingFolder/ChartForEarning";
import Slider from "rc-slider";
import { useNavigate } from "react-router-dom";
import apis from "../../service/index";
import { Store } from "../../Context/Store";
import { toast } from "react-toastify";
// import { getAddress } from "../../methods/methods";
// import {connectWallet, getProviderOrSigner,} from "../../methods/walletManager";

const Monthly_data = [
  {
    data: "Jan",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Feb",
    value: 0.5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Mar",
    value: 0.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Apr",
    value: 0.98,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "May",
    value: 0.45,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "June",
    value: 0.43,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "July",
    value: 0.41,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Aug",
    value: 0.52,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Sep",
    value: 0.54,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Oct",
    value: 0.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Nov",
    value: 0.48,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Dec",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
];
const Weekly_data = [
  {
    data: "Jan",
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Feb",
    value: 2.5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Mar",
    value: 9.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Apr",
    value: 2.98,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "May",
    value: 4.45,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "June",
    value: 6.43,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "July",
    value: 3.41,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Aug",
    value: 2.52,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Sep",
    value: 4.54,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Oct",
    value: 0.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Nov",
    value: 0.48,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Dec",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
];
const Daily_data = [
  {
    data: "Jan",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Feb",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Mar",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Apr",
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "May",
    value: 3,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "June",
    value: 4,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "July",
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Aug",
    value: 6,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Sep",
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Oct",
    value: 4,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Nov",
    value: 3,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Dec",
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
];

const ProfileDrawer = ({
  id,
  isVisible,
  onClose,
  timedAuction,
  image,
  titlee,
  royalty,
  descriptionn,
  collectionn,
  getMyNfts,
}) => {
  console.log(titlee, "title");
  console.log(royalty, "royalty");
  console.log(descriptionn, "description");
  console.log(collectionn, "collectionn");
  // const [image, setImage] = useState("");
  // let image = "";
  // const [price, setPrice] = useState(null);
  // const [title, setTitle] = useState("");
  // const [description, setDescription] = useState("");
  // const [minimumBid, setMinimumBid] = useState("");
  const [listingType, setlistingType] = useState(0);

  useEffect(() => {
    console.log("timed auction value=> ", timedAuction);
    if (timedAuction == true) {
      setlistingType(1);
    } else {
      setlistingType(0);
    }
  }, [timedAuction]);

  const [walletConnected, setWalletConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startingDate, setStartingDate] = useState(0);
  const [endingDate, setEndingDate] = useState(0);

  var startTime = useRef(0);
  var endTime = useRef(0);
  const [inputValue, setInputValue] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const { account, checkIsWalletConnected } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

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

  // useEffect(() => {
  //   if (startingDate && endingDate && endingDate < startingDate) {
  //     alert("End date should be after start date");
  //     setEndingDate("");
  //   }
  // }, [startingDate, endingDate]);

  const web3ModalRef = useRef();

  var item = {};

  let price = useRef(0);
  const title = useRef("");
  const description = useRef("");

  // const getAddress = async () => {
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   setUserAddress(accounts[0]);
  //   console.log("getAddress", accounts[0]);
  // };

  // const [userAddress, setUserAddress] = useState("0x000000....");

  // const getProviderOrSigner = async () => {
  //   console.log("getProviderOrSigner");
  // };

  // Helper function to fetch a Provider/Signer instance from Metamask
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
  //     // console.log("getSigner");

  //     return signer;
  //   }
  //   // console.log("getProvider");
  //   return web3Provider;
  // };

  // List NFT
  const mintThenList = async (result) => {
    console.log("In mintThenList");

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    console.log("NFT_CONTRACT_ADDRESS.address", NFT_CONTRACT_ADDRESS.address);
    console.log("item.tokenId", item.tokenId);
    console.log("item.price", item.price);
    console.log("item.listingType", item.listingType);
    console.log("item.startTime", item.startTime);
    console.log("item.endTime", item.endTime);
    console.log("userAddress", userAddress);
    console.log("id", id);

    const structData = await marketplaceContract._idToNFT(id);

    console.log("structData", structData);
    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      signer
    );

    const tx = await nftContract.approve(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      id,
      {
        gasLimit: ethers.BigNumber.from("500000"),
      }
    );
    await tx.wait();
    console.log("userAddress", userAddress);
    console.log("item.startTime", item.startTime);
    console.log("item.endTime", item.endTime);

    await (
      await marketplaceContract.resellNft(
        NFT_CONTRACT_ADDRESS.address,
        item.tokenId,
        ethers.utils.parseEther(item.price),
        item.listingType,
        item.startTime,
        item.endTime
      )
    ).wait();

    console.log("relist", relist);

    let response = marketplaceContract.on(
      "NFTListed",
      relist ? handleNFTListedEvent : null
    );

    console.log("Response of list event", response);
  };

  let listToPost = useRef([]);

  const addListToPost = (newValue) => {
    // console.log("newValue",newValue)
    listToPost.current.push(newValue);
  };

  const handleNFTListedEvent = async (
    nftContract,
    tokenId,
    seller,
    owner,
    price,
    collectionId,
    listingType
  ) => {
    if (relist) {
      let listedData = {
        // nftContract: nftContract.toString(),
        token_id: tokenId?.toString(),
        seller: seller?.toString(),
        owner: owner?.toString(),
        price: ethers.utils.formatEther(price?.toString()),
        collection_id: collectionId?.toString(),
        listing_type: listingType?.toString(),
      };

      addListToPost(listedData);

      console.log("listedData", listedData);

      nftDataPost();
      toast.error("Nft listed");
    }
  };

  const nftDataPost = async () => {
    console.log("postListNft");
    console.log("listToPost.current[0]", listToPost?.current[0]);

    // const response = await apis.postListNft(listToPost.current[0]);
    // console.log("2222222222222222");
    // console.log("response", response);
    relist = false;
    await onClose(false);
    // setTimeout(() => {
    window.location.reload();

    // await getMyNfts();
    // }, 500);
  };

  //   const [file, setFile] = useState(null);
  //   const [crypto, setCrypto] = useState({ value: 0, label: "ETH" });

  //   const [collection, setCollection] = useState({
  //     value: "USDT",
  //     label: "Select Collection",
  //   });

  //   const handlechange = (file) => {
  //     setFile(file);
  //   };

  //   const [royalty, setRoyalty] = useState(0);

  //   const cryptoOptions = [
  //     { value: "", label: "Select Crypto" },
  //     { value: 0, label: "ETH" },
  //     { value: 1, label: "USDT" },
  //   ];

  //   const [collectionOptions, setcollectionOptions] = useState([
  //     { value: "", label: "Select Collection" },
  //     { value: "usdt", label: "USDT" },
  //   ]);

  //   const defaultOption = collectionOptions[0];
  //   const defaultCrypto = cryptoOptions[0];

  //   const handleSliderChange = (value) => {
  //     // Update the value or perform any other actions
  //     console.log("Slider value:", value);
  //     setRoyalty(value);
  //     // ...
  //   };
  // const handleSliderChange = (value) => {
  //     // setRoyalty(value);
  //     if (value === 33) {
  //         setRoyalty(5);
  //     } else if (value === 66) {
  //         setRoyalty(10);
  //     } else if (value === 100) {
  //         setRoyalty(15);
  //     }
  // };

  useEffect(() => { }, [price, title, description]);

  // useEffect(() => {
  //   getAddress();
  // }, []);

  let relist = false;



  function createItem(e) {
    e.preventDefault();
    price = inputValue;
    relist = true;

    // console.log("endTimestamp in if", endingDate);

    if (listingType == 0) {
      console.log("startTimestamp in if", startingDate);
      console.log("endTimestamp in if", endingDate);
      setStartingDate(0);
      setEndingDate(0);
      startTime = 0;
      endTime = 0;
    } else if (listingType == 1) {
      
      const startDate = new Date(startingDate);
      const endDate = new Date(endingDate);

      const startTimestamp = Math.floor(startDate.getTime() / 1000);

      const endTimestamp = Math.floor(endDate.getTime() / 1000);

      if(startTimestamp >= endTimestamp ) return setEndingDate(""),  toast.error( "Expire date must be grather than start date",{
        position: toast.POSITION.TOP_CENTER,
      });
      startTime = startTimestamp;
      endTime = endTimestamp;
    }

    console.log("CHECK startingDate", startTime);
    console.log("CHECK endingDate", endTime);

    console.log("price", price);

    item = {
      tokenId: id,
      price: price,
      listingType: listingType,
      startTime: startTime,
      endTime: endTime,
    };

    console.log("item", item);

    if (
      //   item.title != null &&
      item.price !== "" && startingDate !== "" && endingDate !== ""
      //   item.description != null &&
      //   item.crypto != null &&
      //   item.file != null &&
      //   item.collection != null
    ) {
      //   uploadToIPFS(file);
      mintThenList(item);
      console.log("first");
    } else {
      window.alert("Fill all the fields to continue");
    }
  }



  // const getItem = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum)
  //   // Set signer
  //   const signer = provider.getSigner()

  //   const marketplaceContract = new Contract(
  //     MARKETPLACE_CONTRACT_ADDRESS.address,
  //     MARKETPLACE_CONTRACT_ABI.abi,
  //     provider
  //   );
  //   const structData = await marketplaceContract._idToNFT(id);
  //   let seller = structData.seller;
  //   let owner = structData.owner;

  //   console.log("seller", seller);
  //   console.log("owner", owner);

  //   //   const _listedNfts = await marketplaceContract.getListedNfts();

  //   //   for (let i = 0; i < _listedNfts.length; i++) {
  //   //     console.log("_listedNfts", _listedNfts[i]);
  //   //   }
  //   // } catch (err) {
  //   //   console.error(err);
  //   // }
  // };

  const [CreateCollection, setCreateCollection] = useState("");
  const [showCreateCollection, setshowCreateCollection] = useState(false);

  const AddCollection = () => {
    if (CreateCollection.length < 1) {
      toast.error("Input Collection Name to Create");
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

  return (
    <>
      <Drawer
        isVisible={isVisible}
        onClose={() => onClose(false)}
        className=" nft-drawer-wrapper"
      >
        <div className="create-single">
          <div className="profile-drawer" style={{ position: "relative" }}>
            <span className="profile-drawer-cancle" onClick={() => onClose()}>
              x
            </span>
            <div className="create-single-section-wrap">
              <form onSubmit={createItem}>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7 mx-auto">
                      <div className="row">
                        {listingType == 0 ? (
                          <div className="line-two">
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-7">
                                <h2>Price</h2>
                                <input
                                  type="text"
                                  value={inputValue}
                                  onChange={handleInputChange}
                                // type="number"
                                // placeholder="0.00"
                                // ref={price}
                                // required
                                />
                                {showWarning && (
                                  <p style={{ color: "red" }}>
                                    Please enter a valid positive number.
                                  </p>
                                )}
                              </div>
                              {/* <div className="col-lg-3 col-md-3 col-5">
                                                                <h2>Crypto</h2>
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
                        ) : (
                          <>
                            <div className="line-two">
                              <div className="row">
                                <div className="col-lg-12">
                                  <h2>Minimum bid</h2>
                                  <input
                                    type="text"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                  // type="number"
                                  // placeholder="0.00"
                                  // ref={price}
                                  // required
                                  />
                                  {showWarning && (
                                    <p style={{ color: "red" }}>
                                      Please enter a valid positive number.
                                    </p>
                                  )}
                                </div>
                                {/* <div className="col-lg-3 col-md-3 col-5">
                                                                    <h2>Crypto</h2>
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
                                  // required
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
                                  // required
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="line-three">
                          <div className="row">
                            <div className="col-lg-12 disabled-input-only-view">
                              <h2>Collection Name</h2>
                              <input type="text" value={collectionn} disabled />
                            </div>
                          </div>
                        </div>
                        <div className="line-four">
                          <div className="row">
                            <div className="col-lg-9 disabled-input-only-view">
                              <h2>Title</h2>
                              <input
                                disabled
                                type="text"
                                value={titlee}
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
                            <div className="col-lg-9 disabled-input-only-view">
                              <h2>Description</h2>
                              <input
                                disabled
                                type="text"
                                placeholder="e.g. ‘This is very limited item’"
                                ref={description}
                                value={descriptionn}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="line-six">
                          <div className="row">
                            <div className="col-lg-9 disabled-input-only-view">
                              <h2>Royalties</h2>
                              <Slider
                                disabled
                                min={0}
                                max={15}
                                defaultValue={royalty}
                              // step={null}
                              // onChange={handleSliderChange}
                              // value={royalty}
                              />
                            </div>
                            <div className="col-lg-3 ">
                              <div className="royality-value">
                                royalty {royalty}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="line-seven">
                          <div className="row">
                            <div className="col-lg-8">
                              <button type="submit" className="button-styling">
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 mx-auto nft-drawer-dp">
                      <h2>NFT image</h2>
                      <div className="img-holder">
                        <img src={image} alt="" />
                      </div>
                    </div>

                  </div>
                </div>
              </form>
              {/* <br />
              <button onClick={getItem} className="button-styling">
                Get NFTS data
              </button> */}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ProfileDrawer;
