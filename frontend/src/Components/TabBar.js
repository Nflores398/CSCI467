import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const CenteredTabs = ({ tabs }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const tabs = ["Item One", "Item Two", "Item Three"];

  return (
    <Box sx={{ width: '100%', bgcolor: '#EEEEEE' }}>
      <Tabs value={value} onChange={handleChange} centered>
        {tabs.map((tab) => (
          <Tab sx={{ mx: 5 }} label={tab} />
        ))}
      </Tabs>
    </Box>
  );
};

export default CenteredTabs;
