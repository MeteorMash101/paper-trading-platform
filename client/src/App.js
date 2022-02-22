import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import Header from './components/Header/Header.js'
import MainFeed from './components/Pages/MainFeed';
import StockDetail from './components/Pages/StockDetail';

const App = () => {
  // Only the "first" time this App is loaded, do we pull everything from DB.
  // From then on, ReactJS maintains separate state that is "in-sync" with the DB.
  const [stockList, setStockList] = useState([]);
  useEffect(() => {
    const fetchStocks = async () => {
      const stocksFromServer = await axios.get("http://127.0.0.1:8000/stocks/")
      console.log("[DEBUG]: stocks received from db:", stocksFromServer.data)
      setStockList(stocksFromServer.data)
    }
    fetchStocks()
  }, []) // this DB retreival should only execute the first time this App is loaded.

  return (
    <div className="App">    
      {/* Header appears on every page. */}
      <Header/>
      <Routes>
        <Route path="/" element={<MainFeed stockList={stockList}/>} exact/>
        <Route path="/stock/:symbol" element={<StockDetail/>}/>
        {/* <Route path="/user" element={<UserProfile postsList={postsList}/>}/> */}
      </Routes>
    </div>
  );
}

export default App;