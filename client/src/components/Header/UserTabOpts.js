import { useContext } from 'react';
import classes from './UserTabOpts.module.css';
import UserContext from '../../store/user-context';
import { Link } from 'react-router-dom';
import axios from 'axios';

const UserTabOpts = ({onLogout}) => {
	const userCtx = useContext(UserContext);

  return (
    <div className={classes.wrapper}>
	  	{/* <Link to="/user" style={{ textDecoration: 'none' }}> */}
			<button className={classes.selectOpt}>Profile</button>
		{/* </Link> */}
			<button className={classes.selectOpt}>My Stocks</button>
			<button className={classes.selectOpt}>History</button>
			<button className={classes.selectOpt} onClick={onLogout}>Logout</button>


		</div>
  );
}

export default UserTabOpts;
