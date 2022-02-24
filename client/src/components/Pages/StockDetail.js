import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classes from './StockDetail.module.css';
import axios from 'axios';
import OrderWidget from '../OrderWidget';
import Chart from '../Chart';
import KeyStats from '../KeyStats';
import Graph from '../Graph/Graph';

const StockDetail = () => {
    const TURN_OFF_LIVE_FETCH = true; // [DEBUG ONLY]: turn off live fetch during development, overload of requests!    const [stock, setStock] = useState("");
    const [stock, setStock] = useState("");
    const [livePrice, setLivePrice] = useState("");
    const { symbol } = useParams();
    // Pull the relevant stock info. from DB. using ticker symbol
    useEffect(() => {
        const fetchStock = async () => {
            const stockFromServer = await axios.get(`http://127.0.0.1:8000/stocks/${symbol}/`)
            console.log("[DEBUG]: stock received from db:", stockFromServer.data)
            setStock(stockFromServer.data)
            setLivePrice(stockFromServer.data.price) // set price right away.
        }
        fetchStock()
    }, []) // this DB retreival should only execute the first time this App is loaded.
    // useEffect (set timer) to fetch and display real-time stock info here...
    // EDIT: add css transition animation.
    // EDIT: add this whole thing in a sep. file for export/import?
    const MINUTE_MS = 5000; // 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const fetchStock = async () => {
                const livePriceFromServer = await axios.get(`http://127.0.0.1:8000/stocks/getPrice/${symbol}/`)
                console.log("CURRENT STOCK PRICE FETCHED:", livePriceFromServer.data)
                if (livePrice != livePriceFromServer.data.live_price) {
                    console.log("changing price!")
                    setLivePrice(livePriceFromServer.data.live_price);
                }
            }
            if (!TURN_OFF_LIVE_FETCH) {
                fetchStock()
            }
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])
    return (
        <div className={classes.container}>
            <h3>company name: {stock.company_name}</h3>
            <h3 >price: <span className={classes.animate}>{livePrice}</span></h3>
            <h3>average_volume: {stock.average_volume}</h3>
            <h3>high_today: {stock.high_today}</h3>
            <h3>low_today: {stock.low_today}</h3>
            <Graph/>
            <Chart/>
            <OrderWidget livePrice={livePrice} stock={stock}/>
            <KeyStats/>
        </div>
    );
}

export default StockDetail;