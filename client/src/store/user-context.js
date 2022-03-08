// We are store our 'application-wide' contexts in this '/store' folder.
import React from 'react';

const UserContext = React.createContext({
	// just dummy data (for auto-completion)
	// currUser: null,
	// setCurrUser: (userObj) => {},
	// [DEPRECIATED WAY]
	name: "", // When firstName is "", we know that nobody is logged in.
	user_id: "", // Hidden, is this UUID?
	isLoggedIn: false,
	balance: 5000.00, // EDIT: temp. val for testing
	portfolioInfo: {},
	setName: (name) => {},
	setUserID: (user_id) => {},
	setIsLoggedIn: (isLoggedIn) => {},
	setBalance: (amount) => {},
	setBalanceOnLogin: (amount) => {},
	setPortfolioValue: (portfolioInfo) => {},
	setUserOnLogin: (userInfo) => {}, // EDIT: temp. for DEMO, brokenaf.
	setDefault: () => {}
	// EDIT: store sessions here?
	// EDIT: add username opt?
});

export default UserContext;
// EDIT: add? onlineStatus: 
