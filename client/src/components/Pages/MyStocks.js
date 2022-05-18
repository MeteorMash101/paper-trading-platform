import React from 'react'
import Graph from '../GraphVisuals/Graph/Graph';
import classes from './MyStocks.module.css';
import Header from '../Header/Header';
import Tabs from '../User/UserUtils/MyStockTabs';
import UserContext from '../../store/user-context';
import { Navigate } from 'react-router-dom';
import { Fragment, useContext } from 'react';
import { motion } from 'framer-motion';

const MyStocks = () => {
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
          <div className={classes.graph}> 
            {/* <Graph stockURL = {`http://127.0.0.1:8000/stocks/hist/fb`}/> */}
          </div>
          <div className={classes.table}> 
            <Tabs/>
          </div>
        </div>
      </div>
    }
    </Fragment>
    </motion.div>
  )

}

export default MyStocks