import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import MainFeed from './components/Pages/MainFeed';
import StockDetail from './components/Pages/StockDetail';
import UserProfile from './components/Pages/UserProfile';
import UserContext from './store/user-context';
import WatchlistContext from './store/watchlist-context';
import MyStocks from './components/Pages/MyStocks';
import History from './components/Pages/TransHistory';
import Login from './components/Pages/Login';
import { useContext, useEffect } from 'react';
import axios from 'axios';
import {AnimatePresence} from 'framer-motion';

const App = () => {
  const userCtx = useContext(UserContext);
  const watchlistCtx = useContext(WatchlistContext);

  // EDIT: temp. workaround for persistent User // (change this?)
  useEffect(async () => {
    console.log("[APP.JS]: Checking if user already logged in...")
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
        accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userInfo.user_id}/`)
    } catch (err) {
        // console.log("ERROR: ", err)
        accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, {
                name: userInfo.name,
                email: userInfo.email,
                google_user_id: userInfo.user_id,
                // default balance, pv, etc.
            });
    }
    userInfo.balance = accountFromServer.data.balance
    // console.log("userInfo in APP.js, from persistent login: ", userInfo)
    // console.log("Setting context...")
    userCtx.setUserOnLogin(userInfo)
    // NOTE: after this run ends, then context is updated (so it is not immediate).
    // Below is fetching WL data.
    const fetchData = async() => {
      const dataFetched = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/watchList/`, {
        params: {
          info: "detailed_stocks"
        }
      })
      let listOfTickers = dataFetched.data.stock_list.map((obj) => {return obj.symbol})
      console.log("we are (on login), sending over to ctx: ", listOfTickers)
      watchlistCtx.setWatchlistOnLogin(listOfTickers);
    }
    fetchData()
  }, [userCtx.isLoggedIn])

  const location = useLocation();

  return (
    <div className="App">
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