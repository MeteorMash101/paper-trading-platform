import classes from './MainFeed.module.css';
import StockList from '../Stock/StockLists/StockList.js';
import UserCard from '../User/UserStats/UserCard.js';
import { useContext } from 'react';
import UserContext from '../../store/user-context';
import Header from '../Header/Header';
import NewsList from '../Stock/StockNews/NewsList';
import WatchlistList from '../User/UserLists/WatchlistList';
import { Navigate } from 'react-router-dom';
import MotionWrapper from './MotionWrapper';

const MainFeed = () => {
  const userCtx = useContext(UserContext);
  return (
    <MotionWrapper>
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
                  <StockList title={"Top Movers"}/>
              </div>
              <div className={classes.list}>
                  <StockList title={"Popular Stocks"}/>
              </div>
            </div>
            <div className={classes.userContainer}>
                <div className={classes.userinfo}>
                  <UserCard/>
                </div>
              <div className={classes.watchlist}>
                <h2>Watchlist</h2>
              <WatchlistList/> 
              </div>
              <div className={classes.news}>
                <h2>News</h2>
                <NewsList/>
              </div>
            </div>
          </div>
        </div>
      }
    </MotionWrapper>
  )
}

export default MainFeed;


