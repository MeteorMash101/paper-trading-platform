/** Graph.js */
import React from "react";
import "./styles.css";
// USING [DEPRECIATED] MultilineChart for now (works better):
// import MultilineChart from "../MultilineGraph_Depreciated/views/MultilineChart/MultilineChart"
// OUR CODE:
import MultilineChart from "./views/MultilineChart/MultilineChart.js" 
import Legend from "./components/Legend";
import { useEffect, useState, Fragment, useContext } from 'react';
import { COLOR_CODES } from '../../../globals'
import StockAPIs from "../../../APIs/StocksAPIs";
import AccountsAPIs from "../../../APIs/AccountsAPIs";
import StocksOwnedContex from '../../../store/stocks-owned-context';
import UserContext from '../../../store/user-context';
import portfolio from "./portfolio.json"; // EDIT: temp. dummy data for loader

export default function Graph({ stocksSelected, onHover }) {
  const [isLoading, setIsLoading] = useState(false);
  const [stocksOwnedAllDateRanges, setStocksOwnedAllDateRanges] = useState([]);
  const [selectedDate, setSelectedDate] = useState(["5Y"]);
  const legendData = [{dateOpt: "1D"}, {dateOpt: "1W"}, {dateOpt: "1M"}, {dateOpt: "3M"}, {dateOpt: "6M"}, {dateOpt: "1Y"}, {dateOpt: "5Y"}];
  const userCtx = useContext(UserContext);
  const stocksOwnedCtx = useContext(StocksOwnedContex);

  console.log("selectedDate (date changed!)", selectedDate)

  // Strategy: fetch all date range data of every stock the user owns, and filter accordingly to what has been selected.
  // helper func: required format for graph
  const formatData = (colorId, currSymbol, dateRange, stockData) => {
    return {
      color: colorId,
      name: currSymbol.toUpperCase() + ": " + dateRange,
      items: stockData['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))}))
    }
  }

  useEffect(async() => {
    setIsLoading(true)
    const stocksOwnedAllDateRangesArray = []
		const listOfTickers = await AccountsAPIs.getStocksOwnedSymbols(userCtx.user_id);
    for (let i = 0; i < listOfTickers.length; i++) {
      const currSymbol = listOfTickers[i]
      const {
        stockOneDayFromServer,
        stockOneWeekFromServer,
        stockOneMonthFromServer,
        stockThreeMonthFromServer,
        stockSixMonthFromServer,
        stockOneYearFromServer,
        stockFiveYearFromServer
      } = await StockAPIs.getStockHistoricalByDateRanges(currSymbol)
      // rand. color ID for this stock.
      const colorId = "#" + Math.floor(Math.random()*16777215).toString(16);
      stocksOwnedAllDateRangesArray.push({
        symbol: currSymbol,
        // all date range data for this stock (complete & proper).
        oneDay: formatData(colorId, currSymbol, "1D", stockOneDayFromServer.data),
        oneWeek: formatData(colorId, currSymbol, "1W", stockOneWeekFromServer.data),
        oneMonth: formatData(colorId, currSymbol, "1M", stockOneMonthFromServer.data),
        threeMonth: formatData(colorId, currSymbol, "3M", stockThreeMonthFromServer.data),
        sixMonth: formatData(colorId, currSymbol, "6M", stockSixMonthFromServer.data),
        ytd: formatData(colorId, currSymbol, "1Y", stockOneYearFromServer.data),
        ytd5: formatData(colorId, currSymbol, "5Y", stockFiveYearFromServer.data),
      })
    }
    setStocksOwnedAllDateRanges(stocksOwnedAllDateRangesArray);
    setIsLoading(false)
  }, [stocksOwnedCtx.stocksOwned]);

  // EDIT: we don't need to be sending in this whole data to legendData, just the date values.

  const chartData = [];
  console.log("stocksOwnedAllDateRanges before chartData Proc:", stocksOwnedAllDateRanges)
  console.log("stocksSelected, before chartData Proc:", stocksSelected)

  if (stocksOwnedAllDateRanges.length > 0 && stocksSelected.length > 0) {
    let stocksSelectedToShow = []
    for (let i = 0; i < stocksOwnedAllDateRanges.length; i++) {
      console.log("looking at symbol:", (stocksOwnedAllDateRanges[i].symbol.toUpperCase()))
      if (stocksSelected.includes(stocksOwnedAllDateRanges[i].symbol.toUpperCase())) {
        console.log("MATCHED!")
        stocksSelectedToShow.push(stocksOwnedAllDateRanges[i])
      }
    }
    // let stocksSelectedToShow = stocksOwnedAllDateRanges.filter((stockData) => stocksSelected.includes(stockData.symbol.toLowerCase()))
    console.log("stocksSelectedToShow (we are going to show these!):", stocksSelectedToShow)
    // now add these stock's currently selected dateRanges...
    for (let i = 0; i < stocksSelectedToShow.length; i++) {
      let currStockToShow = stocksSelectedToShow[i]
      switch (selectedDate[0]) {
        case "1D":
          chartData.push(currStockToShow.oneDay)
          break
        case "1W":
          chartData.push(currStockToShow.oneWeek)
          break
        case "1M":
          chartData.push(currStockToShow.oneMonth)
          break
        case "3M":
          chartData.push(currStockToShow.threeMonth)
          break
        case "6M":
          chartData.push(currStockToShow.sixMonth)
          break
        case "1Y":
          chartData.push(currStockToShow.ytd)
          break
        case "5Y":
          chartData.push(currStockToShow.ytd5)
          break
        default:
          chartData.push(currStockToShow.oneDay)
          break
      }
    }
  } else { // default required for chartData, or else empty data sent to MultilineChart.js
    chartData.push(
      {
        name: "1D",
        items: portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) }))
      }
    )
  }

  console.log("chartData after RENDER + PROCESSING:", chartData)
  
  // Trend color: for showing color code.
  // const trendIsPositive = chartData[0].items[0].open < chartData[0].items[chartData[0].items.length - 1].open;
  // const trendColor = trendIsPositive ? COLOR_CODES.POSITIVE : COLOR_CODES.NEGATIVE;

  const [showGridlines, setShowGridlines] = useState(false);
  const [showAxis, setShowAxis] = useState(false);
  const [showShade, setShowShade] = useState(true);
  const [showColorCode, setShowColorCode] = useState(false);

  const onChangeDateRangeHandler = (name) => {
    setSelectedDate([name]);
  };

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

  const onChangeShowColorCode = (e) => {
    if (e.target.checked) {
      setShowColorCode(true)
    } else {
      setShowColorCode(false)
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
              // onHover={onHover} 
              // showGridlines={showGridlines} 
              // showAxis={showAxis}
              // showShade={showShade}
            />
          </div>
          <Legend
            legendData={legendData}
            currDateRange={selectedDate[0]}
            onChangeDateRange={onChangeDateRangeHandler}
            onChangeShowGridlines={onChangeShowGridlinesHandler}
            onChangeShowAxis={onChangeShowAxisHandler}
            onChangeShowShade={onChangeShowShadeHandler}
            onChangeShowColorCode={onChangeShowColorCode}
          />
        </Fragment>
      }
    </Fragment>
  );
}