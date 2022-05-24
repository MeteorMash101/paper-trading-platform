/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import schc from "./SCHC.json";
import vcit from "./VCIT.json";
import portfolio from "./portfolio.json";
import "./styles1.css";
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Graph1({stockURL}) {

  const [stock, setStock] = useState("");

  useEffect(() => {
    const fetchStock = async () => {
        const stockFromServer = await axios.get(stockURL)
        // const jsonResponse = await stockFromServer.json();
        console.log("[DEBUG]: pv received from db:", stockFromServer.data)
        setStock(stockFromServer.data)
    }
    fetchStock()
}, [])
  
  const portfolioData = {
    name: "Portfolio",
    color: "grey",
    items: stock != "" ? stock['pv'].map((d) => ({ ...d, date: new Date(d.date) })) :
      portfolio['pv'].map((d) => ({ ...d, date: new Date(d.date) }))
      // items:
      // portfolio['pv'].map((d) => ({ ...d, date: new Date(d.date) }))
  };
  const schcData = {
    name: "SCHC",
    color: "#d53e4f",
    items: schc.map((d) => ({ ...d, date: new Date(d.date) }))
  };
  const vcitData = {
    name: "VCIT",
    color: "#5e4fa2",
    items: vcit.map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState([]);
  const legendData = [portfolioData, schcData, vcitData];
  const chartData = [
    portfolioData,
    ...[schcData, vcitData].filter((d) => selectedItems.includes(d.name))
  ];
  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (
    <div>
      <Legend
        data={legendData}
        selectedItems={selectedItems}
        onChange={onChangeSelection}
      />
      <MultilineChart data={chartData} />
    </div>
  );
}
