import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
//Source
//https://gist.github.com/pmckee11/13b1dffbf1d271a782ed7f65480b978f
//From:
//https://github.com/anthonyjgrove/react-google-login/issues/473
const googleUrl = 'https://accounts.google.com/gsi/client';

const GoogleButton = ({
  onCredentialResponse,
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(
    typeof window !== 'undefined' && typeof window.google !== 'undefined'
  );

  // Helmet does not support the onLoad property of the script tag, so we have to manually add it like so
  const handleChangeClientState = (newState, addedTags) => {
    if (addedTags && addedTags.scriptTags) {
      const foundScript = addedTags.scriptTags.find(
        ({ src }) => src === googleUrl
      );
      if (foundScript) {
        foundScript.addEventListener('load', () => setScriptLoaded(true), {
          once: true,
        });
      }
    }
  };

  const clickMe = async () => {
    const client = window.google.accounts.oauth2.initTokenClient({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/userinfo.profile \
                https://www.googleapis.com/auth/userinfo.email",
        callback: onCredentialResponse,
      });
    client.requestAccessToken();
}
//Button sourced from
//https://stackoverflow.com/questions/46654248/how-to-display-google-sign-in-button-using-html
  return (
    <>
      <HelmetProvider>
        <Helmet onChangeClientState={handleChangeClientState}>
          <script src={googleUrl} async defer />
        </Helmet>
      </HelmetProvider>
      <a class="btn btn-outline-dark" role="button" onClick={clickMe}>
      <img width="20px" style={{marginBottom:"3px", marginRight:"5px"}} alt="Google sign-in" src={"https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"} />
      Login with Google
      </a>
      <link   rel="stylesheet" 
        href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" 
        integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" 
        crossOrigin="anonymous"></link>
      <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" 
              integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" 
              crossOrigin="anonymous">
      </script>
    </>
  );
};

export default GoogleButton;