import classes from './WatchListItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";

const WatchListItem = ({symbol, price, percent_change, change_direction, in_list, onRemove}) => {
    return (
        <div className={classes.container} id={in_list ? classes.fadeOut : classes.fadeIn}>
            <Link className={classes.linkWrapper} to={`/stock/${symbol}`}>
                <div className={classes.symbol}>{symbol}</div>
                <div className={classes.price}>${parseInt(price).toFixed(2)}</div>
                {
                change_direction && <p className={classes.posChange}>+{parseInt(percent_change).toFixed(2)}%</p>
                }
                {
                change_direction && <BiUpArrow size={18} className={classes.upArrow}/>
                }
                {
                !change_direction && <p className={classes.negChange}>-{parseInt(percent_change).toFixed(2)}%</p>
                }
                {
                !change_direction && <BiDownArrow size={18} className={classes.downArrow}/>
                }
            </Link>
            <button className={classes.removeBtn} onClick={onRemove}>X</button>
        </div>
    );
};

export default WatchListItem;
