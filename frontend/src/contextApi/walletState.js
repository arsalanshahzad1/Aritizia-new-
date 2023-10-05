// import WalletContext from "./walletContext";

// const walletState = (props) => {
//   const [walletConnected, setWalletConnected] = useState(false);

//   const web3ModalRef = useRef();

//   const getProviderOrSigner = async (needSigner = false) => {
//     console.log("getProviderOrSigner");

//     const provider = await web3ModalRef.current.connect();
//     const web3Provider = new providers.Web3Provider(provider);
//     const { chainId } = await web3Provider.getNetwork();
//     try {
//       await ethereum.request({
//         method: "wallet_switchEthereumChain",
//         // params: [{ chainId: "0xaa36a7" }], // sepolia's chainId
//         params: [{ chainId: "0x7A69" }], // localhost's chainId
//       });
//     } catch (error) {
//       // User rejected the network change or there was an error
//       throw new Error("Change network to Sepolia to proceed.");
//     }

//     if (needSigner) {
//       const signer = web3Provider.getSigner();

//       return signer;
//     }
//     return web3Provider;
//   };

//   const connectWallet = async () => {
//     try {
//       await getProviderOrSigner();
//       setWalletConnected(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (!walletConnected) {
//       web3ModalRef.current = new Web3Modal({
//         network: "hardhat",
//         providerOptions: {},
//         disableInjectedProvider: false,
//       });
//       connectWallet();
//       // numberOFICOTokens();
//     }
//   }, [walletConnected]);

//   return (
//     <WalletContext.Provider value={state}>
//       {props.children}
//     </WalletContext.Provider>
//   );
// };

// export default walletState;
