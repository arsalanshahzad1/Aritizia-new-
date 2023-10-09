// import { useState, useEffect, useRef } from "react";
// import Web3Modal from "web3modal";
// import { providers } from "ethers";

// import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
// import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";

// const web3ModalRef = new Web3Modal({
//   network: "hardhat",
//   providerOptions: {},
//   disableInjectedProvider: false,
// });

// export const getProviderOrSigner = async (needSigner = false) => {

//   const provider = await web3ModalRef.connect();
//   const web3Provider = new providers.Web3Provider(provider);
//   const { chainId } = await web3Provider.getNetwork();
//   try {
//     await ethereum.request({
//       method: "wallet_switchEthereumChain",
//       params: [{ chainId: "0x7A69" }], // localhost's chainId
//       // params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
//       // params: [{ chainId: "0x5" }], // goerli's chainId
//     });
//   } catch (error) {
//     throw new Error("Change the network to proceed.");
//   }

//   if (needSigner) {
//     const signer = web3Provider.getSigner();
//     return signer;
//   }

//   return web3Provider;
// };
// export const connectWallet = async (setWalletConnected) => {
//   console.log("connectWallet");
//   try {
//     await getProviderOrSigner();
//   } catch (err) {
//     console.error(err);
//   }
// };

// export const getLatestUSDTPrice = async () => {
//   const provider = await getProviderOrSigner();

//   const marketplaceContract = new Contract(
//     MARKETPLACE_CONTRACT_ADDRESS.address,
//     MARKETPLACE_CONTRACT_ABI.abi,
//     provider
//   );

//   let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

//   return dollarPriceOfETH;
// };

// const WalletManager = ({ setWalletConnected }) => {

//   return <></>;
// };

// export default WalletManager;
