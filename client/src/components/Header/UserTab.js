import { useState, useContext } from 'react';
import { Fragment } from 'react';
import classes from './UserTab.module.css';
import UserTabOpts from './UserTabOpts';
import UserContext from '../../store/user-context';
import { CgProfile } from "react-icons/cg";


const UserTab = ({onLogout}) => {
  const userCtx = useContext(UserContext);
  const [showOpts, setShowOpts] = useState(false);
  const showOptsHandler = (event) => {
    event.preventDefault();
    setShowOpts(!showOpts);
  }

  return (
    <Fragment>
      <div className={classes.wrapper} to="/user" style={{ textDecoration: 'none' }} onClick={showOptsHandler}>
          <div className={classes.wrapper2}>
            <CgProfile size={22}/>
            <h5 className={classes.username}>{userCtx.name}</h5>
          </div>
          {showOpts && <UserTabOpts onLogout={onLogout}/>}
      </div>
    </Fragment>
  );
}

export default UserTab;
