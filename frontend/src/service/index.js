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

  const postWalletAddress = async (body) =>
    await api.post(`connect-wallet`, body);
  const postAddFans = async (body) =>
    await api.post("add-custom-user-fans", body);
  const editProfile = async (body) =>
    await api.post(`update-profile`, body, headers);
  const getChatNotification = async (count) =>
    await api.get(`view-chat-notifications/${userId}?last_count=${count}`);
  const getChatUsers = async () => await api.get(`view-chat-users/3`);
  const getChatMessages = async (id) =>
    await api.get(`view-chat-messages/3/${id}`);
  const postChatMessages = async (body) =>
    await api.post(`send-chat-message`, body, headers);

  //Returning all the API
  return {
    editProfile,
    postWalletAddress,
    postAddFans,
    getChatNotification,
    getChatUsers,
    getChatMessages,
    postChatMessages,
  };
};

const apis = createBackendServer("http://143.198.70.237");

export default apis;
