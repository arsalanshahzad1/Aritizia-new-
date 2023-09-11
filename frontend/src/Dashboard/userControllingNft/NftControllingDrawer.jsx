import React, { useRef, useCallback, useState, useEffect } from "react";
import Drawer from "react-bottom-drawer";
import { TfiEye } from "react-icons/tfi";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
// import "./Shared.css";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import SocialShare from "../../components/shared/SocialShare";
import Details from "../../components/shared/profileDrawerTabs/Details";
import Bids from "../../components/shared/profileDrawerTabs/Bids";
import History from "../../components/shared/profileDrawerTabs/History";
import Form from "react-bootstrap/Form";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Web3Modal from "web3modal";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import TETHER_CONTRACT_ADDRESS from "../../contractsData/TetherToken-address.json";
import TETHER_CONTRACT_ABI from "../../contractsData/TetherToken.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";
import apis from "../../service";
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
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import adminApis from "../../service/adminIndex";

function NftControllingDrawer({
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
  // userAddress,
  showBuyNow,
  ShowAcceptbtn,
  approveNFT,
}) {
  const [propertyTabs, setPropertyTabs] = useState(0);
  const [chack, setChack] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [sucess, setSucess] = useState(false);
  const [amount, setAmount] = useState("");
  const [platformFee, setPlatformFee] = useState("");
  const [discountedEth, setDiscountedEth] = useState(0);
  const [discountedAmountUSD, setDiscountedAmountUSD] = useState(0);
  const [platformFeeUSDT, setPlatformFeeUSDT] = useState(0);
  const [platformFeeETH, setPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeETH, setDiscountedPlatformFeeETH] = useState(0);
  const [discountedPlatformFeeUSDT, setDiscountedPlatformFeeUSDT] = useState(0);
  const [nftDetails, setNftDetails] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    getPriceInUSD();
  }, [isVisible]);


  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const [priceETH, setPriceETH] = useState("");
  const [amountUSD, setAmountUSD] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");

  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const handleStatus = (e) => {
    setStatus(e);
  };

  const [buyButton, showBuyButton] = useState(false);

  // const checkSeller = async () => {
  //   const provider = await getProviderOrSigner();

  //   const marketplaceContract = new Contract(
  //     MARKETPLACE_CONTRACT_ADDRESS.address,
  //     MARKETPLACE_CONTRACT_ABI.abi,
  //     provider
  //   );

  //   const structData = await marketplaceContract._idToNFT(id);
  //   let approve = structData.approve;
  //   console.log("checkSeller id", id);
  //   console.log("checkSeller approve", approve);
  // };

  const getNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.getLikeNFT(address, id);
    setLikeAndViewData(response.data.data);
  };

  const postNFTLike = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.postLikeNFT({
      like_by: address,
      nft_token: id,
    });
    getNFTLike();
  };

  const postNFTView = async () => {
    var temp = JSON.parse(localStorage.getItem("data"));
    var address = temp.id;
    const response = await apis.postViewNFT({
      view_by: address,
      nft_token: id,
    });
    getNFTLike();
  };

  useEffect(() => {
    if (isVisible) {
      postNFTView();
    }
  }, [isVisible]);

  let _buyerPercentFromDB = 1.5;

  const platformFeeCalculate = async (_amount, _buyerPercent) => {
    let _amountToDeduct;
    _amountToDeduct = (_amount * _buyerPercent) / 100;
    return _amountToDeduct;
  };

  const getPriceInUSD = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    const structData = await marketplaceContract._idToNFT(id);
    const structData2 = await marketplaceContract._idToNFT2(id);

    let discount = +structData2.fanDiscountPercent.toString();
    console.log("fanDiscountPercent", discount);

    let nftEthPrice = ethers.utils.formatEther(structData.price.toString());
    setPriceETH(nftEthPrice);
    let priceETH = nftEthPrice;
    let feeETH = await platformFeeCalculate(priceETH, _buyerPercentFromDB);
    setPlatformFeeETH(feeETH);

    // let dollarPriceOfETH = 1831;

    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();

    let priceInETH = dollarPriceOfETH.toString() / 1e18;

    let oneETHInUSD = 1 / priceInETH;
    let priceInUSD = priceETH;
    priceInUSD = oneETHInUSD * priceInUSD;
    priceInUSD = Math.ceil(priceInUSD);
    setAmountUSD(priceInUSD.toString());

    let feeUSD = await platformFeeCalculate(priceInUSD, _buyerPercentFromDB);
    setPlatformFeeUSDT(Math.ceil(feeUSD));

    // let fee = Math.ceil((priceInUSD * 3) / 100);
    // setPlatformFee(fee);

    if (discount != 0) {
      let discountedEthPrice = (nftEthPrice * discount) / 100;
      // let discountedEthPrice = (nftEthPrice * discount) / 100;
      let priceETH = discountedEthPrice;
      // platformFeeCalculate(priceETH, _buyerPercentFromDB);
      setDiscountedEth(discountedEthPrice.toFixed(2));
      console.log("discountedEthPrice", discountedEthPrice);

      // let dollarPriceOfETH = 1831;

      let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
      let priceInETH = dollarPriceOfETH.toString() / 1e18;
      let feeETH = await platformFeeCalculate(priceETH, _buyerPercentFromDB);

      setDiscountedPlatformFeeETH(Math.ceil(feeETH));
      let oneETHInUSD = 1 / priceInETH;
      let priceInUSD = priceETH;
      priceInUSD = oneETHInUSD * priceInUSD;
      priceInUSD = Math.ceil(priceInUSD);
      setDiscountedAmountUSD(priceInUSD.toString());
      // let feeUSD = Math.ceil((priceInUSD * 3) / 100);
      let feeUSD = await platformFeeCalculate(priceInUSD, _buyerPercentFromDB);
      feeUSD = Math.ceil(feeUSD);
      // platformFeeCalculate(priceInUSD, _buyerPercentFromDB);
      setDiscountedPlatformFeeUSDT(feeUSD);
    }
  };

  const getNFTDetailByNFTTokenId = async () => {
    const response = await apis.getNFTByTokenId(id);
    setNftDetails(response?.data?.data);
  };

  const [drawerData, setDrawerData] = useState("");

  const nftDetailByToken = async (id) => {
    const response = await adminApis.nftDetailByToken(id);
    setDrawerData(response?.data?.data);
    console.log(response?.data?.data, "drawerData");
  };

  useEffect(() => {
    if (isVisible) {
      getNFTDetailByNFTTokenId();
      nftDetailByToken(id);
    }
  }, [isVisible]);

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
              {/* <div className="Earning-Filter-Holder">
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
              </div> */}
              {/* <div className="earning-map">
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
              </div> */}
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="pro-dtails">
                <div className="first-line">
                  <h2>{title}</h2>
                  <img src="/assets/images/chack.png" alt="" />
                </div>

                <div className="second-line">
                  <p>
                    Owned by <span>{drawerData?.owner?.username}</span>
                  </p>
                </div>
                <div className="four-line">
                  <p
                    style={{
                      color: "#000",
                      fontWeight: "500",
                      fontSize: "26px",
                    }}
                  >
                    Description
                  </p>
                  <p>{description}</p>
                </div>
                <div className="four-line">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Creator</h3>
                      <div className="logo-name">
                        {userData?.wallet_address ==
                        drawerData?.user?.wallet_address ? (
                          <Link to={"/profile"}>
                            {/* <img src={drawerData?.user?.profile_image} alt="" />{" "} */}
                            {nftDetails?.user?.profile_image === null ? (
                                <img
                                  src={drawerData?.user?.profile_image}
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={"/public/assets/images/user-none.png"}
                                  alt=""
                                />
                              )}
                            <span>{drawerData?.user?.username}</span>
                            <br />
                            {/* <span>{userData?.wallet_address}</span> */}
                            <br />
                            {/* <span>{nftDetails?.user?.wallet_address}</span> */}
                          </Link>
                        ) : (
                          <div
                            onClick={() =>
                              navigate("/other-profile", {
                                state: {
                                  address: drawerData?.user?.wallet_address,
                                },
                              })
                            }
                          >
                           {nftDetails?.user?.profile_image === null ? (
                                <img
                                  src={nftDetails?.user?.profile_image}
                                  alt=""
                                />
                              ) : (
                                <img
                                  src={"/public/assets/images/user-none.png"}
                                  alt=""
                                />
                              )}
                            <span>{drawerData?.user?.username}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-6">
                      <h3>Collection</h3>
                      <div className="logo-name">
                        <img
                          src={drawerData?.collection?.media[0]?.original_url}
                          alt=""
                        />{" "}
                        <span>{drawerData?.collection?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="six-line">
                  <div className="row">
                    <div className="col-lg-6 col-md-8 col-8">
                      <div className="left">
                        <p>
                          {price} ETH
                          <span>
                            ${amountUSD} + Platform Fee ${platformFeeUSDT}
                          </span>
                        </p>
                      </div>
                    </div>

                    {!showBuyNow && (
                      <div className="col-lg-6 col-md-8 col-8">
                        <div className="stock-div">
                          {drawerData?.in_stock} <span>in stock</span>{" "}
                        </div>
                      </div>
                    )}
                    <div className="col-lg-6 col-md-4 col-4">
                      <div className="right"></div>
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
                {ShowAcceptbtn && (
                  <div className="drawer-inner-accept-btn">
                    <div className="nft-card-btn-holder">
                      <button onClick={() => approveNFT(false, [id])}>
                        Decline
                      </button>
                      <button onClick={() => approveNFT(true, [id])}>
                        Accept
                      </button>
                    </div>
                  </div>
                )}
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
        </div>
      </Modal>
    </>
  );
}

export default NftControllingDrawer;
