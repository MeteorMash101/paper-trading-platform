import { useEffect, useState, useContext } from 'react';
import { Fragment } from 'react';
import classes from './UserTab.module.css';
import UserTabOpts from './UserTabOpts';
import UserContext from '../../../store/user-context';
import { CgProfile } from "react-icons/cg";
import React from "react";

const container = React.useRef;
const UserTab = ({onLogout}) => {
  const userCtx = useContext(UserContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = React.useRef()
  useEffect(() => {
    const checkIfClickedOutside = e => {
      // If the menu is open and the clicked target is not within the menu,
      // then close the menu
      if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }
    
    document.addEventListener("mousedown", checkIfClickedOutside)

    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
    }, [isMenuOpen])
    
    return (
    <Fragment>
      <div className={classes.wrapper} ref={ref} to="/user" style={{ textDecoration: 'none' }} 
        onClick={() => setIsMenuOpen(oldState => !oldState)}>

        <div className={classes.wrapper2}>
          <CgProfile className={classes.userprofile} size={22}/>
          <h5 className={classes.username}>{userCtx.name}</h5>
        </div>

        {isMenuOpen && <UserTabOpts onLogout={onLogout}/>}
        
      </div>
    </Fragment>
  );
}

export default UserTab;
