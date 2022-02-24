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
};

// Action types...
const SET_NAME = "SET_NAME", SET_USER_ID = "SET_USER_ID", SET_IS_LOGGED_IN = "SET_IS_LOGGED_IN", SET_DEFAULT = "SET_DEFAULT", SET_BALANCE = "SET_BALANCE";
// 'state' the last state snapshot, 'action' dispatched by you/your code.
const userReducer = (state, action) => { // NOTE: we are guranteed by useReducer to be working w/ the most recent 'state'.
	switch (action.type) {
		case SET_NAME:
			return {
				...state,
				name: action.name
			}
		case SET_USER_ID:
			return {
				...state,
				user_id: action.user_id
			}
		case SET_IS_LOGGED_IN:
			return {
				...state,
				isLoggedIn: action.isLoggedIn
			}
		case SET_BALANCE:
			return {
				...state,
				balance: parseFloat((state.balance + action.amount).toFixed(2)) 
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
	const setNameHandler = (name) => {
		dispatchUserAction({ type: SET_NAME, name: name });
	};

	const setUserIDHandler = (user_id) => {
		dispatchUserAction({ type: SET_USER_ID, user_id: user_id });
	};
	const setIsLoggedInHandler = (isLoggedIn) => {
		dispatchUserAction({ type: SET_IS_LOGGED_IN, isLoggedIn: isLoggedIn });
	};
	const setBalanceHandler = (amount) => {
		dispatchUserAction({ type: SET_BALANCE, amount: amount });
	}
	const setDefaultHandler = () => {
		dispatchUserAction({ type: SET_DEFAULT });
	};
	const userContext = {
		name: userState.name, 
		user_id: userState.user_id,
		isLoggedIn: userState.isLoggedIn,
		balance: userState.balance,
		setName: setNameHandler,
		setUserID: setUserIDHandler,
		setIsLoggedIn: setIsLoggedInHandler,
		setBalance: setBalanceHandler,
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