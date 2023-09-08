import axios from "axios";

const createBackendServer = (baseURL) => {
  const api = axios.create({
    baseURL: `${baseURL}/api/admin`,
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

  // User Section Apis //

  // User Section Apis //

  const viewUserList = async (count, filter, search) =>
    await api.get(
      `view-user-list?page=${count}&filter=${filter}&search=${search}`
    );
  const viewUserDetails = async (userId) =>
    await api.get(`view-user-detail/${userId}`);
  const viewUserLikedNfts = async (userId) =>
    await api.get(`view-user-liked-nfts/${userId}`);
  const viewNftCollection = async (userId) =>
    await api.get(`view-nft-collection/${userId}`);
  const updateUserStatus = async (userId) =>
    await api.get(`update-user-status/${userId}`);
  const editUserProfile = async (body) =>
    await api.post(`edit-user-profile`, body);

  // NFT Section Apis //

  const viewNftDetails = async (userId) =>
    await api.get(`nft-detail-by-token/${userId}`);

  // Art Gallery Section Apis //

  const viewArtGalleyList = async (count) =>
    await api.get(`view-art-gallery-images?last_count=${count}`);
  const approvedUnapprovedArtGalleryImages = async (artGalleryId) =>
    await api.get(`approved-unapproved-art-gallery/${artGalleryId}`);

  // Subscription Section Apis //

  const viewPlans = async () => await api.get(`subscriptions`);
  const addPlan = async (body) => await api.post(`subscriptions`, body);
  const updatePlan = async (planId, body) =>
    await api.post(`subscriptions/${planId}`, body);
  const deletePlan = async (planId) =>
    await api.delete(`subscriptions/${planId}`);

  // Analytics Section Apis //
  const viewAnalyticDashboard = async () => await api.get(`view-analytic-dashboard`);
  const viewAnalyticUsers = async () => await api.get(`view-analytic-users`);
  const viewAnalyticTransaction = async (count) =>
    await api.get(`view-analytic-transaction?page=${count}&filter=yearly`);

  // Admin NFT Section Apis //

  let page_size = 8;

  const viewNftList = async (count, filter, search) =>
    await api.get(
      `view-nft-list?page=${count}&filter=${filter}&search=${search}&page_size=${page_size}`
    );
  const nftDetailByToken = async (tokenId) =>
    await api.get(`nft-detail-by-token/${tokenId}`);

  const approveNfts = async (body) => await api.post(`approve-nfts`, body);
  const rejectNfts = async (body) => await api.post(`reject-nfts`, body);

  //Returning all the API
  return {
    viewUserList,
    viewUserDetails,
    viewUserLikedNfts,
    viewNftCollection,
    updateUserStatus,
    editUserProfile,
    viewNftDetails,
    viewArtGalleyList,
    approvedUnapprovedArtGalleryImages,
    viewPlans,
    addPlan,
    updatePlan,
    deletePlan,
    viewAnalyticUsers,
    viewAnalyticTransaction,
    viewNftList,
    nftDetailByToken,
    approveNfts,
    rejectNfts,
    viewAnalyticDashboard,
  };
};

const adminApis = createBackendServer("http://143.198.70.237");


//     Testing DB: http://165.232.142.3
// Development DB: http://143.198.70.237

export default adminApis;
