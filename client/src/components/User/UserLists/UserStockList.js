import classes from './UserStockList.module.css';
import MiniStockList from './MiniStockList';


const UserStockList = () => {
  return (
    <div className={classes.container}>
        <MiniStockList/>
    </div>
  );
}

export default UserStockList;