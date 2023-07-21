import React, { useEffect, useCallback, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import "./Cards.css";
import PlaceABidDrawer from "../shared/PlaceABidDrawer";

const NewItemCard = ({
  id,
  title,
  image,
  price,
  highestBid,
  isLive,
  startTime,
  endTime,
  description,
  userAddress,
}) => {
  const [showLinks, setShowLinks] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [endDate, setEndDate] = useState("");

  function convertTimestampToCustomFormat() {
    const date = new Date(endTime * 1000);

    const day = date.getDate();
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTimestamp = `${day} ${year} ${hours}:${minutes}`;
    setEndDate(formattedTimestamp);
  }

  useEffect(() => {
    // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
    convertTimestampToCustomFormat();
  }, [endDate]);

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
      <div className="col-lg-3 col-md-4 col-12 new-item-card">
        <div className="sec-five-wrap">
          <div className="image">
            <img src={image} alt="" width={"100%"} />
            <span>{endDate}</span>
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
          </div>
          <div className="detail-wrap">
            <div className="center-icon">
              <div className="icon">
                <img src="/assets/images/duck.png" alt="" />
                <img src="/assets/images/chack.png" alt="" />
              </div>
            </div>
            <div className="topsection">
              <div className="left">
                <p>{title}</p>
                <span>
                  {highestBid === 0 ? `${price} ETH` : `${highestBid} ETH`}
                </span> 
              </div>
              <div
                className="right"
                style={{ cursor: "pointer", padding: "15px 0px 15px 20px" }}
                onClick={() => setShowLinks(!showLinks)}
              >
                <p>...</p>
              </div>
            </div>
            <div className="bottom">
              <div className="left" onClick={() => openDrawer()}>
                <p>Place a bid</p>
              </div>
              <div className="right">
                <AiFillHeart />
                <span>50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PlaceABidDrawer
        isVisible={isVisible}
        onClose={onClose}
        id={id}
        title={title}
        image={image}
        price={price}
        crypto={crypto}
        // royalty={royalty}
        description={description}
        // collection={collection}
        userAddress={userAddress}
        startTime={startTime}
        endTime={endTime}
        isLive={isLive}
        highestBid={highestBid}
      />
    </>
  );
};

export default NewItemCard;
