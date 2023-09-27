import React, { useState, useEffect } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apis from "../service";
import { getProviderOrSigner } from "../methods/walletManager";
import { useNavigate } from "react-router-dom";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";

import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#929292",
      color: "#929292",
      fontWeight: 500,
      fontFamily: "poppins",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-wevkit-autofill": { color: "fce883" },
      "::placeholder": { color: "#B7bbfd" },
    },
    invalid: {
      iconColor: "red",
      color: "red",
    },
  },
};

const FiatPaymentFrom = ({
  id,
  amount,
  paymentMethodd,
  sellerPlan,
  // buyerPlan,
  ethWeiForFiat,
  setShowPaymentForm,
  showResponseMessage,
  setSucess,
  setIsVisible,
}) => {
  // console.log(index, "index");
  const [success, setSuccess] = useState(false);
  const [planeType, setPlaneType] = useState("monthly");
  const [showPlaneType, setShowPlaneType] = useState(false);
  const [paymentMode, setPaymentMode] = useState("recurring");
  const [ShowPaymentMode, setShowPaymentMode] = useState(false);
  const [getSellerPlan, setSellerPlan] = useState("");
  const [discountedEth, setDiscountedEth] = useState(0);
  const [discountedAmountUSD, setDiscountedAmountUSD] = useState(0);
  const [platformFeeUSDT, setPlatformFeeUSDT] = useState(0);
  const [platformFeeETH, setPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeETH, setDiscountedPlatformFeeETH] = useState(0);
  const [priceETH, setPriceETH] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [discountedPlatformFeeUSDT, setDiscountedPlatformFeeUSDT] = useState(0);
  const userData = JSON.parse(localStorage.getItem("data"));
  console.log("userData", userData);
  const user_id = userData?.id;
  const buyerPlan = userData?.subscription_plan;

  const stripe = useStripe();
  const elements = useElements();
  const nevigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        // console.log("payment_method_id: " + paymentMethod.id);
        // console.log("payment_method_id1: ", paymentMethod);
        // const { id } = paymentMethod.id;
        const response = await apis.payNftByFiat({
          user_id: user_id,
          payment_method: paymentMethod.id,
          id: id,
          amount: amount,
        });

        if (response.status) {
          await buyWithFIAT();
          setSucess(false);
          setIsVisible(false);
          toast.success("NFT purchased!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          setShowPaymentForm(false);

          setTimeout(() => {
            window.location.replace("/profile");
          }, 2000);

          // viewSubscriptions(user_id)
        }
        // {
        //     amout : 1000,
        //     id
        // })
        // if (response.status) {
        //   console.log("Success", response);
        //   console.log("zzzzz ", index);
        //   // toast.success(response?.data?.message, {
        //   //     position: toast.POSITION.TOP_RIGHT,
        //   // });
        //   console.log("QQ One");
        //   await updateUserPlanInSC(index);
        //   console.log("QQ Two");

        //   toast.success("Plan purchased!", {
        //     position: toast.POSITION.TOP_RIGHT,
        //   });

        //   //   setTimeout(() => {
        //   //     window.location.reload();
        //   //   }, 1500);

        //   //   showResponseMessage(response?.data?.message);
        //   setShowPaymentForm(false);
        // } else {
        //   toast.error(response?.data?.message, {
        //     position: toast.POSITION.TOP_RIGHT,
        //   });
        // }
      } catch (error) {
        console.log("Error", error.message);
        toast.error(error.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      console.log("Error", error);

      toast.error(error?.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const updateUserPlanInSC = async (planId) => {
    const signer = await getProviderOrSigner(true);
    console.log("QQ Three");

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    let buySubscription = await (
      await marketplaceContract.setUserSubscription(planId)
    ).wait();
    console.log("QQ Four");

    console.log("buySubscription", buySubscription);

    // toast.success("Plan purchased!", {
    //   position: toast.POSITION.TOP_RIGHT,
    // });

    // setTimeout(() => {
    //   window.location.reload();
    // }, 1500);
  };

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
    console.log("aaa priceETH", priceETH);
    console.log("aaa _buyerPercent", _buyerPercent);
    console.log("asaa feeETH", feeETH);
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

  useEffect(() => {
    getPriceInUSD();
  }, []);

  let fiatPurchase = false;

  const buyWithFIAT = async () => {
    // console.log("11111111111111");

    const res = await apis.getNFTByTokenId(id);
    console.log("ressss", res);
    console.log("ressss", res?.data?.data?.subscription_plan);

    let sellerPlan = res?.data?.data?.subscription_plan;
    // setSellerPlan(sellerPlan);
    fiatPurchase = true;
    const signer = await getProviderOrSigner(true);
    // console.log("2222222222222");

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    const structData = await marketplaceContract._idToNFT(id);
    console.log("4444444444444");

    let nftEthPrice = ethers.utils.formatEther(structData.price.toString());
    console.log("555555555555");

    var fee = +platformFeeETH;
    var amount = +priceETH + fee;
    var value = amount * 10 ** 18;

    console.log("ETH amount", value);

    let checkFan = await marketplaceContract.checkFan(id);

    const structData2 = await marketplaceContract._idToNFT2(id);
    let discount = +structData2.fanDiscountPercent.toString();

    if (checkFan && discount != 0) {
      fee = +discountedPlatformFeeETH;
      // console.log("www discountedPlatformFeeETH", discountedPlatformFeeETH);
      // console.log("www discountedEth", discountedEth);

      // check this
      amount = +discountedEth + fee;
      value = amount * 10 ** 18;
    }

    console.log("www paymentMethodd", paymentMethodd);
    console.log("www id", id);
    console.log("www sellerPlan", sellerPlan);
    console.log("www buyerPlan", buyerPlan);
    console.log("www value", value);
    console.log("www amount", amount);

    amount = amount.toString();
    // console.log(
    //   "www ethers.utils.parseEther(amount)",
    //   ethers.utils.parseEther(amount.toString())
    // );

    let gas = await marketplaceContract.estimateGas.buyWithFIAT(
      NFT_CONTRACT_ADDRESS.address,
      paymentMethodd,
      id,
      sellerPlan,
      buyerPlan,
      // value,
      // ethers.utils.parseEther(value).toString(),
      ethers.utils.parseEther(amount),
      {
        gasLimit: ethers.BigNumber.from("300000"),
      }
    );

    console.log("gas", gas.toString());

    await (
      await marketplaceContract.buyWithFIAT(
        NFT_CONTRACT_ADDRESS.address,
        paymentMethodd,
        id,
        sellerPlan,
        buyerPlan,
        // value,
        // ethers.utils.parseEther(value).toString(),
        ethers.utils.parseEther(amount),
        {
          gasLimit: ethers.BigNumber.from("30000000"),
        }
      )
    ).wait();
    console.log("buyWithETH");

    let response = marketplaceContract.on(
      "NFTSold",
      fiatPurchase ? handleNFTSoldEvent : null
    );

    console.log("Response of bid even", response);
  };

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit} className="stripe-payment-form">
          <div className="payment-dd-wrap"></div>
          <fieldset className="FormGroup">
            <div className="FormRow">
              <CardElement options={CARD_OPTIONS} />
            </div>
          </fieldset>
          <div style={{ textAlign: "center" }}>
            <button>Pay now</button>
          </div>
        </form>
      ) : (
        <div>
          <h2>You just buy an nft</h2>
        </div>
      )}
      {/* <ToastContainer /> */}
    </>
  );
};

export default FiatPaymentFrom;
