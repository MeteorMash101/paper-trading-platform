import classes from './UserProfile.module.css';
import MiniInfoBox from './MiniInfoBox';
import BarItem from './BarItem';
import { FaHome, FaSitemap } from "react-icons/fa";
import { IoFastFoodSharp } from "react-icons/io5";
import { GiNightSleep } from "react-icons/gi";
import { AiOutlineSetting } from "react-icons/ai";

const UserProfile = (props) => {
  return (
    <div className={classes.container}>
        <div className={classes.cardTop}>
            <img className={classes.img} src="https://i.pinimg.com/564x/da/22/8e/da228ee2873e20fa669200eb21cc5744.jpg"></img>
            <button className={classes.edit}>Edit</button>
            <h2 className={classes.name}>Mark Lizardberg</h2>
            <p className={classes.info}>Male, 63 years old.</p>
        </div>
        <div className={classes.cardMid}>
            <MiniInfoBox label={"Portfolio Value"} val={"[PV Amount]"}/>
            <MiniInfoBox label={"Buying Power"} val={"[BP/Balance Amount]"}/>
        </div>
        <div className={classes.cardBottom}>
            <BarItem icon={<FaHome size={25}/>} label={"Home"}/>
            <BarItem icon={<FaSitemap size={25}/>} label={"Exercise"}/>
            <BarItem icon={<IoFastFoodSharp size={25}/>} label={"Meals"}/>
            <BarItem icon={<GiNightSleep size={25}/>} label={"Sleep"}/>
            <BarItem icon={<AiOutlineSetting size={25}/>} label={"Settings"}/>
        </div>
    </div>
  );
}

export default UserProfile;