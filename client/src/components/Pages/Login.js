import React from 'react'
import classes from './Login.module.css'
import GoogleSocialAuth from '../auth/GoogleSocialAuth';
import { Fragment, useContext } from 'react';
import UserContext from '../../store/user-context';
import axios from 'axios';
import tempLogo from '../Header/templogo.jpg';
import { Navigate } from 'react-router-dom';

const Login = () => {
    const userCtx = useContext(UserContext);
    console.log("[Login.js]: userCtx CURRENT:", userCtx)
    const onLoginHandler = async (userInfo) => { // workaround to 'only being able to use hooks inside func. component' rule.
        let accountFromServer;
        try {
            accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userInfo.user_id}/`)
        } catch (err) {
            console.log("ERROR: ", err)
            console.log("Account not found... creating new.");
                accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, {
                    name: userInfo.name,
                    email: userInfo.email,
                    google_user_id: userInfo.user_id,
                    // default balance, pv, etc.
                })
        }
        userInfo.balance = accountFromServer.data.balance
        console.log("userInfo in onLoginHandler: ", userInfo)
        console.log("Setting context...")
        userCtx.setUserOnLogin(userInfo)
        // NOTE: after this run ends, then context is updated (so it is not immediate).
    };
    return (
        <Fragment>
            {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
                <div className={classes.border}>
                    <div className={classes.left}>
                        <div className={classes.name}>
                            <img src={tempLogo} className={classes.tempLogo} alt="Logo"/>       
                            <h2>SWAT PAPER TRADING</h2>   
                        </div>
                        <div className={classes.signin}>
                                <div className={classes.heading}>
                                    <h2>Log in</h2>
                                </div>
                                <div className={classes.logo}>
                                    <GoogleSocialAuth onLogin={onLoginHandler}/>
                                </div>
                                {/* {userCtx.isLoggedIn && <UserTab onLogout={onLogoutHandler}/>} */}
                        </div>
                    </div>
                    <div className={classes.right}>
                    </div>
                </div>
            }
            {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
                // Redirect to Main Feed page...(if user is now logged in)
                <Navigate to="/"/>
            }
        </Fragment>
    )
}

export default Login