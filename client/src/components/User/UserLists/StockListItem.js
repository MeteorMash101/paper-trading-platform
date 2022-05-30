import classes from './StockListItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { FcCheckmark } from "react-icons/fc";
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import { useState } from 'react';


const StockListItem = ({symbol, shares, price, percent_change, change_direction, in_watch_list}) => {
    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const onClickHandler = () => {
        setShowOrderConfirm(true);
    }
    return (
        // EDIT: not able to fade out!!! halp.
        <div className={classes.container} id={in_watch_list ? classes.fadeOut : classes.fadeIn}>
            <Link className={classes.linkWrapper} to={`/stock/${symbol}`}>
                <div className={classes.symbol}>{symbol.toUpperCase()}</div>
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
            {!showOrderConfirm &&
                <button className={classes.removeBtn} onClick={onClickHandler}>Sell</button>
            }
            {showOrderConfirm &&
                <div className={classes.qtyNConfirmContainer}>
                    <input className={classes.qtyInput} type="number" id="quantity"  min="1" max={shares}/>
                    <FcCheckmark className={classes.confirm}/>
                </div>
            }
        </div>
    );
};

export default StockListItem;