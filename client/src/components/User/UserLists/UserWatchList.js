import classes from './UserWatchList.module.css';
import WatchListItem from './WatchListItem';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import WatchlistContext from '../../../store/watchlist-context';
import AccountsAPIs from '../../../APIs/AccountsAPIs.js'

const UserWatchList = () => {
	const watchlistCtx = useContext(WatchlistContext);
	const userCtx = useContext(UserContext);
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
	const removeFromWatchListHandler = async (stockSymbol) => {
		try {
			await AccountsAPIs.removeFromWatchList(userCtx.user_id, stockSymbol)
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
		watchlistCtx.removeStock(stockSymbol);
	}
	return (
		<div className={classes.container}>
			{isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
			{!isLoading &&
				usersStocks.map((stock) => (
					<WatchListItem
						key={stock.id} // required for React warning...
						symbol={stock.symbol}
						price={stock.price}
						percent_change={stock.percent_change}
						change_direction={stock.change_direction}
						in_watch_list={watchlistCtx.watchlist.has(stock.symbol)}
						// onAdd={addToWatchListHandler.bind(null, stock.symbol)}
						onRemove={removeFromWatchListHandler.bind(null, stock.symbol)}
					/>
				))
			}
		</div>
	);
};

export default UserWatchList;
