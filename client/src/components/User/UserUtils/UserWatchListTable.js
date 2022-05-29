import classes from './UserWatchListTable.module.css';
import { useEffect, useState, useContext } from 'react';
import UserContext from '../../../store/user-context';
import WatchlistContext from '../../../store/watchlist-context';
import WatchListTableEntry from './WatchListTableEntry'
import AccountsAPIs from '../../../APIs/AccountsAPIs.js'

const UserWatchListTable = ({onSelect}) => {
  const userCtx = useContext(UserContext);
  const watchlistCtx = useContext(WatchlistContext);
  const [usersStocks, setUsersStocks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	// API CALL: Fetch user's watchlist
	useEffect(async() => {
		setIsLoading(true)
		let dataFetched
		try {
			dataFetched = await AccountsAPIs.getUsersWatchlist(userCtx.user_id);
		} catch (err) {
			if(err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
		setUsersStocks(dataFetched.data.stock_list);
		setIsLoading(false)
	}, [userCtx.isLoggedIn, watchlistCtx.watchlist])

  return (
    <div>
      <div className={classes.list}> 
        <div className={classes.box}>
          <h5 className={classes.symbol}> Symbol </h5>
          <h5 className={classes.price}> Price </h5>
          <h5 className={classes.change}> Daily Change</h5>
        </div>
        <div className={classes.watchlist}>
          <div className={classes.container}>
            {isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
            {!isLoading &&
              usersStocks.map((stock) => (
                <WatchListTableEntry
                  key={stock.id} // required for React warning...
                  symbol={stock.symbol}
                  price={stock.price}
                  percent_change={stock.percent_change}
                  change_direction={stock.change_direction}
                  in_list={watchlistCtx.watchlist.has(stock.symbol)}
                  onSelect={onSelect}
                />
              ))
            }
          </div>
        </div> 
      </div>
    </div>
  )
}

export default UserWatchListTable;