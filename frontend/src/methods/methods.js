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
  postWalletAddress(accounts?.[0]);
  return accounts[0];
};

const postWalletAddress = async (address) => {
  let localstrageUserData = localStorage.getItem("data");

  let storedWallet = JSON.parse(localStorage.getItem("data"))?.wallet_address;
  let isEmail = JSON.parse(localStorage.getItem("data"))?.is_email;
  let id = JSON.parse(localStorage.getItem("data"))?.id;
  
  if (localstrageUserData === null) {
    const response = await apis.postWalletAddress({
      wallet_address: address,
      user_id: 0,
    });
    localStorage.setItem("data", JSON.stringify(response?.data?.data));
  } else {
    if (!isEmail && storedWallet != "") {
      if (localStorage.getItem("data")) {
        storedWallet = storedWallet?.toLowerCase();
        address = address?.toLowerCase();

        if (storedWallet == address) {
        } else {
          const response = await apis.postWalletAddress({
            wallet_address: address,
            user_id: 0,
          });
          localStorage.removeItem("data");
          localStorage.setItem("data", JSON.stringify(response?.data?.data));
        }
      } else {
        const response = await apis.postWalletAddress({
          wallet_address: address,
          user_id: id,
        });
        localStorage.setItem("data", JSON.stringify(response?.data?.data));
      }
    } else {
      const response = await apis.postWalletAddress({
        wallet_address: address,
        user_id: id,
      });
      localStorage.setItem("data", JSON.stringify(response?.data?.data));
    }
  }
};

export { getAddress, postWalletAddress };
