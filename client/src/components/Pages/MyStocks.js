import React from 'react'
// import Graph from '../GraphVisuals/Graph/Graph';
import MultilineGraph from '../GraphVisuals/MultilineGraph/MultilineGraph';
// import MultilineChart from "../GraphVisuals/Graph/views/MultilineChart";
// import MultilineChartOld from "../GraphVisuals/Graph/views/MultilineChart";
// import portfolio from "../GraphVisuals/Graph/portfolio.json";
import MultilineChart from "../GraphVisuals/MultilineGraph/views/MultilineChart";
import portfolio from "../GraphVisuals/MultilineGraph/portfolio.json";
import classes from './MyStocks.module.css';
import Header from '../Header/Header';
import Tabs from '../User/UserUtils/MyStockTabs';
import UserContext from '../../store/user-context';
import { Navigate } from 'react-router-dom';
import { Fragment, useContext, useEffect, useState, Component} from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
// import Plot from 'react-plotly.js';

const MyStocks = () => {
  const userCtx = useContext(UserContext);
  const [usersStocks, setUsersStocks] = useState();
  const [data, setData] = useState([]);
  const [stock, setStock] = useState([]);
  const [selectedItems, setSelectedItems] = React.useState([]);

  useEffect(() => {
    const fetchStock = async () => {
        // const stockFromServer = await axios.get(stockURL)
        // // const jsonResponse = await stockFromServer.json();
        // console.log("[DEBUG]: history stock received from db:", stockFromServer.data)
        // setStock(stockFromServer.data)

        // Below will be YTD
      const dataFetched = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
				params: {
					info: "stock_list_detailed"
				}
			})

      setUsersStocks(dataFetched);
      console.log("Inside my stocks");
      console.log("FETCHING USER STOCK SYMBOLSk W/ URL:", dataFetched);

      Object.keys(dataFetched.data.stock_list).map( async (keyName, i) => {
        // data.push(keyName);
        const stockFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${keyName}`, {
          params : {
            "dateRange": "1M"
          }
        });

        stock.push({name: keyName, 
          color: '#B0E0E6', 
          // items: stockFromServer.data['historical_data']!= "" ? stockFromServer.data['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})):
          // portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
          // items: stockFromServer.data['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))}))
          items: stockFromServer.data['historical_data'].length != 0 ? stockFromServer.data['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })):
          portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
        });

        console.log("for keyname:", keyName);
        console.log("stockfromserver.data: ",stockFromServer.data);

      });

      setData(stock);
      // console.log("Inside my stocks for the stock symbols");
      console.log("anjali -> my stock data:", stock);
      console.log("anjali -> my stock data but its the actual data:", data);

    }

    fetchStock()
}, []);

// const portfolioData = {
//   name: "Portfolio",
//   color: "grey",
//   items: portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
// };

// const legendData = [portfolioData, schcData, vcitData]; => if done right should be = data.
// const chartData = [
//   ...data.filter((d) => selectedItems.includes(d.name))
// ];
const chartData = [
  ...[stock]
];
console.log("anjali -> my data:", data);
console.log("anjali -> my chart data:", chartData);
const onChangeSelection = (name) => {
  const newSelectedItems = selectedItems.includes(name)
    ? selectedItems.filter((item) => item !== name)
    : [...selectedItems, name];
  setSelectedItems(newSelectedItems);
};


  return (
    <motion.div 
    initial= {{opacity:0, x:100}} 
    animate = {{opacity: 1, x:0}}
    exit = {{opacity: 0, x:-100}}
    transition={{ duration: 0.7}}>
    <Fragment>
    {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
      // Redirect to /login - User must be logged in to view ALL pages...
      <Navigate to="/login"/>
    }
    {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
      <div>
        <Header/>
        <div className={classes.container}>
          <div className={classes.graph}> 
            <MultilineGraph stockURL = {`http://127.0.0.1:8000/stocks/historical/fb`}/>
            {/* <MultilineChart data={chartData}/> */}
          </div>
          <div className={classes.table}> 
            <Tabs/>
          </div>
        </div>
      </div>
    }
    </Fragment>
    </motion.div>
  )

}

export default MyStocks