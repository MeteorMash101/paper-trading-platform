import classes from './MiniStockItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { RiArrowUpCircleFill, RiArrowDownCircleFill } from "react-icons/ri";


const MiniStockItem = ({symbol, shares, price, percent_change, change_direction, in_watch_list}) => {
    return (
        // EDIT: not able to fade out!!! halp.
        <Link to={`/stock/${symbol}`} className={classes.container} id={in_watch_list ? classes.fadeOut : classes.fadeIn}>
            <div className={classes.leftContainer}>
                <div className={classes.symbol}>{symbol}</div>
                <div className={classes.shares}>x{shares}</div>
            </div>
            <div className={classes.price}>${parseInt(price).toFixed(2)}</div>
            {
            change_direction && <p className={classes.posChange}>+{parseInt(percent_change).toFixed(2)}%</p>
            }
            {/* {
            change_direction && <RiArrowUpCircleFill size={25} className={classes.upArrow}/>
            } */}
            {
            !change_direction && <p className={classes.negChange}>{parseInt(percent_change).toFixed(2)}%</p>
            }
            {/* {
            !change_direction && <RiArrowDownCircleFill size={25} className={classes.downArrow}/>
            } */}
        </Link>
    );
};

export default MiniStockItem;