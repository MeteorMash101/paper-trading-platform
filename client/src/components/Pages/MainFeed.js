import classes from './MainFeed.module.css';
import StockList from '../Stock/StockLists/StockList.js';
import UserCard from '../User/UserStats/UserCard.js';
import { useContext, useState } from 'react';
import UserContext from '../../store/user-context';
import NewsList from '../Stock/StockNews/NewsList';
import UserWatchList from '../User/UserLists/UserWatchList';
import UserStockList from '../User/UserLists/UserStockList'
import { Navigate } from 'react-router-dom';
import MotionWrapper from '../Alerts/MotionWrapper';
import LiveIndicator from '../Alerts/LiveIndicator';

const MainFeed = () => {
  const userCtx = useContext(UserContext);
  const [showList, setShowList] = useState("STOCKLIST");
  const selectedCSS = classes.selectedTab
  const onChangeShowListHandler = (e) => {
    if (e.target.getAttribute('name') == "SL") {
      setShowList("STOCKLIST")
    } else {
      setShowList("WATCHLIST")
    }
  }
  return (
    <MotionWrapper>
      {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
        // Redirect to /login - User must be logged in to view ALL pages...
        <Navigate to="/login"/>
      }
      {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
        <div className={classes.container}>
          <div className={classes.margin}>
            <div className={classes.liveind}>
              <LiveIndicator/>
            </div>
            
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
              <div className={classes.listContainerForTab}>
                <div className={classes.tabContainer}>
                  <h2 name="SL" className={classes.listTab} id={showList == "STOCKLIST" ? selectedCSS : ""} onClick={onChangeShowListHandler}>Stock List</h2>
                  <h2 name="WL" className={classes.listTab} id={showList == "WATCHLIST" ? selectedCSS : ""} onClick={onChangeShowListHandler}>Watch List</h2>
                </div>
                {showList == "STOCKLIST" &&
                  <UserStockList/>
                }
                {showList == "WATCHLIST" &&
                  <UserWatchList/>
                }
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


