import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import MainFeed from './components/Pages/MainFeed';
import StockDetail from './components/Pages/StockDetail';
import UserProfile from './components/Pages/UserProfile';
import UserContext from './store/user-context';
import WatchlistContext from './store/watchlist-context';
import StocksOwnedContext from './store/stocks-owned-context'
import MyStocks from './components/Pages/MyStocks';
import Login from './components/Pages/Login';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import {AnimatePresence} from 'framer-motion';
import AccountsAPIs from './APIs/AccountsAPIs';
import History from './components/Pages/TransHistory';
import Header from './components/Header/Header'

const App = () => {
  const userCtx = useContext(UserContext);
  const watchlistCtx = useContext(WatchlistContext);
  const stocksOwnedCtx = useContext(StocksOwnedContext);
  const location = useLocation();
  // EDIT: temp. workaround for persistent User // (change this?)
  useEffect(async () => {
    console.log("[APP.JS]: Checking if user already logged in...", localStorage.getItem("user_id"))
    if (localStorage.getItem("user_id") == null) {
      return
    }
    // Otherwise, a user was logged in and refreshed the page...
    let userInfo = new Object();
    userInfo.name = localStorage.getItem("name")
    userInfo.email = localStorage.getItem("email")
    userInfo.user_id = localStorage.getItem("user_id")
    userInfo.isLoggedIn = true;
    // Balance & stocklist attributes are unique to each user, fetch those from db.
    let accountFromServer;
    try {
        accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userInfo.user_id}/`, {
          params: {
            token: localStorage.getItem("access_token"),
          }
        })
    } catch (err) {
        console.log("ERROR: ", err)
        if(err.response !== undefined && err.response.status === 401) {
          localStorage.clear();
	        userCtx.setDefault();
        } else {
          accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, "", {
          params: {
            token: localStorage.getItem("access_token"),
          }
          // default balance, pv, etc.
        });
      }
    }
    if(localStorage.getItem("email") !== null) {
      userInfo.balance = accountFromServer.data.balance

      userInfo.portfolioInfo = {}
      userCtx.setUserOnLogin(userInfo)
      userCtx.setPortfolioInfo({"portfolio_value": accountFromServer.data.portfolio_value, "percent_change": "%",
      "change_direction": false,});
      // NOTE: after this run ends, then context(s) are updated (so it is not immediate).
      // Below is fetching WL data + SO data.
      const fetchData = async() => {
        let listOfTickers = await AccountsAPIs.getWatchListSymbols(userCtx.user_id);
        watchlistCtx.setWatchlistOnLogin(listOfTickers);
        listOfTickers = await AccountsAPIs.getStocksOwnedSymbols(userCtx.user_id);
        stocksOwnedCtx.setStocksOwnedOnLogin(listOfTickers);
      }
      fetchData()
    }
    
  }, [userCtx.isLoggedIn])
  console.log("[App.js] stocksOwnedCtx.stocksOwned:", stocksOwnedCtx.stocksOwned)
  return (
    <div className="App">
      {userCtx.isLoggedIn && <Header/>}
      {/* Page transition animation */}
      <AnimatePresence exitBeforeEnter initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<MainFeed/>} exact/>
          <Route path="/stock/:symbol" element={<StockDetail/>}/>
          <Route path="/user/" element={<UserProfile/>}/>
          <Route path = "/mystocks/" element = {<MyStocks/>}/>
          <Route path = "/history/" element={<History/>}/>
          <Route path = "/login/" element={<Login/>}/>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;