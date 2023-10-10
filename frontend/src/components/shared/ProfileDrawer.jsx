import React, { useRef, useCallback, useState, useEffect, useContext } from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
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
// import {
//   connectWallet,
//   getProviderOrSigner,
// } from "../../methods/walletManager";
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

function ProfileDrawer({
  isVisible,
  setIsVisible,
  onClose,
  id,
  title,
  image,
  price,
  paymentMethod,
  royalty,
  description,
  collection,
  // userAddress,
  showBuyNow,
  ShowAcceptbtn,
  sellerWallet
}) {
  const [propertyTabs, setPropertyTabs] = useState(0);
  const [chack, setChack] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [amount, setAmount] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [discountedEth, setDiscountedEth] = useState(0);
  const [discountedAmountUSD, setDiscountedAmountUSD] = useState(0);
  const [platformFeeUSDT, setPlatformFeeUSDT] = useState(0);
  const [platformFeeETH, setPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeETH, setDiscountedPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeUSDT, setDiscountedPlatformFeeUSDT] = useState(0);
  const [nftDetails, setNftDetails] = useState("");
  const [showFiatPaymentForm, setShowFiatPaymentForm] = useState(false);

  const [connectPopup, setConnectPopup] = useState(false);

  // console.log("user id: ", id)
  const navigate = useNavigate();

  useEffect(() => {
    getPriceInUSD();
  }, [isVisible]);

  useEffect(() => {
    checkSeller();
  }, []);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const getBuyerPlan = userData?.subscription_plan;
  const getBuyerPlan2 = userData;
  // console.log(userAddress, "")
  // console.log(getBuyerPlan2, "getBuyerPlan")

  // console.log(userAddress, sellerWallet, "uppercase")
  // console.log("getBuyerPlan", getBuyerPlan);
  // console.log("Zayyan connected user ka subscription plan", userData);

  const [priceETH, setPriceETH] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [getSellerPlan, setSellerPlan] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const handleStatus = (e) => {
    setStatus(e);
  };

  const [buyButton, showBuyButton] = useState(false);

  const { account, checkIsWalletConnected } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  const checkSeller = async () => {
    // const provider = await getProviderOrSigner();
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    let getLatestUSDTPrice = await marketplaceContract.getLatestUSDTPrice();
    let usdtEntered = 1639;
    let OneUSDMeItnaEth = getLatestUSDTPrice / 10 ** 18;
    // console.log("OneUSDMeItnaEth", OneUSDMeItnaEth);
    console.log("getLatestUSDTPrice", getLatestUSDTPrice?.toString());
    // console.log("ETh itna ayega", OneUSDMeItnaEth * usdtEntered);

    // console.log("eth price check", (usdPrice / 10 ** 8) * 10 ** 18);
    // let ethTest = (usdPrice / 10 ** 8) * 10 ** 18;
    // console.log("ETH ethTest", ethTest);

    // console.log("ethTest", ethers.utils.parseEther(ethTest).toString());
    // console.log("usdPrice", usdPrice.toString());

    var amount = +priceETH;
    var value = amount?.toString();

    // console.log("ETH amount", ethers.utils.parseEther(value).toString());

    const structData = await marketplaceContract._idToNFT(id);
    let seller = structData?.seller;
    // let royaltyPrice = structData.royaltyPrice.toString();
    // console.log("checkSeller royaltyPrice", royaltyPrice);
    // console.log("checkSeller Seller", seller);
    // console.log("checkSeller userAddress", userAddress);
    // console.log("checkSeller Seller == userAddress", seller == userAddress);
    // console.log("checkSeller sellerPlan", sellerPlan);
    // console.log("checkSeller buyerPlan", buyerPlan);
    // console.log("checkSeller paymentMethod", paymentMethod);

    if (userAddress != seller) {
      // show buy button
      showBuyButton(true);
      // console.log("WWW Bid");
    } else {
      // console.log("WWW show claim");
      showBuyButton(false);
      // show claim
    }
  };

  const getNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.getLikeNFT(address, id);
    setLikeAndViewData(response.data.data);
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
    var address = temp.id;
    const response = await apis.postViewNFT({
      view_by: address,
      nft_token: id,
    });
    getNFTLike();
  };

  useEffect(() => {
    if (isVisible) {
      postNFTView();
    }
  }, [isVisible]);

  let priceInETH = price;
  let sellerPlan = getSellerPlan;
  let buyerPlan = getBuyerPlan;

  // console.log("getBuyerPlan", getBuyerPlan);

  // const web3ModalRef = useRef();

  // const connectWallet = async () => {
  //   try {
  //     await getProviderOrSigner();
  //     setWalletConnected(true);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  // useEffect(() => {
  //   if (!walletConnected) {
  //     web3ModalRef.current = new Web3Modal({
  //       network: "hardhat",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //     connectWallet();
  //   }
  // }, [walletConnected]);

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

  const handleNFTSoldEvent = async (
    // nftContract,
    tokenId,
    seller,
    owner,
    price
  ) => {
    console.log("handleNFTSoldEvent");
    let soldData = {
      token_id: +tokenId?.toString(),
      seller: seller?.toString(),
      buyer: owner?.toString(),
      price: ethers.utils.formatEther(price?.toString()),
    };
    console.log("soldData", soldData);

    if (ethPurchase || usdtPurchase) {
      nftSoldPost(soldData);
      ethPurchase = false;
      usdtPurchase = false;
    }
  };

  const nftSoldPost = async (value) => {
    console.log("nftSoldPost");
    // console.log("nftSoldPost", value);

    const response = await apis.postNftSold(value);
    console.log("response", response);
    // alert("NFT bought");
    setSucess(false);
    await onClose(false);
    // setTimeout(() => {
    //   navigate("/profile");
    // }, 1500);
  };

  const platformFeeCalculate = async (_amount, _buyerPercent) => {
    let _amountToDeduct;
    _amountToDeduct = (_amount * _buyerPercent) / 100;
    return _amountToDeduct;
  };

  const getPriceInUSD = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    let _buyerPercent;
    console.log("buyerPlan asd", buyerPlan);

    if (buyerPlan == 4) {
      _buyerPercent = 0;
    } else if (buyerPlan == 3) {
      _buyerPercent = 1;
    } else {
      _buyerPercent = 1.5;
    }

    console.log("_buyerPercent", _buyerPercent);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    const structData = await marketplaceContract._idToNFT(id);
    const structData2 = await marketplaceContract._idToNFT2(id);

    let discount = +structData2.fanDiscountPercent.toString();
    console.log("fanDiscountPercent", discount);

    let nftEthPrice = ethers.utils.formatEther(structData.price.toString());
    setPriceETH(nftEthPrice);
    let priceETH = nftEthPrice;
    let feeETH = await platformFeeCalculate(priceETH, _buyerPercent);
    setPlatformFeeETH(feeETH);

    // let dollarPriceOfETH = 1831;

    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

    let priceInETH = dollarPriceOfETH.toString() / 1e18;

    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = priceETH;
    priceInUSD = oneETHInUSD * priceInUSD;
    priceInUSD = Math.ceil(priceInUSD);
    setAmountUSD(priceInUSD.toString());

    let feeUSD = await platformFeeCalculate(priceInUSD, _buyerPercent);
    setPlatformFeeUSDT(Math.ceil(feeUSD));

    // let fee = Math.ceil((priceInUSD * 3) / 100);
    // setPlatformFee(fee);

    console.log("discount", discount);

    if (discount != 0) {
      let discountedEthPrice = (nftEthPrice * discount) / 100;
      // let discountedEthPrice = (nftEthPrice * discount) / 100;
      let priceETH = discountedEthPrice;
      setDiscountedEth(discountedEthPrice.toFixed(2));
      console.log("discountedEthPrice", discountedEthPrice);

      // let dollarPriceOfETH = 1831;

      let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
      let priceInETH = dollarPriceOfETH.toString() / 1e18;
      let feeETH = await platformFeeCalculate(priceETH, _buyerPercent);
      console.log("ssss feeETH", feeETH);
      console.log("ssss priceInETH", priceInETH);
      // setDiscountedPlatformFeeETH(Math.ceil(feeETH));
      setDiscountedPlatformFeeETH(feeETH);
      console.log("ssss Math.ceil(feeETH)", Math.ceil(feeETH));
      let oneETHInUSD = 1 / priceInETH;
      let priceInUSD = priceETH;
      priceInUSD = oneETHInUSD * priceInUSD;
      priceInUSD = Math.ceil(priceInUSD);
      setDiscountedAmountUSD(priceInUSD.toString());
      // let feeUSD = Math.ceil((priceInUSD * 3) / 100);
      let feeUSD = await platformFeeCalculate(priceInUSD, _buyerPercent);
      feeUSD = Math.ceil(feeUSD);
      // platformFeeCalculate(priceInUSD, _buyerPercentFromDB);
      setDiscountedPlatformFeeUSDT(feeUSD);
    }
  };

  const getFiatAmount = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

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

    let fee = +platformFeeUSDT;
    let amount = Math.ceil(Number(amountUSD)) + Math.ceil(fee);
    let amountInWei = amount * 10 ** 6;
    amountInWei = amountInWei.toString();

    let checkFan = await marketplaceContract.checkFan(id);
    console.log("checkFan  ", checkFan);
    const structData2 = await marketplaceContract._idToNFT2(id);
    let discount = +structData2?.fanDiscountPercent?.toString();

    if (checkFan && discount != 0) {
      fee = +discountedPlatformFeeUSDT;
      console.log("fee", fee);
      console.log("www platformFeeUSDT", platformFeeUSDT);
      console.log("www amountUSD", fee);

      console.log("www discountedPlatformFeeUSDT", discountedPlatformFeeUSDT);
      console.log("www discountedAmountUSD", discountedAmountUSD);

      amount = Math.ceil(Number(discountedAmountUSD)) + Math.ceil(fee);
      amountInWei = amount * 10 ** 6;
      amountInWei = amountInWei?.toString();

      console.log("www fee", fee);
      console.log("www amount", amount);
      console.log("www amountInWei", amountInWei);
    }

    // ye wala bhej USD ki amount h ye 
    console.log("ye usd ki amount h", amount);
    // setShowFiatPaymentForm(true)
    setFiatAmount(amount)

  };

  let ethPurchase = false;

  const buyWithETH = async () => {
    console.log("11111111111111");

    ethPurchase = true;
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
    console.log("2222222222222");

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );
    console.log("3333333333333");

    const structData = await marketplaceContract._idToNFT(id);
    console.log("4444444444444");

    let nftEthPrice = ethers.utils.formatEther(structData?.price?.toString());
    console.log("555555555555");

    var fee = +platformFeeETH;
    var amount = +priceETH + fee;
    var value = amount?.toString();
    console.log("ETH amount", value);

    let checkFan = await marketplaceContract.checkFan(id);

    const structData2 = await marketplaceContract._idToNFT2(id);
    let discount = +structData2?.fanDiscountPercent?.toString();

    if (checkFan && discount != 0) {
      fee = +discountedPlatformFeeETH;
      console.log("www discountedPlatformFeeETH", discountedPlatformFeeETH);
      console.log("www discountedEth", discountedEth);

      // check this
      amount = +discountedEth + fee;
      value = amount?.toString();
    }

    console.log("www paymentMethod", paymentMethod);
    console.log("www id", id);
    console.log("www sellerPlan", sellerPlan);
    console.log("www buyerPlan", buyerPlan);
    console.log("www address", NFT_CONTRACT_ADDRESS.address);
    console.log("www value", value);

    await (
      await marketplaceContract.buyWithETH(
        NFT_CONTRACT_ADDRESS.address,
        paymentMethod,
        id,
        sellerPlan, //  must be multiple of 10 of the users percent
        buyerPlan, // must be multiple of 10 of the users percent
        {
          value: ethers.utils.parseEther(value),
          gasLimit: ethers.BigNumber.from("30000000"),
        }
      )
    ).wait();
    console.log("buyWithETH");

    let response = marketplaceContract.on(
      "NFTSold",
      ethPurchase ? handleNFTSoldEvent : null
    );

    console.log("Response of bid even", response);
  };

  let usdtPurchase = false;

  const buyWithUSDT = async () => {
    // console.log("Amount", amountUSD);
    // console.log("price", price);
    usdtPurchase = true;
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

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

    let fee = +platformFeeUSDT;
    let amount = Math.ceil(Number(amountUSD)) + Math.ceil(fee);
    let amountInWei = amount * 10 ** 6;
    amountInWei = amountInWei?.toString();

    let checkFan = await marketplaceContract.checkFan(id);
    console.log("checkFan  ", checkFan);
    const structData2 = await marketplaceContract._idToNFT2(id);
    let discount = +structData2.fanDiscountPercent.toString();

    if (checkFan && discount != 0) {
      fee = +discountedPlatformFeeUSDT;
      // console.log("fee", fee);
      // console.log("www platformFeeUSDT", platformFeeUSDT);
      // console.log("www amountUSD", fee);

      // console.log("www discountedPlatformFeeUSDT", discountedPlatformFeeUSDT);
      // console.log("www discountedAmountUSD", discountedAmountUSD);

      amount = Math.ceil(Number(discountedAmountUSD)) + Math.ceil(fee);
      amountInWei = amount * 10 ** 6;
      amountInWei = amountInWei?.toString();

      // console.log("www fee", fee);
      // console.log("www amount", amount);
      // console.log("www amountInWei", amountInWei);
    }
    // console.log("amountInWei  ", amountInWei);
    // console.log(
    //   "MARKETPLACE_CONTRACT_ADDRESS.address  ",
    //   MARKETPLACE_CONTRACT_ADDRESS.address
    // );

    //This Line check the balance of User 

    let accBalance = await USDTContract.balanceOf(userAddress)

    console.log("accBalance",accBalance)
    if(accBalance < amountInWei){
      return toast.error("you dont have balance");
    }
   

    const appprove = await USDTContract.approve(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      amountInWei,
      { gasLimit: ethers.BigNumber.from("50000") }
    );
    appprove.wait();
    // console.log("www ");
    // console.log("wwwasda ");
    var amountETH = +priceETH + +platformFeeETH;
    var value = amountETH?.toString();
    // console.log("www amountETH", value);

    // console.log("www paymentMethod", paymentMethod);
    // console.log("www id", id);
    // console.log("www sellerPlan", sellerPlan);
    // console.log("www buyerPlan", buyerPlan);
    // console.log("www address", NFT_CONTRACT_ADDRESS.address);
    // console.log("www amountInWei", amountInWei);
    let amountInETHInWei = ethers.utils.parseEther(value);
    await (
      await marketplaceContract.buyWithUSDT(
        NFT_CONTRACT_ADDRESS.address,
        paymentMethod,
        id,
        sellerPlan, // must be multiple of 10 of the users percent
        buyerPlan, // must be multiple of 10 of the users percent
        amountInWei,
        amountInETHInWei,
        { gasLimit: ethers.BigNumber.from("5000000") }
      )
    ).wait();

    let response = marketplaceContract.on(
      "NFTSold",
      usdtPurchase ? handleNFTSoldEvent : null
    );
    console.log("Response of bid even", response);
  };

  const statusOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];

  const getNFTDetailByNFTTokenId = async () => {
    try {
      const response = await apis.getNFTByTokenId(id);
      console.log("ressss", response?.data?.data?.subscription_plan);
      setNftDetails(response?.data?.data);
      setSellerPlan(response?.data?.data?.subscription_plan);
    } catch (e) {
      console.log("Error: ", e);
    }
  };

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
  // user router

  const [userWalletAddress, SetUserWalletAddress] = useState("");
  // const navigate = useNavigate();

  const handleUserVisit = async () => {
    navigate(
      `/other-profile?add=${nftDetails?.user?.id}`
    )
    // console.log(id, "user, id")
    // const response = await apis.getUserData(id);
    // SetUserWalletAddress( response?.data?.data?.wallet_address);
  }

  useEffect(() => {
    console.log(userWalletAddress)
    // if(userWalletAddress){
    //     navigate(`/other-profile?add=${userWalletAddress}`)
    // }
  }, [userWalletAddress])



  
  const userAccountAddress = localStorage.getItem("userAddress")
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
                            `/other-profile?add=${nftDetails?.user?.id}`
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
                      <div className="logo-name"
                      >
                        {
                          userData?.wallet_address == nftDetails?.user?.wallet_address ? (
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
                          )
                          // <Link to={`/other-profile?address=${nftDetails?.user?.wallet_address}`}>
                          //    <img src={nftDetails?.user?.profile_image} alt="" />{" "}
                          //   <span>{nftDetails?.user?.username}</span>
                          // </Link>
                        }
                        {/* {console.log(nftDetails, "ndt")} */}
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
                  <div className="row d-flex">
                    <div className="col-lg-4 col-md-4 col-12 hide-on-desktop-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "40px" }}
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
                    <div className="col-lg-4 col-md-4 col-12 hide-on-mobile-screen" style={{ marginLeft: "0px" }}>
                      <SocialShare bidStyle="bid-style"
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
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-8">
                      <h3>Current Price</h3>
                      <div className="left">
                        <p>
                          {price} ETH
                          <span>
                            ${amountUSD} + Platform Fee ${platformFeeUSDT}
                          </span>
                          {/* {console.log("USDAmount", amountUSD)} */}
                          {/* {price} ETH<span>$234</span>   */}
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-8 col-8">
                      <h3>Discounted price for fans</h3>
                      <div className="left">
                        <p>
                          {discountedEth} ETH
                          <span>
                            ${discountedAmountUSD} + Platform Fee $
                            {discountedPlatformFeeUSDT}
                          </span>
                          {/* {console.log("USDAmount", amountUSD)} */}
                          {/* {price} ETH<span>$234</span>   */}
                        </p>
                      </div>
                    </div>

                    {!showBuyNow && (
                      <div className="col-lg-6 col-md-8 col-8">
                        <div className="stock-div">
                          {nftDetails?.in_stock} <span>in stock</span>{" "}
                        </div>
                      </div>
                    )}
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
                {ShowAcceptbtn && (
                  <div className="drawer-inner-accept-btn">
                    <div className="nft-card-btn-holder">
                      <button>Accept</button>
                      <button>Decline</button>
                    </div>
                  </div>
                )}
                {!showBuyNow && userAddress?.toString().toUpperCase() !== sellerWallet?.toString().toUpperCase() && (
                  <>
                    <div
                      className="seven-line"
                      onClick={() => setChack(!chack)}
                    >
                      {/* {console.log(sellerWallet, "sellerWallet")} */}
                      {/* {console.log(userAddress.toUpperCase(), " ", sellerWallet.toUpperCase(), "uppercase")} */}
                      <span>
                        <BsCheck className={`${chack ? "red" : "black"}`} />
                      </span>{" "}
                      <span>I agree to all <a href="/terms" target="_blank">Terms</a> & <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Policy</a>.</span>
                    </div>
                    <div className="eight-line">
                      {buyButton ? (
                        <button
                          className="nft-buy-btn"
                          disabled={!chack}
                          onClick={() => {
                            if (userAccountAddress === "false") {
                              setConnectPopup(true)
                            }
                            else {
                              getFiatAmount();
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
          {/* <button onClick={checkSeller}>checkSeller </button> */}
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
          <div className="mobal-button-2">
            <button onClick={() => setShowFiatPaymentForm(true)}>Buy with FIAT</button>
            {/* <button onClick={buyWithFIAT}>Buy with FIAT</button> */}
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
              id={id}
              amount={fiatAmount}
              setShowPaymentForm={setShowFiatPaymentForm}
              showResponseMessage={showResponseMessage}
              setSucess={setSucess}
              setIsVisible={setIsVisible}
            />
          </div>
        </div>
      </Modal>


      <HeaderConnectPopup connectPopup={connectPopup} setConnectPopup={setConnectPopup} />
    </>
  );
}

export default ProfileDrawer;
