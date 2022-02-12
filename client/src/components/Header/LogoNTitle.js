import classes from './LogoNTitle.module.css';
import tempLogo from './templogo.jpg';
import { Link } from 'react-router-dom';

const LogoNTitle = () => {
    return (
        <Link to={`/`} className={classes.container}>
            <img src={tempLogo} className={classes.tempLogo} alt="Logo"/>
            <h2>Paper Trading Platform</h2>
        </Link>
    );
};

export default LogoNTitle;


