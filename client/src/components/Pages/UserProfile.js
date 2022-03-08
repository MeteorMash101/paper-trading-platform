import { useContext } from 'react';
import UserContext from '../../store/user-context';
import UserCard from '../UserCard.js';
import PieGraph from '../User/pieChart.js';
import PerformanceGraph from '../User/performanceGraph';
import { Box } from '@material-ui/core';
import StockHoldings from '../User/stockHoldings';
import classes from './UserProfile.module.css';
import CardTop from '../User/CardTop.js';
import Graph from '../Graph/Graph.js';
import Graph1 from '../PerformanceGraph/Graph1.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import UserStockList from '../UserStockList';

const UserProfile = () => {
    const userCtx = useContext(UserContext);
    // const [pvFetched, setPvFetched] = useState(false);
    const API_SWITCH = false;
    const MINUTE_MS = 3000; // 3 seconds = 3000
    useEffect(() => {
        const interval = setInterval(() => {
            const fetchStock = async () => {
                console.log('FETCHING PV...W/ USER CONTEXT:', userCtx)
                const pvDataFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
                    params: {
                        info: "portfolio_value"
                    }    
                })
                console.log("PV DATA:", pvDataFromServer.data)
                userCtx.setPortfolioInfo(pvDataFromServer.data);
                // setPvFetched(true);
            }
            if (!API_SWITCH) {
                fetchStock()
            }
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    return(
        <div className={classes.container}>
            <div className={classes.cardTop}>
                <CardTop/>
            </div>
            <div className={classes.wrapper}>
                <div className={classes.userCard}>
                    {/* <UserCard/> */}
                    <PieGraph/>
                </div>
                <div className={classes.lineChart}>
                    {/* <Box padding={5}> */}
                        <h2>PERFORMANCE GRAPH</h2>
                        <Graph1 stockURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/historicPV/`}/>
                    {/* </Box> */}
                </div>
                {/* <div className={classes.pieChart}>
                    <PieGraph/>
                </div> */}
                <div className={classes.stockHoldings}>
                    <UserStockList/>
                </div>
            </div>
        </div>
    );
}


export default UserProfile;