import classes from './StockHoldings.module.css';
import UserStockList from '../UserLists/UserStockList.js';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';

const StockHoldings = () => {
  const userCtx = useContext(UserContext);

  return (
    <div>
      <div className={classes.list}> 
        <div className={classes.box}>
          <h5 className={classes.symbol}> Symbol </h5>
          <h5 className={classes.shares}> Quantity </h5>
          <h5 className={classes.price}> Price </h5>
          <h5 className={classes.change}> Daily Change</h5>
        </div>

        <div className={classes.holdings}>
          <UserStockList usersStocksURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`} paramsInfo={"stock_list_display"}/> 
        </div> 
        
      </div>
    </div>
  )
}

export default StockHoldings;