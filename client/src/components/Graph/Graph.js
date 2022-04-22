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

  useEffect(() => {
    const fetchStock = async () => {
        const stockFromServer = await axios.get(stockURL)
        // const jsonResponse = await stockFromServer.json();
        console.log("[DEBUG]: history stock received from db:", stockFromServer.data)
        setStock(stockFromServer.data)
    }
    fetchStock()
  }, [])
  
  const ytdData = {
    name: "YTD",
    color: "grey",
    items: stock != "" ? stock['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };


  const oneMonthData = {
    name: "One month",
    color: "#d53e4f",
    items: stock != "" ? stock['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })).slice(0,30) :
    portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const threeMonthsData = {
    name: "Three months",
    color: "#5e4fa2",
    items: stock != "" ? stock['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })).slice(0,90) :
    portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const sixMonthsData = {
    name: "Six months",
    color: "aqua",
    items: stock != "" ? stock['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })).slice(0,180) :
    portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState(["YTD"]);
  const legendData = [ytdData, oneMonthData, threeMonthsData, sixMonthsData];
  let chartData = [
    ...[oneMonthData, threeMonthsData, sixMonthsData, ytdData].filter((d) => selectedItems.includes(d.name))
  ];

  const onChangeSelection = (name) => {
    setSelectedItems([name]);
  };

  return (
    <div className="Graph">
      <Legend
        data={legendData}
        selectedItems={selectedItems}
        onChange={onChangeSelection}
        // onClick={onChangeSelection}
      />
      <MultilineChart data={chartData} />
      <h4>{selectedItems}</h4>
    </div>
  );
}