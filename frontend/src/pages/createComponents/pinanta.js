import axios from "axios";
import FormData from "form-data";
const key = "f8d8947de1a1117fc89f";
const secret =
  "25c39fd49cc383e00cecc68875cc751294d731d2510c00c467fe13c6d979495f";

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
        pinataURL:
          "https://ipfs.io/ipfs/" + response.data.IpfsHash,
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
