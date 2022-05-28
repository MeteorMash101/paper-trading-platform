import classes from './NewsItem.module.css';
import { useState, useContext, useEffect } from 'react';

/* NOTE:
- Here, we should be inputted props from parent NewsList component
- Each prop is gonna be used to create a base html/css component here
- So this file is the actual 'structure' of the news component,
and is just taking in the parameters and using them to build news components.
*/
const NewsItem = ({title, image, summary, url, postTime}) => {
    const options = {month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric'};
    return ( 
        <a className={classes.container} href={url} target="_blank">
            <div className={classes.needed}>
                <div className={classes.time}> {new Date(postTime).toLocaleString("en-us", options)} </div>
                <div className={classes.headline}>{title}</div>
                <div className={classes.sidebyside}>
                    <div className={classes.summary}>{summary}</div>
                    <img className={classes.img} src={image}></img>
                </div>
            </div>
        </a>
    );
}
//April 29, 2022, 6:56 PM PDT
export default NewsItem;

