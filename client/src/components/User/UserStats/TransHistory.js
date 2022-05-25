import React from 'react'
import classes from './TransHistory.module.css';
import HistoryList from '../UserLists/HistoryList';

const TransHistory = () => {
  return (
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
  )
}

export default TransHistory;