import React from 'react';

const HoverInfoContext = React.createContext({
	price: 0,
	priceChanges: {dollar_change: 0.00, percent_change: 0.00},
	// EDIT: add more props soon, like % change and $ change...
	setPrice: (price) => {},
	setPriceChanges: (priceChanges) => {}
});

export default HoverInfoContext;