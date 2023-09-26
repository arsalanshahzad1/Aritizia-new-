import React, { useState, useEffect } from 'react'
import PageTopSection from '../components/shared/PageTopSection'
import Header from './landingpage/Header'
import Footer from './landingpage/Footer'
import { ImNotification } from 'react-icons/im'
import { IoMdColorPalette } from 'react-icons/io'
import { FaHandHoldingUsd, FaEdit } from 'react-icons/fa'
import EditProfile from './settingFolder/EditProfile'
import Earnings from './settingFolder/Earnings'
import Appearance from './settingFolder/Appearance'
import Notification from './settingFolder/Notification'
import { useContext } from 'react'
import { GlobalContext } from '../Context/GlobalContext'
import Search from "../components/shared/Search";
import Purchase from './settingFolder/Purchase'
import Loader from '../components/shared/Loader'


const Setting = ({ search, setSearch }) => {
    const { activeTabsSetting } = useContext(GlobalContext)
    const [activeTabs, setActiveTabs] = useState(activeTabsSetting)
    useEffect(() => {
        setActiveTabs(activeTabsSetting)
        setLoader(false)
    }, [activeTabsSetting])

    const [loader, setLoader] = useState(true)
    return (
        <>
        {loader && <Loader />}
            <Header
                search={search}
                setSearch={setSearch}
            />
            <div className='edit-profile'>
                <PageTopSection title={activeTabs} />
                <section className='setting-first-section'>
                    <div className="setting-tabs">
                        <div className="container">
                            <div className="row">
                                <ul>
                                    <li onClick={() => { setActiveTabs('Notification') }}><button className={`${activeTabs === 'Notification' ? 'active' : ''}`}><ImNotification />Notification</button></li>
                                    {/* <li onClick={() => { setActiveTabs('Appearance') }}><button className={`${activeTabs === 'Appearance' ? 'active' : ''}`}><IoMdColorPalette />Appearance</button></li> */}
                                    <li onClick={() => { setActiveTabs('Earnings') }}><button className={`${activeTabs === 'Earnings' ? 'active' : ''}`}><FaHandHoldingUsd />Earnings</button> </li>
                                    <li onClick={() => { setActiveTabs('Purchase') }}><button className={`${activeTabs === 'Purchase' ? 'active' : ''}`}><FaHandHoldingUsd />Purchase</button> </li>
                                    <li onClick={() => { setActiveTabs('Edit') }}><button className={`${activeTabs === 'Edit' ? 'active' : ''}`}><FaEdit />Edit</button></li>
                                </ul>
                            </div>
                            <div className='seeting-tabs-parent'>
                                <div className="row">
                                    {activeTabs === 'Notification' && <Notification />}
                                    {/* {activeTabs === 'Appearance' && <Appearance />} */}
                                    {activeTabs === 'Earnings' && <Earnings />}
                                    {activeTabs === 'Purchase' && <Purchase />}
                                    {activeTabs === 'Edit' && <EditProfile />}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Search search={search} setSearch={setSearch} />
                <Footer />
            </div>
        </>
    )
}

export default Setting