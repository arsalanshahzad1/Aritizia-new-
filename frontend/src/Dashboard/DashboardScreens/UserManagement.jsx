import React, { useEffect } from 'react'
import Header from '../../pages/landingpage/Header'
import { useState } from 'react';
import UserDataRows from './UserDataRows';
import adminApis from '../../service/adminIndex';
import Dropdown from "react-dropdown";
import {MdKeyboardArrowDown} from 'react-icons/md'
import {BiSearchAlt2} from 'react-icons/bi'
import "react-dropdown/style.css";

function UserManagement({ search, setSearch }) {
    const [toggleUserDropdown, setToggleUserDropdown] = useState(true);
    const [listCount, setListCount] = useState(0);
    const [userList, setUserList] = useState([]);
    const [isOpen, setIsOpen] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [filter, setFilter] = useState('Yearly');
    const [showfilter, setShowFilter] = useState(false);

    const dateTypeOptions = [
        { value: 'yearly', label: "Yearly" },
        { value: 'monthly', label: "Monthly" },
        { value: 'weekly', label: "Weekly" }
    ];

    const defaultDateType = dateTypeOptions[0];

    const viewUserList = async (count, filter, searchInput) => {

        setListCount(count * 10 - 10)
        const response = await adminApis.viewUserList(count, filter, searchInput);
        if (response?.status) {
            setUserList(response?.data)
            console.log(response?.data , 'asasas');
        } else {
            console.log('error');
        }

    }

    const handleToggleOpen = (data) => {
        setIsOpen(prev => (prev === data?.id) ? null : data?.id);
    };

    useEffect(()=> {
        if (searchInput.length < 3) {
            viewUserList(1, 'yearly', ''); // Fetch all data
        } else {
            viewUserList(1, filter, searchInput); // Fetch search-specific data
        }
    }, [searchInput])

    return (
        <div className='user-management'>
            <Header

                search={search}
                setSearch={setSearch}
            />
            <div className='user-management-after-header'>
                <div className='dashboard-front-section-2'>
                    <div className='dashboard-front-section-2-row-1'>
                        <div className='df-s2-r1-c1'>
                            <div className='User-management-txt'>USER MANAGEMENT</div>

                        </div>
                        <div className='controls-for-user-management'>
                            <div className='user-sub-dd' onClick={() => setShowFilter(!showfilter)}>
                                <div className="title" >{filter} <MdKeyboardArrowDown/></div>
                                {showfilter &&
                                <div className="options">
                                    <h2 onClick={() => { viewUserList(+(userList?.pagination?.page), 'yearly', searchInput); setFilter("yearly") }}>Yearly</h2>
                                    <h2 onClick={() => { viewUserList(+(userList?.pagination?.page), 'monthly', searchInput); setFilter("monthly") }}>Monthly</h2>
                                    <h2 onClick={() => { viewUserList(+(userList?.pagination?.page), 'weakly', searchInput); setFilter("weekly") }}>Weekly</h2>
                                </div>
                                } 
                            </div>
                            <div className="user-search">
                                <input type="search" placeholder='Search' onChange={(e) => setSearchInput(e.target.value)}/>
                                <BiSearchAlt2/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='table-for-user-management'>
                    <table className='data-table'>
                        <thead>
                            <tr>
                                <td>S.No</td>
                                <td>Wallet Address</td>
                                <td>Name</td>
                                <td>Total NFTs</td>
                                <td>Email</td>
                                <td>Phone Number</td>
                                <td>Action</td>

                            </tr>
                            <hr className='space-between-rows'></hr>
                        </thead>
                        <tbody>
                            {/* {userList?.data?.map((data , index) =>{
                                return(
                                    <> */}
                            <UserDataRows
                                data={userList}
                                listCount={listCount}
                                handleToggleOpen={handleToggleOpen}
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                viewUserList={viewUserList}
                                count={+(userList?.pagination?.page)}
                                filter={filter}
                                searchInput={searchInput}
                            />
                            <hr className='space-between-rows'></hr>
                        </tbody>
                    </table>
                    <div className='user-management-table-contorls'>
                        <div>
                            <div>{userList?.pagination?.total_pages}</div>
                            <div>of Pages</div>
                            <div onClick={() => { viewUserList(+(userList?.pagination?.page) - 1 , filter , searchInput); setIsOpen(null) }} className={`${userList?.pagination?.page < 2 ? 'disable' : ''}`}>
                                <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.47122 0C6.60253 0.0659459 6.72572 0.147667 6.83811 0.243433C6.9347 0.353091 6.98972 0.494467 6.99336 0.64203C6.99699 0.789592 6.94895 0.933619 6.85788 1.04812C6.81732 1.10085 6.77318 1.15057 6.72571 1.19688L1.65911 6.3766C1.62042 6.41609 1.57963 6.45333 1.53687 6.48817L1.64588 6.6065L6.74556 11.82C6.86335 11.9189 6.94412 12.0564 6.97423 12.2091C7.00435 12.3619 6.98195 12.5207 6.91081 12.6585C6.8668 12.7414 6.80578 12.8134 6.73193 12.8698C6.65807 12.9262 6.57315 12.9656 6.483 12.9852C6.39286 13.0048 6.2996 13.0042 6.20971 12.9834C6.11982 12.9626 6.03538 12.9221 5.96224 12.8648C5.91369 12.8246 5.86738 12.7817 5.82345 12.7363L0.247871 7.03589C0.167644 6.97273 0.102721 6.89157 0.0580107 6.79866C0.0133001 6.70574 -0.0100098 6.60356 -0.0100098 6.5C-0.0100098 6.39644 0.0133001 6.29426 0.0580107 6.20135C0.102721 6.10843 0.167644 6.02727 0.247871 5.96411C2.07223 4.09329 3.89772 2.22584 5.72429 0.361771C5.85707 0.200345 6.02761 0.0758949 6.22004 0H6.47122Z" fill="white" />
                                </svg>
                            </div>
                            <div onClick={() => { viewUserList(+(userList?.pagination?.page) + 1 , filter , searchInput);; setIsOpen(null) }} className={`${userList?.pagination?.remaining == 0 ? 'disable' : ''}`}>
                                <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.528779 0C0.397474 0.0659459 0.274285 0.147667 0.161888 0.243433C0.0652976 0.353091 0.0102797 0.494467 0.0066433 0.64203C0.00300694 0.789592 0.0510526 0.933619 0.142119 1.04812C0.182678 1.10085 0.226824 1.15057 0.274287 1.19688L5.34089 6.3766C5.37958 6.41609 5.42037 6.45333 5.46313 6.48817L5.35412 6.6065L0.254438 11.82C0.136648 11.9189 0.0558791 12.0564 0.0257664 12.2091C-0.00434637 12.3619 0.0180469 12.5207 0.0891876 12.6585C0.133197 12.7414 0.194219 12.8134 0.268074 12.8698C0.34193 12.9262 0.426853 12.9656 0.516999 12.9852C0.607144 13.0048 0.7004 13.0042 0.790291 12.9834C0.880182 12.9626 0.964625 12.9221 1.03776 12.8648C1.08631 12.8246 1.13262 12.7817 1.17655 12.7363L6.75213 7.03589C6.83236 6.97273 6.89728 6.89157 6.94199 6.79866C6.9867 6.70574 7.01001 6.60356 7.01001 6.5C7.01001 6.39644 6.9867 6.29426 6.94199 6.20135C6.89728 6.10843 6.83236 6.02727 6.75213 5.96411C4.92777 4.09329 3.10228 2.22584 1.27571 0.361771C1.14293 0.200345 0.972389 0.0758949 0.779963 0H0.528779Z" fill="white" />
                                </svg>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default UserManagement