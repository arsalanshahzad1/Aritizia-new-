import React from 'react'
import Header from './landingpage/Header'
import Footer from './landingpage/Footer'
import PageTopSection from '../components/shared/PageTopSection'
import { Link } from 'react-router-dom'

const Create = () => {
    return (
        <>
            <Header />
            <div className="create">
                <PageTopSection title={'Create'}/>
                <div className="create-section-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 mx-auto">
                                <p>Choose “Single” if you want to upload a one-of-a-kind piece or “Multiple” for a collection.</p>
                            </div>
                        </div>
                        <div className="row">
                        <div className="col-lg-7 col-md-12 col-12 mx-auto">
                                <div className="row">
                                <div className="col-lg-6 col-md-6 col-12">
                                    <Link to={'/create/single'}>
                                        <div className="create-card">
                                            <img src="/assets/images/single.png" alt="" />
                                            <h2>Single</h2>
                                        </div>
                                        </Link>
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-12">
                                    <Link to={'/create/multiple'}>
                                        <div className="create-card">
                                            <img src="/assets/images/multiple.png" alt="" />
                                            <h2>Multiple</h2>
                                        </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}

export default Create