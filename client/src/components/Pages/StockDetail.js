import { useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import classes from './StockDetail.module.css';
import OrderWidget from '../User/UserUtils/OrderWidget';
import Graph from '../GraphVisuals/Graph/Graph';
import React, { Component } from "react";
import { Navigate } from 'react-router-dom';
import UserContext from '../../store/user-context';
import CandleStick from '../GraphVisuals/CandleStick/CandleStick';
import HoverPrice from '../Stock/StockStats/HoverPrice';
import PriceStats from '../Stock/StockStats/PriceStats';
import QEChart from '../GraphVisuals/QEChart/QEChart';
import StockAPIs from '../../APIs/StocksAPIs';
import { LIVE_FETCH, TIMER } from '../../globals';
import MotionWrapper from '../Alerts/MotionWrapper';
import LiveIndicator from '../Alerts/LiveIndicator';

const StockDetail = () => {
    const userCtx = useContext(UserContext);
    const [stock, setStock] = useState("");
    const [livePrice, setLivePrice] = useState("");
    const [isMouseHovering, setIsMouseHovering] = useState(false);
    const [showFull, setShowFull] = useState(false);
    const { symbol } = useParams();
    const onMouseHoverHandler = (bool) => {
        setIsMouseHovering(bool)
    }
    const [graphMode, setGraphMode] = useState("GRAPH");
    const onGraphModeHandler = (e) => {
        if (e.target.name == "GRAPH") {
            setGraphMode("GRAPH")
        } else { // we were just in candlestick mode
            setGraphMode("CANDLESTICK")
        }
    }
    const setShowFullHandler = (e) => {
        if (e.target.id == "viewFull") {
            setShowFull(true)
        } else {
            setShowFull(false)
        }
    }
    // Pull the relevant stock info. from DB. using ticker symbol
    useEffect(async() => {
        const dataFetched = await StockAPIs.getStockDetails(symbol)
        setStock(dataFetched.data)
        setLivePrice(dataFetched.data.price) // set price right away.
    }, []) // this DB retreival should only execute the first time this App is loaded.
    
    // live price fetching w/ timer.
    useEffect(() => {
        const interval = setInterval(() => {
            const fetchStockPrice = async () => {
                const dataFetched = await StockAPIs.getStockPrice(symbol)
                if (livePrice != dataFetched.data.live_price) {
                    console.log("changing price!")
                    setLivePrice(dataFetched.data.live_price);
                }
            }
            if (LIVE_FETCH) {
                fetchStockPrice()
            }
        }, TIMER);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    return (
        <MotionWrapper>
            {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
                // Redirect to /login - User must be logged in to view ALL pages...
                <Navigate to="/login"/>
            }
            {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
                <div className={classes.everything}>
                <div className={classes.container}>
                    <div className={classes.nameSect}>
                        <h1 className={classes.companyName}>
                            {stock.company_name} 
                            {!isMouseHovering && <PriceStats livePrice={livePrice}/>}
                            {isMouseHovering && <HoverPrice/>}
                        </h1>
                        <div className={classes.miniContainer}>
                            <h3 className={classes.symbol}>{stock.symbol}</h3>
                            {isMouseHovering && <LiveIndicator message={`Current Price: ${livePrice}`}/>}
                        </div>
                    </div>
                    <div className={classes.wrapper1}>
                        <div className={classes.leftSec}>
                            <div className={classes.graph}>
                                {graphMode === "GRAPH" &&
                                    <Graph symbol={symbol} onHover={onMouseHoverHandler} onGraphMode={onGraphModeHandler}/>
                                }
                                {graphMode === "CANDLESTICK" &&
                                    <CandleStick symbol={symbol} onGraphMode={onGraphModeHandler}/>
                                }
                            </div>
                            <div className={classes.wrapper}>
                                <div className={classes.stats1}>
                                    <div className={classes.wrapperHeader}>
                                        <h3> Key Statistics </h3>
                                    </div>
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
                            
                            <div className={classes.qe}>
                                <h3>Quarterly Earnings</h3>
                                <QEChart symbol={symbol}/>
                            </div>
                            
                        </div>
                        <div className={classes.rightSec}>
                            <OrderWidget livePrice={livePrice} stock={stock}/>
                            <div className={classes.about} id={showFull ? "" : classes.hideSummary}>
                                <h3>About {stock.company_name}</h3>
                                 <div className={classes.summary}>
                                    &emsp;&emsp;{stock.summary}
                                </div>
                            </div>
                            {!showFull && <button className={classes.viewFull} id="viewFull" onClick={setShowFullHandler}>View Full...</button>}
                            {showFull && <button className={classes.hide} id="hide" onClick={setShowFullHandler}>Hide</button>}
                        </div>
                    </div>        
                </div>
                </div>
            }
        </MotionWrapper>
    );
}

export default StockDetail;