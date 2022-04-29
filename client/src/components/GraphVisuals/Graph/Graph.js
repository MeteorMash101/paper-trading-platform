/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import portfolio from "./portfolio.json";
import "./styles.css";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Graph({stockURL}) {
  const [stock, setStock] = useState("");
  var [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchStock = async () => {
      // Below will be YTD
      const stockFromServer = await axios.get(stockURL);
      // Calculating the day a month ago
      var d = new Date();
      var m = d.getMonth();
      d.setMonth(d.getMonth() - 1);
      // If still in same month, set date to last day of 
      // previous month
      if (d.getMonth() == m) d.setDate(0);
      d.setHours(0, 0, 0, 0);
      const stockOneMonthFromServer = await axios.get(stockURL, {
        params : {
          // "start_date":"04/01/2017",
          "start_date": d.toLocaleDateString(),
          // "minutes":"True",
          "version": "new"
        }
      });
      // Calculating the date three months ago
      var dThree = new Date();
      dThree.setMonth(dThree.getMonth() - 2);
      dThree.setHours(0, 0, 0, 0);
      const stockThreeMonthFromServer = await axios.get(stockURL, { 
        params : {
          "start_date": dThree.toLocaleDateString(),
          "version": "new"
        }
      });
      // Calculating the date six months ago
      var dSix = new Date();
      dSix.setMonth(dSix.getMonth() - 5);
      dSix.setHours(0, 0, 0, 0);
      const stockSixMonthFromServer = await axios.get(stockURL, {
        params : {
          "start_date": dSix.toLocaleDateString(),
          "version": "new"
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
  
  const oneMonthData = {
    name: "One month",
    color: "#B6D0E2",
    items: stock != "" ? 
      stock.oneMonth['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const threeMonthsData = {
    name: "Three months",
    color: "#CCCCFF",
    items: stock != "" ? 
      stock.threeMonth['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const sixMonthsData = {
    name: "Six months",
    color: "#89CFF0",
    items: stock != "" ? 
      stock.sixMonth['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const ytdData = {
    name: "YTD",
    color: "grey",
    items: stock != "" ? 
      stock.ytd['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState(["YTD"]);
  const legendData = [ytdData, oneMonthData, threeMonthsData, sixMonthsData];
  const chartData = [
    ...[oneMonthData, threeMonthsData, sixMonthsData, ytdData].filter((d) => selectedItems.includes(d.name))
  ];

  const onChangeSelection = (name) => {
    setSelectedItems([name]);
  };

  console.log("[GRAPH.JS]: legendData: ", legendData)
  console.log("[GRAPH.JS]: selectedItems: ", selectedItems)
  console.log("[GRAPH.JS]: chartData: ", chartData)


  return (
    <div className="Graph">
      <MultilineChart data={chartData}/>
      <h4>{selectedItems}</h4>
      <Legend
        legendData={legendData}
        selectedItems={selectedItems}
        onChange={onChangeSelection}
        // onClick={onChangeSelection}
      />
    </div>
  );
}