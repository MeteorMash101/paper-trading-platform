import classes from './MiniStockItem.module.css';
import { Link } from 'react-router-dom';
import { RiArrowUpCircleFill, RiArrowDownCircleFill } from "react-icons/ri";


const MiniStockItem = ({symbol, shares, price, percent_change, change_direction}) => {
    return (
        <div className={classes.container}>
            <div className={classes.leftContainer}>
                <div className={classes.symbol}>{symbol}</div>
                <div className={classes.shares}>x{shares}</div>
            </div>
            <div className={classes.price}>{price}</div>
            {
            change_direction && <p className={classes.posChange}>+{percent_change}%</p>
            }
            {
            change_direction && <RiArrowUpCircleFill size={25} className={classes.upArrow}/>
            }
            {
            !change_direction && <p className={classes.negChange}>-{percent_change}%</p>
            }
            {
            !change_direction && <RiArrowDownCircleFill size={25} className={classes.downArrow}/>
            }
        </div>
    );
};

export default MiniStockItem;