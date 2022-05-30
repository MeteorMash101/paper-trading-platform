import classes from './PriceStats.module.css';

const PriceStats = ({livePrice}) => {
    return (
        <div className={classes.container}>
            <span className={classes.livePrice}>${livePrice}</span>
            <span className={classes.priceChange}>+$25.44 (+5.65%) Past Year</span>
        </div>
    )
}

export default PriceStats;