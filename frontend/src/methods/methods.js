import React from "react";
import { useState, useEffect, useRef } from "react";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import apis from '../service';
const getAddress = async () => {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });
  postWalletAddress(accounts[0]);

  return accounts[0];
};

const postWalletAddress = async (address) => {
  console.log("postWalletAddress");
  if (localStorage.getItem("data")) {
    let storedWallet = JSON.parse(localStorage.getItem("data")).wallet_address;
    storedWallet = storedWallet.toLowerCase();
    address = address.toLowerCase();

    // if (localStorage.getItem("data")) {
    if (storedWallet == address) {
      return console.log("data is avaliable");
    } else {
      const response = await apis.postWalletAddress({
        wallet_address: address,
      });
      localStorage.setItem("data", JSON.stringify(response.data.data));
      window.location.reload();
    }
  } else {
    const response = await apis.postWalletAddress({
      wallet_address: address,
    });
    localStorage.setItem("data", JSON.stringify(response.data.data));
    window.location.reload();
  }
};

// return {
//   getAddress,
// };
// };

export { getAddress };
