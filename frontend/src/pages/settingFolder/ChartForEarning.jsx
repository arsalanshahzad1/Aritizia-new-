import { ethers } from 'ethers';
import React from 'react'
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
function ChartForEarning({data, chartLabel}) {
    const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed
    const gradientColor = "#2438CB"
    return (
        <div>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 400}>
                <AreaChart data={data}>
                    <YAxis label={{ value: 'Volume ETH', angle: -90, position: 'insideLeft' }} />

                    <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor={gradientColor}
                                stopOpacity={1}
                            />
                            <stop offset="95%" stopColor="#ffffff" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <Area
                        dataKey="value"
                        stroke={gradientColor}
                        strokeWidth={2}
                        fill="url(#colorUv)"
                    />
                    <XAxis
                        dataKey="data"
                        axisLine={false}
                        tickLine={false}
                        tickCount={12}
                        type="category"
                        tick={{
                            fill: "#404040",
                            fontWeight: "500",
                            fontSize: "0.8rem",
                        }}
                    />
                    <YAxis
                        dataKey="value"
                        axisLine={false}
                        tickLine={false}
                        tickCount={9}
                        tickFormatter={(number) => `$ ${number}`}
                        tick={{
                            fill: "#404040",
                            fontWeight: "500",
                            fontSize: "0.8rem",
                        }}
                    />

                    <Tooltip
                        content={<CustomTooltip/>}
                        cursor={{
                            stroke: "#e11f1c",
                            radius: 10,
                            strokeDasharray: 5,
                        }}

                    />
                    <Tooltip />

                    <CartesianGrid opacity={0.5} vertical={false} />

                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
    function CustomTooltip({ active, payload, label }) {
        if (active) {
            return (
                <div className='Custom-tool-tip'>
                    <p>
                        {/* {label} */}
                       {chartLabel ? chartLabel: "Total Subscribers"} : {payload[0]?.payload?.value?.toString() ? Number(ethers.utils.formatEther(payload[0]?.payload?.value?.toString())).toFixed(5) : "0"}
                    </p>
                </div>
            )
        }
        return null;
    }
}

export default ChartForEarning