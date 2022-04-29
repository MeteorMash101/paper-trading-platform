import classes from './NewsList.module.css';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';

/* NOTE:
- Here, we should be inputted the proper news API url for fetching list of news.
- The news that we fetch are either general (main page), or stock specific (stock detail page)
so this "NewsList" component should be used in MainFeed.js and StockDetail.js, with those files
passing in the API url.
- After fetching using useEffect hook, save it to a list state (newsItemsList), then you use the 
javascript mapping function, to convert each of those data we fetched into NewsItem components and 
display them.
- Good examples in Stocks/StockList.js & Stocks/StockItem.js
*/

const NewsList = ({newsAPIUrl}) => {
    // const [orderType, setOrderType] = useState("BUY");

    return ( 
        <div className={classes.container}>
            HI IM NEWS LIST
        </div>
    );
}

export default NewsList;

