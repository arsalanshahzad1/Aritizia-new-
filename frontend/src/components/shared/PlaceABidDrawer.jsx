import React, { useRef, useCallback, useState, useEffect } from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import SocialShare from "./SocialShare";
import Details from "./profileDrawerTabs/Details";
import Bids from "./profileDrawerTabs/Bids";
import History from "./profileDrawerTabs/History";
import Form from "react-bootstrap/Form";
import Dropdown from "react-dropdown";
import Web3Modal from "web3modal";
import "react-dropdown/style.css";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
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
import ChartForEarning from "../../pages/settingFolder/ChartForEarning";
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
const PlaceABidDrawer = ({
  isVisible,
  onClose,
  id,
  title,
  image,
  price,
  crypto,
  description,
  // collection,
  userAddress,
  isLive,
  startTime,
  endTime,
}) => {
  const [propertyTabs, setPropertyTabs] = useState(0);
  const [chack, setChack] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [dollarPrice, setDollarPrice] = useState("");
  const [highestBid, setHighestBid] = useState("");

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const handleStatus = (e) => {
    setStatus(e);
  };

  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const { chainId } = await web3Provider.getNetwork();

    if (chainId !== 31337) {
      window.alert("Change the network to Sepolia");
      throw new Error("Change network to Sepolia");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();

      return signer;
    }

    return web3Provider;
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "hardhat",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getAuctionData();
    }
  }, [walletConnected]);

  // // return the price of NFT in usd
  const getAuctionData = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    let priceETH = Number(highestBid);
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
    let priceInETH = dollarPriceOfETH.toString() / 1e18;
    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = priceETH;
    priceInUSD = oneETHInUSD * priceInUSD;
    priceInUSD = priceInUSD.toFixed(2);
    setDollarPrice(priceInUSD.toString());

    let highBid = await marketplaceContract.getHighestBid(id);
    highBid = Number(highBid.toString()) / 1e18;
    console.log("HighestBid", highBid);

    if (highBid == 0) {
      setHighestBid(price);
    } else {
      setHighestBid(highBid);
    }
  };

  const bidWithFIAT = async () => {
    console.log("startTime", startTime);
    console.log("endTime", endTime);
    console.log("isLive", isLive);

    // const provider = await getProviderOrSigner();

    // const marketplaceContract = new Contract(
    //   MARKETPLACE_CONTRACT_ADDRESS.address,
    //   MARKETPLACE_CONTRACT_ABI.abi,
    //   provider
    // );

    // let highBid = await marketplaceContract.getHighestBid(id);
    // highBid = Number(highBid.toString()) / 1e18;
    // console.log("HighestBid", highBid);
  };

  const bidWithETH = async () => {
    // window.alert("KHAREED");

    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    // console.log("Make payment");
    await marketplaceContract.bidInETH(id, 0, {
      value: ethers.utils.parseEther("0.3"),
    });
    // console.log("Payment made");
  };

  const bidWithUSDT = async () => {
    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    const USDTContract = new Contract(
      TETHER_CONTRACT_ADDRESS.address,
      TETHER_CONTRACT_ABI.abi,
      signer
    );

    // need approval

    // console.log("paymentmethod", paymentMethod);
    console.log("highestBid", highestBid);

    // get the price of dollar from smartcontract and convert this value
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
    let USDPriceInWei = 1000 * 10 ** 6;
    // if (paymentMethod == 1) {
    const appprove = await USDTContract.approve(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      USDPriceInWei
    );

    appprove.wait();
    // }

    console.log("Approved");

    // console.log("paymentmethod", paymentMethod);
    // console.log("amount", amount);

    const tx = await marketplaceContract.bidInUSDT(id, USDPriceInWei, 1, {
      gasLimit: ethers.BigNumber.from("500000"),
    });

    // Wait for the transaction to be mined
    await tx.wait();
  };

  const statusOptions = [
    { value: "Monthly", label: "Monthly" },
    { value: "Weekly", label: "Weekly" },
    { value: "Daily", label: "Daily" },
  ];
  return (
    <>
      <Drawer
        isVisible={isVisible}
        onClose={() => onClose(false)}
        className="profile-drawer-wrapper"
      >
        <div className="profile-drawer" style={{ position: "relative" }}>
          <span
            className="profile-drawer-cancle"
            onClick={() => onClose(false)}
          >
            x
          </span>
          <div className="row">
            <div
              className="col-lg-6 col-md-6 col-12"
              style={{ position: "relative" }}
            >
              {/* <span className="status-red">Status : Active</span> */}
              {/* <span className="status-yellow">Status : Active</span> */}
              <span className="status-green">Status : Active</span>
              <img className="nft-image" src={image} alt="" />
              {/* <img src="/assets/images/progress-bar.png" className='hide-on-mobile-screen' alt="" width={'100%'} style={{marginTop : '20px'}}/> */}

              {/* place your chart here */}
              <div className="Earning-Filter-Holder">
                <div className="d-flex align-items-center">
                  <p className="Earning-filter-text">Price History</p>
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
            <div className="col-lg-6 col-md-6 col-12">
              <div className="pro-dtails">
                <div className="first-line placeabid">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <h2>{title}</h2>
                    <img src="/assets/images/chack.png" alt="" />
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <div className="AuctionWrapper-sc-7kf6vz-17 hNrWqi">
                      <div
                        id="container"
                        class="AuctionCountdownContainer-sc-ll8ha7-23 iqGEMd"
                      >
                        <div>
                          <p>
                            <span class="AuctionLabel-sc-ll8ha7-29 fJrkKm">
                              Auction ends in
                            </span>
                          </p>
                          <button class="CollectibleCardCountdown-sc-ll8ha7-30 lccacU">
                            <img
                              src="data:image/gif;base64,R0lGODlhEgASANUAAAwMDNzc3NTU1Hx8fCQkJHR0dPT09CwsLBQUFJycnGxsbOTk5MzMzKSkpOzs7JSUlBwcHMTExERERDw8PISEhFRUVDMzM1xcXGRkZExMTIyMjLy8vLS0tKysrPz8/AQEBP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkEzRkFCNEY5NDE2RDExRUM4MjRFQ0FCMDA3RUI4MTlFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkEzRkFCNEZBNDE2RDExRUM4MjRFQ0FCMDA3RUI4MTlFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTNGQUI0Rjc0MTZEMTFFQzgyNEVDQUIwMDdFQjgxOUUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTNGQUI0Rjg0MTZEMTFFQzgyNEVDQUIwMDdFQjgxOUUiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQFBAAgACwAAAAAEgASAAAGGMCPcEgsGo/IpHLJbDqf0Kh0Sq1ar1hsEAAh+QQFBAAgACwIAAgAAgACAAAGBUCBUBAEACH5BAUEACAALAYABgAGAAYAAAYVQEDD40kAEkTiMEk0MIvMxtFgMAYBACH5BAUEACAALAQABAAKAAoAAAYpQBDowvB4GBch6GFsehJDJ6hJlE6PVqHTaixKu5ctdSl+KC8RYyQJCgIAIfkEBQQAIAAsAgACAA4ADgAABkBAkJDwWHg8iwdByMQcn08FUwEVQqWQKhP0JGq3x0fgyzwayWU02DNGmx/qcJb8hICc1WsTCsVsQRBiRwEPdkJBACH5BAUEACAALAEAAQAQABAAAAZTQJBQCKgUChXEcAlCJDxQEDShXB4WzOHiMERgs9rqE7xMgABRstCDqKTVnooCvjzSh8g3OY6+ewAgD3dmTV9kC1UgV4dcSwgPaVOJTEUKBRmAS0EAIfkEBQQAIAAsAQABABAAEAAABlBAkFD4KRqHSFARcaFQLojjsEhJgiiAY3FjFW601a6QYkSIkdHP5Ty8FAfsMTV+La7j7g/CEE9/wmJkRB9cXV9af3xIZFJKehcDT35dRo1CQQAh+QQFBAAgACwCAAIADgAOAAAGQUCQEPQpGofID6SQSBQgR+FHgRQqjtPq8EpEaJHQT+E7LBQTZGHinAatxW3zx5sOZ79cqcJQzQ/nTAkKdlVGUUJBACH5BAUEACAALAMAAwAMAAwAAAY5QJDwkykMJJ+hUBIQChdI4cRJBSE/i6pz8ZFoqZLC1zkQj0EF7znzaX4DyelXDZq4hQG5s1tIJ4VBACH5BAUEACAALAMAAwAMAAwAAAY4QJBQ0mAwGhKhENDxKEGeDkDYfCo7IInTKvQQuc8iWGkcC49mEHLL9arHWBCgwYZKn5KEMZEUBgEAIfkEBQQAIAAsAgACAA4ADgAABkVAkHBIIAyPQkLD4PEYGsajhIk0SIhUJMgQbWiP3u13aAARmmOQhwBBj9fidBmUSIPCkLmWO5zoyRNIEAlMTglRXxCIQ0EAIfkEBQQAIAAsAgACAA4ADgAABkJAkFAIsFgAwyTowPEIPZyDsqJ8UoUHZxXkkYKaWyEHBNCGPQDvGWRRn4/mLfq7Hi/P3WEm/swoDx1aUG5JaQdISUEAIfkEBQQAIAAsAgACAA4ADgAABkRAkFD4ASA+wyQI8VgIHZpj0uJUOixDhEM5dEg13OQD9KmGQY7iOYkArIeA8jsNAq/tCLNVCjpsrQdKCBpVC1FnRXFKQQAh+QQFBAAgACwCAAIADgAOAAAGPkCQcPgpEomAgUAoGACOhMBwGDgMAdIp9QkaaLVe0PI7XH7IWiP6OEaPw+gwFh3ggqLfAEELKIwFBXZfalNBACH5BAUEACAALAMAAwAMAAwAAAY0QBDog4k4HBHMRwhCMJhMBmT4hEaJVitmk4Uau8wjWOjgjpNjkLKaZSydbQSTuHEskktQEAAh+QQFBAAgACwDAAMADAAMAAAGL0CQUMEwGEAKgBAEESyXTmH0KQUoqFRFBMvtgo7e79bLuHrN3SiEK1gvtSAHchkEACH5BAUEACAALAMAAwAMAAwAAAY0QBAIMBB4PIKBUEgILJeBw9D5hIKU1Wcx+zRyl8evECkGJcsDADUbAICabMISUDAiC25QEAAh+QQFBAAgACwDAAIADQANAAAGMUCQcAgYGoWUgDBAQRgPiyMoOqRKF06K1KhVbpffYzE89H6V2nDaesRWr9I0KDBwCoMAIfkEBQQAIAAsAwACAAwADQAABiNAkHD4IQ6PQ8AxgGw6hYDBc0qtWqfSKtMZUIK2y8MxmxQGAQAh+QQFBAAgACwDAAMADQAMAAAGKECQcCAQCgbCJCHJDDSZT6gUhCxOjVfoJ8u0Xr1ZJHcsXDILSQE6GQQAIfkEBQQAIAAsAwADAAwADAAABhxAkLAgLBqPRgJySVw6n9CoFNR8fqDXaRZkOAYBACH5BAUEACAALAMAAwAMAAwAAAYbQJBwICwaj8ikcslsOp9QgGAJEE6ZVZDBcwwCACH5BAUEACAALAMABAALAAsAAAYXQJBwSDwQj8IBcslsOp9DpTPwpEI9xyAAIfkEBQQAIAAsBgADAAkADAAABhVAkBAUGBqPyKQSWVw6n9DnwDgVBgEAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsBgAOAAEAAQAABgPAQhAAIfkEBQQAIAAsCgADAAUADAAABg9AAWhILBqPQyFyyTwWiEEAIfkEBQQAIAAsAwALAAEAAQAABgPAQhAAIfkEBQQAIAAsAwALAAEAAQAABgPAQRAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAAAAAAEAAQAABgNAUBAAIfkEBQQAIAAsAwADAAwADAAABi9AkLDAEDIKQiEkyQQtQYJmEylNEqtJhgGb3HJBRe7xi4xWzRAzUw36gA2GohsUBAAh+QQFBAAgACwDAAMADAAMAAAGM0AQ6DNJRBiJyUc4bDCZjeUn8XxGJ9VqMfs0cpmMyFcYeYxBybOSyo0O2V2pcPKIlLHCIAAh+QQFBAAgACwDAAMADAAMAAAGMUCQEFFIJAoQoVKhXDqbTogB2oQwqcoiVmncChPXbQEx3SJAYWhYUX4qEYrEQ5EUBgEAIfkEBQQAIAAsAwADAAwADAAABjpAkPADOBwAn6EQ8BAKH8glw+kUID9NqvNBNGipn8OXahGPhYePd2xAZr9cEGCqtTqZawNU+wmnk0JBACH5BAUEACAALAMAAwAMAAwAAAY7QJAQ9Ckah0SAotFQAI4fywK5sBgBUyTI8fwotMPvpwEWNork8hn0LSuKWPCi+zlkhYsDVMl0Qod/IEEAIfkEBQQAIAAsBAAEAAoACgAABipAEOhDLAqHlogwYilajsfmRwkFRYjVI+CTFRKp0OvHYqhKx5vleVjEgoIAIfkEBQQAIAAsBQAFAAkACAAABilA0AdRqSA+wk/GAAIZMkgEs+k8VqjUyueKBV0B06bhqJw+kUJAkQwKAgAh+QQFBAAgACwFAAUACAAIAAAGIUAQ6EMsDieNxqQ4EQqXn4QT1CBKndVP0wnVJhLdoREUBAAh+QQFBAAgACwGAAYABgAGAAAGFUDQZ0isOByVoQMEciiZzk/mmCFagwAh+QQFBAAgACwHAAcABAAEAAAGDsCPRCIEgSQTI3Ey+QQBACH5BAUEACAALAcABwAEAAQAAAYLQNBn+NFohkbiMAgAIfkEBQQAIAAsCAAIAAIAAgAABgZAAgFCCAIAIfkEBQQAIAAsCAAIAAIAAgAABgXAj/ATBAAh+QQFBAAgACwAAAAAAQABAAAGA0BQEAAh+QQFBAAgACwAAAAAAQABAAAGA0BQEAA7"
                              alt="running auction"
                            />
                            <span> 1:12:47:29</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="second-line">
                  <p>
                    Owned by <span>Enotic11daday</span>
                  </p>
                </div>
                <div className="three-line">
                  <div>
                    <TfiEye />
                    <span>2 View</span>
                  </div>
                  <div>
                    <AiOutlineHeart />
                    <span>5 Favorite</span>
                  </div>
                </div>
                <div className="four-line">
                  <p>{description}</p>
                </div>
                <div className="four-line">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Creator</h3>
                      <div className="logo-name">
                        <img src="/assets/images/creater.png" alt="" />{" "}
                        <span>Monica Lucas</span>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Collection</h3>
                      <div className="logo-name">
                        <img src="/assets/images/collector.png" alt="" />{" "}
                        <span>DevilMonkey</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="five-line">
                  <div className="row">
                    <div className="col-lg-4 col-md-4 col-12 hide-on-desktop-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "10px" }}
                      />
                    </div>
                    <div className="col-lg-8 col-md-8 col-12">
                      <button
                        className={`${propertyTabs === 0 ? "active" : ""}`}
                        onClick={() => setPropertyTabs(0)}
                      >
                        Details
                      </button>
                      <button
                        className={`${propertyTabs === 1 ? "active" : ""}`}
                        onClick={() => setPropertyTabs(1)}
                      >
                        Bids
                      </button>
                      <button
                        className={`${propertyTabs === 2 ? "active" : ""}`}
                        onClick={() => setPropertyTabs(2)}
                      >
                        History
                      </button>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12 hide-on-mobile-screen">
                      <SocialShare
                        style={{ fontSize: "18px", marginRight: "10px" }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  {propertyTabs === 0 && <Details />}
                  {propertyTabs === 1 && <Bids />}
                  {propertyTabs === 2 && <History />}
                </div>
                <div className="six-line">
                  <h3>Current Bid</h3>
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-8">
                      <div className="left">
                        <p>
                          {price} ETH<span>${dollarPrice}</span>
                        </p>
                        <p>Last bid {highestBid}</p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-4 col-4">
                      <div className="right">
                        <p>{/* 13<span>in stock</span> */}</p>
                      </div>
                    </div>
                  </div>
                  <img
                    src="/assets/images/progress-bar.png"
                    className="hide-on-desktop-screen"
                    alt=""
                    width={"100%"}
                    style={{ marginTop: "20px", marginBottom: "20px" }}
                  />
                </div>
                <div className="seven-line" onClick={() => setChack(!chack)}>
                  <span>
                    <BsCheck className={`${chack ? "red" : "black"}`} />
                  </span>{" "}
                  <span>I agree all Terms & Conditions.</span>
                </div>
                <div className="eight-line">
                  <button
                    onClick={() => {
                      setSucess(true);
                    }}
                  >
                    Bid Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
      <Modal
        show={sucess}
        onHide={() => setSucess(false)}
        centered
        size="lg"
        className="succes-modal-wrap"
        backdrop="static"
        keyboard={false}
      >
        <div className="modal-body" style={{ position: "relative" }}>
          <span onClick={() => setSucess(false)}>
            <AiOutlineClose />
          </span>
          <div className="mobal-button-1">
            <button onClick={bidWithETH}>Bid with ETH</button>
            <button onClick={bidWithUSDT}>Bid with USDT</button>
          </div>
          <div className="mobal-button-2">
            <button onClick={bidWithFIAT}>Bid with FIAT</button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PlaceABidDrawer;
