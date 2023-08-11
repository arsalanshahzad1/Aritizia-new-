import React, { useCallback, useEffect } from "react";
import Header from "../../pages/landingpage/Header";
import { useState } from "react";
import UserDataRows from "./UserDataRows";
import ControllingDataRows from "./ContollingDataRows";
import adminApis from "../../service/adminIndex";
import { MdKeyboardArrowDown } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";

import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "../DashboardComponents/DashboardCard.css";
import { Link } from "react-router-dom";
import nft from "../../../public/assets/images/nft-big.png";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";
import ProfileDrawerAdmin from "../../components/shared/ProfileDrawerAdmin";
import DashboardCard2 from "./DashboardCard2";

function ControllingContent({ search, setSearch }) {
  const [toggleUserDropdown, setToggleUserDropdown] = useState(true);
  const [listCount, setListCount] = useState(0);
  const [list, setList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("Yearly");
  const [showfilter, setShowFilter] = useState(false);
  const [nftList, setNftList] = useState([]);

  const viewNftList = async (count, filter, searchInput) => {
    setListCount(count * 10 - 10);
    const response = await adminApis.viewNftList(count, filter, searchInput);
    if (response?.status) {
      setList(response?.data);
      console.log(response?.data?.data, "error");
      getUsersNfts(response?.data?.data);
    } else {
      console.log("error");
    }
  };

  // useEffect(() => {
  // }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  const getUsersNfts = async (list) => {
    console.log("aaaa", list);
    console.log("Connected wallet", userAddress);
    let emptyList = [];
    setNftList(emptyList);

    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );
    console.log("222222");

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      provider
    );

    let listingType;
    console.log("list", list);
    // console.log("list.data", typeof list.data);
    // console.log("list.data", list.data.length);

    // let mintedTokens = await marketplaceContract.getMyListedNfts(userAddress);
    let mintedTokens = list;

    // let mintedTokens = [1, 4, 2];
    console.log("mintedTokens", mintedTokens);
    let myNFTs = [];

    for (let i = 0; i < mintedTokens.length; i++) {
      console.log("mintedTokens", mintedTokens[i]);

      let id = mintedTokens[i];
      // id = +mintedTokens[i].tokenId.toString();

      // let collectionId;
      // collectionId = +mintedTokens[i].collectionId.toString();
      // console.log("YESS", id);

      // const response = await apis.getNFTCollectionImage(collectionId);
      // console.log(response, "responses");
      // const collectionImages = response?.data?.data?.media?.[0]?.original_url;
      // console.log(response?.data?.data?.media?.[0]?.original_url, "responsess");
      // console.log(collectionImages, "trrrr");

      const metaData = await nftContract.tokenURI(id);

      const structData = await marketplaceContract._idToNFT(id);

      const fanNftData = await marketplaceContract._idToNFT2(id);

      // let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

      // setDiscountPrice(discountOnNFT);

      let auctionData = await marketplaceContract._idToAuction(id);

      listingType = structData.listingType;

      const price = ethers.utils.formatEther(structData.price.toString());

      axios
        .get(metaData)
        .then((response) => {
          const meta = response.data;
          let data = JSON.stringify(meta);

          data = data.slice(2, -5);
          data = data.replace(/\\/g, "");

          data = JSON.parse(data);
          const crypto = data.crypto;
          const title = data.title;
          const image = data.image;
          const royalty = data.royalty;
          const description = data.description;
          // const collection = data.collection;

          // if (listingType === 0) {
          const nftData = {
            id: id, //
            title: title,
            image: image,
            price: price,
            crypto: crypto,
            royalty: royalty,
            description: description,
            // collection: collection,
            // collectionImages: collectionImages,
          };
          console.log(nftData);
          myNFTs.push(nftData);
          setNftList((prev) => [...prev, nftData]);
          console.log("nftList", nftList);

          // } else if (listingType === 1) {
          //   const nftData = {
          //     id: id, //
          //     title: title,
          //     image: image,
          //     price: price,
          //     basePrice: price,
          //     collectionImages: collectionImages,
          //     endTime: auctionData.endTime.toString(),
          //     highestBid: highestBid,
          //     highestBidder: auctionData.highestBidder.toString(),
          //     seller: auctionData.seller.toString(),
          //     startTime: auctionData.startTime.toString(),
          //   };
          //   myAuctions.push(nftData);
          //   setNftList(myAuctions);
          //   console.log(nftListAuction, "nftData");
          // }
        })

        .catch((error) => {
          console.error("Error fetching metadata:", error);
        });
    }
  };

  useEffect(() => {
    if (searchInput.length < 3) {
      viewNftList(1, "yearly", ""); // Fetch all data
    } else {
      viewNftList(1, filter, searchInput); // Fetch search-specific data
    }
  }, [searchInput]);

  const [showLinks, setShowLinks] = useState(false);
  // const [walletConnected, setWalletConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);
  let bulkCall = false;

  
  const approveNFT = async (decision) => {
    bulkCall = true;
    console.log("approveNFT");
    const signer = await getProviderOrSigner(true);
    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    console.log("ALS");
    console.log("id", id);
    console.log("decision", decision);

    let approve = await marketplaceContract.approveNfts([id], decision, {
      gasLimit: ethers.BigNumber.from("500000"),
    });

    console.log("approve", approve);
    approveEvent(marketplaceContract);
  };

  const approveEvent = async (marketplaceContract) => {
    let response = await marketplaceContract.on(
      "approvalUpdate",
      bulkCall ? handleApprovalEvent : null
    );

    console.log("response", response);
  };

  const handleApprovalEvent = async (decision) => {
    if (bulkCall) {
      console.log("handleApprovalEvent");
      console.log("decision", decision);
    }
  };

  const [showEditSidebar, setshowEditSidebar] = useState(false);

  const openDrawer = () => {
    if (showLinks === true) {
      return onOpen(false);
    } else {
      setIsVisible(true);
    }
  };

  return (
    <div className="user-management">
      <Header search={search} setSearch={setSearch} />
      <div className="user-management-after-header">
        <div className="dashboard-front-section-2">
          <div className="dashboard-front-section-2-row-1">
            <div className="df-s2-r1-c1">
              <div className="User-management-txt">CONTROLLING THE CONTENT</div>
            </div>
            <div className="controls-for-user-management">
              <div
                className="user-sub-dd"
                onClick={() => setShowFilter(!showfilter)}
              >
                <div className="title">
                  {filter} <MdKeyboardArrowDown />
                </div>
                {showfilter && (
                  <div className="options">
                    <h2
                      onClick={() => {
                        viewUserList(
                          +list?.pagination?.page,
                          "yearly",
                          searchInput
                        );
                        setFilter("yearly");
                      }}
                    >
                      Yearly
                    </h2>
                    <h2
                      onClick={() => {
                        viewUserList(
                          +list?.pagination?.page,
                          "monthly",
                          searchInput
                        );
                        setFilter("monthly");
                      }}
                    >
                      Monthly
                    </h2>
                    <h2
                      onClick={() => {
                        viewUserList(
                          +list?.pagination?.page,
                          "weakly",
                          searchInput
                        );
                        setFilter("weekly");
                      }}
                    >
                      Weekly
                    </h2>
                  </div>
                )}
              </div>
              <div className="user-search">
                <input
                  type="search"
                  placeholder="Search"
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <BiSearchAlt2 />
              </div>
            </div>
          </div>
        </div>
        <div className="table-for-user-management">
          <>
            <div className="row">
              {nftList.map((item) => (
                <DashboardCard2
                  onOpen={onOpen}
                  key={item?.id}
                  id={item?.id}
                  title={item?.title}
                  image={item?.image}
                  price={item?.price}
                  crypto={item?.crypto}
                  royalty={item?.royalty}
                  description={item?.description}
                  // collection={item?.collection}
                  // collectionImages={item?.collectionImages}
                />
              ))}
            </div>
          </>

          <div className="user-management-table-contorls">
            <div>
              <div>{list?.pagination?.total_pages}</div>
              <div>of Pages</div>
              <div
                onClick={() => {
                  viewUserList(
                    +list?.pagination?.page - 1,
                    filter,
                    searchInput
                  );
                  setIsOpen(null);
                }}
                className={`${list?.pagination?.page < 2 ? "disable" : ""}`}
              >
                <svg
                  width="7"
                  height="13"
                  viewBox="0 0 7 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.47122 0C6.60253 0.0659459 6.72572 0.147667 6.83811 0.243433C6.9347 0.353091 6.98972 0.494467 6.99336 0.64203C6.99699 0.789592 6.94895 0.933619 6.85788 1.04812C6.81732 1.10085 6.77318 1.15057 6.72571 1.19688L1.65911 6.3766C1.62042 6.41609 1.57963 6.45333 1.53687 6.48817L1.64588 6.6065L6.74556 11.82C6.86335 11.9189 6.94412 12.0564 6.97423 12.2091C7.00435 12.3619 6.98195 12.5207 6.91081 12.6585C6.8668 12.7414 6.80578 12.8134 6.73193 12.8698C6.65807 12.9262 6.57315 12.9656 6.483 12.9852C6.39286 13.0048 6.2996 13.0042 6.20971 12.9834C6.11982 12.9626 6.03538 12.9221 5.96224 12.8648C5.91369 12.8246 5.86738 12.7817 5.82345 12.7363L0.247871 7.03589C0.167644 6.97273 0.102721 6.89157 0.0580107 6.79866C0.0133001 6.70574 -0.0100098 6.60356 -0.0100098 6.5C-0.0100098 6.39644 0.0133001 6.29426 0.0580107 6.20135C0.102721 6.10843 0.167644 6.02727 0.247871 5.96411C2.07223 4.09329 3.89772 2.22584 5.72429 0.361771C5.85707 0.200345 6.02761 0.0758949 6.22004 0H6.47122Z"
                    fill="white"
                  />
                </svg>
              </div>
              <div
                onClick={() => {
                  viewUserList(
                    +list?.pagination?.page + 1,
                    filter,
                    searchInput
                  );
                  setIsOpen(null);
                }}
                className={`${
                  list?.pagination?.remaining == 0 ? "disable" : ""
                }`}
              >
                <svg
                  width="7"
                  height="13"
                  viewBox="0 0 7 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.528779 0C0.397474 0.0659459 0.274285 0.147667 0.161888 0.243433C0.0652976 0.353091 0.0102797 0.494467 0.0066433 0.64203C0.00300694 0.789592 0.0510526 0.933619 0.142119 1.04812C0.182678 1.10085 0.226824 1.15057 0.274287 1.19688L5.34089 6.3766C5.37958 6.41609 5.42037 6.45333 5.46313 6.48817L5.35412 6.6065L0.254438 11.82C0.136648 11.9189 0.0558791 12.0564 0.0257664 12.2091C-0.00434637 12.3619 0.0180469 12.5207 0.0891876 12.6585C0.133197 12.7414 0.194219 12.8134 0.268074 12.8698C0.34193 12.9262 0.426853 12.9656 0.516999 12.9852C0.607144 13.0048 0.7004 13.0042 0.790291 12.9834C0.880182 12.9626 0.964625 12.9221 1.03776 12.8648C1.08631 12.8246 1.13262 12.7817 1.17655 12.7363L6.75213 7.03589C6.83236 6.97273 6.89728 6.89157 6.94199 6.79866C6.9867 6.70574 7.01001 6.60356 7.01001 6.5C7.01001 6.39644 6.9867 6.29426 6.94199 6.20135C6.89728 6.10843 6.83236 6.02727 6.75213 5.96411C4.92777 4.09329 3.10228 2.22584 1.27571 0.361771C1.14293 0.200345 0.972389 0.0758949 0.779963 0H0.528779Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControllingContent;
