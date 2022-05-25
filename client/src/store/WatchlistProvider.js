import { useReducer } from 'react';
import WatchlistContext from './watchlist-context';

const defaultWatchlistState = {
	watchlist: new Set(),	
};

const watchlistReducer = (state, action) => {
	if (action.type === 'ADD') {
		// EDIT: check for dups
		let updatedWatchlist = new Set(state.watchlist).add(action.stock);
		return {
			...state,
			watchlist: updatedWatchlist
		};
	}
	if (action.type === 'REMOVE') {
		let updatedWatchlist = new Set(state.watchlist);
		updatedWatchlist.delete(action.stock);
		return {
			...state,
			watchlist: updatedWatchlist
		};
	}
	if (action.type === 'SET_WL') {
		let updatedWatchlist = new Set(state.watchlist);
		for (let i = 0; i < action.stocks.length; i++) {
			updatedWatchlist.add(action.stocks[i]);
		}
		return {
			...state,
			watchlist: updatedWatchlist
		};
	}
	return defaultWatchlistState; // safety
};

const WatchlistProvider = (props) => {
	const [watchlistState, dispatchWatchlistAction] = useReducer(
		watchlistReducer,
		defaultWatchlistState
	);

	const addStockToWatchlistHandler = (stock) => {
		dispatchWatchlistAction({ type: 'ADD', stock: stock });
		
	};

	const removeStockFromWatchlistHandler = (stock) => {
		dispatchWatchlistAction({ type: 'REMOVE', stock: stock });
	};

	const setWatchlistOnLoginHandler = (stocks) => {
		dispatchWatchlistAction({ type: 'SET_WL', stocks: stocks });
	};

	const watchlistContext = {
		watchlist: watchlistState.watchlist,
		addStock: addStockToWatchlistHandler,
		removeStock: removeStockFromWatchlistHandler,
		setWatchlistOnLogin: setWatchlistOnLoginHandler
	};

	return (
		<WatchlistContext.Provider value={watchlistContext}>
			{props.children}
		</WatchlistContext.Provider>
	);
};

export default WatchlistProvider;
