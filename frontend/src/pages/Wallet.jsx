import React from 'react'
import Footer from './landingpage/Footer'
import Header from './landingpage/Header'
import PageTopSection from '../components/shared/PageTopSection'
import MetaMaskWalletCard from '../components/cards/MetaMaskWalletCard'
import CoinBaseWalletCard from '../components/cards/CoinBaseWalletCard'

const Wallet = () => {
    return (
        <>
            <Header />
            <div className='wallet'>
                <PageTopSection title={'Wallet'} />
                <div className="wallet-card-wrap">
                    <div className="container">
                        <div className="row">
                            <MetaMaskWalletCard />
                            <CoinBaseWalletCard />
                            <CoinBaseWalletCard />
                            <CoinBaseWalletCard />
                            <MetaMaskWalletCard />
                            <MetaMaskWalletCard />
                            <MetaMaskWalletCard />
                            <MetaMaskWalletCard />

                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Wallet