import axios from "axios";
import FormData from "form-data";
const key = "9c115815d7cb3001413a";
const secret =
  "78c18f5c1ca213784b9754ed521fb18792627645601e965b23a21170f3cfe8a7";

export const uploadJSONToIPFS = async (JSONBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  //making axios POST request to Pinata ⬇️
  return axios
    .post(url, JSONBody, {
      headers: {
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      return {
        success: true,
        pinataURL: "https://ipfs.io/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  //making axios POST request to Pinata ⬇️

  let data = new FormData();
  data.append("file", file);

  return axios
    .post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: key,
        pinata_secret_api_key: secret,
      },
    })
    .then(function (response) {
      // console.log("image uploaded", response.data.IpfsHash);
      return {
        success: true,
        pinataURL: "https://ipfs.io/ipfs/" + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log("error", error.message);
      return {
        success: false,
        message: error.message,
      };
    });
};
