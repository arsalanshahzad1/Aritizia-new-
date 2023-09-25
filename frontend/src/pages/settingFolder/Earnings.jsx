import React, { useRef, useCallback, useState, useEffect } from "react";
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
import apis from "../../service";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";


const Earnings = () => {
  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const [earning, setEarning] = useState([]);
  const handleStatus = (e) => {
    setStatus(e);
  };

  const getEarning = async () => {
    const response = await apis.getSalesHistory();
    console.log(response?.data?.data);
    setEarning(response?.data?.data);
  };

  useEffect(() => {
    getEarning();
  }, []);

  const statusOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];

  const Monthly_data = [
    {
      data: "Jan",
      value: earning?.allMonths_earning?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Feb",
      value: earning?.allMonths_earning?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Mar",
      value: earning?.allMonths_earning?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Apr",
      value: earning?.allMonths_earning?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "May",
      value: earning?.allMonths_earning?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "June",
      value: earning?.allMonths_earning?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "July",
      value: earning?.allMonths_earning?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Aug",
      value: earning?.allMonths_earning?.[7],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Sep",
      value: earning?.allMonths_earning?.[8],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Oct",
      value: earning?.allMonths_earning?.[9],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Nov",
      value: earning?.allMonths_earning?.[10],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "Dec",
      value: earning?.allMonths_earning?.[11],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];
  const Weekly_data = [
    {
      data: "1",
      value: earning?.lastWeek_earning?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "2",
      value: earning?.lastWeek_earning?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "3",
      value: earning?.lastWeek_earning?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "4",
      value: earning?.lastWeek_earning?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "5",
      value: earning?.lastWeek_earning?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "6",
      value: earning?.lastWeek_earning?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "7",
      value: earning?.lastWeek_earning?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];
  const Daily_data = [
    {
      data: "1",
      value: earning?.LastMonth_earning?.[0],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "2",
      value: earning?.LastMonth_earning?.[1],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "3",
      value: earning?.LastMonth_earning?.[2],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "4",
      value: earning?.LastMonth_earning?.[3],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "5",
      value: earning?.LastMonth_earning?.[4],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "6",
      value: earning?.LastMonth_earning?.[5],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "7",
      value: earning?.LastMonth_earning?.[6],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "8",
      value: earning?.LastMonth_earning?.[7],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "9",
      value: earning?.LastMonth_earning?.[8],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "10",
      value: earning?.LastMonth_earning?.[9],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "11",
      value: earning?.LastMonth_earning?.[10],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "12",
      value: earning?.LastMonth_earning?.[11],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "13",
      value: earning?.LastMonth_earning?.[12],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "14",
      value: earning?.LastMonth_earning?.[13],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "15",
      value: earning?.LastMonth_earning?.[14],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "16",
      value: earning?.LastMonth_earning?.[15],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "17",
      value: earning?.LastMonth_earning?.[16],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "18",
      value: earning?.LastMonth_earning?.[17],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "19",
      value: earning?.LastMonth_earning?.[18],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "20",
      value: earning?.LastMonth_earning?.[19],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "21",
      value: earning?.LastMonth_earning?.[20],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "22",
      value: earning?.LastMonth_earning?.[21],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "23",
      value: earning?.LastMonth_earning?.[22],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "24",
      value: earning?.LastMonth_earning?.[23],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "25",
      value: earning?.LastMonth_earning?.[24],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "26",
      value: earning?.LastMonth_earning?.[25],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "27",
      value: earning?.LastMonth_earning?.[26],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "28",
      value: earning?.LastMonth_earning?.[27],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "29",
      value: earning?.LastMonth_earning?.[28],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
    {
      data: "30",
      value: earning?.LastMonth_earning?.[29],
      Average_price: "0.62 ETH",
      Num_sales: "1",
      Date: "May 07 at 5:00 PM",
    },
  ];

  const [walletConnected, setWalletConnected] = useState(false);
  const web3ModalRef = useRef();

  // const [userAddress, setUserAddress] = useState("0x000000....");
  const [totalPrice, setTotalPrice] = useState("");

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

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
 

  const getTotalBalance = async () => {
    let total = 0;
    // const provider = await getProvider();
    const provider = await getProviderOrSigner();

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

    let myListedTokens = await marketplaceContract.getMyListedNfts(userAddress);

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
          <h2>{earning?.total_sale_values} ETH</h2>
          {/* <p>-5,6K USD</p> */}
        </div>
        <div>
          <p>No. of Sales</p>
          <h2>{earning?.no_of_sales}</h2>
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
