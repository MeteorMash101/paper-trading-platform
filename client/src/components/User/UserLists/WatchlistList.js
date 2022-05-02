import classes from './WatchlistList.module.css';
import WatchlistItem from './WatchlistItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import WatchlistContext from '../../../store/watchlist-context';

const WatchlistList = ({title, usersStocksURL, paramsInfo}) => {
	const dummyData = [ // temp
		{
			symbol: "AAPL",
			price: "[currPrice]",
			percent_change: "[0.00]",
			change_direction: true
		},
		{
			symbol: "TSLA",
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
	useEffect(() => {
		setIsLoading(true)
		const fetchData = async() => {
			console.log("FETCHING watchlist W/ URL:", usersStocksURL)
			const dataFetched = await axios.get(usersStocksURL, {
				params: {
					info: paramsInfo
				}
			})
			setUsersStocks(dataFetched.data.stock_list);
			setIsLoading(false)
		}
		fetchData()
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
