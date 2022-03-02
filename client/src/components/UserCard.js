import { useContext } from 'react';
import classes from './UserCard.module.css';
import UserContext from '../store/user-context';

const UserCard = () => {
    const userCtx = useContext(UserContext);
    return ( 
        <div>
            {/* <h1>Your Portfolio:</h1> */}
            {!userCtx.isLoggedIn && <p className={classes.message}>Please login to see your personal stats</p>}
            <div className={classes.container}>
                {/* <h2 className={classes.heading}> OVERVIEW </h2> */}
                <div className={classes.userInfo}>
                    <h3 className={classes.label}>ACCOUNT VALUE: </h3>
                    <h1><span className={classes.value}> ${userCtx.balance} </span></h1>
                    <h3 className={classes.label}>BUYING POWER: </h3>
                    <h1> <span className={classes.value}> ${userCtx.balance} </span> </h1>
                    <h3 className={classes.label}>TODAY'S CHANGE: </h3>
                    {/* hardcoded values, change eventually */}
                    <h1><span className={classes.value}> + $0.00 </span></h1>
                    <h3 className={classes.label}>OVERALL CHANGE: </h3>
                    <h1><span className={classes.value}> + $0.00 </span></h1>
                </div>
                {/* <b>**[Insert Graph Here]**</b> */}
                {/* <p className={classes.label}>More Info.</p> */}
            </div>
        </div>
    );
}

export default UserCard;