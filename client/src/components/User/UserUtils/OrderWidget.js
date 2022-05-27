import classes from './OrderWidget.module.css';
import UserContext from '../../../store/user-context';
import { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import AccountsAPIs from '../../../APIs/AccountsAPIs';
import Alert from '../../Alerts/AlertMessage.js';
import Confetti from '../../Alerts/ConfettiShower';

const OrderWidget = ({livePrice, stock}) => {
    const userCtx = useContext(UserContext);
    const [orderType, setOrderType] = useState("BUY");
    const [shares, setShares] = useState(1);
    const [sharesOwned, setSharesOwned] = useState("...");
    const errorMsgs = ["Invalid! Balance too low.", "Invalid! Not enough shares."]
    const [isLoading, setIsLoading] = useState(false);
    const [displayMessage, setDisplayMessage] = useState("");
    const MS = 5000 // milliseconds
    const containerRef = useRef(null); // for confetti

    useEffect(async () => {
        let sharesOwnedFromServer
        try {
            sharesOwnedFromServer = await AccountsAPIs.getStocksSharesOwned(userCtx.user_id, stock.symbol)
		} catch (err) {
			if(err.response.status === 401) {
				localStorage.clear();
      			userCtx.setDefault();
			}
		}
        setSharesOwned(sharesOwnedFromServer)
	})

    useEffect(() => {
        if (displayMessage == "") { // means component loaded for first time...
            return;
        }
        // displayMessage is truthy...
        setTimeout(() => {
            setDisplayMessage("");
        }, MS);
	}, [displayMessage])

    // specific style ID.
    const orderTypeStyle = orderType == "BUY" ? classes.buy : classes.sell;
    const marketPrice = livePrice;
    let estimatedCost = parseFloat((marketPrice * shares).toFixed(2));
    const setBuyOrder = () => {
        setDisplayMessage("") // same as resetting alert
        setOrderType("BUY");
    }
    const setSellOrder = () => {
        setDisplayMessage("") // same as resetting alert
        setOrderType("SELL");
    }
    const setSharesHandler = (event) => {
        setShares(event.target.value);
    }
    const stockOrderHandler = async (event) => {
        event.preventDefault();
        // Error handling
        if (orderType == "BUY" && estimatedCost > userCtx.balance) {
            setDisplayMessage(errorMsgs[0])
            return // exit early.
        }
        if (orderType == "SELL" && shares > sharesOwned) {
            setDisplayMessage(errorMsgs[1])
            return // exit early.
        }
        setDisplayMessage("")
        // EDIT: can't sell more shares than user owns...
        const stockOrder = {
            orderType: orderType,
            shares: shares,
            marketPrice: marketPrice, // aka. price brought bought/sold at
            estimatedCost: estimatedCost,
        }
        // update user's buying power. (used to be called "Balance")
        // if BUY order, we need to subtract from curr. balance...so flip sign.
        if (orderType == "BUY") {
            estimatedCost = -Math.abs(estimatedCost)
        }
        setIsLoading(true)
        // post transaction log to db for this user
        let dataFromServer = await AccountsAPIs.postOrderTransaction(userCtx.user_id, orderType, stock, shares)
        userCtx.updateBalance(estimatedCost);
        setIsLoading(false)
        setDisplayMessage("SUCCESS")
    }
    return ( 
        <div className={classes.wrapper}>
            <form className={classes.container} id={orderTypeStyle} onSubmit={stockOrderHandler} ref={containerRef}>
                <div className={classes.orderType}>
                    <h3 className={classes.buyLabel} id={orderType == "BUY" ? "" : classes.buyNotSelected} onClick={setBuyOrder}>Buy {stock.symbol}</h3>
                    <h3 className={classes.sellLabel} id={orderType == "BUY" ? classes.sellNotSelected : ""} onClick={setSellOrder}>Sell {stock.symbol}</h3>
                </div>
                <div className={classes.options}><h4>Order Type: </h4><h4>"Market Order"</h4></div> 
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
                {!isLoading && displayMessage == "" && <button className={classes.orderBtn}>Submit Order</button>}
                {displayMessage == "SUCCESS" &&
                    <Alert severity="success" message="Successfully placed order!" size={22}/>
                }
                {displayMessage == "SUCCESS" &&
                    // pass in container's current width & height
                    <Confetti width={containerRef.current.clientWidth} height={containerRef.current.clientHeight}/>
                }
                {errorMsgs.includes(displayMessage) &&
                    <Alert severity="error" message={displayMessage} size={22}/>
                }
                <div className={classes.options}><h4>Current Balance: </h4><h4>{userCtx.balance}</h4></div>
            </form>
            {orderType == "BUY" && <Alert severity="info" message={`You currently own ${sharesOwned} shares`}/>}
            {orderType == "SELL" && <Alert severity="info" message={`You have ${sharesOwned} shares available`}/>}
        </div>
    );
}

export default OrderWidget;

// EDIT: change to 'Review Order' btn before submitting
// You are placing a good for day market order to sell 2 shares of AAPL.
// Order Summary: You’re placing an order to buy 2 shares of AMD that will be converted to a limit order with a 5% collar. If your order cannot be executed within the collar, it won’t be filled.
// [Submit Order]