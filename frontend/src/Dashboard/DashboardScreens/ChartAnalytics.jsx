import React from 'react';
import ReactApexChart from 'react-apexcharts';

const ChartAnalytics = ({chatData , option}) => {
  // console.log(chatData , 'data');
  const series = [
    {
      name: 'series1',
      data: chatData,
    }
  ];

  const options = {
    chart: {
      height: 350,
      type: 'area',
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      colors: ['#2636D9'],
    },

     
      labels: option,

    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm',
      },
    },
  };

  return (
    <div id="chart">
      <ReactApexChart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default ChartAnalytics;