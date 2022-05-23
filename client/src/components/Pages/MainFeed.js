import classes from './MainFeed.module.css';
import StockList from '../Stock/StockLists/StockList.js';
import UserCard from '../User/UserStats/UserCard.js';
import { useContext } from 'react';
import UserContext from '../../store/user-context';
import Header from '../Header/Header';
import NewsList from '../Stock/StockNews/NewsList';
import WatchlistList from '../User/UserLists/WatchlistList';
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MainFeed = ({stockList}) => {
  const userCtx = useContext(UserContext);

  return (
    <motion.div 
    initial= {{opacity:0, x:100}} 
    animate = {{opacity: 1, x:0}}
    exit = {{opacity: 0, x:-100}}
    transition={{ duration: 0.7}}>
      <Fragment>
        {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
          // Redirect to /login - User must be logged in to view ALL pages...
          <Navigate to="/login"/>
        }
        {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
          <div className={classes.container}>
            <Header/>
            <div className={classes.margin}>
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
                {/* <UserStockList title={"Stocks (I own):"} usersStocksURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`} paramsInfo={"stock_list_display"}/>  */}
                <div className={classes.watchlist}>
                  <h2>Watchlist</h2>
                <WatchlistList title={"Watchlist"} usersStocksURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/watchList/`} paramsInfo={"detailed_stocks"}/> 
                </div>
                <div className={classes.news}>
                  <h2>News</h2>
                  <NewsList newsAPIUrl={'http://127.0.0.1:8000/news/'}/>
                </div>
                
              </div>
            </div>
          </div>
        }
      </Fragment>
    </motion.div>

  )
}

export default MainFeed;


