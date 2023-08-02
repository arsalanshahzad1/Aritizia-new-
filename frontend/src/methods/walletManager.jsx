import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { providers } from "ethers";

const web3ModalRef = new Web3Modal({
  network: "hardhat",
  providerOptions: {},
  disableInjectedProvider: false,
});

export const getProviderOrSigner = async (needSigner = false) => {
  console.log("getProviderOrSigner");

  const provider = await web3ModalRef.connect();
  const web3Provider = new providers.Web3Provider(provider);
  const { chainId } = await web3Provider.getNetwork();
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x7A69" }], // localhost's chainId
   // params: [{ chainId: "0xaa36a7" }], // sepolia's chainId

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
export const connectWallet = async (setWalletConnected) => {
  console.log("connectWallet");
  try {
    await getProviderOrSigner();
    // setWalletConnected(true);
  } catch (err) {
    console.error(err);
  }
};

const WalletManager = ({ setWalletConnected }) => {
  // useEffect(() => {
  //   if (!setWalletConnected) return;
  //   if (!setWalletConnected) {
  //     connectWallet(setWalletConnected);
  //   }
  // }, [setWalletConnected]);

  return <></>;
};

export default WalletManager;
