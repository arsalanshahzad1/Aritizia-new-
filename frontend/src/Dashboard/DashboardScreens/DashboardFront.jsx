import React, { useEffect, useState } from 'react'
import AdminHeader from '../../pages/landingpage/AdminHeader'
import ChartForEarning from '../../pages/settingFolder/ChartForEarning'
import SalesHistoryChart from './SalesHistoryChart';
import adminApis from "../../service/adminIndex";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import Header from '../../pages/landingpage/Header';
import Loader from '../../components/shared/Loader';

function DashboardFront({ search, setSearch }) {

    const [dashboardAnalytics, setDashboardAnalytics] = useState([]);
    const [userSubscription, setUserSubscription] = useState([]);
    const [current, SetCurrent] = useState("free_trail");
    const [graphData, setGraphData] = useState("Monthly")
    const [chartData, setChartData] = useState("Monthly")

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

    console.log(graphData, "graph data")

    console.log(current, "current state")

  const viewAnalyticDashboard = async () => {
    try {
      const response = await adminApis.viewAnalyticDashboard();
      if (response?.status) {
        setDashboardAnalytics(response?.data.data.dashboard_analytics);
        setUserSubscription(response?.data.data.user_subscription);
      } else {
        console.log("API request failed");
      }
      setLoader(false)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    viewAnalyticDashboard();
  }, []);

  useEffect(() => {
    console.log(userSubscription, "user Subscription");
  }, [dashboardAnalytics]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
    const Monthly = userSubscription?.[current]?.all_months?.map((month_data, index)=>{
        return {
            data: months[index],
            value: month_data,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        }
    })

    // console.log(monthly_data, "monthly data")

    // const Monthly_data = [
    //     {
    //         data: "Jan",
    //         value: 0,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Feb",
    //         value: 0.50,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Mar",
    //         value: 0.85,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Apr",
    //         value: 0.98,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "May",
    //         value: 0.45,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "June",
    //         value: 0.43,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "July",
    //         value: 0.41,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Aug",
    //         value: 0.52,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Sep",
    //         value: 0.54,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Oct",
    //         value: 0.85,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Nov",
    //         value: 0.48,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Dec",
    //         value: 0,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    // ];


    const Weekly = userSubscription?.[current]?.last_month_all_days?.map((weekly_data, index)=>{
        return {
            data: index,
            value: weekly_data,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        }
    })

    // const Weekly_data = [
    //     {
    //         data: "Jan",
    //         value: 5,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Feb",
    //         value: 2.50,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Mar",
    //         value: 9.85,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Apr",
    //         value: 2.98,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "May",
    //         value: 4.45,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "June",
    //         value: 6.43,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "July",
    //         value: 3.41,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Aug",
    //         value: 2.52,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Sep",
    //         value: 4.54,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Oct",
    //         value: 0.85,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Nov",
    //         value: 0.48,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Dec",
    //         value: 0,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    // ];
    const Daily = userSubscription?.[current]?.last_week_all_days?.map((daily_data, index)=>{
        return {
            data: index,
            value: daily_data,
            Average_price: "0.62 ETH",
            Num_sales: "1",
            Date: "May 07 at 5:00 PM"
        }
    })
    
    // const Daily_data = [
    //     {
    //         data: "Jan",
    //         value: 0,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Feb",
    //         value: 0,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Mar",
    //         value: 0,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Apr",
    //         value: 2,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "May",
    //         value: 3,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "June",
    //         value: 4,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "July",
    //         value: 5,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Aug",
    //         value: 6,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Sep",
    //         value: 5,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Oct",
    //         value: 4,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Nov",
    //         value: 3,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    //     {
    //         data: "Dec",
    //         value: 2,
    //         Average_price: "0.62 ETH",
    //         Num_sales: "1",
    //         Date: "May 07 at 5:00 PM"
    //     },
    // ];

    const [loader, setLoader] = useState(true)
    return (
        <div className='Dashboard-front'>
            {/* <Header
                search={search}
                setSearch={setSearch}
            /> */}
            {loader && <Loader/>}
            <AdminHeader
            search={search}
            setSearch={setSearch}
            />
            <div className='position-absolute-top'>
                <div className='dashboard-front-section-1'>
                    <div className='dashboard-card'>
                        <div>Total Users</div>
                        <div>
                            {dashboardAnalytics?.user?.total}
                        </div>
                        <div>
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.70711 0.292892C8.31658 -0.0976315 7.68342 -0.0976314 7.29289 0.292892L0.928932 6.65685C0.538407 7.04738 0.538407 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292892ZM9 18L9 1L7 1L7 18L9 18Z" fill="#2636D9" />
                            </svg>
                            {dashboardAnalytics?.user?.percentage}
                            <span>
                                vs previous month
                            </span>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <div>Total Sale</div>
                        <div>
                            {dashboardAnalytics?.sale?.total}
                        </div>
                        <div>
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.70711 0.292892C8.31658 -0.0976315 7.68342 -0.0976314 7.29289 0.292892L0.928932 6.65685C0.538407 7.04738 0.538407 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292892ZM9 18L9 1L7 1L7 18L9 18Z" fill="#2636D9" />
                            </svg>
                            {dashboardAnalytics?.sale?.percentage}
                            <span>
                                vs previous month
                            </span>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <div>Total NFT</div>
                        <div>
                            {dashboardAnalytics?.nft?.total}
                        </div>
                        <div className='pink'>
                            <svg width="14" height="16" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.29289 17.7071C7.68342 18.0976 8.31658 18.0976 8.70711 17.7071L15.0711 11.3431C15.4616 10.9526 15.4616 10.3195 15.0711 9.92893C14.6805 9.53841 14.0474 9.53841 13.6569 9.92893L8 15.5858L2.34315 9.92893C1.95262 9.53841 1.31946 9.53841 0.928932 9.92893C0.538407 10.3195 0.538407 10.9526 0.928932 11.3431L7.29289 17.7071ZM7 -4.37114e-08L7 17L9 17L9 4.37114e-08L7 -4.37114e-08Z" fill="#B600D1" />
                            </svg>

                            {dashboardAnalytics?.nft?.percentage}
                            <span>
                                vs previous month
                            </span>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <div>New Signup</div>
                        <div>
                        {dashboardAnalytics?.signup?.total}
                        </div>
                        <div>
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.70711 0.292892C8.31658 -0.0976315 7.68342 -0.0976314 7.29289 0.292892L0.928932 6.65685C0.538407 7.04738 0.538407 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292892ZM9 18L9 1L7 1L7 18L9 18Z" fill="#2636D9" />
                            </svg>
                            {dashboardAnalytics?.signup?.percentage}
                            <span>
                                vs previous month
                            </span>
                        </div>
                    </div>
                    <div className='dashboard-card'>
                        <div>Website Visit</div>
                        <div>
                        {dashboardAnalytics?.visit?.total}
                        </div>
                        <div>
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.70711 0.292892C8.31658 -0.0976315 7.68342 -0.0976314 7.29289 0.292892L0.928932 6.65685C0.538407 7.04738 0.538407 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292892ZM9 18L9 1L7 1L7 18L9 18Z" fill="#2636D9" />
                            </svg>
                            {dashboardAnalytics?.visit?.percentage}
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
                            <div className={`${current == 'free_trail' ? 'active' : ''}`} onClick={()=> SetCurrent("free_trail")}>Free Trial</div>
                            <div className={`${current == 'gold' ? 'active' : ''}`} onClick={()=> SetCurrent("gold")}>Gold</div>
                            <div className={`${current == 'platinum' ? 'active' : ''}`} onClick={()=> SetCurrent("platinum")}>Platinum</div>
                            <div className={`${current == 'diamond' ? 'active' : ''}`} onClick={()=> SetCurrent("diamond")}>Daimond</div>
                        </div>
                        <div>
                            <div className='dashboard-drop-down user-sub-dd'>
                                <Dropdown
                                    options={userSubscriptionyptoOptions}
                                    onChange={(e) => { setGraphData(e.label)}}
                                    value={defaultUserSubscription.label}
                                />

                            </div>
                        </div>
                    </div>
                </div>
                <div className='df-row-3'>
                    <ChartForEarning data={graphData && graphData==="Monthly"? Monthly: graphData && graphData =="Weekly"?Weekly: Daily} />
                </div>
                <br /><br /><br /><br /> <br /> <br />
                <div className='dashboard-front-section-2'>
                    <div className='dashboard-front-section-2-row-1'>
                        <div className='df-s2-r1-c1'>
                            <div>Sales History</div>
                        </div>
                        <div>
                        <div className='dashboard-drop-down'>
                                {/* Monthly */}
                                {/* <select 
                                    name="subscription" 
                                    className='dashboard-drop-down-subscription'
                                    onChange={(e)=>{setChartData(e.target.value)}} 
                                >
                                    <option value="Monthly_data">monthly</option>
                                    <option value="Weekly_data">weekly</option>
                                    <option value="Daily_data">daily</option>
                                </select> */}
                                 <Dropdown
                                    options={saleHistoryOptions}
                                    onChange={(e) => { console.log(e.label)}}
                                    value={defaultUserSubscription.label}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='df-row-3'>
                    {/* <ChartForEarning data={Monthly_data} /> */}
                    <SalesHistoryChart chartData={chartData}/>
                </div>

            </div>
        </div>
    )
}

export default DashboardFront