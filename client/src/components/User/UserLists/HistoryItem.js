import classes from './HistoryItem.module.css';

// data format
// {"type": "buy", "stock": "twtr", "quantity": 1, "date": "2022-04-12", "stockPrice": 44.47999954223633},

const HistoryItem = ({type, stock, quantity, date, stockPrice}) => {
    return (
        <div className={classes.container}>
            <div className={classes.content}>
                <p className={classes.date}> {date} </p>
                <p className={classes.type}>{type}</p>
                <p className={classes.stock}>{stock}</p>
                <p className={classes.quantity}>{quantity}</p>
                <p className={classes.stockPrice}>${parseInt(stockPrice).toFixed(2)}</p>
                <p className={classes.totalValue}>${parseInt(stockPrice*quantity).toFixed(2)}</p>  
            </div>
            
        </div>
    );
};

export default HistoryItem;