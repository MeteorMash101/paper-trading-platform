import classes from './UserStockList.module.css';
import MiniStockList from './Stock/MiniStockList';


const UserStockList = ({title, usersStocksURL, paramsInfo}) => {
  return (
    <div className={classes.container}>
        <h3>{title}</h3>
        <MiniStockList usersStocksURL={usersStocksURL} paramsInfo={paramsInfo}/>
    </div>
  );
}

export default UserStockList;