import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import StockHoldings from './StockHoldings';

export default function ColorTabs() {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '90%', margin: '6%', border:'1px solid grey', borderRadius:'1.6rem', height:'50vh'}}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="Stock Holdings" />
        <Tab value="two" label="Watchlist" />
      </Tabs>

      {value === "one" && <StockHoldings/>}
      {/* {value === "two" && "watchlist component goes here"} */}

    </Box>

  );
}