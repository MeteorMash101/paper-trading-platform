import { motion } from 'framer-motion';

const MotionWrapper = (props) => {
    return (
    <motion.div 
        initial={{opacity:0}} 
        animate={{opacity: 1}}
        exit={{opacity: 0}}
        transition={{duration: 0.5}}
    >
        {/* components inherit here. */}
        {props.children} 
    </motion.div>
    )
}

export default MotionWrapper