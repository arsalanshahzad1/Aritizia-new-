import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import SocialShare from "./SocialShare";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import apis from "../../service";
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
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FiatStripeContainer from "../../stripePayment/FiatStripeContainer";
import { Store } from "../../Context/Store";
import HeaderConnectPopup from "../../pages/Headers/HeaderConnectPopup";
import { toast } from "react-toastify";
import EmailSigninPopup from "../../pages/Headers/EmailSigninPopup";

function ProfileDrawer({
  setLoader,
  isVisible,
  onClose,
  setIsVisible,
  nftId,
  title,
  image,
  price,
  royalty,
  description,
  collection,
  showBuyNow,
  ShowAcceptbtn,
  seller,
  owner,
  firstOwner,
  user_id
}) {

  const [propertyTabs, setPropertyTabs] = useState(0);
  const [chack, setChack] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [fiatAmount, setFiatAmount] = useState("");
  const [showFiatPaymentForm, setShowFiatPaymentForm] = useState(false);
  const [connectPopup, setConnectPopup] = useState(false);
  const [platformFeeETH, setPlatformFeeETH] = useState(0);
  const [platformFeeUSDT, setPlatformFeeInUSDT] = useState(0);
  const [priceInUSDT, setPriceIntoUSD] = useState("");
  const [sellerPlan, setSellerPlan] = useState(0);
  const [buyerPlan, setBuyerPlan] = useState(0);
  const [nftDetails, setNftDetails] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");
  const [emailSigninPopup, setEmailSigninPopup] = useState(false);
  const [ethForFiat, setEthForFiat] = useState("");

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const getBuyerPlan = userData?.subscription_plan;
  let userId = userData?.id;

  const navigate = useNavigate();

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });

  const handleStatus = (e) => {
    setStatus(e);
  };

  const { account, checkIsWalletConnected, getProviderMarketContrat, getProviderNFTContrat, getSignerMarketContrat, getSignerNFTContrat, getSignerUSDTContrat } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  const buyerFeeCalculate = (_amount, _buyerPercent) => {
    return (_amount * _buyerPercent) / 10000;
  };

  const getPriceInUSDAndDetials = async () => {
    let _buyerPercent;

    if (getBuyerPlan == 3) {
      _buyerPercent = 0;
    } else if (getBuyerPlan == 2) {
      _buyerPercent = 100;
    } else {
      _buyerPercent = 150;
    }

    setBuyerPlan(getBuyerPlan);
    let feeETH = buyerFeeCalculate(price?.toString(), _buyerPercent);
    setPlatformFeeETH(feeETH?.toString());

    if (feeETH != 0) {
      const ethIntoUsdtBase = await getProviderMarketContrat()?.getETHIntoUSDT(feeETH?.toString());
      setPlatformFeeInUSDT(ethIntoUsdtBase / 10 ** 6)
    }

    let EthIntoUSDT = (+feeETH + +price?.toString())
    setEthForFiat(EthIntoUSDT);

    let intoUSDT = await getProviderMarketContrat()?.getETHOutUSDTInOutPut(EthIntoUSDT?.toString())

    setPriceIntoUSD(intoUSDT?.toString());
    setFiatAmount(intoUSDT?.toString() / 10**6);

  };


  const getNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.getLikeNFT(address, nftId);
    setLikeAndViewData(response.data.data);
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
    var address = temp.id;
    const response = await apis.postViewNFT({
      view_by: address,
      nft_token: nftId,
    });
    getNFTLike();
  };

  const getNFTDetailByNFTTokenId = async () => {
    try {
      const response = await apis.getNFTByTokenId(nftId);
      setNftDetails(response?.data?.data);
      setSellerPlan(response?.data?.data?.subscription_plan);
    } catch (e) {
      console.error("Error: ", e);
    }
  };

  useEffect(() => {
    var temp = JSON.parse(localStorage?.getItem("data"));
    if (isVisible
    ) {
      postNFTView();
    }
  }, [isVisible]);

  //BUYWITHETH
  let ethPurchase = false;
  const buyWithETH = async () => {
    setLoader(true)
    try {
      ethPurchase = true;

      let totalPrice = ((+price?.toString()) + (+platformFeeETH));

      await (await getSignerMarketContrat()?.buyWithETH(
        getSignerNFTContrat().address,
        nftId,
        sellerPlan, // must be multiple of 10 of the users percent //TODO: change here
        getBuyerPlan, // must be multiple of 10 of the users percent //TODO: change here
        nftDetails?.user_id, //selllerId
        userData?.id, //buyerId
        {
          value: totalPrice?.toString()
        }
      )
      ).wait();

      let response = await getSignerMarketContrat().on(
        "NFTSold",
        ethPurchase ? handleNFTSoldEvent : null
      );

      setTimeout(() => {
        setLoader(false)
      }, [10000])
      onClose(false)
      window.location.reload()
    } catch (error) {
      setLoader(false)
      toast.error(error?.data?.message)
    }
  };

  //BUYWITHUSDT
  let usdtPurchase = false;
  const buyWithUSDT = async () => {
    setLoader(true)
    try {

      usdtPurchase = true;
      let accBalance = await getSignerUSDTContrat()?.balanceOf(userAddress)
      if (+priceInUSDT > +accBalance?.toString()) {
        return toast.error("You dont have balance"), setLoader(false);
      }

      let usdtToEth = await getSignerMarketContrat()?.getUSDTIntoETH(priceInUSDT);

      const appprove = await getSignerUSDTContrat().approve(
        MARKETPLACE_CONTRACT_ADDRESS.address,
        // 0
        priceInUSDT?.toString()
      );

      appprove.wait();

      await (
        await getSignerMarketContrat()?.buyWithUSDT(
          getSignerNFTContrat().address,
          nftId,
          priceInUSDT?.toString(),
          sellerPlan,
          buyerPlan,
          nftDetails?.user_id, //selllerId
          userData?.id, //buyerId 
          { gasLimit: ethers.BigNumber.from("5000000") }
        )).wait();

      let response = await getSignerMarketContrat().on(
        "NFTSold",
        usdtPurchase ? handleNFTSoldEvent : null
      );
      setTimeout(() => {
        setLoader(false)
      }, [10000])
      onClose(false)
      window.location.reload()
    } catch (error) {
      setLoader(false)
      toast.error(error?.data?.message)
    }

  };

  const handleNFTSoldEvent = async (
    nftContract,
    tokenId,
    price,
    seller,
    buyer,
  ) => {
    let soldData = {
      contractAddress: nftContract?.toString(),
      token_id: +tokenId?.toString(),
      seller: seller?.toString(),
      buyer: buyer?.toString(),
      price: price?.toString(),
    };

    if (ethPurchase || usdtPurchase) {
      nftSoldPost(soldData);
      ethPurchase = false;
      usdtPurchase = false;
    } else {
      setLoader(false);
    }

  };

  const nftSoldPost = async (value) => {
    try {
      // const response = await apis.postNftSold(value);
      setSucess(false);
      setLoader(false);
      onClose(false)
      window.location.reload();
    } catch (error) {
      setSucess(false);
      setLoader(false);
      onClose(false)
      window.location.reload();
    }

  };

  useEffect(() => {
    getPriceInUSDAndDetials(); 
    getNFTDetailByNFTTokenId();
  }, [account, price, fiatAmount])


  const statusOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];

  const Monthly_data = [
    {
      data: "Jan",
      value: nftDetails?.allMonths_sale?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Feb",
      value: nftDetails?.allMonths_sale?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Mar",
      value: nftDetails?.allMonths_sale?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Apr",
      value: nftDetails?.allMonths_sale?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "May",
      value: nftDetails?.allMonths_sale?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "June",
      value: nftDetails?.allMonths_sale?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "July",
      value: nftDetails?.allMonths_sale?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Aug",
      value: nftDetails?.allMonths_sale?.[7],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Sep",
      value: nftDetails?.allMonths_sale?.[8],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Oct",
      value: nftDetails?.allMonths_sale?.[9],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Nov",
      value: nftDetails?.allMonths_sale?.[10],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Dec",
      value: nftDetails?.allMonths_sale?.[11],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];

  const Weekly_data = [
    {
      data: "1",
      value: nftDetails?.lastWeekDays_sale?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "2",
      value: nftDetails?.lastWeekDays_sale?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "3",
      value: nftDetails?.lastWeekDays_sale?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "4",
      value: nftDetails?.lastWeekDays_sale?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "5",
      value: nftDetails?.lastWeekDays_sale?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "6",
      value: nftDetails?.lastWeekDays_sale?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "7",
      value: nftDetails?.lastWeekDays_sale?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];

  const Daily_data = [
    {
      data: 1,
      value: nftDetails?.lastMonthDays_sale?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 2,
      value: nftDetails?.lastMonthDays_sale?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 3,
      value: nftDetails?.lastMonthDays_sale?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 4,
      value: nftDetails?.lastMonthDays_sale?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 5,
      value: nftDetails?.lastMonthDays_sale?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 6,
      value: nftDetails?.lastMonthDays_sale?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 7,
      value: nftDetails?.lastMonthDays_sale?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 8,
      value: nftDetails?.lastMonthDays_sale?.[7],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 9,
      value: nftDetails?.lastMonthDays_sale?.[8],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 10,
      value: nftDetails?.lastMonthDays_sale?.[9],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 11,
      value: nftDetails?.lastMonthDays_sale?.[10],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 12,
      value: nftDetails?.lastMonthDays_sale?.[11],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 13,
      value: nftDetails?.lastMonthDays_sale?.[12],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 14,
      value: nftDetails?.lastMonthDays_sale?.[13],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 15,
      value: nftDetails?.lastMonthDays_sale?.[14],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 16,
      value: nftDetails?.lastMonthDays_sale?.[15],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 17,
      value: nftDetails?.lastMonthDays_sale?.[16],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 18,
      value: nftDetails?.lastMonthDays_sale?.[17],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 19,
      value: nftDetails?.lastMonthDays_sale?.[18],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 20,
      value: nftDetails?.lastMonthDays_sale?.[19],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 21,
      value: nftDetails?.lastMonthDays_sale?.[20],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 22,
      value: nftDetails?.lastMonthDays_sale?.[21],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 23,
      value: nftDetails?.lastMonthDays_sale?.[22],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 24,
      value: nftDetails?.lastMonthDays_sale?.[23],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 25,
      value: nftDetails?.lastMonthDays_sale?.[24],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 26,
      value: nftDetails?.lastMonthDays_sale?.[25],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 27,
      value: nftDetails?.lastMonthDays_sale?.[26],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 28,
      value: nftDetails?.lastMonthDays_sale?.[27],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 29,
      value: nftDetails?.lastMonthDays_sale?.[28],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: 30,
      value: nftDetails?.lastMonthDays_sale?.[29],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];

  useEffect(() => {
    if (isVisible) {
      getNFTDetailByNFTTokenId();
    }
  }, [isVisible]);

  const showResponseMessage = (message) => {
    setShowFiatPaymentForm(false);
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };


  const handleUserVisit = async () => {
    navigate(
      `/other-profile?add=${nftDetails?.user?.id}`
    )

  }

  const userAccountAddress = localStorage.getItem("userAddress")

  const navigateTo = (id) => {
    console.log('calling');
    if (userData) {
      navigate(`/collection?id=${id}`);
    } else {
      setEmailSigninPopup(true)
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
            <div className="col-lg-6 col-md-6 col-12">
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
                  className="earning-map-one"
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
                      <ChartForEarning data={Monthly_data} chartLabel="Total Earning" />
                    ) : (
                      <div></div>
                    )}
                    {status.value === "Weekly" ? (
                      <ChartForEarning data={Weekly_data} chartLabel="Total Earning" />
                    ) : (
                      <div></div>
                    )}
                    {status.value === "Daily" ? (
                      <ChartForEarning data={Daily_data} chartLabel="Total Earning" />
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="pro-dtails">
                <div className="first-line">
                  <h2>{title}</h2>
                  <img src="/assets/images/chack.png" alt="" />
                </div>
                <div className="second-line">
                  <p>
                    Owned by
                    {userData ?
                      userData?.wallet_address == nftDetails?.user?.wallet_address ? (
                        <Link to={"/profile"}>
                          <span>{nftDetails?.user?.username}</span>
                        </Link>
                      ) : (
                        <span onClick={() => navigate(`/other-profile?add=${nftDetails?.user?.id}`)}>
                          {nftDetails?.owner?.username}
                        </span>
                      )
                      :
                      <span onClick={() => { setEmailSigninPopup(true) }} style={{ cursor: 'pointer' }}>
                        {nftDetails?.owner?.username}
                      </span>
                    }
                  </p>
                </div>
                <div className="three-line">
                  <div>
                    <TfiEye />
                    <span>
                      {likeAndViewData?.view_count == ""
                        ? "00"
                        : (likeAndViewData ?
                          likeAndViewData?.view_count :
                          '0')
                      }
                      View
                    </span>
                  </div>
                  <div onClick={() => postNFTLike()}>
                    {likeAndViewData?.is_liked == 0 ? (
                      <AiOutlineHeart />
                    ) : (
                      likeAndViewData ?
                        <AiFillHeart style={{ fill: "#2636d9" }} />
                        :
                        <AiOutlineHeart />

                    )}
                    <span>
                      {likeAndViewData?.like_count == ""
                        ? "0"
                        :
                        (likeAndViewData ?
                          likeAndViewData?.like_count :
                          '0')
                      }
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
                        {userData ?
                          userData?.wallet_address == nftDetails?.user?.wallet_address ? (
                            <Link to={`/profile`}>
                              {nftDetails?.user?.profile_image ?
                                (<img src={nftDetails?.user?.profile_image} alt="" />) :
                                (<img src={"/public/assets/images/user-none.png"} alt="" />)
                              }
                              <span>{nftDetails?.user?.username}</span>
                            </Link>
                          ) : (
                            <div onClick={() => navigate(`/other-profile?add=${nftDetails?.owner?.id}`, { state: { address: nftDetails?.user?.wallet_address } })
                            }
                            >
                              {nftDetails?.user?.profile_image ? (
                                <img src={nftDetails?.user?.profile_image} alt="" />
                              ) : (
                                <img src={"/public/assets/images/user-none.png"} alt="" />
                              )}
                              <span>{nftDetails?.user?.username}</span>
                            </div>
                          )
                          :
                          <div onClick={() => setEmailSigninPopup(true)}>
                            {nftDetails?.user?.profile_image ? (
                              <img src={nftDetails?.user?.profile_image} alt="" />
                            ) : (
                              <img src={"/public/assets/images/user-none.png"} alt="" />
                            )}
                            <span>{nftDetails?.user?.username}</span>
                          </div>


                        }

                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Collection</h3>
                      {userData ?
                        <div className="logo-name" onClick={() => navigateTo(nftDetails?.collection?.id)}>
                          <img src={nftDetails?.collection?.media[0]?.original_url} alt="" />
                          <span>{nftDetails?.collection?.name}</span>
                        </div>
                        :
                        <div className="logo-name" onClick={() => setEmailSigninPopup(true)}>
                          <img src={nftDetails?.collection?.media[0]?.original_url} alt="" />
                          <span>{nftDetails?.collection?.name}</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="five-line">
                  <div className="row d-flex">
                    <div className="col-lg-4 col-md-4 col-12 hide-on-desktop-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "40px" }}
                        user_id={user_id}
                      />
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 hide-on-mobile-screen" style={{ marginLeft: "0px" }}>
                      <SocialShare
                        bidStyle="bid-style"
                        style={{ fontSize: "18px", marginRight: "10px" }}
                        user_id={user_id}
                      />
                    </div>
                  </div>
                </div>
                <div className="six-line">
                  <div className="row">
                    <div className="col-lg-12 col-md-8 col-8">
                      <h3>Current Price</h3>
                      <div className="left">
                        <p>
                          {Number(ethers.utils.formatEther(price?.toString()))?.toFixed(5)} ETH
                          <br />
                          <span>
                            Current Price $ {Number(priceInUSDT / 10 ** 6)?.toFixed(5)} + Platform Fee $ {Number(platformFeeUSDT)?.toFixed(5)}
                          </span>

                        </p>
                      </div>
                    </div>

                    {!showBuyNow && (
                      <div className="col-lg-4 col-md-8 col-8">
                        <div className="stock-div">
                          {nftDetails?.in_stock} <span>in stock</span>{" "}
                        </div>
                      </div>
                    )}
                    <div className="col-lg-6 col-md-4 col-4">
                      <div className="right">
                      </div>
                    </div>
                  </div>
                  {/* <img
                    src="/assets/images/progress-bar.png"
                    className="hide-on-desktop-screen"
                    alt=""
                    width={"100%"}
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  /> */}
                </div>
                {ShowAcceptbtn && (
                  <div className="drawer-inner-accept-btn">
                    <div className="nft-card-btn-holder">
                      <button>Accept</button>
                      <button>Decline</button>
                    </div>
                  </div>
                )}
                {!showBuyNow && userAddress?.toString()?.toUpperCase() !== seller?.toString()?.toUpperCase() && (
                  owner?.toUpperCase() === MARKETPLACE_CONTRACT_ADDRESS?.address?.toUpperCase() &&
                  <>
                    <div
                      className="seven-line"
                      onClick={() => setChack(!chack)}
                    >

                      <span>
                        <BsCheck className={`${chack ? "red" : "black"}`} />
                      </span>{" "}
                      <span>I agree to all <a href="/terms" target="_blank">Terms</a> & <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Policy</a>.</span>
                    </div>
                    <div className="eight-line">
                      {account?.toUpperCase() !== seller?.toUpperCase() ? (
                        <button
                          className="nft-buy-btn"
                          disabled={!chack}
                          onClick={() => {
                            if (userAccountAddress === "false") {
                              setConnectPopup(true)
                            }
                            else {
                              setSucess(true);
                            }
                          }}
                        >
                          Buy Now
                        </button>
                      ) : null}
                    </div>
                  </>
                )}
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
          <span onClick={() => setSucess(false)}>
            <AiOutlineClose />
          </span>
          <div className="mobal-button-1">
            <button onClick={buyWithETH}>Buy with ETH</button>
            <button onClick={buyWithUSDT}>Buy with USDT</button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showFiatPaymentForm}
        onHide={() => setShowFiatPaymentForm(false)}
        centered
        size="lg"
        className="payment-modal-wrap"
        backdrop="static"
        keyboard={false}
      >
        <div className="modal-body">
          <div className="payment-close">
            <AiOutlineClose onClick={() => setShowFiatPaymentForm(false)} />
          </div>
          <div className="sucess-data">
            <p className="card-title">PAY WITH STRIPE</p>
            <div>
              <p>Nft Title: {title}</p>
            </div>
            <div>
              <p>Nft Price: ${fiatAmount}</p>
            </div>
            <FiatStripeContainer
              setLoader={setLoader}
              amount={fiatAmount}
              setShowPaymentForm={setShowFiatPaymentForm}
              showResponseMessage={showResponseMessage}
              setSucess={setSucess}
              setIsVisible={setIsVisible}
              _nftContract={getProviderNFTContrat().address}
              _tokenId={nftId}
              _sellerPlan={sellerPlan}
              _buyerAddress={account}
              _buyerPlan={buyerPlan}
              sellerId={nftDetails?.user_id}
              buyerId={userData?.id}
              ethAmount={ethForFiat}
            />
          </div>
        </div>
      </Modal>


      {/* <HeaderConnectPopup connectPopup={connectPopup} setConnectPopup={setConnectPopup} /> */}
      <EmailSigninPopup emailSigninPopup={emailSigninPopup} setEmailSigninPopup={setEmailSigninPopup} />
    </>
  );
}

export default ProfileDrawer;
