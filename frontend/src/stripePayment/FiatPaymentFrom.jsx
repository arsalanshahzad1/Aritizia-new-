import React, { useContext, useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apis from "../service";
// import { getProviderOrSigner } from "../methods/walletManager";
import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { useNavigate } from "react-router-dom";
import { Store } from "../Context/Store";

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
  setShowPaymentForm,
  showResponseMessage,
  setSucess,
  setIsVisible,
  _nftContract,
    _tokenId,
    _sellerPlan,      
    _buyerAddress,
    _buyerPlan,
    sellerId,
    buyerId,
    ethAmount,
    setLoader
}) => {
  // console.log(index, "index");
  console.log(_nftContract,
    _tokenId,
    _sellerPlan,      
    _buyerAddress,
    _buyerPlan,
    sellerId,
    buyerId,"Mohsinssss")
  const [success, setSuccess] = useState(false);
  const [planeType, setPlaneType] = useState("monthly");
  const [showPlaneType, setShowPlaneType] = useState(false);
  const [paymentMode, setPaymentMode] = useState("recurring");
  const [ShowPaymentMode, setShowPaymentMode] = useState(false);
  const userData = JSON.parse(localStorage.getItem("data"));
  const user_id = userData?.id;
  const stripe = useStripe();
  const elements = useElements();
  const nevigate = useNavigate()

  const {account,checkIsWalletConnected,buyWithFiatPayment}=useContext(Store);

  useEffect(()=>{
    checkIsWalletConnected()
  },[account])

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      setLoader(true)
      try {
        console.log("payment_method_id: " + paymentMethod.id);
        const { id } = paymentMethod.id;
        const response = await apis.payNftByFiat({
          user_id: user_id,
          payment_method: paymentMethod.id,
          id: id,
          amount: amount,
        });

        if (response.status) {
          //_nftContract, _tokenId, _sellerPlan, _buyerAddress, _buyerPlan, sellerId, buyerId, ethAmount
          let status = await buyWithFiatPayment(_nftContract,_tokenId,_sellerPlan,_buyerAddress,_buyerPlan,sellerId,buyerId,ethAmount);
          
          if(status){
            setSucess(false)
            setIsVisible(false)
            toast.success("NFT purchased!", {
              position: toast.POSITION.TOP_RIGHT,
            });
            setShowPaymentForm(false)
            setTimeout(() =>{
              window.location.replace('/profile')
            } , 2000)
            setLoader(false)
          }else{
            toast.success("Something Wrong", {
              position: toast.POSITION.TOP_RIGHT,
            }),setLoader(false)
          }

          
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
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()
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

  return (
    <>
      {!success ? (
        <form onSubmit={handleSubmit} className="stripe-payment-form">
          <div className="payment-dd-wrap">
          </div>
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
          <h2>You just buy an NFT</h2>
        </div>
      )}
      {/* <ToastContainer /> */}
    </>
  );
};

export default FiatPaymentFrom;
