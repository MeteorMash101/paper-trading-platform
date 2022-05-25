// We are store our 'application-wide' contexts in this '/store' folder.
import React from 'react';
import { STARTING_BALANCE } from '../globals'

const UserContext = React.createContext({
	// just dummy data (for auto-completion)
	name: "", // When firstName is "", we know that nobody is logged in.
	user_id: "", // Hidden, is this UUID?
	isLoggedIn: false,
	balance: STARTING_BALANCE, // NOTE: same as BP "Buying Power"
	portfolioInfo: {
		portfolio_value: "0.00",
		percent_change: "%",
		change_direction: false,
	},
	updateBalance: (amount) => {},
	setPortfolioValue: (portfolioInfo) => {},
	setUserOnLogin: (userInfo) => {},
	setDefault: () => {}
});

export default UserContext;
// EDIT: add? onlineStatus: 