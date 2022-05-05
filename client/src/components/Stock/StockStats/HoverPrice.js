import classes from './HoverPrice.module.css';
import { useContext } from 'react';
import HoverInfoContext from '../../../store/hover-info-context';

const HoverPrice = () => {
    const hoverInfoContext = useContext(HoverInfoContext);
    return (
        <span className={classes.hoverPrice}>{hoverInfoContext.price}</span>
        // EDIT: temp, if performance issue use this instead.
        // <span className={classes.hoverPrice}>0.00</span> 
    )
}

export default HoverPrice;