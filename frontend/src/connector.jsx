// import Web3Modal from "web3modal";
// import { Contract, providers } from "ethers";
// import React, { useEffect, useState, useRef } from "react";

// import {
//   MARKETPLACE_CONTRACT_ADDRESS,
//   MARKETPLACE_CONTRACT_ABI,
//   NFT_CONTRACT_ADDRESS,
//   NFT_CONTRACT_ABI,
// } from "../Constants";

// export default function Connector() {
//   // True if user has connected their wallet, false otherwise
//   // const [walletConnected, setWalletConnected] = useState(false);

//   const web3ModalRef = useRef();

//   const [tokenURIs, setTokenURIs] = useState([]);

//   // Helper function to connect wallet
//   const connectWallet = async () => {
//     try {
//       await getProviderOrSigner();
//       setWalletConnected(true);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   // Helper function to fetch a Provider/Signer instance from Metamask
//   const getProviderOrSigner = async (needSigner = false) => {
//     const provider = await web3ModalRef.current.connect();
//     const web3Provider = new providers.Web3Provider(provider);

//     const { chainId } = await web3Provider.getNetwork();
//     if (chainId !== 5) {
//       window.alert("Please switch to the Goerli network!");
//       throw new Error("Please switch to the Goerli network");
//     }

//     if (needSigner) {
//       const signer = web3Provider.getSigner();
//       return signer;
//     }
//     return web3Provider;
//   };

//   useEffect(() => {
//     if (!walletConnected) {
//       web3ModalRef.current = new Web3Modal({
//         network: "goerli",
//         providerOptions: {},
//         disableInjectedProvider: false,
//       });
//       connectWallet();
//       // connectWallet().then(() => {

//       // });
//     }
//   }, [walletConnected]);

//   const mintThenList = async () => {
//     try {
//       const signer = await getProviderOrSigner(true);
//       // Create a new instance of the Contract with a Signer, which allows
//       // update methods
//       const nftContract = new Contract(
//         NFT_CONTRACT_ADDRESS,
//         NFT_CONTRACT_ABI,
//         signer
//       );
//       // call the mint from the contract to mint the Crypto Dev
//       const tx = await nftContract.mint(tokenURIs);
//       setLoading(true);
//       // wait for the transaction to get mined
//       await tx.wait();
//       setLoading(false);

//       const marketplaceContract = new Contract(
//         MARKETPLACE_CONTRACT_ADDRESS,
//         MARKETPLACE_CONTRACT_ABI,
//         signer
//       );

//       const tx2 = await marketplaceContract.listNft(
//         NFT_CONTRACT_ADDRESS,
//         tokenURIs,
//         nftPrice,
//         nftRoyaltyPrice,
//         listingType,
//         startTime,
//         endTime
//       );

//       setLoading(true);
//       // wait for the transaction to get mined
//       await tx2.wait();
//       setLoading(false);

//       window.alert("You successfully minted a Crypto Dev!");
//     } catch (err) {
//       console.error(err);
//     }
//   };
// }
