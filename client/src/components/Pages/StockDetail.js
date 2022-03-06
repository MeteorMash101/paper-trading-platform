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
            <div className={classes.name}>
                <h1>{stock.company_name} <span className={classes.animate}>${livePrice}</span> </h1>
                <h3 className={classes.symbol}>{stock.symbol}</h3>
            </div>

            <div className={classes.wrapper1}>
                <div className={classes.leftSec}>

                    <div className={classes.graph}>
                        {/* <Graph/> */}
                        <Graph stockURL = {`http://127.0.0.1:8000/stocks/hist/${symbol}`}/>
                    </div>

                    <div className={classes.wrapper}>
                        <div className={classes.stats1}>
                            <h4 className={classes.attribute}> Vol: <span className={classes.value}>{stock.volume} </span> </h4>
                            <h4 className={classes.attribute}> High: <span className={classes.value}>{stock.high_today} </span> </h4>
                            <h4 className={classes.attribute}> Low: <span className={classes.value}>{stock.low_today} </span> </h4>
                        </div>

                        <div className={classes.stats2}>
                            <h4 className={classes.attribute}> Mkt Cap: <span className={classes.value}>{stock.market_cap} </span> </h4>
                            <h4 className={classes.attribute}> P/E: <span className={classes.value}>{stock.pe_ratio} </span> </h4>
                            <h4 className={classes.attribute}> Avg Vol: <span className={classes.value}>{stock.average_volume} </span> </h4>
                        </div>

                        <div className={classes.stats3}>
                            <h4 className={classes.attribute}> 52W H: <span className={classes.value}>{stock.ft_week_high} </span> </h4>
                            <h4 className={classes.attribute}> 52W L: <span className={classes.value}>{stock.ft_week_low} </span> </h4>
                            <h4 className={classes.attribute}> Yeild: <span className={classes.value}>{stock.dividend_yield} </span> </h4>
                        </div>
                    </div>
                </div>

                <div className={classes.rightSec}>
                    <OrderWidget livePrice={livePrice} stock={stock}/>
                </div>
                
            </div>        
            {/* <Chart/> */}
            {/* <KeyStats/> */}
        </div>
    );
}

export default StockDetail;