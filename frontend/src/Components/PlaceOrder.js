import React from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import PartsTable from './PartsTable';
import API from '../api';
import { useNavigate } from 'react-router-dom';

// This component is responsible for rendering the product catalog page for placing orders
const PlaceOrder = () => {
  const navigate = useNavigate();
  const [parts, setParts] = React.useState(null);
  const [cart, setCart] = React.useState([]);
  const [quantities, setQuantities] = React.useState(null);
  const [shippingRates, setShippingRates] = React.useState(null);

  // product filter input handler
  const [inputText, setInputText] = React.useState('');
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const displayCart = () => {
    navigate('/Checkout', { state: { cart, shippingRates } });
  };

  const addToCart = (productId, quantity) => {
    if (!quantity || quantity < 1) {
      window.alert('You must specify a valid quantity');
      return;
    }

    let part = parts.find((item) => item.number === productId);

    if (quantity > part.available) {
      window.alert(
        'There are not enough parts available, please choose a lower quantity'
      );
      return;
    }

    let newItem = { ...part, quantity };

    // the updated cart if item is already present
    let updatedCart = cart.map((item) => {
      if (item.number === productId) {
        return { ...item, quantity: quantity };
      }
      return item;
    });

    // update existing cart item or add new item to cart
    if (cart.some((item) => item.number === productId)) {
      setCart([...updatedCart]);
    } else {
      setCart((prevCart) => [...prevCart, newItem]);
    }
  };

  React.useEffect(() => {
    // get parts from legacy DB
    const fetchParts = async () => {
      const response = await API.get('/getParts');
      setParts(response.data.all);
    };
    fetchParts();

    // get quantities from internal DB
    const fetchQuantities = async () => {
      const response = await API.get('/getQuantities');
      setQuantities(response.data);
    };
    fetchQuantities();

    // get shipping rates from internal DB
    const fetchShippingRates = async () => {
      const response = await API.get('/getShippingRates');
      setShippingRates(response.data);
    };
    fetchShippingRates();
  }, []);

  const useStyles = makeStyles({
    search: {
      margin: '20px',
    },
  });
  const classes = useStyles();

  // define props for child components
  let props = { parts, quantities, inputText };

  return (
    <div className="App">
      <Typography
        variant="h2"
        color="text.primary"
        marginTop={'5px'}
        marginBottom={'20px'}
      >
        Parts Catalog
        <Button
          sx={{ marginLeft: 5 }}
          variant="outlined"
          disabled={cart.length ? false : true}
          onClick={displayCart}
        >
          Cart ({cart.length})
        </Button>
      </Typography>

      <div className={classes.search} padding="20px">
        <Grid container>
          <Grid item xs={12} md={6}>
            <TextField
              id="outlined-basic"
              onChange={inputHandler}
              variant="outlined"
              fullWidth
              label="Part Search"
            />
          </Grid>
        </Grid>
      </div>
      {parts && quantities && shippingRates && (
        <PartsTable {...props} addToCart={addToCart} />
      )}
    </div>
  );
};

export default PlaceOrder;
