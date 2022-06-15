import React from 'react';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import API from '../api';

const OrdersTable = (props) => {
  let stat;
  //sets status text to be displayed
  function Status(stat) {
    if (stat === false) {
      return 'Complete';
    }
    return 'Incomplete';
  }
 //different styles used for the tables
  const useStyles = makeStyles({
    tableRow: {
      background: '#E9E9E9',
      flexDirection: 'row',
      border: 'solid',
    },
    tableRow2: {
      background: '#E9E9E9',
      flexDirection: 'row',
    },
    tableDetails: {
      display: 'flex',
      flexDirection: 'column',
      width: '30%',
    },
    tableDetails2: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
    },
    tableQuantity: {
      display: 'flex',
      flexDirection: 'column',
      width: '45%',
      marginTop: '25px',
      marginLeft: '50px',
    },
    colorstatus: {
      color: 'red',
    },
  });
  //Function for changing the status on an order from 0 1
  function CompleteOrder(orderids) {
    API.get('/setStatus', { params: { orderid: orderids } });
    alert('Order: ' + orderids + ' marked as complete!');
    window.location.reload(false);
  }
 //display the orders that are incomplete to the user 
  const classes = useStyles();
  return (
    <div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table aria-label="table">
            <TableBody>
              {props.orders &&
                props.orders.map((order) => {
                  return (
                    <TableRow
                      className={classes.tableRow}
                      tabIndex={-1}
                      key={order.orderId}
                    >
                      {(stat = order.oComplete ? false : true)}
                      <div>
                        <b>Order ID: {order.orderId}</b>
                      </div>
                      <div className={classes.colorstatus}>
                        {' '}
                        <b> Status: {Status(stat)} </b>{' '}
                      </div>

                      <TableCell>
                        <div>
                          <b>Invoice</b>
                        </div>
                        <div>
                          {' '}
                          <b>------------------------------------------- </b>
                        </div>
                        <div>Customer Name: {order.custName}</div>
                        <div>Order Cost: ${order.oAmount}</div>
                        <div>Shipping Cost: ${order.oShipping.toFixed(2)}</div>
                        <div>
                          Total Cost: $
                          {(order.oShipping + order.oAmount).toFixed(2)}
                        </div>
                        <div>Total weight: {order.oWeight.toFixed(2)} Lb</div>
                        <div>
                          {' '}
                          <b> Packing list: </b>
                        </div>
                        <div>
                          {' '}
                          <b>------------------------------------------- </b>
                        </div>
                        {props.items
                          .filter(
                            (item) => item['orderId'] === order['orderId']
                          )
                          .map((item) => {
                            return (
                              <TableRow
                                className={classes.tableRow2}
                                tabIndex={-1}
                                key={item.orderId === 1}
                              >
                                <div>
                                  {' '}
                                  # {item.itemNum} Item: {item.iDescr} - ${' '}
                                  {item.itemAmount.toFixed(2)}
                                </div>
                                <div> Amount: {item.quantity}</div>
                                <div>
                                  {' '}
                                  <b>
                                    -------------------------------------------{' '}
                                  </b>
                                </div>
                              </TableRow>
                            );
                          })}

                        <div>
                          <b> Shipping Label:</b>
                        </div>
                        <div>{order.custName}</div>
                        <div> {order.custAddress}</div>
                        <div>
                          {' '}
                          Order confirmation will be sent to: {order.custEmail}
                        </div>
                      </TableCell>
                      <Button
                        className={classes.tableQuantity}
                        tabIndex={-1}
                        sx={{
                          marginRight: 1,
                          color: 'white',
                          background: 'Darkblue',
                        }}
                        variant="contained"
                        onClick={() => (
                          <div>
                            {CompleteOrder(order.orderId)} {'\n'}
                          </div>
                        )}
                      >
                        Complete Order
                      </Button>
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

export default OrdersTable;
