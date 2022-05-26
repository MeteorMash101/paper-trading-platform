/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
// import MultilineLegend from "./components/MultilineLegend";
import Legend from "./components/Legend";
import schc from "./SCHC.json";
import vcit from "./VCIT.json";
import portfolio from "./portfolio.json";
import "./styles.css";
// import "multilinestyles.css";
import { useParams } from 'react-router-dom';
import { useEffect, useState, Fragment } from 'react';
import axios from 'axios';


export default function Graph({stockURL}) {

  const [array, setArray] = useState([]);
  const [stock, setStock] = useState("");
  const [stockData, setStockData] = useState({date: '', value: 0, volume: '0'});
  const rangeToLabel = { // EDIT: temp, just for label naming
    "One day" : "1D",
    "One month" : "1M",
    "Three months": "3M",
    "Six months": "6M",
    "YTD" : "YTD"
  }

  useEffect(() => {
    const fetchStock = async () => {
        // const stockFromServer = await axios.get(stockURL)
        // // const jsonResponse = await stockFromServer.json();
        // console.log("[DEBUG]: history stock received from db:", stockFromServer.data)
        // setStock(stockFromServer.data)

        // Below will be YTD
      const stockFromServer = await axios.get(stockURL, {
        // params : {
        //   "dateRange": "1Y"
        // }
      });
      const stockOneMonthFromServer = await axios.get('http://127.0.0.1:8000/stocks/historical/amzn', {
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
        //   "dateRange": "6M"
        // }
      });

    //   stockSixMonthFromServer.data.historical_data.map(item => {
    //     //   console.log("item", item)
    //     var sd = [item.date, item.value, item.open]
    //     array.push(sd)
    // })

    // Object.keys(stockSixMonthFromServer.data.historical_data).map(item => {
          
    //   stockData.push({date: new Date(item.date), value: item.value, volume: item.volume})
      
    // });

      setStock({ 
        oneMonth: stockOneMonthFromServer.data,
        threeMonth: stockThreeMonthFromServer.data, 
        sixMonth: stockSixMonthFromServer.data
      });
    }
    fetchStock()
}, [])
  
  const portfolioData = {
    name: "Portfolio",
    color: "grey",
    // items: stock != "" ? stock['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
    //   portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
    // items: stock != "" ? 
    //   stock.oneMonth['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
    //   portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
    items: portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
    
  };
  const schcData = {
    name: "SCHC",
    color: "#d53e4f",
    items: schc.map((d) => ({ ...d, date: new Date(d.date) }))
    // items: stock != "" ? 
    //   stock.threeMonth['historical_data'].map((d) => ({ ...d, date: Date.parse(d.date + "T" + d.time)})) :
    //   portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))

  };
  const vcitData = {
    name: "VCIT",
    color: "#5e4fa2",
    items: vcit.map((d) => ({ ...d, date: new Date(d.date) }))
    // items: stock != "" ? 
    //   stock.sixMonth['historical_data'].map((d) => ({ ...d, date: Date.parse(d.date + "T" + d.time)})) :
    //   portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const data = {
    name: "data",
    color: "#5e4fa2",
    // items: stock != "" ? 
    //   stock.sixMonth.map((d) => ({ ...d, date: new Date(d.date) })) :
    //   portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
    items: stock != "" ? 
      stock.sixMonth['historical_data'].map((d) => ({  ...d,date: new Date(d.date)})) :
      portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState([]);
  // const legendData = [portfolioData, schcData, vcitData];
  // const chartData = [
  //   portfolioData,
  //   ...[schcData, vcitData].filter((d) => selectedItems.includes(d.name))
  // ];
  // const chartData = [
  //   ...[portfolioData,schcData, vcitData]
  // ];
  const chartData = [
    ...[data]
  ];

  console.log("this is chart data: ", chartData);
  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (
    // <Fragment> 
    //   <div className="Graph">
    //     <MultilineLegend
    //       data={legendData}
    //       selectedItems={selectedItems}
    //       onChange={onChangeSelection}
    //     />
    //     <MultilineChart data={chartData} />
    //   </div>
    // </Fragment>

    <Fragment>
      <div>
        {/* <Legend
          data={legendData}
          selectedItems={selectedItems}
          onChange={onChangeSelection}
        /> */}
      </div>
      <div className="Graph">
        <MultilineChart data={chartData}/>
      </div>
      
    </Fragment>
  );
}