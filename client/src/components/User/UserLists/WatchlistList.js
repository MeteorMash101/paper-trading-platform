import classes from './WatchlistList.module.css';
import WatchlistItem from './WatchlistItem';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import WatchlistContext from '../../../store/watchlist-context';
import AccountsAPIs from '../../../APIs/AccountsAPIs.js'

const WatchlistList = () => {
	const watchlistCtx = useContext(WatchlistContext);
	const userCtx = useContext(UserContext);
  	const [usersStocks, setUsersStocks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	// API CALL: Fetch user's owned stocklist
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
		<div className={classes.container}>
			{isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
			{!isLoading &&
				usersStocks.map((stock) => (
					<WatchlistItem
						key={stock.id} // required for React warning...
						symbol={stock.symbol}
						price={stock.price}
						percent_change={stock.percent_change}
						change_direction={stock.change_direction}
						in_watch_list={watchlistCtx.watchlist.has(stock.symbol)}
					/>
				))
			}
		</div>
	);
};

export default WatchlistList;
