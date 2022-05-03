import classes from './Header.module.css';
import GoogleSocialAuth from '../auth/GoogleSocialAuth';
import UserContext from '../../store/user-context';
import UserTab from '../User/UserUtils/UserTab';
import SearchBar from './SearchBar';
import tempLogo from './templogo.jpg';
import { Link } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import axios from 'axios';

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
                <div className={classes.title}>
                    <Link to={`/`} className={classes.logoandtitle}>
                        <img src={tempLogo} className={classes.tempLogo} alt="Logo"/>
                        <h2 className={classes.heading}>SWAT PAPER TRADING</h2>
                    </Link>
                </div>
                <div className={classes.searchbar}>
                    <SearchBar stockListURL={"http://127.0.0.1:8000/stocks/searchableStocks/"}/>
                </div>
                <div className={classes.signin}>
                    {/* {!userCtx.isLoggedIn && <GoogleSocialAuth onLogin={onLoginHandler}/>} */}
                    {userCtx.isLoggedIn && <UserTab onLogout={onLogoutHandler}/>}
                </div>
            </div>
            {/* EDIT: HAVE THIS msg FADE (saying "welcome user")... */}
        </Fragment>
    );
};

export default Header; 


