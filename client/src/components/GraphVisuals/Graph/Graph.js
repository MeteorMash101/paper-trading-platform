/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import portfolio from "./portfolio.json";
import "./styles.css";
import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';

export default function Graph({stockURL}) {
  const [stock, setStock] = useState("");
  const rangeToLabel = { // EDIT: temp, just for label naming
    "One day" : "1D",
    "One month" : "1M",
    "Three months": "3M",
    "Six months": "6M",
    "YTD" : "YTD"
  }
  useEffect(() => {
    const fetchStock = async () => {
      // Below will be YTD
      const stockFromServer = await axios.get(stockURL, {
        params : {
          "dateRange": "1Y"
        }
      });
      const stockOneMonthFromServer = await axios.get(stockURL, {
        params : {
          "dateRange": "1M"
        }
      });
      const stockThreeMonthFromServer = await axios.get(stockURL, { 
        params : {
          "dateRange": "3M"
        }
      });
      const stockSixMonthFromServer = await axios.get(stockURL, {
        params : {
          "dateRange": "6M"
        }
      });
      setStock({ 
        oneMonth: stockOneMonthFromServer.data,
        threeMonth: stockThreeMonthFromServer.data, 
        sixMonth: stockSixMonthFromServer.data,
        ytd: stockFromServer.data, 
      });
    }
  fetchStock()
  }, []);
  const entryID = 0
  const oneMonthData = {
    name: "One month",
    color: "#B6D0E2",
    items: stock != "" ? 
      stock.oneMonth['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const threeMonthsData = {
    name: "Three months",
    color: "#CCCCFF",
    items: stock != "" ? 
      stock.threeMonth['historical_data'].map((d) => ({ ...d, date: Date.parse(d.date + "T" + d.time)})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const sixMonthsData = {
    name: "Six months",
    color: "#89CFF0",
    items: stock != "" ? 
      stock.sixMonth['historical_data'].map((d) => ({ ...d, date: Date.parse(d.date + "T" + d.time)})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const ytdData = {
    name: "YTD",
    color: "grey",
    items: stock != "" ? 
      stock.ytd['historical_data'].map((d) => ({ ...d, date: Date.parse(d.date + "T" + d.time)})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState(["One month"]);
  const legendData = [oneMonthData, threeMonthsData, sixMonthsData, ytdData];
  const chartData = [
    ...[oneMonthData, threeMonthsData, sixMonthsData, ytdData].filter((d) => selectedItems.includes(d.name))
  ];

  const onChangeSelection = (name) => {
    setSelectedItems([name]);
  };
  // console.log("[GRAPH.JS]: selectedItems (date range items): ", selectedItems)
  // console.log("[GRAPH.JS]: legendData: ", legendData)
  console.log("[GRAPH.JS]: stock: ", stock);
  console.log("[GRAPH.JS]: chartData: ", chartData)

  return (
    <Fragment>
      <div className="Graph">
        <MultilineChart data={chartData}/>
      </div>
      <Legend
        legendData={legendData}
        selectedItems={selectedItems}
        currDateRange={selectedItems[0]}
        onChange={onChangeSelection}
        labelMap={rangeToLabel}
      />
    </Fragment>
  );
}