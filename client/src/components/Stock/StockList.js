import classes from './StockList.module.css';
import StockItem from './StockItem';


const StockList = ({stockList}) => {
    return (
        <div className={classes.container}>
            <h1>STOCKS LISTINGS:</h1>
            {/* useEffect (set timer) to fetch and display updated stock info here... */}
            {stockList.map((stock) => ( // making sure array exists first.
                <StockItem
                    key={stock.id} // required for React warning...
                    stock_id={stock.id}
                    symbol={stock.symbol}
                    company_name={stock.company_name}
                    price={stock.price}
                    percent_change={stock.percent_change}
                    change_direction={stock.change_direction}
                />
            ))}
        </div>
    );
};

export default StockList;