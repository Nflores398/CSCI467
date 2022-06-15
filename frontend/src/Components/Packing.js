import React, { useState } from 'react';
import API from '../api';
import { Grid, Container, Typography } from '@mui/material';
import OrdersTable from './OrdersTable';

const Packing = () => {
  React.useEffect(() => {
    //fetch all orders in local database
    const fetchOrders = async () => {
      const response = await API.get('/getOrders');
      console.log(response);
      setOrders(response.data);
    };
    fetchOrders();
    //fetch all Items that are part of an order
    const fetchItems = async () => {
      const response = await API.get('/getItems');
      console.log(response);
      setItems(response.data);
    };
    fetchItems();
  }, []);
  const [orders, setOrders] = useState(null); //puts returned order data into array
  const [items, setItems] = useState(null); //puts returned items data into array

  let props = { orders, items }; //put items and items into array
  //Load OrdersTable.js to display packing tables.
  return (
    <div className="App">
      {' '}
      <Container
        sx={{ maxWidth: 'sm', marginTop: 2, marginBottom: 2, color: 'gray' }}
      >
        <Grid container spacing={12}>
          <Grid item xs={12} md={12}>
            <Typography variant="h2" color="text.primary">
              Packing & Shipping Interface
            </Typography>
          </Grid>
        </Grid>
      </Container>
      {orders && items && <OrdersTable {...props} />}
    </div>
  );
};

export default Packing;
