import classes from './HistoryList.module.css';
import HistoryItem from './HistoryItem';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import { useEffect, useState, useRef } from 'react';
import AccountsAPIs from '../../../APIs/AccountsAPIs';

// Referring to -> "Transaction History"
const HistoryList = ({title}) => {
	const userCtx = useContext(UserContext);
	const [usersStocks, setUsersStocks] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	useEffect(async() => {
		setIsLoading(true)
		let dataFetched;
		try {
			dataFetched = await AccountsAPIs.getTransactionHistory(userCtx.user_id);
		} catch (err) {
			if(err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
		setUsersStocks(dataFetched.data);
		setIsLoading(false)
	}, [])

	return (
		<div className={classes.container}>
			<h2 className={classes.title}>{title}</h2>
			{isLoading && <div className={classes.loader}></div>}
			{!isLoading &&
			usersStocks["transaction_history"]?.map((d) => (
				<HistoryItem
					key={d.id} // required for React warning...
					type = {d.type.toUpperCase()}
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
