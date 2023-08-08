import React, { useEffect, useState } from 'react'
import Header from '../../pages/landingpage/Header'
import ChartForEarning from '../../pages/settingFolder/ChartForEarning'
import SalesHistoryChart from './SalesHistoryChart';
import ControllingDataRows from './ContollingDataRows';
import ChartAnalytics from './ChartAnalytics';
import TransactionRows from './TransactionRows';
import adminApis from '../../service/adminIndex';
import { HiOutlineArrowNarrowUp, HiOutlineArrowNarrowDown } from 'react-icons/hi'
import { TbArrowsDownUp } from 'react-icons/tb'
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function AnalyticsTool({ search, setSearch }) {

    const [analyticsDetails, setAnalyticsDetails] = useState([]);
    const [userTransactionDetails, setUserTransactionDetails] = useState([]);
    const [listCount, setListCount] = useState(0);
    // const [saleHistory, setSaleHistory] = useState(0);
    const [activeTabData, setActiveTabData] = useState('free_trail');

    const [userSubscription, setUserSubscription] = useState({ value: 0, label: "Monthly" });
    const [saleHistory, setSaleHistory] = useState({ value: 0, label: "Monthly" });

    const userSubscriptionyptoOptions = [
        { value: 0, label: "Monthly" },
        { value: 1, label: "Weekly" },
        { value: 2, label: "Daily" },
    ];
    const saleHistoryOptions = [
        { value: 0, label: "Monthly" },
        { value: 1, label: "Weekly" },
        { value: 2, label: "Daily" },
    ];

    const defaultUserSubscription = userSubscriptionyptoOptions[0];
    const defaultSaleHistory = saleHistoryOptions[0];

    const viewAnalyticUsers = async () => {

        const response = await adminApis.viewAnalyticUsers()
        if (response?.status) {
            setAnalyticsDetails(response?.data.data)
        } else {
            console.log('error');
        }
    }
    const viewAnalyticTransaction = async (count) => {
        setListCount(count * 10 - 10)
        const response = await adminApis.viewAnalyticTransaction(count)
        if (response?.status) {
            setUserTransactionDetails(response?.data)
            console.log(response?.data, 'error');
        } else {
            console.log('error');
        }
    }

    const Monthly_data = [
        {
            data: "Jan",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[0],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Feb",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[1],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Mar",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[2],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Apr",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[3],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "May",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[4],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "June",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[5],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "July",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[6],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Aug",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[7],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Sep",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[8],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Oct",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[9],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Nov",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[10],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Dec",
            value: analyticsDetails?.user_subscription?.[activeTabData]?.all_months?.[11],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
    ];
    const Weekly_data = [
        {
            data: 1,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_week_all_days?.[0],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 2,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_week_all_days?.[1],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 3,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_week_all_days?.[2],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 4,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_week_all_days?.[3],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 5,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_week_all_days?.[4],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 6,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_week_all_days?.[5],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 7,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_week_all_days?.[6],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
    ];
    const Daily_data = [
        {
            data: 1,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[0],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 2,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[1],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 3,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[2],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 4,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[3],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 5,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[4],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 6,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[5],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 7,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[6],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 8,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[7],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 9,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[8],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 10,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[9],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 11,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[10],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 12,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[11],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 13,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[12],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 14,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[13],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 15,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[14],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 16,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[15],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 17,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[16],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 18,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[17],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 19,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[18],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 20,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[19],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 21,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[20],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 22,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[21],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 23,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[22],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 24,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[23],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 25,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[24],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 26,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[25],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 27,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[26],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 28,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[27],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 29,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[28],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: 30,
            value: analyticsDetails?.user_subscription?.[activeTabData]?.last_month_all_days?.[29],
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
    ];

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const weekly = [1, 2, 3, 4, 5, 6, 7]
    const daily = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]

    useEffect(() => {
        viewAnalyticUsers()
        viewAnalyticTransaction(1)
    }, [])
    useEffect(() => {
    }, [analyticsDetails])
    return (
        <div className='Dashboard-front'>
            <Header

                search={search}
                setSearch={setSearch}
            />
            <div className='position-absolute-top'>


                <div className='dashboard-front-section-1 dashboard-front-section-2'>
                    <div className='dashboard-card'>
                        <div>Free Trail Total Users</div>
                        <div>{analyticsDetails?.analytics?.Free_Trail?.user_count}</div>
                        {analyticsDetails?.analytics?.Free_Trail?.percentage < 0 ?
                            <div className='down'>
                                <HiOutlineArrowNarrowDown />

                                {analyticsDetails?.analytics?.Free_Trail?.percentage}%
                                <span>
                                    vs previous month
                                </span>
                            </div>
                            :
                            <>
                                {analyticsDetails?.analytics?.Free_Trail?.percentage == 0 ?

                                    <div className='up'>
                                        <HiOutlineArrowNarrowUp />

                                        {analyticsDetails?.analytics?.Free_Trail?.percentage}%
                                        <span>
                                            vs previous month
                                        </span>
                                    </div>
                                    :
                                    <div className='up'>
                                        <TbArrowsDownUp />

                                        {analyticsDetails?.analytics?.Free_Trail?.percentage}%
                                        <span>
                                            vs previous month
                                        </span>
                                    </div>

                                }
                            </>
                        }
                    </div>
                    <div className='dashboard-card'>
                        <div>Gold Total User</div>
                        <div>{analyticsDetails?.analytics?.Gold?.user_count}</div>
                        {analyticsDetails?.analytics?.Gold?.percentage < 0 ?
                            <div className='down'>
                                <HiOutlineArrowNarrowDown />

                                {analyticsDetails?.analytics?.Gold?.percentage}%
                                <span>
                                    vs previous month
                                </span>
                            </div>
                            :
                            <div className='up'>
                                <HiOutlineArrowNarrowUp />

                                {analyticsDetails?.analytics?.Gold?.percentage}%
                                <span>
                                    vs previous month
                                </span>
                            </div>
                        }
                    </div>
                    <div className='dashboard-card'>
                        <div>Platinum Total User</div>
                        <div>{analyticsDetails?.analytics?.Platinum?.user_count}</div>
                        {analyticsDetails?.analytics?.Platinum?.percentage < 0 ?
                            <div className='down'>
                                <HiOutlineArrowNarrowDown />

                                {analyticsDetails?.analytics?.Platinum?.percentage}%
                                <span>
                                    vs previous month
                                </span>
                            </div>
                            :
                            <div className='up'>
                                <HiOutlineArrowNarrowUp />

                                {analyticsDetails?.analytics?.Platinum?.percentage}%
                                <span>
                                    vs previous month
                                </span>
                            </div>
                        }
                    </div>
                    <div className='dashboard-card'>
                        <div>Daimond Total User</div>
                        <div>{analyticsDetails?.analytics?.Diamond?.user_count}</div>
                        {analyticsDetails?.analytics?.Diamond?.percentage < 0 ?
                            <div className='down'>
                                <HiOutlineArrowNarrowDown />

                                {analyticsDetails?.analytics?.Diamond?.percentage}%
                                <span>
                                    vs previous month
                                </span>
                            </div>
                            :
                            <div className='up'>
                                <HiOutlineArrowNarrowUp />

                                {analyticsDetails?.analytics?.Diamond?.percentage}%
                                <span>
                                    vs previous month
                                </span>
                            </div>
                        }
                    </div>

                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <div className='dashboard-front-section-2'>
                    <div className='dashboard-front-section-2-row-1'>
                        <div className='df-s2-r1-c1'>
                            <div>User Subscription</div>
                            <div className={`${activeTabData == 'free_trail' ? 'active' : ''}`} onClick={() => setActiveTabData('free_trail')}>Free Trial</div>
                            <div className={`${activeTabData == 'gold' ? 'active' : ''}`} onClick={() => setActiveTabData('gold')}>Gold</div>
                            <div className={`${activeTabData == 'platinum' ? 'active' : ''}`} onClick={() => setActiveTabData('platinum')}>Platinum</div>
                            <div className={`${activeTabData == 'diamond' ? 'active' : ''}`} onClick={() => setActiveTabData('diamond')}>Daimond</div>
                        </div>
                        <div className='user-sub-dd'>
                            <Dropdown
                                options={userSubscriptionyptoOptions}
                                onChange={(e) => { setUserSubscription(e) }}
                                value={defaultUserSubscription.label}
                            />
                        </div>
                    </div>
                </div>
                <div className='df-row-3'>
                    {userSubscription.value == 0 && <ChartForEarning data={Monthly_data} />}
                    {userSubscription.value == 1 && <ChartForEarning data={Weekly_data} />}
                    {userSubscription.value == 2 && <ChartForEarning data={Daily_data} />}
                    {/* <ChartForEarning data={Monthly_data} /> */}
                </div>
                <br /><br /><br /><br /> <br /> <br />
                <div className='dashboard-front-section-2'>
                    <div className='dashboard-front-section-2-row-1'>
                        <div className='df-s2-r1-c1'>
                            <div>Sales History</div>

                        </div>
                        <div className='user-sub-dd'>
                            <Dropdown
                                options={saleHistoryOptions}
                                onChange={(e) => { setSaleHistory(e) }}
                                value={defaultSaleHistory.label}
                            />
                        </div>
                    </div>
                </div>
                <div className='df-row-3'>
                    {saleHistory.value == 0 && <ChartAnalytics chatData={analyticsDetails?.transaction_history?.all_months} option={months} />}
                    {saleHistory.value == 1 && <ChartAnalytics chatData={analyticsDetails?.transaction_history?.last_week_all_day} option={weekly} />}
                    {saleHistory.value == 2 && <ChartAnalytics chatData={analyticsDetails?.transaction_history?.last_month_all_days} option={daily} />}

                </div>

                <div className='table-for-user-management'>
                    <table className='data-table'>
                        <thead>
                            <tr>
                                <td>S.No</td>
                                <td>NFT</td>
                                <td>Seller Wallet address</td>
                                <td>Seller Name</td>
                                <td>Seller Price</td>
                                <td>Buyer Wallet Address</td>
                                <td>Buyer Name</td>
                                <td>Buying Price</td>
                            </tr>
                            <hr className='space-between-rows'></hr>
                        </thead>
                        <tbody className='data-table-2 data-table-3'>
                            {userTransactionDetails?.data?.map((data , index) => {
                                return (
                                    <>
                                        <TransactionRows data={data} index={index} listCount={listCount}/>
                                        <hr className='space-between-rows'></hr>
                                    </>
                                )
                            })}

                            {/* <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr> */}


                        </tbody>
                    </table>
                    <div className='user-management-table-contorls'>
                        <div>
                            <div>{userTransactionDetails?.pagination?.total_pages}</div>
                            <div>of Pages</div>
                            <div onClick={() => { viewAnalyticTransaction(+(userTransactionDetails?.pagination?.page) - 1)}} className={`${userTransactionDetails?.pagination?.page < 2 ? 'disable' : ''}`}>
                                <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.47122 0C6.60253 0.0659459 6.72572 0.147667 6.83811 0.243433C6.9347 0.353091 6.98972 0.494467 6.99336 0.64203C6.99699 0.789592 6.94895 0.933619 6.85788 1.04812C6.81732 1.10085 6.77318 1.15057 6.72571 1.19688L1.65911 6.3766C1.62042 6.41609 1.57963 6.45333 1.53687 6.48817L1.64588 6.6065L6.74556 11.82C6.86335 11.9189 6.94412 12.0564 6.97423 12.2091C7.00435 12.3619 6.98195 12.5207 6.91081 12.6585C6.8668 12.7414 6.80578 12.8134 6.73193 12.8698C6.65807 12.9262 6.57315 12.9656 6.483 12.9852C6.39286 13.0048 6.2996 13.0042 6.20971 12.9834C6.11982 12.9626 6.03538 12.9221 5.96224 12.8648C5.91369 12.8246 5.86738 12.7817 5.82345 12.7363L0.247871 7.03589C0.167644 6.97273 0.102721 6.89157 0.0580107 6.79866C0.0133001 6.70574 -0.0100098 6.60356 -0.0100098 6.5C-0.0100098 6.39644 0.0133001 6.29426 0.0580107 6.20135C0.102721 6.10843 0.167644 6.02727 0.247871 5.96411C2.07223 4.09329 3.89772 2.22584 5.72429 0.361771C5.85707 0.200345 6.02761 0.0758949 6.22004 0H6.47122Z" fill="white" />
                                </svg>
                            </div>
                            <div onClick={() => { viewAnalyticTransaction(+(userTransactionDetails?.pagination?.page) + 1)}} className={`${userTransactionDetails?.pagination?.remaining == 0 ? 'disable' : ''}`}>
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

export default AnalyticsTool