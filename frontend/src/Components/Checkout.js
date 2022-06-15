import React from 'react';
import { Grid, Typography, TextField, Button, Box, Modal } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutTable from './CheckoutTable';
import API from '../api';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// This component is responsible for rendering the Checkout page
const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = React.useState(state.cart);

  const shippingRates = state.shippingRates;
  const [amount, setAmount] = React.useState(0);
  const [weight, setWeight] = React.useState(0);
  const [shipping, setShipping] = React.useState(0);
  const [total, setTotal] = React.useState(0);

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [creditCard, setCreditCard] = React.useState('');
  const [expiration, setExpiration] = React.useState('');
  const [invalidEmail, setInvalidEmail] = React.useState(false);
  const [invalidExp, setInvalidExp] = React.useState(false);
  const [invalidCC, setInvalidCC] = React.useState(false);
  const [authorization, setAuthorization] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  // handles email input and validation
  const handleEmail = (email) => {
    /* eslint-disable no-useless-escape */
    let emailPattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /* eslint-enable no-useless-escape */

    if (emailPattern.test(email)) {
      setInvalidEmail(false);
    } else {
      setInvalidEmail(true);
    }
  };

  // handles expiration input and validation
  const handleExpiration = (expiration) => {
    let expPattern = /^[0-9]{2}\/[0-9]{4}$/;

    if (expPattern.test(expiration)) {
      setInvalidExp(false);
    } else {
      setInvalidExp(true);
    }
  };

  // handles credit card input and validation
  const handleCC = (creditCard) => {
    let tempCC = creditCard.replace(/ /g, '');
    let ccPattern =
      /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/;

    if (ccPattern.test(tempCC)) {
      setInvalidCC(false);
    } else {
      setInvalidCC(true);
    }
  };

  // submit button handler
  const handleSubmit = (event) => {
    if (
      name &&
      email &&
      address &&
      creditCard &&
      expiration &&
      !invalidEmail &&
      !invalidExp &&
      !invalidCC
    ) {
      console.log(`
        Name: ${name}
        Email: ${email}
        Address: ${address}
        Credit Card: ${creditCard}
        Expiration Date: ${expiration}
      `);

      requestCredit();
      handleOpen();
    }

    event.preventDefault();
  };

  const removeFromCart = (productId) => {
    let updatedCart = cart.filter((item) => {
      return item.number !== productId;
    });
    setCart(() => updatedCart);
    if (updatedCart.length === 0) {
      navigate(-1);
    }
  };

  // request credit from external credit processor
  const requestCredit = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendor: '91827364-55',
        trans: generateTransactionId(),
        cc: '6011 1234 4321 1234',
        name: name,
        exp: expiration,
        amount: (Math.round(total * 100) / 100).toFixed(2),
      }),
    };
    await fetch('http://blitz.cs.niu.edu/CreditCard/', requestOptions)
      .then((response) => response.json())
      .then((data) =>
        setAuthorization(JSON.parse(JSON.stringify(data)).authorization)
      )
      .then(() => displayConfirmation());
  };

  // creates a unique transaction id for credit request
  const generateTransactionId = () => {
    let transactionId = '';

    transactionId += Math.floor(Math.random() * (999 - 100) + 100);
    transactionId += '-';
    transactionId += Math.floor(
      Math.random() * (9999999999 - 1000000000) + 1000000000
    );
    transactionId += '-';
    transactionId += Math.floor(Math.random() * (999 - 100) + 100);

    return transactionId;
  };

  const displayConfirmation = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    const getBillingDetails = async () => {
      setAmount(
        cart.reduce((n, { price, quantity }) => n + price * quantity, 0)
      );

      setWeight(
        cart.reduce((n, { weight, quantity }) => n + weight * quantity, 0)
      );

      setShipping(
        shippingRates.filter((rate) => {
          return weight >= rate.low && weight < rate.high;
        })[0].rate
      );

      setTotal(amount + shipping);
    };
    getBillingDetails();
  }, [cart, amount, weight, shipping, shippingRates]); // dependencies

  // handles opening of order success modal
  const handleOpen = () => setOpen(true);

  // handles closing of order success modal
  const handleClose = () => {
    setOpen(false);
    processOrder();
    // return to product catalog
    setTimeout(() => {
      navigate(-1);
    }, 4000);
  };

  // make internal database updates after successful order placement
  const processOrder = async () => {
    const customerBody = {
      name: name,
      email: email,
      address: address,
      creditCard: creditCard,
      expiration: expiration,
    };

    const orderBody = {
      cart: cart,
      amount: amount,
      shipping: shipping,
      weight: weight,
    };

    await API.post('/processOrder', { ...orderBody, ...customerBody });
  };

  return (
    <div className="App">
      <Typography variant="h4" color="text.primary" marginTop={'10px'}>
        Checkout
      </Typography>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          margin: 5,
        }}
        noValidate
        autoComplete="off"
        borderColor="primary.main"
        border={2}
      >
        <Typography
          variant="h6"
          color="text.primary"
          marginTop={'5px'}
          marginBottom={'20px'}
          marginLeft={'10px'}
          align={'left'}
        >
          You have {cart.length} item{cart.length === 1 ? '' : 's'} in your
          cart.
        </Typography>
        {cart.length && (
          <CheckoutTable cart={cart} removeFromCart={removeFromCart} />
        )}
      </Box>
      <Box
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
          margin: 5,
          paddingBottom: 5,
        }}
        noValidate
        autoComplete="off"
        borderColor="primary.main"
        borderBottom={4}
      >
        <Grid container spacing={12}>
          <Grid item xs={12} md={12}>
            <Typography variant="h6" color="text.primary" align="left">
              <div>
                <b>Billing Information</b>
              </div>
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={12} direction="row">
          <Grid item xs={1} md={1}>
            <Typography variant="h6" color="text.primary" align="right">
              Amount:
            </Typography>
          </Grid>
          <Grid item xs={1} md={2}>
            <Typography variant="h6" color="text.primary" align="left">
              ${(Math.round(amount * 100) / 100).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={12} direction="row">
          <Grid item xs={1} md={1}>
            <Typography variant="h6" color="text.primary" align="right">
              Weight:
            </Typography>
          </Grid>
          <Grid item xs={1} md={2}>
            <Typography variant="h6" color="text.primary" align="left">
              {(Math.round(weight * 100) / 100).toFixed(2)}lbs
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={12}>
          <Grid item xs={1} md={1}>
            <Typography variant="h6" color="text.primary" align="right">
              Shipping:
            </Typography>
          </Grid>
          <Grid item xs={1} md={2}>
            <Typography variant="h6" color="text.primary" align="left">
              ${(Math.round(shipping * 100) / 100).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={12}>
          <Grid item xs={1} md={1}>
            <Typography variant="h6" color="text.primary" align="right">
              Total:
            </Typography>
          </Grid>
          <Grid item xs={1} md={2}>
            <Typography variant="h6" color="text.primary" align="left">
              ${(Math.round(total * 100) / 100).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="h6" color="text.primary">
          <form onSubmit={handleSubmit} align="left">
            <div>
              <TextField
                id="filled-basic"
                label="Name"
                variant="filled"
                name="name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="filled-basic"
                label="Email"
                variant="filled"
                name="email"
                type="text"
                error={invalidEmail}
                helperText={invalidEmail ? 'Invalid email!' : ''}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={(e) => handleEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="filled-basic"
                label="Address"
                variant="filled"
                name="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="filled-basic"
                label="CC"
                variant="filled"
                name="creditCard"
                type="text"
                error={invalidCC}
                helperText={invalidCC ? 'Invalid credit card number!' : ''}
                value={creditCard}
                onChange={(e) => setCreditCard(e.target.value)}
                onBlur={(e) => handleCC(e.target.value)}
                required
              />
            </div>
            <div>
              <TextField
                id="filled-basic"
                label="expiration"
                variant="filled"
                name="expiration"
                type="text"
                placeholder="mm/yyyy"
                error={invalidExp}
                helperText={invalidExp ? 'Invalid expiration date!' : ''}
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                onBlur={(e) => handleExpiration(e.target.value)}
                required
              />
            </div>
            <div>
              <Button
                sx={{ marginLeft: 1, marginTop: 1 }}
                variant="contained"
                onClick={handleSubmit}
              >
                Check Out
              </Button>
            </div>
          </form>
        </Typography>
      </Box>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            color="green"
          >
            Confirmation: Order created
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Amount: {(Math.round(total * 100) / 100).toFixed(2)} Auth:
            {authorization}
            <br />
            For {name}, {email}
            <br />
            <br />
            Thank you for your business!
          </Typography>
          <Button
            sx={{ marginLeft: 1, marginTop: 1 }}
            variant="contained"
            onClick={handleClose}
          >
            OK
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Checkout;
