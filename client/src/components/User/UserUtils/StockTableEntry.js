import classes from './StockTableEntry.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import TableSymbolButton from './TableSymbolButton';
import { useState } from 'react';

const StockTableEntry = ({colorId, symbol, shares, price, percent_change, change_direction, in_list, IS_WATCHLIST_TABLE, onSelect}) => {
    const [mouseIsHovering, setIsMouseHovering] = useState(false);
    const onMouseEnterHandler = () => {
        setIsMouseHovering(true)
    }
    const onMouseLeaveHandler = () => {
        setIsMouseHovering(false)
    }

    console.log("[StockTableEntry.js] _color for _symbol:", colorId, symbol)
    return (
        // EDIT: not able to fade out!!! halp.
        <div className={classes.container} id={in_list ? classes.fadeOut : classes.fadeIn}>
            <input 
                className={classes.checkmark}
                type="checkbox"
                onChange={onSelect}
                id={symbol.toUpperCase()} // MUST BE UPPER CASE!
            />
            {/* NOTE: only this ticker becomes the link to the stock page, also has a style attribute to it to have a color ID. */}
            
            <Link to={`/stock/${symbol}`} className={classes.symbol} style={{ backgroundColor: colorId }} onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>{symbol.toUpperCase()}</Link>
            {mouseIsHovering && <TableSymbolButton/>}
            {!IS_WATCHLIST_TABLE && <div className={classes.shares}>{shares}</div>}
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

export default StockTableEntry;