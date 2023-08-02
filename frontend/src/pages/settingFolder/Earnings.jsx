import React, { useRef, useCallback, useState, useEffect } from "react";
import Chart from "react-apexcharts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label,
} from "recharts";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ChartForEarning from "./ChartForEarning";
import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import axios from "axios";
import { getAddress } from "../../methods/methods";

const Monthly_data = [
  {
    data: "Jan",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Feb",
    value: 0.5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Mar",
    value: 0.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Apr",
    value: 0.98,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "May",
    value: 0.45,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "June",
    value: 0.43,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "July",
    value: 0.41,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Aug",
    value: 0.52,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Sep",
    value: 0.54,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Oct",
    value: 0.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Nov",
    value: 0.48,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Dec",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
];
const Weekly_data = [
  {
    data: "Jan",
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Feb",
    value: 2.5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Mar",
    value: 9.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Apr",
    value: 2.98,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "May",
    value: 4.45,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "June",
    value: 6.43,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "July",
    value: 3.41,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Aug",
    value: 2.52,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Sep",
    value: 4.54,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Oct",
    value: 0.85,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Nov",
    value: 0.48,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Dec",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
];
const Daily_data = [
  {
    data: "Jan",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Feb",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Mar",
    value: 0,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Apr",
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "May",
    value: 3,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "June",
    value: 4,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "July",
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Aug",
    value: 6,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Sep",
    value: 5,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Oct",
    value: 4,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Nov",
    value: 3,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
  {
    data: "Dec",
    value: 2,
    Average_price: "0.62 ETH",
    Num_sales: "1",
    Date: "May 07 at 5:00 PM",
  },
];

const Earnings = () => {
  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const handleStatus = (e) => {
    setStatus(e);
  };

  const statusOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];

  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  // const [userAddress, setUserAddress] = useState("0x000000....");
  const [totalPrice, setTotalPrice] = useState("");

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData.wallet_address;

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    getTotalBalance();
  }, [totalPrice]);

  async function getProvider() {
    // Create a provider using any Ethereum node URL
    const provider = new ethers.providers.JsonRpcProvider(
      // "https://eth-mainnet.g.alchemy.com/v2/hmgNbqVFAngktTuwmAB2KceU06IJx-Fh"
      // "http://localhost:8545"
      "https://rpc.sepolia.org"
    );

    return provider;
  }

  // const getAddress = async () => {
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   setUserAddress(accounts[0]);
  //   localStorage.setItem("walletAddress", accounts[0]);

  //   postWalletAddress(accounts[0]);
  //   // console.log("getAddress", accounts[0]);
  // };

  // const postWalletAddress = (address) => {
  //   console.log("in post wallet ");
  //   const postData = {
  //     // Specify the data you want to send in the POST request
  //     // For example:
  //     walletAddress: address,
  //   };

  //   axios
  //     .post("https://artizia-backend.pluton.ltd/api/connect-wallet", postData)
  //     .then((response) => {
  //       // Handle the response from the server/API
  //       console.log(response.data);
  //     })
  //     .catch((error) => {
  //       // Handle any errors that occurred during the request
  //       console.error(error);
  //     });
  //   console.log("in post wallet 1");
  // };

  //

  const getTotalBalance = async () => {
    let total = 0;
    const provider = await getProvider();
    console.log("provider", provider);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );
    console.log("provider2");

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      provider
    );
    // const signer = provider.getSigner();
    // const address = await signer.getAddress();
    console.log("provider3");

    let mintedTokens = await marketplaceContract.getMyListedNfts(userAddress);
    console.log("asd111asdasd");

    let myListedTokens = await marketplaceContract.getMyListedNfts(userAddress);
    console.log("22222222");

    let myTokens = await marketplaceContract.getMyNfts(userAddress);

    console.log("mintedTokens", mintedTokens);
    console.log("myListedTokens", myListedTokens);
    console.log("myTokens", myTokens);

    for (let i = 0; i < mintedTokens.length; i++) {
      let id;
      id = +mintedTokens[i].tokenId.toString();

      const metaData = await nftContract.tokenURI(id);

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          const price = data.price;
          console.log("price", price);
          total += total + +price;
          console.log("Total price", totalPrice);
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
    console.log("total out loops", total);
    setTotalPrice(total);
    // return total;
  };

  useEffect(() => {
    // setTotalPrice(getTotalBalance);
  }, [totalPrice]);

  return (
    <div className="col-lg-10 mx-auto">
      <div className="earning-box">
        <div>
          <p>Your Balance</p>
          <h2>{totalPrice} ETH</h2>
        </div>
        <div>
          <p>Total Sales Value</p>
          <h2>1.96 ETH</h2>
          <p>-5,6K USD</p>
        </div>
        <div>
          <p>No. of Sales</p>
          <h2>127</h2>
        </div>
      </div>
      <div className="Earning-Filter-Holder">
        <div className="d-flex align-items-center">
          <p className="Earning-filter-text">Current Sales Trend</p>
        </div>
        <div className="search-filter">
          <div className="l-2">
            <Dropdown
              options={statusOptions}
              onChange={(e) => {
                handleStatus(e);
              }}
              value={status.label}
            />
          </div>
        </div>
      </div>
      <div className="earning-map">
        <div
          style={{
            position: "relative",
            height: "400px",
            background: "linear-gradient(to bottom, #ffffff, #F0F0F0)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
            }}
          >
            {/* <Chart options={data.options} series={data.series} type="line" height={400} /> */}
            {status.value === "Monthly" ? (
              <ChartForEarning data={Monthly_data} />
            ) : (
              <div></div>
            )}
            {status.value === "Weekly" ? (
              <ChartForEarning data={Weekly_data} />
            ) : (
              <div></div>
            )}
            {status.value === "Daily" ? (
              <ChartForEarning data={Daily_data} />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
