import { useContext } from 'react';
import classes from './UserProfile.module.css';
import UserContext from '../../store/user-context';
import UserCard from '../UserCard.js';
import PieGraph from '../User/pieChart.js';
import PerformanceGraph from '../User/performanceGraph';
import { Box } from '@material-ui/core';
import StockHoldings from '../User/stockHoldings';


const UserProfile = () => {

    const userCtx = useContext(UserContext);

    return(
        <div className={classes.container}>

            <div className={classes.wrapper}>

                <div className={classes.userCard}>
                    <UserCard/>
                </div>

                <div className={classes.lineChart}>
                    <Box padding={5}>
                        <PerformanceGraph/>
                    </Box>
                </div>

                <div className={classes.pieChart}>
                    <PieGraph/>
                </div>

                <div className={classes.stockHoldings}>
                    <StockHoldings/>

                </div>

            </div>
            
        </div>

        
    );
}


export default UserProfile;