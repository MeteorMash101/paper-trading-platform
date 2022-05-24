import classes from './HistoryList.module.css';
import HistoryItem from './HistoryItem';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const HistoryList = ({title}) => {
	const userCtx = useContext(UserContext);
	const API_SWITCH = false;
    const MINUTE_MS = 3000; // 3 seconds = 3000

	const [usersStocks, setUsersStocks] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		setIsLoading(true)
		const interval = setInterval(() => {
			const fetchStock = async () => {
			console.log('FETCHING transaction history...W/ USER CONTEXT:', userCtx)
			const dataFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/transactionHistory/`)
			console.log("transaction history DATA:", dataFromServer.data)
			setUsersStocks(dataFromServer.data);
			setIsLoading(false)
		}

		if (!API_SWITCH) {
			fetchStock()
		}
	}, MINUTE_MS);
	return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [])

	// useState((usersStocks)=>[...usersStocks].slice().reverse())

	return (
		
		<div className={classes.container}>
			<h2 className={classes.title}>{title}</h2>
			{isLoading && <div className={classes.loader}></div>}
			{!isLoading &&
			usersStocks["transaction_history"]?.map((d) => (
				<HistoryItem
					key={d.id} // required for React warning...
					type = {d.type}
                    stock = {d.stock}
                    quantity={d.quantity}
					date ={d.date}
					stockPrice={d.stockPrice}
				/>
			)) } 
		</div>
	);
};

export default HistoryList;
