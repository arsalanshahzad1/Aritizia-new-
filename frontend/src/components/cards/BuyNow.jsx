import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "./Cards.css";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import ProfileDrawer from "../shared/ProfileDrawer";
import FiatStripeContainer from "../../stripePayment/FiatStripeContainer";
import { AiOutlineClose } from "react-icons/ai";
import Modal from "react-bootstrap/Modal";
import { getProviderOrSigner } from "../../methods/walletManager";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import apis from "../../service";

const BuyNow = ({
  path,
  id,
  title,
  image,
  price,
  discountPrice,
  crypto,
  royalty,
  description,
  collection,
  collectionImages,
  seller,
  size
  // userAddress,
}) => {
  const [showLinks, setShowLinks] = useState(false);
  // const [walletConnected, setWalletConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [buyButton, showBuyButton] = useState(false);
  const [showFiatPaymentForm, setShowFiatPaymentForm] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [discountedEth, setDiscountedEth] = useState(0);
  const [discountedAmountUSD, setDiscountedAmountUSD] = useState(0);
  const [platformFeeUSDT, setPlatformFeeUSDT] = useState(0);
  const [platformFeeETH, setPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeETH, setDiscountedPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeUSDT, setDiscountedPlatformFeeUSDT] = useState(0);
  const [priceETH, setPriceETH] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [getSellerPlan, setSellerPlan] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");
  const [nftDetails, setNftDetails] = useState("");
  const [fiatAmount, setFiatAmount] = useState("");
  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const getBuyerPlan = userData?.subscription_plan;
  let sellerPlan = getSellerPlan;
  let buyerPlan = getBuyerPlan;

  const platformFeeCalculate = async (_amount, _buyerPercent) => {
    let _amountToDeduct;
    _amountToDeduct = (_amount * _buyerPercent) / 100;
    return _amountToDeduct;
  };

  const getPriceInUSD = async () => {
    const provider = await getProviderOrSigner();

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

  const checkSeller = async () => {
    // const provider = await getProviderOrSigner();

    // const marketplaceContract = new Contract(
    //   MARKETPLACE_CONTRACT_ADDRESS.address,
    //   MARKETPLACE_CONTRACT_ABI.abi,
    //   provider
    // );

    // const structData = await marketplaceContract._idToNFT(id);
    // let seller = structData.seller;
    console.log("checkSeller Seller", seller);
    console.log("checkSeller userAddress", userAddress);
    console.log("checkSeller Seller == userAddress", seller == userAddress);


    if (userAddress != seller) {
      showBuyButton(true);
    } else {
      showBuyButton(false);
    }
  };

  useEffect(() => {

  }, [fiatAmount])
  useEffect(() => {
    checkSeller();
  }, []);

  const getNFTDetailByNFTTokenId = async (id) => {
    try {
      const response = await apis.getNFTByTokenId(id);
      console.log("ressss", response);
      setNftDetails(response?.data?.data);
      setSellerPlan(response?.data?.data?.subscription_plan);
    } catch (e) {
      console.log("Error: ", e);
    }
  };



  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const openDrawer = () => {
    if (showLinks === true) {
      setShowLinks(false);
      // setIsVisible(true);
    } else {
      setIsVisible(true);
    }
  };

  const [nftImg, setNftImg] = useState("");
  let paymentMethod = crypto;
  useEffect(() => {
    if (
      typeof image === "string" &&
      image.startsWith("https://ipfs.io/ipfs/")
    ) {
      // Fetch the blob URL and convert it to a File object
      fetch(image)
        .then((response) => response.blob())
        .then((blob) => {
          const convertedFile = new File([blob], "convertedImage.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          setNftImg(URL.createObjectURL(convertedFile));
        })
        .catch((error) => {
          console.error("Error fetching or converting the blob:", error);
          setNftImg(null);
        });
    } else {
      setNftImg(image);
    }
  }, [image]);

  const showResponseMessage = (message) => {
    setShowFiatPaymentForm(false);
    toast.success(message, {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  let ethPurchase = false;

  const buyWithETH = async () => {
    console.log("11111111111111");

    ethPurchase = true;
    const signer = await getProviderOrSigner(true);
    console.log("2222222222222");

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );
    console.log("3333333333333");

    const structData = await marketplaceContract._idToNFT(id);
    console.log("4444444444444");

    let nftEthPrice = ethers.utils.formatEther(structData.price.toString());
    console.log("555555555555");

    var fee = +platformFeeETH;
    var amount = +priceETH + fee;
    var value = amount.toString();
    console.log("ETH amount", value);

    let checkFan = await marketplaceContract.checkFan(id);

    const structData2 = await marketplaceContract._idToNFT2(id);
    let discount = +structData2.fanDiscountPercent.toString();

    if (checkFan && discount != 0) {
      fee = +discountedPlatformFeeETH;
      console.log("www discountedPlatformFeeETH", discountedPlatformFeeETH);
      console.log("www discountedEth", discountedEth);

      // check this
      amount = +discountedEth + fee;
      value = amount.toString();
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
    const structData2 = await marketplaceContract._idToNFT2(id);
    let discount = +structData2.fanDiscountPercent.toString();

    if (checkFan && discount != 0) {
      fee = +discountedPlatformFeeUSDT;
      console.log("fee", fee);
      console.log("www platformFeeUSDT", platformFeeUSDT);
      console.log("www amountUSD", fee);

      console.log("www discountedPlatformFeeUSDT", discountedPlatformFeeUSDT);
      console.log("www discountedAmountUSD", discountedAmountUSD);

      amount = Math.ceil(Number(discountedAmountUSD)) + Math.ceil(fee);
      amountInWei = amount * 10 ** 6;
      amountInWei = amountInWei.toString();

      console.log("www fee", fee);
      console.log("www amount", amount);
      console.log("www amountInWei", amountInWei);
    }
    console.log("amountInWei  ", amountInWei);
    console.log(
      "MARKETPLACE_CONTRACT_ADDRESS.address  ",
      MARKETPLACE_CONTRACT_ADDRESS.address
    );

    const appprove = await USDTContract.approve(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      amountInWei,
      { gasLimit: ethers.BigNumber.from("50000") }
    );

    appprove.wait();
    console.log("www ");
    console.log("wwwasda ");
    var amountETH = +priceETH + +platformFeeETH;
    var value = amountETH.toString();
    console.log("www amountETH", value);

    console.log("www paymentMethod", paymentMethod);
    console.log("www id", id);
    console.log("www sellerPlan", sellerPlan);
    console.log("www buyerPlan", buyerPlan);
    console.log("www address", NFT_CONTRACT_ADDRESS.address);
    console.log("www amountInWei", amountInWei);
    let amountInETHInWei = ethers.utils.parseEther(value).toString();
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

  const getFiatAmount = async () => {

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
    const structData2 = await marketplaceContract._idToNFT2(id);
    let discount = +structData2.fanDiscountPercent.toString();

    if (checkFan && discount != 0) {
      fee = +discountedPlatformFeeUSDT;
      console.log("fee", fee);
      console.log("www platformFeeUSDT", platformFeeUSDT);
      console.log("www amountUSD", fee);

      console.log("www discountedPlatformFeeUSDT", discountedPlatformFeeUSDT);
      console.log("www discountedAmountUSD", discountedAmountUSD);

      amount = Math.ceil(Number(discountedAmountUSD)) + Math.ceil(fee);
      amountInWei = amount * 10 ** 6;
      amountInWei = amountInWei.toString();

      console.log("www fee", fee);
      console.log("www amount", amount);
      console.log("www amountInWei", amountInWei);
    }

    // ye wala bhej USD ki amount h ye 
    console.log("ye usd ki amount h", amount);
    // setShowFiatPaymentForm(true)
    setFiatAmount(amount)

  };

  const buyWithFiat = async () => {
    await getPriceInUSD();
    await getFiatAmount();
    setShowFiatPaymentForm(true)
  }
  // const [scroll, setScroll] = useState(true)

  // useEffect(()=>{
  //   if(scroll){
  //     window.scrollTo(0,0)
  //     setScroll(false)
  //   }
  // },[])

  return (
    <>
      <div className={`${size} col-md-4`}>
        <Link to={path}>
          <div className="css-vurnku" style={{ position: "relative" }}>
            <a className="css-118gt74" >
              <div className="css-15eyh94">
                <div className="css-2r2ti0" onClick={() => openDrawer()}>
                  <div className="css-15xcape">
                    <span
                      className="lazy-load-image-custom-wrapper lazy-load-image-background  lazy-load-image-loaded"
                      style={{
                        display: "flex",
                        width: "100% ",
                        height: "100%",
                        borderRadius: "8px 8px 0px 0px",
                      }}
                    >
                      <img src={nftImg} className="J-image" />
                      {showLinks && (
                        <div className="social-links">
                          <ul>
                            <li>
                              <a>
                                <LinkedinShareButton
                                  url="http://artizia.pluton.ltd"
                                  title="Ali Khan"
                                >
                                  <p>Linkedin</p>
                                </LinkedinShareButton>
                              </a>
                            </li>
                            <li>
                              <a>
                                <TwitterShareButton
                                  url="http://artizia.pluton.ltd"
                                  title="Ali Khan"
                                >
                                  <p>Twitter</p>
                                </TwitterShareButton>
                              </a>
                            </li>
                            <li>
                              <a>
                                <FacebookShareButton
                                  url="http://artizia.pluton.ltd"
                                  title="Ali Khan"
                                >
                                  <p>Facebook</p>
                                </FacebookShareButton>
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="J-bottom css-1xg74gr"
                style={{ position: "relative" }}
              >
                {/* <BiDotsHorizontalRounded className="doted-icon" /> */}
                <div className="css-fwx73e">
                  <div className="css-10nf7hq detail-wrap" onClick={() => openDrawer()}>
                    <div className="center-icon">
                      <div className="icon">
                        {/* <img src={collectionImages && collectionImages} alt="" /> */}
                            {collectionImages == null ?
                                <img src='/assets/images/user-none.png' alt="" />
                                :
                                <img src={collectionImages} alt="" />
                            }
                        <img src="/assets/images/chack.png" alt="" />
                      </div>
                    </div>
                    <div className="top">
                      <div className="left">{title}</div>
                      <div className="right">{id}</div>
                    </div>
                    <div className="bottom">
                      <div className="left">Price</div>
                      <div className="right">
                        <img src="/assets/images/bitCoin.png" alt="" />
                        {price}
                      </div>
                    </div>
                    <div className="css-x2gp5l"></div>
                  </div>
                </div>
                <div className="J-buynow css-1elubna">
                  {/* <div className="button css-pxd23z">
                                        <p>Read More</p>
                                    </div> */}
                  {userAddress?.toUpperCase() !== seller?.toUpperCase() ? (
                    <div className="button css-pxd23z" onClick={() => {
                      setSucess(true);
                      getNFTDetailByNFTTokenId(id)
                      getPriceInUSD();
                      getFiatAmount();
                    }} >
                      <p>Buy Now</p>
                      <span>
                        <img src="/assets/icons/shop.png" alt="" />
                      </span>
                    </div>
                  )
                  : (
                    <div className="button css-pxd23z" style={{display: "flex", justifyContent:"center"}}>
                      <p>Your nft</p>
                    </div>
                  )
                  }
                </div>
              </div>
            </a>
            <span
              className="btc-gray-logo"
              onClick={() => {
                setShowLinks(!showLinks);
              }}
            >
              <span>
                <BsShareFill />
              </span>
            </span>
            {/* <img src="/assets/images/btc.png" alt="" className='btc-gray-logo' onClick={() => { setShowLinks(!showLinks) }} /> */}
          </div>
        </Link>

        {/* <button onClick={buyWithETH}>Buy with ETH</button>
                                    <button onClick={buyWithUSDT}>Buy with USDT</button> */}
      </div>
      <ProfileDrawer
        isVisible={isVisible}
        onClose={onClose}
        id={id}
        title={title}
        image={image}
        price={price}
        discountPrice={discountPrice}
        paymentMethod={crypto}
        royalty={royalty}
        description={description}
        collection={collection}
        userAddress={userAddress}
        setIsVisible={setIsVisible}
        sellerWallet={seller}
      />
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
            {/* <button onClick={buyWithFIAT}>Buy with FIAT</button> */}
            <button onClick={() => { buyWithFiat() }}>Buy with FIAT</button>
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
    </>
  );
};

export default BuyNow;
