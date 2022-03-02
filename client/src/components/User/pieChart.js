import React from 'react';
import { PieChart, Pie} from 'recharts';
  
  
const PieGraph = () => {
  
// Sample data, change later
const data = [
    {name: 'Geeksforgeeks', students: 500, fill: "#B0E0E6"},
    {name: 'Technical scripter', students: 600, fill: "#00BFFF"},
    {name: 'Geek-i-knack', students: 400, fill: "#6495ED"},
  ];
  
  
return (
      <div>
        <h2> PORTFOLIO DIVERSITY</h2>
        <PieChart width={400} height={400}>
          <Pie data={data} dataKey="students" outerRadius={100} fill="red" />
        </PieChart>
      </div>
      
);
}
  
export default PieGraph;