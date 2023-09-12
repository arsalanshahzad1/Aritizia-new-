import React from 'react'
import Header from './landingpage/Header'
import Footer from './landingpage/Footer'
import PageTopSection from '../components/shared/PageTopSection'
import { Link } from 'react-router-dom'
import Search from "../components/shared/Search";

const Create = ({ search, setSearch }) => {
    const scrollToPrompt = () => {
        document.getElementById('prompt').scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }
    return (
        <>
            <Header
                search={search}
                setSearch={setSearch}
            />
            <div className="create">
                <PageTopSection title={'Create'} />
                <div className="create-section-wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 mx-auto">
                                <p>Choose “Single” if you want to upload a one-of-a-kind piece or “Multiple” for a collection.</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-lg-12 col-md-12 col-12 mx-auto">
                                <div className="row">
                                    <div className="col-lg-4 col-md-4 col-12">
                                        <Link to={'/create/single'}>
                                            <div className="create-card">
                                                <div className='image-holder'>
                                                    <img src="/assets/images/single.png" alt="" />
                                                </div>
                                                <h2>Single</h2>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-12">
                                        <Link to={'/create/multiple'}>
                                            <div className="create-card">
                                                <div className='image-holder'>
                                                    <img src="/assets/images/multiple.png" alt="" />
                                                </div>
                                                <h2>Multiple</h2>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-lg-4 col-md-4 col-12">
                                        <Link to={'/art'} onClick={scrollToPrompt}>
                                            <div className="create-card">
                                                <div className='image-holder'>
                                                    <img src="/assets/images/Generate.png" alt="" />
                                                </div>
                                                <h2>Generate</h2>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Search search={search} setSearch={setSearch} />
                <Footer />
            </div>
        </>
    )
}

export default Create