import React from 'react'
import classes from './History.module.css';
import Header from '../Header/Header';
import HistoryList from '../Stock/HistoryList';

const History = () => {
  return (
    <div>
      <Header/>
      <div className={classes.container}>
        <HistoryList title={"Transaction History"}/>
      </div>
    </div>
  )
}

export default History;