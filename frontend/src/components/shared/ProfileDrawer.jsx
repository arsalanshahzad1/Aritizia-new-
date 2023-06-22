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
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
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

function ProfileDrawer({
  isVisible,
  onClose,
  id,
  title,
  image,
  price,
  paymentMethod,
  royalty,
  description,
  collection,
  userAddress,
}) {
  const [propertyTabs, setPropertyTabs] = useState(0);
  const [chack, setChack] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [amount, setAmount] = useState("");

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const handleStatus = (e) => {
    setStatus(e);
  };

  const web3ModalRef = useRef();

  const connectWallet = async () => {
    try {
      // Get the provider from web3Modal, which in our case is MetaMask
      // When used for the first time, it prompts the user to connect their wallet
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "hardhat",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      // numberOFICOTokens();
    }
  }, [walletConnected]);

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
      // console.log("getSigner");

      return signer;
    }
    // console.log("getProvider");
    return web3Provider;
  };

  const buyWithETH = async () => {
    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    await (
      await marketplaceContract.buyWithETH(NFT_CONTRACT_ADDRESS.address, paymentMethod, id, {
        value: ethers.utils.parseEther(amount),
      })
    ).wait();
  };

  const buyWithUSDT = async () => {
    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    const USDTContract = new Contract(
      TETHER_CONTRACT_ADDRESS.address,
      TETHER_CONTRACT_ADDRESS.abi,
      signer
    );

    // need approval

    console.log("paymentmethod", paymentMethod);
    console.log("amount", amount);

    // get the price of dollar from smartcontract and convert this value
    let dollarPriceOfETH =  await marketplaceContract.getLatestUSDTPrice();

    if (paymentMethod == 1) {
      const appprove = await USDTContract.approve(
        MARKETPLACE_CONTRACT_ADDRESS.address,
        amount
      );

      appprove.wait();
    }

    console.log("paymentmethod", paymentMethod);
    console.log("amount", amount);

    // await (
    //   await marketplaceContract.buyWithUSDT(NFT_CONTRACT_ADDRESS, paymentMethod, id, amount)
    // ).wait();
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
            <div className="col-lg-6 col-md-6 col-12">
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
                <div className="first-line">
                  <h2>{title}</h2>
                  <img src="/assets/images/chack.png" alt="" />
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
                  <h3>Current Price</h3>
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-8">
                      <div className="left">
                        <p>
                          {price} ETH<span>$9,554.59</span>
                        </p>
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
                      buyWithETH();
                      setSucess(true);
                    }}
                  >
                    Buy Now
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
            <button onClick={buyWithETH}>Buy with ETH</button>
            <button onClick={buyWithUSDT}>Buy with USDT</button>
          </div>
          <div className="mobal-button-2">
            <button>Buy with FIAT</button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProfileDrawer;
