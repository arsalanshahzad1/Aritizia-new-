import axios from "axios";
import FormData from "form-data";
const key = "8eee4ccd232ddad6ebd9";
const secret =
  "dad69f6f2e4dc184524782718c05d3e65a9c4dcec99b81e7b95c43978d3a5ffd";

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
