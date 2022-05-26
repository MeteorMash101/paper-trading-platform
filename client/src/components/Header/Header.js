import classes from './Header.module.css';
import GoogleSocialAuth from '../auth/GoogleSocialAuth';
import UserContext from '../../store/user-context';
import UserTab from '../User/UserUtils/UserTab';
import SearchBar from './SearchBar';
import tempLogo from './templogo.jpg';
import { Link } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import {Tabs, Tab } from '@material-ui/core';
import AccountCircleSharpIcon from '@mui/icons-material/AccountCircleSharp';


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
                    <Tabs>
                        <Tab component={Link} label="Profile" to="/user"/>
                        <Tab component={Link} label="My Stocks" to="/mystocks"/>
                        <Tab component={Link} label="History" to="/history"/>
                        <Tab icon={<AccountCircleSharpIcon />} onClick={onLogoutHandler} aria-label="profile" />
                    </Tabs>
                </div>

            </div>
            {/* EDIT: HAVE THIS msg FADE (saying "welcome user")... */}
        </Fragment>
    );
};

export default Header; 


// DEPRECATED
{/* <div className={classes.signin}> */}
    // {/* {!userCtx.isLoggedIn && <GoogleSocialAuth onLogin={onLoginHandler}/>} */}
    // {userCtx.isLoggedIn && <UserTab onLogout={onLogoutHandler}/>}
// </div>
