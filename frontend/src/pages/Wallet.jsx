import React from "react";
import Footer from "./landingpage/Footer";
import Header from "./landingpage/Header";
import PageTopSection from "../components/shared/PageTopSection";
import MetaMaskWalletCard from "../components/cards/MetaMaskWalletCard";
import CoinBaseWalletCard from "../components/cards/CoinBaseWalletCard";
import Search from "../components/shared/Search";

const Wallet = ({ search, setSearch }) => {
  return (
    <>
      <Header search={search} setSearch={setSearch} />
      <div className="wallet">
        <PageTopSection title={"Wallet"} />
        <div className="wallet-card-wrap">
          <div className="container">
            <div className="row">
              <MetaMaskWalletCard />
              <CoinBaseWalletCard />
              <CoinBaseWalletCard />
              <CoinBaseWalletCard />
              {/* <MetaMaskWalletCard />
                            <MetaMaskWalletCard />
                            <MetaMaskWalletCard />
                            <MetaMaskWalletCard /> */}
            </div>
          </div>
        </div>
        <Search search={search} setSearch={setSearch} />
        <Footer />
      </div>
    </>
  );
};

export default Wallet;
