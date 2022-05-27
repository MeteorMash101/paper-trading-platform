import React from 'react'
import classes from './Login.module.css'
import { Fragment, useContext } from 'react';
import UserContext from '../../store/user-context';
import axios from 'axios';
import tempLogo from '../Header/templogo.jpg';
import { Navigate } from 'react-router-dom';
import GoogleButton from '../auth/GoogleButton';

const Login = () => {
    const userCtx = useContext(UserContext);
    console.log("[Login.js]: userCtx CURRENT:", userCtx)
    const onLoginHandler = async (userInfo) => { // workaround to 'only being able to use hooks inside func. component' rule.
        let accountFromServer;
        try {
            console.log("SEEING IF EXISTS:", userInfo.access_token)
            accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userInfo.token_type}/`, {
				params: {
					token: userInfo.access_token
				}
			})
        } catch (err) {
            console.log("ERROR: ", err)
            console.log("Account not found... creating new.");
            accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, "",{
                params: {
                    token: userInfo.access_token
                },
                token: userInfo.access_token
            })
        }
        localStorage.setItem("access_token", userInfo.access_token);
        localStorage.setItem("name", accountFromServer.data["name"]); 
        localStorage.setItem("email", accountFromServer.data["email"]); 
        localStorage.setItem("user_id", accountFromServer.data["google_user_id"]); 

        accountFromServer.data["isLoggedIn"] = true;
        console.log(accountFromServer.data)
        console.log("userInfo in onLoginHandler: ", userInfo)
        console.log("Setting context...")
        userCtx.setUserOnLogin(accountFromServer.data)
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
                                    <GoogleButton onCredentialResponse={onLoginHandler}/>
                                </div>
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