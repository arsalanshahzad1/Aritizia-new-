import React from "react";
import { AiOutlineFacebook, AiOutlineLinkedin } from "react-icons/ai";
// import { AiOutlineLinkedin } from "react-icons/cg";
import { CiTwitter } from "react-icons/ci";
import {
  FacebookShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";

const SocialShare = ({ style, bidStyle }) => {
  // console.log(style);
  return (
    <div className={`share-links-social ${bidStyle}`}>
      <span
        style={{ fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        Share
      </span>
      <LinkedinShareButton
        className="share-icons"
        url="http://artizia.pluton.ltd/profile"
        title="Ali Khan"
        style={{fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        <AiOutlineLinkedin className="share-icon"/>
      </LinkedinShareButton>
      <TwitterShareButton
        className="share-icons"
        url="http://artizia.pluton.ltd/profile"
        title="Ali Khan"
        style={{fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        <CiTwitter className="share-icon"/>
      </TwitterShareButton>
      <FacebookShareButton
        className="share-icons"
        url="http://artizia.pluton.ltd/profile"
        title="Ali Khan"
        style={{fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        <AiOutlineFacebook className="share-icon" />
      </FacebookShareButton>
    </div>
  );
};

export default SocialShare;
