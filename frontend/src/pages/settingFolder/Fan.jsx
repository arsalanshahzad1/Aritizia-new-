import { useEffect, useState } from "react";
import apis from "../../service";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import {
  connectWallet,
  getProviderOrSigner,
} from "../../methods/walletManager";
import { Link } from "react-router-dom";

function Fan({ id }) {
  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const [fanListing, setFanListing] = useState([]);

  const getFanListing = async () => {
    const response = await apis.getFanList(id);
    setFanListing(response?.data?.data);
    console.log(response?.data?.data, "fanlist");
  };

  let selectedUser;
  const removeFan = async (id) => {
    console.log("id", id);
    selectedUser = id;
    console.log("fanListing", fanListing);

    let userToRemove;

    for (let i = 0; i < fanListing.length; i++) {
      if (fanListing[i].fan_id == id) {
        console.log("selected fan", fanListing[i].wallet_address);
        userToRemove = fanListing[i].wallet_address;
      }
    }

    const signer = await getProviderOrSigner(true);

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      signer
    );

    console.log("userToRemove", userToRemove);

    // getRemoveFan();

    const remove = await marketplaceContract.removeFans(userToRemove);
    console.log("remove", remove);

    let response = marketplaceContract.on("removeFan", handleRemoveFansEvent);
    // getFanListing();
    console.log("Response of removeFan event", response);
  };

  const handleRemoveFansEvent = async (removedFan) => {
    console.log("removedFan", removedFan);
    getRemoveFan(selectedUser);
  };

  const getRemoveFan = async (selectedUser) => {
    console.log("figetRemoveFanrst");
    console.log("selectedUser", selectedUser);
    const response = await apis.getremovedFan(selectedUser);
    console.log("response from getRemoveFan", response);
    setFanListing(response?.data?.data);
    getFanListing();
    // setFanListing([]);
  };

  const getFansBC = async () => {
    const provider = await getProviderOrSigner();

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    const fans = await marketplaceContract.getFans(userAddress);

    console.log("fans", fans);
  };

  useEffect(() => {
    getFanListing();
  }, []);
  return (
    <>
      {fanListing.map((data, index) => {
        return (
          <div className="Follow-row" key={index}>
            <Link to={`/other-profile?add=${data?.wallet_address}`}>
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
            {/* <button onClick={getFansBC}>getBC</button> */}
          </div>
        );
      })}
    </>
  );
}
export default Fan;
