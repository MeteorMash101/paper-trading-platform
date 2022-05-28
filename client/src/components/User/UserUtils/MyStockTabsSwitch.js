import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import UserStockListTable from './UserStockListTable';
import UserWatchListTable from './UserWatchListTable';

export default function MyStockTabsSwitch({onSelect}) {
  const [value, setValue] = React.useState('one');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '90%', margin: '5%', border:'1px solid grey', borderRadius:'1.6rem', height:'65vh'}}>
      <Tabs
        value={value}
        onChange={handleChange}
        variant="fullWidth"
        aria-label="secondary tabs example"
      >
        <Tab value="one" label="Stock Holdings" />
        <Tab value="two" label="Watchlist" />
      </Tabs>
      {value === "one" && <UserStockListTable onSelect={onSelect}/>}
      {value === "two" && <UserWatchListTable onSelect={onSelect}/>}
    </Box>

  );
}