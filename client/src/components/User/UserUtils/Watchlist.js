import classes from './Watchlist.module.css';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import WatchlistList from '../UserLists/WatchlistList';

const Watchlist = () => {
  const userCtx = useContext(UserContext);

  return (
    <div>
      <div className={classes.list}> 
        <div className={classes.box}>
          <h5 className={classes.symbol}> Symbol </h5>
          <h5 className={classes.price}> Price </h5>
          <h5 className={classes.change}> Daily Change</h5>
        </div>
        <div className={classes.watchlist}>
          <WatchlistList usersStocksURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/watchList/`} paramsInfo={"detailed_stocks"}/> 
        </div> 
      </div>
    </div>
  )
}

export default Watchlist;