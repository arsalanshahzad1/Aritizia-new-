import React, { useRef, useCallback, useState, useEffect } from "react";
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
    data: 1,
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 2,
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 3,
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 4,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 5,
    value: 3,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 6,
    value: 4,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 7,
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 8,
    value: 6,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 9,
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 10,
    value: 4,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 11,
    value: 3,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 12,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 13,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 14,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 15,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 16,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 17,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 18,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 19,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 20,
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: 21,
    value: 2,
  },
  {
    data: 22,
    value: 2,
  },
  {
    data: 23,
    value: 2,
  },
  {
    data: 24,
    value: 2,
  },
  {
    data: 25,
    value: 2,
  },
  {
    data: 26,
    value: 2,
  },
  {
    data: 27,
    value: 2,
  },
  {
    data: 28,
    value: 2,
  },
  {
    data: 29,
    value: 2,
  },
  {
    data: 30,
    value: 2,
  },
];

function ProfileDrawer({
  isVisible,
  onClose,
  id,
  title,
  image,
  price,
  paymentMethod,
  royalty,
  description,
  collection,
  userAddress,
  showBuyNow,
  ShowAcceptbtn,
}) {
  const [propertyTabs, setPropertyTabs] = useState(0);
  const [chack, setChack] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [amount, setAmount] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [discountedEth, setDiscountedEth] = useState(0);
  const [discountedAmountUSD, setDiscountedAmountUSD] = useState(0);
  const [platformFeeUSDT, setPlatformFeeUSDT] = useState(0);
  const [platformFeeETH, setPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeETH, setDiscountedPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeUSDT, setDiscountedPlatformFeeUSDT] = useState(0);
  const [nftDetails, setNftDetails] = useState('');

  const navigate = useNavigate();
  useEffect(() => {
    getPriceInUSD();
  }, [isVisible]);

  const userData = JSON.parse(localStorage.getItem('data'))

  const [priceETH, setPriceETH] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const handleStatus = (e) => {
    setStatus(e);
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
    var temp = JSON.parse(localStorage.getItem("data"));
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
  let _sellerPercentFromDB = 1.5;
  let _buyerPercentFromDB = 1.5;
  let sellerPercent = _sellerPercentFromDB * 10;
  let buyerPercent = _buyerPercentFromDB * 10;

  const web3ModalRef = useRef();

  // const connectWallet = async () => {
  //   try {
  //     // Get the provider from web3Modal, which in our case is MetaMask
  //     // When used for the first time, it prompts the user to connect their wallet
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

  const getProviderOrSigner = async (needSigner = false) => {
    console.log("getProviderOrSigner");

    const provider = await web3ModalRef.current.connect();

    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();
    try {
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
        // params: [{ chainId: "0x7A69" }], // localhost's chainId
      });
    } catch (error) {
      // User rejected the network change or there was an error
      throw new Error("Change network to Sepolia to proceed.");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();

      return signer;
    }
    return web3Provider;
  };

  const handleNFTSoldEvent = async (
    nftContract,
    tokenId,
    seller,
    owner,
    price
  ) => {
    let soldData = {
      token_id: tokenId.toString(),
      seller: seller.toString(),
      buyer: owner.toString(),
      price: ethers.utils.formatEther(price.toString()),
    };

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
    alert("NFT bought");
    // navigate("/profile");
  };

  const platformFeeCalculate = async (_amount, _buyerPercent) => {
    let _amountToDeduct;
    _amountToDeduct = (_amount * _buyerPercent) / 100;
    return _amountToDeduct;
  };

  const getPriceInUSD = async () => {
    const provider = await getProviderOrSigner();

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
    let feeETH = await platformFeeCalculate(priceETH, _buyerPercentFromDB);
    setPlatformFeeETH(feeETH);

    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
    let priceInETH = dollarPriceOfETH.toString() / 1e18;

    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = priceETH;
    priceInUSD = oneETHInUSD * priceInUSD;
    priceInUSD = Math.ceil(priceInUSD);
    setAmountUSD(priceInUSD.toString());

    let feeUSD = await platformFeeCalculate(priceInUSD, _buyerPercentFromDB);
    setPlatformFeeUSDT(Math.ceil(feeUSD));

    // let fee = Math.ceil((priceInUSD * 3) / 100);
    // setPlatformFee(fee);

    if (discount != 0) {
      let discountedEthPrice = (nftEthPrice * discount) / 100;
      // let discountedEthPrice = (nftEthPrice * discount) / 100;
      let priceETH = discountedEthPrice;
      // platformFeeCalculate(priceETH, _buyerPercentFromDB);
      setDiscountedEth(discountedEthPrice.toFixed(2));
      console.log("discountedEthPrice", discountedEthPrice);
      let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
      let priceInETH = dollarPriceOfETH.toString() / 1e18;
      let feeETH = await platformFeeCalculate(priceETH, _buyerPercentFromDB);

      setDiscountedPlatformFeeETH(Math.ceil(feeETH));
      let oneETHInUSD = 1 / priceInETH;
      let priceInUSD = priceETH;
      priceInUSD = oneETHInUSD * priceInUSD;
      priceInUSD = Math.ceil(priceInUSD);
      setDiscountedAmountUSD(priceInUSD.toString());
      // let feeUSD = Math.ceil((priceInUSD * 3) / 100);
      let feeUSD = await platformFeeCalculate(priceInUSD, _buyerPercentFromDB);
      feeUSD = Math.ceil(feeUSD);
      // platformFeeCalculate(priceInUSD, _buyerPercentFromDB);
      setDiscountedPlatformFeeUSDT(feeUSD);
    }
  };

  const buyWithFIAT = async () => {
    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );
    console.log("discountedAmountUSD ooo", discountedAmountUSD);
    console.log("discountedEth ooo", discountedEth);

    const structData = await marketplaceContract._idToNFT(id);
    console.log("id", id);
    console.log("structData.seller", structData.seller);
    console.log("userAddress", userAddress);

    let checkFan = await marketplaceContract.checkFan(id);

    console.log("checkFan", checkFan);

    let fanlist = await marketplaceContract.getFans(
      "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    );
    console.log("fanlist", fanlist);

    let fanlist2 = await marketplaceContract.getFans(
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    );
    console.log("fanlist2", fanlist2);

    console.log("fanlist2", fanlist2);
    console.log("fanlist2", fanlist2);
    console.log("fanlist2", fanlist2);
    console.log("fanlist2", fanlist2);
  };

  let ethPurchase = false;

  const buyWithETH = async () => {
    ethPurchase = true;
    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    const structData = await marketplaceContract._idToNFT(id);

    let nftEthPrice = ethers.utils.formatEther(structData.price.toString());

    var fee = +platformFeeETH;
    var amount = +priceETH + fee;
    var value = amount.toString();
    let checkFan = await marketplaceContract.checkFan(id);

    if (checkFan) {
      fee = +discountedPlatformFeeETH;

      amount = +discountedEth + fee;
      value = amount.toString();
    }

    await (
      await marketplaceContract.buyWithETH(
        NFT_CONTRACT_ADDRESS.address,
        paymentMethod,
        id,
        sellerPercent, //  must be multiple of 10 of the users percent
        buyerPercent, // must be multiple of 10 of the users percent
        {
          value: ethers.utils.parseEther(value),
          gasLimit: ethers.BigNumber.from("500000"),
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
    const signer = await getProviderOrSigner(true);

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

    if (checkFan) {
      fee = +discountedPlatformFeeUSDT;
      amount = Math.ceil(Number(discountedAmountUSD)) + Math.ceil(fee);
      amountInWei = amount * 10 ** 6;
      amountInWei = amountInWei.toString();

      console.log("fee", fee);
      console.log("amount", amount);
      console.log("amountInWei", amountInWei);
    }

    const appprove = await USDTContract.approve(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      amountInWei,
      { gasLimit: ethers.BigNumber.from("500000") }
    );

    appprove.wait();

    // allowance = await USDTContract.allowance(
    //   userAddress,
    //   MARKETPLACE_CONTRACT_ADDRESS.address
    // );

    // console.log("Allowance after", allowance.toString());

    // }

    // console.log("paymentmethod", paymentMethod);
    // console.log("Data", NFT_CONTRACT_ADDRESS.address, paymentMethod, id, "20");
    // console.log("amountUSD typeof", typeof amountUSD);
    // console.log("amountUSD", amountUSD);
    // console.log("amount", amount);
    // console.log("amountInWei typeof", amountInWei);

    // console.log("Check", check);

    await (
      await marketplaceContract.buyWithUSDT(
        NFT_CONTRACT_ADDRESS.address,
        paymentMethod,
        id,
        amountInWei,
        sellerPercent, // must be multiple of 10 of the users percent
        buyerPercent, // must be multiple of 10 of the users percent
        { gasLimit: ethers.BigNumber.from("500000") }
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
    const response = await apis.getNFTByTokenId(id);
    setNftDetails(response?.data?.data)
    console.log(response.data.data, 'new response');
  }
  useEffect(() => {

    if (isVisible) {
      getNFTDetailByNFTTokenId()
    }
  }, [isVisible])

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
                    {/* <Chart options={data.options} series={data.series} type="line" height={400} /> */}
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
                <div className="first-line">
                  <h2>{title}</h2>
                  <img src="/assets/images/chack.png" alt="" />
                </div>
                <div className="second-line">
                  <p>
                    Owned by <span>{nftDetails?.owner?.username}</span>
                  </p>
                </div>
                <div className="three-line">
                  <div>
                    <TfiEye />
                    <span>{likeAndViewData?.view_count == '' ? '00' : likeAndViewData?.view_count} View</span>
                  </div>
                  <div onClick={() => postNFTLike()}>
                    {likeAndViewData.is_liked == 0 ? (
                      <AiOutlineHeart />
                    ) : (
                      <AiFillHeart style={{ fill: "#2636d9" }} />
                    )}
                    <span>{likeAndViewData?.like_count == '' ? '0' : likeAndViewData?.like_count} Favorite</span>
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
                        {userData?.wallet_address == nftDetails?.user?.wallet_address ?
                          <Link to={'/profile'}>
                            <img src={nftDetails?.user?.profile_image} alt="" />{" "}
                            <span>{nftDetails?.user?.username}</span>
                            <br />
                            <span>{userData?.wallet_address}</span>
                            <br />
                            <span>{nftDetails?.user?.wallet_address}</span>
                          </Link>
                          :
                          <div onClick={() => navigate("/other-profile", { state: { address: nftDetails?.user?.wallet_address } })}>
                            <img src={nftDetails?.user?.profile_image} alt="" />{" "}
                            <span>{nftDetails?.user?.username}</span>
                          </div>
                          // <Link to={`/other-profile?address=${nftDetails?.user?.wallet_address}`}>
                          //    <img src={nftDetails?.user?.profile_image} alt="" />{" "}
                          //   <span>{nftDetails?.user?.username}</span>
                          // </Link> 
                        }

                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Collection</h3>
                      <div className="logo-name">
                        <img src={nftDetails?.collection?.media[0]?.original_url} alt="" />{" "}
                        <span>{nftDetails?.collection?.name}</span>
                      </div>
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
                {!showBuyNow && (
                  <>
                    <div
                      className="seven-line"
                      onClick={() => setChack(!chack)}
                    >
                      <span>
                        <BsCheck className={`${chack ? "red" : "black"}`} />
                      </span>{" "}
                      <span>I agree all Terms & Conditions.</span>
                    </div>
                    <div className="eight-line">
                      <button
                        onClick={() => {
                          setSucess(true);
                        }}
                      >
                        Buy Now
                      </button>
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
          <div className="mobal-button-2">
            <button onClick={buyWithFIAT}>Buy with FIAT</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProfileDrawer;
