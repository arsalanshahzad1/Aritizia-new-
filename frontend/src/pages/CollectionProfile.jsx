// import React, { useRef, useCallback, useState, useEffect } from "react";
// import Header from "./landingpage/Header";
// import { BsFillEnvelopeFill } from "react-icons/bs";
// import BuyNow from "../components/cards/BuyNow";
// import NewItemCard from "../components/cards/NewItemCard";
// import Footer from "./landingpage/Footer";
// import ProfileDrawer from "../components/shared/ProfileDrawer";
// import SocialShare from "../components/shared/SocialShare";
// import Search from "../components/shared/Search";
// import Web3Modal from "web3modal";
// import { BigNumber, Contract, ethers, providers, utils } from "ethers";
// import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
// import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
// import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";
// import NFT_CONTRACT_ABI from "../contractsData/ArtiziaNFT.json";
// import axios from "axios";
// import nft from "../../public/assets/images/NFTImage.png";
// import bird from "../../public/assets/images/bird.png";
// import SimpleCard from "../components/cards/SimpleCard";
// import MyNftCard from "../components/cards/MyNftCard";
// import nftimage2 from "../../public/assets/images/nftimage2.png";
// import Following from "./settingFolder/Following";
// import collectionback from "../../public/assets/images/Collection-background.png";
// import collectionDp from "../../public/assets/images/collectionDp.png";
// import CollectionCard from "../components/cards/CollectionCard";
// import liked1 from "../../public/assets/images/liked1.png";
// import liked2 from "../../public/assets/images/liked2.png";
// import liked3 from "../../public/assets/images/liked3.png";
// import liked4 from "../../public/assets/images/liked4.png";
// import apis from "../service";
// import { getAddress } from "../methods/methods";
// import { connectWallet, getProviderOrSigner } from "../methods/walletManager";

// const { ethereum } = window;

// const CollectionProfile = ({ search, setSearch }) => {
//   const [tabs, setTabs] = useState(0);
//   const [collectionTabs, setCollectionTabs] = useState(0);

// //   const [FollowersTab, setFollowersTab] = useState(0);
//   const [isVisible, setIsVisible] = useState(false);
// //   const [walletConnected, setWalletConnected] = useState(false);
// //   const web3ModalRef = useRef();
//   const [nftListFP, setNftListFP] = useState([]);
//   const [nftListAuction, setNftListAuction] = useState([]);
// //   const [likedNfts, setLikedNfts] = useState([]);
//   const [discountPrice, setDiscountPrice] = useState(0);

//   const userData = JSON.parse(localStorage.getItem("data"));
//   const userAddress = userData?.wallet_address;

//   let likedNftsFromDB = [];

//   const getLikedNfts = async () => {
//     const provider = await getProviderOrSigner();

//     const marketplaceContract = new Contract(
//       MARKETPLACE_CONTRACT_ADDRESS.address,
//       MARKETPLACE_CONTRACT_ABI.abi,
//       provider
//     );

//     const nftContract = new Contract(
//       NFT_CONTRACT_ADDRESS.address,
//       NFT_CONTRACT_ABI.abi,
//       provider
//     );

//     for (let i = 0; i < likedNftsFromDB.length; i++) {
//       let id;

//       id = +mintedTokens[i].tokenId.toString();

//       const metaData = await nftContract.tokenURI(id);

//       const structData = await marketplaceContract._idToNFT(id);

//       const fanNftData = await marketplaceContract._idToNFT2(id);

//       let discountOnNFT = +fanNftData.fanDiscountPercent.toString();

//       setDiscountPrice(discountOnNFT);

//       let auctionData = await marketplaceContract._idToAuction(id);

//       listingType = structData.listingType;

//       const price = ethers.utils.formatEther(structData.price.toString());

//       axios
//         .get(metaData)
//         .then((response) => {
//           const meta = response.data;
//           let data = JSON.stringify(meta);

//           data = data.slice(2, -5);
//           data = data.replace(/\\/g, "");

//           data = JSON.parse(data);
//           const crypto = data.crypto;
//           const title = data.title;
//           const image = data.image;
//           const royalty = data.royalty;
//           const description = data.description;
//           const collection = data.collection;

//           // if (listingType === 0) {
//           const nftData = {
//             id: id, //
//             title: title,
//             image: image,
//             price: price,
//             crypto: crypto,
//             royalty: royalty,
//             description: description,
//             collection: collection,
//           };
//           console.log(nftData);
//           setLikedNfts(nftData);
//         })

//         .catch((error) => {
//           console.error("Error fetching metadata:", error);
//         });
//     }
//   };

//   useEffect(() => {
//     getProviderOrSigner();
//     getCollectionNfts();
//
//   }, [ ]);

//   useEffect(() => {
//     getAddress();
//   }, []);

//   const onClose = useCallback(() => {
//     setIsVisible(false);
//   }, []);

//   const onOpen = (action) => {
//     setIsVisible(action);
//   };

//   return (
//     <>
//       <Header search={search} setSearch={setSearch} />
//       <div className="profile" style={{ position: "relative" }}>
//         <div className="profile-first-section">
//           <img
//             className="big-image"
//             src={collectionback}
//             alt=""
//             width={"100%"}
//           />
//           <div className="user">
//             <div className="user-wrap">
//               <img
//                 className="user-pic"
//                 src={collectionDp}
//                 alt=""
//                 width={"90%"}
//               />
//               <img
//                 className="big-chack"
//                 src="/assets/images/big-chack.png"
//                 alt=""
//               />
//             </div>
//           </div>
//           <div className="detail">
//             <div className="container-fluid">
//               <div className="row">
//                 <div className="col-lg-4 col-md-4 col-12 followers-div">
//                   <div>Following</div>
//                   <div>Followers 50k+</div>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-6">
//                   <h2 className="user-name">The land of the Dead by DR</h2>
//                 </div>
//                 <div className="col-lg-4 col-md-4 col-6">
//                   <SocialShare
//                     style={{ fontSize: "28px", marginRight: "0px" }}
//                   />
//                 </div>
//               </div>
//               <div className="row neg-margin">
//                 <div className="col-lg-3 col-md-3 col-12">
//                   <p className="user-email user-email2">@monicaaa</p>
//                   <div className="copy-url copy-url2">
//                     <span>{userAddress}</span>
//                     <button>Copy</button>
//                   </div>
//                 </div>
//                 <div className="col-lg-6 col-md-6 col-12"></div>
//                 <div className="col-lg-3 col-md-3 col-12">
//                   <div className="message-btn">
//                     <button>
//                       <BsFillEnvelopeFill />
//                       MESSAGE
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="row">
//                 <div className="profile-tabs">
//                   <button
//                     className={`${tabs === 0 ? "active" : ""}`}
//                     onClick={() => setTabs(0)}
//                   >
//                     Collection
//                   </button>
//                   <button
//                     className={`${tabs === 1 ? "active" : ""}`}
//                     onClick={() => setTabs(1)}
//                   >
//                     Liked
//                   </button>
//                 </div>
//               </div>
//               <div className="profile-buy-card">
//                 {tabs === 0 && (
//                   <>
//                     <div className="row">
//                       <div className="Collection-tabs">
//                         <div
//                           onClick={() => setCollectionTabs(0)}
//                           className={`${collectionTabs === 0 && "active-tab"}`}
//                         >
//                           On Sale
//                         </div>
//                         <div
//                           onClick={() => setCollectionTabs(1)}
//                           className={`${collectionTabs === 1 && "active-tab"}`}
//                         >
//                           Auction
//                         </div>
//                       </div>
//                       {collectionTabs === 0 && (
//                         <>
//                           {nftListFP.map((item) => (
//                             <SimpleCard
//                               onOpen={onOpen}
//                               // onClose={onClose}
//                               key={item.id}
//                               id={item.id}
//                               title={item?.title}
//                               image={nft}
//                               price={item?.price}
//                               crypto={item?.crypto}
//                               royalty={item?.royalty}
//                               description={item?.description}
//                               collection={item?.collection}
//                               userAddress
//                             />
//                           ))}
//                         </>
//                       )}
//                       {collectionTabs === 1 && (
//                         <>
//                           {nftListAuction.map((item) => (
//                             <NewItemCard
//                               key={item.id}
//                               id={item.id}
//                               title={item?.title}
//                               image={item?.image}
//                               price={item?.price}
//                               highestBid={item?.highestBid}
//                               isLive={item?.isLive}
//                               endTime={item?.endTime}
//                               startTime={item?.startTime}
//                               description={item?.description}
//                               userAddress={userAddress}
//                             />
//                           ))}
//                         </>
//                       )}
//                     </div>
//                   </>
//                 )}
//                 {tabs === 1 && (
//                   <>
//                     <div className="row">
//                       <CollectionCard image={liked1} />
//                       <CollectionCard image={liked2} />
//                       <CollectionCard image={liked3} />
//                       <CollectionCard image={liked4} />
//                       <CollectionCard image={liked1} />
//                       <CollectionCard image={liked2} />
//                       <CollectionCard image={liked3} />
//                       <CollectionCard image={liked4} />
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <Search search={search} setSearch={setSearch} />
//         <Footer />
//       </div>
//       {/* <ProfileDrawer  isVisible={isVisible} onClose={onClose} /> */}
//     </>
//   );
// };

// export default CollectionProfile;

import React, { useCallback, useEffect, useState, useContext } from "react";
import Header from "./landingpage/Header";
import { FiSearch } from "react-icons/fi";
import { FaFacebookF } from "react-icons/fa";
import { BsTwitter, BsInstagram } from "react-icons/bs";
import { AiOutlineShareAlt, AiOutlineFlag } from "react-icons/ai";
import BuyNow from "../components/cards/BuyNow";
import NewItemCard from "../components/cards/NewItemCard";
import Footer from "./landingpage/Footer";
import ProfileDrawer from "../components/shared/ProfileDrawer";
import SocialShare from "../components/shared/SocialShare";
import Search from "../components/shared/Search";
import { useLocation, useNavigate } from "react-router-dom";
import apis from "../service";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../contractsData/ArtiziaNFT.json";
import axios from "axios";
// import { connectWallet, getProviderOrSigner } from "../methods/walletManager";
import SimpleCard from "../components/cards/SimpleCard";
import { Store } from "../Context/Store";
import { toast } from "react-toastify";

const DateDisplay = ({ datetime }) => {


  const parsedDate = new Date(datetime);
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  console.log(formattedDate, " end time now")
  return formattedDate;
};

function CollectionProfile({ search, setSearch }) {
  const url = "DdzFFzCqrhshMSxb99999999";
  const [tabs, setTabs] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const [collectionTabs, setCollectionTabs] = useState(0);
  const searchParams = new URLSearchParams(location.search);
  const [collectionID, setCollectionID] = useState(searchParams.get("id"));
  const [collectionData, setCollectionData] = useState([]);

  const [isVisible, setIsVisible] = useState(false);
  //   const [walletConnected, setWalletConnected] = useState(false);
  //   const web3ModalRef = useRef();
  const [nftListFP, setNftListFP] = useState([]);
  const [nftListAuction, setNftListAuction] = useState([]);
  //   const [likedNfts, setLikedNfts] = useState([]);
  const [discountPrice, setDiscountPrice] = useState(0);


  const { account, checkIsWalletConnected } = useContext(Store);

  useEffect(() => {
    checkIsWalletConnected()
  }, [account])

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;
  const userId = userData?.id;

  const viewNftCollectionProfile = async (id) => {
    const response = await apis.viewNftCollectionProfile(id);
    if (response?.status) {
      console.log("viewNftCollectionProfile", response);
      setCollectionData(response?.data?.data);
      getCollectionNfts(response?.data?.data?.nfts)
    } else {
      toast.error("error");
    }
  };

  useEffect(() => {
    viewNftCollectionProfile(collectionID);
  }, []);


  const getCollectionNfts = async (nftIds) => {
    // let emptyList = [];
    // // setNftListAuction(emptyList);
    // // setNftListFP(emptyList);

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // Set signer
    const signer = provider.getSigner()

    const marketplaceContract = new Contract(
      MARKETPLACE_CONTRACT_ADDRESS.address,
      MARKETPLACE_CONTRACT_ABI.abi,
      provider
    );

    const nftContract = new Contract(
      NFT_CONTRACT_ADDRESS.address,
      NFT_CONTRACT_ABI.abi,
      provider
    );
    

    let listingType;



    // let collectionTokens = await marketplaceContract.collection(0, 0);

    // console.log("collectionTokens", collectionTokens);

    // let mintedTokens = [1, 4, 2];
    const myArray = Object.values(nftIds);

  

    for (let i = 0; i < myArray?.length; i++) {
      let id;
      id = myArray[i] - 1;
      // id = mintedTokens[i];

      console.log("YESS", id);

      const structData = await marketplaceContract._idToNFT(id);

      console.log("structData", structData);

      let firstOwner = structData[i]?.firstOwner;
      if (firstOwner != "0x0000000000000000000000000000000000000000") {
        const metaData = await nftContract?.tokenURI(id);

        // const fanNftData = await marketplaceContract._idToNFT2(id);

        // let discountOnNFT = +fanNftData?.fanDiscountPercent?.toString();
        let seller = structData?.seller;

        // setDiscountPrice(discountOnNFT);
        let collectionId = structData?.collectionId?.toString();

        let auctionData = await marketplaceContract._idToAuction(id);

        let collectionImages;
        let user_id;
        let response;

        try {
          response = await apis.getNFTCollectionImage(collectionId);
          collectionImages = response?.data?.data?.media?.[0]?.original_url;
          user_id = response?.data?.data?.media?.[0]?.original_url;
        } catch (error) {
          console.log(error)
        }

        let nftLikes
        try { nftLikes = await apis.getLikeNFT(response?.data?.data?.user?.id, id) }
        catch (error) { }

        listingType = structData?.listingType;

        const price = ethers.utils.formatEther(structData?.price?.toString());

        let highestBid = ethers.utils.formatEther(
          auctionData?.highestBid?.toString()
        );

        axios
          .get(metaData)
          .then((response) => {
            const meta = response.data;
            let data = JSON.stringify(meta);

            data = data.slice(2, -5);
            data = data.replace(/\\/g, "");
            console.log("Dataa", data);

            data = JSON.parse(data);
            const crypto = data?.crypto;
            const title = data?.title;
            const image = data?.image;
            const royalty = data?.royalty;
            const description = data?.description;
            const collection = data?.collection;

            ///////////////////////////
            ///////////////////////////
            // Collection k sath jo 0 compare ho rha h
            // wo database sey ayega
            ///////////////////////////
            ///////////////////////////

            if (listingType === 0) {
              const nftData = {
                id: id, //
                title: title,
                image: image,
                price: price,
                crypto: crypto,
                royalty: royalty,
                description: description,
                collection: collection,
                collectionImages: collectionImages,
                seller: seller,
                user_id: user_id,
              };

              console.log("nftData", nftData);

              // myNFTs.push(nftData);
              // setNftListFP(myNFTs);
              setNftListFP((prev) => [...prev, nftData]);
              // console.log("myNFTs in function", myNFTs);
            } else if (listingType === 1) {
              const nftData = {
                id: id, //
                title: title,
                image: image,
                price: price,
                paymentMethod: crypto,
                basePrice: price,
                startTime: auctionData?.startTime?.toString(),
                endTime: auctionData?.endTime?.toString(),
                highestBid: highestBid,
                highestBidder: auctionData?.highestBidder?.toString(),
                // isLive: auctionData.isLive.toString(),
                seller: auctionData?.seller?.toString(),
                user_id: user_id,
                nft_like: nftLikes?.data?.data?.like_count
              };

              // myAuctions.push(nftData);
              // console.log("auction in function", myAuctions);
              // setNftListAuction(myAuctions);
              setNftListAuction((prev) => [...prev, nftData]);
            }
          })

          .catch((error) => {
            console.error("Error fetching metadata:", error);
          });
      }
    }
  };



  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const onOpen = (action) => {
    setIsVisible(action);
  };

  // const [scroll, setScroll] = useState(true)

  // useEffect(()=>{
  //   if(scroll){
  //     window.scrollTo(0,0)
  //     setScroll(false)
  //   }
  // },[])


  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="profile" style={{ position: "relative" }}>
        <div className="profile-first-section">
          <img
            className="big-image"
            src="/assets/images/other-user-cover.png"
            alt=""
            width={"100%"}
          />
          <div className="user">
            <div className="user-wrap">
              <img
                className="user-pic"
                src={collectionData?.media?.[0]?.original_url}
                alt=""
                width={"90%"}
              />
              <img
                className="big-chack"
                src="/assets/images/big-chack.png"
                alt=""
              />
            </div>
          </div>
          <div className="detail">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-4 col-md-4 col-12"></div>
                <div className="col-lg-4 col-md-4 col-6">
                  <h2 className="user-name">{collectionData?.name}</h2>
                </div>
                <div className="col-lg-4 col-md-4 col-6 my-auto">
                  {/* <div className="other-user-icons">
                    <FaFacebookF />
                    <BsTwitter />
                    <BsInstagram />
                  </div> */}
                </div>
              </div>

              <div className="row">
                <div className="user-profile-line-one">
                  <h2>Items {collectionData?.total_items}</h2>
                  <h2>·</h2>
                  <h2>
                    Created{" "}
                    <DateDisplay datetime={collectionData?.created_at} />
                  </h2>
                </div>
              </div>

              <div className="row">
                <div className="user-profile-line-two">
                  <div>
                    <h2>{collectionData?.eth_volume} ETH</h2>
                    <p>Volume</p>
                  </div>
                  <div>
                    <h2>{collectionData?.flow_price} ETH</h2>
                    <p>Flow Price</p>
                  </div>
                  <div>
                    <h2>
                      {collectionData?.coll_status == null ? (
                        <>N/A</>
                      ) : (
                        <>
                          {collectionData?.coll_status > 0 ? (
                            <>+{collectionData?.coll_status}%</>
                          ) : (
                            <>-{collectionData?.coll_status}%</>
                          )}
                        </>
                      )}
                    </h2>
                    <p>Status</p>
                  </div>
                  <div>
                    <h2>{collectionData?.total_owner}</h2>
                    <p>Owner</p>
                  </div>
                </div>
              </div>
              <div className="user-profile-buy-card">
                {/* <div className="row">
                  <BuyNow />
                </div> */}
                <>
                  <div className="row">
                    <div className="Collection-tabs">
                      <div
                        onClick={() => setCollectionTabs(0)}
                        className={`${collectionTabs === 0 && "active-tab"}`}
                      >
                        Fix Price Resale
                      </div>
                      <div
                        onClick={() => setCollectionTabs(1)}
                        className={`${collectionTabs === 1 && "active-tab"}`}
                      >
                        Auction Resale
                      </div>
                    </div>
                    {collectionTabs === 0 && (
                      <>
                        {nftListFP.length > 0 ?
                          nftListFP?.map((item) => (
                            <BuyNow
                              onOpen={onOpen}
                              // onClose={onClose}
                              key={item.id}
                              id={item.id}
                              title={item?.title}
                              image={item?.image}
                              price={item?.price}
                              crypto={item?.crypto}
                              royalty={item?.royalty}
                              description={item?.description}
                              collection={item?.collection}
                              collectionImages={item?.collectionImages}
                              userAddress
                              size={'col-lg-3'}
                            />
                          )) : <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                        }
                      </>
                    )}
                    {collectionTabs === 1 && (
                      <>
                        {nftListAuction.length > 0 ?
                          nftListAuction.map((item) => (
                            <NewItemCard
                              key={item.id}
                              id={item.id}
                              title={item?.title}
                              image={item?.image}
                              price={item?.price}
                              highestBid={item?.highestBid}
                              isLive={item?.isLive}
                              endTime={item?.endTime}
                              startTime={item?.startTime}
                              description={item?.description}
                              collectionImages={item?.collectionImages}
                              userAddress={userAddress}
                              size={'col-lg-3'}
                              user_id={item.user_id}
                              nft_like={item?.nft_like}
                            />
                          )) : <div className="data-not-avaliable"><h2>No data avaliable</h2></div>
                        }
                      </>
                    )}
                  </div>
                </>
              </div>
            </div>
          </div>
        </div>
        {/* <Search search={search} setSearch={setSearch} /> */}

        <Footer />
      </div>
      <ProfileDrawer isVisible={isVisible} onClose={onClose} />
    </>
  );
}

export default CollectionProfile;
