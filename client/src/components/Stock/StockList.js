import React, { useState, useEffect } from 'react';
import classes from './StockList.module.css';
import StockItem from './StockItem';
import axios from 'axios';
import { useContext } from 'react';
import UserContext from '../../store/user-context';
import WatchlistContext from '../../store/watchlist-context';

const StockList = ({title, stockListURL}) => {
  	// Only the "first" time this Component is loaded, do we pull everything from DB.
  	// From then on, ReactJS maintains separate state that is "in-sync" with the DB.
  	const userCtx = useContext(UserContext);
	const watchlistCtx = useContext(WatchlistContext);
	const [stockList, setStockList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

  	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true)
			const dataFetched = await axios.get(stockListURL)
			// console.log("[DEBUG]: stocks received from db:", stocksFromServer.data)
			setStockList(dataFetched.data)
			setIsLoading(false)
		}
		fetchData()
  	}, [userCtx.isLoggedIn]) // this DB retreival should only execute the first time this App is loaded.
	
	const addToWatchListHandler = async (stock) => {
		console.log("add to WL clicked!", stock)
		const res = await axios.put(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/watchList/`, {
			"symbol": stock
		})
		watchlistCtx.addStock(stock);
	}
	const removeFromWatchListHandler = async (stock) => {
		console.log("remove from WL clicked!", stock)
		const res = await axios.put(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/watchList/`, {
			"symbol": stock
		})
		watchlistCtx.removeStock(stock);
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