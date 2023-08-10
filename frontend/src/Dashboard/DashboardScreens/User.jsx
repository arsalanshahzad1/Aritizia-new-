import { useEffect, useState } from 'react'
import Header from '../../pages/landingpage/Header'
import { Navigate, useNavigate } from 'react-router-dom'
import SocialShare from '../../components/shared/SocialShare'
import { BsFillEnvelopeFill } from 'react-icons/bs'
import NewItemCard from '../../components/cards/NewItemCard'
import BuyNow from '../../components/cards/BuyNow'
import nft from '../../../public/assets/images/nft-big.png'
import DashboardCard from '../DashboardComponents/DashboardCard'
import adminApis from '../../service/adminIndex'
import apis from '../../service/adminIndex'
import { useLocation, useParams } from "react-router-dom";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import axios from "axios";
import { connectWallet, getProviderOrSigner } from "../../methods/walletManager";

function User({ search, setSearch }) {
    const navigate = useNavigate()
    const { id } = useParams();
    console.log(id,"call");
    const [tabs, setTabs] = useState(0);
    const [userDetails, setUserDetails] = useState('');
    const [userLikedNfts, setUserLikedNfts] = useState('');
    const [nftCollection, setNftCollection] = useState('');

    const viewUserDetails = async (id) =>{
        const response = await apis.viewUserDetails(id)
        if(response.status){
            setUserDetails(response?.data?.data)
        }else{
            setUserDetails([])
        }
    }
    const viewUserLikedNfts = async (id) =>{
        const response = await apis.viewUserLikedNfts(id)
        if(response.status){
            setUserLikedNfts(response?.data?.data)
        }else{
            setUserLikedNfts([])
        }
    }
    const viewNftCollection = async (id) =>{
        const response = await apis.viewNftCollection(id)
        if(response.status){
            nftCollection(response?.data?.data)
        }else{
            nftCollection([])
        }
    }

    useEffect(() =>{
        viewUserDetails(id)
        viewUserLikedNfts(id)
        viewNftCollection(id)
    } , [])


    const getMyListedNfts = async () => {
        console.log("aaaa");
        console.log("Connected wallet", userAddress);
        let emptyList = [];
        setNftListAuction(emptyList);
        setNftListFP(emptyList);
        const provider = await getProviderOrSigner();
        console.log("111111");
        // console.log("provider", provider);
    
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
        const signer = provider.getSigner();
        const address = await signer.getAddress();
    
        // console.log("MYADDRESS", address);
        console.log("333333");
    
        let listingType;
    
        let mintedTokens = await marketplaceContract.getMyListedNfts(userAddress);
    
        // let mintedTokens = [1, 4, 2];
        console.log("mintedTokens", mintedTokens);
        let NFTId = await getLikedNftsList();
        let myNFTs = [];
        let myAuctions = [];
        for (let i = 0; i < mintedTokens.length; i++) {
          let id;
          id = +mintedTokens[i].tokenId.toString();
    
          let collectionId;
          collectionId = +mintedTokens[i].collectionId.toString();
          console.log("YESS", id);
    
          const response = await apis.getNFTCollectionImage(collectionId);
          console.log(response, "responses");
          const collectionImages = response?.data?.data?.media?.[0]?.original_url;
          console.log(response?.data?.data?.media?.[0]?.original_url, "responsess");
          console.log(collectionImages, "trrrr");
    
          const metaData = await nftContract.tokenURI(id);
    
          const structData = await marketplaceContract._idToNFT(id);
    
          const fanNftData = await marketplaceContract._idToNFT2(id);
    
          let discountOnNFT = +fanNftData.fanDiscountPercent.toString();
    
          setDiscountPrice(discountOnNFT);
    
          let auctionData = await marketplaceContract._idToAuction(id);
    
          listingType = structData.listingType;
    
          let highestBid = ethers.utils.formatEther(
            auctionData.highestBid.toString()
          );
    
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
              const collection = data.collection;
    
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
                };
                console.log(nftData);
                myNFTs.push(nftData);
                setNftListFP(myNFTs);
              } else if (listingType === 1) {
                const nftData = {
                  id: id, //
                  title: title,
                  image: image,
                  price: price,
                  basePrice: price,
                  collectionImages: collectionImages,
                  endTime: auctionData.endTime.toString(),
                  highestBid: highestBid,
                  highestBidder: auctionData.highestBidder.toString(),
                  seller: auctionData.seller.toString(),
                  startTime: auctionData.startTime.toString(),
                };
                myAuctions.push(nftData);
                setNftListAuction(myAuctions);
                console.log(nftListAuction, "nftData");
              }
            })
    
            .catch((error) => {
              console.error("Error fetching metadata:", error);
            });
        }
      };



    return (
        <div className='user'>
            <div className='back-btn'>
                <div onClick={() => navigate(-1)}>
                    <svg width="32" height="20" viewBox="0 0 54 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.585785 13.5858C-0.195263 14.3668 -0.195263 15.6332 0.585785 16.4142L13.3137 29.1421C14.0948 29.9232 15.3611 29.9232 16.1421 29.1421C16.9232 28.3611 16.9232 27.0948 16.1421 26.3137L4.82843 15L16.1421 3.68629C16.9232 2.90524 16.9232 1.63891 16.1421 0.857861C15.3611 0.0768122 14.0948 0.0768121 13.3137 0.857861L0.585785 13.5858ZM54 13L2 13L2 17L54 17L54 13Z" fill="black" />
                    </svg>

                </div>
            </div>
            <div>
                <div className="profile" style={{ position: "relative" }}>
                    <div className="profile-first-section">
                        {userDetails?.cover_image == null ?
                        <img
                            className="big-image margin-top-35px"
                            src="/assets/images/profile-1.png"
                            alt=""
                            width={"100%"}
                        />
                        :
                        <img
                            className="big-image margin-top-35px"
                            src={userDetails?.cover_image}
                            alt=""
                            width={"100%"}
                        />

                    }
                        <div className="user">
                            <div className="user-wrap">
                                {userDetails?.profile_image == null ?
                                <img
                                    className="user-pic"
                                    src="/assets/images/user-none.png"
                                    alt=""
                                    width={"90%"}
                                />
                                :
                                <img
                                    className="user-pic"
                                    src={userDetails?.profile_image}
                                    alt=""
                                    width={"90%"}
                                />
                            }

                            
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
                                        <h2 className="user-name">{userDetails?.username}</h2>
                                    </div>
                                    {/* <div className="col-lg-4 col-md-4 col-6 my-auto">
                                        <SocialShare
                                            style={{ fontSize: "28px", marginRight: "0px" }}
                                        />
                                    </div> */}
                                </div>
                                <div className="row">
                                    <p className="user-email">{userDetails?.email}</p>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3 col-md-3 col-12"></div>
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <div className="copy-url">
                                            <span>{userDetails?.wallet_address}</span>
                                            <button>Copy</button>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-3 col-md-3 col-12 my-auto">
                                        <div className="message-btn">
                                            <button>
                                                <BsFillEnvelopeFill />
                                                MESSAGE
                                            </button>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="row">
                                    <div className="profile-tabs">
                                        <button
                                            className={`${tabs === 0 ? "active" : ""}`}
                                            onClick={() => setTabs(0)}
                                        >
                                            On Sale
                                        </button>
                                        <button
                                            className={`${tabs === 1 ? "active" : ""}`}
                                            onClick={() => setTabs(1)}
                                        >
                                            Created
                                        </button>
                                        <button
                                            className={`${tabs === 2 ? "active" : ""}`}
                                            onClick={() => setTabs(2)}
                                        >
                                            Liked
                                        </button>
                                    </div>
                                </div>
                                <div className="profile-buy-card">
                                    {tabs === 0 && (
                                        <>
                                            <div className="row">
                                                {/* {nftListFP.map((item) => ( */}

                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />

                                            </div>

                                        </>
                                    )}
                                    {tabs === 1 && (
                                        <>

                                            <div className="row">
                                            <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                            </div>
                                        </>
                                    )}
                                    {tabs === 2 && (
                                        <>
                                            <div className="row">
                                            <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                                <DashboardCard
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                />
                                            </div>
                                            
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <Search search={search} setSearch={setSearch} /> */}

                </div>
            </div>
            
        </div>
    )
}

export default User