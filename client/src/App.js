import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header.js'
import MainFeed from './components/Pages/MainFeed';
import StockDetail from './components/Pages/StockDetail';
import UserProfile from './components/Pages/UserProfile';
import UserContext from './store/user-context';
import { useContext, useEffect } from 'react';
import axios from 'axios';


const App = () => {
  const userCtx = useContext(UserContext);
  // EDIT: temp. workaround for persistent User // (change this!)
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
        if (accountFromServer.data == "") {
            // console.log("Account not found... creating new.");
            accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, {
                name: userInfo.name,
                email: userInfo.email,
                google_user_id: userInfo.user_id,
                // default balance, pv, etc.
            })
        } else {
            // console.log("Account found: ", accountFromServer.data);
        }
    } catch (err) {
        // console.log("ERROR: ", err)
    }
    userInfo.balance = accountFromServer.data.balance
    // console.log("userInfo in APP.js, from persistent login: ", userInfo)
    // console.log("Setting context...")
    userCtx.setUserOnLogin(userInfo)
    // NOTE: after this run ends, then context is updated (so it is not immediate).

  }, [userCtx.isLoggedIn])
  return (
    <div className="App">    
      {/* Header appears on every page. */}
      <Header/>
      <Routes>
        <Route path="/" element={<MainFeed/>} exact/>
        <Route path="/stock/:symbol" element={<StockDetail/>}/>
        {/* /user/:user_id */}
        <Route path="/user/" element={<UserProfile/>}/>
      </Routes>
    </div>
  );
}

export default App;