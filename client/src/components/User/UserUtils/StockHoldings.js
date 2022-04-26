import classes from './StockHoldings.module.css';
import MiniStockList from '../UserLists/MiniStockList';

const StockHoldings = () => {
  return (
    <div>
      <div className={classes.list}> 
        <div className={classes.box}>
          <div className={classes.symbol}><h5> Symbol </h5></div>
          <div className={classes.shares}><h5> Quantity </h5></div>
          <div className={classes.price}><h5> Price </h5></div>
          <div className={classes.value}><h5> Current Value </h5></div>
          <div className={classes.change}><h5> Daily Change</h5></div>
        </div>
        <MiniStockList title={"Stock Holdings"}/>
      </div>
    </div>
  )
}

export default StockHoldings;