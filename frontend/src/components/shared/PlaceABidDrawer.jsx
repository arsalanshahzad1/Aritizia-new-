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
  nftId,
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
  collection,
  collectionImages,
  seller,
  owner,
  firstOwner,
  user_id,
  nft_like,
}) => {
  const [chack, setChack] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [ethShow, setEthShow] = useState(false);
  const [usdtShow, setUSDTShow] = useState(false);
  const [nftDetails, setNftDetails] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");
  const [platformFeeInETH, setPlatformFeeInETH] = useState(0);

  const [priceInUsdt, setPriceInUsdt] = useState(0);

  const [platformFeeInUSDT, setPlatformFeeInUSDT] = useState(0);

  const [priceInUsdtWithTax, setPriceInUSDTPlusTax] = useState(0);
  const [priceInEthWithTax, setPriceInETHPlusTax] = useState(0);

  const [emailSigninPopup, setEmailSigninPopup] = useState(false);
  const [imputAmount, setInputAmount] = useState("");
  const {
    account,
    checkIsWalletConnected,
    getSignerMarketContrat,
    getProviderMarketContrat,
    getSignerUSDTContrat,
  } = useContext(Store);
  const [buyerPercentage, setBuyerPercentage] = useState(150);
  const [buyerPlan, setBuyerPlan] = useState(3);
  const [sellerPlan, setSellerPlan] = useState(3);

  const userData = JSON.parse(localStorage.getItem("data"));
  let userAddress = userData?.wallet_address;
  let userId = userData?.id;
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
    try {
      setEarning(response?.data?.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(error);
    }
  };

  // console.log(nftId,"nftIdnftIdnftIdnftIdnftId")
  useEffect(() => {
    if (userId) {
      getEarning();
    }
  }, []);

  useEffect(() => {}, [earning]);

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
      data: last30Days[4],
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
      data: last30Days[27],
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
      data: last30Days[4],
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
    let _buyerPercents;
    if (getBuyerPlan == 4) {
      _buyerPercents = 0;
    } else if (getBuyerPlan == 3) {
      _buyerPercents = 100;
    } else {
      _buyerPercents = 150;
    }
    setBuyerPlan(getBuyerPlan);
    setBuyerPercentage(_buyerPercents);

    if (+basePrice?.toString() > +highestBidIntoETH?.toString()) {
      const fee = buyerFeeCalculate(+basePrice?.toString(), _buyerPercents);
      setPlatformFeeInETH(fee); //This is fee in Eth from calculator fees
      let totalFee = +fee + +basePrice?.toString();
      setPriceInETHPlusTax(totalFee / 10 ** 18);

      if (fee > 0) {
        const ethIntoUsdtTax = await getProviderMarketContrat().getETHIntoUSDT(
          totalFee?.toString()
        );
        // setPlatformFeeInUSDT(+ethIntoUsdtTax?.toString() / 10 ** 6);
        setPriceInUSDTPlusTax(ethIntoUsdtTax?.toString() / 10 ** 6);
      }
    } else if (+highestBidIntoETH?.toString() > +basePrice?.toString()) {
      const fees = buyerFeeCalculate(
        +highestBidIntoETH?.toString(),
        _buyerPercents
      );

      setPlatformFeeInETH(fees);

      let totalFees = +fees + +highestBidIntoETH?.toString();

      setPriceInETHPlusTax(totalFees / 10 ** 18);

      if (fees > 0) {
        const ethIntoUsdtBase = await getProviderMarketContrat().getETHIntoUSDT(
          totalFees?.toString()
        );

        // const ethIntoUsdtPrice = await getSignerMarketContrat().getETHIntoUSDT(
        //   highestBidIntoETH?.toString()
        // );

        setPriceInUSDTPlusTax(ethIntoUsdtBase?.toString() / 10 ** 6);
        // setPlatformFeeInUSDT(+ethIntoUsdtBase?.toString() / 10 ** 6);
      }
    }
  };

  const getNFTDetailByNFTTokenId = async () => {
    const response = await apis.getNFTByTokenId(nftId);
    setNftDetails(response?.data?.data);
    setSellerPlan(response?.data?.data?.subscription_plan);
  };

  const getNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp?.id;
    const response = await apis.getLikeNFT(address, nftId);
    setLikeAndViewData(response?.data?.data);
  };

  const postNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.postLikeNFT({
      like_by: address,
      nft_token: nftId,
    });
    getNFTLike();
  };

  const postNFTView = async () => {
    var temp = JSON.parse(localStorage?.getItem("data"));
    var address = temp?.id;
    const response = await apis.postViewNFT({
      view_by: address,
      nft_token: nftId,
    });
    getNFTLike();
  };

  useEffect(() => {
    var temp = JSON.parse(localStorage?.getItem("data"));
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
      // console.log( bidAmount?.toString(),nftId, buyerPlan,"bidingDetails")
      let bid = await getSignerMarketContrat().bidInETH(nftId, buyerPlan, {
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
        nftId,
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
          nftId,
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
    setLoader(false);
    toast.success("Bid Succesful", {
      position: toast.POSITION.TOP_CENTER,
    });
    window.location.reload();
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
                    {userData ? (
                      userData?.wallet_address ==
                      nftDetails?.user?.wallet_address ? (
                        <Link to={"/profile"}>
                          <span>{nftDetails?.user?.username}</span>
                        </Link>
                      ) : (
                        <span
                          onClick={() =>
                            navigate(
                              `/other-profile?add=${nftDetails?.user?.id}`
                            )
                          }
                        >
                          {nftDetails?.owner?.username}
                        </span>
                      )
                    ) : (
                      <span
                        onClick={() => {
                          setEmailSigninPopup(true);
                        }}
                        style={{ cursor: "pointer" }}
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
                        : likeAndViewData
                        ? likeAndViewData?.view_count
                        : "0"}
                      View
                    </span>
                  </div>
                  <div onClick={() => postNFTLike()}>
                    {likeAndViewData?.is_liked == 0 ? (
                      <AiOutlineHeart />
                    ) : likeAndViewData ? (
                      <AiFillHeart style={{ fill: "#2636d9" }} />
                    ) : (
                      <AiOutlineHeart />
                    )}
                    <span>
                      {likeAndViewData?.like_count == ""
                        ? "0"
                        : likeAndViewData
                        ? likeAndViewData?.like_count
                        : "0"}
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
                        {userData ? (
                          userData?.id == nftDetails?.user?.id ? (
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
                              <span>{nftDetails?.user?.username}</span>
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
                          )
                        ) : (
                          <div onClick={() => setEmailSigninPopup(true)}>
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
                      {userData ? (
                        <div
                          className="logo-name"
                          onClick={() => navigateTo(collection)}
                        >
                          <img src={collectionImages} alt="" />
                          <span>{nftDetails?.collection?.name}</span>
                        </div>
                      ) : (
                        <div
                          className="logo-name"
                          onClick={() => setEmailSigninPopup(true)}
                        >
                          <img
                            src={nftDetails?.collection?.media[0]?.original_url}
                            alt=""
                          />
                          <span>{nftDetails?.collection?.name}</span>
                        </div>
                      )}
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
                          {/* <p>
                            Platfrom Fee{" "}
                            {Number(
                              ethers.utils.formatEther(
                                platformFeeInETH?.toString()
                              )
                            )?.toFixed(5)}{" "}
                            ETH
                          </p> */}
                          <p>
                            Total Payable Amount In ETH Including Tax{" "}
                            {Number(priceInEthWithTax?.toString())?.toFixed(5)}{" "}
                            ETH
                          </p>
                          {/* <span>
                            Last bid ${" "}
                            {+highestBidIntoUSDT?.toString() / 10 ** 6} +
                            Platform Fee $ {+platformFeeInUSDT?.toFixed(5)}
                          </span> */}
                          <span>
                            Total Payable Amount In USDT Including Tax ${" "}
                            {+priceInUsdtWithTax}
                            {/* Platform Fee $ {+platformFeeInUSDT?.toFixed(5)} */}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-4">
                      <div className="right"></div>
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
                        <span>
                          I agree to all{" "}
                          <a href="/terms" target="_blank">
                            Terms
                          </a>{" "}
                          &{" "}
                          <a
                            href="/privacy-policy"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Policy
                          </a>
                          .
                        </span>
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
