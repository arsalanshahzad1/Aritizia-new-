import React, { Suspense, useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/landingpage/LandingPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import Setting from "./pages/Setting";
import Wallet from "./pages/Wallet";
import Subscription from "./pages/Subscription";
import Create from "./pages/Create";
import Single from "./pages/createComponents/Single";
import Multiple from "./pages/createComponents/Multiple";
import UserProfile from "./pages/UserProfile";
import BuyNow from "./components/cards/BuyNow";
import { GlobalProvider } from "./Context/GlobalContext";
import DashboardMain from "./Dashboard/DashboardScreens/DashboardMain";
import OtherProfile from "./pages/OtherProfile";
import CollectionProfile from "./pages/CollectionProfile";
import ChatPage from "./Chat/ChatPage";
import "react-toastify/dist/ReactToastify.css";
import Art from "./pages/Art";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import apis from "./service";
import { Store } from "./Context/Store";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ScrollToTop from "./components/shared/ScrollToTop";
import Loader from "./components/shared/Loader";
import AdminLogin from "./pages/AdminLogin";
import TopCollection from "./pages/TopCollection";
import PromptSearchList from "./pages/PromptSearchList";

function App() {
  const { account, checkIsWalletConnected, walletConnected, firstTimeCall } =
    useContext(Store);
  const [search, setSearch] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    document.body.style.overflow = search ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [search]);

  const jsonData = localStorage.getItem("data");
  const dataObject = JSON.parse(jsonData);
  const userId = dataObject?.id;

  useEffect(() => {
    const response = apis.checkSubExpiration(userId);
  }, []);

  useEffect(() => {
    checkIsWalletConnected();
  }, [account]);

  useEffect(() => {
    if (account == undefined) {
      localStorage.setItem("data", "false");
      localStorage.setItem("userAddress", "false");
      localStorage.setItem("address", "false");
      localStorage.setItem("firstTimeCall", "false");
      window.location.reload();
    }
    const address = localStorage.getItem("address");
    const userAddress = localStorage.getItem("userAddress");
    const first = localStorage.getItem("firstTimeCall");

    if (
      firstTimeCall &&
      account?.toString()?.toLowerCase() !== address?.toString()?.toLowerCase()
    ) {
      localStorage.setItem("data", "false");
      localStorage.setItem("userAddress", "false");
      localStorage.setItem("address", "false");
      localStorage.setItem("firstTimeCall", "false");
      window.location.reload();
    }
  }, [account]);

  useEffect(() => {
    const data = localStorage.getItem("data");
    const address = localStorage.getItem("address");
    const userAddress = localStorage.getItem("userAddress");
    const first = localStorage.getItem("firstTimeCall");

    if (
      data == null &&
      address == null &&
      userAddress == null &&
      first == null
    ) {
      localStorage.setItem("data", "false");
      localStorage.setItem("userAddress", "false");
      localStorage.setItem("address", "false");
      localStorage.setItem("firstTimeCall", "false");
    }
  }, []);
  return (
    <>
      <Router>
        <LocationAwareScrollToTop />
        <GlobalProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="*" element={<Navigate to={"/"} replace />} />
              <Route
                path="/"
                element={
                  <LandingPage
                    search={search}
                    setSearch={setSearch}
                    loader={loader}
                    setLoader={setLoader}
                  />
                }
              />
              <Route
                path="/register"
                element={<Register loader={loader} setLoader={setLoader} />}
              />
              <Route
                path="/top-collection"
                element={
                  <TopCollection loader={loader} setLoader={setLoader} />
                }
              />
              <Route
                path="/login"
                element={<Login loader={loader} setLoader={setLoader} />}
              />
              <Route
                path="/admin-login"
                element={<AdminLogin loader={loader} setLoader={setLoader} />}
              />
              <Route
                path="/search/"
                element={
                  <SearchPage
                    search={search}
                    setSearch={setSearch}
                    loader={loader}
                    setLoader={setLoader}
                  />
                }
              />
              <Route
                path="/terms"
                element={
                  <Terms
                    search={search}
                    setSearch={setSearch}
                    loader={loader}
                    setLoader={setLoader}
                  />
                }
              />
              <Route
                path="/privacy-policy"
                element={
                  <PrivacyPolicy
                    search={search}
                    setSearch={setSearch}
                    loader={loader}
                    setLoader={setLoader}
                  />
                }
              />
              <Route
                element={
                  <ProtectedRoute loader={loader} setLoader={setLoader} />
                }
              >
                <Route
                  path="/profile"
                  element={
                    <Profile
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/other-profile"
                  element={
                    <OtherProfile
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                {/* <Route
                path="/user-profile"
                element={<UserProfile search={search} setSearch={setSearch} />}
                /> */}
                <Route
                  path="/art"
                  element={
                    <Art
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route path="/prompt-search" element={<PromptSearchList/>}
                />
                <Route
                  path="/collection"
                  element={
                    <CollectionProfile
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/setting"
                  element={
                    <Setting
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/wallet"
                  element={
                    <Wallet
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <Subscription
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/create"
                  element={
                    <Create
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/buy"
                  element={
                    <BuyNow
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/chat/:id"
                  element={
                    <ChatPage
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
              </Route>
              <Route
                element={
                  <ProtectedRoute
                    isAdmin={true}
                    loader={loader}
                    setLoader={setLoader}
                  />
                }
              >
                <Route
                  path="/dashboard"
                  element={
                    <DashboardMain
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/dashboard/*"
                  element={
                    <DashboardMain
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
              </Route>
              <Route
                element={
                  <ProtectedRoute
                    isAuth={true}
                    loader={loader}
                    setLoader={setLoader}
                  />
                }
              >
                <Route
                  path="/create/single"
                  element={
                    <Single
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
                <Route
                  path="/create/multiple"
                  element={
                    <Multiple
                      search={search}
                      setSearch={setSearch}
                      loader={loader}
                      setLoader={setLoader}
                    />
                  }
                />
              </Route>
            </Routes>
          </Suspense>
        </GlobalProvider>
      </Router>
    </>
  );
}

export default App;
function LocationAwareScrollToTop() {
  const location = useLocation();

  // Conditionally render the ScrollToTop component
  if (location.pathname !== "/") {
    return <ScrollToTop />;
  }

  return null;
}
