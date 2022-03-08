import classes from './UserStockList.module.css';
import MiniStockList from './Stock/MiniStockList';

const UserStockList = () => {
  return (
    <div className={classes.container}>
        <h3>STOCK HOLDINGS</h3>
        <MiniStockList/>
    </div>
  );
}

export default UserStockList;