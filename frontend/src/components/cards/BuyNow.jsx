import React, { useRef, useCallback, useState, useEffect } from "react";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { BsShareFill } from "react-icons/bs";
import "./Cards.css";
import { Link } from "react-router-dom";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
  LinkedinShareButton,
} from "react-share";
import ProfileDrawer from "../shared/ProfileDrawer";

const BuyNow = ({
  path,
  id,
  title,
  image,
  price,
  discountPrice,
  crypto,
  royalty,
  description,
  collection,
  collectionImages,
  seller,
  // userAddress,
}) => {
  const [showLinks, setShowLinks] = useState(false);
  // const [walletConnected, setWalletConnected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [buyButton, showBuyButton] = useState(false);

  const checkSeller = async () => {
    // const provider = await getProviderOrSigner();

    // const marketplaceContract = new Contract(
    //   MARKETPLACE_CONTRACT_ADDRESS.address,
    //   MARKETPLACE_CONTRACT_ABI.abi,
    //   provider
    // );

    // const structData = await marketplaceContract._idToNFT(id);
    // let seller = structData.seller;
    console.log("checkSeller Seller", seller);
    console.log("checkSeller userAddress", userAddress);
    console.log("checkSeller Seller == userAddress", seller == userAddress);

    if (userAddress != seller) {
      showBuyButton(true);
    } else {
      showBuyButton(false);
    }
  };

  useEffect(() => {
    checkSeller();
  }, []);

  const userData = JSON.parse(localStorage.getItem("data"));
  const userAddress = userData?.wallet_address;

  const onClose = useCallback(() => {
    setIsVisible(false);
  }, []);

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

  const [scroll, setScroll] = useState(true)

  useEffect(()=>{
    if(scroll){
      window.scrollTo(0,0)
      setScroll(false)
    }
  },[])

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
                      <img src={nftImg} className="J-image" />
                      {showLinks && (
                        <div className="social-links">
                          <ul>
                            <li>
                              <a>
                                <LinkedinShareButton
                                  url="http://artizia.pluton.ltd"
                                  title="Ali Khan"
                                >
                                  <p>Linkedin</p>
                                </LinkedinShareButton>
                              </a>
                            </li>
                            <li>
                              <a>
                                <TwitterShareButton
                                  url="http://artizia.pluton.ltd"
                                  title="Ali Khan"
                                >
                                  <p>Twitter</p>
                                </TwitterShareButton>
                              </a>
                            </li>
                            <li>
                              <a>
                                <FacebookShareButton
                                  url="http://artizia.pluton.ltd"
                                  title="Ali Khan"
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
              <div
                className="J-bottom css-1xg74gr"
                style={{ position: "relative" }}
              >
                {/* <BiDotsHorizontalRounded className="doted-icon" /> */}
                <div className="css-fwx73e">
                  <div className="css-10nf7hq detail-wrap">
                    <div className="center-icon">
                      <div className="icon">
                        {/* <img src={collectionImages && collectionImages} alt="" /> */}
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
                  {userAddress?.toUpperCase() !== seller?.toUpperCase() ? (
                    <div className="button css-pxd23z">
                      {/* {console.log(JSON.parse(localStorage.getItem("data")).wallet_address, "arsalan")} */}
                      <p>Buy Now</p>

                      <span>
                        <img src="/assets/icons/shop.png" alt="" />
                      </span>
                    </div>
                  )
                  : (
                    <div className="button css-pxd23z" style={{display: "flex", justifyContent:"center"}}>
                      <p>Your nft</p>
                    </div>
                  )
                  }
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
        discountPrice={discountPrice}
        paymentMethod={crypto}
        royalty={royalty}
        description={description}
        collection={collection}
        userAddress={userAddress}
        sellerWallet={seller}
      />
    </>
  );
};

export default BuyNow;
