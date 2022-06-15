import React from 'react';
import AdminOrderTable from './AdminOrderTable';
import AdminRates from './AdminRates';
import API from '../api';
import { InputLabel, MenuItem } from '@mui/material';
import Select from '@mui/material/Select';

import {
  Grid,
  Container,
  Typography,
  Tab,
  Tabs,
  Box,
  TextField,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const adminTabs = ['VIEW ORDERS', 'SET S/H CHARGES'];

const Admin = () => {
  //get orders for admin table
  React.useEffect(() => {
    const fetchOrders = async () => {
      const response = await API.get('/getOrdersAdmin');
      console.log(response);
      setOrders(response.data);
    };
    fetchOrders();
    //get the items that in each order
    const fetchItems = async () => {
      const response = await API.get('/getItems');
      console.log(response);
      setItems(response.data);
    };
    fetchItems();
    //get the shipping rates
    const fetchShippingRates = async () => {
      const response = await API.get('/getShippingRates');
      setShippingRates(response.data);
    };
    fetchShippingRates();
  }, []);
  const [value, setValue] = React.useState(0);
  const [orders, setOrders] = React.useState(null);
  const [items, setItems] = React.useState(null);
  const [shippingRates, setShippingRates] = React.useState(null);
  //get low range for price range
  const [inputLow, setInputLow] = React.useState(0);
  let lowInputHandler = (e) => {
    if (!isNaN(e.target.value)) {
      setInputLow(e.target.value);
    }
  };
  //get high range for price range used by filter
  const [inputHigh, setInputHigh] = React.useState(99999999999999);
  let highInputHandler = (e) => {
    if (!isNaN(e.target.value)) {
      setInputHigh(e.target.value);
    }
  };
  //get low range for date used by filter
  const [fromDate, setFromDate] = React.useState('2010-01-01');
  const fromDateInputHandler = (e) => {
    setFromDate(e.target.value);
    console.log(e.target.value);
  };
  //get high range for date used by filter
  const [toDate, setToDate] = React.useState('2030-01-01');
  const toDateInputHandler = (e) => {
    setToDate(e.target.value);
    console.log(e.target.value);
  };
  //get status of order for filter
  const [status, setStatus] = React.useState(3);
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const useStyles = makeStyles({
    search: {
      margin: '20px',
    },
  });
  const classes = useStyles();
  
  let props = {
    orders,
    items,
    shippingRates,
    inputLow,
    inputHigh,
    status,
    toDate,
    fromDate,
  };
  //used to change tabs on admin page
  const handleChange = (e) => {
    setValue(value === 0 ? 1 : 0);
  };
  return (
    <div className="App">
      <Box sx={{ width: '100%', bgcolor: '#EEEEEE' }}>
        <Tabs value={value} onChange={handleChange} centered>
          {adminTabs.map((tab) => (
            <Tab sx={{ mx: 5 }} label={tab} />
          ))}
        </Tabs>
      </Box>
      {!value ? (
        <Container sx={{ maxWidth: 'sm', marginTop: 2, marginBottom: 2 }}>
          <Grid container spacing={12}>
            <Grid item xs={12} md={12}>
              <Typography variant="h5" color="text.primary">
                <div className={classes.search} padding="20px">
                  <Grid container direction="row">
                    <Grid item xs={2} md={2}>
                      <TextField
                        id="outlined-basic"
                        onChange={lowInputHandler}
                        variant="outlined"
                        fullWidth
                        label="Price from:"
                      />
                    </Grid>
                    <Grid item xs={2} md={2} marginLeft={3}>
                      <TextField
                        id="outlined-basic"
                        onChange={highInputHandler}
                        variant="outlined"
                        fullWidth
                        label="Price to:"
                      />
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <InputLabel id="demo-simple-select-label" paddingTop={10}>
                        Status:
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={status}
                          label="Status"
                          onChange={handleStatusChange}
                        >
                          <MenuItem value={3}>All</MenuItem>
                          <MenuItem value={0}>Incomplete</MenuItem>
                          <MenuItem value={1}>Complete</MenuItem>
                        </Select>
                      </InputLabel>
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <TextField
                        id="date1"
                        label="Date from:"
                        type="date"
                        defaultValue={fromDate}
                        onChange={fromDateInputHandler}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item xs={2} md={2}>
                      <TextField
                        id="date2"
                        label="Date to:"
                        type="date"
                        defaultValue={toDate}
                        onChange={toDateInputHandler}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      ) : null}
      {value === 0
        ? orders && items && shippingRates && <AdminOrderTable {...props} />
        : shippingRates && <AdminRates {...props} />}
    </div>
  );
};

export default Admin;
