import { useContext } from 'react';
import UserContext from '../../store/user-context';
import UserCard from '../UserCard.js';
import PieGraph from '../User/pieChart.js';
import PerformanceGraph from '../User/performanceGraph';
import { Box } from '@material-ui/core';
import StockHoldings from '../User/stockHoldings';
import classes from './UserProfile.module.css';
import MiniInfoBox from './MiniInfoBox';
import Graph1 from '../Graph/Graph.js';

import UserStockList from '../UserStockList';
import CardTop from '../User/CardTop.js';

const UserProfile = () => {
    const userCtx = useContext(UserContext);
    return(
        <div className={classes.container}>
            <div className={classes.cardTop}>
                <CardTop/>
                {/* <img className={classes.img} src="https://i.pinimg.com/564x/da/22/8e/da228ee2873e20fa669200eb21cc5744.jpg"></img>
                <button className={classes.edit}>Edit</button>
                <h2 className={classes.name}>Mark Lizardberg</h2>
                <p className={classes.info}>Male, 63 years old.</p> */}
            </div>
            {/* <div className={classes.cardMid}> */}
                {/* <MiniInfoBox label={"Portfolio Value"} val={"[PV Amount]"}/> */}
                {/* <MiniInfoBox label={"Buying Power"} val={"[BP/Balance Amount]"}/> */}
            {/* </div> */}
            <div className={classes.wrapper}>
                <div className={classes.userCard}>
                    {/* <UserCard/> */}
                    <PieGraph/>
                </div>
                <div className={classes.lineChart}>
                    {/* <Box padding={5}> */}
                        <h2>PERFORMANCE GRAPH</h2>
                        <Graph1 stockURL={`http://127.0.0.1:8000/accounts/${userCtx.user_id}/historicPV/`}/>
                    {/* </Box> */}
                </div>
                {/* <div className={classes.pieChart}>
                    <PieGraph/>
                </div> */}
                <div className={classes.stockHoldings}>
                    <UserStockList/>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;