import { Fragment } from 'react';
import StockList from '../Stock/StockList.js';
import UserCard from '../UserCard.js';
import classes from './MainFeed.module.css';
import UserStockList from '../UserStockList.js';

const MainFeed = ({stockList}) => {
  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        <StockList title={"Top Movers..."} stockListURL={"http://127.0.0.1:8000/stocks/"}/>
        <StockList title={"Popular Stocks..."} stockListURL={"http://127.0.0.1:8000/stocks/popular"}/>
      </div>
      <div className={classes.userContainer}>
        <UserCard/>
        <UserStockList/>
      </div>
    </div>
  );
}

export default MainFeed;