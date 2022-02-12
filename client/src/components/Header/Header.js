import classes from './Header.module.css';
import GoogleSocialAuth from '../auth/GoogleSocialAuth';
import SearchBar from './SearchBar';
import LogoNTitle from './LogoNTitle';
import { useContext } from 'react';
import UserContext from '../../store/user-context';

const Header = () => {
    const userCtx = useContext(UserContext);
    const onLoginHandler = (userInfo) => { // workaround to 'only being able to use hooks inside func. component' rule.
        userCtx.setName(userInfo.name);
        userCtx.setUserID(userInfo.user_id);
        userCtx.setIsLoggedIn(userInfo.isLoggedIn);
    };
    const onLogoutHandler = () => { // workaround to 'only being able to use hooks inside func. component' rule.
        userCtx.setDefault()
        // Remove local storage items
        localStorage.removeItem("access_token");
        localStorage.setItem("refresh_token");
        console.log("logged user out!")
    };
    console.log("context:", userCtx)
    return (
        <div className={classes.container}>
            <LogoNTitle/>
            <SearchBar/>
            {!userCtx.isLoggedIn && <GoogleSocialAuth onLogin={onLoginHandler} onLogout={onLogoutHandler}/>}
            {userCtx.isLoggedIn && <h2>Welcome {userCtx.name}!</h2>}
            {userCtx.isLoggedIn && <button onClick={onLogoutHandler}>Logout</button>}
        </div>
    );
};

export default Header;


