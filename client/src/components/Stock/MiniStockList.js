import classes from './MiniStockList.module.css';
import MiniStockItem from './MiniStockItem';
import { useContext } from 'react';
import UserContext from '../../store/user-context';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MiniStockList = ({title}) => {
	const userCtx = useContext(UserContext);
  	const [usersStocks, setUsersStocks] = useState([
		{
			symbol: "dummy",
			shares: "[count]",
			price: "[currPrice]",
			percent_change: "[0.00]",
			change_direction: true
		}
	  ]);
	// EDIT: this isn't loading the first time comp. is mounted...
	useEffect(() => async () => {
		console.log('FETCHING stock_list_display...W/ USER CONTEXT:', userCtx)
		const dataFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
			params: {
				info: "stock_list_display"
			}
		})
		console.log("stock_list_display DATA:", dataFromServer.data.stock_list)
		setUsersStocks(dataFromServer.data.stock_list);
	})
	return (
		<div className={classes.container}>
			{/* <h1 className={classes.title}>{title}</h1> */}
			{usersStocks.map((stock) => (
				<MiniStockItem
					key={stock.id} // required for React warning...
					symbol={stock.symbol}
                    shares={stock.shares}
					price={stock.price}
					percent_change={stock.percent_change}
					// value={(stock.price*stock.shares)}
                    change_direction={stock.change_direction}
				/>
			))}
		</div>
	);
};

export default MiniStockList;


// const USING_DUMMY_DATA = false;

// {
// 	symbol: "AAPL",
// 	shares: "[count]",
// 	price: "[currPrice]",
// 	percent_change: "[%]",
// 	change_direction: "[+/-]"
//   },
//   {
// 	symbol: "MSFT",
// 	shares: "[count]",
// 	price: "[currPrice]",
// 	percent_change: "[%]",
// 	change_direction: "[+/-]"
//   },
//   {
// 	symbol: "TSLA",
// 	shares: "[count]",
// 	price: "[currPrice]",
// 	percent_change: "[%]",
// 	change_direction: "[+/-]"
//   },
