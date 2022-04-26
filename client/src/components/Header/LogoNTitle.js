import classes from './LogoNTitle.module.css';
import tempLogo from './templogo.jpg';
import { Link } from 'react-router-dom';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import IconButton from '@mui/material/IconButton';

const LogoNTitle = () => {
    return (
        <Link to={`/`} className={classes.container}>
            <img src={tempLogo} className={classes.tempLogo} alt="Logo"/>
            <h2>SWAT PAPER TRADING</h2>
        </Link>
    );
};

export default LogoNTitle;

