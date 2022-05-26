import classes from './SearchBar.module.css';
import React, { useState, useEffect } from 'react';
import StockAPIs from '../../APIs/StocksAPIs';

function NewSearchBar () {
  const [stockList, setStockList] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const ref = React.useRef()

  useEffect(async() => {
      const dataFetched = await StockAPIs.getSearchableStocks()
      setStockList(dataFetched.data)
  }, []) 


  useEffect(() => {
    const checkIfClickedOutside = e => {
        // If the menu is open and the clicked target is not within the menu,
        // then close the menu
        if (isMenuOpen && ref.current && !ref.current.contains(e.target)) {
          setIsMenuOpen(false)
          clearInput()
        }
      }
  
    document.addEventListener("mousedown", checkIfClickedOutside)
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside)
    }
  }, [isMenuOpen])

  const [filteredData, setFilteredData] = useState([]);
  const [wordEntered, setWordEntered] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    setWordEntered(searchWord);
    const newFilter = stockList.filter((value) => {
    return (value.company_name.toLowerCase().includes(searchWord.toLowerCase().trim()) 
      || value.symbol.toLowerCase().includes(searchWord.toLowerCase().trim()));
  });

  if (searchWord === "") {
    setFilteredData([]);
  } else {
    setFilteredData(newFilter);
  }
  };

  const clearInput = () => {
    setFilteredData([]);
    setWordEntered("");
  };

  return (
    <div className={classes.container} ref={ref} onClick={() => setIsMenuOpen(oldState => !oldState)}>
      <input
        className={classes.searchInput}
        // type="search"
        placeholder= "Search stocks..."
        value={wordEntered}
        onChange={handleFilter}
      />
      {filteredData.length != 0 && (
        <div className={classes.dataResult}>
          {filteredData.slice(0, 30).map((value, key) => {
            return (
              <a className={classes.stockLink} href={`/stock/${value.symbol}`}>
                <div className={classes.symbol}> {value.symbol} </div> 
                <div className={classes.name}> {value.company_name}</div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default NewSearchBar;