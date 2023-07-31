import axios from "axios";

const createBackendServer = (baseURL) => {
  const api = axios.create({
    baseURL: `${baseURL}/api/`,
    withCredentials: false,
    headers: {
      Accept: "application/json",
    },
    timeout: 60 * 1000,
  });

  const userId = 2;
  const localStoragedata = JSON.parse(localStorage.getItem("data"));
  const RealUserId = localStoragedata?.id;
  console.log(RealUserId, "RealUserId");

  //Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data?.message;
      error.message = message ?? error.message;
      if (error?.response?.data?.errors)
        error.errors = error?.response?.data?.errors;
      return Promise.reject(error);
    }
  );

  //Interceptor
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data?.message;
      error.message = message ?? error.message;
      if (error?.response?.data?.errors)
        error.errors = error?.response?.data?.errors;
      return Promise.reject(error);
    }
  );

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  
  const postListNft = async (body) => await api.post("list-nft", body);

  const postNftSold = async (body) => await api.post("sold-nft", body);

  const postWalletAddress = async (body) =>await api.post(`connect-wallet`, body);
  const postAddFans = async (body) =>await api.post("add-custom-user-fans", body);

  //Returning all the API

  const editProfile = async (body) =>await api.post(`update-profile`, body, headers);

  const getChatNotification = async (count) =>await api.get(`view-chat-notifications/${RealUserId}?last_count=${count}`);
  const getChatUsers = async () =>await api.get(`view-chat-users/${RealUserId}`);
  const getChatMessages = async (id) =>await api.get(`view-chat-messages/${RealUserId}/${id}`);
  const postChatMessages = async (body) =>await api.post(`send-chat-message`, body, headers);

  const viewNotification = async () => await api.get(`view-notifications/8`);
  const ReadNotification = async () => await api.get(`read-notification/7`);
  const sendNotification = async (body) =>await api.post(`send-notification`, body);

  const getLikeNFT = async (userId, NFTTokenId) =>await api.get(`/count-like-nft/${RealUserId}/${NFTTokenId}`);
  const getLikeNFTList = async () =>await api.get(`user-liked-nfts/${RealUserId}`);
  const postLikeNFT = async (body) => await api.post(`user-like-nft`, body);

  const getViewNFT = async (NFTTokenId) =>await api.get(`/show-view-nft/${NFTTokenId}`);
  const postViewNFT = async (body) => await api.post(`user-view-nft`, body);

  //follow
  const postFollowAndUnfollow = async (body) => await api.post(`user-follow-unfollow`, body);
  const getCountFollow = async (userId, otherUserId) => await api.get(`count-follow-unfollow/${RealUserId}/${otherUserId}`);
  const getFollowingList = async () => await api.get(`view-following-list/${RealUserId}`);
  const getFollowersList = async () => await api.get(`view-followers-list/${RealUserId}`);

  const postCheckChatMessage = async (body) => await api.post(`check-chat-message`, body);

  const getNFTCollection = async () => await api.get(`view-nft-collections/${RealUserId}`);
  const postNFTCollection = async (body) => await api.post(`add-nft-collection`, body);

  const getNFTCollectionImage = async (collectionId) => await api.get(`view-nft-collection-stock/${collectionId}`);


  const getNFTByTokenId = async (tokenId) => await api.get(`view-nft-by-token/${tokenId}`);
  
  const getOtherUser = async (userAddress) => await api.get(`view-user-detail-by-wallet/${userAddress}`);

  //Returning all the API
  return {
    editProfile,
    postListNft,
    postNftSold, 
    postWalletAddress,
    postAddFans,
    getChatNotification,
    getChatUsers,
    getChatMessages,
    postChatMessages,
    viewNotification,
    ReadNotification,
    sendNotification,
    getLikeNFT,
    getLikeNFTList,
    postLikeNFT,
    getViewNFT,
    postViewNFT,

    postFollowAndUnfollow,
    getCountFollow,
    getFollowingList,
    getFollowersList,

    postCheckChatMessage,

    getNFTCollection,
    postNFTCollection,
    getNFTCollectionImage,

    getNFTByTokenId,

    getOtherUser
  };
};

const apis = createBackendServer("http://143.198.70.237");

export default apis;
