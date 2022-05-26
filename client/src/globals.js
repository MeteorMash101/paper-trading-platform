/*
Here we will define our global variables that are being used system-wide.
"Our" way of making global variables...=)
*/
const BASE_URL = "http://127.0.0.1:8000"; // for making reqs to server
const LIVE_FETCH = false; // PRODUCTION ONLY! (TRUE == ON)
const TIMER = 5000; // PRODUCTION ONLY! (1000 = 1 seconds)
const STARTING_BALANCE = 5000; // used for calculations (set in backend, change here if necessary.)
const findOutIfMarketOpen = () => {
    var currentDay = new Date();
    var hours = currentDay.getHours();
    var mins = currentDay.getMinutes();
    var day = currentDay.getDay();
    return day >= 1
        && day <= 5
        && (hours >= 6 && mins >= 30)
        && (hours <= 13);
}
const IS_MARKET_OPEN = findOutIfMarketOpen();
// const IS_MARKET_OPEN = true; // for fun
// const PRODUCTION_MODE = false; // currently unused

export { BASE_URL } 
export { LIVE_FETCH } 
export { TIMER } 
export { STARTING_BALANCE } 
export { IS_MARKET_OPEN }