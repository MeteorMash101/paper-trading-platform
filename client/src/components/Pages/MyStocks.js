import React from 'react'
import classes from './MyStocks.module.css';
import MyStocksTabsSwitch from '../User/UserUtils/MyStockTabsSwitch';
import UserContext from '../../store/user-context';
import { Navigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import MotionWrapper from '../Alerts/MotionWrapper';
import MultilineGraph from '../GraphVisuals/MultilineGraph/MultilineGraph';
import AccountsAPIs from '../../APIs/AccountsAPIs'

const MyStocks = () => {
	const userCtx = useContext(UserContext);
	const [stocksSelected, setStocksSelected] = useState([]);

	// const [isMouseHovering, setIsMouseHovering] = useState(false);
    // const onMouseHoverHandler = (bool) => {
    //     setIsMouseHovering(bool)
    // }

	useEffect(async() => {
		const temp = await AccountsAPIs.getStocksOwnedSymbols(userCtx.user_id)
		console.log("HERE", temp);
	});

	const onSelectHandler = (e) => {
		if (e.target.checked) { // means this was just checked
			setStocksSelected((prevStocksSelected) => {
				return [...prevStocksSelected, e.target.id.toUpperCase()]
			})
		} else { // just unchecked
			setStocksSelected((prevStocksSelected) => {
				return [...prevStocksSelected].filter(stockTicker => stockTicker != e.target.id.toUpperCase())
			})
		}
	}

	return (
	<MotionWrapper>
		{!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
			// Redirect to /login - User must be logged in to view ALL pages...
			<Navigate to="/login"/>
		}
		{userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
			<div>
				<div className={classes.container}>
					<div className={classes.graph}> 
						{/* NOT THIS GRAPH! */}
						{/* <Graph symbol={"AAPL"} onHover={onMouseHoverHandler}/> */}
						<MultilineGraph stocksSelected={stocksSelected}/>
					</div>
					<div className={classes.table}> 
						<MyStocksTabsSwitch onSelect={onSelectHandler}/>
					</div>
				</div>
			</div>
		}
	</MotionWrapper>
	);
}
export default MyStocks