// import { PieChart, Pie, ResponsiveContainer} from 'recharts';
// import classes from './PieChart.module.css'
   
// const PieGraph = () => {
  
// // Sample data, change later
// const data = [
//     {name: 'Geeksforgeeks', students: 500, fill: "#B0E0E6"},
//     {name: 'Technical scripter', students: 600, fill: "#00BFFF"},
//     {name: 'Geek-i-knack', students: 400, fill: "#6495ED"},
//   ];
  
  
// return (
//       <div className={classes.main}>
//         <h2> PORTFOLIO DIVERSITY</h2>
//         <ResponsiveContainer width={'99%'} height={300}>
//           <PieChart width={400} height={400}>
//             <Pie data={data} dataKey="students" outerRadius={100}/>
//           </PieChart>
//         </ResponsiveContainer>
        
//       </div>
      
// );
// }
  
// export default PieGraph;

import { PieChart, Pie, Sector, ResponsiveContainer} from 'recharts';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import classes from './PieChart.module.css'
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
   
const PieGraph = () => {
  
  const userCtx = useContext(UserContext);
  const [array, setArray] = useState([]);
  const ce = [];
  // const [series, setSeries] = useState([{data: []}]);
  const [data, setData] = useState([{name: '', number: 0, fill: '#B0E0E6'}]);
  const [tmp, setTmp] = useState([{name: '', number: 0, fill: '#B0E0E6'}]);
  // const [data, setData] = useState("");
  const [useableData, setUseableData] = useState([{data: '', number: 0, fill: ''}]);

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value
    } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? "start" : "end";
  
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={fill}
          fill="none"
        />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`PV ${value}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill="#999"
        >
          {`(Rate ${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

    useEffect(() => {
        const fetchStock = async () => {   
            
          const stockFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/diversity/`)

        var myColors = [
          "#B0E0E6",
          "#dde6d5",
          "#ffecb8",
          "#f0f7da",
          "#eed9c4",
          "#b7ded2",
          "#6495ED",
          "#66545e",
          "#a39193",
          "#aa6f73",
          "#eea990"
        ]

        Object.keys(stockFromServer.data.industry_makeup).map((keyName, i) => {
          
        data.push({name: keyName, number: stockFromServer.data.industry_makeup[keyName],
            fill : myColors[Math.floor(Math.random()*myColors.length)]})
        
      });

      console.log("[DEBUG]: data stock received from db:", data)



    }
    fetchStock()
    }, []);
  
  
return (
      <div className={classes.main}>
        {/* <h2> PORTFOLIO DIVERSITY</h2> */}

<ResponsiveContainer width={'100%'} height={400}>
  <PieChart width={200} height={400}>
      <Pie
        activeIndex={activeIndex}
        activeShape={renderActiveShape}
        data={data}
        // cx={200}
        cy={200}
        innerRadius={120}
        outerRadius={140}
        // fill="#8884d8"
        fill="fill"
        dataKey="number"
        onMouseEnter={onPieEnter}
      />
    </PieChart>
    </ResponsiveContainer>
      </div>
      
);
}
  
export default PieGraph;