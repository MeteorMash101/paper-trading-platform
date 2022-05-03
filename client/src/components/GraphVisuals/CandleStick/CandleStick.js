import ReactDOM from 'react-dom';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ApexChart({stockURL}){

  const [array, setArray] = useState([]);
  const [series, setSeries] = useState([{data: []}]);

    useEffect(() => {
        const fetchStock = async () => {    
            
          const stockFromServer = await axios.get(stockURL,{ params : {
            "start_date":"04/01/2017",
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

    }
    fetchStock()
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
        
        <div id="chart">
        <ReactApexChart options={options} series={series} type="candlestick" height={350} />
        </div>

      );
    
  }