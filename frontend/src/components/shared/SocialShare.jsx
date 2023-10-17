import React from "react";
import { AiOutlineFacebook, AiOutlineLinkedin } from "react-icons/ai";
import { BsLinkedin, BsTwitter } from "react-icons/bs";
// import { AiOutlineLinkedin } from "react-icons/cg";
import { CiTwitter } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import {
  FacebookShareButton,
  InstapaperShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} from "react-share";

const SocialShare = ({ style, bidStyle ,user_id}) => {
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
        url={`https://${window.location.host}/other-profile?add=${user_id}`}
        title="Artizia"
        style={{fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        <BsLinkedin className="share-icon"/>
      </LinkedinShareButton>
      <TwitterShareButton
        className="share-icons"
        url={`https://${window.location.host}/other-profile?add=${user_id}`}
        title="Artizia"
        style={{fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        <BsTwitter className="share-icon"/>
      </TwitterShareButton>
      <FacebookShareButton
        className="share-icons"
        url={`https://${window.location.host}/other-profile?add=${user_id}`}
        title="Artizia"
        style={{fontSize: style.fontSize, marginRight: style.marginRight }}
      >
        <FaFacebookF className="share-icon" />
      </FacebookShareButton>
    </div>
  );
};

export default SocialShare;
