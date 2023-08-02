import React, { useContext, useEffect, useState } from "react";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import { GlobalContext } from "../../Context/GlobalContext";
import { Link } from "react-router-dom";
const SliderImage = () => {
  const { prompt, setprompt } = useContext(GlobalContext);
  const [count, setCount] = useState(0);
  const [walletConnected, setWalletConnected] = useState(false);

  // const connectWallet = async () => {
  //   // console.log("Connect wallet");
  //   try {
  //     await getProvider();
  //     setWalletConnected(true);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  async function getProvider() {
    // Create a provider using any Ethereum node URL
    const provider = new ethers.providers.JsonRpcProvider(
      // "https://eth-mainnet.g.alchemy.com/v2/hmgNbqVFAngktTuwmAB2KceU06IJx-Fh"
      // "http://localhost:8545"
      "https://rpc.sepolia.org"
    );

    return provider;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <section
      className="home-first-sec"
      style={{
        background: `url("assets/images/home-one.png") -${count}px 0px / cover`,
      }}
    >
      <div className="home-first-wrap">
        <h1>CREATE YOUR OWN NFT</h1>
        <div className="search" id="prompt">
          <Link to="/art">
            <button>Prompt</button>
          </Link>
          <input
            type="text"
            placeholder="A cinematic wide shot of a hamster in a space suit, HD, 2:3"
            defaultValue={prompt}
            onChange={(e) => setprompt(e.target.value)}
          />
        </div>
        <p>
          Turn AI-Generated Masterpieces into NFTs and Monetize Your Creativity
        </p>
      </div>
      <div className="connect-wallet-mobile">
        <button
          // onClick={connectWallet}
          className={`connect-wallet`}
        >
          {/*  className="connect-wallet"> */}
          Connect Wallet
        </button>
      </div>
    </section>
  );
};

export default SliderImage;
