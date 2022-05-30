import classes from './Header.module.css';
import GoogleSocialAuth from '../auth/GoogleSocialAuth';
import UserContext from '../../store/user-context';
import SearchBar from './SearchBar';
import tempLogo from './templogo.jpg';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import React, { Fragment, useContext, useStyles } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles'
import {Tabs, Tab, AppBar} from '@material-ui/core';
import { CgProfile } from "react-icons/cg";
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import HistoryIcon from '@mui/icons-material/History';

const Header = () => {
    const userCtx = useContext(UserContext);
    // console.log("[Header.js]: userCtx CURRENT:", userCtx)
    const onLogoutHandler = () => { // workaround to 'only being able to use hooks inside func. component' rule.
        userCtx.setDefault()
        // Remove local storage items
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("user_id");
        console.log("Logged user out!")
        // Redirect to Login page...
    };

const [value, setValue] = React.useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

    return (
        <Fragment>
            <div className={classes.container}>
                <div className={classes.titleSection}>
                    <Link to={`/`} className={classes.logoandtitle}>
                        <img src={tempLogo} className={classes.tempLogo} alt="Logo"/>
                        <h2 className={classes.heading}>SWAT PAPER TRADING</h2>
                    </Link>
                </div>
                <div className={classes.searchbar}>
                    <SearchBar stockListURL={"http://127.0.0.1:8000/stocks/searchableStocks/"}/>
                </div>

                <div className={classes.tabs}>
                <Box sx={{ width: '100%' }}> 
                    <Tabs
                    value={value} 
                    onChange={handleChange}
                    TabIndicatorProps={{
                        style: {
                          backgroundColor: "grey",
                          marginBottom: '5px'
                         }
                        }}
                    >
                        <Tab icon={<PersonIcon/>} value="one" className={classes.tab1} component={Link} label="Profile" to="/user"/>
                        <Tab icon={<ShowChartIcon />} value="two" className={classes.tab2} component={Link} label="My Stocks" to="/mystocks"/>
                        <Tab icon={<HistoryIcon />} value="three" className={classes.tab3} component={Link} label="History" to="/history"/>
                        <Tab icon={<LogoutIcon />} value="four" className={classes.tab4} onClick={onLogoutHandler} label="Logout" />
                        
                    </Tabs>
                </Box>

                </div>
            </div>
        </Fragment>
    );
};

export default Header; 

