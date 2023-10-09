import React from 'react'
import { GiCrossMark } from 'react-icons/gi'
import Cross from '../svg/Cross'
import Check from '../svg/Check'
import { BsCheck } from "react-icons/bs";
import apis from '../../service';

const DateDisplay = ({ datetime }) => {
    const parsedDate = new Date(datetime);
    const formattedDate = parsedDate.toISOString().split('T')[0];
    return <p>{formattedDate}</p>;
}

const SubscriptionCard = ({ data, setShowPaymentForm, setPlanName, setIndex, index, viewSubscriptions }) => {
    console.log(data);

    const userData = JSON.parse(localStorage.getItem("data"));
    const userId = userData?.id;

    const autoRecursionOnoff = async (id, subId) => {
        console.log(id);
        console.log(subId);
        const response = await apis.autoRecursionOnoff({ user_id: id, subscription_id: subId })
        if (response.status) {
            console.log(response);
            viewSubscriptions(userId)
        } else {
            console.log(response);
        }
    }


    return (
        <>
            {data.map((res, i) => {
                return (
                    <div className="col-lg-3 col-md-6" key={i}>
                        {res?.name == 'Free Trial' ?
                            <div className={`subscription-card-wrap`}>
                                <h2 className='title'>{res?.name}</h2>
                                <div>
                                    {res?.monthly_cost == 0 ?
                                        <>
                                            <p className='p1'>Monthly subscription cost</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Monthly subscription cost</p>
                                            <span className="span-1">{res?.monthly_cost}</span>
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.annual_cost == 0 ?
                                        <>
                                            <p className='p1'>Annual subscription cost</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Annual subscription cost</p>
                                            <span className="span-1">{res?.annual_cost}</span>
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.monthly_generated_images == 0 ?
                                        <>
                                            <p className='p1'>Images generated/mo</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Images generated/mo</p><Check />
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.transection_fee == 0 ?
                                        <>
                                            <p className='p1'>Transection fee</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Transection fee</p>
                                            <span className="span-1">{res?.transection_fee}%</span>
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.unlimited_gallery_uploads == 0 ?
                                        <>
                                            <p className='p1'>Unlimited gallegy uploads</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Unlimited gallegy uploads</p><Check />
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.prompt_privacy == 0 ?
                                        <>
                                            <p className='p1'>Prompt privacy</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Prompt privacy</p><Check />
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.nft_minting == 0 ?
                                        <>
                                            <p className='p1'>NFT Minting</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>NFT Minting</p><Check />
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.personal_gallery == 0 ?
                                        <>
                                            <p className='p1'>Personal Gallery</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Personal Gallery</p><Check />
                                        </>


                                    }
                                </div>
                                <div>
                                    {res?.exclusive_art_release == 0 ?
                                        <>
                                            <p className='p1'>Access to exclusive art releases</p><Cross />
                                        </>
                                        :
                                        <>
                                            <p className='p1'>Access to exclusive art releases</p><Check />
                                        </>


                                    }
                                </div>
                            </div>
                            :
                            <div key={i} className={`subscription-card-wrap ${res?.user_subs.length != 0 ? 'active' : ''}`}>
                                <div onClick={() => { setShowPaymentForm(true); setPlanName(res?.name); setIndex(i) }}>
                                    <h2 className='title'>{res?.name == 'Free Trail' ? "Free Trial": res?.name}</h2>
                                    <div>
                                        {res?.monthly_cost == 0 ?
                                            <>
                                                <p className='p1'>Monthly subscription cost</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Monthly subscription cost</p>
                                                <span className="span-1">{res?.monthly_cost}$</span>
                                            </>


                                        }
                                    </div>
                                    <div>
                                        {res?.annual_cost == 0 ?
                                            <>
                                                <p className='p1'>Annual subscription cost</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Annual subscription cost</p>
                                                <span className="span-1">{res?.annual_cost}$</span>
                                            </>


                                        }
                                    </div>
                                    <div>
                                        {res?.monthly_generated_images == 0 ?
                                            <>
                                                <p className='p1'>Images generated/mo</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Images generated/mo</p><Check />
                                            </>
                                        }
                                    </div>
                                    <div>
                                        {res?.transection_fee == 0 ?
                                            <>
                                                <p className='p1'>Transection fee</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Transection fee</p>
                                                <span className="span-1">{res?.transection_fee}%</span>
                                            </>


                                        }
                                    </div>
                                    <div>
                                        {res?.unlimited_gallery_uploads == 0 ?
                                            <>
                                                <p className='p1'>Unlimited gallegy uploads</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Unlimited gallegy uploads</p><Check />
                                            </>


                                        }
                                    </div>
                                    <div>
                                        {res?.prompt_privacy == 0 ?
                                            <>
                                                <p className='p1'>Prompt privacy</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Prompt privacy</p><Check />
                                            </>


                                        }
                                    </div>
                                    <div>
                                        {res?.nft_minting == 0 ?
                                            <>
                                                <p className='p1'>NFT Minting</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>NFT Minting</p><Check />
                                            </>


                                        }
                                    </div>
                                    <div>
                                        {res?.personal_gallery == 0 ?
                                            <>
                                                <p className='p1'>Personal Gallery</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Personal Gallery</p><Check />
                                            </>


                                        }
                                    </div>
                                    <div>
                                        {res?.exclusive_art_release == 0 ?
                                            <>
                                                <p className='p1'>Access to exclusive art releases</p><Cross />
                                            </>
                                            :
                                            <>
                                                <p className='p1'>Access to exclusive art releases</p><Check />
                                            </>


                                        }
                                    </div>
                                </div>
                                {/* {res?.user_subs.length === 0 ? null :
                                    <div className='sub-card-chack-box' style={{ marginBottom: '-30px' }}>
                                        <div className="left">
                                            <div style={{display : 'flex' , justifyContent : 'space-between' , gap: '5px'}}>
                                                Auto renewal
                                                <div onClick={() => autoRecursionOnoff(userId, res?.user_subs?.subscription_id)} className="seven-line-nft-cardd" style={{ display: 'flex', alignItems: 'center', padding: '0px' }}>
                                                    <span>
                                                        <BsCheck className={`${res?.user_subs?.auto_recursion ? "red" : "transparent"}`} />
                                                    </span>
                                                </div>
                                            </div>
                                                <DateDisplay datetime={res?.user_subs?.next_renewal_date} />
                                        </div>
                                        
                                    </div>
                                } */}
                            </div>
                        }
                    </div>
                )
            })}
        </>
    )
}

export default SubscriptionCard