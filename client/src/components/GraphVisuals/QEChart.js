import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis,
  VictoryTooltip  } from 'victory';
import { useEffect, useState } from 'react';
import axios from 'axios';

const QEChart = ({stockURL}) => {
    const data = [
        {quarter: 1, earnings: 13000},
        {quarter: 2, earnings: 16500},
        {quarter: 3, earnings: 14250},
        {quarter: 4, earnings: 19000}
    ];

    const [stock, setStock] = useState("");

    useEffect(() => {
        const fetchStock = async () => {
            const stockFromServer = await axios.get(stockURL)
            console.log("[DEBUG]: EARNINGS received from db:", stockFromServer.data)
            setStock(stockFromServer.data)
        }
        fetchStock()
        }, [])

      return (
        <VictoryChart
          // domainPadding will add space to each side of VictoryBar to
          // prevent it from overlapping the axis
          domainPadding={50}

        >
          <VictoryAxis
            // tickValues specifies both the number of ticks and where
            // they are placed on the axis
            tickValues={["1Q2021", "2Q2021", "3Q2021", "4Q2021"]}
            tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]}
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(x) => (`$${x / 1000000000}B`)}
            alignment = "start"
            offsetX={70}
            
          />
          <VictoryBar
            // data={data}
            data={stock['quarterly_earnings']}
            alignment="start"
            barRatio={0.4}
            standalone={false}

            style={{
              data: { fill: "#c1f0f8" }
            }}
            x="date"
            y="earnings"
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      )
    };


export default QEChart;
  