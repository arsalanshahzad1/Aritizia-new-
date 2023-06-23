import React from 'react'
import Header from './landingpage/Header'
import PageTopSection from '../components/shared/PageTopSection'
import Footer from './landingpage/Footer'
import SubscriptionCard from '../components/cards/SubscriptionCard'
import Search from "../components/shared/Search";

const Subscription = ({ search, setSearch }) => {
    return (
        <>
            <Header

                search={search}
                setSearch={setSearch}
            />
            <div className='subscription'>
                <PageTopSection title={'Subscription'} />
                <div className="subscription-wrap">
                    <div className="container-fluid">
                        <div className="row">
                            <SubscriptionCard />
                        </div>
                    </div>
                </div>
                <Search search={search} setSearch={setSearch} />
                <Footer />
            </div>
        </>
    )
}

export default Subscription