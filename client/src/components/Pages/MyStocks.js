import React from 'react'
import classes from './MyStocks.module.css';
import Tabs from '../User/UserUtils/MyStockTabs';
import UserContext from '../../store/user-context';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import MotionWrapper from '../Alerts/MotionWrapper';

const MyStocks = () => {
  const userCtx = useContext(UserContext);
  return (
    <MotionWrapper>
      {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
        // Redirect to /login - User must be logged in to view ALL pages...
        <Navigate to="/login"/>
      }
      {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
        <div>
          <div className={classes.container}>
            <div className={classes.graph}> 
            </div>
            <div className={classes.table}> 
              <Tabs/>
            </div>
          </div>
        </div>
      }
    </MotionWrapper>
  )

}

export default MyStocks