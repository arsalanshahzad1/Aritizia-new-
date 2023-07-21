import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "../../Dashboard/DashboardComponents/DashboardCard.css";
import { Link } from "react-router-dom";
import "./Cards.css";
import duck from '../../../public/assets/images/duck.png'
import chack from '../../../public/assets/images/chack.png'
import NftDrawer from "../../components/shared/NftDrawer";
import nft from '../../../public/assets/images/nft-big.png'
const MyNftCard = ({
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
    userAddress,
}) => {
    const [showLinks, setShowLinks] = useState(false);
    // const [walletConnected, setWalletConnected] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isVisible2, setIsVisible2] = useState(false);

    const onClose = useCallback(() => {
        console.log("calling close")
        setIsVisible(false);
    }, []);
    const onClose2 = useCallback(() => {
        console.log("calling close")
        setIsVisible2(false);
    }, []);
    const onClose2 = useCallback(() => {
        console.log("calling close")
        setIsVisible2(false);
    }, []);


    console.log("USER in buy now", userAddress);

    const openDrawer2 = () => {
        if (showLinks === true) {
            onOpen(false);
            setIsVisible2(true);
        } else {
            setIsVisible2(true);
        }
    };


    const [CreateCollection, setCreateCollection] = useState("");
    const [showCreateCollection, setshowCreateCollection] = useState(false);

    const AddCollection = () => {
        if (CreateCollection.length < 1) {
            alert("Input Collection Name to Create");
        } else {
            setcollectionOptions((previousOptions) => [
                ...previousOptions,
                { value: CreateCollection.toLowerCase(), label: CreateCollection },
            ]);
            console.log(collectionOptions, "collection updated");
            hideCreateCollection();
        }
    };
    const hideCreateCollection = () => {
        setCreateCollection("");
        setshowCreateCollection(false);
    };



    const [timedAuction, setTimedAuction] = useState(false)

    return (
        <>
            <div className="col-lg-3 col-md-4">
                <Link to={path}>
                    <div onMouseEnter={() => { setShowLinks(true) }} onMouseLeave={() => { setShowLinks(false) }} className="simple-card-main" style={{ position: "relative" }}>
                        <div className="top">
                            <div className="image-holder">
                                <img src={image} alt="" />
                            </div>

                            {showLinks &&
                                <div className="social-media">
                                    <p onClick={() => {
                                        setIsVisible(true),
                                            setTimedAuction(false)
                                    }} className="nft-fix-price">Fix Price</p>
                                    <p onClick={() => {
                                        setIsVisible(true),
                                            setTimedAuction(true)
                                    }} className="nft-fix-price">On Auction</p>

                                </div>
                            }
                        </div>
                        <div onClick={openDrawer2} className="bottom">
                            <div className="nft-icon">
                                <img src={duck} alt="" />
                                <span className="checked-icon">
                                    <img src={chack} alt="" />
                                </span>
                            </div>
                            <div className="text-area">
                                <div className="line-1">
                                    <div>{title}</div>
                                    <div>{id}</div>
                                </div>
                                <div className="line-1">
                                    <div>Price</div>
                                    <div className="d-flex ">

                                        <div className="coin-img-holder">
                                            <img src={ethereum} alt="" />
                                        </div>

                                        {price}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
            <NftDrawer
                isVisible={isVisible}
                onClose={onClose}
                timedAuction={timedAuction}
            />
            <ProfileDrawer
                isVisible={isVisible2}
                onClose={onClose2}
                id={id}
                title={title}
                image={image}
                price={price}
                paymentMethod={crypto}
                royalty={royalty}
                description={description}
                collection={collection}
                userAddress={userAddress}
            />
        </>
    );
};

export default MyNftCard;
