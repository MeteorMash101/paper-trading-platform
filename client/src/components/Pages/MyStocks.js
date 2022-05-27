import React from 'react'
import classes from './MyStocks.module.css';
import Tabs from '../User/UserUtils/MyStockTabs';
import UserContext from '../../store/user-context';
import { Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import MotionWrapper from '../Alerts/MotionWrapper';
import Graph from '../GraphVisuals/Graph/Graph';
// import Graph from '../GraphVisuals/MyStocksGraph/Graph.js'
// import { getStockHistoricalByDateRanges } from '../../APIs/StocksAPIs'

const MyStocks = () => {
	const userCtx = useContext(UserContext);
	const [isMouseHovering, setIsMouseHovering] = useState(false);
    const onMouseHoverHandler = (bool) => {
        setIsMouseHovering(bool)
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
						<Graph symbol={"AAPL"} onHover={onMouseHoverHandler}/>
						{/* <Graph stockURL={`http://127.0.0.1:8000/stocks/hist/aapl`}/> */}
					</div>
					<div className={classes.table}> 
						<Tabs/>
					</div>
				</div>
			</div>
		}
	</MotionWrapper>
	);
}
export default MyStocks