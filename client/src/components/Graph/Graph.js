/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import portfolio from "./portfolio.json";
import "./styles.css";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function Graph({stockURL}) {

  const [stock, setStock] = useState("");
  var [date, setDate] = useState(new Date());
  // const [stock, setStock] = useState({ ytd: "", onemonth: "" });

  useEffect(() => {
    const fetchStock = async () => {

      const stockFromServer = await axios.get(stockURL);

      // Calculating the day a month ago
      var d = new Date();
      var m = d.getMonth();
      d.setMonth(d.getMonth() - 1);

      // If still in same month, set date to last day of 
      // previous month
      if (d.getMonth() == m) d.setDate(0);
      d.setHours(0, 0, 0, 0);

        
      const stockOneMonthFromServer = await axios.get(stockURL,{ params : {
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

    const stockThreeMonthFromServer = await axios.get(stockURL,{ params : {
      "start_date": dThree.toLocaleDateString(),
      "version": "new"
    }
  });

  // Calculating the date six months ago
  var dSix = new Date();
  dSix.setMonth(dSix.getMonth() - 5);
  dSix.setHours(0, 0, 0, 0);

  const stockSixMonthFromServer = await axios.get(stockURL,{ params : {
    "start_date": dSix.toLocaleDateString(),
    "version": "new"
  }
});
        // const jsonResponse = await stockFromServer.json();
        // console.log("[DEBUG]: history stock received from db:", stockFromServer.data)
        // setStock(stockFromServer.data)
        setStock({ ytd: stockFromServer.data, onemonth: stockOneMonthFromServer.data,
        threemonth: stockThreeMonthFromServer.data, sixmonth:stockSixMonthFromServer.data });

    }
    fetchStock()
  }, []);
  
  const ytdData = {
    name: "YTD",
    color: "grey",
    // items: stock != "" ? stock['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
    //   portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
    items: stock != "" ? stock.ytd['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };


  const oneMonthData = {
    name: "One month",
    color: "#B6D0E2",
    // items: stock != "" ? stock['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })).slice(0,30) :
    // portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
    items: stock != "" ? stock.onemonth['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
    portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const threeMonthsData = {
    name: "Three months",
    color: "#CCCCFF",
    // items: stock != "" ? stock.ytd['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })).slice(0,90) :
    // portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
    items: stock != "" ? stock.threemonth['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
    portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const sixMonthsData = {
    name: "Six months",
    color: "#89CFF0",
    // items: stock != "" ? stock.ytd['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })).slice(0,180) :
    // portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
    items: stock != "" ? stock.sixmonth['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })) :
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