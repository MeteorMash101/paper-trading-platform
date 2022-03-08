import classes from './MiniInfoBox.module.css';

const MiniInfoBox = ({label, val}) => {
  return (
    <div className={classes.miniInfoBox}>
        <div className={classes.label}> {label}
        
        <div className={classes.val}>{val}</div>     
        </div>
    </div>
  );
}

export default MiniInfoBox;
