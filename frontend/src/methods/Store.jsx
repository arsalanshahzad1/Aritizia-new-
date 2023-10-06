import { ethers, providers } from "ethers";
import React, { useState, useEffect, createContext } from "react";
export const Store = createContext();


const getProviderPEGTOKENContrat = () => {
    //  const provider = new ethers.providers.Web3Provider(ethereum);  // TODO

    // const provider = new ethers.providers.JsonRpcProvider(process.env.LocalRpc);
    let RPC = process.env.REACT_APP_RPC;
    // console.log("RPC",RPC);

    // const customRpcProvider = new providers.JsonRpcProvider(RPC);
    // console.log("RPC",customRpcProvider);

    const provider = new ethers.providers.JsonRpcProvider(RPC);//"http://localhost:8545/"

    // const provider = new ethers.providers.JsonRpcProvider(RPC);

    // const provider = new ethers.providers.JsonRpcProvider(
    //   `https://eth-goerli.g.alchemy.com/v2/${process.env.TESTNET_API}`
    // );

    // const provider = new ethers.providers.JsonRpcProvider(
    //   `https://eth-mainnet.g.alchemy.com/v2/${process.env.MAINNET_API}`
    // );
    const PEGContract = new ethers.Contract(PEGTOKEN_CONTRACT_ADDRESS.address, PEGTOKEN_CONTRACT_ABI.abi, provider);
    return PEGContract;
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

    // const getPEGTokenContrat = () => {
    //     const provider = new ethers.providers.Web3Provider(ethereum);
    //     const signer = provider.getSigner();
    //     const PEGContract = new ethers.Contract(PEGTOKEN_CONTRACT_ADDRESS.address, PEGTOKEN_CONTRACT_ABI.abi, signer);
    //     return PEGContract;
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
                        // chainId: "0x5" //Goerli
                        // chainId: "0x89", //PolygonMainnet
                        // chainId: "0xAA36A7", //sepolia
                        // chainId: "0x1", //Miannet
                        chainId: "0x7A69" //localHost TODO
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
                // window.location.reload()
                // await balanceOf(accounts[0]);
            });

            window.ethereum.on('chainChanged', async (chainId) => {
                console.log("chainId", chainId);
                if (chainId != "0x7A69") { //TODO
                    await ethereum.request({
                        method: "wallet_switchEthereumChain",
                        params: [
                            {
                                // chainId: "0x5" //Goerli
                                // chainId: "0x89", //PolygonMainnet
                                // chainId: "0xAA36A7", //sepolia
                                // chainId: "0x1", //Miannet
                                chainId: "0x7A69" //localHost TODO
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

    return (
        <>
            <Store.Provider
                value={{
                    firstTimeCall,
                    account,
                    walletConnected,
                    loader,
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