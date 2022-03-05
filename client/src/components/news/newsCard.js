import classes from './newsCard.module.css';

const NewsCard = ({props}) => {

    return(

        <div className={classes.container}>
            <div className={classes.listContainer}>
                <h2 className={classes.title}>Today's financial news</h2>
            </div>

        </div>

    );

}

export default NewsCard;