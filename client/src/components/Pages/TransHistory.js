import React from 'react'
import classes from './TransHistory.module.css';
import Header from '../Header/Header';
import HistoryList from '../User/UserLists/HistoryList';

const History = () => {
  return (
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
            <h4 className={classes.names}>Price</h4>
            <h4 className={classes.names}>Total Value</h4>
          </div>  
        </div>
        <div className={classes.content}>
          <HistoryList/>
        </div>
      </div>
    </div>
  )
}

export default History;