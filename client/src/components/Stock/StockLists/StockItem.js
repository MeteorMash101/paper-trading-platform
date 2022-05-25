import classes from './StockItem.module.css';
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import { GrAddCircle } from "react-icons/gr";
import { FcCheckmark } from "react-icons/fc";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StockAPIs from '../../../APIs/StocksAPIs';
import { LIVE_FETCH, TIMER } from '../../../globals';

const StockItem = ({colorStyle, symbol, company_name, price, percent_change, change_direction, in_watch_list, onAdd, onRemove}) => {
  // NOTE: turn off live fetch during development, overload of requests!
  const [livePrice, setLivePrice] = useState(price);
  // live price fetching w/ timer.
  useEffect(() => {
    const interval = setInterval(() => {
      const fetchStockPrice = async () => {
        const dataFetched = await StockAPIs.getStockPrice(symbol)
        if (livePrice != dataFetched.data.live_price) {
          console.log("changing price!")
          setLivePrice(dataFetched.data.live_price);
        }
      }
      if (LIVE_FETCH) {
        fetchStockPrice()
      }
    }, TIMER);
    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])

  return (
    <div className={classes.wrapper}>
      <Link to={`/stock/${symbol}`} className={classes.stockLink}>
        <div className={classes.container}>
          <h4 className={classes.symbol} id={colorStyle}>{symbol}</h4>
          <p className={classes.company_name}>{company_name}</p>
          <p className={classes.price}> $ {livePrice}</p>
          {
            change_direction && <p className={classes.percent_change} id={classes.posChange}>+{percent_change}%</p>
          }
          {
            change_direction && <BiUpArrow size={18} className={classes.upArrow}/>
          }
          {
            !change_direction && <p className={classes.percent_change} id={classes.negChange}>{percent_change}%</p>
          }
          {
            !change_direction && <BiDownArrow size={18} className={classes.downArrow}/>
          }
        </div>
      </Link>
      {!in_watch_list && 
        <GrAddCircle className={classes.watchListBtn} id={classes.tooltipBG} size={23} onClick={onAdd}>
          <span className={classes.tooltip}>TOOLTIP TEST</span>
        </GrAddCircle>
      }
      {in_watch_list && <FcCheckmark className={classes.watchListBtn} id={classes.tooltipBG} size={23} onClick={onRemove}/>}
    </div>

  );
};

export default StockItem;