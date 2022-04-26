import React from 'react'
import classes from './TransHistory.module.css';
import Header from '../Header/Header';
import HistoryList from '../User/UserLists/HistoryList';

const History = () => {
  return (
    <div>
      <div className={classes.container}>
        <HistoryList title={"Transaction History"}/>
      </div>
    </div>
  )
}

export default History;