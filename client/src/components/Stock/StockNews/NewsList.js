import classes from './NewsList.module.css';
import { useState, useContext, useEffect } from 'react';
import NewsAPIs from '../../../APIs/NewsAPIs';
import NewsItem from './NewsItem';

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
/*
"headline": "Russia to Move Away from U.S. Dollar Amid Sanctions, Xinhua Says",
"image": "https://data.bloomberglp.com/company/sites/2/2019/01/logobbg-wht.png",
"summary": "Russia is seeking to move away from the U.S. dollar and rely less on imports while strengthening its independence in key technologies in response to sanctions over the war with Ukraine, Chinese state media reported, citing Foreign Minister Sergei Lavrov.",
"url": "https://www.bloomberg.com/news/articles/2022-04-30/russia-to-move-away-from-u-s-dollar-amid-sanctions-xinhua-says",
"datetime": "2022-04-30T01:56:05Z"
*/
const NewsList = () => {
    // const [orderType, setOrderType] = useState("BUY");
	const [articles, setArticles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
    useEffect(async() => {
		setIsLoading(true);
		const dataFetched = await NewsAPIs.getNewsList()
		setArticles(dataFetched.data);//.slice(0,10));
		setIsLoading(false);
  	}, []) 
    return ( 
        <div className={classes.container}>
            {/* <h2 className={classes.title}>NEWS</h2> */}
            {!isLoading && articles.map((article) => ( // making sure array exists first.
					<NewsItem
						title={article.headline}
						image={article.image} // required for React warning...
						summary={article.summary}
						url={article.url}
						postTime={article.datetime}
					/>
				))}
        </div>

    );
}

export default NewsList;

