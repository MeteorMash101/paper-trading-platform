import React from 'react'
import classes from './Login.module.css'
import { Fragment, useContext } from 'react';
import UserContext from '../../store/user-context';
import axios from 'axios';
import tempLogo from '../Header/templogo.jpg';
import { Navigate } from 'react-router-dom';
import GoogleButton from '../auth/GoogleButton';
import AuthAPIs from '../../APIs/AuthAPIs';

const Login = () => {
    const userCtx = useContext(UserContext);
    console.log("[Login.js]: userCtx CURRENT:", userCtx)
    const onLoginHandler = async (authData) => { // workaround to 'only being able to use hooks inside func. component' rule.
        let accountFromServer;
        let valid = true;
        try {
            console.log("SEEING IF EXISTS")
            //accountFromServer = await AuthAPIs.getExistingAccount(authData);
            accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${authData.token_type}/`, {
				params: {
					token: authData.access_token
				}
			})
        } catch (err) {
            console.log("ERROR: ", err)
            console.log("Account not found... creating new.");
            if(err.response.status === 401) {
                localStorage.clear();
                userCtx.setDefault();
                valid = false;
              } else {
                //accountFromServer = await AuthAPIs.createNewAccount(authData);
                accountFromServer = await axios.post(`http://127.0.0.1:8000/accounts/new/`, "",{
                params: {
                    token: authData.access_token
                },
                token: authData.access_token
            })
              }
            

        }
        if (valid) {
            localStorage.setItem("access_token", authData.access_token);
            localStorage.setItem("name", accountFromServer.data["name"]); 
            localStorage.setItem("email", accountFromServer.data["email"]); 
            localStorage.setItem("user_id", accountFromServer.data["google_user_id"]); 

            accountFromServer.data["isLoggedIn"] = true;
            console.log("userInfo in onLoginHandler: ", accountFromServer.data)
            console.log("Setting context...")
            userCtx.setUserOnLogin(accountFromServer.data)
        }
        
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
                        <div className={classes.about}>
                            <h4>
                            We are Team SWAT. Welcome to our Paper Trading Application. The goal of this application 
                            is to help beginners in the world of stocks to warm up to all the confusing abbreviations 
                            and seemingly foreign terminology without any risk. This means that you can buy, sell, 
                            compare and analyze stocks with ‘fake’ money that we provide to you. Now, whenever 
                            you feel ready to dive into the world of P/E ratios and candlesticks with your carefully preserved wallet out, 
                            head on over to something like Robinhood perhaps.
                            </h4>
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