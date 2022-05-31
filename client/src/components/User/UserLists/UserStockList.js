import classes from './UserStockList.module.css';
import StockListItem from './StockListItem';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import StocksOwnedContext from '../../../store/stocks-owned-context';
import WatchlistContext from '../../../store/watchlist-context';
import AccountsAPIs from '../../../APIs/AccountsAPIs';

const UserStockList = () => {
	const userCtx = useContext(UserContext);
	const stocksOwnedCtx = useContext(StocksOwnedContext);
  	const [usersStocks, setUsersStocks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	// API CALL: Fetch user's owned stocklist
	useEffect(async () => {
		setIsLoading(true)
		let dataFetched;
		try {
			dataFetched = await AccountsAPIs.getUsersStocksOwned(userCtx.user_id);
		} catch (err) {
			if(err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
		setUsersStocks(dataFetched.data.stock_list);
		setIsLoading(false)
	}, [userCtx.isLoggedIn, userCtx.balance])
	return (
		<div className={classes.container}>
			{isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
			{!isLoading &&
				usersStocks.map((stock) => (
					<StockListItem
						key={stock.id} // required for React warning...
						symbol={stock.symbol}
						shares={stock.shares}
						price={stock.price}
						percent_change={stock.percent_change}
						change_direction={stock.change_direction}
						in_list={stocksOwnedCtx.stocksOwned.has(stock.symbol)}
					/>
				))
			}
		</div>
	);
};

export default UserStockList;