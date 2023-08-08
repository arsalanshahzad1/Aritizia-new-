import React from 'react'
import { GiCrossMark } from 'react-icons/gi'
import Cross from '../svg/Cross'
import Check from '../svg/Check'

const SubscriptionCard = ({ data }) => {
    console.log(data);
    return (
        <>
            {data.map((res, index) => {
                return (
                    <div className="col-lg-3 col-md-6">
                        <div className="subscription-card-wrap">
                            <h2 className='title'>{res?.name}</h2>
                            <div>
                                {res?.monthly_cost == 0 ?
                                    <>
                                        <p className='p1'>Monthly subscription cost</p><Cross />
                                    </>
                                    :
                                    <>
                                        <p className='p1'>Monthly subscription cost</p>
                                        <span class="span-1">{res?.monthly_cost}</span>
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
                                        <span class="span-1">{res?.annual_cost}</span>
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
                                        <span class="span-1">{res?.transection_fee}%</span>
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
                    </div>
                )
            })}

            {/* <div className="col-lg-3 col-md-6">
        <div className="subscription-card-wrap">
            <h2 className='title'>Gold</h2>
            <div><p className='p1'>Monthly subscription cost</p><span className='span-1'>$ 15 /mon</span></div>
            <div><p className='p1'>Annual subscription cost</p><span className='span-2'>$ 180 /yr</span><span className='span-1'>$ 150 /yr</span> <p className='p2'>2 months free</p></div>
            <div><p className='p1'>Images generated/mo</p><span className='span-1'>200</span></div>
            <div><p className='p1'>Unlimited gallegy uploads</p><Check/></div>
            <div><p className='p1'>Prompt privacy</p><Check/></div>
            <div><p className='p1'>NFT Minting</p><Check/></div>
            <div><p className='p1'>Personal Gallery</p><Check/></div>
            <div><p className='p1'>Access to exclusive art releases</p><Cross/></div>
        </div>
    </div>
    <div className="col-lg-3 col-md-6">
        <div className="subscription-card-wrap">
            <h2 className='title'>Platinum</h2>
            <div><p className='p1'>Monthly subscription cost</p><span className='span-1'>$ 30 /mon</span></div>
            <div><p className='p1'>Annual subscription cost</p><span className='span-2'>$ 360 /yr</span><span className='span-1'>$ 300 /yr</span> <p className='p2'>2 months free</p></div>
            <div><p className='p1'>Images generated/mo</p><span className='span-1'>350</span></div>
            <div><p className='p1'>Unlimited gallegy uploads</p><Check/></div>
            <div><p className='p1'>Prompt privacy</p><Check/></div>
            <div><p className='p1'>NFT Minting</p><Check/></div>
            <div><p className='p1'>Personal Gallery</p><Check/></div>
            <div><p className='p1'>Access to exclusive art releases</p><Cross/></div>
        </div>
    </div>
    <div className="col-lg-3 col-md-6">
        <div className="subscription-card-wrap">
            <h2 className='title'>Daimond</h2>
            <div><p className='p1'>Monthly subscription cost</p><span className='span-1'>$ 45 /mon</span></div>
            <div><p className='p1'>Annual subscription cost</p><span className='span-2'>$ 540 /yr</span><span className='span-1'>$ 450 /yr</span> <p className='p2'>2 months free</p></div>
            <div><p className='p1'>Images generated/mo</p><span className='span-1'>750</span></div>
            <div><p className='p1'>Unlimited gallegy uploads</p><Check/></div>
            <div><p className='p1'>Prompt privacy</p><Check/></div>
            <div><p className='p1'>NFT Minting</p><Check/></div>
            <div><p className='p1'>Personal Gallery</p><Check/></div>
            <div><p className='p1'>Access to exclusive art releases</p><Check/></div>
        </div>
    </div> */}
        </>
    )
}

export default SubscriptionCard