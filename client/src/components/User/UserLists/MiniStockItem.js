import classes from './MiniStockItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { RiArrowUpCircleFill, RiArrowDownCircleFill } from "react-icons/ri";
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import { Fragment } from 'react';


const MiniStockItem = ({checkbox, symbol, shares, price, percent_change, change_direction, in_watch_list}) => {
    return (
        // EDIT: not able to fade out!!! halp.
        <Fragment>
    
        <input type="checkbox" value="check" className={classes.checkbox}/>
        

        <Link to={`/stock/${symbol}`} className={classes.container} id={in_watch_list ? classes.fadeOut : classes.fadeIn}>
            
            <div className={classes.symbol}>{symbol}</div>
            <div className={classes.shares}>{shares}</div>
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
        </Fragment>
    
    );
};

export default MiniStockItem;