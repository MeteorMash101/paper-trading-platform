import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState, Fragment } from 'react';
import StockAPIs from '../../../APIs/StocksAPIs';

export default function ApexChart({symbol, onGraphMode}){
  const [array, setArray] = useState([]);
  const [series, setSeries] = useState([{data: []}]);

  useEffect(async() => {
    const array = await StockAPIs.getStockHistoricalForCandleStick(symbol);
    console.log("array in candlestick:",array);
    setSeries([{data: array}]);
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

      return (
        <Fragment>
          <div id="chart">
            <ReactApexChart options={options} series={series} type="candlestick" height={350} />
          </div>
          <button class="graphSwitch" name="GRAPH" onClick={onGraphMode}>Graph Mode</button>
        </Fragment>

      );
    
  }