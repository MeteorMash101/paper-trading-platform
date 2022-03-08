import classes from './UserCard.module.css';
import { useContext } from 'react';
import UserContext from '../store/user-context';
import { useState, useEffect } from 'react';
import axios from 'axios';

const UserCard = () => {
    const userCtx = useContext(UserContext);
    console.log("UserCard component re-rendered", userCtx)
    // API CALL: Fetch User's PV.
    useEffect(() => {
        if (!userCtx.isLoggedIn) {
			userCtx.setPortfolioInfo({
                portfolio_value: "0.00",
                percent_change: "%",
                change_direction: false,
            });
			return
		}
        const fetchData = async () => {
            console.log('FETCHING USERS PV...W/ CONTEXT:\n', userCtx)
            const dataFetched = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
                params: {
                    info: "portfolio_value"
                }
            })
            userCtx.setPortfolioInfo(dataFetched.data);
            console.log('userCtx PV Info set.') // EDIT: this should happen on every page re-load for now...?
        }
        fetchData()
    }, [userCtx.isLoggedIn]);
    return ( 
        // EDIT: THERE IS A BUG THE CONTEXT ONLY GETS UPDATED AFTER GOING TO DIF PAGE N COMING BACK...
        <div>
            <h1>Your Portfolio:</h1>
            {!userCtx.isLoggedIn && <p className={classes.message}>Please login to see your personal stats</p>}
            <div className={classes.container}>
                <h2 className={classes.label}>Portfolio Value:</h2>
                <h2>${userCtx.portfolioInfo.portfolio_value}</h2>
                <h2 className={classes.label}>Buying Power:</h2>
                <h2>${userCtx.balance}</h2>
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