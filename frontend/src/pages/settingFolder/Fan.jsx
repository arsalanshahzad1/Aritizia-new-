import React from 'react'
import { useEffect, useState,useContext } from "react";
import apis from "../../service";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
// import {
//   connectWallet,
//   getProviderOrSigner,
// } from "../../methods/walletManager";
import { Link } from "react-router-dom";
import { Store } from "../../Context/Store";

function Fan({ id, fanToggle }) {
  const userData = JSON.parse(localStorage.getItem("data"));
  const ids = userData?.id;
  const userAddress = userData?.wallet_address;

  const [fanListing, setFanListing] = useState([]);

  
  const {account,checkIsWalletConnected}=useContext(Store);

  useEffect(()=>{
    checkIsWalletConnected()
  },[account])

  // const getFanListing = async (ids) => {
  //   const response = await apis.getFanList(id);
  //   setFanListing(response?.data?.data);
  //   console.log(response?.data?.data, "fanlist");
  //   setLoader(false)
  // };

  // useEffect(()=>{
  //   setLoader(true)
  //   getFanListing(ids)
  // }
  // ,[fanToggle])

  let selectedUser;
  


  // const handleRemoveFansEvent = async (removedFan) => {
  //   console.log("kkkkkkkkkkkkkkkk");

  //   console.log("removedFan", removedFan);
  //   getRemoveFan(selectedUser);
  // };

  // const getRemoveFan = async (selectedUser) => {
  //   const response = await apis.getremovedFan(selectedUser);
  //   setFanListing(response?.data?.data);
  //   getFanListing();
  //   // setFanListing([]);
  // };



  // useEffect(() => {
  //   getFanListing();
  // }, []);

  const [loader, setLoader] = useState(true)

  if(loader){
    return(
      <>
        <section className="sec-loading">
          <div className="one"></div>
        </section>
      </>
    )
  }
  
  return (
    <>
    {fanListing?.length > 0 ?
    <>
    {fanListing.map((data, index) => {
      return (
        <div className="Follow-row" key={index}>
          <Link to={`/other-profile?add=${data?.user_id}`}>
            <div className="left">
              <div className="img-holder">
                {data?.profile_image ? (
                  <img src={data?.profile_image} alt="" />
                ) : (
                  <img src="assets/images/user-none.png" alt="" />
                )}
              </div>
              <div className="txt">
                <p>{data?.username}</p>
                <p>{data?.count_fan} Fans</p>
              </div>
            </div>
          </Link>
          <div className="right">
            <button
              className="unfollow"
              onClick={() => {
                removeFan(data?.fan_id);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      );
    })}
    </>
    :
    <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
  }
    </>
  );
}
export default Fan;
