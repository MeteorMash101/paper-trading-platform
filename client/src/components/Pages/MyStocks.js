import React from 'react'
import classes from './MyStocks.module.css';
import UserContext from '../../store/user-context';
import { Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import MotionWrapper from '../Alerts/MotionWrapper';
import Graph from '../GraphVisuals/MultilineGraph/Graph';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import StockListTableLabels from '../User/UserUtils/StockListTableLabels';
import StockTableEntry from '../User/UserUtils/StockTableEntry'
import WatchListTableLabels from '../User/UserUtils/WatchListTableLabels';
import StocksOwnedContext from "../../store/stocks-owned-context";
import WatchlistContext from "../../store/watchlist-context";
import AccountsAPIs from '../../APIs/AccountsAPIs';

const MyStocks = () => {
	const userCtx = useContext(UserContext);
	const stocksOwnedCtx = useContext(StocksOwnedContext);
	const watchlistCtx = useContext(WatchlistContext);
	const [stocksSelected, setStocksSelected] = useState([]);
	const [isMouseHovering, setIsMouseHovering] = useState(false);
	const [value, setValue] = React.useState('one');
	const [usersStocksOwned, setUsersStocksOwned] = useState([]);
	const [usersWatchList, setUsersWatchList] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	// EDIT: Hex/RGB rand. colors not syncing...temp fix:
	// So limited to "20" stocks for this page, for now...
	const TEMP_COLORS = [
		// RESERVING ALL LIGHT BLUES FOR PV
		"rgb(230, 103, 147)", "rgb(233, 236, 122)", "rgb(222, 103, 230)",
		"rgb(38, 71, 84)", "rgb(135, 103, 230)", "rgb(230, 103, 103)",
		"rgb(31, 148, 39)", "rgb(96, 221, 158)", "rgb(72, 14, 77)",
		"rgb(178, 224, 105)", "rgb(60, 65, 26)", "rgb(241, 192, 92)",
		"rgb(103, 135, 230)", "rgb(69, 14, 17)", "rgb(154, 0, 144)",
		"rgb(230, 103, 103)", "rgb(241, 192, 92)", "rgb(34, 108, 118)",
		"rebeccapurple", "honeydew"
	]
	// EDIT: for some reason ctx is not updated right away...
	// console.log("[MyStocks.js]: stocksOwnedCtx", stocksOwnedCtx)
	// API CALL: Fetch user's data for Stock List & Watch List on render.
	useEffect(async () => {
		setIsLoading(true)
		let dataFetched;
		try {
			dataFetched = await AccountsAPIs.getUsersStocksOwned(userCtx.user_id);
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.clear();
				userCtx.setDefault();
			}
		}
		// Add rand. color ID for each stock data.
		let i = 0
		dataFetched.data.stock_list.forEach((stockData) => { 
			stockData.colorId = TEMP_COLORS[i]
			i++
			if (i == TEMP_COLORS.length) {
				i = 0
			}
		});
		setUsersStocksOwned(dataFetched.data.stock_list);
		try {
			dataFetched = await AccountsAPIs.getUsersWatchlist(userCtx.user_id);
		} catch (err) {
			if (err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
		// Add rand. color ID for each stock data.
		dataFetched.data.stock_list.forEach((stockData) => { 
			stockData.colorId = TEMP_COLORS[i]
			i++
			if (i == TEMP_COLORS.length) {
				i = 0
			}
		});
		setUsersWatchList(dataFetched.data.stock_list);
		setIsLoading(false)
	}, [userCtx.isLoggedIn, stocksOwnedCtx.stocksOwned, watchlistCtx.watchlist])

	// When the stock selection changes...
	const onSelectHandler = (e) => {
		if (e.target.checked) { // means this was just checked
			setStocksSelected((prevStocksSelected) => {
				return [...prevStocksSelected, e.target.id.toUpperCase()]
			})
		} else { // just unchecked
			setStocksSelected((prevStocksSelected) => {
				return [...prevStocksSelected].filter(stockTicker => stockTicker != e.target.id.toUpperCase())
			})
		}
	}
    const onMouseHoverHandler = (bool) => {
        setIsMouseHovering(bool)
    }
	// When the user switches list tabs...
	const onTabChangeHandler = (event, newValue) => {
		setValue(newValue);
	};
	console.log("[MyStocks.js] sl, wl: ", usersStocksOwned, usersWatchList)
	return (
		<MotionWrapper>
			{!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
				// Redirect to /login - User must be logged in to view ALL pages...
				<Navigate to="/login"/>
			}
			{userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
				<div>
					<div className={classes.mainContainer}>
						{/* Multi-line Display Graph */}
						<div className={classes.graph}> 
							<Graph usersStocksOwnedNWatchList={usersStocksOwned.concat(usersWatchList)} usersWatchList={usersWatchList} stocksSelected={stocksSelected} onHover={onMouseHoverHandler}/>
						</div>
						{/* The Stock List & Watch List Tables */}
						<div className={classes.table}> 
							<Box sx={{ width: '90%', margin: '5%', border:'1px solid grey', borderRadius:'1.6rem', height:'65vh'}}>
								<Tabs
								value={value}
								onChange={onTabChangeHandler}
								variant="fullWidth"
								aria-label="secondary tabs example"
								>
									<Tab value="one" label="Stock Holdings" />
									<Tab value="two" label="Watchlist" />
								</Tabs>
								{value === "one" && 
									<div className={classes.list}>
										<StockListTableLabels/>
										<div className={classes.holdings}>
											<div className={classes.container}>
												<div className={classes.container}>
													{isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
													{!isLoading &&
														usersStocksOwned.map((stock) => (
															<StockTableEntry
																key={stock.id} // required for React warning...
																colorId={stock.colorId.toString()}
																symbol={stock.symbol}
																shares={stock.shares}
																price={stock.price}
																percent_change={stock.percent_change}
																change_direction={stock.change_direction}
																in_list={stocksOwnedCtx.stocksOwned.has(stock.symbol)}
																IS_WATCHLIST_TABLE={false}
																onSelect={onSelectHandler}
															/>
														))
													}
												</div>
											</div>
										</div>
									</div>
								}
								{value === "two" &&
									<div className={classes.list}>
										<WatchListTableLabels/>
										<div className={classes.holdings}>
											<div className={classes.container}>
												<div className={classes.container}>
													{isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
													{!isLoading &&
														usersWatchList.map((stock) => (
															<StockTableEntry
																key={stock.id} // required for React warning...
																colorId={stock.colorId.toString()}
																symbol={stock.symbol}
																price={stock.price}
																percent_change={stock.percent_change}
																change_direction={stock.change_direction}
																in_list={watchlistCtx.watchlist.has(stock.symbol)}
																IS_WATCHLIST_TABLE={true}
																onSelect={onSelectHandler}
															/>
														))
													}
												</div>
											</div>
										</div>
									</div> 
								}
							</Box>
						</div>
					</div>
				</div>
			}
		</MotionWrapper>
	);
}
export default MyStocks