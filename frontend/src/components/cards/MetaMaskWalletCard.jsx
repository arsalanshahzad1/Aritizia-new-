import React from "react";
import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { getProviderOrSigner } from "../../methods/methods";

const MetaMaskWalletCard = () => {
  const [walletConnected, setWalletConnected] = useState(false);

  const web3ModalRef = useRef();

  // const getProviderOrSigner = async (needSigner = false) => {
  //   console.log("test1QWER");
  //   const provider = await web3ModalRef.current.connect();
  //   console.log("test1qq");

  //   const web3Provider = new providers.Web3Provider(provider);
  //   const { chainId } = await web3Provider.getNetwork();
  //   console.log("111111");
  //try {
  //   await ethereum.request({
  //     method: "wallet_switchEthereumChain",
  // params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
  // params: [{ chainId: "0x7A69" }], // localhost's chainId
  //   });
  // } catch (error) {
  //   // User rejected the network change or there was an error
  //   throw new Error("Change network to Sepolia to proceed.");
  // }

  //   if (needSigner) {
  //     const signer = web3Provider.getSigner();
  //     // console.log("getSigner");

  //     return signer;
  //   }
  //   // console.log("getProvider");
  //   return web3Provider;
  // };

  const connectWallet = async () => {
    // try {
    //   await getProviderOrSigner();
    //   setWalletConnected(true);
    // } catch (err) {
    //   console.error(err);
    // }
  };

  // useEffect(() => {
  //   // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
  //   if (!walletConnected) {
  //     web3ModalRef.current = new Web3Modal({
  //       network: "hardhat",
  //       providerOptions: {},
  //       disableInjectedProvider: false,
  //     });
  //     connectWallet();
  //     // numberOFICOTokens();
  //   }
  // }, [walletConnected]);

  return (
    <div onClick={connectWallet} className="col-lg-3 col-md-6">
      <div className="metamask-waller-card">
        <img src="/assets/images/metamask-wallet.png" alt="" />
        <h2>Metamask</h2>
        <p>
          Start exploring blockchain applications in seconds. Trusted by over 1
          million users worldwide.
        </p>
        <span>Most Popular</span>
      </div>
    </div>
  );
};

export default MetaMaskWalletCard;
