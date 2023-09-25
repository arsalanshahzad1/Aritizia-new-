import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";
import FiatPaymentFrom from "./FiatPaymentFrom";

const PUBLIC_KEY =
  "pk_test_51NSaCXCt3RaL5WVcM0wwsKmoPMRRZRK9mM217g2t36lIlTk3POR39cnwJXs4WiSDrKMM08LiXewtaakvvLB3Hf7M00EgNbVfwa";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const FiatStripeContainer = ({
  id,
  amount,
  paymentMethod,
  sellerPlan,
  buyerPlan,
  ethWeiForFiat,
  setShowPaymentForm,
  showResponseMessage,
  setSucess,
  setIsVisible,
}) => {
  return (
    <Elements stripe={stripeTestPromise}>
      <FiatPaymentFrom
        id={id}
        amount={amount}
        paymentMethodd={paymentMethod}
        sellerPlan={sellerPlan}
        buyerPlan={buyerPlan}
        ethWeiForFiat={ethWeiForFiat}
        setShowPaymentForm={setShowPaymentForm}
        showResponseMessage={showResponseMessage}
        setSucess={setSucess}
        setIsVisible={setIsVisible}
      />
    </Elements>
  );
};

export default FiatStripeContainer;
