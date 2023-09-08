import React, {useState, useEffect} from 'react';
import ReactApexChart from 'react-apexcharts';
import './Dashboard.css';
import adminApis from "../../service/adminIndex";

const colors = ['#2636D9'];

const SalesHistoryChart = ({chartData}) => {

  const [transactionHistory, setTransactionHistory] = useState([]);

  const fetchTransectionHistory = async () => {
    try {
      const response = await adminApis?.viewAnalyticDashboard();
      if (response?.status) {
        setTransactionHistory(response?.data.data.transaction_history);
        // setUserSubscription(response?.data.data.user_subscription);
        
      } else {
        console.log("API request failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchTransectionHistory();
  }, []);

  useEffect(() => {
    console.log(transactionHistory.all_months, "user Transections");
  }, [transactionHistory]);

  console.log(chartData, "chart data")

  const series = [{
    data: chartData == "Monthly_data" ? transactionHistory?.all_months : chartData == "Weekly_data" ? transactionHistory?.last_month_all_days : transactionHistory?.last_week_all_days
  }];

  const options = {
    chart: {
      height: 350,
      type: 'bar',
      width: '100%',
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        }
      }
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '65%',
        distributed: true,
        dataLabels: {
          position: 'top' // Place data labels on top of bars
        }
      }
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return '$' + val;
      },
      style: {
        colors: colors,
        fontSize: '12px'
      }
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: chartData == "Monthly_data" ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] : chartData == "Weekly_data" ? transactionHistory?.last_month_all_days.map((e, index)=> index+1) : transactionHistory?.last_week_all_days.map((e, index)=> index+1),
      labels: {
        style: {
          colors: '#929292',
          fontSize: '14px',
          fontWeight: '600'
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return '$' + val;
        },
        style: {
          colors: '#929292',
          fontSize: '14px',
          fontWeight: '600'
        }
      }
    },
    toolbar: {
      show: false // Hide the download buttons
    }
  };

  return (
    <div id="chart" className="rounded-bars-chart">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default SalesHistoryChart;
