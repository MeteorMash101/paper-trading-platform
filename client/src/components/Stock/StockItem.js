import classes from './StockItem.module.css';
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import { GrAddCircle } from "react-icons/gr";
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const StockItem = ({colorStyle, symbol, company_name, price, percent_change, change_direction}) => {
  const TURN_OFF_LIVE_FETCH = true; // [DEBUG ONLY]: turn off live fetch during development, overload of requests!
  const [livePrice, setLivePrice] = useState(price);
  const MINUTE_MS = 5000; // 5 seconds
  useEffect(() => {
      const interval = setInterval(() => {
          const fetchStock = async () => {
              const livePriceFromServer = await axios.get(`http://127.0.0.1:8000/stocks/getPrice/${symbol}/`)
              console.log("CURRENT STOCK PRICE FETCHED:", livePriceFromServer.data)
              // For testing:
              // 88
              // Math.floor(Math.random() * max);
              if (livePrice != livePriceFromServer.data.live_price) {
                  console.log("changing price!")
                  setLivePrice(livePriceFromServer.data.live_price);
              }
          }
          if (!TURN_OFF_LIVE_FETCH) {
            fetchStock()
          }
      }, MINUTE_MS);
      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [])
  const addToWatchListHandler = (event) => {
    console.log("added to WL");
    // setShares(event.target.value);
  }
  return (
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
        < GrAddCircle className={classes.watchlist} size={20} onClick={addToWatchListHandler}/>
        {/* {
          !inWatchList && <IoIosCheckmarkCircleOutline size={23} onClick={addToWatchListHandler}/>
        } */}
      </div>
    </Link>
  );
};

export default StockItem;