import React, { useCallback, useEffect, useContext } from "react";
import AdminHeader from "../../pages/landingpage/AdminHeader";
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
// import {
//   connectWallet,
//   getProviderOrSigner,
// } from "../../methods/walletManager";
import ProfileDrawerAdmin from "../../components/shared/ProfileDrawerAdmin";
import DashboardCard2 from "./DashboardCard2";
import apis from "../../service";
import Loader from "../../components/shared/Loader";
import { Store } from "../../Context/Store";

function ControllingContent({ search, setSearch }) {
  const [toggleUserDropdown, setToggleUserDropdown] = useState(true);
  const [listCount, setListCount] = useState(0);
  const [list, setList] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("Yearly");
  const [showfilter, setShowFilter] = useState(false);
  const [nftList, setNftList] = useState([]);

  const [showLinks, setShowLinks] = useState(false);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  



  const {account, checkIsWalletConnected, getSignerMarketContrat, getSignerNFTContrat}=useContext(Store);

  useEffect(()=>{
    checkIsWalletConnected()
  },[account])

  const viewNftList = async (count, filter, searchInput) => {
    setListCount(count * 10 - 10);
    const response = await adminApis.viewNftList(count, filter, searchInput);
    if (response?.status) {
      setList(response?.data);
      getUsersNfts(response?.data?.data);
    } else {
    }
  };

  const onOpen = (action) => {
    setIsVisible(action);
  };

  const getUsersNfts = async (list) => {
    // let emptyList = [];
    // setNftList(emptyList);

    let listingType;

    let mintedTokens = list;
    
    let myNFTs = [];

    for (let i = 0; i < mintedTokens.length; i++) {
      let id = mintedTokens[i]?.token_id;
      let is_unapproved = mintedTokens[i]?.is_unapproved;

      let structData = await getSignerMarketContrat()._idToNFT(id);

      let collectionId = structData?.collectionId?.toString();

      const response = await apis.getNFTCollectionImage(collectionId);

      let collectionImages = response?.data?.data?.media?.[0]?.original_url;

      let metaData = await getSignerNFTContrat().tokenURI(id);
      const responses = await fetch(metaData)
      const metadata = await responses.json()

      listingType = structData?.listingType;

      let price = structData?.price?.toString();

      const nftData = {
        id: id,
        title: metadata?.title,
        image: metadata?.image,
        price: price,
        paymentMethod: structData?.paymentMethod,
        royalty: structData?.royalty,
        royaltyPrice: structData?.royaltyPrice,
        description: metadata?.description,
        collection: structData?.collectionId?.toString(),
        collectionImages: collectionImages,
        seller: structData?.seller,
        is_unapproved: is_unapproved
      };

      if (!nftList.some((item) => item.id === nftData.id)) {
            setNftList((prev) => [...prev, nftData]);
          }
    }
  };

  useEffect(() => {
    if (searchInput == "") {
      setNftList([]);
      viewNftList(1, "yearly", ""); // Fetch all data
    } else if (searchInput.length > 2) {
      setNftList([]);
      viewNftList(1, filter, searchInput); // Fetch search-specific data
    }
  }, [searchInput]);

  const [selectedNTFIds, setSelectedNTFIds] = useState([]);

  const getSelectedId = (id) => {
    let nftId;
    
    if (selectedNTFIds.includes(id)) {
      setSelectedNTFIds(
        selectedNTFIds.filter((selectedId) => selectedId !== id)
      );
    } else {
      setSelectedNTFIds([...selectedNTFIds, id]);
    }
  };


  let bulkCall = false;

  const approveNFT = async (decision, id) => {

    bulkCall = true;

    let approve = await getSignerMarketContrat().approveNfts(id, decision, {
      gasLimit: ethers.BigNumber.from("500000"),
    });

    await approve.wait();
    // await handleApprovalEvent();
    await postAPI(decision, id);
  };

  const postAPI = async (decision, id) => {
    let body = {
      token_idz: id,
    };

    if (decision) {
      const response = await adminApis.approveNfts(body);
      // console.log("response", response);
      deleteItems(id);
    } else {
      const response = await adminApis.rejectNfts(body);
      // console.log("response", response);
      deleteItems(id);
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


  const [showEditSidebar, setshowEditSidebar] = useState(false);
  const [loader, setLoader] = useState(true)



  return (
    <div className="user-management">
      <AdminHeader search={search} setSearch={setSearch} />
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
                        viewNftList(
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
                        viewNftList(
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
                        viewNftList(
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
          {selectedNTFIds?.length > 0 && (
            <div
              className="nft-card-btn-holder"
              style={{ justifyContent: " end", gap: "10px", marginTop: "20px" }}
            >
              <button onClick={() => approveNFT(false, selectedNTFIds)}>
                Unapprove
              </button>
            </div>
          )}
        </div>
        <div
          className="table-for-user-management"
          style={{ top: selectedNTFIds.length > 0 ? "160px" : "120px" }}
        >
        
          {list?.data?.length > 0 ? (
            <>
              <div className="row">
                <div className="col-lg-11 mx-auto">
                  <div className="row">
                    {nftList.map((item, index) => (
                      <DashboardCard2                 
                        index={index}
                        key={index}
                        id={item?.id}
                        is_unapproved={item?.is_unapproved}
                        title={item?.title}
                        image={item?.image}
                        price={item?.price}
                        paymentMethod={item?.paymentMethod}
                        royalty={item?.royalty}
                        description={item?.description}
                        getSelectedId={getSelectedId}
                        selectedNTFIds={selectedNTFIds}
                        approveNFT={approveNFT}
                        // collection={item?.collection}
                        collectionImages={item?.collectionImages}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div
                className="user-management-table-contorls"
                style={{ justifyContent: "center" }}
              >
                
                {list?.pagination?.remaining != 0  &&
                   <button
                   className={`controling-Nft-Load-More ${list?.pagination?.remaining == 0 ? "disable" : ""
                     }`}
                   onClick={() => {
                     viewNftList(
                       +list?.pagination?.page + 1,
                       filter,
                       searchInput
                     );
                     setIsOpen(null);
                   }}
                 >
                   Load More
                 </button>
                }
             
              </div>
            </>
          )
            : (
              <div className="empty-messahe">
                <h2>No data avaliable</h2>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

export default ControllingContent;
