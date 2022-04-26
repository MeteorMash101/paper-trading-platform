import React from 'react';

const WatchlistContext = React.createContext({
	watchlist: new Set(), // can prolly change to -> set of tickers
	addStock: (stock) => {},
	removeStock: (stock) => {}, // EDIT: shud be id? is a ticker I think...?
	setWatchlistOnLogin: (stocks) => {} // passing in list of ticker stocks
});

export default WatchlistContext;