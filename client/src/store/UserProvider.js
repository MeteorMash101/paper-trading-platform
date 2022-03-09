// The purpose of this User Provider component is to provide the state of the user to components that need it.
// (We build off of the user-context from before)
// Whenever the user state changes here, all users of this Provider will be re-evaluated.
import { useReducer, useState } from 'react';
import UserContext from './user-context';

const defaultUserState = { // this will actually be initialized when we first load the user from DB.
	name: "",
	user_id: "",
	isLoggedIn: false,
	balance: 5000.00, // EDIT: temp. val for testing
	portfolioInfo: {
		portfolio_value: "0.00",
		percent_change: "%",
		change_direction: false,
	}
};

// Action types...
const UPDATE_BALANCE = "UPDATE_BALANCE", SET_PORTFOLIO_INFO = "SET_PORTFOLIO_INFO", SET_USER_ON_LOGIN = "SET_USER_ON_LOGIN", SET_DEFAULT = "SET_DEFAULT";
// 'state' the last state snapshot, 'action' dispatched by you/your code.
const userReducer = (state, action) => { // NOTE: we are guranteed by useReducer to be working w/ the most recent 'state'.
	switch (action.type) {
		case UPDATE_BALANCE:
			return {
				...state,
				balance: parseFloat((state.balance + action.amount).toFixed(2)) 
			}
		case SET_PORTFOLIO_INFO:
			console.log(action.portfolioInfo)
			return {
				...state,
				portfolioInfo: action.portfolioInfo // EDIT: temp, this is an obj
			}
		case SET_USER_ON_LOGIN:
			return {
				...state,
				name: action.name,
				user_id: action.user_id,
				isLoggedIn: action.isLoggedIn,
				balance: parseFloat(action.balance),
			}
		case SET_PORTFOLIO_INFO:
			console.log("portfolioInfo obj:", action.portfolioInfo)
			return {
				...state,
				portfolioInfo: action.portfolioInfo // EDIT: temp, this is an obj
			}
		case SET_USER_ON_LOGIN:
			return {
				...state,
				name: action.name,
				user_id: action.user_id,
				isLoggedIn: action.isLoggedIn,
				balance: parseFloat(action.balance),
				// portfolioInfo: parseFloat(action.portfolioInfo)
			}
		case SET_DEFAULT:
			return defaultUserState;
		default: // safety
			return defaultUserState;
	}
};
const UserProvider = (props) => {
	// [useReducer hook]
	const [userState, dispatchUserAction] = useReducer(
		userReducer,
		defaultUserState
	);
	const updateBalanceHandler = (amount) => {
		dispatchUserAction({ type: UPDATE_BALANCE, amount: amount });
	}
	const setPortfolioInfoHandler = (portfolioInfo) => {
		dispatchUserAction({ type: SET_PORTFOLIO_INFO, portfolioInfo: portfolioInfo })
	}
	const setUserOnLoginHandler = (userInfo) => {
		dispatchUserAction({ 
			type: SET_USER_ON_LOGIN, 
			name: userInfo.name, 
			user_id: userInfo.user_id, 
			isLoggedIn: userInfo.isLoggedIn,  
			balance: userInfo.balance,
			// portfolioInfo: userInfo.portfolioInfo
		})
	}
	const setDefaultHandler = () => {
		dispatchUserAction({ type: SET_DEFAULT });
	};
	const userContext = {
		name: userState.name, 
		user_id: userState.user_id,
		isLoggedIn: userState.isLoggedIn,
		balance: userState.balance,
		portfolioInfo: userState.portfolioInfo,
		updateBalance: updateBalanceHandler,
		setPortfolioInfo: setPortfolioInfoHandler,
		setUserOnLogin: setUserOnLoginHandler,
		setDefault: setDefaultHandler // (resetting user for logout)
	};
	return (
		<UserContext.Provider value={userContext}>
			{/* Whatever components we wrap this Provider with, will have access to the user state. (check App.js)*/}
			{props.children}
		</UserContext.Provider>
	);
};

export default UserProvider;