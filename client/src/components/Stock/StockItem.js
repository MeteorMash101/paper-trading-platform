import classes from './StockItem.module.css';
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import { Link } from 'react-router-dom';

const StockItem = ({stock_id, symbol, company_name, price, percent_change, change_direction}) => {
  const randColor = [classes.red, classes.blue, classes.green, classes.yellow] // EDIT: random color for now...
  const colorStyle = randColor[Math.floor(Math.random() * 3)]
  return (
    <Link to={`/stock/${symbol}`} className={classes.stockLink}>
      <div className={classes.container} onClick={() => console.log("Clicked on a stock.")}>
        <h4 className={classes.symbol} id={colorStyle}>{symbol}</h4>
        <p className={classes.company_name}>{company_name}</p>
        <p className={classes.price}>{price}</p>
        {
          change_direction && <p className={classes.percent_change} id={classes.posChange}>{percent_change}</p>
        }
        {
          change_direction && <BiUpArrow size={25} className={classes.upArrow}/>
        }
        {
          !change_direction && <p className={classes.percent_change} id={classes.negChange}>{percent_change}</p>
        }
        {
          !change_direction && <BiDownArrow size={25} className={classes.downArrow}/>
        }
      </div>
    </Link>
  );
};

export default StockItem;