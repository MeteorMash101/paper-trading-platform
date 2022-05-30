import React from 'react';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import { useEffect } from 'react';
import classes from './CardTop.module.css';
import MiniInfoBox from './MiniInfoBox';
import Avatar from '@mui/material/Avatar';
import AccountsAPIs from '../../../APIs/AccountsAPIs';
import { LIVE_FETCH, TIMER } from '../../../globals'

const CardTop = () => {
    const userCtx = useContext(UserContext);
    // live fetching of PV.
    useEffect(async() => {
        let dataFetched;
        try {
            dataFetched = await AccountsAPIs.getPortfolioValueData(userCtx.user_id);
        } catch (err) {
            if (err.response.status === 401) {
                localStorage.clear();
                userCtx.setDefault();
            }
        }
    }, [])

    return (
        <div>
            {/* EDIT: please separate out this Profile component below! */}
            <div className={classes.cardTop}>
                <Avatar className={classes.img} sx={{ width: 70, height: 70, bgcolor: "#b3e5fc" }}>{userCtx.name.charAt(0)}</Avatar>
                <h2 className={classes.heading}>{userCtx.name}</h2>
            </div>
            <div className={classes.cardMid}>
                <MiniInfoBox label={"Portfolio Value"} val={userCtx.portfolioInfo.portfolio_value}/>
                <MiniInfoBox label={"Buying Power"} val={userCtx.balance}/>
            </div>
        </div>
  );
}

export default CardTop;

// DEPRECIATED:
// const interval = setInterval(() => {
//     const fetchPV = async () => {

//         if (userCtx.portfolioInfo.portfolio_value != dataFetched.data) {
//             userCtx.setPortfolioInfo(dataFetched.data);
//         }
//     }
//     if (LIVE_FETCH) {
//         fetchPV()
//     }
// }, TIMER);
// return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.