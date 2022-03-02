import classes from './UserCard.module.css';
import { useContext } from 'react';
import UserContext from '../store/user-context';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserCard = () => {
    const userCtx = useContext(UserContext);
    // const [pvFetched, setPvFetched] = useState(false);
    const MINUTE_MS = 3000; // 3 seconds
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
            fetchStock()
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])
    return ( 
        // EDIT: THERE IS A BUG THE CONTEXT ONLY GETS UPDATED AFTER GOING TO DIF PAGE N COMING BACK...
        <div>
            <h1>Your Portfolio:</h1>
            {!userCtx.isLoggedIn && <p className={classes.message}>Please login to see your personal stats...dummy data:</p>}
            <div className={classes.container}>
            <h2 className={classes.label}>Portfolio Value: ${userCtx.portfolioInfo.portfolio_value}</h2>
                <h2 className={classes.label}>Buying Power: ${userCtx.balance}</h2>
                {userCtx.portfolioInfo.change_direction && <h5 className={classes.labelPos}>{userCtx.portfolioInfo.percent_change}%</h5>}
                {!userCtx.portfolioInfo.change_direction && <h5 className={classes.labelNeg}>{userCtx.portfolioInfo.percent_change}%</h5>}
                <p className={classes.label}>[Today]</p>
                <b>**[Insert Graph Here]**</b>
                <p className={classes.label}>More Info.</p>
            </div>
        </div>
    );
}

export default UserCard;