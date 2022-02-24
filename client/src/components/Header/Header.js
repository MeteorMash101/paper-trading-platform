import classes from './Header.module.css';
import GoogleSocialAuth from '../auth/GoogleSocialAuth';
import SearchBar from './SearchBar';
import LogoNTitle from './LogoNTitle';
import { Fragment, useContext } from 'react';
import UserContext from '../../store/user-context';
import UserTab from './UserTab';
import axios from 'axios';

const Header = () => {
    const userCtx = useContext(UserContext);
    const onLoginHandler = async (userInfo) => { // workaround to 'only being able to use hooks inside func. component' rule.
        userCtx.setName(userInfo.name);
        userCtx.setUserID(userInfo.user_id);
        userCtx.setIsLoggedIn(userInfo.isLoggedIn);
        // Balance & stocklist attributes are unique to each user, fetch those from db.
        try {
            let accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userInfo.user_id}/`)
            console.log("ACCOUNT FETCHED: ", accountFromServer.data);
            if (accountFromServer.data == "") {
                console.log("ACC. NOT FOUND, CREATING NEW");
                accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, {
                    name: userInfo.name,
                    email: userInfo.email,
                    google_user_id: userInfo.user_id
                    // default balance.
                })
            }
        } catch (err) {
            console.log("failed", err)
        }
    };
    const onLogoutHandler = () => { // workaround to 'only being able to use hooks inside func. component' rule.
        userCtx.setDefault()
        // Remove local storage items
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        console.log("logged user out!")
    };
    console.log("context:", userCtx)
    return (
        <Fragment>
            <div className={classes.container}>
                <LogoNTitle/>
                <SearchBar/>
                {!userCtx.isLoggedIn && <GoogleSocialAuth onLogin={onLoginHandler}/>}
                {userCtx.isLoggedIn && <UserTab onLogout={onLogoutHandler}/>}
            </div>
            {/* HAVE THIS FADE msg... */}
            {/* {userCtx.isLoggedIn && <h2>Welcome {userCtx.name}!</h2>} */}
        </Fragment>
    );
};

export default Header;


