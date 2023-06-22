import React, { useCallback, useState } from 'react'
import Header from './landingpage/Header'
import { FiSearch } from 'react-icons/fi'
import { BsBookmarkPlus } from 'react-icons/bs'
import { AiOutlineShareAlt, AiOutlineFlag } from 'react-icons/ai'
import BuyNow from '../components/cards/BuyNow'
import NewItemCard from '../components/cards/NewItemCard'
import Footer from './landingpage/Footer'
import ProfileDrawer from '../components/shared/ProfileDrawer'
import SocialShare from '../components/shared/SocialShare'
import Search from '../components/shared/Search'

function UserProfile({ search, setSearch }) {
    const url = 'DdzFFzCqrhshMSxb99999999'
    const [tabs, setTabs] = useState(0)

    const [isVisible, setIsVisible] = useState(false);

    const onClose = useCallback(() => {
        setIsVisible(false);
    }, []);

    const onOpen = (action) => {
        setIsVisible(action);
    };
    return (
        <>
            <Header search={search} setSearch={setSearch} />
            <div className="profile" style={{ position: 'relative' }}>
                <div className="profile-first-section">
                    <img className='big-image' src="/assets/images/other-user-cover.png" alt="" width={'100%'} />
                    <div className='user'>
                        <div className='user-wrap'>
                            <img className='user-pic' src="/assets/images/other-user-profile.png" alt="" width={'90%'} />
                            <img className='big-chack' src="/assets/images/big-chack.png" alt="" />
                        </div>
                    </div>
                    <div className="detail">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-4 col-md-4 col-12"></div>
                                <div className="col-lg-4 col-md-4 col-6">
                                    <h2 className='user-name'>BULL BTC CLUB</h2>
                                </div>
                                <div className="col-lg-4 col-md-4 col-6 my-auto">
                                    <div className="other-user-icons">
                                        <BsBookmarkPlus /><AiOutlineShareAlt /><AiOutlineFlag />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="user-profile-line-one">
                                    <h2>Items 74</h2>
                                    <h2>·</h2>
                                    <h2>Created Oct 2022</h2>
                                    <h2>·</h2>
                                    <h2>Creator fee 5%</h2>
                                    <h2>·</h2>
                                    <h2>Chain Ethereum</h2>
                                </div>
                            </div>

                            <div className="row">
                                <div className="user-profile-line-two">
                                    <div>
                                        <h2>1 ETH</h2>
                                        <p>Volume</p>
                                    </div>
                                    <div>
                                        <h2>0.008 ETH</h2>
                                        <p>Flow Price</p>
                                    </div>
                                    <div>
                                        <h2>-6.84%</h2>
                                        <p>Status</p>
                                    </div>
                                    <div>
                                        <h2>12K</h2>
                                        <p>Owner</p>
                                    </div>
                                    <div>
                                        <h2>50.1K</h2>
                                        <p>Item</p>
                                    </div>
                                </div>
                            </div>
                            <div className="user-profile-buy-card">
                                <div className="user-profile-search">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-4 col-3">
                                            <div className="left">
                                                <h2>Items</h2>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-8 col-9 my-auto">
                                            <div className="right">
                                                <div className="input-wrap">
                                                    <input type="text" />
                                                    <FiSearch />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <BuyNow />
                                    <BuyNow />
                                    <BuyNow />
                                    <BuyNow />
                                    <BuyNow />
                                    <BuyNow />
                                    <BuyNow />
                                    <BuyNow />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <Search search={search} setSearch={setSearch} />
                <Footer />
            </div>
            <ProfileDrawer isVisible={isVisible} onClose={onClose} />
        </>
    )
}

export default UserProfile