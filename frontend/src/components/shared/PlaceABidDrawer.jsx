import React, { useRef, useCallback, useState, useEffect } from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import SocialShare from "./SocialShare";
import Details from "./profileDrawerTabs/Details";
import Bids from "./profileDrawerTabs/Bids";
import History from "./profileDrawerTabs/History";
import Form from "react-bootstrap/Form";
import Dropdown from "react-dropdown";
import Web3Modal from "web3modal";
import "react-dropdown/style.css";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
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
import apis from "../../service";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";
import NftCountdown from "./NftCountdown";

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
const PlaceABidDrawer = ({
  isVisible,
  onClose,
  id,
  title,
  image,
  price,
  crypto,
  description,
  // collection,
  // userAddress,
  isLive,
  startTime,
  endTime,
}) => {
  const [propertyTabs, setPropertyTabs] = useState(0);
  const [chack, setChack] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [dollarPrice, setDollarPrice] = useState("");
  const [highestBid, setHighestBid] = useState("");
  const [auctionStatus, setAuctionStatus] = useState(false);
  const [bidButton, showBidButton] = useState(false);
  const [nftDetails, setNftDetails] = useState("");
  const [getSellerPlan, setSellerPlan] = useState("");

  const userData = JSON.parse(localStorage.getItem("data"));
  let userAddress = userData?.wallet_address;

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const handleStatus = (e) => {
    setStatus(e);
  };

  const getNFTDetailByNFTTokenId = async () => {
    const response = await apis.getNFTByTokenId(id);
    console.log("Zayyan", response?.data?.data?.subscription_plan);
    setNftDetails(response?.data?.data);
    setSellerPlan(response?.data?.data?.subscription_plan);
  };

  useEffect(() => {
    if (isVisible) {
      getNFTDetailByNFTTokenId();
    }
  }, [isVisible]);

  let sellerPlan = 0;
  let buyerPlan = 1;

  const [amountUSD, setAmountUSD] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [bidDisable, setBidDisable] = useState(false);

  const getStatusOfAuction = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    let auctionData = await marketplaceContract._idToAuction(id);

    // console.log("auctionData", auctionData);
    // console.log("startTime", auctionData.startTime.toString());

    let startTime = auctionData?.startTime.toString();
    let highestBidd = auctionData?.highestBid.toString();
    let endTime = auctionData?.endTime.toString();
    let seller = auctionData?.seller.toString();
    seller = seller.toLowerCase();
    let highestBidder = auctionData?.highestBidder.toString();
    highestBidder = highestBidder.toLowerCase();
    userAddress = userAddress.toLowerCase();
    let currentTime = Date.now();

    console.log("highestBidder:", highestBidder);
    console.log("highestBidd:", highestBidd);
    // console.log("currentTime:", currentTime);
    console.log("seller:", seller);
    console.log("userAddress:", userAddress);

    currentTime = Math.floor(currentTime / 1000);
    // console.log("currentTime:", currentTime);

    const auctionLive = await marketplaceContract.getStatusOfAuction(id);
    // console.log("getStatusOfAuction", auctionLive);
    // setAuctionStatus(auctionLive);

    // console.log("eee auctionLive", auctionLive);
    // console.log("eee userAddress != seller", userAddress != seller);
    // console.log("eee highestBid == 0", highestBid == 0);
    // console.log("eee userAddress == seller", userAddress == seller);
    // console.log(
    //   "eee userAddress == highestBidder",
    //   userAddress == highestBidder
    // );
    console.log(
      "eee userAddress == seller",
      userAddress.toString() == seller.toString()
    );
    // console.log("eee auctionLive", auctionLive);

    // if (userAddress = seller) {
    // // which button to show
    //   showBidButton(true);
    // } else {
    //   if(currentTime < startTime){
    //   showBidButton(false);
    //   }
    // }

    if (auctionLive) {
      if (userAddress != seller) {
        // show bid button
        showBidButton(true);
        console.log("WWW Bid");
      } else if (highestBid == 0 && userAddress == seller) {
        console.log("WWW show claim");
        showBidButton(false);
        // show claim
      }
    } else {
      // auction is not live
      if (userAddress == highestBidder || userAddress == seller) {
        console.log("WWW show claim");
        showBidButton(false);
        // show claim
      } else {
        console.log("WWWW disabled bid button");
        showBidButton(true); // Disabled
        setBidDisable(true);
        // disabled bid button
      }
    }
  };

  const getPriceInUSD = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    let auctionData = await marketplaceContract._idToAuction(id);

    const getStatusOfAuction = await marketplaceContract.getStatusOfAuction(id);
    console.log("getStatusOfAuction", getStatusOfAuction);
    setAuctionStatus(getStatusOfAuction);

    let highestBid = ethers.utils.formatEther(
      auctionData?.highestBid.toString()
    );

    // let startTime = auctionData.startTime.toString();

    // let endTime = auctionData.endTime.toString();

    // console.log("startTime", startTime);
    // console.log("endTime", endTime);

    let basePrice = ethers.utils.formatEther(auctionData.basePrice.toString());

    let priceETH = Number(highestBid);
    console.log("priceETH", priceETH);

    let currBid;
    if (highestBid == 0) {
      setHighestBid(basePrice);
      currBid = basePrice;
    } else {
      currBid = highestBid;
      setHighestBid(highestBid);
    }

    priceETH = currBid;

    // let dollarPriceOfETH = 1831;
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
    let priceInETH = dollarPriceOfETH.toString() / 1e18;

    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = priceETH;
    priceInUSD = oneETHInUSD * priceInUSD;
    priceInUSD = Math.ceil(priceInUSD);
    setAmountUSD(priceInUSD.toString());
    let fee = Math.ceil((priceInUSD * 3) / 100);
    setPlatformFee(fee);
  };

  let auctionPurchase = false;

  const claimAuction = async () => {
    const signer = await getProviderOrSigner(true);

    auctionPurchase = true;

    console.log("Claim auction");
    console.log("auctionPurchase", auctionPurchase);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    await (
      await marketplaceContract.closeAuction(
        NFT_CONTRACT_ADDRESS.address,
        id,
        sellerPlan,
        buyerPlan
      )
    ).wait();

    let response = marketplaceContract.on(
      "NFTSold",
      auctionPurchase ? handleNFTSoldEvent : null
    );
    console.log("auctionPurchase", auctionPurchase);

    console.log("Response of bid even", response);
  };

  const handleNFTSoldEvent = async (
    nftContract,
    tokenId,
    seller,
    owner,
    price
  ) => {
    let soldData = {
      // nftContract: nftContract.toString(),
      token_id: tokenId.toString(),
      seller: seller.toString(),
      buyer: owner.toString(),
      price: ethers.utils.formatEther(price.toString()),
    };
    if (auctionPurchase) {
      console.log("soldData", soldData);

      nftSoldPost(soldData);
      auctionPurchase = false;
    }

    // setSucess(false);
    // onClose(false);
    // setTimeout(2000);
    // navigate("/profile");
  };

  const nftSoldPost = async (value) => {
    console.log("nftSoldPost");
    console.log("nftSoldPost", value);

    const response = await apis.postNftSold(value);
    console.log("response", response);
    alert("NFT bought");
    // navigate("/profile");
  };

  // const getProviderOrSigner = async () => {
  //   console.log("getProviderOrSigner");
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

  const handleBidEvent = async (tokenId, seller, highestBidder, highestBid) => {
    let bidData = {
      token_id: tokenId.toString(),
      seller: seller.toString(),
      bidder: highestBidder.toString(),
      bidding_price: ethers.utils.formatEther(highestBid.toString()),
    };

    console.log("bidData", bidData);
    ethBid = false;
    usdtBid = false;
    bidEventPost(bidData);
  };

  const bidEventPost = async (bidData) => {
    console.log("bidEventPost");
    const response = await apis.postBid(bidData);
    console.log("response", response);

    toast.success("Bid Succesful", {
      position: toast.POSITION.TOP_CENTER,
    });

    // setTimeout(() => {
    //   navigate("/");
    //   window.location.reload();
    // }, 3000);
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
  //   }
  // }, [walletConnected]);

  useEffect(() => {
    getAuctionData();
    getPriceInUSD();
    getStatusOfAuction();
  }, [highestBid]);

  // // return the price of NFT in usd
  const getAuctionData = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    let auctionData = await marketplaceContract._idToAuction(id);

    let highestBid = ethers.utils.formatEther(
      auctionData.highestBid.toString()
    );

    let basePrice = ethers.utils.formatEther(auctionData?.basePrice.toString());

    let priceETH = Number(highestBid);
    console.log("priceETH", priceETH);

    if (highestBid == 0) {
      setHighestBid(basePrice);
    } else {
      setHighestBid(highestBid);
    }

    // let dollarPriceOfETH = 1831;
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

    let priceInETH = dollarPriceOfETH.toString() / 1e18;
    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = priceETH;
    priceInUSD = oneETHInUSD * priceInUSD;
    // console.log("priceInUSD", priceInUSD);
    priceInUSD = priceInUSD.toFixed(2);

    setDollarPrice(priceInUSD.toString());
    // console.log("priceInUSD", priceInUSD);

    // let highBid = Number(highestBid.toString()) / 1e18;
    // console.log("HighestBidaaa", highBid);
  };

  const getValues = async () => {
    console.log(buyNowPrice, "buyNowPrice");
  };

  const bidWithFIAT = async () => {
    // console.log("startTime", startTime);
    // console.log("endTime", endTime);
    // console.log("price", price);
    // console.log("isLive", isLive);
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );
    let time = await marketplaceContract.getCurrentTimestamp();

    // console.log("block.timestamp", time);
    let auctionData = await marketplaceContract._idToAuction(id);

    const structData = await marketplaceContract._idToNFT(id);

    const getStatusOfAuction = await marketplaceContract.getStatusOfAuction(id);
    console.log("ooo getStatusOfAuction ", getStatusOfAuction);

    let highestBid = ethers.utils.formatEther(
      auctionData.highestBid.toString()
    );

    let startTime = auctionData?.startTime.toString();

    let endTime = auctionData?.endTime.toString();

    const unixTimestamp = Date.now();

    const currentDate = new Date(unixTimestamp);

    // Get the current time in hours, minutes, and seconds
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Format the time with leading zeros if necessary
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    console.log("Formatted time:", formattedTime);
  };

  let ethBid = false;
  const bidWithETH = async () => {
    // window.alert("KHAREED");

    ethBid = true;

    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    // console.log("Make payment");
    let price = buyNowPrice.toString();
    await marketplaceContract.bidInETH(id, 0, {
      value: ethers.utils.parseEther(price),
    });
    // console.log("Payment made");

    let response = marketplaceContract.on(
      "receivedABid",
      ethBid ? handleBidEvent : null
    );

    console.log("Response of bid even", response);
    ethBid = false;
  };

  let usdtBid = false;
  const bidWithUSDT = async () => {
    const signer = await getProviderOrSigner(true);

    usdtBid = true;
    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    const USDTContract = new Contract(
      TETHER_CONTRACT_ADDRESS.address,
      TETHER_CONTRACT_ABI.abi,
      signer
    );

    // need approval

    // console.log("paymentmethod", paymentMethod);
    console.log("highestBid", highestBid);

    console.log("id", id);
    console.log("id", typeof id);

    // get the price of dollar from smartcontract and convert this value
    // let dollarPriceOfETH = 1831;

    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
    console.log("HEre");

    let USDPrice = buyNowPrice;
    let USDPriceInWei = USDPrice * 10 ** 6;
    USDPrice = USDPrice.toString();

    const appprove = await USDTContract.approve(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      USDPriceInWei,
      {
        gasLimit: ethers.BigNumber.from("2000000"),
      }
    );

    appprove.wait();

    console.log("Approved");

    USDPriceInWei = USDPriceInWei.toString();
    console.log("USDPriceInWei", USDPriceInWei);

    // console.log("paymentmethod", paymentMethod);

    const tx = await marketplaceContract.bidInUSDT(id, USDPriceInWei, 1, {
      gasLimit: ethers.BigNumber.from("2000000"),
    });

    // Wait for the transaction to be mined
    await tx.wait();

    let response = marketplaceContract.on(
      "receivedABid",
      usdtBid ? handleBidEvent : null
    );

    console.log("Response of bid even", response);

    usdtBid = false;
  };

  const statusOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];

  const [showBuyOptionsStep2, setShowBuyOptionsStep2] = useState(false);

  const [buyNowPrice, setBuyNowPrice] = useState("");

  const [bidFunction, setBidFunction] = useState("");

  const bid = () => {
    if (buyNowPrice >= Number(highestBid).toFixed(3)) {
      console.log("ETH za", bidFunction);
      console.log("USDT za", buyNowPrice);
      if (bidFunction == 0) {
        console.log("bidding with ETH");
        bidWithETH();
        setSucess(false)
      } else if (bidFunction == 1) {
        console.log("bidding with USDT");
        bidWithUSDT();
        setSucess(false)
      } else if (bidFunction == 2) {
        console.log("bidding with FIAT");
        bidWithFIAT();
        setSucess(false)
      } else {
        console.log("please select a bid method first");
      }
    } else {
      toast.warning("your bid must be greater than last bid", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  return (
    <>
      <Drawer
        isVisible={isVisible}
        onClose={() => onClose(false)}
        className="profile-drawer-wrapper"
      >
        <div className="profile-drawer" style={{ position: "relative" }}>
          <span
            className="profile-drawer-cancle"
            onClick={() => onClose(false)}
          >
            x
          </span>
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-12"
              style={{ position: "relative" }}
            >
              {/* <span className="status-red">Status : Active</span> */}
              {/* <span className="status-yellow">Status : Active</span> */}
              <span className="status-green">Status : Active</span>
              <img className="nft-image" src={image} alt="" />
              {/* <img src="/assets/images/progress-bar.png" className='hide-on-mobile-screen' alt="" width={'100%'} style={{marginTop : '20px'}}/> */}

              {/* place your chart here */}
              <div className="Earning-Filter-Holder">
                <div className="d-flex align-items-center">
                  <p className="Earning-filter-text">Price History</p>
                </div>
                <div className="search-filter">
                  <div className="l-2">
                    <Dropdown
                      options={statusOptions}
                      onChange={(e) => {
                        handleStatus(e);
                      }}
                      value={status.label}
                    />
                  </div>
                </div>
              </div>
              <div className="earning-map">
                <div
                  style={{
                    position: "relative",
                    height: "400px",
                    background: "linear-gradient(to bottom, #ffffff, #F0F0F0)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "0",
                      left: "0",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {status.value === "Monthly" ? (
                      <ChartForEarning data={Monthly_data} />
                    ) : (
                      <div></div>
                    )}
                    {status.value === "Weekly" ? (
                      <ChartForEarning data={Weekly_data} />
                    ) : (
                      <div></div>
                    )}
                    {status.value === "Daily" ? (
                      <ChartForEarning data={Daily_data} />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="pro-dtails">
                <div className="first-line placeabid">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2>{title}</h2>
                    <img src="/assets/images/chack.png" alt="" />
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div className="AuctionWrapper-sc-7kf6vz-17 hNrWqi">
                      <div
                        id="container"
                        class="AuctionCountdownContainer-sc-ll8ha7-23 iqGEMd"
                      >
                        <div>
                          <p>
                            <span class="AuctionLabel-sc-ll8ha7-29 fJrkKm">
                              Auction ends in
                            </span>
                          </p>
                          <button class="CollectibleCardCountdown-sc-ll8ha7-30 lccacU">
                            <img
                              src="data:image/gif;base64,R0lGODlhEgASANUAAAwMDNzc3NTU1Hx8fCQkJHR0dPT09CwsLBQUFJycnGxsbOTk5MzMzKSkpOzs7JSUlBwcHMTExERERDw8PISEhFRUVDMzM1xcXGRkZExMTIyMjLy8vLS0tKysrPz8/AQEBP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzRkFCNEY5NDE2RDExRUM4MjRFQ0FCMDA3RUI4MTlFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzRkFCNEZBNDE2RDExRUM4MjRFQ0FCMDA3RUI4MTlFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTNGQUI0Rjc0MTZEMTFFQzgyNEVDQUIwMDdFQjgxOUUiIHN0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"
                              alt="running auction"
                            />
                            <span>
                              {<NftCountdown endDateTime={endTime} />}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="second-line">
                  <p>
                    Owned by{" "}
                    {userData?.wallet_address ==
                    nftDetails?.user?.wallet_address ? (
                      <Link to={"/profile"}>
                        <span>
                          {nftDetails?.user?.first_name}{" "}
                          {nftDetails?.user?.last_name}
                        </span>
                      </Link>
                    ) : (
                      <span
                        onClick={() =>
                          navigate(
                            `/other-profile?add=${nftDetails?.user?.wallet_address}`
                          )
                        }
                      >
                        {nftDetails?.owner?.username}
                      </span>
                    )}
                  </p>
                </div>
                <div className="three-line">
                  <div>
                    <TfiEye />
                    <span>2 View</span>
                  </div>
                  <div>
                    <AiOutlineHeart />
                    <span>5 Favorite</span>
                  </div>
                </div>
                <div className="four-line">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Creator</h3>
                      <div className="logo-name">
                        {
                          userData?.wallet_address ==
                          nftDetails?.user?.wallet_address ? (
                            <Link to={"/profile"}>
                              {nftDetails?.user?.profile_image ? (
                                <img
                                  src={nftDetails?.user?.profile_image}
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={"/public/assets/images/user-none.png"}
                                  alt=""
                                />
                              )}
                              <span>
                                {nftDetails?.user?.first_name}{" "}
                                {nftDetails?.user?.last_name}
                              </span>
                            </Link>
                          ) : (
                            <div
                              onClick={() =>
                                navigate(
                                  `/other-profile?add=${nftDetails?.user?.wallet_address}`,
                                  {
                                    state: {
                                      address: nftDetails?.user?.wallet_address,
                                    },
                                  }
                                )
                              }
                            >
                              <img
                                src={nftDetails?.user?.profile_image}
                                alt=""
                              />{" "}
                              <span>{nftDetails?.user?.username}</span>
                            </div>
                          )
                          // <Link to={`/other-profile?address=${nftDetails?.user?.wallet_address}`}>
                          //    <img src={nftDetails?.user?.profile_image} alt="" />{" "}
                          //   <span>{nftDetails?.user?.username}</span>
                          // </Link>
                        }
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Collection</h3>
                      <Link to={`collection?id=${nftDetails?.collection?.id}`}>
                        <div className="logo-name">
                          <img
                            src={nftDetails?.collection?.media[0]?.original_url}
                            alt=""
                          />{" "}
                          <span>{nftDetails?.collection?.name}</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="five-line">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12 hide-on-desktop-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "10px" }}
                      />
                    </div>
                    {/* <div className="col-lg-8 col-md-8 col-12">
                      <button
                        className={`${propertyTabs === 0 ? "active" : ""}`}
                        onClick={() => setPropertyTabs(0)}
                      >
                        Details
                      </button>
                      <button
                        className={`${propertyTabs === 1 ? "active" : ""}`}
                        onClick={() => setPropertyTabs(1)}
                      >
                        Bids
                      </button>
                      <button
                        className={`${propertyTabs === 2 ? "active" : ""}`}
                        onClick={() => setPropertyTabs(2)}
                      >
                        History
                      </button>
                    </div> */}
                    <div className="col-lg-4 col-md-4 col-12 hide-on-mobile-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "10px" }}
                      />
                    </div>
                  </div>
                </div>
                {/* <div>
                  {propertyTabs === 0 && <Details />}
                  {propertyTabs === 1 && <Bids />}
                  {propertyTabs === 2 && <History />}
                </div> */}
                <div className="six-line">
                  <h3>Base Price</h3>
                  <div className="row">
                    <div className="col-lg-12 col-md-8 col-8">
                      <div className="left">
                        <p>
                          {price} ETH
                          <p>Last bid {Number(highestBid).toFixed(3)} ETH</p>
                          <span>
                            Amount is USD ${amountUSD} + Platform Fee ${" "}
                            {platformFee}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-4">
                      <div className="right">
                        <p>{/* 13<span>in stock</span> */}</p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/assets/images/progress-bar.png"
                    className="hide-on-desktop-screen"
                    alt=""
                    width={"100%"}
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  />
                </div>
                <div className="seven-line" onClick={() => setChack(!chack)}>
                  <span>
                    <BsCheck className={`${chack ? "red" : "black"}`} />
                  </span>{" "}
                  <span>I agree all Terms & Conditions.</span>
                </div>
                <div className="eight-line">
                  {bidButton ? (
                    <button
                      className="nft-buy-btn"
                      disabled={!chack}
                      onClick={() => {
                        setSucess(true);
                      }}
                    >
                      Bid Now
                    </button>
                  ) : (
                    <button
                      className="nft-buy-btn"
                      disabled={bidDisable || !chack}
                      onClick={claimAuction}
                    >
                      Claim
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <button onClick={getStatusOfAuction}>getStatusOfAuction</button> */}
        </div>
      </Drawer>
      {/* <Modal
        show={sucess}
        onHide={() => setSucess(false)}
        centered
        size="lg"
        className="succes-modal-wrap"
        backdrop="static"
        keyboard={false}
      >
        <div className="modal-body" style={{ position: "relative" }}>
          <span onClick={() => setSucess(false)}>
            <AiOutlineClose />
          </span>
          <div className="mobal-button-1">
            <button onClick={bidWithETH}>Bid with ETH</button>
            <button onClick={bidWithUSDT}>Bid with USDT</button>
          </div>
          <div className="mobal-button-2">
            <button onClick={bidWithFIAT}>Bid with FIAT</button>
          </div>
        </div>
      </Modal> */}
      <Modal
        show={sucess}
        onHide={() => setSucess(false)}
        centered
        size="lg"
        className="succes-modal-wrap"
        backdrop="static"
        keyboard={false}
      >
        <div className="modal-body" style={{ position: "relative" }}>
          <span
            onClick={() => {
              setSucess(false), setShowBuyOptionsStep2(false);
            }}
          >
            <AiOutlineClose />
          </span>
          {!showBuyOptionsStep2 ? (
            <>
              <div className="mobal-button-1">
                <button
                  onClick={() => {
                    setBidFunction(0), setShowBuyOptionsStep2(true);
                  }}
                >
                  Bid with ETH
                </button>
                <button
                  onClick={() => {
                    setBidFunction(1), setShowBuyOptionsStep2(true);
                  }}
                >
                  Bid with USDT
                </button>
              </div>
              <div className="mobal-button-2">
                <button
                  onClick={() => {
                    setBidFunction(2), setShowBuyOptionsStep2(true);
                  }}
                >
                  Bid with FIAT
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="showBuyNow-step2">
                <input
                  type="number"
                  placeholder="Enter Price"
                  value={buyNowPrice}
                  onChange={(e) => setBuyNowPrice(e.target.value)}
                />
                <div className="btn-holder-for-showBuyNow">
                  <div className="popUp-btn-group">
                    <div className="button-styling-outline btnCC">
                      <div
                        onClick={() => {
                          setShowBuyOptionsStep2(false), setBuyNowPrice("");
                        }}
                        className="btnCCin"
                      >
                        Cancel
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        getValues, bid();
                      }}
                      className="button-styling btnCC"
                    >
                      Send
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
      <ToastContainer />
        </div>
      </Modal>
    </>
  );
};

export default PlaceABidDrawer;
