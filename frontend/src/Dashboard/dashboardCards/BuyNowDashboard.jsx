import React, { useState, useEffect, useContext } from "react";
import { BsShareFill } from "react-icons/bs";
import "../../components/cards/Cards.css";
import { Link } from "react-router-dom";
import {
    FacebookShareButton,
    TwitterShareButton,
    LinkedinShareButton,
} from "react-share";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import apis from "../../service";
import { Store } from "../../Context/Store";
import HeaderConnectPopup from "../../pages/Headers/HeaderConnectPopup";
import { toast } from "react-toastify";
import ProfileDrawerDashboard from "./ProfileDrawerDashboard";

const BuyNowDashboard = ({
    setLoader,
    path,//TODO: check this
    id,
    title,
    image,
    price,
    paymentMethod,
    royalty,
    royaltyPrice,
    description,
    collection,
    collectionImages,
    seller,
    user_id,
    size
}) => {
    const [showLinks, setShowLinks] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [connectPopup, setConnectPopup] = useState(false);
    const [platformFeeETH, setPlatformFeeETH] = useState(0);
    const [priceInUSDT, setPriceIntoUSD] = useState("");
    const [sellerPlan, setSellerPlan] = useState(0);
    const [buyerPlan, setBuyerPlan] = useState(0);

    const userData = JSON.parse(localStorage.getItem("data"));
    const userAddress = userData?.wallet_address;
    const getBuyerPlan = userData?.subscription_plan;


    const { account, checkIsWalletConnected, getSignerMarketContrat, getSignerNFTContrat, getSignerUSDTContrat } = useContext(Store);

    const userWalletAddress = localStorage.getItem("userAddress")

    useEffect(() => {
        checkIsWalletConnected()
    }, [account])

    const buyerFeeCalculate = (_amount, _buyerPercent) => {
        return (_amount * _buyerPercent) / 10000;
    };


    const getPriceInUSDAndDetials = async () => {
        let _buyerPercent;

        if (getBuyerPlan == 3) {
            _buyerPercent = 0;
        } else if (getBuyerPlan == 2) {
            _buyerPercent = 100;
        } else {
            _buyerPercent = 150;
        }
        setBuyerPlan(getBuyerPlan);
        let feeETH = buyerFeeCalculate(price?.toString(), _buyerPercent);

        setPlatformFeeETH(feeETH);

        let EthIntoUSDT = (+feeETH + +price?.toString())

        // console.log(EthIntoUSDT, "totalInUSDTsssss");

        let intoUSDT = await getSignerMarketContrat().getETHOutUSDTInOutPut(EthIntoUSDT?.toString())

        setPriceIntoUSD(intoUSDT?.toString());

    };

    const getNFTDetailByNFTTokenId = async () => {
        try {
            const response = await apis.getNFTByTokenId(id);
            setNftDetails(response?.data?.data);
            setSellerPlan(response?.data?.data?.subscription_plan);
        } catch (e) {
            console.log("Error: ", e);
        }
    };


    const onClose = () => {
        setIsVisible(false);
    };

    const openDrawer = () => {
        if (showLinks === true) {
            setShowLinks(false);
            // setIsVisible(true);
        } else {
            setIsVisible(true);
        }
    };

    const [nftImg, setNftImg] = useState("");


    useEffect(() => {
        if (
            typeof image === "string" &&
            image.startsWith("https://ipfs.io/ipfs/")
        ) {
            // Fetch the blob URL and convert it to a File object
            fetch(image)
                .then((response) => response.blob())
                .then((blob) => {
                    const convertedFile = new File([blob], "convertedImage.jpg", {
                        type: "image/jpeg",
                        lastModified: Date.now(),
                    });
                    setNftImg(URL.createObjectURL(convertedFile));
                })
                .catch((error) => {
                    console.error("Error fetching or converting the blob:", error);
                    setNftImg(null);
                });
        } else {
            setNftImg(image);
        }
    }, [image]);


    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    //////////////// Buy With ETH /////////////////
    ///////////////////////////////////////////////
    ///////////////////////////////////////////////
    let ethPurchase = false;


    //BUYWITHUSDT
    let usdtPurchase = false;

    useEffect(() => {
        getPriceInUSDAndDetials();
        getNFTDetailByNFTTokenId();
    }, [account, price])

    const handleNFTSoldEvent = async (
        nftContract,
        tokenId,
        price,
        seller,
        buyer,
    ) => {
        // console.log("handleNFTSoldEvent");
        let soldData = {
            token_id: +tokenId?.toString(),
            seller: seller?.toString(),
            buyer: buyer?.toString(),
            price: price?.toString(),
        };
        // console.log("soldData", soldData);

        if (ethPurchase || usdtPurchase) {
            nftSoldPost(soldData);
            ethPurchase = false;
            usdtPurchase = false;
        }
    };

    const nftSoldPost = async (value) => {
        const response = await apis.postNftSold(value);
        // console.log("asdasdadas", response);
        setLoader(false);
        setSucess(false);
        window.location.reload();
        await onClose(false);
        setTimeout(() => {
            navigate("/profile");
        }, 1500);
    };


    return (
        <>
            <div className={`${size} col-md-4`}>
                <Link to={path}>
                    <div className="css-vurnku" style={{ position: "relative" }}>
                        <a className="css-118gt74" >
                            <div className="css-15eyh94">
                                <div className="css-2r2ti0" onClick={() => openDrawer()}>
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
                                            <img src={nftImg} className="J-image" />
                                            {showLinks && (
                                                <div className="social-links">
                                                    <ul>
                                                        <li>
                                                            <a>
                                                                <LinkedinShareButton
                                                                    url={`https://${window.location.host}/other-profile?add=${user_id}`}
                                                                    title="Artizia"
                                                                >
                                                                    <p>Linkedin</p>
                                                                </LinkedinShareButton>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a>
                                                                <TwitterShareButton
                                                                    url={`https://${window.location.host}/other-profile?add=${user_id}`}
                                                                    title="Artizia"
                                                                >
                                                                    <p>Twitter</p>
                                                                </TwitterShareButton>
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a>
                                                                <FacebookShareButton
                                                                    url={`https://${window.location.host}/other-profile?add=${user_id}`}
                                                                    title="Artizia"
                                                                >
                                                                    <p>Facebook</p>
                                                                </FacebookShareButton>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="J-bottom css-1xg74gr" style={{ position: "relative" }}>
                                <div className="css-fwx73e">
                                    <div className="css-10nf7hq detail-wrap" onClick={() => openDrawer()}>
                                        <div className="center-icon">
                                            <div className="icon">
                                                {collectionImages == null ?
                                                    <img src='/assets/images/user-none.png' alt="" />
                                                    :
                                                    <img src={collectionImages} alt="" />
                                                }
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
                                                {Number(ethers.utils.formatEther(price?.toString()))?.toFixed(5)}
                                            </div>
                                        </div>
                                        <div className="css-x2gp5l"></div>
                                    </div>
                                </div>
                            </div>
                        </a>
                        <span
                            className="btc-gray-logo"
                            onClick={() => {
                                setShowLinks(!showLinks);
                            }}
                        >
                            <span>
                                <BsShareFill />
                            </span>
                        </span>
                    </div>
                </Link>
            </div>

            <ProfileDrawerDashboard
                setLoader={setLoader}
                isVisible={isVisible}
                onClose={onClose}
                id={id}
                title={title}
                image={image}
                price={price}
                paymentMethod={paymentMethod}
                royalty={royalty}
                description={description}
                collection={collection}
                collectionImages={collectionImages}
                setIsVisible={setIsVisible}
                seller={seller}
                user_id={user_id}
                royaltyPrice={royaltyPrice}
            />

            <HeaderConnectPopup connectPopup={connectPopup} setConnectPopup={setConnectPopup} />
        </>
    );
};

export default BuyNowDashboard;
