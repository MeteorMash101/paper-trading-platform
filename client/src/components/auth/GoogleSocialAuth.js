import { useContext, useState } from 'react';
import UserContext from '../../store/user-context';
import { GoogleLogin } from "react-google-login";
import googleLoginHandler from './googleLoginHandler';
// get env vars
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleSocialAuth = (props) => {
	const userCtx = useContext(UserContext);

	const onGoogleLoginSuccess = async (response) => {
		console.log("SUCCESS LOGIN:", response);
		console.log("Sending to handler...", response);
		let userInfo = await googleLoginHandler(response);
		console.log("Retrieved user information: ", userInfo)
		// Store user info. in context (if we didn't fail)
		props.onLogin(userInfo)
		console.log("Context updated.")
	}
	const onGoogleLoginFailure = (response) => {
		console.log("FAILED LOGIN:", response);
	}
	return (
		<div>
			<GoogleLogin
				clientId={googleClientId}
				buttonText="Sign in with Google"
				onSuccess={onGoogleLoginSuccess}
				onFailure={onGoogleLoginFailure}
			/>
		</div>
	);
};

export default GoogleSocialAuth;