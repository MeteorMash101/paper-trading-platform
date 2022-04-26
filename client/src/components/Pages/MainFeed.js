import classes from './MainFeed.module.css';
import StockList from '../Stock/StockList.js';
import UserCard from '../UserCard.js';
import UserStockList from '../UserStockList.js';
import { useContext } from 'react';
import UserContext from '../../store/user-context';

const MainFeed = ({stockList}) => {
  const userCtx = useContext(UserContext);
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
        <UserCard/>
        <UserStockList title={"Stocks (I own):"} usersStocksURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`} paramsInfo={"stock_list_display"}/> 
        <UserStockList title={"Watchlist"} usersStocksURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/watchList/`} paramsInfo={"detailed_stocks"}/> 
      </div>
    </div>
  )
}

export default MainFeed;