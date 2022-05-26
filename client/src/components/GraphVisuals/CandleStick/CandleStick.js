import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState, Fragment } from 'react';
import Legend from "../Graph/components/Legend";
// import MultilineLegend from "../Graph/components/MultilineLegend";
import axios from 'axios';
import React from "react";
// import Legend from "../Graph/components/Legend";

export default function ApexChart({stockURL, onGraphMode}){

  const [array, setArray] = useState([]);
  const [arrayOneDay, setArrayOneDay] = useState([]);
  const [arrayOneWeek, setArrayOneWeek] = useState([]);
  const [arrayOneMonth, setArrayOneMonth] = useState([]);
  const [arrayThreeMonth, setArrayThreeMonth] = useState([]);
  const [series, setSeries] = useState([{data: []}]);
  // const [seriesOneDay, setSeriesOneDay] = useState([{data: []}]);
  // const [seriesOneWeek, setSeriesOneWeek] = useState([{data: []}]);
  // const [seriesOneMonth, setSeriesOneMonth] = useState([{data: []}]);
  // const [seriesThreeMonth, setSeriesThreeMonth] = useState([{data: []}]);
  const [seriesOneDay, setSeriesOneDay] = useState([{data: []}]);
  const [seriesOneWeek, setSeriesOneWeek] = useState([{data: []}]);
  const [seriesOneMonth, setSeriesOneMonth] = useState([{data: []}]);
  const [seriesThreeMonth, setSeriesThreeMonth] = useState([{data: []}]);


    useEffect(() => {
        const fetchStock = async () => {    
            
          const stockFromServer = await axios.get(stockURL,{ params : {
            "start_date":"02/15/2022",
            "version": "new"
          }
        })

        stockFromServer.data.historical_data.map(item => {
                //   console.log("item", item)
                var sd = [item.date, item.open, item.high, item.low, item.close]
                array.push(sd)

            })

            setSeries([{data: array}]);
        
        console.log("[DEBUG]: history stock received from db:", array)
        // console.log("[DEBUG]: data stock received from db:", data)


        const stockOneDayFromServer = await axios.get(stockURL, {
          params : {
            // "dateRange": "1D"
            "start_date":"05/25/2022",
            "version": "new"
          }
        });

        stockOneDayFromServer.data.historical_data.map(item => {
          //   console.log("item", item)
          var sdOneDay = [item.date, item.open, item.high, item.low, item.close]
          arrayOneDay.push(sdOneDay)

      })

      setSeriesOneDay([{data: arrayOneDay}]);


        const stockOneWeekFromServer = await axios.get(stockURL, {
          params : {
            // "dateRange": "1W"
            "start_date":"05/15/2022",
            "version": "new"
          }
        });

        stockOneWeekFromServer.data.historical_data.map(item => {
          //   console.log("item", item)
          var sdOneWeek = [item.date, item.open, item.high, item.low, item.close]
          arrayOneWeek.push(sdOneWeek)

      })

      setSeriesOneWeek([{data: arrayOneWeek}]);

        const stockOneMonthFromServer = await axios.get(stockURL, {
          params : {
            // "dateRange": "1M"
            "start_date":"04/25/2022",
            "version": "new"
          }
        });

        stockOneMonthFromServer.data.historical_data.map(item => {
          //   console.log("item", item)
          var sdOneMonth = [item.date, item.open, item.high, item.low, item.close]
          arrayOneMonth.push(sdOneMonth)

      })

      setSeriesOneMonth([{data: arrayOneMonth}]);

        const stockThreeMonthFromServer = await axios.get(stockURL, { 
          params : {
            // "dateRange": "3M"
            "start_date":"02/25/2022",
            "version": "new"
          }
        });

        stockThreeMonthFromServer.data.historical_data.map(item => {
          //   console.log("item", item)
          var sdThreeMonth = [item.date, item.open, item.high, item.low, item.close]
          arrayThreeMonth.push(sdThreeMonth)

      })

      setSeriesThreeMonth([{data: arrayThreeMonth}]);

        // const stockSixMonthFromServer = await axios.get(stockURL, {
        //   params : {
        //     "dateRange": "6M"
        //   }
        // });
        // const stockOneYearFromServer = await axios.get(stockURL, {
        //   params : {
        //     "dateRange": "1Y"
        //   }
        // });
        // const stockFiveYearFromServer = await axios.get(stockURL, {
        //   params : {
        //     "dateRange": "5Y"
        //   }
        // });

    }
    fetchStock()
    }, []);

    const [options, setOptions] = useState({
        chart: {
          type: 'candlestick',
          height: 350,
          background: "#3e3e3e"
        },
        title: {
          text: 'CandleStick Chart',
          align: 'left'
        },
        xaxis: {
          type: 'datetime',
          labels: {
            style: {
                colors: "#99d1e7"
            },
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMMM',
              day: 'dd MMM',
              hour: 'HH:mm'
            }
          }
        },
        yaxis: {
          tooltip: {
            enabled: true
          },
          labels: {
            style: {
                colors: "#99d1e7"
            },
            formatter: function (value) {
              return value;
            }
          }
        },
        plotOptions: {
          candlestick: {
              colors: {
                  upward: '#A9A9A9',
                  downward: '#99d1e7'
              }
          },
      },
    });

  const [selectedItems, setSelectedItems] = React.useState(["1D"]);
  const legendData = [seriesOneDay, seriesOneWeek, seriesOneMonth, seriesThreeMonth];
  const chartData = [
    ...[seriesOneDay, seriesOneWeek, seriesOneMonth, seriesThreeMonth].filter((d) => selectedItems.includes(d.name))
  ];
  const onChangeDateRangeHandler = (name) => {
    setSelectedItems([name]);
  };
      return (
        <Fragment>
          <div id="chart">
            <ReactApexChart options={options} series={series} type="candlestick" height={350} />
            {/* <ReactApexChart options={options} series={chartData} type="candlestick" height={350} /> */}
          </div>
          <button class="graphSwitch" name="CANDLESTICK" onClick={onGraphMode}>Graph Mode</button>
          <Legend
            legendData={legendData}
            currDateRange={selectedItems[0]}
            onChangeDateRange={onChangeDateRangeHandler}
          />
        </Fragment>

      );
    
  }