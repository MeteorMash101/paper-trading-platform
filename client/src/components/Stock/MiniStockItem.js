import classes from './MiniStockItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { RiArrowUpCircleFill, RiArrowDownCircleFill } from "react-icons/ri";


const MiniStockItem = ({symbol, shares, price, percent_change, change_direction}) => {

    var value = shares*price

    return (
        <div className={classes.container}>

            <div className={classes.check}> <input type="checkbox" name="checkbox" /> </div>
            
            <div className={classes.symbol}>{symbol}</div>
            <div className={classes.shares}>{shares}</div>
        
            <div className={classes.price}>${parseInt(price).toFixed(2)}</div>
            <div className={classes.value}> ${parseInt(value).toFixed(2)} </div>
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
        </div>
    );
};

export default MiniStockItem;