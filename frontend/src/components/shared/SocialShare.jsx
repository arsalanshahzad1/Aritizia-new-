import React from "react";
import { AiOutlineFacebook } from "react-icons/ai";
import { CgInstagram } from "react-icons/cg";
import { CiTwitter } from "react-icons/ci";

const SocialShare = ({ style }) => {
  // console.log(style);
  return (
    <div className="share-links-social">
      <span
        style={{ fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        Share
      </span>
      <CgInstagram />
      <CiTwitter />
      <AiOutlineFacebook />
    </div>
  );
};

export default SocialShare;
