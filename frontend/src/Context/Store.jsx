import { ethers, providers } from "ethers";
import React, { useState, useEffect, createContext } from "react";
import marketplaceAddr from '../contractsData/ArtiziaMarketplace-address.json'
import marketplaceAbi from '../contractsData/ArtiziaMarketplace.json'
import nftContractAddr from "../contractsData/ArtiziaNFT-address.json";
import nftContractAbi from "../contractsData/ArtiziaNFT.json";
import usdtAddress from "../contractsData/TetherToken-address.json";
import usdtContractAbi from "../contractsData/TetherToken.json";
import apis from "../service";

export const Store = createContext();


const getProviderMarketContrat = () => {
  //  let RPC = process.env.SEPOLIA_RPC_ADDRESS
    let RPC = process.env.MATIC_RPC_ADDRESS
    const provider = new ethers.providers.JsonRpcProvider(RPC); //"http://localhost:8545/"
    const marketContract = new ethers.Contract(marketplaceAddr.address, marketplaceAbi.abi, provider);
    return marketContract;
}

const getProviderNFTContrat = () => {
    //let RPC = process.env.SEPOLIA_RPC_ADDRESS
    let RPC = process.env.MATIC_RPC_ADDRESS
    const provider = new ethers.providers.JsonRpcProvider(RPC); //"http://localhost:8545/"
    const nftContract = new ethers.Contract(nftContractAddr.address, nftContractAbi.abi, provider);
    return nftContract;
}

export const StoreProvider = ({ children }) => {
    const [account, setAccount] = useState("")
    const [walletConnected, setWalletConnected] = useState(false);
    const [loader, setloader] = useState(false);
    const [firstTimeCall, setFirstTimeCall] = useState(false);

    const user = localStorage.getItem("data")
    const { ethereum } = window;
    const userAddress = localStorage.getItem("userAddress")

    if (account) {
        if (userAddress === "false" && account !== undefined) {
            window.location.reload();
        }
        
        localStorage.setItem('userAddress', account)
        if (firstTimeCall === false) {
            localStorage.setItem("address", account)
            localStorage.setItem("firstTimeCall", "true")

            setFirstTimeCall(true);
        }
    }

    const connectWallet = async () => {
            // Metamask is on desktop, proceed with wallet connection
            try {
                await ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [
                        {
                        // chainId: "0x5" //Goerli
                        // chainId: "0x89", //PolygonMainnet
                        // chainId: "0xaa36a7", //sepolia
                        // chainId: "0x1", //Miannet
                        // chainId: "0x7A69" //localHost TODO
                        chainId:process.env.CHAIN_ID //mumbai
                        // chainId:"0x61"//bnb
                        },
                    ],
                });
    
                const accounts = await window.ethereum.request({
                    method: "eth_requestAccounts",
                });
    
                if (accounts && accounts.length > 0) {
                    setAccount(accounts[0]);
                    setWalletConnected(true);
                } else {
                    // setError(true);
                    // setMessage("No Ethereum accounts found. Please check your Metamask setup.");
                }
            } catch (err) {
                // setError(true);
                // setMessage(err.message);
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
                if (chainId != process.env.CHAIN_ID) { //TODO
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                            {
                                // chainId: "0x5" //Goerli
                                // chainId: "0x89", //PolygonMainnet
                                // chainId: "0xaa36a7", //sepolia
                                // chainId: "0x1", //Miannet
                                // chainId: "0x7A69" //localHost TODO
                                chainId:process.env.CHAIN_ID
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
            } else {
                setWalletConnected(false);
            }
        } catch (err) {
            setWalletConnected(false);
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

    const getSignerMarketContrat = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const marketContract = new ethers.Contract(marketplaceAddr.address, marketplaceAbi.abi, signer);
        return marketContract;
    }

    const getSignerNFTContrat = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(nftContractAddr.address, nftContractAbi.abi, signer);
        return nftContract;
    }

    const getSignerUSDTContrat = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(usdtAddress.address, usdtContractAbi.abi, signer);
        return nftContract;
    }

    const buyWithFiatPayment = async ( _nftContract,  _tokenId, _sellerPlan, _buyerAddress, _buyerPlan, sellerId,buyerId,amount) => {
        if(account){
            let RPC = process.env.MATIC_RPC_ADDRESS
            const provider = new ethers.providers.JsonRpcProvider(RPC); //"http://localhost:8545/"
            let PRIVATE_KEYS = process.env.PRIVATE_KEYS;
            const wallet = new ethers.Wallet(PRIVATE_KEYS, provider); // Replace with your private key
            const marketplaceContract = new ethers.Contract(marketplaceAddr.address, marketplaceAbi.abi, wallet);
            let buy = await marketplaceContract.buyWithFIAT(_nftContract, _tokenId, _sellerPlan, _buyerAddress, _buyerPlan, sellerId, buyerId,
              {
                value: amount?.toString(),
                gasLimit: ethers.BigNumber.from("30000000"),
              });
              buy.wait();
            return true;
        }
        else{
            return false;
        }
        
    }



    return (
        <>
            <Store.Provider
                value={{
                    firstTimeCall,
                    account,
                    walletConnected,
                    loader,
                    buyWithFiatPayment,
                    getSignerUSDTContrat,
                    getSignerMarketContrat,
                    getSignerNFTContrat,
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