/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import portfolio from "./portfolio.json"; // EDIT: temp. dummy data for loader
import "./styles.css";
import { useEffect, useState, Fragment } from 'react';
import StockAPIs from "../../../APIs/StocksAPIs";

export default function Graph({ symbol, onHover, onGraphMode}) {
  const [stock, setStock] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async() => {
    setIsLoading(true)
    const {
      stockOneDayFromServer,
      stockOneWeekFromServer,
      stockOneMonthFromServer,
      stockThreeMonthFromServer,
      stockSixMonthFromServer,
      stockOneYearFromServer,
      stockFiveYearFromServer
    } = await StockAPIs.getStockHistoricalByDateRanges(symbol)
    setStock({ 
      oneDay: stockOneDayFromServer.data,
      oneWeek: stockOneWeekFromServer.data,
      oneMonth: stockOneMonthFromServer.data,
      threeMonth: stockThreeMonthFromServer.data, 
      sixMonth: stockSixMonthFromServer.data,
      ytd: stockOneYearFromServer.data, 
      ytd5: stockFiveYearFromServer.data
    });
    setIsLoading(false)
  }, []);

  // EDIT: possibly add trend-color here for each range? 
  const oneDayData = {
    name: "1D",
    items: stock != "" ? 
      stock.oneDay['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const oneWeekData = {
    name: "1W",
    items: stock != "" ? 
      stock.oneWeek['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const oneMonthData = {
    name: "1M",
    items: stock != "" ? 
      stock.oneMonth['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };
  
  const threeMonthsData = {
    name: "3M",
    items: stock != "" ? 
      stock.threeMonth['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const sixMonthsData = {
    name: "6M",
    items: stock != "" ? 
      stock.sixMonth['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const oneYearData = {
    name: "1Y",
    items: stock != "" ? 
      stock.ytd['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const fiveYearData = {
    name: "5Y",
    items: stock != "" ? 
      stock.ytd5['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
  };

  const [selectedItems, setSelectedItems] = React.useState(["1D"]);
  const legendData = [oneDayData, oneWeekData, oneMonthData, threeMonthsData, sixMonthsData, oneYearData, fiveYearData];
  const chartData = [
    ...[oneDayData, oneWeekData, oneMonthData, threeMonthsData, sixMonthsData, oneYearData, fiveYearData].filter((d) => selectedItems.includes(d.name))
  ];

  const onChangeDateRangeHandler = (name) => {
    setSelectedItems([name]);
  };

  const [showGridlines, setShowGridlines] = useState(false);
  const [showAxis, setShowAxis] = useState(false);
  const [showShade, setShowShade] = useState(true);

  const onChangeShowGridlinesHandler = (e) => {
    if (e.target.checked) {
      setShowGridlines(true)
    } else {
      setShowGridlines(false)
    }
  }

  const onChangeShowAxisHandler = (e) => {
    if (e.target.checked) {
      setShowAxis(true)
    } else {
      setShowAxis(false)
    }
  }

  const onChangeShowShadeHandler = (e) => {
    if (e.target.checked) {
      setShowShade(true)
    } else {
      setShowShade(false)
    }
  }

  return (
    <Fragment>
      {isLoading && <div class="loader"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
      {!isLoading &&
        <Fragment>
          <div className="Graph">
            <MultilineChart 
              data={chartData} 
              onHover={onHover} 
              showGridlines={showGridlines} 
              showAxis={showAxis}
              showShade={showShade}
            />
          </div>
          <Legend
            legendData={legendData}
            currDateRange={selectedItems[0]}
            onChangeDateRange={onChangeDateRangeHandler}
            onChangeShowGridlines={onChangeShowGridlinesHandler}
            onChangeShowAxis={onChangeShowAxisHandler}
            onChangeShowShade={onChangeShowShadeHandler}
            onGraphMode={onGraphMode}
          />
        </Fragment>
      }
    </Fragment>
  );
}