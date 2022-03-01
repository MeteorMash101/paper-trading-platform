import classes from './BarItem.module.css';

const BarItem = (props) => {
  return (
    <div className={classes.barItem}>
      <span className={classes.icon}>{props.icon}</span>
      <h3 className={classes.label}>{props.label}</h3>
    </div>
  );
}

export default BarItem;
