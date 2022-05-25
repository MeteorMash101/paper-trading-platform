import axios from "axios";
import {BASE_URL} from "../globals";

const getNewsList = async () => {
    const dataFetched = await axios.get(`${BASE_URL}/news/`)
    return dataFetched;
}

// NOTE: these methods return promises, be sure to unwrap them or use 'await' when calling!
const NewsAPIs = {
	getNewsList: getNewsList,
}

export default NewsAPIs;