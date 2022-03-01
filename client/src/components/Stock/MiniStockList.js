import classes from './MiniStockList.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MiniStockItem from './MiniStockItem';

const MiniStockList = ({title, usersStocksURL}) => {
    const USING_DUMMY_DATA = true;
  	const [usersStocks, setUsersStocks] = useState([
          {
            symbol: "AAPL",
            shares: "[count]",
            price: "[currPrice]",
            percent_change: "[%]",
            change_direction: "[+/-]"
          },
          {
            symbol: "MSFT",
            shares: "[count]",
            price: "[currPrice]",
            percent_change: "[%]",
            change_direction: "[+/-]"
          },
          {
            symbol: "TSLA",
            shares: "[count]",
            price: "[currPrice]",
            percent_change: "[%]",
            change_direction: "[+/-]"
          },
      ]);
  	useEffect(() => {
		const fetchStocks = async () => {
			const stocksFromServer = await axios.get(usersStocksURL)
			console.log("[DEBUG]: user's stocks received from db:", stocksFromServer.data)
			setUsersStocks(stocksFromServer.data)
		}
        if (!USING_DUMMY_DATA) {
            fetchStocks()
        }
  	}, [])
	return (
		<div className={classes.container}>
			<h1 className={classes.title}>{title}</h1>
			{usersStocks.map((stock) => (
				<MiniStockItem
					key={stock.id} // required for React warning...
					symbol={stock.symbol}
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