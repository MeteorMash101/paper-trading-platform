import React, { useState, useEffect } from 'react';
import classes from './StockList.module.css';
import StockItem from './StockItem';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import WatchlistContext from '../../../store/watchlist-context';
import StockAPIs from '../../../APIs/StocksAPIs';
import AccountsAPIs from '../../../APIs/AccountsAPIs';

const StockList = ({title}) => {
  	// Only the "first" time this Component is loaded, do we pull everything from DB.
  	// From then on, ReactJS maintains separate state that is "in-sync" with the DB.
  	const userCtx = useContext(UserContext);
	const watchlistCtx = useContext(WatchlistContext);
	const [stockList, setStockList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

  	useEffect(async() => {
		setIsLoading(true)
		const dataFetched = await StockAPIs.getStockList(title)
		setStockList(dataFetched.data)
		setIsLoading(false)
  	}, [userCtx.isLoggedIn]) // this DB retreival should only execute the first time this App is loaded.
	
	const addToWatchListHandler = async (stockSymbol) => {
		try {
			await AccountsAPIs.addToWatchList(userCtx.user_id, stockSymbol)
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
		watchlistCtx.addStock(stockSymbol);
	}
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
			<h2 className={classes.title}>{title}</h2>
			{isLoading && <div className={classes.loader}></div>}
			{!isLoading &&
				stockList.map((stock) => ( // making sure array exists first.
					<StockItem
						colorStyle={classes.neutral_blue}
						key={stock.id} // required for React warning...
						stock_id={stock.id}
						symbol={stock.symbol}
						company_name={stock.company_name}
						price={stock.price}
						change_direction={stock.change_direction}
						percent_change={stock.percent_change}
						in_watch_list={watchlistCtx.watchlist.has(stock.symbol)}
						onAdd={addToWatchListHandler.bind(null, stock.symbol)}
						onRemove={removeFromWatchListHandler.bind(null, stock.symbol)}
					/>
				))
			}
		</div>
	);
};

export default StockList;