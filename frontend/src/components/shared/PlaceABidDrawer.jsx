import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useContext,
} from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import SocialShare from "./SocialShare";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import MarketplaceAddress from "../../contractsData/ArtiziaMarketplace-address.json";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import NftCountdown from "./NftCountdown";
import { Store } from "../../Context/Store";
import HeaderConnectPopup from "../../pages/Headers/HeaderConnectPopup";
import EmailSigninPopup from "../../pages/Headers/EmailSigninPopup";

const PlaceABidDrawer = ({
  setLoader,
  isVisible,
  onClose,
  id,
  isLive,
  title,
  image,
  description,
  basePrice,
  startTime,
  endTime,
  highestBidIntoETH,
  highestBidIntoUSDT,
  highestBidderAddress,
  royaltyPrice,
  collection,
  collectionImages,
  seller,
  owner,
  firstOwner,
  user_id,
  nft_like,
  is_unapproved,
}) => {
  const [chack, setChack] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [ethShow, setEthShow] = useState(false);
  const [usdtShow, setUSDTShow] = useState(false);
  const [nftDetails, setNftDetails] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");
  const [platformFeeInETH, setPlatformFeeInETH] = useState(0);
  const [platformFeeInUSDT, setPlatformFeeInUSDT] = useState(0);
  const [emailSigninPopup, setEmailSigninPopup] = useState(false);
  const [imputAmount, setInputAmount] = useState("");
  const {
    account,
    checkIsWalletConnected,
    getSignerMarketContrat,
    getSignerUSDTContrat,
  } = useContext(Store);
  const [buyerPercentage, setBuyerPercentage] = useState(150);
  const [buyerPlan, setBuyerPlan] = useState(3);
  const [sellerPlan, setSellerPlan] = useState(3);

  const userData = JSON.parse(localStorage.getItem("data"));
  let userAddress = userData?.wallet_address;
  const getBuyerPlan = userData?.subscription_plan;

  const navigate = useNavigate();

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const [earning, setEarning] = useState([]);

  const handleStatus = (e) => {
    setStatus(e);
  };

  const unixTimestamp = Math.floor(Date.now() / 1000);
  
  const getEarning = async () => {
    const response = await apis.getSalesHistory();
    console.log(response?.data?.data);
    setEarning(response?.data?.data);
    setLoader(false);    
  };
  
  
  
  useEffect(() => {
    getEarning();
  }, []);

  useEffect(()=>{
  },[earning])
  
  var today = new Date(); // Get the current date and time
  var last30Days = [];

  for (var i = 0; i < 30; i++) {
    var day = new Date(today);
    day.setDate(today.getDate() - i);
    var dayOfMonth = day.getDate(); // Get the day of the month
    last30Days.push(dayOfMonth);
  }

  const Monthly_data = [
    {
      data: "Jan",
      value: earning?.allMonths_earning?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Feb",
      value: earning?.allMonths_earning?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Mar",
      value: earning?.allMonths_earning?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Apr",
      value: earning?.allMonths_earning?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "May",
      value: earning?.allMonths_earning?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "June",
      value: earning?.allMonths_earning?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "July",
      value: earning?.allMonths_earning?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Aug",
      value: earning?.allMonths_earning?.[7],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Sep",
      value: earning?.allMonths_earning?.[8],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Oct",
      value: earning?.allMonths_earning?.[9],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Nov",
      value: earning?.allMonths_earning?.[10],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Dec",
      value: earning?.allMonths_earning?.[11],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];
  const Weekly_data = [
    // {
    //   data: "1",
    //   value: earning?.lastWeek_earning?.[0],
    //   Average_price: "0.62 ETH",
    //   Num_sales: "1",
    //   Date: "May 07 at 5:00 PM",
    // },
    {
      data: last30Days[6],
      value: earning?.lastWeek_earning?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[5],
      value: earning?.lastWeek_earning?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data:last30Days[4],
      value: earning?.lastWeek_earning?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[3],
      value: earning?.lastWeek_earning?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[2],
      value: earning?.lastWeek_earning?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    
    {
      data: last30Days[1],
      value: earning?.lastWeek_earning?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
   
    {
      data: last30Days[0],
      value: earning?.lastWeek_earning?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];

  const Daily_data = [
    {
      data: last30Days[29],
      value: earning?.LastMonth_earning?.[29],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[28],
      value: earning?.LastMonth_earning?.[28],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data:  last30Days[27],
      value: earning?.LastMonth_earning?.[27],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[26],
      value: earning?.LastMonth_earning?.[26],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[25],
      value: earning?.LastMonth_earning?.[25],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[24],
      value: earning?.LastMonth_earning?.[24],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[23],
      value: earning?.LastMonth_earning?.[23],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[22],
      value: earning?.LastMonth_earning?.[22],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[21],
      value: earning?.LastMonth_earning?.[21],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[20],
      value: earning?.LastMonth_earning?.[20],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[19],
      value: earning?.LastMonth_earning?.[19],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[18],
      value: earning?.LastMonth_earning?.[18],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[17],
      value: earning?.LastMonth_earning?.[17],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[16],
      value: earning?.LastMonth_earning?.[16],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[15],
      value: earning?.LastMonth_earning?.[15],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[14],
      value: earning?.LastMonth_earning?.[14],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[13],
      value: earning?.LastMonth_earning?.[13],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[12],
      value: earning?.LastMonth_earning?.[12],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[11],
      value: earning?.LastMonth_earning?.[11],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[10],
      value: earning?.LastMonth_earning?.[10],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[9],
      value: earning?.LastMonth_earning?.[9],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[8],
      value: earning?.LastMonth_earning?.[8],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[7],
      value: earning?.LastMonth_earning?.[7],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[6],
      value: earning?.LastMonth_earning?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[5],
      value: earning?.LastMonth_earning?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data:last30Days[4],
      value: earning?.LastMonth_earning?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[3],
      value: earning?.LastMonth_earning?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: last30Days[2],
      value: earning?.LastMonth_earning?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    
    {
      data: last30Days[1],
      value: earning?.LastMonth_earning?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
   
    {
      data: last30Days[0],
      value: earning?.LastMonth_earning?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];  
  
  const buyerFeeCalculate = (_amount, _buyerPercent) => {
    return (_amount * _buyerPercent) / 10000;
  };

  const getBuyerPlans = async () => {
    let _buyerPercent;
    if (getBuyerPlan == 4) {
      _buyerPercent = 0;
    } else if (getBuyerPlan == 3) {
      _buyerPercent = 100;
    } else {
      _buyerPercent = 150;
    }
    setBuyerPlan(getBuyerPlan);
    setBuyerPercentage(_buyerPercent);

    if (+basePrice?.toString() > +highestBidIntoETH?.toString()) {
      const fee = buyerFeeCalculate(+basePrice?.toString(), buyerPercentage);
      setPlatformFeeInETH(fee);
      if (fee != 0) {
        const ethIntoUsdtBase = await getSignerMarketContrat().getETHIntoUSDT(
          fee?.toString()
        );
        setPlatformFeeInUSDT(+ethIntoUsdtBase?.toString() / 10 ** 6);
      }
    } else if (+highestBidIntoETH?.toString() > +basePrice?.toString()) {
      const fee = buyerFeeCalculate(+highestBidIntoETH?.toString(),buyerPercentage);
      setPlatformFeeInETH(fee);
      if (fee != 0) {
        const ethIntoUsdtBase = await getSignerMarketContrat().getETHIntoUSDT(
          fee?.toString()
        );
        setPlatformFeeInUSDT(+ethIntoUsdtBase?.toString() / 10 ** 6);
      }
    }
  };

  const getNFTDetailByNFTTokenId = async () => {
    const response = await apis.getNFTByTokenId(id);
    setNftDetails(response?.data?.data);
    setSellerPlan(response?.data?.data?.subscription_plan);
  };

  const getNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp?.id;
    const response = await apis.getLikeNFT(address, id);
    setLikeAndViewData(response?.data?.data);
  };

  const postNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.postLikeNFT({
      like_by: address,
      nft_token: id,
    });
    getNFTLike();
  };

  const postNFTView = async () => {
    var temp = JSON.parse(localStorage?.getItem("data"));
    var address = temp?.id;
    const response = await apis.postViewNFT({
      view_by: address,
      nft_token: id,
    });
    getNFTLike();
  };

  useEffect(() => {
    if (isVisible) {
      getNFTDetailByNFTTokenId();
      postNFTView();
    }
  }, [isVisible]);

  useEffect(() => {
    getBuyerPlans();
    checkIsWalletConnected();
  }, [account, getBuyerPlan]);

  let ethBid = false;
  const bidWithETH = async (amount) => {
    setLoader(true);
    try {
      //please note buyerFeeCalculate main Plane(1,2) nhi percentage(0,100,150) jaigi
      let baseTex = buyerFeeCalculate(+basePrice.toString(), +buyerPercentage);
      let highestBidTex = buyerFeeCalculate(
        +highestBidIntoETH,
        +buyerPercentage
      );

      let bidAmount = ethers.utils.parseEther(amount?.toString());

      if (+bidAmount?.toString() < +basePrice + +baseTex)
        return (
          setInputAmount(""),
          toast.error("Bid amount must be graterthan basePrice "),
          setLoader(false)
        );
      if (+bidAmount?.toString() <= +highestBidIntoETH + +highestBidTex)
        return (
          setInputAmount(""),
          toast.error("Bid amount must be graterthan last highest bid"),
          setLoader(false)
        );

      ethBid = true;

      let bid = await getSignerMarketContrat().bidInETH(id, buyerPlan, {
        value: bidAmount?.toString(),
        gasLimit: ethers.BigNumber.from("2000000"),
      });

      await bid.wait();

      let response = getSignerMarketContrat().on(
        "receivedABid",
        ethBid ? handleBidEvent : null
      );

      ethBid = false;
      setTimeout(() => {
        setLoader(false);
      }, [10000]);
      window.location.reload();
    } catch (error) {
      setLoader(false);
      toast.error(error?.data?.message);
    }
  };

  let usdtBid = false;
  const bidWithUSDT = async (amount) => {
    setLoader(true);
    try {
      let usdtAmount = +amount * 10 ** 6;
      //please note buyerFeeCalculate main Plane(1,2) nhi percentage(0,100,150) jaigi
      let baseTex = buyerFeeCalculate(+basePrice.toString(), +buyerPercentage);
      let highestBidTex = buyerFeeCalculate(
        +highestBidIntoETH,
        +buyerPercentage
      );

      let highBid = +highestBidIntoETH + +highestBidTex;
      let BaseAmount = +baseTex + +basePrice?.toString();

      let accBalance = await getSignerUSDTContrat().balanceOf(userAddress);

      if (usdtAmount > +accBalance.toString()) {
        return (
          toast.error("you dont have balance", {
            position: toast.POSITION.TOP_CENTER,
          }),
          setLoader(true)
        );
      }

      let ethIntoUsdtBase;
      let ethIntoUsdtBid;
      if (BaseAmount?.toString() > highBid?.toString()) {
        ethIntoUsdtBase = await getSignerMarketContrat().getETHIntoUSDT(
          BaseAmount?.toString()
        );
      } else if (highBid?.toString() > BaseAmount?.toString()) {
        ethIntoUsdtBid = await getSignerMarketContrat().getETHIntoUSDT(
          highBid?.toString()
        );
      }

      if (usdtAmount < ethIntoUsdtBase || ethIntoUsdtBase == 0)
        return (
          setInputAmount(""),
          toast.error("Bid amount must be graterthan basePrice "),
          setLoader(false)
        );
      if (usdtAmount <= ethIntoUsdtBid || ethIntoUsdtBid == 0)
        return (
          setInputAmount(""),
          toast.error("Bid amount must be graterthan last highest bid"),
          setLoader(false)
        );

      const appprove = await getSignerUSDTContrat().approve(
        getSignerMarketContrat().address,
        usdtAmount,
        {
          gasLimit: ethers.BigNumber.from("2000000"),
        }
      );

      appprove.wait();

      const tx = await getSignerMarketContrat().bidInUSDT(
        id,
        usdtAmount,
        sellerPlan
      );
      await tx.wait();

      let response = getSignerMarketContrat().on(
        "receivedABid",
        usdtBid ? handleBidEvent : null
      );

      usdtBid = false;
      setTimeout(() => {
        setLoader(false);
      }, [10000]);
      window.location.reload();
    } catch (error) {
      setLoader(false);
      toast.error(error?.data?.message);
    }
  };

  let auctionPurchase = false;
  const claimAuction = async () => {
    setLoader(true);
    try {
      auctionPurchase = true;

      await (
        await getSignerMarketContrat().closeAuction(
          NFT_CONTRACT_ADDRESS.address,
          id,
          sellerPlan,
          nftDetails?.user_id, //selllerId
          userData?.id //buyerId
        )
      ).wait();

      let response = getSignerMarketContrat().on(
        "NFTSold",
        auctionPurchase ? handleNFTSoldEvent : null
      );

      setTimeout(() => {
        setLoader(false);
      }, [10000]);
      window.location.reload();
    } catch (error) {
      toast.error(error?.data?.message), setLoader(false);
    }
  };

  const handleNFTSoldEvent = async (
    nftContract,
    tokenId,
    price,
    seller,
    buyer
  ) => {
    let soldData = {
      nftContract: nftContract?.toString(),
      token_id: tokenId?.toString(),
      seller: seller?.toString(),
      buyer: buyer?.toString(),
      price: price?.toString(),
    };

    if (auctionPurchase) {
      nftSoldPost(soldData);
      auctionPurchase = false;
    }
  };

  const nftSoldPost = async (value) => {
    // const response = await apis.postNftSold(value);
    // console.log("response", response);
    setLoader(false);
    toast.success("NFT bought");
    navigate("/profile");
  };

  const handleBidEvent = async (
    tokenId,
    seller,
    highestBidder,
    highestBidIntoETH,
    highestBidIntoUSDT
  ) => {
    let bidData = {
      token_id: tokenId?.toString(),
      seller: seller?.toString(),
      bidder: highestBidder?.toString(),
      bidding_price: highestBidIntoETH?.toString(),
    };
    ethBid = false;
    usdtBid = false;
    bidEventPost(bidData);
  };

  const bidEventPost = async (bidData) => {
    // const response = await apis.postBid(bidData);
    // console.log("response", response);
    setLoader(false);
    toast.success("Bid Succesful", {
      position: toast.POSITION.TOP_CENTER,
    });
    window.location.reload();
    // setTimeout(() => {
    //   navigate("/");
    //   window.location.reload();
    // }, 3000);
  };

  const statusOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];

  const [connectPopup, setConnectPopup] = useState(false);
  const userWalletAddress = localStorage.getItem("userAddress");

  const navigateTo = (id) => {
    if (userData) {
      navigate(`/collection?id=${id}`);
    } else {
      setEmailSigninPopup(true);
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
              <span className="status-green">
                {unixTimestamp < +startTime
                  ? "Coming Soon"
                  : unixTimestamp > +startTime && unixTimestamp < +endTime
                  ? "Active"
                  : "Ended"}
              </span>
              <img className="nft-image" src={image} alt="" />

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
                      value={status?.label}
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
                    {status?.value === "Monthly" ? (
                      <ChartForEarning
                        data={Monthly_data}
                        chartLabel="Total Earning"
                      />
                    ) : (
                      <div></div>
                    )}
                    {status?.value === "Weekly" ? (
                      <ChartForEarning
                        data={Weekly_data}
                        chartLabel="Total Earning"
                      />
                    ) : (
                      <div></div>
                    )}
                    {status?.value === "Daily" ? (
                      <ChartForEarning
                        data={Daily_data}
                        chartLabel="Total Earning"
                      />
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
                        className="AuctionCountdownContainer-sc-ll8ha7-23 iqGEMd"
                      >
                        <div>
                          <p>
                            {startTime > unixTimestamp ? null : (
                              <span className="AuctionLabel-sc-ll8ha7-29 fJrkKm">
                                Auction ends in
                              </span>
                            )}
                          </p>
                          <button className="CollectibleCardCountdown-sc-ll8ha7-30 lccacU">
                            {/* <img
                              src="data:image/gif;base64,R0lGODlhEgASANUAAAwMDNzc3NTU1Hx8fCQkJHR0dPT09CwsLBQUFJycnGxsbOTk5MzMzKSkpOzs7JSUlBwcHMTExERERDw8PISEhFRUVDMzM1xcXGRkZExMTIyMjLy8vLS0tKysrPz8/AQEBP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzRkFCNEY5NDE2RDExRUM4MjRFQ0FCMDA3RUI4MTlFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzRkFCNEZBNDE2RDExRUM4MjRFQ0FCMDA3RUI4MTlFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTNGQUI0Rjc0MTZEMTFFQzgyNEVDQUIwMDdFQjgxOUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTNGQUI0Rjg0MTZEMTFFQzgyNEVDQUIwMDdFQjgxOUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQFBAAgACwAAAAAEgASAAAGGMCPcEgsGo/IpHLJbDqf0Kh0Sq1ar1hsEAAh+QQFBAAgACwIAAgAAgACAAAGBUCBUBAEACH5BAUEACAALAYABgAGAAYAAAYVQEDD40kAEkTiMEk0MIvMxtFgMAYBACH5BAUEACAALAQABAAKAAoAAAYpQBDowvB4GBch6GFsehJDJ6hJlE6PVqHTaixKu5ctdSl+KC8RYyQJCgIAIfkEBQQAIAAsAgACAA4ADgAABkBAkJDwWHg8iwdByMQcn08FUwEVQqWQKhP0JGq3x0fgyzwayWU02DNGmx/qcJb8hICc1WsTCsVsQRBiRwEPdkJBACH5BAUEACAALAEAAQAQABAAAAZTQJBQCKgUChXEcAlCJDxQEDShXB4WzOHiMERgs9rqE7xMgABRstCDqKTVnooCvjzSh8g3OY6+ewAgD3dmTV9kC1UgV4dcSwgPaVOJTEUKBRmAS0EAIfkEBQQAIAAsAQABABAAEAAABlBAkFD4KRqHSFARcaFQLojjsEhJgiiAY3FjFW601a6QYkSIkdHP5Ty8FAfsMTV+La7j7g/CEE9/wmJkRB9cXV9af3xIZFJKehcDT35dRo1CQQAh+QQFBAAgACwCAAIADgAOAAAGQUCQEPQpGofID6SQSBQgR+FHgRQqjtPq8EpEaJHQT+E7LBQTZGHinAatxW3zx5sOZ79cqcJQzQ/nTAkKdlVGUUJBACH5BAUEACAALAMAAwAMAAwAAAY5QJDwkykMJJ+hUBIQChdI4cRJBSE/i6pz8ZFoqZLC1zkQj0EF7znzaX4DyelXDZq4hQG5s1tIJ4VBACH5BAUEACAALAMAAwAMAAwAAAY4QJBQ0mAwGhKhENDxKEGeDkDYfCo7IInTKvQQuc8iWGkcC49mEHLL9arHWBCgwYZKn5KEMZEUBgEAIfkEBQQAIAAsAgACAA4ADgAABkVAkHBIIAyPQkLD4PEYGsajhIk0SIhUJMgQbWiP3u13aAARmmOQhwBBj9fidBmUSIPCkLmWO5zoyRNIEAlMTglRXxCIQ0EAIfkEBQQAIAAsAgACAA4ADgAABkJAkFAIsFgAwyTowPEIPZyDsqJ8UoUHZxXkkYKaWyEHBNCGPQDvGWRRn4/mLfq7Hi/P3WEm/swoDx1aUG5JaQdISUEAIfkEBQQAIAAsAgACAA4ADgAABkRAkFD4ASA+wyQI8VgIHZpj0uJUOixDhEM5dEg13OQD9KmGQY7iOYkArIeA8jsNAq/tCLNVCjpsrQdKCBpVC1FnRXFKQQAh+QQFBAAgACwCAAIADgAOAAAGPkCQcPgpEomAgUAoGACOhMBwGDgMAdIp9QkaaLVe0PI7XH7IWiP6OEaPw+gwFh3ggqLfAEELKIwFBXZfalNBACH5BAUEACAALAMAAwAMAAwAAAY0QBDog4k4HBHMRwhCMJhMBmT4hEaJVitmk4Uau8wjWOjgjpNjkLKaZSydbQSTuHEskktQEAAh+QQFBAAgACwDAAMADAAMAAAGL0CQUMEwGEAKgBAEESyXTmH0KQUoqFRFBMvtgo7e79bLuHrN3SiEK1gvtSAHchkEACH5BAUEACAALAMAAwAMAAwAAAY0QBAIMBB4PIKBUEgILJeBw9D5hIKU1Wcx+zRyl8evECkGJcsDADUbAICabMISUDAiC25QEAAh+QQFBAAgACwDAAIADQANAAAGMUCQcAgYGoWUgDBAQRgPiyMoOqRKF06K1KhVbpffYzE89H6V2nDaesRWr9I0KDBwCoMAIfkEBQQAIAAsAwACAAwADQAABiNAkHD4IQ6PQ8AxgGw6hYDBc0qtWqfSKtMZUIK2y8MxmxQGAQAh+QQFBAAgACwDAAMADQAMAAAGKECQcCAQCgbCJCHJDDSZT6gUhCxOjVfoJ8u0Xr1ZJHcsXDILSQE6GQQAIfkEBQQAIAAsAwADAAwADAAABhxAkLAgLBqPRgJySVw6n9CoFNR8fqDXaRZkOAYBACH5BAUEACAALAMAAwAMAAwAAAYbQJBwICwaj8ikcslsOp9QgGAJEE6ZVZDBcwwCACH5BAUEACAALAMABAALAAsAAAYXQJBwSDwQj8IBcslsOp9DpTPwpEI9xyAAIfkEBQQAIAAsBgADAAkADAAABhVAkBAUGBqPyKQSWVw6n9DnwDgVBgEAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsBgAOAAEAAQAABgPAQhAAIfkEBQQAIAAsCgADAAUADAAABg9AAWhILBqPQyFyyTwWiEEAIfkEBQQAIAAsAwALAAEAAQAABgPAQhAAIfkEBQQAIAAsAwALAAEAAQAABgPAQRAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAwADAAwADAAABi9AkLDAEDIKQiEkyQQtQYJmEylNEqtJhgGb3HJBRe7xi4xWzRAzUw36gA2GohsUBAAh+QQFBAAgACwDAAMADAAMAAAGM0AQ6DNJRBiJyUc4bDCZjeUn8XxGJ9VqMfs0cpmMyFcYeYxBybOSyo0O2V2pcPKIlLHCIAAh+QQFBAAgACwDAAMADAAMAAAGMUCQEFFIJAoQoVKhXDqbTogB2oQwqcoiVmncChPXbQEx3SJAYWhYUX4qEYrEQ5EUBgEAIfkEBQQAIAAsAwADAAwADAAABjpAkPADOBwAn6EQ8BAKH8glw+kUID9NqvNBNGipn8OXahGPhYePd2xAZr9cEGCqtTqZawNU+wmnk0JBACH5BAUEACAALAMAAwAMAAwAAAY7QJAQ9Ckah0SAotFQAI4fywK5sBgBUyTI8fwotMPvpwEWNork8hn0LSuKWPCi+zlkhYsDVMl0Qod/IEEAIfkEBQQAIAAsBAAEAAoACgAABipAEOhDLAqHlogwYilajsfmRwkFRYjVI+CTFRKp0OvHYqhKx5vleVjEgoIAIfkEBQQAIAAsBQAFAAkACAAABilA0AdRqSA+wk/GAAIZMkgEs+k8VqjUyueKBV0B06bhqJw+kUJAkQwKAgAh+QQFBAAgACwFAAUACAAIAAAGIUAQ6EMsDieNxqQ4EQqXn4QT1CBKndVP0wnVJhLdoREUBAAh+QQFBAAgACwGAAYABgAGAAAGFUDQZ0isOByVoQMEciiZzk/mmCFagwAh+QQFBAAgACwHAAcABAAEAAAGDsCPRCIEgSQTI3Ey+QQBACH5BAUEACAALAcABwAEAAQAAAYLQNBn+NFohkbiMAgAIfkEBQQAIAAsCAAIAAIAAgAABgZAAgFCCAIAIfkEBQQAIAAsCAAIAAIAAgAABgXAj/ATBAAh+QQFBAAgACwAAAAAAQABAAAGA0BQEAAh+QQFBAAgACwAAAAAAQABAAAGA0BQEAA7"
                              alt="running auction"
                            /> */}
                            <span>
                              {isLive ? (
                                <NftCountdown
                                  endDateTime={new Date(endTime * 1000)}
                                />
                              ) : startTime > unixTimestamp ? (
                                "Coming Soon"
                              ) : (
                                "Auction Ended"
                              )}
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
                          navigate(`/other-profile?add=${nftDetails?.user?.id}`)
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
                    <span>
                      {likeAndViewData?.view_count == ""
                        ? "00"
                        : likeAndViewData?.view_count}{" "}
                      View
                    </span>
                  </div>
                  <div onClick={() => postNFTLike()}>
                    {likeAndViewData?.is_liked == 0 ? (
                      <AiOutlineHeart />
                    ) : (
                      <AiFillHeart style={{ fill: "#2636d9" }} />
                    )}
                    <span>
                      {likeAndViewData?.like_count == ""
                        ? "0"
                        : likeAndViewData?.like_count}{" "}
                      Favorite
                    </span>
                  </div>
                </div>
                <div className="four-line">
                  <p>{description}</p>
                </div>
                <div className="four-line">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Creator</h3>
                      <div className="logo-name">
                        {userData?.id == nftDetails?.user?.id ? (
                          <Link to={`/profile`}>
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
                                `/other-profile?add=${nftDetails?.user?.id}`,
                                {
                                  state: {
                                    address: nftDetails?.user?.wallet_address,
                                  },
                                }
                              )
                            }
                          >
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
                            <span>{nftDetails?.user?.username}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Collection</h3>
                      {/* <Link to={`collection?id=${nftDetails?.collection?.id}`}> */}
                      <div
                        className="logo-name"
                        onClick={() => navigateTo(nftDetails?.collection?.id)}
                      >
                        <img
                          src={nftDetails?.collection?.media[0]?.original_url}
                          alt=""
                        />{" "}
                        <span>{nftDetails?.collection?.name}</span>
                      </div>
                      {/* </Link> */}
                    </div>
                  </div>
                </div>

                <div className="five-line">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12 hide-on-desktop-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "10px" }}
                        user_id={user_id}
                      />
                    </div>

                    <div className="col-lg-4 col-md-4 col-12 hide-on-mobile-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "10px" }}
                        user_id={user_id}
                      />
                    </div>
                  </div>
                </div>

                <div className="six-line">
                  <h3>Base Price</h3>
                  <div className="row">
                    <div className="col-lg-12 col-md-8 col-8">
                      <div className="left">
                        <p>
                          {Number(
                            ethers.utils.formatEther(basePrice?.toString())
                          )?.toFixed(5)}{" "}
                          ETH
                          <p>
                            Last bid{" "}
                            {Number(
                              ethers.utils.formatEther(
                                highestBidIntoETH?.toString()
                              )
                            )?.toFixed(5)}{" "}
                            ETH
                          </p>
                          <p>
                            Platfrom Fee{" "}
                            {Number(
                              ethers.utils.formatEther(
                                platformFeeInETH?.toString()
                              )
                            )?.toFixed(5)}{" "}
                            ETH
                          </p>
                          <span>
                            Last bid $ {+highestBidIntoUSDT?.toString() / 10 ** 6} + Platform
                            Fee $ {+platformFeeInUSDT?.toFixed(5)}
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
                {
                  <>
                    {unixTimestamp > startTime && unixTimestamp < endTime && (
                      <div
                        className="seven-line"
                        onClick={() => setChack(!chack)}
                      >
                        <span>
                          <BsCheck className={`${chack ? "red" : "black"}`} />
                        </span>{" "}
                        <span>I agree to all the terms and policies</span>
                      </div>
                    )}

                    <div className="eight-line">
                      {userWalletAddress === "false" ? (
                        <button
                          className="nft-buy-btn"
                          disabled={!chack}
                          onClick={() => {
                            if (userWalletAddress === "false") {
                              setConnectPopup(true);
                            }
                          }}
                        >
                          Bid Now
                        </button>
                      ) : unixTimestamp < +startTime ? (
                        <button className="nft-buy-btn">Coming Soon</button>
                      ) : unixTimestamp < +endTime &&
                        account?.toString()?.toLowerCase() !==
                          seller?.toString()?.toLowerCase() ? (
                        <button
                          className="nft-buy-btn"
                          disabled={!chack}
                          onClick={() => {
                            if (userWalletAddress === "false") {
                              setConnectPopup(true);
                            } else {
                              setSucess(true);
                            }
                          }}
                        >
                          Bid Now
                        </button>
                      ) : unixTimestamp > +endTime &&
                        account?.toString()?.toLowerCase() ===
                          seller?.toString()?.toLowerCase() ? (
                        <button className="nft-buy-btn" onClick={claimAuction}>
                          Claim
                        </button>
                      ) : unixTimestamp > +endTime &&
                        account?.toString()?.toLowerCase() ===
                          highestBidderAddress?.toString()?.toLowerCase() ? (
                        <button className="nft-buy-btn" onClick={claimAuction}>
                          Claim
                        </button>
                      ) : unixTimestamp < +endTime &&
                        account?.toString()?.toLowerCase() ===
                          seller?.toString()?.toLowerCase() ? (
                        <button className="nft-buy-btn">Ongoing</button>
                      ) : (
                        <button className="nft-buy-btn">Auctin Ended</button>
                      )}
                    </div>
                  </>
                }
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* bidding Model */}
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
              setSucess(false);
            }}
          >
            <AiOutlineClose />
          </span>

          <div className="mobal-button-1">
            <button
              onClick={() => {
                setEthShow(true);
              }}
            >
              Bid with ETH
            </button>
            <button
              onClick={() => {
                setUSDTShow(true);
              }}
            >
              Bid with USDT
            </button>
          </div>
        </div>
      </Modal>

      {/* buyWithETH Model */}
      <Modal
        show={ethShow}
        onHide={() => setEthShow(false)}
        centered
        size="lg"
        className="succes-modal-wrap"
        backdrop="static"
        keyboard={false}
      >
        <div className="modal-body" style={{ position: "relative" }}>
          <span
            onClick={() => {
              setEthShow(false);
            }}
          >
            <AiOutlineClose />
          </span>
          <div className="showBuyNow-step2">
            <input
              type="number"
              placeholder="Enter Bid Amount In ETH"
              value={imputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
            />
            <div className="btn-holder-for-showBuyNow">
              <div className="popUp-btn-group">
                <div className="button-styling-outline btnCC">
                  <div
                    onClick={() => {
                      setInputAmount(""), setEthShow(false);
                    }}
                    className="btnCCin"
                  >
                    Cancel
                  </div>
                </div>
                <div
                  onClick={() => {
                    bidWithETH(imputAmount);
                  }}
                  className="button-styling btnCC"
                >
                  Send
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* buyWithUSDT Model */}
      <Modal
        show={usdtShow}
        onHide={() => setUSDTShow(false)}
        centered
        size="lg"
        className="succes-modal-wrap"
        backdrop="static"
        keyboard={false}
      >
        <div className="modal-body" style={{ position: "relative" }}>
          <span
            onClick={() => {
              setUSDTShow(false);
            }}
          >
            <AiOutlineClose />
          </span>
          <div className="showBuyNow-step2">
            <input
              type="number"
              placeholder="Enter Bid Amount In USDT"
              value={imputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
            />
            <div className="btn-holder-for-showBuyNow">
              <div className="popUp-btn-group">
                <div className="button-styling-outline btnCC">
                  <div
                    onClick={() => {
                      setUSDTShow(false), setInputAmount("");
                    }}
                    className="btnCCin"
                  >
                    Cancel
                  </div>
                </div>
                <div
                  onClick={() => {
                    bidWithUSDT(imputAmount);
                  }}
                  className="button-styling btnCC"
                >
                  Send
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <HeaderConnectPopup
        connectPopup={connectPopup}
        setConnectPopup={setConnectPopup}
      />
      <EmailSigninPopup
        emailSigninPopup={emailSigninPopup}
        setEmailSigninPopup={setEmailSigninPopup}
      />
    </>
  );
};

export default PlaceABidDrawer;
