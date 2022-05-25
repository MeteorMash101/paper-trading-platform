import classes from './LiveIndicator.module.css';
import { IS_MARKET_OPEN } from '../../globals'


const LiveIndicator = ({message="Live"}) => {
    const idClass = IS_MARKET_OPEN ? classes.live : classes.notLive; // either red or grey
    return (
        <div className={classes.container}>
            <div className={classes.circle} id={idClass}></div>
            <p className={classes.msg}>{message}</p>
        </div>
    )
}

export default LiveIndicator;
