import { useContext } from 'react';
import UserContext from '../../store/user-context';
import PieGraph from '../User/UserStats/PieChart.js';
import classes from './UserProfile.module.css';
import CardTop from '../User/UserStats/CardTop.js';
import Graph1 from '../GraphVisuals/PerformanceGraph/Graph1.js';

const UserProfile = () => {
    const userCtx = useContext(UserContext);
    return (
        <div className={classes.container}>
                <div className={classes.cardTop}>
                    <CardTop/>
                </div>

                <div className={classes.pieChart}>
                    <PieGraph/>
                </div>

                <div className={classes.lineChart}>
                        <h2>PERFORMANCE GRAPH</h2>
                        <Graph1 stockURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/historicPV/`}/>
                </div>
        </div>
    );
}

export default UserProfile;