import classes from './StockListTableEntry.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";

const StockListTableEntry = ({symbol, shares, price, percent_change, change_direction, in_list, onSelect}) => {
    return (
        // EDIT: not able to fade out!!! halp.
        <div className={classes.container} id={in_list ? classes.fadeOut : classes.fadeIn}>
            <input 
                type="checkbox"
                onChange={onSelect}
                id={symbol.toUpperCase()} // MUST BE UPPER CASE!
            />
            {/* NOTE: only this ticker becomes the link to the stock page, also has a style attribute to it to have a color ID. */}
            <Link to={`/stock/${symbol}`} className={classes.symbol} style={{ backgroundColor: "#d53e4f" }}>{symbol}</Link>
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
        </div>
    );
};

export default StockListTableEntry;