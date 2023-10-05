import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import PaymentForm from './PaymentForm'

const PUBLIC_KEY = "pk_test_51NSaCXCt3RaL5WVcM0wwsKmoPMRRZRK9mM217g2t36lIlTk3POR39cnwJXs4WiSDrKMM08LiXewtaakvvLB3Hf7M00EgNbVfwa"

const stripeTestPromise = loadStripe(PUBLIC_KEY)

const StripeContainer = ({planName , setShowPaymentForm , showResponseMessage , index , viewSubscriptions}) => {
  return (
    <Elements stripe={stripeTestPromise}>
        <PaymentForm planName={planName} viewSubscriptions={viewSubscriptions} index={index} setShowPaymentForm={setShowPaymentForm} showResponseMessage={showResponseMessage}/>
    </Elements >
  )
}

export default StripeContainer