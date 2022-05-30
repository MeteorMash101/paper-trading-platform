import classes from './StockListItem.module.css';
import { Link } from 'react-router-dom'; // needs to link to specific stock page.
import { FcCheckmark } from "react-icons/fc";
import { BiUpArrow } from "react-icons/bi";
import { BiDownArrow } from "react-icons/bi";
import { useState, useContext } from 'react';
import AccountsAPIs from '../../../APIs/AccountsAPIs';
import UserContext from '../../../store/user-context';
import { FcCancel } from "react-icons/fc";


const StockListItem = ({symbol, shares, price, percent_change, change_direction, in_list}) => {
    const userCtx = useContext(UserContext);
    const [showOrderConfirm, setShowOrderConfirm] = useState(false);
    const [sharesSelected, setSharesSelected] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const onClickSellHandler = () => {
        setShowOrderConfirm(true);
    }
    const setSharesSelectedHandler = (event) => {
        setSharesSelected(event.target.value);
    }
    let estimatedCost = parseFloat((price * sharesSelected).toFixed(2));
    const onClickCheckHandler = async(e) => { // SELL ONLY.        
        e.preventDefault();
        // Error handling:
        if (sharesSelected > shares) {
            return
        }
        // EDIT: why we not using this obj?! (also problem in OrderWidget.js)
        // const stockOrder = {
        //     orderType: "SELL",
        //     shares: sharesSelected,
        //     marketPrice: price, // aka. price brought bought/sold at
        //     estimatedCost: estimatedCost,
        // }
        setIsLoading(true)
        // post transaction log to db for this user
        let stock = {symbol: symbol}
        await AccountsAPIs.postOrderTransaction(userCtx.user_id, "SELL", stock, sharesSelected)
        userCtx.updateBalance(estimatedCost);
        setIsLoading(false)
    }
    const onClickCancelHandler = () => {
        // setSharesSelected(1)
        console.log("ckliceked")
        setSharesSelected(1)
        setShowOrderConfirm(false)
    }
    return (
        // EDIT: not able to fade out!!! halp.
        <div className={classes.container} id={in_list ? classes.fadeOut : classes.fadeIn}>
            <Link className={classes.linkWrapper} to={`/stock/${symbol}`}>
                <div className={classes.symbol}>{symbol.toUpperCase()}</div>
                <div className={classes.shares}>{shares}</div>
                <div className={classes.price}>${parseInt(price).toFixed(2)}</div>
                {
                change_direction && <p className={classes.posChange}>+{parseInt(percent_change).toFixed(2)}%</p>
                }
                {
                change_direction && <BiUpArrow size={18} className={classes.upArrow}/>
                }
                {
                !change_direction && <p className={classes.negChange}>{parseInt(percent_change).toFixed(2)}%</p>
                }
                {
                !change_direction && <BiDownArrow size={18} className={classes.downArrow}/>
                }
            </Link>
            {(!showOrderConfirm && !isLoading) && 
                <button className={classes.removeBtn} onClick={onClickSellHandler}>Sell</button>
            }
            {(showOrderConfirm && !isLoading) &&
                <div className={classes.qtyNConfirmContainer}>
                    <input 
                        className={classes.qtyInput} 
                        value={sharesSelected} 
                        onChange={setSharesSelectedHandler} 
                        type="number" 
                        id="quantity" 
                        min="1" 
                        max={shares.toString()}
                    />
                    <div className={classes.optsWrapper}>
                        {(showOrderConfirm && !isLoading) &&
                            <FcCheckmark className={classes.opt} id={classes.check} onClick={onClickCheckHandler}/>
                        }
                        {(showOrderConfirm && !isLoading) && 
                            <FcCancel className={classes.opt} id={classes.cancel} onClick={onClickCancelHandler}/>
                        }
                    </div>
                </div>
            }
            {isLoading && <div className={classes.loader}><div></div><div></div><div></div></div>}
        </div>
    );
};

export default StockListItem;