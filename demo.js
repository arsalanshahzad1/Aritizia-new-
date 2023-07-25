const connectWallet = async () => {
    try {
      setLoading(true);
      if (!ethereum) return alert("please install MetaMask");
      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            //chainId: "0x5" //Goerli
            // chainId: "0x89", //PolygonMainnet
            //chainId: "0xaa36a7", //sepolia
            chainId: "0x1", //Miannet
          },
        ],
      });


      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]);
      // Get provider from Metamask
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err.message);
    }
  };

  const checkIsWalletConnected = async () => {
    try {

      window.ethereum.on("accountsChanged", async function (accounts) {
        setCurrentAccount(accounts[0]);
        await web3Handler();
      });

      window.ethereum.on('chainChanged', async (chainId) => {
        if (chainId != "0x1") {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [
              {
                //chainId: "0x5" //Goerli
                // chainId: "0x89", //PolygonMainnet
                //chainId: "0xaa36a7", //sepolia
                chainId: "0x1", //Miannet
              },
            ],
          });
        }
      })

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
        setWalletConnected(true);
      } else {
        console.log("No account Found");
        setWalletConnected(false);
      }
    } catch (err) {
      setWalletConnected(false);
      throw new Error("No ethereum Object");
    }
  };


  useEffect(() => {
    checkIsWalletConnected();
  }, [currentAccount]);