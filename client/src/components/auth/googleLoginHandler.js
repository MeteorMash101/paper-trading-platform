import axios from "axios";
const drfClientId = process.env.REACT_APP_DRF_CLIENT_ID;
const drfClientSecret = process.env.REACT_APP_DRF_CLIENT_SECRET;
const baseURL = "http://localhost:8000";

const googleLoginHandler = async (response) => {
  let userInfo = new Object();
  console.log("res. obj: ", response.profileObj)
  try {
    let res = await axios.post(`${baseURL}/auth/convert-token`, 
      {
        token: response.accessToken,
        backend: "google-oauth2",
        grant_type: "convert_token",
        client_id: drfClientId,
        client_secret: drfClientSecret,
      }
    )
    console.log("res. data: ", res.data);
    const { access_token, refresh_token } = res.data;
    // Stored in local storage.
    localStorage.setItem("access_token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    userInfo.name = response.profileObj.name;
    userInfo.user_id = response.profileObj.googleId;
    userInfo.isLoggedIn = true;
    // For Account obj. instance
    userInfo.email = response.profileObj.email;

  } catch (err) {
    console.log("ERROR: w/ Google login handler...", err);
  }
  return userInfo
};

export default googleLoginHandler;