import Chart from "react-apexcharts";
import { useEffect, useState, Fragment } from 'react';
import ReactApexChart from 'react-apexcharts';
import StockAPIs from '../../../APIs/StocksAPIs';

// const QEChart = (symbol) => {

export default function QEChart({symbol}){
  
    const [series, setSeries] = useState([{data: []}, {data: []}]);
    // const [categories, setCategories] = useState(['2Q2021', '3Q2021', '4Q2021', '1Q2022']);

    useEffect(async () => {
      const {array, xaxisval} = await StockAPIs.getQuarterlyEarnings(symbol);
      console.log("[DEBUG]: EARNINGS received from db:", array)
      console.log("[DEBUG]: dates received from db:", xaxisval)
      setSeries([{name: "Actual", data: array, color: "#75c7c9"}, {name: "Estimate", data: xaxisval, color: "#a6e7f7" }]);
      
      // setCategories(xaxisval);
    }, []);

    const [options, setOptions] = useState({
        chart: {
          type: 'bar',
          height: 350,
          
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: {
          enabled: true,
          // formatter: function (val) {
          //   return + (val);
          // },
          offsetY: 4,
          style: {
            fontSize: '14px',
            colors: ["#304758"]
          }
        },
        xaxis: {
          categories: ['2Q: 2021', '3Q: 2021', '4Q: 2021', '1Q: 2022'],
          type: 'category',
          position: 'bottom',
          axisBorder: {
            show: true
          },
          axisTicks: {
            show: true
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          tooltip: {
            enabled: true
          },
          title: {
            text: 'EPS',
          },
        },
    });
  

    return (
      <Fragment>
        <div id="bar">
        <ReactApexChart options={options} series={series} type="bar" height={350}/>
        </div>
      </Fragment> 
    );
  }

// export default QEChart;