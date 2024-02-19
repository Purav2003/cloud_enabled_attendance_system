"use client";
import { useEffect } from 'react';
import { google } from 'googleapis';

const clientId = '396686002693-k7g8t52ua3em5f32pns8932gs5h4fcm4.apps.googleusercontent.com';
const scope = 'https://www.googleapis.com/auth/userinfo.email';

const GoogleLogin = () => {
  useEffect(() => {
    // Load Google's client library
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    script.onload = () => {
      gapi.load('auth2', () => {
        const auth2 = gapi.auth2.init({ client_id: clientId });
        auth2.attachClickHandler('google-login-button', {}, onSuccess, onFailure);
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const onSuccess = async (googleUser) => {
    const idToken = googleUser.getAuthResponse().id_token;
    // You can now send this idToken to your backend for further authentication
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  };

  const onFailure = (error) => {
    console.log(error);
  };

  return <div id="google-login-button">Login with Google</div>;
};

export default GoogleLogin;
