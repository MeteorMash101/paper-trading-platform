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
import { useEffect, useState, Fragment, useContext } from 'react';
import axios from 'axios';
import UserContext from '../../../store/user-context';


export default function Graph({stockURL}) {

  const userCtx = useContext(UserContext);

  const [graphStocks, setGraphStocks] = useState([]);
  const [stockFromServer, setStockFromServer] = useState([]);

  const [stock, setStock] = useState("");
  const [stockData, setStockData] = useState({date: '', value: 0, volume: '0'});

  useEffect(() => {
    const fetchStock = async () => {
      console.log(userCtx);

      // Getting the stocks that the user owns
       const dataFetched = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
				params: {
					info: "stock_list_detailed",
          token: localStorage.getItem("access_token")
				}
			});


      console.log("Inside my stocks");
      console.log("FETCHING USER STOCK SYMBOLS W/ URL:", dataFetched);

      Object.keys(dataFetched.data.stock_list).map( async (keyName, i) => {
        
        // Get stocks from each individual symbol
        stockFromServer.push(await axios.get(`http://127.0.0.1:8000/stocks/historical/${keyName}`, {
          // params : {
          //   "dateRange": "1M"
          // }
        }));

        console.log("stock from server here: ", stockFromServer)

        // Push each as an object into graphStocks

      });
      
      console.log("This is actually chart data: ", chartData)

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
    }
    fetchStock()



}, [])
  
  const portfolioData = {
    name: "Portfolio",
    color: "grey",
    items: portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
    
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

  const data = {
    name: "data",
    color: "#5e4fa2",
    items: stock != "" ? 
      stock.sixMonth['historical_data'].map((d) => ({  ...d,date: new Date(d.date)})) :
      portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
  };


 const data1 = {
    name: "data1",
    color: "#d53e4f",
    items: stock != "" ? 
      stock.oneMonth['historical_data'].map((d) => ({  ...d,date: new Date(d.date)})) :
      portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState([]);

  const chartData = [
    ...[data, data1]
  ];

  stockFromServer.map((s) => {
    graphStocks.push({
      name: s.name, 
      color: '#B0E0E6',
      items: stock.data ? s.data['historical_data']
              .map((d) => ({ ...d, date: new Date(d.date) })) :
              portfolio.map((d) => ({ ...d, date: new Date(d.date) }))
    });

  })

  console.log(stockFromServer)

  console.log("this is chart data: ", stockFromServer);

  const onChangeSelection = (name) => {
    const newSelectedItems = selectedItems.includes(name)
      ? selectedItems.filter((item) => item !== name)
      : [...selectedItems, name];
    setSelectedItems(newSelectedItems);
  };

  return (

    <Fragment>
      <div>
      </div>
      <div className="Graph">
        <MultilineChart data={chartData}/>
      </div>
      
    </Fragment>
  );
}