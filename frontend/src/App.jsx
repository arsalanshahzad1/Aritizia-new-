import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import WalletManager from "../src/methods/walletManager";

function App() {
  const [search, setSearch] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  useEffect(() => {
    // Apply CSS styles to the body element
    document.body.style.overflow = search ? "hidden" : "auto";

    // Cleanup the effect
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [search]);

  return (
    <>
      <WalletManager setWalletConnected={setWalletConnected} />
      <Router>
        <GlobalProvider>
          <Routes>
            <Route
              path="*"
              element={<LandingPage search={search} setSearch={setSearch} />}
            />
            <Route
              path="/"
              element={<LandingPage search={search} setSearch={setSearch} />}
            />
            <Route
              path="/profile"
              element={<Profile search={search} setSearch={setSearch} />}
            />
            <Route
              path="/other-profile"
              element={<OtherProfile search={search} setSearch={setSearch} />}
            />
            <Route
              path="/user-profile"
              element={<UserProfile search={search} setSearch={setSearch} />}
            />
            <Route
              path="/collection-profile"
              element={
                <CollectionProfile search={search} setSearch={setSearch} />
              }
            />
            <Route
              path="/search/"
              element={<SearchPage search={search} setSearch={setSearch} />}
            />
            <Route
              path="/setting"
              element={<Setting search={search} setSearch={setSearch} />}
            />

            <Route
              path="/wallet"
              element={<Wallet search={search} setSearch={setSearch} />}
            />

            <Route
              path="/subscription"
              element={<Subscription search={search} setSearch={setSearch} />}
            />
            <Route
              path="/create"
              element={<Create search={search} setSearch={setSearch} />}
            />
            <Route
              path="/create/single"
              element={<Single search={search} setSearch={setSearch} />}
            />
            <Route
              path="/create/multiple"
              element={<Multiple search={search} setSearch={setSearch} />}
            />
            <Route
              path="/buy"
              element={<BuyNow search={search} setSearch={setSearch} />}
            />
            <Route
              path="/dashboard"
              element={<DashboardMain search={search} setSearch={setSearch} />}
            />
            <Route
              path="/dashboard/*"
              element={<DashboardMain search={search} setSearch={setSearch} />}
            />
            <Route
              path="/art"
              element={<Art search={search} setSearch={setSearch} />}
            />
            <Route
              path="/chat/:id"
              element={<ChatPage search={search} setSearch={setSearch} />}
            />
          </Routes>
        </GlobalProvider>
      </Router>
    </>
  );
}

export default App;
