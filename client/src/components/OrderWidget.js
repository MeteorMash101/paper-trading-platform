import classes from './OrderWidget.module.css';
import { useState } from 'react';
import { useContext } from 'react';
import UserContext from '../store/user-context';


const OrderWidget = ({stock}) => {
    const userCtx = useContext(UserContext);
    const [orderType, setOrderType] = useState("BUY");
    const [shares, setShares] = useState(1);
    const [errorMsg, setErrorMsg] = useState("");

    // specific style ID.
    const orderTypeStyle = orderType == "BUY" ? classes.buy : classes.sell;
    const marketPrice = stock.price;
    let estimatedCost = parseFloat((marketPrice * shares).toFixed(2));
    const setBuyOrder = () => {
        setOrderType("BUY");
    }
    const setSellOrder = () => {
        setOrderType("SELL");
    }
    const setSharesHandler = (event) => {
        setShares(event.target.value);
    }
    const stockOrderHandler = (event) => {
        event.preventDefault();
        // Error handling
        if (orderType == "BUY" && estimatedCost > userCtx.balance) {
            setErrorMsg("Invalid! Balance too low.")
            return // exit early.
        }
        setErrorMsg("")
        // EDIT: can't sell more shares than user owns...
        const stockOrder = {
            orderType: orderType,
            shares: shares,
            marketPrice: marketPrice, // aka. price brought bought/sold at
            estimatedCost: estimatedCost,
        }
        console.log("STOCK ORDER obj. data MADE: ", stockOrder)
        // update user balance
        // post transaction log to db for this user
        // if BUY order, we need to subtract from curr. balance...so flip sign.
        if (orderType == "BUY") {
            estimatedCost = -Math.abs(estimatedCost)
        }
        userCtx.setBalance(estimatedCost);
    }
    return ( 
        <form className={classes.container} id={orderTypeStyle} onSubmit={stockOrderHandler}>
            <div className={classes.orderType}>
                <h3 className={classes.buyLabel} onClick={setBuyOrder}>Buy {stock.company_name}</h3>
                <h3 className={classes.sellLabel} onClick={setSellOrder}>Sell {stock.company_name}</h3>
            </div>
            <div className={classes.options}><h4>Order Type: </h4><h4>"Fake Market Order"</h4></div> 
            <div className={classes.options}><h4>Shares: </h4>
                <input 
                    type="number" 
                    id="shares" 
                    placeholder="shares" 
                    className={classes.sharesInput} 
                    value={shares}
                    onChange={setSharesHandler}
                    min="1"
                />
            </div> 
            <div className={classes.options}><h4>Market Price: </h4><h4>{marketPrice}</h4></div> 
            <div className={classes.options}><h4>Estimated Cost: </h4><h4>{estimatedCost}</h4></div> 
            <button className={classes.orderBtn}>Review Order</button>
            <div className={classes.options}><h4>Current Balance: </h4><h4>{userCtx.balance}</h4></div>
            {errorMsg != "" && <p className={classes.errorMsg}>{errorMsg}</p>}
        </form>
    );
}

export default OrderWidget;