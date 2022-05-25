import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState, Fragment } from 'react';
import StockAPIs from '../../../APIs/StocksAPIs';

export default function ApexChart({symbol, onGraphMode}){
  const [series, setSeries] = useState([{data: []}]);
    useEffect(async() => {
      const array = await StockAPIs.getStockHistoricalForCandleStick(symbol);
      setSeries([{data: array}]);
    }, []);
    const [options, setOptions] = useState({
        chart: {
          type: 'candlestick',
          height: 350
        },
        title: {
          text: 'CandleStick Chart',
          align: 'left'
        },
        xaxis: {
          type: 'datetime'
        },
        yaxis: {
          tooltip: {
            enabled: true
          }
        },
      });

      return (
        <Fragment>
          <div id="chart">
            <ReactApexChart options={options} series={series} type="candlestick" height={350} />
          </div>
          <button class="graphSwitch" name="CANDLESTICK" onClick={onGraphMode}>Graph Mode</button>
        </Fragment>

      );
    
  }