/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import schc from "./SCHC.json";
import vcit from "./VCIT.json";
import portfolio from "./portfolio.json";
import "./styles1.css";
import { useEffect, useState, useContext } from 'react';
import AccountsAPIs from "../../../APIs/AccountsAPIs";
import UserContext from "../../../store/user-context";

export default function Graph1() {
  const userCtx = useContext(UserContext);
  const [stock, setStock] = useState("");
  useEffect(async() => {
    const dataFetched = await AccountsAPIs.getPortfolioValueHistoricalData(userCtx.user_id)
    setStock(dataFetched.data)
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
