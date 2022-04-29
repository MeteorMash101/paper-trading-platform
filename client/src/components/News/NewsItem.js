import classes from './NewsItem.module.css';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

/* NOTE:
- Here, we should be inputted props from parent NewsList component
- Each prop is gonna be used to create a base html/css component here
- So this file is the actual 'structure' of the news component,
and is just taking in the parameters and using them to build news components.
*/
const NewsItem = ({prop1, prop2, prop3}) => {
    return ( 
        <div className={classes.container}>
            HI IM NEWS ITEM
        </div>
    );
}

export default NewsItem;

