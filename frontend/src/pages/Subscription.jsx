import React, { useEffect, useState } from 'react'
import Header from './landingpage/Header'
import PageTopSection from '../components/shared/PageTopSection'
import Footer from './landingpage/Footer'
import SubscriptionCard from '../components/cards/SubscriptionCard'
import Search from "../components/shared/Search";
import apis from '../service'

const Subscription = ({ search, setSearch }) => {
    const [subscriptionData , setSubscriptionData] = useState([])
    const viewSubscriptions = async () =>{
        const response = await apis.viewSubscriptions()
        if(response.status){
            setSubscriptionData(response?.data?.data)
        }
        console.log(response);
    }

    useEffect(() =>{
        viewSubscriptions()
    }, [])
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
                            <SubscriptionCard data ={subscriptionData}/>
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