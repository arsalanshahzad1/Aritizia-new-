import React, { useState } from 'react'
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

const Setting = () => {
    const [activeTabs, setActiveTabs] = useState('Notification')
    return (
        <>
            <Header />
            <div className='edit-profile'>
                <PageTopSection title={activeTabs} />
                <section className='setting-first-section'>
                    <div className="setting-tabs">
                        <div className="container">
                            <div className="row">
                                <ul>
                                    <li onClick={() => { setActiveTabs('Notification') }}><button className={`${activeTabs === 'Notification' ? 'active' : ''}`}><ImNotification />Notification</button></li>
                                    <li onClick={() => { setActiveTabs('Appearance') }}><button className={`${activeTabs === 'Appearance' ? 'active' : ''}`}><IoMdColorPalette />Appearance</button></li>
                                    <li onClick={() => { setActiveTabs('Earnings') }}><button className={`${activeTabs === 'Earnings' ? 'active' : ''}`}><FaHandHoldingUsd />Earnings</button> </li>
                                    <li onClick={() => { setActiveTabs('Edit') }}><button className={`${activeTabs === 'Edit' ? 'active' : ''}`}><FaEdit />Edit</button></li>
                                </ul>
                            </div>
                            <div className='seeting-tabs-parent'>
                                <div className="row">
                                    {activeTabs === 'Notification' && <Notification />}
                                    {activeTabs === 'Appearance' && <Appearance />}
                                    {activeTabs === 'Earnings' && <Earnings />}
                                    {activeTabs === 'Edit' && <EditProfile />}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer/>
            </div>
        </>
    )
}

export default Setting