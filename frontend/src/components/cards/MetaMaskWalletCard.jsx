import React, { useContext, useEffect } from "react";
import { Store } from "../../Context/Store";
// import { connectWallet } from "../../methods/walletManager";

const MetaMaskWalletCard = ({ userWalletAddress}) => {
const{account,connectWallet,checkIsWalletConnected}=useContext(Store);

useEffect(()=>{
  checkIsWalletConnected();
},[account])

  return (
    <div  onClick={()=>{
      if(userWalletAddress === "false")
      {
        connectWallet()
      }
    }} className="col-lg-3 col-md-6">
      <div className="metamask-waller-card">
        <img src="/assets/images/metamask-wallet.png" alt="" />
        <h2>Metamask</h2>
        <p>
          Start exploring blockchain applications in seconds. Trusted by over 1
          million users worldwide.
        </p>
        
        <span>{userWalletAddress === "false" ? <>Connect Now</>: <>Connected</>}</span>
      </div>
    </div>
  );
};

export default MetaMaskWalletCard;
