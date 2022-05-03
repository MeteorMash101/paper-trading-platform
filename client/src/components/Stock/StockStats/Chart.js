import React from "react";
import { VictoryBar, VictoryChart, VictoryAxis,
  VictoryTheme, VictoryStack, VictoryLabel } from 'victory';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Chart = ({stockURL}) => {
  const data2012 = [
    {quarter: "1Q2021", earnings: 13000},
    {quarter: "2Q2021", earnings: 16500},
    {quarter: "3Q2021", earnings: 14250},
    {quarter: "4Q2021", earnings: 19000}
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
    domainPadding={10}
    theme={VictoryTheme.material}
  >
    <VictoryAxis
      tickValues={["1Q2021", "2Q2021", "3Q2021", "4Q2021"]}
      tickFormat={["", "", "", ""]}
    />

<VictoryAxis crossAxis
    width={700}
    height={700}
    domain={[-1, 2]}
    theme={VictoryTheme.grayscale}
    offsetY={0}
    standalone={true}
  />
  <VictoryAxis dependentAxis 
    width={400}
    height={400}
    domain={[-1, 2]}
    tickFormat={(x) => (`$${x / 100000}k`)}
    offsetX={80}
    standalone={true}
  />

    <VictoryStack>
      <VictoryBar
        alignment="start"
        // data={data2012}
        data={stock['quarterly_earnings']}
        style={{ data: { fill: "#B3ECE8" }}}
        x="quarter"
        y="earnings"
      />
    </VictoryStack>
  </VictoryChart>
  )
};

export default Chart;