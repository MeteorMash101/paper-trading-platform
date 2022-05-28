import { useReducer } from 'react';
import StocksOwnedContext from './stocks-owned-context';

const defaultStocksOwnedState = {
	stocksOwned: new Set(),	
};

const stocksOwnedReducer = (state, action) => {
	if (action.type === 'ADD') {
		// EDIT: check for dups
		let updatedStocksOwned = new Set(state.stocksOwned).add(action.stock);
		return {
			...state,
			stocksOwned: updatedStocksOwned
		};
	}
	if (action.type === 'REMOVE') {
		let updatedStocksOwned = new Set(state.stocksOwned);
		updatedStocksOwned.delete(action.stock);
		return {
			...state,
			stocksOwned: updatedStocksOwned
		};
	}
	if (action.type === 'SET_SO') {
		let updatedStocksOwned = new Set(state.stocksOwned);
		for (let i = 0; i < action.stocks.length; i++) {
			updatedStocksOwned.add(action.stocks[i]);
		}
		return {
			...state,
			stocksOwned: updatedStocksOwned
		};
	}
	return defaultStocksOwnedState; // safety
};

const StocksOwnedProvider = (props) => {
	const [stocksOwnedState, dispatchStocksOwnedAction] = useReducer(
		stocksOwnedReducer,
		defaultStocksOwnedState
	);

	const addStockToStocksOwnedHandler = (stock) => {
		dispatchStocksOwnedAction({ type: 'ADD', stock: stock });
	};

	const removeStockFromStocksOwnedHandler = (stock) => {
		dispatchStocksOwnedAction({ type: 'REMOVE', stock: stock });
	};

	const setStocksOwnedOnLoginHandler = (stocks) => {
		dispatchStocksOwnedAction({ type: 'SET_SO', stocks: stocks });
	};

	const stocksOwnedContext = {
		stocksOwned: stocksOwnedState.stocksOwned,
		addStock: addStockToStocksOwnedHandler,
		removeStock: removeStockFromStocksOwnedHandler,
		setStocksOwnedOnLogin: setStocksOwnedOnLoginHandler
	};

	return (
		<StocksOwnedContext.Provider value={stocksOwnedContext}>
			{props.children}
		</StocksOwnedContext.Provider>
	);
};

export default StocksOwnedProvider;