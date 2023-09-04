import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "../DashboardComponents/DashboardCard.css";
import { Link } from "react-router-dom";
import nft from "../../../public/assets/images/nft-big.png";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";
import ProfileDrawerAdmin from "../../components/shared/ProfileDrawerAdmin";
import adminApis from "../../service/adminIndex";
import { BsCheck } from "react-icons/bs";
import NftControllingDrawer from "../userControllingNft/NftControllingDrawer";

const
  DashboardCard2 = ({
    onOpen,
    path,
    id,
    title,
    image,
    price,
    crypto,
    royalty,
    description,
    collection,
    getSelectedId,
    index,
    selectedNTFIds,
    approveNFT,
    onClose,
    isVisible,
    setIsVisible,
    openDrawer,
    collectionImages
    // userAddress,
  }) => {
    const [showLinks, setShowLinks] = useState(false);
    // const [walletConnected, setWalletConnected] = useState(false);
    // const [isVisible, setIsVisible] = useState(false);
    const userData = JSON.parse(localStorage.getItem("data"));
    const userAddress = userData?.wallet_address;

    // const onClose = useCallback(() => {
    //   setIsVisible(false);
    // }, []);

    // let called = false;

    // const approveNFT = async (decision) => {
    //   console.log("approveNFT");
    //   called = true;
    //   const signer = await getProviderOrSigner(true);
    //   const marketplaceContract = new Contract(
    //     MARKETPLACE_CONTRACT_ADDRESS.address,
    //     MARKETPLACE_CONTRACT_ABI.abi,
    //     signer
    //   );

    //   console.log("ALS");
    //   console.log("id", id);
    //   console.log("decision", decision);

    //   let approve = await marketplaceContract.approveNfts(id, decision, {
    //     gasLimit: ethers.BigNumber.from("500000"),
    //   });

    //   console.log("approve", approve);
    //   await approveEvent(marketplaceContract);
    //   await postAPI(decision);
    // };

    // const approveEvent = async (marketplaceContract) => {
    //   let response = await marketplaceContract.on(
    //     "approvalUpdate",
    //     called ? handleApprovalEvent : null
    //   );

    //   console.log("response", response);
    // };

    // let tokens = [];
    // const handleApprovalEvent = async (_tokenId, _decision) => {
    //   if (called) {
    //     console.log("handleApprovalEventzzz");

    //     for (let i = 0; i < _tokenId.length; i++) {
    //       console.log("_tokenId", _tokenId[i]);
    //     }
    //     console.log("_decision", _decision.toString());
    //     called = false;
    //   }
    // };

    // let count = 1;

    // const postAPI = async (decision) => {
    //   console.log("postAPI", id);
    //   let body = {
    //     token_idz: [id],
    //   };
    //   console.log("postAPI", body);

    //   if (decision) {
    //     const response = await adminApis.approveNfts(body);
    //     console.log("response", response);
    //   } else {
    //     const response = await adminApis.rejectNfts(body);
    //     console.log("response", response);
    //   }
    //   console.log("count", count);
    //   count++;
    // };

    const [showEditSidebar, setshowEditSidebar] = useState(false);

    // const openDrawer = () => {
    //   if (showLinks === true) {
    //     return onOpen(false);
    //   } else {
    //     setIsVisible(true);
    //   }
    // };

    const [chack, setChack] = useState(false);

    return (
      <>
        <div className="col-lg-3 col-md-4" key={index}>
          <div
            className="seven-line-nft-card" onClick={() => {setChack(!chack); getSelectedId(id);}}>
            <span>
              <BsCheck className={`${selectedNTFIds.includes(id) ? "red" : "transparent"}`} />
            </span>
          </div>
          <Link to={path}>
            <div className="css-vurnkuu" style={{ position: "relative", height: "auto !important" }}>
              <a className="css-118gt75">
                <div className="css-15eyh94" onMouseEnter={() => setShowLinks(true)} onMouseLeave={() => setShowLinks(false)}>
                  <div className="css-2r2ti0">
                    <div className="css-15xcape">
                      <span
                        className="lazy-load-image-custom-wrapper lazy-load-image-background  lazy-load-image-loaded"
                        style={{
                          display: "flex",
                          width: "100% ",
                          height: "100%",
                          borderRadius: "8px 8px 0px 0px",
                        }}
                      >
                        <img src={image} className="J-image" />

                        {showLinks && (
                          <div className="social-links1"

                          >
                            <ul>
                              <li onClick={() => openDrawer()}>
                                <a href="">VIEW</a>
                              </li>
                              {/* <li onClick={() => setshowEditSidebar(true)}>
                              <a href="">EDIT</a>
                            </li> */}
                            </ul>
                          </div>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className="J1-bottom css-1xg74gr"
                  style={{ position: "relative" }}
                >
                  <BiDotsHorizontalRounded className="doted-icon" />
                  <div className="css-fwx73e">
                    <div className="css-10nf7hq detail-wrap">
                      <div className="center-icon">
                        <div className="icon">
                          <img src={collectionImages} alt="" />
                          <img src="/assets/images/chack.png" alt="" />
                        </div>
                      </div>
                      <div className="top">
                        <div className="left">{title}</div>
                        <div className="right">{id}</div>
                      </div>
                      <div className="bottom">
                        <div className="left">Price</div>
                        <div className="right">
                          <img src="/assets/images/bitCoin.png" alt="" />
                          {price}
                        </div>
                      </div>
                      <div className="css-x2gp5l"></div>
                    </div>
                    {selectedNTFIds?.length > 0 ? null : (
                      <div className="nft-card-btn-holder">
                        <button onClick={() => approveNFT(false, [id])}>
                          Decline
                        </button>
                        <button onClick={() => approveNFT(true, [id])}>
                          Accept
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </a>
            </div>
          </Link>
        </div>
        {showEditSidebar && (
          <div className="Edit-nft">
            <div className="Edit-nft-inner">
              <div
                className="close-btn-edit-nft"
                onClick={() => setshowEditSidebar(false)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.0157 0H25.3602C25.637 0.0762734 25.8902 0.220569 26.097 0.419655C26.3038 0.61874 26.4575 0.866292 26.544 1.13987C26.6306 1.41346 26.6474 1.70429 26.5928 1.98598C26.5381 2.26766 26.4139 2.53122 26.2313 2.75265L25.9679 3.03604C22.6257 6.35545 19.3037 9.69508 15.9818 13.0145L15.6779 13.217L15.9818 13.4598C19.3442 16.7995 22.6864 20.1594 26.1096 23.58C26.3425 23.7813 26.5165 24.0419 26.6128 24.3342C26.7091 24.6265 26.7242 24.9395 26.6566 25.2397C26.5969 25.5247 26.4659 25.7899 26.2758 26.0104C26.0856 26.231 25.8423 26.3998 25.5691 26.5009C25.2959 26.602 25.0014 26.6322 24.7133 26.5886C24.4252 26.545 24.1531 26.4291 23.9221 26.2517L23.6182 25.9683L13.6523 15.9899C13.5683 15.9109 13.4936 15.8226 13.4295 15.7267L13.1662 15.9696L3.03835 26.0898C2.81125 26.3346 2.52056 26.5116 2.19865 26.601C1.87674 26.6903 1.53624 26.6885 1.21529 26.5958C0.95016 26.5202 0.708757 26.3783 0.51381 26.1835C0.318863 25.9887 0.176967 25.7475 0.101377 25.4826L0 25.2397V24.6729C0.141895 24.1796 0.431818 23.7416 0.830552 23.418L10.6545 13.6015C10.7459 13.5203 10.8482 13.4521 10.9584 13.3991L10.6342 13.1359C7.37307 9.87724 4.11197 6.59838 0.830552 3.3397C0.441664 3.00729 0.153859 2.57252 0 2.08481V1.51802C0.0491955 1.27542 0.148531 1.04576 0.291522 0.843633C0.434513 0.641507 0.618089 0.471322 0.830552 0.34405C1.08222 0.219853 1.34729 0.124876 1.62055 0.0607802H1.82306C2.41002 0.177363 2.93912 0.491743 3.32196 0.951358L13.1054 10.7273L13.3687 10.9702C13.4176 10.8748 13.4791 10.7864 13.5512 10.7071L23.294 0.951358C23.6786 0.483773 24.2171 0.1681 24.8132 0.0607802L25.0157 0Z"
                    fill="#6A6A6A"
                  />
                </svg>
              </div>
              <div className="edit-nft-image">
                <img src={nft} alt="" />
              </div>
              <div className="edit-nft-form">
                <div className="edit-nft-items">
                  <p>Title</p>
                  <input type="text" value="Naqi" />
                </div>
                <div className="edit-nft-items">
                  <p>Choose Collection</p>
                  <p className="edit-sidebar-sub-content">
                    This is the collection where your item will appear.
                  </p>
                  <input type="text" value="Select collection" />
                </div>

                <div className="edit-nft-items">
                  <p>Description</p>
                  <div className="desc-input">
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                    accusantium doloremque laudantium, totam rem aperiam, eaque
                    ipsa quae ab illo inventore veritatis et quasi architecto
                    beatae vitae dicta sunt explicabo. collection
                  </div>
                </div>
                <div className="edit-nft-items">
                  <p>Price</p>
                  <input type="text" value="0.00" />
                </div>
                <div className="edit-nft-items">
                  <p>Price</p>
                  <input type="text" value="ETH" />
                </div>
                <div className="Btns-edit-nft-sidebar">
                  <button onClick={() => setshowEditSidebar(false)}>
                    Cancel
                  </button>
                  <button>Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
        <NftControllingDrawer
          isVisible={isVisible}
          onClose={onClose}
          id={id}
          title={title}
          image={image}
          price={price}
          paymentMethod={crypto}
          royalty={royalty}
          description={description}
          collection={collection}
          userAddress={userAddress}
          showBuyNow={false}
          ShowAcceptbtn={true}
          approveNFT={approveNFT}
        />
      </>
    );
  };

export default DashboardCard2;
