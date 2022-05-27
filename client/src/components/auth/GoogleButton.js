import React, { useState } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import classes from './GoogleButton.module.css';
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
  return (
    <>
      <HelmetProvider>
        <Helmet onChangeClientState={handleChangeClientState}>
          <script src={googleUrl} async defer />
        </Helmet>
      </HelmetProvider>
      <button class={classes.googleButton} onClick={clickMe}>
        Login with Google
      </button>
      
    </>
  );
};

export default GoogleButton;