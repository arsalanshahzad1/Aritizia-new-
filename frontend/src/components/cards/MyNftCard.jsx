import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "../../Dashboard/DashboardComponents/DashboardCard.css";
import { Link } from "react-router-dom";
import NftDrawer from "../../components/shared/NftDrawer";
import nft from '../../../public/assets/images/nft-big.png'
const DashboardCard = ({
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

    const onClose = useCallback(() => {
        console.log("calling close")
        setIsVisible(false);
    }, []);


    console.log("USER in buy now", userAddress);

    const openDrawer = () => {
        if (showLinks === true) {
            return onOpen(false);
        } else {
            setIsVisible(true);
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
            <div onMouseEnter={() => setShowLinks(true)} onMouseLeave={() => setShowLinks(false)} className="col-lg-3 col-md-4">
                <Link to={path}>
                    <div className="css-vurnku" style={{ position: "relative" }}>
                        <a className="css-118gt74" onClick={() => openDrawer()}>
                            <div className="css-15eyh94">
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
                                                <div className="social-links1">
                                                    <ul>
                                                        <li onClick={() => {
                                                            setIsVisible(true),
                                                                setTimedAuction(false)
                                                        }}>
                                                            <a href="">Fix Price</a>
                                                        </li>
                                                        <li onClick={() => {
                                                            setIsVisible(true),
                                                                setTimedAuction(true)
                                                        }}>
                                                            <a href="">On Auction</a>
                                                        </li>

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
                                                <img src="/assets/images/duck.png" alt="" />
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
                                </div>

                            </div>
                        </a>

                    </div>
                </Link>


            </div>

            <NftDrawer
                isVisible={isVisible}
                onClose={onClose}
                timedAuction={timedAuction}

            />
        </>
    );
};

export default DashboardCard;
