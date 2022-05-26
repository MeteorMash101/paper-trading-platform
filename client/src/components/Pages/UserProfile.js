import { useContext } from 'react';
import UserContext from '../../store/user-context';
import PieGraph from '../User/UserStats/PieChart.js';
import classes from './UserProfile.module.css';
import CardTop from '../User/UserStats/CardTop.js';
import Graph1 from '../GraphVisuals/PerformanceGraph/Graph1.js';
import Header from '../Header/Header';
import { Navigate } from 'react-router-dom';
import MotionWrapper from '../Alerts/MotionWrapper';

const UserProfile = () => {
    const userCtx = useContext(UserContext);
    return(
        <MotionWrapper>
            {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
                // Redirect to /login - User must be logged in to view ALL pages...
                <Navigate to="/login"/>
            }
            {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
                <div className={classes.container}>
                <Header/>
                    <div className={classes.wrapper}>
                        <div className={classes.cardTop}>
                            <CardTop/>
                        </div>
                        <div className={classes.pieChart}>
                            <h2> PORTFOLIO DIVERSITY</h2>
                            <PieGraph/>
                        </div>
                        <div className={classes.lineChart}>
                            <h2>PERFORMANCE GRAPH</h2>
                            <Graph1/>
                        </div>
                    </div>
                </div>
            }
        </MotionWrapper>
    );
}


export default UserProfile;