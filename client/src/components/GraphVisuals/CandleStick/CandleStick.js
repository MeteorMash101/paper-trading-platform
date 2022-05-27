import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState, Fragment } from 'react';
import StockAPIs from '../../../APIs/StocksAPIs';

export default function ApexChart({symbol, onGraphMode}){
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
          <button class="graphSwitch" name="GRAPH" onClick={onGraphMode}>Graph Mode</button>
        </Fragment>

      );
    
  }