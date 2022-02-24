import { useContext } from 'react';
import classes from './UserCard.module.css';
import UserContext from '../store/user-context';

const UserCard = () => {
    const userCtx = useContext(UserContext);
    return ( 
        <div>
            <h1>Your Portfolio:</h1>
            {!userCtx.isLoggedIn && <p className={classes.message}>Please login to see your personal stats...dummy data:</p>}
            <div className={classes.container}>
                <h2 className={classes.label}>Portfolio Value: ${userCtx.balance}</h2>
                <h2 className={classes.label}>Buying Power: ${userCtx.balance}</h2>
                <h5 className={classes.label}>[+/- amount]</h5>
                <p className={classes.label}>[Today]</p>
                <b>**[Insert Graph Here]**</b>
                <p className={classes.label}>More Info.</p>
            </div>
        </div>
    );
}

export default UserCard;