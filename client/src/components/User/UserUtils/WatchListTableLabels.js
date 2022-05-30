import classes from './WatchListTableLabels.module.css';

const WatchListTableLabels = () => {
  return (
    <div className={classes.list}> 
      <div className={classes.box}>
        <h5 className={classes.symbol}> Symbol </h5>
        <h5 className={classes.price}> Price </h5>
        <h5 className={classes.change}> Daily Change</h5>
      </div>
    </div>
  )
}

export default WatchListTableLabels;