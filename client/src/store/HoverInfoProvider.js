import { useReducer } from 'react';
import HoverInfoContext from './hover-info-context';

const defaultHoverInfoState = {
	price: 0,
};

const hoverInfoReducer = (state, action) => {
	if (action.type === 'SET_PRICE') {
		let updatedPrice = action.price
		return {
			...state,
			price: updatedPrice
		};
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

	const hoverInfoContext = {
		price: hoverInfoState.price,
		setPrice: setStockPriceOnHoverHandler,
	};

	return (
		<HoverInfoContext.Provider value={hoverInfoContext}>
			{props.children}
		</HoverInfoContext.Provider>
	);
};

export default HoverInfoProvider;
