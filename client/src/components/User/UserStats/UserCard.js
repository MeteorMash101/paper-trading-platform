import classes from './UserCard.module.css';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import { useState, useEffect } from 'react';
import AccountsAPIs from '../../../APIs/AccountsAPIs';
import Graph from '../../GraphVisuals/PerformanceGraph/Graph';

const UserCard = () => {
    const userCtx = useContext(UserContext);
    // API CALL: Fetch User's PV.
    useEffect(async() => {
        let dataFetched;
        try {
            dataFetched = await AccountsAPIs.getPortfolioValueData(userCtx.user_id)
            console.log("[UserCard]: dataFetched", dataFetched);
		} catch (err) {
			if(err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
        userCtx.setPortfolioInfo(dataFetched.data);
    }, [userCtx.isLoggedIn]);
      
    return ( 
        <div className={classes.main}>
            <h2>Portfolio</h2>
            <div className={classes.wrapper}>
                <div className={classes.info}>
                    <h4 className={classes.attribute}> Portfolio Value: <span className={classes.value}>${userCtx.portfolioInfo.portfolio_value}</span> </h4>
                    <h4 className={classes.attribute}> Buying Power: <span className={classes.value}> ${userCtx.balance} </span> </h4>
                </div>
                <div className={classes.graph}>
                    <Graph/>
                </div>
            </div>
        </div>
    );
}

export default UserCard;


// DEPRECIATED:
// if (!userCtx.isLoggedIn) {
//     userCtx.setPortfolioInfo({
//         portfolio_value: "0.00",
//         percent_change: "%",
//         change_direction: false,
//     });
//     return
// }