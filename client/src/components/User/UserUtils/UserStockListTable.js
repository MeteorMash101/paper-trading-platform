import classes from './UserStockListTable.module.css';
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../store/user-context';
import StocksOwnedContext from '../../../store/stocks-owned-context';
import AccountsAPIs from '../../../APIs/AccountsAPIs';
import StockListTableEntry from './StockListTableEntry';

const UserStockListTable = ({onSelect}) => {
	const userCtx = useContext(UserContext);
	const stocksOwnedCtx = useContext(StocksOwnedContext);
  	const [usersStocks, setUsersStocks] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	/* 	EDIT: need to .bind(this) to the table elements.
		import StocksOwnedContext from '../../store/stocks-owned-context'
		const stocksOwnedCtx = useContext(StocksOwnedContext); // for selling option from this page
	*/
	
	// API CALL: Fetch user's owned stocklist
	useEffect(async () => {
		setIsLoading(true)
		let dataFetched;
		try {
			dataFetched = await AccountsAPIs.getUsersStocksOwned(userCtx.user_id);
		} catch (err) {
			if(err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
		setUsersStocks(dataFetched.data.stock_list);
		setIsLoading(false)
	}, [userCtx.isLoggedIn, stocksOwnedCtx.stocksOwned])

  	return (
		<div>
			<div className={classes.list}> 
				<div className={classes.box}>
					<h5 className={classes.symbol}> Symbol </h5>
					<h5 className={classes.shares}> Quantity </h5>
					<h5 className={classes.price}> Price </h5>
					<h5 className={classes.change}> Daily Change</h5>
				</div>
				<div className={classes.holdings}>
					<div className={classes.container}>
						<div className={classes.container}>
							{isLoading && <div className={classes.loader}><div></div><div></div><div></div><div></div></div>}
							{!isLoading &&
								usersStocks.map((stock) => (
									<StockListTableEntry
										key={stock.id} // required for React warning...
										symbol={stock.symbol}
										shares={stock.shares}
										price={stock.price}
										percent_change={stock.percent_change}
										change_direction={stock.change_direction}
										in_list={stocksOwnedCtx.stocksOwned.has(stock.symbol)}
										onSelect={onSelect}
									/>
								))
							}
						</div>
					</div>
				</div> 
			</div>
		</div>
  	)
}

export default UserStockListTable;