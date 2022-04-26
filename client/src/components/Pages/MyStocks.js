import React from 'react'
import Graph from '../GraphVisuals/Graph/Graph';
import classes from './MyStocks.module.css';
import Header from '../Header/Header';
import Tabs from '../User/UserUtils/MyStockTabs';


const MyStocks = () => {
  return (
    <div>
      <Header/>
      <div className={classes.container}>
        <div className={classes.graph}> 
          <Graph stockURL = {`http://127.0.0.1:8000/stocks/hist/fb`}/>
        </div>
        <Tabs/>
      </div>
    </div>
  )
}

export default MyStocks