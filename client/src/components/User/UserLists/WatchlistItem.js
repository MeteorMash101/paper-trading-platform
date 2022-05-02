import classes from './WatchlistItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";


const WatchlistItem = ({symbol, price, percent_change, change_direction, in_watch_list}) => {
    return (

        <Link to={`/stock/${symbol}`} className={classes.container} id={in_watch_list ? classes.fadeOut : classes.fadeIn}>
            <div className={classes.symbol}>{symbol}</div>
            <div className={classes.price}>${parseInt(price).toFixed(2)}</div>
            {
            change_direction && <p className={classes.posChange}>+{parseInt(percent_change).toFixed(2)}%</p>
            }
            {
            change_direction && <BiUpArrow size={18} className={classes.upArrow}/>
            }
            {
            !change_direction && <p className={classes.negChange}>{parseInt(percent_change).toFixed(2)}%</p>
            }
            {
            !change_direction && <BiDownArrow size={18} className={classes.downArrow}/>
            }
        </Link>
    );
};

export default WatchlistItem;