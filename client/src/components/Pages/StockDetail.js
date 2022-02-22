import { Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import classes from './StockDetail.module.css';
import axios from 'axios';
import OrderWidget from '../OrderWidget';

const StockDetail = () => {
    // Pull the relevant stock info. from DB. using stock_id
    const [stock, setStock] = useState("");
    const { symbol } = useParams();
    useEffect(() => {
        const fetchStock = async () => {
            const stockFromServer = await axios.get(`http://127.0.0.1:8000/stocks/${symbol}/`)
            console.log("[DEBUG]: stock received from db:", stockFromServer.data)
            setStock(stockFromServer.data)
        }
        fetchStock()
    }, []) // this DB retreival should only execute the first time this App is loaded.
    return (
        <div className={classes.container}>
            <h3>company name: {stock.company_name}</h3>
            <h3>price: {stock.price}</h3>
            <h3>average_volume: {stock.average_volume}</h3>
            <h3>high_today: {stock.high_today}</h3>
            <h3>low_today: {stock.low_today}</h3>
            <OrderWidget stock={stock}/>
        </div>
    );
}

export default StockDetail;