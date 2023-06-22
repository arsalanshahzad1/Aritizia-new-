import React from 'react'
import Header from './landingpage/Header'
import PageTopSection from '../components/shared/PageTopSection'
import Footer from './landingpage/Footer'
import SubscriptionCard from '../components/cards/SubscriptionCard'

const Subscription = () => {
    return (
        <>
            <Header />
            <div className='subscription'>
                <PageTopSection title={'Subscription'} />
                <div className="subscription-wrap">
                    <div className="container-fluid">
                        <div className="row">
                            <SubscriptionCard />
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </>
    )
}

export default Subscription