import classes from './MiniStockItem.module.css';
import { Link } from 'react-router-dom';
import { RiArrowUpCircleFill, RiArrowDownCircleFill } from "react-icons/ri";


const MiniStockItem = ({symbol, shares, price, percent_change, change_direction}) => {
    return (
        <div className={classes.container}>
            {/* <div className={classes.leftContainer}> */}
            <h4 className={classes.symbol}>{symbol}</h4>
            <p >{shares}</p>
            {/* </div> */}
            {/* <p className={classes.price}>{price}</p>
            {
            change_direction && <p className={classes.percent_change} id={classes.posChange}>+{percent_change}%</p>
            }
            {
            change_direction && <RiArrowUpCircleFill size={25} className={classes.upArrow}/>
            }
            {
            !change_direction && <p className={classes.percent_change} id={classes.negChange}>{percent_change}%</p>
            }
            {
            !change_direction && <RiArrowDownCircleFill size={25} className={classes.downArrow}/>
            } */}
        </div>
    );
};

export default MiniStockItem;