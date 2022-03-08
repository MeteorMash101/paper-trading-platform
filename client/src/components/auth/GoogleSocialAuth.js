import { GoogleLogin } from "react-google-login";
import googleLoginHandler from './googleLoginHandler';
// get env vars
const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const GoogleSocialAuth = (props) => {
	const onGoogleLoginSuccess = async (response) => {
		console.log("LOGIN SUCCESS:", response);
		console.log("Sending to handler...", response);
		let userInfo = await googleLoginHandler(response);
		console.log("Retrieved user information: ", userInfo)
		// Store user info. in context (if we didn't fail)
		props.onLogin(userInfo)
		console.log("Context set in GoogleSocialAuth.")
	}
	const onGoogleLoginFailure = (response) => {
		console.log("ERROR: Failed login: ", response);
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