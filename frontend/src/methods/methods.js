import React from "react";
import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import apis from "../service";

let web3ModalRef;

const getAddress = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  // console.log("accounts", accounts);

  postWalletAddress(accounts[0]);

  return accounts[0];
};
const postWalletAddress = async (address) => {
  // console.log("postWalletAddress");
  if (localStorage.getItem("data")) {
    let storedWallet = JSON.parse(localStorage.getItem("data")).wallet_address;
    // console.log("check1");
    // console.log("sss storedWallet", storedWallet);
    // console.log("sss address", address);
    storedWallet = storedWallet.toLowerCase();
    address = address.toLowerCase();

    if (storedWallet == address) {
      // console.log("check2");
      // return console.log("data is avaliable");
    } else {
      // console.log("check1");
      const response = await apis.postWalletAddress({
        wallet_address: address,
      });
      localStorage.removeItem("data");
      console.log("responsepostWalletAddress", response);
      localStorage.setItem("data", JSON.stringify(response?.data?.data));
      // console.log("check3");
      window.location.reload();
    }
  } else {
    // console.log("check4"); 
    const response = await apis.postWalletAddress({
      wallet_address: address,
    });
    localStorage.setItem("data", JSON.stringify(response?.data?.data));
    // console.log("check5");
    window.location.reload();
  }
};

// const getProviderOrSigner = async (needSigner = false) => {
//   const provider = await web3ModalRef.current.connect();
//   const web3Provider = new providers.Web3Provider(provider);
//   const { chainId } = await web3Provider.getNetwork();
//   if (chainId !== 31337) {
//     window.alert("Change the network to Sepolia");
//     throw new Error("Change network to Sepolia");
//   }

//   if (needSigner) {
//     const signer = web3Provider.getSigner();
//     // console.log("getSigner");

//     return signer;
//   }
//   // console.log("getProvider");
//   return web3Provider;
// };

// const getProviderOrSigner = async (needSigner = false) => {
//   console.log("Zayyan getProviderOrSigner");
//   const provider = new ethers.providers.JsonRpcProvider(
//     // "https://eth-sepolia.g.alchemy.com/v2/NKjOE7vypJxMq4XDWhM7O3RSrXQ7N2C5"
//     // "http://localhost:8545"
//     "https://rpc.sepolia.org"
//   );
//   const signer = provider.getSigner();
//   if (!needSigner) {
//     return provider;
//   } else {
//     return signer;
//   }
// };

// return {
//   getAddress,
// };
// };

export { getAddress, postWalletAddress };
