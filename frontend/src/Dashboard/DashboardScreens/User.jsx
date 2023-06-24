import { useState } from 'react'
import Header from '../../pages/landingpage/Header'
import { Navigate, useNavigate } from 'react-router-dom'
import SocialShare from '../../components/shared/SocialShare'
import { BsFillEnvelopeFill } from 'react-icons/bs'
import NewItemCard from '../../components/cards/NewItemCard'
import BuyNow from '../../components/cards/BuyNow'
import nft from '../../../public/assets/images/nft-big.png'
function User({ search, setSearch }) {
    const navigate = useNavigate()
    const [tabs, setTabs] = useState(0);
    return (
        <div className='user'>
            <div className='back-btn'>
                <div onClick={() => navigate(-1)}>
                    <svg width="32" height="20" viewBox="0 0 54 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.585785 13.5858C-0.195263 14.3668 -0.195263 15.6332 0.585785 16.4142L13.3137 29.1421C14.0948 29.9232 15.3611 29.9232 16.1421 29.1421C16.9232 28.3611 16.9232 27.0948 16.1421 26.3137L4.82843 15L16.1421 3.68629C16.9232 2.90524 16.9232 1.63891 16.1421 0.857861C15.3611 0.0768122 14.0948 0.0768121 13.3137 0.857861L0.585785 13.5858ZM54 13L2 13L2 17L54 17L54 13Z" fill="black" />
                    </svg>

                </div>
            </div>
            <div>
                <div className="profile" style={{ position: "relative" }}>
                    <div className="profile-first-section">
                        <img
                            className="big-image margin-top-35px"
                            src="/assets/images/profile-1.png"
                            alt=""
                            width={"100%"}
                        />
                        <div className="user">
                            <div className="user-wrap">
                                <img
                                    className="user-pic"
                                    src="/assets/images/user-pic.png"
                                    alt=""
                                    width={"90%"}
                                />
                                <img
                                    className="big-chack"
                                    src="/assets/images/big-chack.png"
                                    alt=""
                                />
                            </div>
                        </div>
                        <div className="detail">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-lg-4 col-md-4 col-12"></div>
                                    <div className="col-lg-4 col-md-4 col-6">
                                        <h2 className="user-name">Monica Lucas</h2>
                                    </div>
                                    {/* <div className="col-lg-4 col-md-4 col-6 my-auto">
                                        <SocialShare
                                            style={{ fontSize: "28px", marginRight: "0px" }}
                                        />
                                    </div> */}
                                </div>
                                <div className="row">
                                    <p className="user-email">@monicaaa</p>
                                </div>
                                <div className="row">
                                    <div className="col-lg-3 col-md-3 col-12"></div>
                                    <div className="col-lg-6 col-md-6 col-12">
                                        <div className="copy-url">
                                            <span>DdzFFzCqrhshMSxb9....</span>
                                            <button>Copy</button>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-3 col-md-3 col-12 my-auto">
                                        <div className="message-btn">
                                            <button>
                                                <BsFillEnvelopeFill />
                                                MESSAGE
                                            </button>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="row">
                                    <div className="profile-tabs">
                                        <button
                                            className={`${tabs === 0 ? "active" : ""}`}
                                            onClick={() => setTabs(0)}
                                        >
                                            On Sale
                                        </button>
                                        <button
                                            className={`${tabs === 1 ? "active" : ""}`}
                                            onClick={() => setTabs(1)}
                                        >
                                            Created
                                        </button>
                                        <button
                                            className={`${tabs === 2 ? "active" : ""}`}
                                            onClick={() => setTabs(2)}
                                        >
                                            Liked
                                        </button>
                                    </div>
                                </div>
                                <div className="profile-buy-card">
                                    {tabs === 0 && (
                                        <>
                                            <div className="row">
                                                {/* {nftListFP.map((item) => ( */}
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                <BuyNow
                                                    // onOpen={onOpen}
                                                    key={'2'}
                                                    id={'2'}
                                                    title={'Bull BTC Club'}
                                                    image={nft}
                                                    price={"0.008"}
                                                    crypto={"0"}
                                                    royalty={"item?.royalty"}
                                                    description={"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."}
                                                    collection={"item?.collection"}
                                                // userAddress
                                                />
                                                {/* ))} */}
                                                {/* <BuyNow onOpen={onOpen} onClose={onClose} /> */}
                                                {/* <BuyNow onOpen={onOpen} onClose={onClose} /> */}
                                            </div>
                                            {/* <div className="row">
                      <NewItemCard />
                      <NewItemCard />
                      <NewItemCard />
                      <NewItemCard />
                    </div> */}
                                        </>
                                    )}
                                    {tabs === 1 && (
                                        <>
                                            {/* <div className="row">
                      <BuyNow onOpen={onOpen} onClose={onClose} />
                      <BuyNow onOpen={onOpen} onClose={onClose} />
                      <BuyNow onOpen={onOpen} onClose={onClose} />
                      <BuyNow onOpen={onOpen} onClose={onClose} />
                    </div> */}
                                            <div className="row">
                                                {/* {nftListAuction.map((item) => (
                                                    <NewItemCard
                                                        key={item.id}
                                                        id={item.id}
                                                        title={item?.title}
                                                        image={item?.image}
                                                        price={item?.price}
                                                        highestBid={item?.highestBid}
                                                        isLive={item?.isLive}
                                                        endTime={item?.endTime}
                                                        userAddress
                                                    />
                                                ))} */}
                                            </div>
                                        </>
                                    )}
                                    {tabs === 2 && (
                                        <>
                                            <div className="row">
                                                {/* <BuyNow onOpen={onOpen} onClose={onClose} />
                      <BuyNow onOpen={onOpen} onClose={onClose} />
                      <BuyNow onOpen={onOpen} onClose={onClose} />
                      <BuyNow onOpen={onOpen} onClose={onClose} /> */}
                                            </div>
                                            <div className="row">
                                                {/* <NewItemCard />
                      <NewItemCard />
                      <NewItemCard />
                      <NewItemCard /> */}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <Search search={search} setSearch={setSearch} /> */}
                    {/* <Footer /> */}
                </div>
            </div>
        </div>
    )
}

export default User