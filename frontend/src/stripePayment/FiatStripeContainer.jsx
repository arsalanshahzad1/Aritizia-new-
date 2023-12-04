import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'
import FiatPaymentFrom from './FiatPaymentFrom'

const PUBLIC_KEY = "pk_test_51NSaCXCt3RaL5WVcM0wwsKmoPMRRZRK9mM217g2t36lIlTk3POR39cnwJXs4WiSDrKMM08LiXewtaakvvLB3Hf7M00EgNbVfwa"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

const FiatStripeContainer = ({_nftContract,
  _tokenId,
  _sellerPlan,
  _buyerAddress,
  _buyerPlan,
  sellerId,
  buyerId,id ,amount , setShowPaymentForm , showResponseMessage , setSucess ,setIsVisible, ethAmount,setLoader}) => {


  return (
    <Elements stripe={stripeTestPromise}>
        <FiatPaymentFrom 
        setLoader={setLoader}
        id={id} 
        amount={amount} 
        setShowPaymentForm={setShowPaymentForm} 
        showResponseMessage={showResponseMessage} 
        setSucess={setSucess}
        setIsVisible={setIsVisible}
        _nftContract={_nftContract}
        _tokenId={_tokenId}
        _sellerPlan={_sellerPlan}
        _buyerAddress={_buyerAddress}
        _buyerPlan={_buyerPlan}
        sellerId={sellerId}
        buyerId={buyerId} 
        ethAmount={ethAmount}
        />
    </Elements >
  )
}

export default FiatStripeContainer