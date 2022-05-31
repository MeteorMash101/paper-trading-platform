import { useReducer } from 'react';
import HoverInfoContext from './hover-info-context';

const defaultHoverInfoState = {
	price: 0,
	priceChanges: {dollar_change: 0.00, percent_change: 0.00}
};

const hoverInfoReducer = (state, action) => {
	if (action.type === 'SET_PRICE') {
		let updatedPrice = action.price
		return {
			...state,
			price: updatedPrice
		};
	} else if (action.type === 'SET_PRICE_CHANGES') {
		let updatedPriceChanges = {dollar_change: action.priceChanges.dollar_change.toFixed(2), percent_change: action.priceChanges.percent_change.toFixed(2)}
		// console.log("INSIDE HOVER UPDATE W/:", updatedPriceChanges)
		return {
			...state,
			priceChanges: updatedPriceChanges
		}
	}
	return defaultHoverInfoState; // safety
};

const HoverInfoProvider = (props) => {
	const [hoverInfoState, dispatchHoverInfoAction] = useReducer(
		hoverInfoReducer,
		defaultHoverInfoState
	);

	const setStockPriceOnHoverHandler = (price) => {
		dispatchHoverInfoAction({ type: 'SET_PRICE', price: price });
	};
	const setPriceChangesOnHoverHandler = (priceChanges) => {
		dispatchHoverInfoAction({ type: 'SET_PRICE_CHANGES', priceChanges: priceChanges });
	};

	const hoverInfoContext = {
		price: hoverInfoState.price,
		priceChanges: hoverInfoState.priceChanges,
		setPrice: setStockPriceOnHoverHandler,
		setPriceChanges: setPriceChangesOnHoverHandler,
	};

	return (
		<HoverInfoContext.Provider value={hoverInfoContext}>
			{props.children}
		</HoverInfoContext.Provider>
	);
};

export default HoverInfoProvider;
