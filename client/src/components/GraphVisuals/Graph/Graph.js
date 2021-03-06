/** Graph.js */
import React from "react";
import MultilineChart from "./views/MultilineChart";
import Legend from "./components/Legend";
import portfolio from "./portfolio.json"; // EDIT: temp. dummy data for loader
import "./stylesGraph.css";
import { useEffect, useState, Fragment } from 'react';
import StockAPIs from "../../../APIs/StocksAPIs";
import { COLOR_CODES } from '../../../globals'
import ShimmerGraph from '../../Alerts/ShimmerGraph';

export default function Graph({ symbol, onHover, onGraphMode="GRAPH" }) {
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
    console.log("FETCHED", stockOneDayFromServer.data)
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

  const oneDayData = {
    name: "1D",
    items: stock != "" ? 
      stock.oneDay['historical_data'].map((d) => ({ ...d, date: new Date(Date.parse(d.date + "T" + d.time))})) :
      portfolio['historical_data'].map((d) => ({ ...d, date: new Date(d.date) })),
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

  // EDIT: we don't need to be sending in this whole data to legendData, just the date values.
  const [selectedDate, setSelectedDate] = React.useState(["1D"]);
  const legendData = [{dateOpt: "1D"}, {dateOpt: "1W"}, {dateOpt: "1M"}, {dateOpt: "3M"}, {dateOpt: "6M"}, {dateOpt: "1Y"}, {dateOpt: "5Y"}];
  const chartData = [
    ...[oneDayData, oneWeekData, oneMonthData, threeMonthsData, sixMonthsData, oneYearData, fiveYearData].filter((d) => selectedDate.includes(d.name))
  ];
  
  // Trend color: for showing color code.
  const trendIsPositive = chartData[0].items[0].open < chartData[0].items[chartData[0].items.length - 1].open;
  const trendColor = trendIsPositive ? COLOR_CODES.POSITIVE : COLOR_CODES.NEGATIVE;

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
  console.log("[Graph.js] chartData after render/proc:", chartData[0])
  return (
    <Fragment>
      {isLoading && <ShimmerGraph height={400}/>}
      {!isLoading &&
        <Fragment>
          <div className="Graph">
            <MultilineChart 
              data={chartData} 
              onHover={onHover} 
              showGridlines={showGridlines} 
              showAxis={showAxis}
              showShade={showShade}
              trendColor={trendColor}
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
            onGraphMode={onGraphMode}
          />
        </Fragment>
      }
    </Fragment>
  );
}