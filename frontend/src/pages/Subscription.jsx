import React, { useEffect, useState } from "react";
import Header from "./landingpage/Header";
import PageTopSection from "../components/shared/PageTopSection";
import Footer from "./landingpage/Footer";
import SubscriptionCard from "../components/cards/SubscriptionCard";
import Search from "../components/shared/Search";
import apis from "../service";
import StripeContainer from "../stripePayment/StripeContainer";
import Modal from "react-bootstrap/Modal";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheck } from "react-icons/bs";
import { toast } from "react-toastify";
import Loader from "../components/shared/Loader";

const DateDisplay = ({ datetime }) => {
    const parsedDate = new Date(datetime);
    const formattedDate = parsedDate.toISOString().split('T')[0];
    return <p>{formattedDate}</p>;
}

const Subscription = ({ search, setSearch }) => {
    const [subscriptionData, setSubscriptionData] = useState([]);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [reneval, setreneval] = useState(false);
    const [cancleSubscription, setCancleSubscription] = useState(false);
    const [planName, setPlanName] = useState("");
    const [index, setIndex] = useState("");
    const [userSebData , setUserSebData] = useState('')

    const userData = JSON.parse(localStorage.getItem("data"));
    const userId = userData?.id;


    const viewSubscriptions = async (id) => {
        try {
            const response = await apis.viewSubscriptions(id);
            if (response.status) {
                setSubscriptionData(response?.data?.data);
            }
            console.log(response);
            setLoader(false)
            
        } catch (error) {
            setLoader(false)
        }
    };

    const showResponseMessage = (message) => {
        setShowPaymentForm(false);
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const autoRecursionOnoff = async (userSebData) => {
        const response = await apis.autoRecursionOnoff(userSebData)
        if (response.status) {
            console.log(response);
            viewSubscriptions(userId)
            setreneval(false)
        } else {
            console.log(response);
            setreneval(false)
        }
    }
    const cancelSubn = async () => {
        setLoader(true)
        const response = await apis.cancelSubscription(userSebData)
        if (response.status) {
            console.log(response);
            viewSubscriptions(userId)
            setCancleSubscription(false)
            setLoader(false)
        } else {
            console.log(response);
            setCancleSubscription(false)
            setLoader(false)
        }
    }

    const comformation = (id, subId) =>{
        setUserSebData({ user_id: id, subscription_id: subId })
        setreneval(!reneval)
    }
    const cancelSubscription = (id, subId) =>{
        
        setUserSebData({ user_id: id, subscription_id: subId })
        setCancleSubscription(!cancleSubscription)
        autoRecursionOnoff(userSebData)
    }

    useEffect(() => {
        viewSubscriptions(userId);
    }, []);

    const [loader, setLoader] = useState(true)

    // const [scroll, setScroll] = useState(true)

    // useEffect(()=>{
    //   if(scroll){
    //     window.scrollTo(0,0)
    //     setScroll(false)
    //   }
    // },[])

    
    return (
        <>

        {loader && <Loader />}
            <Header search={search} setSearch={setSearch} />
            <div className="subscription">
                <PageTopSection title={"Subscription"} />
                <div className="subscription-wrap">
                    <div className="container-fluid">
                        <div className="row">
                            {subscriptionData.map((res, index) => {
                                if (res?.user_subs?.length != 0) {
                                    return (
                                        <div className="subscription-purchase-details" key={index}>
                                            {res?.user_subs?.auto_recursion && !res?.user_subs?.is_cancel ?
                                                <div className="left">
                                                    Renewal date : <DateDisplay datetime={res?.user_subs?.next_renewal_date} />
                                                </div>
                                                :
                                                <div className="left">
                                                    Expiry date : <DateDisplay datetime={res?.user_subs?.next_renewal_date} />
                                                </div>
                                            }
                                            <div className="right">
                                                {res?.user_subs?.is_cancel == 0 &&
                                                <>
                                                
                                                <div >
                                                    <div className="title" style={{ display: 'flex', justifyContent: 'space-between', gap: '5px' }}>
                                                        Auto renewal
                                                        <div onClick={() => comformation(userId, res?.user_subs?.subscription_id)} className="seven-line-nft-cardd" style={{ display: 'flex', alignItems: 'center', padding: '0px' }}>
                                                            <span>
                                                                <BsCheck className={`${res?.user_subs?.auto_recursion ? "red" : "transparent"}`} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div >
                                                    <button onClick={() => cancelSubscription(userId, res?.user_subs?.subscription_id)}>Cancel Subscription</button>
                                                </div>
                                                </>
                                            }
                                            </div>
                                        </div>
                                    )
                                }
                            })}
                        </div>
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
                    className="payment-modal-wrap"
                    backdrop="static"
                    keyboard={false}
                >
                    <div className="modal-body">
                        <div className="payment-close">
                            <AiOutlineClose onClick={() => setShowPaymentForm(false)} />
                        </div>
                        <div className="sucess-data">
                            <p className="card-title">Subscription : {planName === "Free Trail" ? "Free Trial" : planName}</p>
                            <StripeContainer
                                index={index}
                                planName={planName}
                                setShowPaymentForm={setShowPaymentForm}
                                showResponseMessage={showResponseMessage}
                                viewSubscriptions={viewSubscriptions}
                            />
                        </div>
                    </div>
                </Modal>
                <Modal
                    show={reneval}
                    onHide={() => setreneval(false)}
                    centered
                    size="lg"
                    className="payment-modal-wrap"
                    backdrop="static"
                    keyboard={false}
                >
                    <div className="modal-body renewalconfirmation-close">
                        <div className="renewalconfirmation-close">
                            <AiOutlineClose onClick={() => setreneval(false)} />
                        </div>
                        <h2>Renewal Confirmation</h2>
                        <div>
                            <button onClick={() =>setreneval(false)}>Cancle</button>
                            <button onClick={() =>autoRecursionOnoff(userSebData)}>Confirm</button>
                        </div>
                    </div>
                </Modal>
                <Modal
                    show={cancleSubscription}
                    onHide={() => setCancleSubscription(false)}
                    centered
                    size="lg"
                    className="payment-modal-wrap"
                    backdrop="static"
                    keyboard={false}
                >
                    <div className="modal-body renewalconfirmation-close">
                        <div className="renewalconfirmation-close">
                            <AiOutlineClose onClick={() => setCancleSubscription(false)} />
                        </div>
                        <h2>Cancel Subscription</h2>
                        <div>
                            <button onClick={() =>setCancleSubscription(false)}>Cancel</button>
                            <button onClick={cancelSubn}>Confirm</button>
                        </div>
                    </div>
                </Modal>
                <Search search={search} setSearch={setSearch} />
                <Footer />
            </div>
        </>
    );
};

export default Subscription;
