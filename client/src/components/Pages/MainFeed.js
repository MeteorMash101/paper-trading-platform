import classes from './MainFeed.module.css';
import StockList from '../Stock/StockList.js';
import UserCard from '../UserCard.js';
import UserStockList from '../UserStockList.js';

const MainFeed = ({stockList}) => {
  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        <div className={classes.list}>
            <StockList title={"Top Movers"} stockListURL={"http://127.0.0.1:8000/stocks/"}/>
        </div>
        <div className={classes.list}>
            <StockList title={"Popular Stocks"} stockListURL={"http://127.0.0.1:8000/stocks/popular"}/>
        </div>
      </div>
      <div className={classes.userContainer}>
        <div className={classes.userinfo}>
          <UserCard/>
        </div>

        <div className={classes.stocklistings}>
          {/* <UserStockList/> */}
        </div>
        
      </div>
    </div>
  )
}

export default MainFeed;