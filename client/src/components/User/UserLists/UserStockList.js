import classes from './UserStockList.module.css';
import MiniStockList from './MiniStockList';


const UserStockList = ({usersStocksURL, paramsInfo}) => {
  return (
    <div className={classes.container}>
        <MiniStockList usersStocksURL={usersStocksURL} paramsInfo={paramsInfo}/>
    </div>
  );
}

export default UserStockList;