import classes from './ConfettiShower.module.css';
import Confetti from "react-confetti";

const ConfettiShower = ({width, height}) => {
  // width, height is our parent container's width & height (OrderWidget)
  return (
    <Confetti
      className={classes.confetti}
      recycle={false}
      numberOfPieces={220}
      width={width}
      height={height}
    />
  )
}

export default ConfettiShower;
