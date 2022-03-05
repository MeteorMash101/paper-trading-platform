import React, { useState, useEffect } from 'react';
import classes from './StockList.module.css';
import StockItem from './StockItem';
import axios from 'axios';

const StockList = ({title, stockListURL}) => {
  	// Only the "first" time this Component is loaded, do we pull everything from DB.
  	// From then on, ReactJS maintains separate state that is "in-sync" with the DB.
  	const [stockList, setStockList] = useState([]);
  	useEffect(() => {
		const fetchStocks = async () => {
			const stocksFromServer = await axios.get(stockListURL)
			console.log("[DEBUG]: stocks received from db:", stocksFromServer.data)
			setStockList(stocksFromServer.data)
		}
		fetchStocks()
  	}, []) // this DB retreival should only execute the first time this App is loaded.
	return (
		<div className={classes.container}>
			<h2 className={classes.title}>{title}</h2>
			{stockList.map((stock) => ( // making sure array exists first.
				<StockItem
					colorStyle={classes.neutral_blue}
					key={stock.id} // required for React warning...
					stock_id={stock.id}
					symbol={stock.symbol}
					company_name={stock.company_name}
					price={stock.price}
					change_direction={stock.change_direction}
					percent_change={stock.percent_change}
				/>
			))}
		</div>
	);
};

export default StockList;