import { Fragment } from 'react';
import StockList from '../Stock/StockList.js';
import UserCard from '../UserCard.js';
import classes from './MainFeed.module.css';
import NewsCard from '../news/newsCard.js';

const MainFeed = ({stockList}) => {
  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        <div className={classes.list1}>
            <StockList title={"Top movers"} stockListURL={"http://127.0.0.1:8000/stocks/"}/>
        </div>

        <div className={classes.list2}>
            <StockList title={"Popular stocks"} stockListURL={"http://127.0.0.1:8000/stocks/popular"}/>
        </div>        
      </div>
      {/* <UserCard/> */}
      <NewsCard/>
    </div>
  );
}

export default MainFeed;