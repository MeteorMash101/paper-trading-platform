import classes from './Popup.module.css';

const Popup = props => {
  return (
    <div className={classes.popup}>
      <div className={classes.box}>
        <span className={classes.closeIcon} onClick={props.handleClose}>x</span>
        {props.content}
      </div>
    </div>
  );
};
 
export default Popup;