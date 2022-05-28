/** Graph.js */
import React from "react";
import "./styles.css";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import { useEffect, useState, Fragment, useContext } from 'react';
import { COLOR_CODES } from '../../../globals'
import StockAPIs from "../../../APIs/StocksAPIs";
import StocksOwnedContex from '../../../store/stocks-owned-context';

export default function Graph({ stocksSelected, onHover }) {
  const [isLoading, setIsLoading] = useState(false);
  const [stocksToShow, setStocksToShow] = useState([]);
  const [dateRangeSelected, setDateRangeSelected] = useState("1D");
  const stocksOwnedCtx = useContext(StocksOwnedContex);

  // Strategy: show all the stocks users own, and filter accordingly to what is selected.
  const formatData = (dateRange, stockData) => { // required format
    return {
        name: dateRange,
        items: stockData['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))}))
    }
  }
  useEffect(async() => {
    setIsLoading(true)
    const stocksToShowArray = []
    for (let i = 0; i < stocksSelected.length; i++) {
      const currSymbol = stocksSelected[i]
      const {
        stockOneDayFromServer,
        stockOneWeekFromServer,
        stockOneMonthFromServer,
        stockThreeMonthFromServer,
        stockSixMonthFromServer,
        stockOneYearFromServer,
        stockFiveYearFromServer
      } = await StockAPIs.getStockHistoricalByDateRanges(currSymbol)
      stocksToShowArray.push({
        symbol: currSymbol,
        // date range datas (complete & proper).
        oneDay: formatData("1D", stockOneDayFromServer.data),
        oneWeek: formatData("1W", stockOneWeekFromServer.data),
        oneMonth: formatData("1M", stockOneMonthFromServer.data),
        threeMonth: formatData("3M", stockThreeMonthFromServer.data),
        sixMonth: formatData("6M", stockSixMonthFromServer.data),
        ytd: formatData("1Y", stockOneYearFromServer.data),
        ytd5: formatData("5Y", stockFiveYearFromServer.data),
      })
    }
    setStocksToShow(stocksToShowArray);
    setIsLoading(false)
  }, [stocksOwnedCtx.ownedStocks]);

  // EDIT: we don't need to be sending in this whole data to legendData, just the date values.
  const [selectedDate, setSelectedDate] = React.useState(["1D"]);
  const legendData = [{dateOpt: "1D"}, {dateOpt: "1W"}, {dateOpt: "1M"}, {dateOpt: "3M"}, {dateOpt: "6M"}, {dateOpt: "1Y"}, {dateOpt: "5Y"}];
  const chartData = [];
  if (stocksToShow.length > 0) {
    stocksToShowSelected = stocksToShow.filter((stockData) => stocksSelected.includes(stockData.symbol))
    // now add these stock's currently selected dateRanges...
    for (let i = 0; i < stocksToShowSelected.length; i++) {
      currStockToShow = stocksToShowSelected[i]
      switch (dateRangeSelected) {
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
  }
  
  // Trend color: for showing color code.
  // const trendIsPositive = chartData[0].items[0].open < chartData[0].items[chartData[0].items.length - 1].open;
  // const trendColor = trendIsPositive ? COLOR_CODES.POSITIVE : COLOR_CODES.NEGATIVE;

  const onChangeDateRangeHandler = (name) => {
    setSelectedDate([name]);
  };

  const [showGridlines, setShowGridlines] = useState(false);
  const [showAxis, setShowAxis] = useState(false);
  const [showShade, setShowShade] = useState(true);
  const [showColorCode, setShowColorCode] = useState(false);

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
              onHover={onHover} 
              showGridlines={showGridlines} 
              showAxis={showAxis}
              showShade={showShade}
              // trendColor={trendColor}
              showColorCode={showColorCode}
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