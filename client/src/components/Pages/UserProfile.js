import { Fragment, useContext, useState } from 'react';
import UserContext from '../../store/user-context';
import PieGraph from '../User/UserStats/PieChart.js';
import classes from './UserProfile.module.css';
import CardTop from '../User/UserStats/CardTop.js';
import Graph1 from '../GraphVisuals/PerformanceGraph/Graph1.js';
import Header from '../Header/Header';
import { Navigate } from 'react-router-dom';
import MotionWrapper from '../Alerts/MotionWrapper';
import Button from '@mui/material/Button';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';
import axios from 'axios';
import PopupMessage from '../User/UserUtils/Popup';

const UserProfile = () => {
    const userCtx = useContext(UserContext);

    const [open, setOpen] = useState(false);
    // const [reset, setReset] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const onClickHandler = async (userInfo) => { // workaround to 'only being able to use hooks inside func. component' rule.
        let accountFromServer;
        accountFromServer = await axios.get(`http://127.0.0.1:8000/accounts/${'userCtx.user_id'}/reset/`, {
            params: {
                token: localStorage.getItem("access_token")
            }
        })
        console.log("account reset!", accountFromServer)
        window.location.reload(false);
        // setReset(true);
    }

    const [isOpen, setIsOpen] = useState(false);
 
    const togglePopup = () => {
      setIsOpen(!isOpen);
    }

    return(
        <MotionWrapper>
            {!userCtx.isLoggedIn && localStorage.getItem("name") === null &&
                // Redirect to /login - User must be logged in to view ALL pages...
                <Navigate to="/login"/>
            }
            {userCtx.isLoggedIn && localStorage.getItem("name") !== null &&
                <div className={classes.container}>
                {/* <Header/> */}
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
                        <div className={classes.button}>
                            <Tooltip 
                                open={open} 
                                onClose={handleClose} 
                                onOpen={handleOpen} 
                                title={<h4>Reset Portfolio Data</h4>} 
                                TransitionComponent={Fade}
                                TransitionProps={{ timeout: 600 }}>
                                    <Button variant="contained" color="error" 
                                        size='large' 
                                        startIcon={<RotateLeftIcon />}
                                        onClick={togglePopup}
                                        // onClick={onClickHandler}
                                        sx={{
                                            width: 200,
                                            height: 70,
                                            fontSize:20,
                                            marginTop: '5%',
                                            marginRight: '33%',
                                            marginBottom: '5%',   
                                            }}>
                                            RESET
                                    </Button>
                            </Tooltip>
                            {isOpen && <PopupMessage
                                content={<>
                                    <p>This will reset your account balance, transaction history, portfolio value, and stock holdings</p>
                                    {/*  */}
                                    <Button variant="contained" color="error" 
                                        size='medium' 
                                        startIcon={<RotateLeftIcon />}
                                        onClick={onClickHandler}>
                                        RESET ACCOUNT
                                    </Button>
                                </>}
                                handleClose={togglePopup}
                                />}
                        </div>
                        
                    </div>

                </div>
                
            }
            
            {/* <TransHistory/> */}
        </MotionWrapper>
    );
}


export default UserProfile