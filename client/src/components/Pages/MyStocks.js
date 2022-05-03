import React from 'react'
import Graph from '../GraphVisuals/Graph/Graph';
import classes from './MyStocks.module.css';
import Header from '../Header/Header';
import Tabs from '../User/UserUtils/MyStockTabs';
import UserContext from '../../store/user-context';
import { Navigate } from 'react-router-dom';
import { Fragment, useContext } from 'react';

const MyStocks = () => {
  const userCtx = useContext(UserContext);
  return (
    <Fragment>
    {!userCtx.isLoggedIn && 
      // Redirect to /login - User must be logged in to view ALL pages...
      <Navigate to="/login"/>
    }
    {userCtx.isLoggedIn && 
      <div>
        <Header/>
        <div className={classes.container}>
          <div className={classes.graph}> 
            <Graph stockURL = {`http://127.0.0.1:8000/stocks/hist/fb`}/>
          </div>
          <Tabs/>
        </div>
      </div>
    }
    </Fragment>
  )

}

export default MyStocks