import React from 'react'
import './ProfileDrawerTabs.css'
import { Link } from 'react-router-dom'

const Details = () => {
    return (
        <div className="tab-data">
            <h3 className='owner'>Owner</h3>
            <Link to="/other-profile">
                <div className='one'>
                    <img src="/assets/images/owner.png" alt="" />
                    <span>Stacy Long</span>
                </div>
            </Link>
            <h3 className='properties'>Properties</h3>
            <div className="wrap">
                <div className="row">
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="profile-properties-wrap">
                            <p>Background</p>
                            <p>Lorem ipsum</p>
                            <p>85% have this trait</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12" >
                        <div className="profile-properties-wrap">
                            <p>Background</p>
                            <p>Lorem ipsum</p>
                            <p>85% have this trait</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12" >
                        <div className="profile-properties-wrap">
                            <p>Background</p>
                            <p>Lorem ipsum</p>
                            <p>85% have this trait</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12" >
                        <div className="profile-properties-wrap">
                            <p>Background</p>
                            <p>Lorem ipsum</p>
                            <p>85% have this trait</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12" >
                        <div className="profile-properties-wrap">
                            <p>Background</p>
                            <p>Lorem ipsum</p>
                            <p>85% have this trait</p>
                        </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-12" >
                        <div className="profile-properties-wrap">
                            <p>Background</p>
                            <p>Lorem ipsum</p>
                            <p>85% have this trait</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Details