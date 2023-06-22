import React, { useState } from 'react'
import Chart from 'react-apexcharts';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Label
} from "recharts";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import ChartForEarning from './ChartForEarning';

// const data = [
//   { x: new Date('2023-01-01').getTime(), y1: 100, y2: 200 },
//   { x: new Date('2023-02-01').getTime(), y1: 200, y2: 150 },
//   { x: new Date('2023-03-01').getTime(), y1: 150, y2: 300 },
//   { x: new Date('2023-04-01').getTime(), y1: 300, y2: 250 },
//   { x: new Date('2023-05-01').getTime(), y1: 400, y2: 350 },
//   { x: new Date('2023-06-01').getTime(), y1: 250, y2: 400 },
// ];



// const [selectedInterval, setSelectedInterval] = useState('hourly');

//   const handleIntervalChange = (event) => {
//     setSelectedInterval(event.target.value);
//   };

//   const generateChartData = () => {
//     // Replace this with your own data generation logic based on the selectedInterval
//     // Example: fetch data from an API or manipulate existing data based on the selectedInterval
//     let data = [];

//     if (selectedInterval === 'hourly') {
//       // Generate hourly data
//       data = [
//         { x: new Date('2023-01-01T00:00:00'),  y1: 100, y2: 200 },
//         { x: new Date('2023-02-01T01:00:00'),  y1: 200, y2: 150 },
//         { x: new Date('2023-03-01T02:00:00'),  y1: 150, y2: 300 },
//         { x: new Date('2023-04-01T02:00:00'),  y1: 300, y2: 250 },
//         { x: new Date('2023-05-01T02:00:00'),  y1: 400, y2: 350 },
//         { x: new Date('2023-06-01T02:00:00'),  y1: 250, y2: 400 },
//         // ... hourly data points
//       ];
//     } else if (selectedInterval === 'weekly') {
//       // Generate weekly data
//       data = [
//         { x: new Date('2023-01-01T00:00:00'),  y1: 100, y2: 200 },
//         { x: new Date('2023-02-01T01:00:00'),  y1: 200, y2: 150 },
//         { x: new Date('2023-03-01T02:00:00'),  y1: 150, y2: 300 },
//         { x: new Date('2023-04-01T02:00:00'),  y1: 300, y2: 250 },
//         { x: new Date('2023-05-01T02:00:00'),  y1: 400, y2: 350 },
//         { x: new Date('2023-06-01T02:00:00'),  y1: 250, y2: 400 },
//         // ... weekly data points
//       ];
//     } else if (selectedInterval === 'monthly') {
//       // Generate monthly data
//       data = [
//         { x: new Date('2023-01-01T00:00:00'),  y1: 100, y2: 200 },
//         { x: new Date('2023-02-01T01:00:00'),  y1: 200, y2: 150 },
//         { x: new Date('2023-03-01T02:00:00'),  y1: 150, y2: 300 },
//         { x: new Date('2023-04-01T02:00:00'),  y1: 300, y2: 250 },
//         { x: new Date('2023-05-01T02:00:00'),  y1: 400, y2: 350 },
//         { x: new Date('2023-06-01T02:00:00'),  y1: 250, y2: 400 },
//         // ... monthly data points
//       ];
//     } else if (selectedInterval === 'yearly') {
//       // Generate yearly data
//       data = [
//         { x: new Date('2023-01-01T00:00:00'),  y1: 100, y2: 200 },
//         { x: new Date('2023-02-01T01:00:00'),  y1: 200, y2: 150 },
//         { x: new Date('2023-03-01T02:00:00'),  y1: 150, y2: 300 },
//         { x: new Date('2023-04-01T02:00:00'),  y1: 300, y2: 250 },
//         { x: new Date('2023-05-01T02:00:00'),  y1: 400, y2: 350 },
//         { x: new Date('2023-06-01T02:00:00'),  y1: 250, y2: 400 },
//         // ... yearly data points
//       ];
//     }

//     return data;
//   };


// const options = {
//   chart: {
//     stacked: false,
//     zoom: {
//       enabled: false
//     },
//     toolbar: {
//       show: false
//     }
//   },
//   xaxis: {
//     type: 'datetime'
//   },

//   yaxis: [
//     {
//       seriesName: 'Y1',
//       axisTicks: {
//         show: true
//       },
//       labels: {
//         show: true
//       },
//       title: {
//         text: "Volume ETH",
//         style: {
//           color: '#2636D9',
//         },
//       },

//     },
//     {
//       seriesName: 'Y2',
//       opposite: true,
//       axisTicks: {
//         show: true
//       },
//       labels: {
//         show: true
//       },
//       title: {
//         text: "Average Price ETH",
//         style: {
//           color: '#2636D9',
//         },
//       },
//     },


//   ],
//   annotations: {
//     yaxis: [
//       {
//         y: 0, // Position of the gradient start
//         borderColor: 'transparent',
//         fillColor: '#F0F0F0', // Color for the gradient background
//         opacity: 0.8, // Opacity of the gradient background
//       }
//     ]
//   },
//   colors: ['#2636D9', '#2636D9'],
//   stroke: {
//     width: 8,
//     curve: 'smooth'
//   },
//   markers: {
//     size: 0
//   },
//   legend: {
//     show: true,
//     position: 'top',
//     horizontalAlign: 'left',
//     offsetX: 40
//   },

// };

// // const series = [
// //   {
// //     name: 'Y1',
// //     type: 'line',
// //     data: data.map(item => ({ x: item.x, y: item.y1 })),
// //     yAxisIndex: 0
// //   },
// //   {
// //     name: 'Y2',
// //     type: 'line',
// //     data: data.map(item => ({ x: item.x, y: item.y1 })),
// //     yAxisIndex: 1
// //   },
// // ];

// const series = [
//   {
//     name: 'Data',
//     data: generateChartData(),
//   },
// ];

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
const Earnings = () => {
  const [status, setStatus] = useState({ value: 'Monthly', label: 'Monthly' });
  const handleStatus = (e) => {
    setStatus(e)

  }
  const statusOptions = [
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Daily', label: 'Daily' },
  ]

  return (
    <div className="col-lg-10 mx-auto">
      <div className='earning-box'>
        <div>
          <p>Your Balance</p>
          <h2>0.96 ETH</h2>
        </div>
        <div>
          <p>Total Sales Value</p>
          <h2>1.96 ETH</h2>
          <p>-5,6K USD</p>
        </div>
        <div>
          <p>No. of Sales</p>
          <h2>127</h2>
        </div>
      </div>
      <div className='Earning-Filter-Holder' >
        <div className='d-flex align-items-center'>
          <p className='Earning-filter-text'>

            Current Sales Trend
          </p>
        </div>
        <div className="search-filter">
          <div className='l-2'>
            <Dropdown options={statusOptions} onChange={(e) => { handleStatus(e) }} value={status.label} />
          </div>
        </div>

      </div>
      <div className="earning-map">
        <div style={{ position: 'relative', height: '400px', background: 'linear-gradient(to bottom, #ffffff, #F0F0F0)' }}>
          <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%' }}>
            {/* <Chart options={data.options} series={data.series} type="line" height={400} /> */}
            {
              status.value === "Monthly" ?
                <ChartForEarning data={Monthly_data} />
                :
                <div></div>
            }
            {
              status.value === "Weekly" ?
                <ChartForEarning data={Weekly_data} />
                :
                <div></div>
            }
            {
              status.value === "Daily" ?
                <ChartForEarning data={Daily_data} />
                :
                <div></div>
            }


          </div>
        </div>
      </div>
    </div>
  )

}

export default Earnings