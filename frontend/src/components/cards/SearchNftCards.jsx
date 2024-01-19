import React from "react";

const SearchNftCards = ({ id, title, image, price }) => {
  return (
    <>
      <div className="col-lg-4 col-md-4 col-6">
        <div className="search-nft-wrap">
          <img src={image} alt="" width={"100%"} />
          <h2>{title}</h2>
        </div>
      </div>
    </>
  );
};

export default SearchNftCards;
