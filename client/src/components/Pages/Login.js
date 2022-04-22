import React from 'react'
import classes from './Login.module.css'
import GoogleSocialAuth from '../auth/GoogleSocialAuth';
import { Fragment, useContext } from 'react';
import UserContext from '../../store/user-context';
import UserTab from '../Header/UserTab'
import axios from 'axios';
import MainFeed from './MainFeed';
import tempLogo from '../Header/templogo.jpg';


const Login = () => {

    const userCtx = useContext(UserContext);
    const onLoginHandler = async (userInfo) => { // workaround to 'only being able to use hooks inside func. component' rule.
        // Balance & stocklist attributes are unique to each user, fetch those from db.
        let accountFromServer;
        try {
            accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userInfo.user_id}/`)
            if (accountFromServer.data == "") {
                console.log("ACC. NOT FOUND, CREATING NEW");
                accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, {
                    name: userInfo.name,
                    email: userInfo.email,
                    google_user_id: userInfo.user_id,
                    // default balance, pv, etc.
                })
            } else {
                console.log("ACCOUNT FETCHED: ", accountFromServer.data);
            }
        } catch (err) {
            console.log("failed", err)
        }
        userInfo.balance = accountFromServer.data.balance
        console.log("IN onLoginHandler", userInfo)
        userCtx.setUserOnLogin(userInfo)
    };
    const onLogoutHandler = () => { // workaround to 'only being able to use hooks inside func. component' rule.
        userCtx.setDefault()
        // Remove local storage items
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        console.log("logged user out!")
    };
    console.log("useContext data in Header:", userCtx)

  return (
        <div className = {classes.border}>

            <div className={classes.left}>

                <div className={classes.name}>
                    <img src={tempLogo} className={classes.tempLogo} alt="Logo"/>       
                    <h2> SWAT PAPER TRADING </h2>   
                </div>

                <div className={classes.signin}>
                        <div className={classes.heading}>
                            <h2> Log in </h2>
                        </div>
                        
                        <div className={classes.logo}>
                            {!userCtx.isLoggedIn && <GoogleSocialAuth onLogin={onLoginHandler}/>}
                            {userCtx.isLoggedIn}
                        </div>
                        {/* {userCtx.isLoggedIn && <UserTab onLogout={onLogoutHandler}/>} */}
                </div>
            </div>

            <div className={classes.right}>
            </div>



        </div>
    
  )
}

export default Login