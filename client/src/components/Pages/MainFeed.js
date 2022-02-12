import { Fragment } from 'react';
import StockList from '../Stock/StockList.js';

const MainFeed = ({stockList}) => {
  return (
    <div>
      <StockList stockList={stockList}/>
    </div>
  );
}

export default MainFeed;