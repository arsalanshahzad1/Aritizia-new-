import React, { useEffect, useState } from 'react'
import Header from './landingpage/Header'
import PageTopSection from '../components/shared/PageTopSection'
import Footer from './landingpage/Footer'
import SubscriptionCard from '../components/cards/SubscriptionCard'
import Search from "../components/shared/Search";
import apis from '../service'
import StripeContainer from '../stripePayment/StripeContainer'
import Modal from 'react-bootstrap/Modal';
import { AiOutlineClose } from 'react-icons/ai'
import { toast } from 'react-toastify'

const Subscription = ({ search, setSearch }) => {
    const [subscriptionData, setSubscriptionData] = useState([])
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [planName, setPlanName] = useState('');
    const [index, setIndex] = useState('');
    const userData = JSON.parse(localStorage.getItem("data"));
    const userId = userData?.id;
    const viewSubscriptions = async (id) => {
        const response = await apis.viewSubscriptions(id)
        if (response.status) {
            setSubscriptionData(response?.data?.data)
        }
        console.log(response);
    }

    const showResponseMessage = (message) =>{
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
        });
    }

    useEffect(() => {
        viewSubscriptions(userId)
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
                            <SubscriptionCard 
                            data={subscriptionData} 
                            setShowPaymentForm={setShowPaymentForm} 
                            setPlanName={setPlanName} 
                            setIndex={setIndex} 
                            index={index} 
                            viewSubscriptions={viewSubscriptions}
                            />
                        </div>
                    </div>
                </div>
                <Modal
                    show={showPaymentForm}
                    onHide={() => setShowPaymentForm(false)}
                    centered
                    size="lg"
                    className='payment-modal-wrap'
                    backdrop="static"
                    keyboard={false}>


                    <div className="modal-body">
                        <div className="payment-close">
                            <AiOutlineClose onClick={() => setShowPaymentForm(false)} />
                        </div>
                        <div className="sucess-data">
                            <p className='card-title'>Subscription : {planName}</p>
                            <StripeContainer index={index} planName={planName} setShowPaymentForm={setShowPaymentForm} showResponseMessage={showResponseMessage}/>
                        </div>
                    </div>

                </Modal>
                <Search search={search} setSearch={setSearch} />
                <Footer />
            </div>
        </>
    )
}

export default Subscription