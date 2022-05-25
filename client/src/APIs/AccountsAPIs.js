import axios from "axios";
import {BASE_URL} from "../globals";

// NOTE: skipped extracting Google OAuth reqs (for now).

const getWatchListSymbols = async (user_id) => {
	const dataFetched = await axios.get(`${BASE_URL}/accounts/${user_id}/watchList/`, {
		params: {
			info: "detailed_stocks"
		}
	})
	let listOfTickers = dataFetched.data.stock_list.map((obj) => {return obj.symbol})
	return listOfTickers
}

const getStocksSharesOwned = async (user_id, stockSymbol) => {
	const dataFetched = await axios.get(`${BASE_URL}/accounts/${user_id}/getStocks/`, {
		params: {
			info: "num_of_ticker_stocks",
			symbol: stockSymbol.toLowerCase()
		}
	})
	return dataFetched.data.quantity_owned
}

const postOrderTransaction = async (user_id, orderType, stock, shares) => {
	const dataFromServer = await axios.put(`${BASE_URL}/accounts/${user_id}/getStocks/`,
		{
			action: orderType.toLowerCase(),
			stock: stock.symbol,
			quantity: shares
		}
	)
	return dataFromServer
}

// Fetching mini stock list for display.
const getUsersStocksOwned = async (user_id) => {
	const dataFetched = await axios.get(`${BASE_URL}/accounts/${user_id}/getStocks/`, {
		params: {
			info: "stock_list_display"
		}
	})
	return dataFetched
}

// Fetching user's watchlist for display.
const getUsersWatchlist = async (user_id) => {
	const dataFetched = await axios.get(`${BASE_URL}/accounts/${user_id}/watchList/`, {
		params: {
			info: "detailed_stocks"
		}
	})
	return dataFetched
}

const getPortfolioValueData = async (user_id) => {
	const dataFetched = await axios.get(`${BASE_URL}/accounts/${user_id}/getStocks/`, {
		params: {
			info: "portfolio_value"
		}    
	})
	return dataFetched
}

const getPortfolioValueHistoricalData = async (user_id) => {
	const dataFetched = await axios.get(`${BASE_URL}/accounts/${user_id}/historicPV/`)
	return dataFetched;
}

const getTransactionHistory = async (user_id) => {
	const dataFetched = await axios.get(`${BASE_URL}/accounts/${user_id}/transactionHistory/`)
	console.log("HERE", dataFetched)
	return dataFetched;
}

const addToWatchList = async (user_id, stockSymbol) => {
	await axios.put(`${BASE_URL}/accounts/${user_id}/watchList/`, {
		"symbol": stockSymbol
	})
}

const removeFromWatchList = async (user_id, stockSymbol) => {
	await axios.put(`${BASE_URL}/accounts/${user_id}/watchList/`, {
		"symbol": stockSymbol
	})
}

// NOTE: these methods return promises, be sure to unwrap them or use 'await' when calling!
const AccountsAPIs = {
	getWatchListSymbols: getWatchListSymbols,
	getStocksSharesOwned: getStocksSharesOwned,
	postOrderTransaction: postOrderTransaction,
	getUsersStocksOwned: getUsersStocksOwned,
	getUsersWatchlist: getUsersWatchlist,
	getPortfolioValueData: getPortfolioValueData,
	getPortfolioValueHistoricalData: getPortfolioValueHistoricalData,
	getTransactionHistory: getTransactionHistory,
	addToWatchList: addToWatchList,
	removeFromWatchList: removeFromWatchList,
}

export default AccountsAPIs;