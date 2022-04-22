import React from 'react';
import { useContext } from 'react';
import UserContext from '../../store/user-context';
import { useState, useEffect } from 'react';
import axios from 'axios';
import classes from './CardTop.module.css';
import MiniInfoBox from '../Pages/MiniInfoBox';
import { FaHome, FaSitemap } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { GiNightSleep } from "react-icons/gi";
import { AiOutlineSetting } from "react-icons/ai";
import Avatar from '@mui/material/Avatar';
import { blue } from '@material-ui/core/colors';


const CardTop = () => {


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
        <div>
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