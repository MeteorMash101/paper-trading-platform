import React from 'react';

const StocksOwnedContext = React.createContext({
	stocksOwned: new Set(), // can prolly change to -> set of tickers
	addStock: (stock) => {},
	removeStock: (stock) => {}, // EDIT: shud be id? is a ticker I think...?
	setStocksOwnedOnLogin: (stocks) => {} // passing in list of ticker stocks
});

export default StocksOwnedContext;