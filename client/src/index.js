import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import UserProvider from './store/UserProvider';
import WatchlistProvider from './store/WatchlistProvider';
import HoverInfoProvider from './store/HoverInfoProvider';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <WatchlistProvider>
        <HoverInfoProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </HoverInfoProvider>
      </WatchlistProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
