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
    console.log("Header component re-rendered", userCtx)
    const onLoginHandler = async (userInfo) => { // workaround to 'only being able to use hooks inside func. component' rule.
        // Balance & stocklist attributes are unique to each user, fetch those from db.
        let accountFromServer;
        try {
            accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userInfo.user_id}/`)
            if (accountFromServer.data == "") {
                console.log("Account not found... creating new.");
                accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, {
                    name: userInfo.name,
                    email: userInfo.email,
                    google_user_id: userInfo.user_id,
                    // default balance, pv, etc.
                })
            } else {
                console.log("Account found: ", accountFromServer.data);
            }
        } catch (err) {
            console.log("ERROR: ", err)
        }
        userInfo.balance = accountFromServer.data.balance
        console.log("userInfo in onLoginHandler: ", userInfo)
        console.log("Setting context...")
        userCtx.setUserOnLogin(userInfo)
        // NOTE: after this run ends, then context is updated (so it is not immediate).
    };
    const onLogoutHandler = () => { // workaround to 'only being able to use hooks inside func. component' rule.
        userCtx.setDefault()
        // Remove local storage items
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("name");
        localStorage.removeItem("email");
        localStorage.removeItem("user_id");
        console.log("Logged user out!")
    };
    return (
        <Fragment>
            <div className={classes.container}>
                <div className={classes.title}>
                    <Link to={`/`} className={classes.logoandtitle}>
                        <img src={tempLogo} className={classes.tempLogo} alt="Logo"/>
                        <h2 className={classes.heading}>SWAT PAPER TRADING
                        </h2>
                    </Link>
                </div>
                <div className={classes.searchbar}>
                    <SearchBar stockListURL={"http://127.0.0.1:8000/stocks/searchableStocks/"}/>
                </div>
                <div className={classes.signin}>
                    {!userCtx.isLoggedIn && <GoogleSocialAuth onLogin={onLoginHandler}/>}
                    {userCtx.isLoggedIn && <UserTab onLogout={onLogoutHandler}/>}
                </div>
            </div>
            {/* EDIT: HAVE THIS msg FADE... */}
        </Fragment>
    );
};

export default Header; 


