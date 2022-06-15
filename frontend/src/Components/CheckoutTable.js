import React from 'react';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Grid, Button } from '@mui/material';

// This component is responsible for rendering the Checkout items table
const CheckoutTable = (props) => {
  // component styles
  const useStyles = makeStyles({
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
    },
    tableImage: {
      display: 'flex',
      flexDirection: 'column',
      width: '15%',
    },
    tableDetails: {
      display: 'flex',
      flexDirection: 'column',
      width: '30%',
    },
    tableQuantity: {
      display: 'flex',
      flexDirection: 'column',
      width: '55%',
    },
  });
  const classes = useStyles();

  return (
    <div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table aria-label="sticky table">
            <TableBody>
              {props.cart.map((row) => {
                return (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.number}
                    id={row.number}
                  >
                    <TableCell className={classes.tableImage}>
                      <img src={row.pictureURL} alt="{row.description}" />
                    </TableCell>
                    <TableCell
                      className={classes.tableDetails}
                      style={{
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                      }}
                    >
                      <div>{row.description}</div>
                      <div>${row.price}</div>
                      <div>{row.weight}lbs</div>
                      <div>quantity: {row.quantity}</div>
                    </TableCell>
                    <TableCell className={classes.tableQuantity}>
                      <Grid container>
                        <div>
                          <Button
                            sx={{ marginLeft: 5 }}
                            variant="contained"
                            disabled={row.available ? false : true}
                            onClick={() => props.removeFromCart(row.number)}
                          >
                            Remove
                          </Button>
                        </div>
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default CheckoutTable;
