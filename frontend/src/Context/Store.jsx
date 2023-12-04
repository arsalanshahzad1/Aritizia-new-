import { ethers, providers } from "ethers";
import React, { useState, useEffect, createContext } from "react";
import marketplaceAddr from '../contractsData/ArtiziaMarketplace-address.json'
import marketplaceAbi from '../contractsData/ArtiziaMarketplace.json'
import nftContractAddr from "../contractsData/ArtiziaNFT-address.json";
import nftContractAbi from "../contractsData/ArtiziaNFT.json";
import apis from "../service";

export const Store = createContext();


const getProviderMarketContrat = () => {

    const RPC = process.env.SEPOLIA_RPC_ADDRESS;
    const provider = new ethers.providers.JsonRpcProvider(RPC); //"http://localhost:8545/"
    
    const marketContract = new ethers.Contract(marketplaceAddr.address, marketplaceAbi.abi, provider);
    return marketContract;
}

const getProviderNFTContrat = () => {
    
    const RPC = process.env.SEPOLIA_RPC_ADDRESS;
    const provider = new ethers.providers.JsonRpcProvider(RPC); //"http://localhost:8545/"

    const nftContract = new ethers.Contract(nftContractAddr.address, nftContractAbi.abi, provider);
    return nftContract;
}

export const StoreProvider = ({ children }) => {
    const [account, setAccount] = useState("")
    const [walletConnected, setWalletConnected] = useState(false);
    const [loader, setloader] = useState(false);
    const [firstTimeCall, setFirstTimeCall] = useState(false);

    console.log("Mohsin", account, walletConnected)
   const user = localStorage.getItem("data")
    const { ethereum } = window;
   const userAddress = localStorage.getItem("userAddress")  
      
        if (account) {
            if(userAddress === "false" && account !== undefined)
            {
                window.location.reload();
            }  
            localStorage.setItem('userAddress', account)
        if(firstTimeCall === false)
        {
            localStorage.setItem("address",account)  
            localStorage.setItem("firstTimeCall","true")
            
            setFirstTimeCall(true);
        }
    }

    // else if(!account && user !== "false")
    // {
    //     localStorage.setItem('userAddress', false)
    // }
    // else{
    //     localStorage.setItem('data', false)
    //     localStorage.setItem('userAddress', false)     
    // }

    const connectWallet = async () => {
        try {
            // setloader(true);
            if (!ethereum) return setError(true), setMessage("Please install Metamask");
            // toast.info("Please install Metamask");;
            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: "0x5" //Goerli
                        // chainId: "0x89", //PolygonMainnet
                        // chainId: "0xaa36a7", //sepolia
                        // chainId: "0x1", //Miannet
                        // chainId: "0x7A69" //localHost TODO/
                        // chainId:"0x13881" //mumbai
                        // chainId:"0x61"//bnb

                    },
                ],
            });
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            setAccount(accounts[0]);
            setWalletConnected(true)
            // await balanceOf(accounts[0]);
            // Get provider from Metamask
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            // setloader(false);
        } catch (err) {
            // setloader(false);
            console.log(err.message);
        }
    };

    const checkIsWalletConnected = async () => {
        try {

            window.ethereum.on("accountsChanged", async function (accounts) {
                setAccount(accounts[0]);
                // await connectWallet();
                setWalletConnected(true)
                postWalletAddress(accounts?.[0]);
                // window.location.reload()
                // await balanceOf(accounts[0]);
            });

            window.ethereum.on('chainChanged', async (chainId) => {
                console.log("chainId", chainId);
                if (chainId != "0x5") { //TODO
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                            {
                                chainId: "0x5" //Goerli
                                // chainId: "0x89", //PolygonMainnet
                                // chainId: "0xaa36a7", //sepolia
                                // chainId: "0x1", //Miannet
                                // chainId: "0x7A69" //localHost TODO
                                // chainId:"0x13881" //mumbai
                                // chainId:"0x61"//bnb

                            },
                        ],
                    });
                }
            })

            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setAccount(accounts[0]);
                setWalletConnected(true);
                postWalletAddress(accounts?.[0]);
                // window.location.reload()
            } else {
                console.log("No account Found");
                setWalletConnected(false);
                // window.location.reload()
            }
        } catch (err) {
            setWalletConnected(false);
            // window.location.reload()
            throw new Error("No ethereum Object");
        }
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

    return (
        <>
            <Store.Provider
                value={{
                    firstTimeCall,
                    account,
                    walletConnected,
                    loader,
                    getProviderMarketContrat,
                    getProviderNFTContrat,
                    connectWallet,
                    setAccount,
                    setWalletConnected,
                    checkIsWalletConnected
                }}
            >
                {children}
            </Store.Provider>


        </>
    );
}