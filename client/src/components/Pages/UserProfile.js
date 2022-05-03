import { useContext } from 'react';
import UserContext from '../../store/user-context';
import PieGraph from '../User/UserStats/PieChart.js';
import classes from './UserProfile.module.css';
import CardTop from '../User/UserStats/CardTop.js';
import Graph1 from '../GraphVisuals/PerformanceGraph/Graph1.js';
import Header from '../Header/Header';
import { useEffect, Fragment } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';


const UserProfile = () => {
    const userCtx = useContext(UserContext);
    // const [pvFetched, setPvFetched] = useState(false);
    const API_SWITCH = false;
    const MINUTE_MS = 3000; // 3 seconds = 3000
    useEffect(() => {
        const interval = setInterval(() => {
            const fetchStock = async () => {
                console.log('FETCHING PV...W/ USER CONTEXT:', userCtx)
                const pvDataFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${userCtx.user_id}/getStocks/`, {
                    params: {
                        info: "portfolio_value"
                    }    
                })
                console.log("PV DATA:", pvDataFromServer.data)
                userCtx.setPortfolioInfo(pvDataFromServer.data);
                // setPvFetched(true);
            }
            if (!API_SWITCH) {
                fetchStock()
            }
        }, MINUTE_MS);
        return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }, [])

    return(
        <Fragment>
        {!userCtx.isLoggedIn && 
            // Redirect to /login - User must be logged in to view ALL pages...
            <Navigate to="/login"/>
        }
        {userCtx.isLoggedIn && 
            <div className={classes.container}>
            <Header/>
                <div className={classes.wrapper}>

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
            </div>
        }
        </Fragment>
    );
}


export default UserProfile;