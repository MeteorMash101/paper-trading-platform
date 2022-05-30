import classes from './StockListTableLabels.module.css';

const StockListTableLabels = () => {
  	return (
		<div className={classes.box}>
			<h5 className={classes.symbol}> Symbol </h5>
			<h5 className={classes.shares}> Quantity </h5>
			<h5 className={classes.price}> Price </h5>
			<h5 className={classes.change}> Daily Change</h5>
		</div>
  	)
}

export default StockListTableLabels;