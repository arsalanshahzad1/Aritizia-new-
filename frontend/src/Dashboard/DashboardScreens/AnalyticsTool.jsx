import React from 'react'
import Header from '../../pages/landingpage/Header'
import ChartForEarning from '../../pages/settingFolder/ChartForEarning'
import SalesHistoryChart from './SalesHistoryChart';
import ControllingDataRows from './ContollingDataRows';
import ChartAnalytics from './ChartAnalytics';
import TransactionRows from './TransactionRows';


function AnalyticsTool({ search, setSearch }) {

    const Monthly_data = [
        {
            data: "Jan",
            value: 0,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Feb",
            value: 0.50,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Mar",
            value: 0.85,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Apr",
            value: 0.98,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "May",
            value: 0.45,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "June",
            value: 0.43,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "July",
            value: 0.41,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Aug",
            value: 0.52,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Sep",
            value: 0.54,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Oct",
            value: 0.85,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Nov",
            value: 0.48,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Dec",
            value: 0,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
    ];
    const Weekly_data = [
        {
            data: "Jan",
            value: 5,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Feb",
            value: 2.50,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Mar",
            value: 9.85,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Apr",
            value: 2.98,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "May",
            value: 4.45,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "June",
            value: 6.43,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "July",
            value: 3.41,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Aug",
            value: 2.52,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Sep",
            value: 4.54,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Oct",
            value: 0.85,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Nov",
            value: 0.48,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Dec",
            value: 0,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
    ];
    const Daily_data = [
        {
            data: "Jan",
            value: 0,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Feb",
            value: 0,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Mar",
            value: 0,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Apr",
            value: 2,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "May",
            value: 3,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "June",
            value: 4,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "July",
            value: 5,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Aug",
            value: 6,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Sep",
            value: 5,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Oct",
            value: 4,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Nov",
            value: 3,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
        {
            data: "Dec",
            value: 2,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        },
    ];
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
                        <div>15K+</div>
                        <div>
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.70711 0.292892C8.31658 -0.0976315 7.68342 -0.0976314 7.29289 0.292892L0.928932 6.65685C0.538407 7.04738 0.538407 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292892ZM9 18L9 1L7 1L7 18L9 18Z" fill="#2636D9" />
                            </svg>
                            12.5%
                            <span>
                                vs previous month
                            </span>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <div>Gold Total User</div>
                        <div>50K+</div>
                        <div>
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.70711 0.292892C8.31658 -0.0976315 7.68342 -0.0976314 7.29289 0.292892L0.928932 6.65685C0.538407 7.04738 0.538407 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292892ZM9 18L9 1L7 1L7 18L9 18Z" fill="#2636D9" />
                            </svg>
                            12.5%
                            <span>
                                vs previous month
                            </span>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <div>Platinum Total User</div>
                        <div>90K+</div>
                        <div className='pink'>
                            <svg width="14" height="16" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.29289 17.7071C7.68342 18.0976 8.31658 18.0976 8.70711 17.7071L15.0711 11.3431C15.4616 10.9526 15.4616 10.3195 15.0711 9.92893C14.6805 9.53841 14.0474 9.53841 13.6569 9.92893L8 15.5858L2.34315 9.92893C1.95262 9.53841 1.31946 9.53841 0.928932 9.92893C0.538407 10.3195 0.538407 10.9526 0.928932 11.3431L7.29289 17.7071ZM7 -4.37114e-08L7 17L9 17L9 4.37114e-08L7 -4.37114e-08Z" fill="#B600D1" />
                            </svg>

                            12.5%
                            <span>
                                vs previous month
                            </span>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <div>Daimond Total User</div>
                        <div>150K+</div>
                        <div className='pink'>
                            <svg width="14" height="16" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.29289 17.7071C7.68342 18.0976 8.31658 18.0976 8.70711 17.7071L15.0711 11.3431C15.4616 10.9526 15.4616 10.3195 15.0711 9.92893C14.6805 9.53841 14.0474 9.53841 13.6569 9.92893L8 15.5858L2.34315 9.92893C1.95262 9.53841 1.31946 9.53841 0.928932 9.92893C0.538407 10.3195 0.538407 10.9526 0.928932 11.3431L7.29289 17.7071ZM7 -4.37114e-08L7 17L9 17L9 4.37114e-08L7 -4.37114e-08Z" fill="#B600D1" />
                            </svg>

                            12.5%
                            <span>
                                vs previous month
                            </span>
                        </div>
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
                            <div>Free Trial</div>
                            <div>Gold</div>
                            <div>Platinum</div>
                            <div>Daimond</div>
                        </div>
                        <div>
                            <div className='dashboard-drop-down'>
                                Monthly
                                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.98009 9C6.83131 8.98977 6.68991 8.92162 6.57886 8.80668L5.74292 7.84011L0.334397 1.56713C0.252801 1.46609 0.179994 1.35599 0.117044 1.23847L0 1.04514L0 0.70687C0.14211 0.262251 0.376164 0.0592894 0.668743 0.0592894C0.790901 0.0633694 0.911057 0.0963116 1.02176 0.156158C1.13247 0.216005 1.23139 0.301472 1.31244 0.407238C2.7001 2.03106 4.09334 3.642 5.49215 5.24005L6.99683 6.98953L12.7397 0.329896C12.8838 0.143929 13.0845 0.0296689 13.2998 0.010973C13.3717 -0.00365766 13.4453 -0.00365766 13.5172 0.010973C13.6237 0.0483471 13.7207 0.115497 13.7994 0.206539C13.8782 0.297582 13.9363 0.409686 13.9686 0.532896C14.0021 0.657133 14.0089 0.788914 13.9885 0.91689C13.9681 1.04487 13.9211 1.16521 13.8516 1.26749L13.7345 1.40283L12.8986 2.36939L7.53185 8.58438C7.40778 8.71781 7.25914 8.81694 7.09714 8.87434L6.98009 9Z" fill="#929292" />
                                </svg>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='df-row-3'>
                    <ChartForEarning data={Monthly_data} />
                </div>
                <br /><br /><br /><br /> <br /> <br />
                <div className='dashboard-front-section-2'>
                    <div className='dashboard-front-section-2-row-1'>
                        <div className='df-s2-r1-c1'>
                            <div>Sales History</div>

                        </div>
                        <div>
                            <div className='dashboard-drop-down'>
                                Monthly
                                <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.98009 9C6.83131 8.98977 6.68991 8.92162 6.57886 8.80668L5.74292 7.84011L0.334397 1.56713C0.252801 1.46609 0.179994 1.35599 0.117044 1.23847L0 1.04514L0 0.70687C0.14211 0.262251 0.376164 0.0592894 0.668743 0.0592894C0.790901 0.0633694 0.911057 0.0963116 1.02176 0.156158C1.13247 0.216005 1.23139 0.301472 1.31244 0.407238C2.7001 2.03106 4.09334 3.642 5.49215 5.24005L6.99683 6.98953L12.7397 0.329896C12.8838 0.143929 13.0845 0.0296689 13.2998 0.010973C13.3717 -0.00365766 13.4453 -0.00365766 13.5172 0.010973C13.6237 0.0483471 13.7207 0.115497 13.7994 0.206539C13.8782 0.297582 13.9363 0.409686 13.9686 0.532896C14.0021 0.657133 14.0089 0.788914 13.9885 0.91689C13.9681 1.04487 13.9211 1.16521 13.8516 1.26749L13.7345 1.40283L12.8986 2.36939L7.53185 8.58438C7.40778 8.71781 7.25914 8.81694 7.09714 8.87434L6.98009 9Z" fill="#929292" />
                                </svg>

                            </div>
                        </div>
                    </div>
                </div>
                <div className='df-row-3'>
                    {/* <ChartForEarning data={Monthly_data} /> */}
                    {/* <SalesHistoryChart /> */}
                    <ChartAnalytics />
                </div>

                <div className='table-for-user-management'>
                    <table className='data-table'>
                        <thead>
                            <tr>
                                <td>Sl. No.</td>
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
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>
                            <TransactionRows />
                            <hr className='space-between-rows'></hr>


                        </tbody>
                    </table>
                    <div className='user-management-table-contorls'>
                        <div>
                            <div>1</div>
                            <div>of Pages</div>
                            <div>
                                <svg width="7" height="13" viewBox="0 0 7 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.47122 0C6.60253 0.0659459 6.72572 0.147667 6.83811 0.243433C6.9347 0.353091 6.98972 0.494467 6.99336 0.64203C6.99699 0.789592 6.94895 0.933619 6.85788 1.04812C6.81732 1.10085 6.77318 1.15057 6.72571 1.19688L1.65911 6.3766C1.62042 6.41609 1.57963 6.45333 1.53687 6.48817L1.64588 6.6065L6.74556 11.82C6.86335 11.9189 6.94412 12.0564 6.97423 12.2091C7.00435 12.3619 6.98195 12.5207 6.91081 12.6585C6.8668 12.7414 6.80578 12.8134 6.73193 12.8698C6.65807 12.9262 6.57315 12.9656 6.483 12.9852C6.39286 13.0048 6.2996 13.0042 6.20971 12.9834C6.11982 12.9626 6.03538 12.9221 5.96224 12.8648C5.91369 12.8246 5.86738 12.7817 5.82345 12.7363L0.247871 7.03589C0.167644 6.97273 0.102721 6.89157 0.0580107 6.79866C0.0133001 6.70574 -0.0100098 6.60356 -0.0100098 6.5C-0.0100098 6.39644 0.0133001 6.29426 0.0580107 6.20135C0.102721 6.10843 0.167644 6.02727 0.247871 5.96411C2.07223 4.09329 3.89772 2.22584 5.72429 0.361771C5.85707 0.200345 6.02761 0.0758949 6.22004 0H6.47122Z" fill="white" />
                                </svg>
                            </div>
                            <div>
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