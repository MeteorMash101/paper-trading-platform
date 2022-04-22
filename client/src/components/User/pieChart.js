import { PieChart, Pie, ResponsiveContainer} from 'recharts';
import classes from './pieChart.module.css'
   
const PieGraph = () => {
  
// Sample data, change later
const data = [
    {name: 'Geeksforgeeks', students: 500, fill: "#B0E0E6"},
    {name: 'Technical scripter', students: 600, fill: "#00BFFF"},
    {name: 'Geek-i-knack', students: 400, fill: "#6495ED"},
  ];
  
  
return (
      <div className={classes.main}>
        <h2> PORTFOLIO DIVERSITY</h2>
        <ResponsiveContainer width={'99%'} height={300}>
          <PieChart width={400} height={400}>
            <Pie data={data} dataKey="students" outerRadius={100}/>
          </PieChart>
        </ResponsiveContainer>
        
      </div>
      
);
}
  
export default PieGraph;