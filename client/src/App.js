import { Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header.js'
import MainFeed from './components/Pages/MainFeed';
import StockDetail from './components/Pages/StockDetail';

const App = () => {
  return (
    <div className="App">    
      {/* Header appears on every page. */}
      <Header/>
      <Routes>
        <Route path="/" element={<MainFeed/>} exact/>
        <Route path="/stock/:symbol" element={<StockDetail/>}/>
        {/* <Route path="/user" element={<UserProfile postsList={postsList}/>}/> */}
      </Routes>
    </div>
  );
}

export default App;