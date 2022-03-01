import  React, { useState } from 'react';
import classes from './SearchBar.module.css';
import { AiOutlineSearch } from "react-icons/ai";

const SearchBar = (props) => {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={classes.container}>
        <input
            className={classes.searchInput}
            type="text"
            placeholder= "Search stocks..."
            // value={this.state.value}
            // onChange={event => {setSearchTerm(event.target.value)}}
        />

        <div className={classes.dataResult}>
          

        </div>
        
        <button type="submit" className={classes.searchBtn}>
            <AiOutlineSearch/>
        </button>
    </div>
  );
}

export default SearchBar;