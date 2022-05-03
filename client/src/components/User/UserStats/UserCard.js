import classes from './UserCard.module.css';
import { useContext } from 'react';
import UserContext from '../../../store/user-context';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Graph1 from '../../GraphVisuals/PerformanceGraph/Graph1';

import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

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

    const HtmlTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
      ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
          backgroundColor: '#E5F8FC',
          color: 'rgba(0, 0, 0, 0.87)',
          maxWidth: 110,
          fontSize: theme.typography.pxToRem(12),
          border: '1px solid #dadde9',
        },
      }));
      

    return ( 
        // EDIT: THERE IS A BUG THE CONTEXT ONLY GETS UPDATED AFTER GOING TO DIF PAGE N COMING BACK
        <div className={classes.main}>
            <h2>Portfolio</h2>
            <div className={classes.wrapper}>
                <div className={classes.info}>
                    <div>
                    <HtmlTooltip title="The total value of all stocks you own" placement="right" arrow>
                        <h4 className={classes.attribute}> Portfolio Value: <span className={classes.value}>${userCtx.portfolioInfo.portfolio_value}</span> </h4>
                    </HtmlTooltip>
                    </div>
                    <HtmlTooltip title="Money you can use to buy stocks" placement="right" arrow>
                    <h4 className={classes.attribute}> Buying Power: <span className={classes.value}> ${userCtx.balance} </span> </h4>
                    </HtmlTooltip>
                </div>
                <div className={classes.graph}>
                    <Graph1 stockURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/historicPV/`}/>
                </div>
            </div>
        </div>
    );
}

export default UserCard;