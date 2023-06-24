import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './Dashboard.css';

const colors = ['#2636D9'];

const SalesHistoryChart = () => {
  const series = [{
    data: [10000, 50000, 15000, 50000, 60000, 10000, 60000, 15000, 30000, 60000, 10000, 55000]
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
