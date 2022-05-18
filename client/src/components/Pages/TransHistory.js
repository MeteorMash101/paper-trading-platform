import React from 'react'
import classes from './TransHistory.module.css';
import Header from '../Header/Header';
import HistoryList from '../User/UserLists/HistoryList';
import { Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../../store/user-context';
import { motion } from 'framer-motion';

const History = () => {
  const userCtx = useContext(UserContext);
  return (
    <motion.div 
    initial= {{opacity:0, x:100}} 
    animate = {{opacity: 1, x:0}}
    exit = {{opacity: 0, x:-100}}
    transition={{ duration: 0.7}}>
    <Fragment>
    {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
        // Redirect to /login - User must be logged in to view ALL pages...
        <Navigate to="/login"/>
    }
    {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
      <div>
        <Header/>
        <div className={classes.container}>
          <h2>Transaction History</h2>
          <div className={classes.header}>
            <div className={classes.headings}>
              <h4 className={classes.names}>Date</h4>
              <h4 className={classes.names}>Type</h4>
              <h4 className={classes.stock}>Stock</h4>
              <h4 className={classes.names}>Quantity</h4>
              <h4 className={classes.price}>Price</h4>
              <h4 className={classes.names}>Total Value</h4>
            </div>  
          </div>
          <div className={classes.content}>
            <HistoryList/>
          </div>
        </div>
      </div>
    }
    </Fragment>
    </motion.div>
  )
}

export default History;