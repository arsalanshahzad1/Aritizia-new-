import React, { useRef, useCallback, useState, useEffect,useContext } from "react";
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
// import {
//   connectWallet,
//   getProviderOrSigner,
// } from "../../methods/walletManager";
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
import { Store } from "../../Context/Store";

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
  showBuyNow,
  ShowAcceptbtn,
  is_unapproved 
}) {

  const [sucess, setSucess] = useState(false);
  const [nftDetails, setNftDetails] = useState("");
  const [selectedNTFIds, setSelectedNTFIds] = useState([]);

  const {account,checkIsWalletConnected ,getSignerMarketContrat}=useContext(Store);

  useEffect(()=>{
    checkIsWalletConnected()
  },[account])

  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const [amountUSD, setAmountUSD] = useState("");
  const [likeAndViewData, setLikeAndViewData] = useState("");
  const [status, setStatus] = useState({ value: "Monthly", label: "Monthly" });
  const [drawerData, setDrawerData] = useState("");
  const [nftList, setNftList] = useState([]);

  const getPriceInUSDAndDetials = async () => {
    let intoUSDT = await getSignerMarketContrat().getETHOutUSDTInOutPut(price?.toString())
    setAmountUSD(intoUSDT?.toString() / 10 ** 6);
  };

  useEffect(() => {
    getPriceInUSDAndDetials();
  }, []);

  const getNFTDetailByNFTTokenId = async () => {
    const response = await apis.getNFTByTokenId(id);
    setNftDetails(response?.data?.data);
  };

  const nftDetailByToken = async (id) => {
    const response = await adminApis.nftDetailByToken(id);
    setDrawerData(response?.data?.data);
  };

  useEffect(() => {
      getNFTDetailByNFTTokenId();
      nftDetailByToken(id);
  }, []);

  
  let bulkCall = false;

  const approveNFT = async (decision, id) => {

    bulkCall = true;

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    const signer = provider.getSigner()

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    let approve = await getSignerMarketContrat().approveNfts(id, decision, {
      gasLimit: ethers.BigNumber.from("500000"),
    });

    await approve.wait();
    await handleApprovalEvent();
    await postAPI(decision, id);
  };

  const postAPI = async (decision, id) => {
    let body = {
      token_idz: id,
    };

    if (decision) {
      const response = await adminApis.approveNfts(body);
      deleteItems(id);
      await onClose(false);
    } else {
      const response = await adminApis.rejectNfts(body);
      deleteItems(id);
      await onClose(false);
    }
  };

  const deleteItems = (ids) => {
    const updatedData = nftList.map(item => {
      if (ids.includes(item.id)) {
        return {
          ...item,
          is_unapproved: true // Assuming 'state' is the property to be updated
        };
      }
      return item;
    });
    setNftList(updatedData);
    setSelectedNTFIds([]);
  };

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
              <img className="nft-image" src={image} alt=""/>
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
                          <Link to={`/other-profile?add=${drawerData?.user?.id}`}>
                            {nftDetails?.user?.profile_image !== null ? (
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
                        <Link to={`/collection?id=${drawerData?.collection?.id}`}>
                        <img
                          src={drawerData?.collection?.media[0]?.original_url}
                          alt=""
                        />{" "}
                        </Link>
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
                          {Number(ethers.utils.formatEther(price?.toString()))?.toFixed(5)} ETH
                          <span>
                            ${Number(amountUSD)?.toFixed(5)} + Platform Fee ${""}
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
