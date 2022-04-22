import classes from './MiniInfoBox.module.css';

const MiniInfoBox = ({label, val}) => {
  return (
    <div className={classes.miniInfoBox}>
        <span className={classes.val}>$ {val}</span>
        <div className={classes.label}>
            {label}
        </div>
    </div>
  );
}

export default MiniInfoBox;