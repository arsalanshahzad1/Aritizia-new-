import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "./Cards.css";
import { Link } from "react-router-dom";

import Web3Modal from "web3modal";
import { BigNumber, Contract, ethers, providers, utils } from "ethers";
import MARKETPLACE_CONTRACT_ADDRESS from "../../contractsData/ArtiziaMarketplace-address.json";
import MARKETPLACE_CONTRACT_ABI from "../../contractsData/ArtiziaMarketplace.json";
import NFT_CONTRACT_ADDRESS from "../../contractsData/ArtiziaNFT-address.json";
import NFT_CONTRACT_ABI from "../../contractsData/ArtiziaNFT.json";
import ProfileDrawer from "../shared/ProfileDrawer";

const BuyNow = ({
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
  marketplaceContract,
}) => {
  const [showLinks, setShowLinks] = useState(false);
  // const [walletConnected, setWalletConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);


  // return the price of NFT in usd
  const getPriceInUSD = async () => {
    let priceETH = price;
    let dollarPriceOfETH = await marketplaceContract.getLatestUSDTPrice();
    console.log("Dollar price", dollarPriceOfETH.toString());
    let priceInETH = dollarPriceOfETH.toString() / 1e18;
    console.log("priceInETH", priceInETH);

    let oneETHInUSD = 1 / priceInETH;
    console.log("oneETHInUSD", oneETHInUSD);
    let priceInUSD = priceETH;
    console.log("1.3 ETH in USD", oneETHInUSD * priceInUSD);
    priceInUSD = oneETHInUSD * priceInUSD;
    return priceInUSD;
  };


  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  const openDrawer = () => {
    if (showLinks === true) {
      return onOpen(false);
    } else {
      setIsVisible(true);
    }
  };

  return (
    <>
      <div className="col-lg-3 col-md-4">
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
                        <div className="social-links">
                          <ul>
                            <li>
                              <a href="">Instagram</a>
                            </li>
                            <li>
                              <a href="">Twitter</a>
                            </li>
                            <li>
                              <a href="">Facebook</a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="J-bottom css-1xg74gr"
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
                <div className="J-buynow css-1elubna">
                  {/* <div className="button css-pxd23z">
                                        <p>Read More</p>
                                    </div> */}
                  <div className="button css-pxd23z">
                    <p>Buy Now</p>
                    <span>
                      <img src="/assets/icons/shop.png" alt="" />
                    </span>
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
            {/* <img src="/assets/images/btc.png" alt="" className='btc-gray-logo' onClick={() => { setShowLinks(!showLinks) }} /> */}
          </div>
        </Link>

        {/* <button onClick={buyWithETH}>Buy with ETH</button>
                                    <button onClick={buyWithUSDT}>Buy with USDT</button> */}
      </div>
      <ProfileDrawer
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
        userAddress
      />
    </>
  );
};

export default BuyNow;
