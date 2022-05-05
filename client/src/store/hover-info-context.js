import React from 'react';

const HoverInfoContext = React.createContext({
	price: 0,
	// EDIT: add more props soon, like % change and $ change...
	setPrice: (price) => {}
});

export default HoverInfoContext;