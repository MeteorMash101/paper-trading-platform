import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState, Fragment } from 'react';
import StockAPIs from '../../../APIs/StocksAPIs';
import axios from 'axios';
import React from "react";
// import Legend from "../Graph/components/Legend";
import Legend from "./Legend.js";
import ShowChartTwoToneIcon from '@mui/icons-material/ShowChartTwoTone';
import CandlestickChartTwoToneIcon from '@mui/icons-material/CandlestickChartTwoTone';

export default function ApexChart({symbol, onGraphMode}){
  const [array, setArray] = useState([]);
  const [series, setSeries] = useState([{data: []}]);

  const [arrayOneDay, setArrayOneDay] = useState([]);
  const [arrayOneWeek, setArrayOneWeek] = useState([]);
  const [arrayOneMonth, setArrayOneMonth] = useState([]);
  const [arrayThreeMonth, setArrayThreeMonth] = useState([]);
  const [arraySixMonth, setArraySixMonth] = useState([]);
  const [arrayOneYear, setArrayOneYear] = useState([]);
  const [arrayFiveYear, setArrayFivwYear] = useState([]);
  const [seriesOneDay, setSeriesOneDay] = useState([{name: "1D", data: []}]);
  const [seriesOneWeek, setSeriesOneWeek] = useState([{name: "1W", data: []}]);
  const [seriesOneMonth, setSeriesOneMonth] = useState([{name: "1M", data: []}]);
  const [seriesThreeMonth, setSeriesThreeMonth] = useState([{name: "3M", data: []}]);
  const [seriesSixMonth, setSeriesSixMonth] = useState([{name: "6M", data: []}]);
  const [seriesOneYear, setSeriesOneYear] = useState([{name: "1Y", data: []}]);
  const [seriesFiveYear, setSeriesFiveYear] = useState([{name: "5Y", data: []}]);

  // useEffect(async() => {
  //   const array = await StockAPIs.getStockHistoricalForCandleStick(symbol);
  //   console.log("array in candlestick:",array);
  //   setSeries([{data: array}]);
  // }, []);

  useEffect(() => {
    const fetchStock = async () => {    
        
      const stockFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`,{ params : {
        // "start_date":"02/15/2022",
        // "version": "new"
        "dateRange": "1M"
      }
    })

    stockFromServer.data.historical_data.map(item => {
            //   console.log("item", item)
            var sd = [item.date, item.open, item.high, item.low, item.close]
            array.push(sd)

        })

        setSeries([{name: "anju", data: array}]);
    
    console.log("[DEBUG]: history stock received from db:", array)
    // console.log("[DEBUG]: data stock received from db:", data)


    const stockOneDayFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`, {
      params : {
        "dateRange": "1D"
        // "start_date":"05/25/2020",
        // "version": "new"
      }
    });

    stockOneDayFromServer.data.historical_data.map(item => {
      //   console.log("item", item)
      item.date = new Date(Date.parse(item.date + "T" + item.time))
      var sdOneDay = [item.date, item.open, item.high, item.low, item.close]
      arrayOneDay.push(sdOneDay)
    })

  setSeriesOneDay([{name: "1D", data: arrayOneDay}]);


    // const stockOneWeekFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`, {
    //   params : {
    //     "dateRange": "1W"
    //     // "start_date":"05/15/2022",
    //     // "version": "new"
    //   }
    // });
    const stockOneWeekFromServer = await axios.get(`http://127.0.0.1:8000/stocks/candleHistorical/${symbol}`, {
      params : {
        "dateRange": "1W"
      }
    });

    //stocks/candleHistorical

    stockOneWeekFromServer.data.historical_data.map(item => {
      
      item.date = new Date(Date.parse(item.date))
      var sdOneWeek = [item.date, item.open, item.high, item.low, item.close]
      arrayOneWeek.push(sdOneWeek)

  })

  setSeriesOneWeek([{name: "1W", data: arrayOneWeek}]);

    // const stockOneMonthFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`, {
    //   params : {
    //     "dateRange": "1M"
    //     // "start_date":"04/25/2022",
    //     // "version": "new"
    //   }
    // });

    const stockOneMonthFromServer = await axios.get(`http://127.0.0.1:8000/stocks/candleHistorical/${symbol}`, {
      params : {
        "dateRange": "1M"
        // "start_date":"04/25/2022",
        // "version": "new"
      }
    });

    stockOneMonthFromServer.data.historical_data.map(item => {
      
      // item.date = new Date(Date.parse(item.date + "T" + item.time))
      // item.date = new Date(Date.parse(item.date))
      var sdOneMonth = [item.date, item.open, item.high, item.low, item.close]
      arrayOneMonth.push(sdOneMonth)

  })

  setSeriesOneMonth([{name: "1M", data: arrayOneMonth}]);

    const stockThreeMonthFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`, { 
      params : {
        "dateRange": "3M"
        // "start_date":"02/25/2022",
        // "version": "new"
      }
    });

    stockThreeMonthFromServer.data.historical_data.map(item => {
      
      var sdThreeMonth = [item.date, item.open, item.high, item.low, item.close]
      arrayThreeMonth.push(sdThreeMonth)

  })

  setSeriesThreeMonth([{name: "3M", data: arrayThreeMonth}]);

  const stockSixMonthFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`, { 
      params : {
        "dateRange": "6M"
        // "start_date":"02/25/2022",
        // "version": "new"
      }
    });

    stockSixMonthFromServer.data.historical_data.map(item => {
      
      var sdSixMonth = [item.date, item.open, item.high, item.low, item.close]
      arraySixMonth.push(sdSixMonth)

  })

  setSeriesSixMonth([{name: "6M", data: arraySixMonth}]);

  const stockOneYearFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`, { 
      params : {
        "dateRange": "1Y"
        // "start_date":"02/25/2022",
        // "version": "new"
      }
    });

    stockOneYearFromServer.data.historical_data.map(item => {
     
      var sdOneYear = [item.date, item.open, item.high, item.low, item.close]
      arrayOneYear.push(sdOneYear)

  })

  setSeriesOneYear([{name: "1Y", data: arrayOneYear}]);

  const stockFiveYearFromServer = await axios.get(`http://127.0.0.1:8000/stocks/historical/${symbol}`, { 
      params : {
        "dateRange": "5Y"
        // "start_date":"02/25/2022",
        // "version": "new"
      }
    });

    stockFiveYearFromServer.data.historical_data.map(item => {
     
      var sdFiveYear = [item.date, item.open, item.high, item.low, item.close]
      arrayFiveYear.push(sdFiveYear)

  })

  setSeriesFiveYear([{name: "5Y", data: arrayFiveYear}]);

}
fetchStock()
}, []);

    const [options, setOptions] = useState({
      chart: {
        type: 'candlestick',
        height: 350,
        // background: "#3e3e3e"
      },
      title: {
        text: 'CandleStick Chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime',
        // type: 'category',
        labels: {
          // style: {
          //     colors: "#99d1e7"
          // },
          // formatter: function(val) {
          //   return dayjs(val).format('MMM DD HH:mm')
          // },
          datetimeFormatter: {
            year: 'yyyy',
            month: 'MMMM',
            day: 'dd MMM',
            hour: 'HH:mm',
            // minute: 'm'
          },

          // format: 'dd MMM',
          // formatter: function (value) {
          //     return value;
          // }
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        },
        labels: {
          // style: {
          //     colors: "#99d1e7"
          // },
          formatter: function (value) {
            return value;
          }
        }
      },
      plotOptions: {
        candlestick: {
            // colors: {
            //     upward: '#A9A9A9',
            //     downward: '#99d1e7'
            // }
        },
    },
  });
  const [selectedItems, setSelectedItems] = React.useState(["1D"]);
  const legendData = [...seriesOneDay, ...seriesOneWeek, ...seriesOneMonth, ...seriesThreeMonth, ...seriesSixMonth
    , ...seriesOneYear, ...seriesFiveYear];
  const chartData = [
    ...[seriesOneDay, seriesOneWeek, seriesOneMonth, seriesThreeMonth, seriesSixMonth
      , seriesOneYear, seriesFiveYear].filter((d) => selectedItems.includes(d[0].name))
  ][0];

  console.log("Series one day : ", seriesOneDay)

  const onChangeDateRangeHandler = (name) => {
    setSelectedItems([name]);
  };
      return (
        <Fragment>
          <div id="chart">
            {/* <ReactApexChart options={options} series={series} type="candlestick" height={350} /> */}
            <ReactApexChart options={options} series={chartData} type="candlestick" height={350} />
          </div>
          {/* <button class="graphSwitch" name="GRAPH" onClick={onGraphMode}>Graph Mode</button> */}
          
          <Legend
            legendData={legendData}
            currDateRange={selectedItems[0]}
            onChangeDateRange={onChangeDateRangeHandler}
          />
          <button class="graphSwitch" name="GRAPH" onClick={onGraphMode}><ShowChartTwoToneIcon/></button>
          <button class="graphSwitch" name="CANDLESTICK" onClick={onGraphMode}><CandlestickChartTwoToneIcon/></button>

        </Fragment>

      );
    
  }