import classes from './HoverPrice.module.css';
import { useContext } from 'react';
import HoverInfoContext from '../../../store/hover-info-context';

const HoverPrice = () => {
    const hoverInfoContext = useContext(HoverInfoContext);
    return (
        <div>
            <span className={classes.hoverPrice}>{hoverInfoContext.price}</span>
            <span className={classes.hoverPrice}>${hoverInfoContext.priceChanges.dollar_change}</span>
            <span className={classes.hoverPrice}>{hoverInfoContext.priceChanges.percent_change}%</span>
        </div>
    )
}

export default HoverPrice;