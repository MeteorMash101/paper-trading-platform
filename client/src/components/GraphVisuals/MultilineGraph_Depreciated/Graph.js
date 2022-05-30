/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import portfolio from "./portfolio.json";
import "./styles.css";
import { useEffect, useState, Fragment, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../../store/user-context';

export default function Graph() {
  const userCtx = useContext(UserContext);
  const [stock, setStock] = useState("");

  useEffect(async() => {
    // Fetch user's PV graph (always displayed)
    // To test basic chart functionality
    const stockOneMonthFromServer = await axios.get('http://127.0.0.1:8000/stocks/historical/f', {
      // params : {
      //   "dateRange": "1M"
      // }
    });
    const stockThreeMonthFromServer = await axios.get('http://127.0.0.1:8000/stocks/historical/nly', { 
      // params : {
      //   "dateRange": "3M"
      // }
    });
    const stockSixMonthFromServer = await axios.get('http://127.0.0.1:8000/stocks/historical/aapl', {
      // params : {
      //   "dateRange": "3M"
      // }
    });
    setStock({ 
      oneMonth: stockOneMonthFromServer.data,
      threeMonth: stockThreeMonthFromServer.data, 
      sixMonth: stockSixMonthFromServer.data
    });
  }, []);

  const data0 = {
    name: "data0",
    color: '#B0E0E6',
    items: stock != "" ? 
      stock.sixMonth['historical_data'].map((d) => ({  ...d,date: new Date(d.date)})) :
      portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const data1 = {
    name: "data0",
    color: '#B0E0E6',
    items: stock != "" ? 
      stock.oneMonth['historical_data'].map((d) => ({  ...d,date: new Date(d.date)})) :
      portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const data2 = {
    name: "data0",
    color: '#B0E0E6',
    items: stock != "" ? 
      stock.threeMonth['historical_data'].map((d) => ({  ...d,date: new Date(d.date)})) :
      portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState([]);

  
  const chartData = [
    ...[data0, data1, data2]
  ];

  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (
    <Fragment>
      <div className="Graph">
        <MultilineChart data={chartData}/>
      </div>
    </Fragment>
  );
}