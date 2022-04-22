import classes from './UserCard.module.css';
import { useContext } from 'react';
import UserContext from '../store/user-context';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Graph1 from './PerformanceGraph/Graph1';

const UserCard = () => {
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
    return ( 
        // EDIT: THERE IS A BUG THE CONTEXT ONLY GETS UPDATED AFTER GOING TO DIF PAGE N COMING BACK
        <div className={classes.main}>

            <h2>Portfolio</h2>


            <div className={classes.wrapper}>
                        <div className={classes.info}>
                            <h4 className={classes.attribute}> Portfolio Value: <span className={classes.value}>${userCtx.portfolioInfo.portfolio_value}</span> </h4>
                            <h4 className={classes.attribute}> Buying Power: <span className={classes.value}> ${userCtx.balance} </span> </h4>
                        </div>

                        <div className={classes.graph}>
                            <Graph1 stockURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/historicPV/`}/>
                        </div>
            </div>
        </div>
    );
}

export default UserCard;