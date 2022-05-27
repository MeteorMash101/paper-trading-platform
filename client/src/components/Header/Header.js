import classes from './Header.module.css';
import UserContext from '../../store/user-context';
import SearchBar from './SearchBar';
import tempLogo from './templogo.jpg';
import { Link } from 'react-router-dom';
import { Fragment, useContext, useState } from 'react';
import {Tabs, Tab } from '@material-ui/core';
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

    const [value, setValue] = useState('one');

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const blue = {
        50: '#F0F7FF',
        100: '#C2E0FF',
        200: '#80BFFF',
        300: '#66B2FF',
        400: '#3399FF',
        500: '#007FFF',
        600: '#0072E5',
        700: '#0059B2',
        800: '#004C99',
        900: '#003A75',
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
                    <SearchBar/>
                </div>
                <div className={classes.tabs}>
                    <Tabs value={value} variant="fullWidth" aria-label="secondary tabs example" indicatorColor="primary" onChange={handleChange}>
                        <Tab icon={<PersonIcon/>} value="one" className={classes.tab1} component={Link} label="Profile" to="/user"/>
                        <Tab icon={<ShowChartIcon />} value="two" className={classes.tab2} component={Link} label="My Stocks" to="/mystocks"/>
                        <Tab icon={<HistoryIcon />} value="three" className={classes.tab3} component={Link} label="History" to="/history"/>
                        <Tab icon={<LogoutIcon />} onClick={onLogoutHandler} label="Logout" />
                    </Tabs>
                </div>
            </div>
            {/* EDIT: HAVE THIS msg FADE (saying "welcome user")... */}
        </Fragment>
    );
};

export default Header; 