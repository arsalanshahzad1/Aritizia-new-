import React, { useRef, useState, useEffect, useContext } from "react";
import Drawer from "react-bottom-drawer";
import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import "react-dropdown/style.css";
import "../../App.css";
import nft from "../../../public/assets/images/nft-2.png";
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
import Slider from "rc-slider";
import { useNavigate } from "react-router-dom";
import apis from "../../service/index";
import { Store } from "../../Context/Store";
import { toast } from "react-toastify";
import marketplaceAddr from "../../contractsData/ArtiziaMarketplace-address.json";
import marketplaceAbi from "../../contractsData/ArtiziaMarketplace.json";
import nftContractAddr from "../../contractsData/ArtiziaNFT-address.json";
import nftContractAbi from "../../contractsData/ArtiziaNFT.json";


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


const ProfileDrawer = ({
  setLoader,
  nftListingType,
  id,
  isVisible,
  onClose,
  timedAuction,
  image,
  title,
  royalty,
  royaltyPrice,
  description,
  collection,

}) => {

const [loading, setLoading] = useState(false);
const [startingDate, setStartingDate] = useState(0);
const [endingDate, setEndingDate] = useState(0);
const [inputValue, setInputValue] = useState("");
const [showValue, setShowValue] = useState("");
const [showWarning, setShowWarning] = useState(false);
const [price, setPrice] = useState("");
const navigate = useNavigate();
const [relist, setRelist] = useState(false);

const { account, checkIsWalletConnected} = useContext(Store);

const userData = JSON.parse(localStorage.getItem("data"));
const userAddress = userData?.wallet_address;

useEffect(() => {
  checkIsWalletConnected();
}, [account]);

const handleInputChange = (event) => {
  const value = event.target.value;
  if (/^\d*\.?\d*$/.test(value) || value === "") {
    setShowValue(value);
    let parsedPrice = ethers.utils.parseEther(value?.toString());
    setPrice(parsedPrice);
    setShowWarning(false);
  } else {
    setShowWarning(true);
  }
};

const reListNFT = async (e) => {
  setLoader(true)
  e.preventDefault();

  let startTimestamp;
  let endTimestamp;
  setRelist(true);

  if (nftListingType === 0) {
    startTimestamp = 0;
    endTimestamp = 0;
  } else if (nftListingType === 1) {
    const startDate = new Date(startingDate);
    const endDate = new Date(endingDate);
    startTimestamp = Math.floor(startDate.getTime() / 1000);
    endTimestamp = Math.floor(endDate.getTime() / 1000);
    if (startTimestamp >= endTimestamp) {
      setEndingDate(0);
      setIsSingleSubmit(false);
      toast.error("Expire date must be greater than start date", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
  }
 
  const tx = await getSignerNFTContrat().approve(
    marketplaceAddr.address,
    id,
    {
      gasLimit: ethers.BigNumber.from("500000"),
    }
  );

  await tx.wait();

  await (
    await getSignerMarketContrat().resellNft(
      nftContractAddr.address,
      id,
      price,
      nftListingType,
      startTimestamp,
      endTimestamp,
      userData?.id
    )
  ).wait();

  // getSignerMarketContrat().on("NFTListed", handleNFTListedEvent);
  setLoader(false);
  window.location.reload();
  // await getSignerMarketContrat().on("NFTListed", handleNFTListedEvent);
};

return (
    <>
      <Drawer
        isVisible={isVisible}
        onClose={() => onClose(false)}
        className=" nft-drawer-wrapper"
      >
        <div className="create-single">
          <div className="profile-drawer" style={{ position: "relative" }}>
            <span className="profile-drawer-cancle" onClick={() => onClose(false)}>
              x
            </span>
            <div className="create-single-section-wrap">
              <form onSubmit={reListNFT}>
                <div className="container">
                  <div className="row">
                    <div className="col-lg-7 mx-auto">
                      <div className="row">

                        {nftListingType == 0 && (
                          <div className="line-two">
                            <div className="row">
                              <div className="col-lg-12 col-md-12 col-7">
                                <h2>Price</h2>
                                <input
                                  type="text"
                                  defaultValue={showValue}
                                  onChange={handleInputChange}
                                />
                                {showWarning && (
                                  <p style={{ color: "red" }}>
                                    Please enter a valid positive number.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) }

                        {nftListingType == 1 &&  (
                          <>
                            <div className="line-two">
                              <div className="row">
                                <div className="col-lg-12">
                                  <h2>Minimum bid</h2>
                                  <input
                                    type="text"
                                    value={showValue}
                                    onChange={handleInputChange}
                                  />
                                  {showWarning && (
                                    <p style={{ color: "red" }}>
                                      Please enter a valid positive number.
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="line-two">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-6">
                                  <h2>Starting date</h2>
                                  <input
                                    id="startingTime"
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    style={{ padding: "6px 10px 6px 15px" }}
                                    value={startingDate}
                                    onChange={(e) =>
                                      setStartingDate(e.target.value)
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                  />
                                </div>
                                <div className="col-lg-6 col-md-6 col-6">
                                  <h2>Expiration date</h2>
                                  <input
                                    id="endTime"
                                    type="date"
                                    placeholder="mm/dd/yyyy"
                                    style={{ padding: "6px 10px 6px 15px" }}
                                    value={endingDate}
                                    onChange={(e) =>
                                      setEndingDate(e.target.value)
                                    }
                                    min={startingDate}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        )}

                        <div className="line-three">
                          <div className="row">
                            <div className="col-lg-12 disabled-input-only-view">
                              <h2>Collection Name</h2>
                              <input type="text" value={collection} disabled />
                            </div>
                          </div>
                        </div>
                        <div className="line-four">
                          <div className="row">
                            <div className="col-lg-9 disabled-input-only-view">
                              <h2>Title</h2>
                              <input
                                disabled
                                type="text"
                                value={title}
                                placeholder="e.g. ‘Crypto Funk"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="line-five">
                          <div className="row">
                            <div className="col-lg-9 disabled-input-only-view">
                              <h2>Description</h2>
                              <input
                                disabled
                                type="text"
                                placeholder="e.g. ‘This is very limited item’"
                                value={description}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="line-six">
                          <div className="row">
                            <div className="col-lg-9 disabled-input-only-view">
                              <h2>Royalties</h2>
                              <Slider
                                disabled
                                min={0}
                                max={15}
                                defaultValue={royaltyPrice?.toString() / 100}
                              />
                            </div>
                            <div className="col-lg-3 ">
                              <div className="royality-value">
                                royalty {royaltyPrice?.toString()  / 100}%
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="line-seven">
                          <div className="row">
                            <div className="col-lg-8">
                              <button type="submit" className="button-styling">
                                Done
                              </button>
                            </div>
                          </div>
                        </div>
                      
                      </div>
                    </div>

                    <div className="col-lg-3 mx-auto nft-drawer-dp">
                      <h2>NFT image</h2>
                      <div className="img-holder">
                        <img src={image} alt="" />
                      </div>
                    </div>

                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ProfileDrawer;
