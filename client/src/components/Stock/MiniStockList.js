import classes from './MiniStockList.module.css';
import MiniStockItem from './MiniStockItem';
import { useContext } from 'react';
import UserContext from '../../store/user-context';
import { useEffect, useState } from 'react';
import axios from 'axios';

const MiniStockList = ({title, usersStocksURL}) => {
	const dummyData = [ // temp
		{
			symbol: "dummy",
			shares: "[count]",
			price: "[currPrice]",
			percent_change: "[0.00]",
			change_direction: true
		},
		{
			symbol: "dummy",
			shares: "[count]",
			price: "[currPrice]",
			percent_change: "[0.00]",
			change_direction: false
		}
	]
	const userCtx = useContext(UserContext);
  	const [usersStocks, setUsersStocks] = useState(dummyData);
	// API CALL: Fetch user's owned stocklist
	useEffect(() => {
		if (!userCtx.isLoggedIn) {
			setUsersStocks(dummyData)
			return
		}
		console.log('FETCHING USERS STOCKLIST...W/ CONTEXT:\n', userCtx)
		const fetchData = async() => {
			const dataFetched = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
				params: {
					info: "stock_list_display"
				}
			})
			setUsersStocks(dataFetched.data.stock_list);
		}
		fetchData()
	}, [userCtx.isLoggedIn])
	return (
		<div className={classes.container}>
			<h1 className={classes.title}>{title}</h1>
			{usersStocks.map((stock) => (
				<MiniStockItem
					key={stock.id} // required for React warning...
					symbol={stock.symbol.toUpperCase()}
                    shares={stock.shares}
					price={stock.price}
					percent_change={stock.percent_change}
                    change_direction={stock.change_direction}
				/>
			))}
		</div>
	);
};

export default MiniStockList;
