import classes from './OrderWidget.module.css';
import UserContext from '../store/user-context';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

const OrderWidget = ({livePrice, stock}) => {
    const userCtx = useContext(UserContext);
    const [orderType, setOrderType] = useState("BUY");
    const [shares, setShares] = useState(1);
    const [sharesOwned, setSharesOwned] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
		if (!userCtx.isLoggedIn || orderType != "SELL") {
			return
		}
		const fetchData = async() => {
			const dataFetched = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
				params: {
					info: "num_of_ticker_stocks",
                    symbol: stock.symbol.toLowerCase()
				}
			})
            setSharesOwned(dataFetched.data.quantity_owned)
		}
		fetchData()
	}, [userCtx.isLoggedIn, userCtx.balance, orderType])

    // specific style ID.
    const orderTypeStyle = orderType == "BUY" ? classes.buy : classes.sell;
    const marketPrice = livePrice;
    let estimatedCost = parseFloat((marketPrice * shares).toFixed(2));
    const setBuyOrder = () => {
        setErrorMsg("") // same as resetting
        setOrderType("BUY");
    }
    const setSellOrder = () => {
        setErrorMsg("") // same as resetting
        setOrderType("SELL");
    }
    const setSharesHandler = (event) => {
        setShares(event.target.value);
    }
    const stockOrderHandler = async (event) => {
        event.preventDefault();
        // Error handling
        if (orderType == "BUY" && estimatedCost > userCtx.balance) {
            setErrorMsg("Invalid! Balance too low.")
            return // exit early.
        }
        if (orderType == "SELL" && shares > sharesOwned) {
            setErrorMsg("Invalid! Not enough shares.")
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
        // update user's buying power. (used to be called "Balance")
        // if BUY order, we need to subtract from curr. balance...so flip sign.
        if (orderType == "BUY") {
            estimatedCost = -Math.abs(estimatedCost)
        }
        setIsLoading(true)
        // post transaction log to db for this user
        const dataFromServer = await axios.put(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`,
            {
                action: orderType.toLowerCase(),
                stock: stock.symbol,
                quantity: shares
            }
        )
        console.log("SUCCESS:", dataFromServer.data)
        userCtx.updateBalance(estimatedCost); // EDIT: should be called 'updateBalance'
        setShares(1);
        setIsLoading(false)
    }
    return ( 
        <form className={classes.container} id={orderTypeStyle} onSubmit={stockOrderHandler}>
            <div className={classes.orderType}>
                <h3 className={classes.buyLabel} id={orderType == "BUY" ? "" : classes.buyNotSelected} onClick={setBuyOrder}>Buy {stock.company_name}</h3>
                <h3 className={classes.sellLabel} id={orderType == "BUY" ? classes.sellNotSelected : ""} onClick={setSellOrder}>Sell {stock.company_name}</h3>
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
            {isLoading && <div className={classes.loader}><div></div><div></div><div></div></div>}
            {!isLoading && <button className={classes.orderBtn}>Submit Order</button>}
            <div className={classes.options}><h4>Current Balance: </h4><h4>{userCtx.balance}</h4></div>
            {orderType == "SELL" && <p className={classes.sharesAvailMsg}>{`You have ${sharesOwned} shares available`}</p>}
            {errorMsg != "" && <p className={classes.errorMsg}>{errorMsg}</p>}
        </form>
    );
}

export default OrderWidget;

// EDIT: change to 'Review Order' before submitting
// You are placing a good for day market order to sell 2 shares of AAPL.
// Order Summary: You’re placing an order to buy 2 shares of AMD that will be converted to a limit order with a 5% collar. If your order cannot be executed within the collar, it won’t be filled.
// [Submit Order] [Edit]