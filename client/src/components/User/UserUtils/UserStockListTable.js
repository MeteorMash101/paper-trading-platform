import classes from './UserStockListTable.module.css';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../store/user-context';
import WatchlistContext from '../../../store/watchlist-context';
import AccountsAPIs from '../../../APIs/AccountsAPIs';
import StockListTableEntry from './StockListTableEntry';

const UserStockListTable = ({onSelect}) => {
	const dummyData = [ // temp
		{
			symbol: "AAPL",
			shares: "[count]",
			price: "[currPrice]",
			percent_change: "[0.00]",
			change_direction: true
		},
		{
			symbol: "TSLA",
			shares: "[count]",
			price: "[currPrice]",
			percent_change: "[0.00]",
			change_direction: false
		}
	]
	const watchlistCtx = useContext(WatchlistContext);
	const userCtx = useContext(UserContext);
  	const [usersStocks, setUsersStocks] = useState(dummyData);
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
	}, [userCtx.isLoggedIn, watchlistCtx.watchlist])

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
					<div className={classes.container}>
						<div className={classes.container}>
							{isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
							{!isLoading &&
								usersStocks.map((stock) => (
								<StockListTableEntry
									key={stock.id} // required for React warning...
									symbol={stock.symbol}
									shares={stock.shares}
									price={stock.price}
									percent_change={stock.percent_change}
									change_direction={stock.change_direction}
									in_watch_list={watchlistCtx.watchlist.has(stock.symbol)}
									onSelect={onSelect}
								/>
								))
							}
						</div>
					</div>
				</div> 
			</div>
		</div>
  	)
}

export default UserStockListTable;