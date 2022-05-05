import classes from './HoverPrice.module.css';
import { useContext } from 'react';
import HoverInfoContext from '../../../store/hover-info-context';

const HoverPrice = () => {
    const hoverInfoContext = useContext(HoverInfoContext);
    return (
        <span className={classes.hoverPrice}>{hoverInfoContext.price}</span>
    )
}

export default HoverPrice;