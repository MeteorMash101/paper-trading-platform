import React from "react";

import {
    LineChart,
    ResponsiveContainer,
    Legend, Tooltip,
    Line,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

// SAMPLE DATA

const PerformanceGraph = () => { 


    const pdata = [
        {
            name: 'MongoDb',
            market: 11,
            user: 120
        },
        {
            name: 'Javascript',
            market: 15,
            user: 12
        },
        {
            name: 'PHP',
            market: 5,
            user: 10
        },
        {
            name: 'Java',
            market: 10,
            user: 5
        },
        {
            name: 'C#',
            market: 9,
            user: 4
        },
        {
            name: 'C++',
            market: 10,
            user: 8
        },
    ];


  return (
    <div>

        <h2> PERFORMANCE GRAPH </h2>

        <ResponsiveContainer width="100%" aspect={3}>
            <LineChart data={pdata}>
                <CartesianGrid />
                <XAxis 
                    interval={'preserveStartEnd'} />
                <YAxis></YAxis>
                <Legend />
                <Tooltip />
                <Line dataKey="market"
                    stroke="grey" activeDot={{ r: 8 }} />
                <Line dataKey="user"
                    stroke="blue" activeDot={{ r: 8 }} />
                </LineChart>
        </ResponsiveContainer>      

    </div>
  );
};

export default PerformanceGraph;