import React from 'react'
import Header from '../../pages/landingpage/Header'
import ChartForEarning from '../../pages/settingFolder/ChartForEarning'
import SalesHistoryChart from './SalesHistoryChart';


function DashboardFront({ search, setSearch }) {

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


                <div className='dashboard-front-section-1'>
                    <div className='dashboard-card'>
                        <div>Total Users</div>
                        <div>25K+</div>
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
                        <div>Total Sale</div>
                        <div>$25,658,263,12</div>
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
                        <div>Total NFT</div>
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
                    <div className='dashboard-card'>
                        <div>New Signup</div>
                        <div>250+</div>
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
                        <div>Website Visit</div>
                        <div>Website Visit</div>
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
                </div>
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
                    <SalesHistoryChart/>
                </div>

            </div>
        </div>
    )
}

export default DashboardFront