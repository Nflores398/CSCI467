import React from 'react';
import ReceivingTable from './ReceivingTable';
import { Grid, Container, Typography, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import API from '../api';

const Receiving = () => {
  React.useEffect(() => {
    //fetch items in the local database
    const fetchParts = async () => {
      const response = await API.get('/getPartsInv');
      setParts(response.data);
    };
    fetchParts();
    //fetch quantities of items in the local database
    const fetchQuantities = async () => {
      const response = await API.get('/getQuantities');
      setQuantities(response.data);
    };
    fetchQuantities();
  }, []);
  //put quantities into an array
  const [quantities, setQuantities] = React.useState(null);
  //put parts into an array
  const [parts, setParts] = React.useState(null);
  //put search text box into a string
  const [inputText, setInputText] = React.useState('');
  let inputHandler = (e) => {
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const useStyles = makeStyles({
    search: {
      margin: '20px',
    },
  });
  const classes = useStyles();
  //used to pass parts, quantities, and inputtext to ReceivingTable.js
  let props = { parts, quantities, inputText };
  return (
    <div className="App">
      {' '}
      <Container sx={{ maxWidth: 'sm', marginTop: 2, marginBottom: 2 }}>
        <Grid container spacing={12}>
          <Grid item xs={12} md={12}>
            <Typography variant="h2" color="text.primary">
              Receiving Desk
            </Typography> 
          </Grid>
        </Grid>
      </Container>
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
      {parts && quantities && <ReceivingTable {...props} />}
    </div>
  );
};

export default Receiving;
