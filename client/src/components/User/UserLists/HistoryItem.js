import classes from './HistoryItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.

// data format
// {"type": "buy", "stock": "twtr", "quantity": 1, "date": "2022-04-12", "stockPrice": 44.47999954223633},

const HistoryItem = ({type, stock, quantity, date, stockPrice}) => {
    return (
        <div className={classes.container}>
            <div className={classes.date}> {date} </div>
            <div className={classes.type}>{type}</div>
            <div className={classes.stock}>{stock}</div>
            <div className={classes.quantity}>{quantity}</div>
            <div className={classes.stockPrice}>${parseInt(stockPrice).toFixed(2)}</div>
            {/* <div className={classes.totalValue}>${parseInt(stockPrice*quantity).toFixed(2)}</div>   */}
        </div>
    );
};

export default HistoryItem;