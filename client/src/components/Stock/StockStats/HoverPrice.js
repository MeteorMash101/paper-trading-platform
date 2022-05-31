import classes from './HoverPrice.module.css';
import { useContext } from 'react';
import HoverInfoContext from '../../../store/hover-info-context';

const HoverPrice = () => {
    const hoverInfoContext = useContext(HoverInfoContext);
    return (
        <div className={classes.price}>
            <span className={classes.hoverPrice}>{hoverInfoContext.price}</span>
                <span className={classes.hoverPricechange}> ${hoverInfoContext.priceChanges.dollar_change}</span>
                <span className={classes.hoverpercent}>{hoverInfoContext.priceChanges.percent_change}%</span>
        </div>
    )
}

export default HoverPrice;