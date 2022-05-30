import classes from './ShimmerGraph.module.css';

const ShimmerGraph = (props) => { // height prop. required b/c CSS acting funky...
  return (
    <div className={classes.shimmerWrapper} style={{height: props.height}}>
        <div className={classes.loader}><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
  )
}

export default ShimmerGraph;
