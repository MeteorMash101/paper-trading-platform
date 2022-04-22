import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header.js'
import MainFeed from './components/Pages/MainFeed';
import StockDetail from './components/Pages/StockDetail';
import UserProfile from './components/Pages/UserProfile';
import MyStocks from './components/Pages/MyStocks';
import History from './components/Pages/History';
import Login from './components/Pages/Login';

const App = () => {
  return (
    <div className="App">    
      {/* Header appears on every page. */}
      {/* <Header/> */}
      <Routes>
        <Route path="/" element={<MainFeed/>} exact/>
        <Route path="/stock/:symbol" element={<StockDetail/>}/>
        {/* /user/:user_id */}
        <Route path="/user/" element={<UserProfile/>}/>
        <Route path = "/stocks/" element = {<MyStocks/>}/>
        <Route path = "/history/" element={<History/>}/>
        <Route path = "/login/" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;