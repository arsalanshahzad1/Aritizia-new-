import React from "react";
import { AiOutlineFacebook } from "react-icons/ai";
import { CgInstagram } from "react-icons/cg";
import { CiTwitter } from "react-icons/ci";
import {
  FacebookShareButton,
  InstapaperShareButton,
  TwitterShareButton,
} from "react-share";

const SocialShare = ({ style }) => {
  // console.log(style);
  return (
    <div className="share-links-social">
      <span
        style={{ fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        Share
      </span>
      <InstapaperShareButton
        className="share-icons"
        url="http://artizia.pluton.ltd/profile"
        title="Ali Khan"
      >
        <CgInstagram className="share-icon"/>
      </InstapaperShareButton>
      <TwitterShareButton
        className="share-icons"
        url="http://artizia.pluton.ltd/profile"
        title="Ali Khan"
      >
        <CiTwitter className="share-icon"/>
      </TwitterShareButton>
      <FacebookShareButton
        className="share-icons"
        url="http://artizia.pluton.ltd/profile"
        title="Ali Khan"
      >
        <AiOutlineFacebook className="share-icon"/>
      </FacebookShareButton>
    </div>
  );
};

export default SocialShare;
