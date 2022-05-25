import axios from "axios";
import {BASE_URL} from "../globals";

const getStockList = async (listType) => {
    let dataFetched = null;
    if (listType == "Top Movers") {
        dataFetched = await axios.get(`${BASE_URL}/stocks/`)
    } else if (listType == "Popular Stocks") {
        dataFetched = await axios.get(`${BASE_URL}/stocks/popular`)
    }
    return dataFetched;
}

const getStockDetails = async (symbol) => {
    const dataFetched = await axios.get(`${BASE_URL}/stocks/${symbol}/`)
    return dataFetched;
}

const getStockPrice = async (symbol) => {
    const dataFetched = await axios.get(`${BASE_URL}/stocks/getPrice/${symbol}/`)
    return dataFetched;
}

const getQuarterlyEarnings = async (symbol) => {
    const dataFetched = await axios.get(`${BASE_URL}/stocks/quarterlyEarnings/${symbol}`)
    return dataFetched
}

// For search bar...
const getSearchableStocks = async () => {
    const dataFetched = await axios.get(`${BASE_URL}/stocks/searchableStocks/`)
    return dataFetched
}

const getStockHistoricalByDateRanges = async (symbol) => {
    const stockURL = `${BASE_URL}/stocks/historical/${symbol}`;
    let dataFetched = {}
    dataFetched.stockOneDayFromServer = await axios.get(stockURL, {
        params : {
            "dateRange": "1D"
        }
    });
    dataFetched.stockOneWeekFromServer = await axios.get(stockURL, {
        params : {
            "dateRange": "1W"
        }
    });
    dataFetched.stockOneMonthFromServer = await axios.get(stockURL, {
        params : {
            "dateRange": "1M"
        }
    });
    dataFetched.stockThreeMonthFromServer = await axios.get(stockURL, { 
        params : {
            "dateRange": "3M"
        }
    });
    dataFetched.stockSixMonthFromServer = await axios.get(stockURL, {
        params : {
            "dateRange": "6M"
        }
    });
    dataFetched.stockOneYearFromServer = await axios.get(stockURL, {
        params : {
            "dateRange": "1Y"
        }
    });
    dataFetched.stockFiveYearFromServer = await axios.get(stockURL, {
        params : {
            "dateRange": "5Y"
        }
    });
    return dataFetched
}

const getStockHistoricalForCandleStick = async (symbol) => {
    let array = []
    const dataFetched = await axios.get(`${BASE_URL}/stocks/hist/${symbol}`, { 
        params : {
            "start_date":"04/01/2017",
            "version": "new"
        }
    })
    dataFetched.data.historical_data.map(item => 
        {
            var sd = [item.date, item.open, item.high, item.low, item.close]
            array.push(sd)
        }
    )
    return array
}


// NOTE: these methods return promises, be sure to unwrap them or use 'await' when calling!
const StockAPIs = {
	getStockList: getStockList,
    getStockDetails: getStockDetails,
    getStockPrice: getStockPrice,
    getQuarterlyEarnings: getQuarterlyEarnings,
    getSearchableStocks: getSearchableStocks,
    getStockHistoricalByDateRanges: getStockHistoricalByDateRanges,
    getStockHistoricalForCandleStick: getStockHistoricalForCandleStick,
}

export default StockAPIs;