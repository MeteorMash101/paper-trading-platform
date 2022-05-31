import classes from './PriceStats.module.css';

const PriceStats = ({livePrice, percChange}) => {
    return (
        <div className={classes.container}>
            <span className={classes.livePrice}>${livePrice}</span>
            {/* <span className={classes.priceChange}>{percChange}%</span> */}
        </div>
    )
}

export default PriceStats;