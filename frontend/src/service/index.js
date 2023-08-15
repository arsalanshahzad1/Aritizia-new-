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

  const postWalletAddress = async (body) => await api.post(`connect-wallet`, body);
  
  const postAddFans = async (body) => await api.post("add-custom-user-fans", body);

  const postBid = async (body) => await api.post("bidding-nft", body);


  //Returning all the API

  const editProfile = async (body) => await api.post(`update-profile`, body, headers);

  const getChatNotification = async (user_id, count) => await api.get(`view-chat-notifications/${user_id}?last_count=${count}`);

  const getChatUsers = async (user_id) => await api.get(`view-chat-users/${user_id}`);

  const getChatMessages = async (user_id,id) => await api.get(`view-chat-messages/${user_id}/${id}`);

  const postChatMessages = async (body) => await api.post(`send-chat-message`, body, headers);

  const viewNotification = async () => await api.get(`view-notifications/8`);

  const ReadNotification = async () => await api.get(`read-notification/7`);

  const sendNotification = async (body) => await api.post(`send-notification`, body);

  const getLikeNFT = async (user_id, NFTTokenId) => await api.get(`/count-like-nft/${user_id}/${NFTTokenId}`);

  const getLikeNFTList = async (userId) => await api.get(`user-liked-nfts/${userId}`);

  const postLikeNFT = async (body) => await api.post(`user-like-nft`, body);

  const getViewNFT = async (NFTTokenId) => await api.get(`/show-view-nft/${NFTTokenId}`);

  const postViewNFT = async (body) => await api.post(`user-view-nft`, body);

  //follow
  const postFollowAndUnfollow = async (body) =>
    await api.post(`user-follow-unfollow`, body);

  const getCountFollow = async (userId, otherUserId) =>
    await api.get(`count-follow-unfollow/${RealUserId}/${otherUserId}`);

  const getFollowingList = async (userId) =>
    await api.get(`view-following-list/${userId}`);

  const getFollowersList = async (userId) =>
    await api.get(`view-followers-list/${userId}`);

  const postCheckChatMessage = async (body) =>
    await api.post(`check-chat-message`, body);

  const getNFTCollection = async () =>
    await api.get(`view-nft-collections/${RealUserId}`);

  const postNFTCollection = async (body) =>
    await api.post(`add-nft-collection`, body);

  const getNFTCollectionImage = async (collectionId) =>
    await api.get(`view-nft-collection-stock/${collectionId}`);

  const getNFTByTokenId = async (tokenId) => await api.get(`view-nft-by-token/${tokenId}`);

  const getOtherUser = async (userAddress) => await api.get(`view-user-detail-by-wallet/${userAddress}/${RealUserId}`);

  const getLikeNFTListing = async (userId) => await api.get(`view-liked-nfts/${userId}`);

  const postUserFans = async (body) => await api.post(`add-user-fans`, body);

  const postCustomUserFans = async (body) =>
    await api.post(`add-custom-user-fans`, body);

  const getFanList = async () => await api.get(`view-fan-list/${RealUserId}`);

  const getremovedFan = async (removingUserId) =>
    await api.get(`remove-fan/${removingUserId}`);

  const getFollowersForFan = async () =>
    await api.get(`view-followers-for-fan/${RealUserId}`);

  const getSalesHistory = async () => await api.get(`sale-history/${RealUserId}`);

  const getPurchaseHistory = async () => await api.get(`purchase-history/${RealUserId}`);


  // User Subscription //

  const userSubscribe = async (body) => await api.post(`subscribe`, body);
  const cancelSubscription = async (body) => await api.post(`cancel-subscription`, body);
  const viewSubscriptions = async (userId) => await api.get(`view-subscriptions/${userId}`);
  const autoRecursionOnoff = async (body) => await api.post(`auto-recursion-onoff` , body);

  const viewRejectedNftList = async (userId) => await api.get(`view-rejected-nft-list/${userId}`);

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
    postBid,
    postFollowAndUnfollow,
    getCountFollow,
    getFollowingList,
    getFollowersList,

    postCheckChatMessage,

    getNFTCollection,
    postNFTCollection,
    getNFTCollectionImage,

    getNFTByTokenId,

    getOtherUser,

    getLikeNFTListing,

    postUserFans,
    postCustomUserFans,
    getFanList,
    getremovedFan,
    getFollowersForFan,

    getSalesHistory,
    getPurchaseHistory,

    // User Subscription //

    userSubscribe,
    cancelSubscription,
    viewSubscriptions,
    autoRecursionOnoff,

    viewRejectedNftList

  };
};

const apis = createBackendServer("http://143.198.70.237");

export default apis;
