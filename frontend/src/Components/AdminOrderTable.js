import React from 'react';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Button, Tab } from '@mui/material';
import API from '../api';

const AdminOrderTable = (props) => {
  //remove orders from database fully
  function RemoveOrder(orderids) {
    API.get('/RemoveFromSystem', { params: { orderid: orderids } });
    alert('Order: ' + orderids + ' marked as Removed!');
    window.location.reload(false);
  }
  //styles used for the tables on the admin order table
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
  //used for the filter options for which orders to display
  function filteredOrders() {
    let ordersArr = props.orders.filter((order) => {
      if (
        (isNaN(props.inputLow) || isNaN(props.inputHigh)) &&
        props.status === 3
      ) {
        return order;
      } else if (
        (isNaN(props.inputLow) || isNaN(props.inputHigh)) &&
        (props.status === 0 || props.status === 1)
      ) {
        return props.status === order.oComplete;
      } else if (isNaN(props.inputLow) || isNaN(props.inputHigh)) {
        return order.oComplete === 0 || order.oComplete === 1;
      } else if (props.status === 0 || props.status === 1) {
        let total = order.oAmount + order.oShipping;
        return (
          total >= props.inputLow &&
          total <= props.inputHigh &&
          props.status === order.oComplete
        );
      } else {
        let total = order.oAmount + order.oShipping;
        return (
          total >= props.inputLow &&
          total <= props.inputHigh &&
          (order.oComplete === 0 || order.oComplete === 1)
        );
      }
    });

    let result = [];

    if (ordersArr) {
      result = ordersArr.filter((order) => {
        const to = new Date(props.toDate);
        const from = new Date(props.fromDate);
        const order_date = new Date(order.oDate);

        if (order_date >= from && order_date <= to) {
          return order;
        }
      });
    }

    return result;
  }

  const classes = useStyles();
  //display all the orders in the systems by defualt if no filters are set
  return (
    <div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table aria-label="table">
            <TableBody>
              {props.orders &&
                filteredOrders().map((order) => {
                  return (
                    <TableRow
                      className={classes.tableRow}
                      tabIndex={-1}
                      key={order.orderId}
                    >
                      <div>
                        <b>ID = {order.orderId} Order </b>{' '}
                      </div>{' '}
                      <div>
                        <b>Date: {order.oDate} </b>{' '}
                      </div>{' '}
                      <div>
                        <b>
                          {' '}
                          Status ={' '}
                          {order.oComplete === 0
                            ? 'Incomplete'
                            : 'Complete'}{' '}
                        </b>{' '}
                      </div>
                      <TableCell>
                        <div>Name = {order.custName}</div>
                        <div>{order.custEmail}</div>
                        <div>------------------------</div>
                        <div>{order.custName}</div>
                        <div> {order.custAddress}</div>
                      </TableCell>
                      <TableCell>
                        <div>Weight = {order.oWeight}Lb</div>
                        <div>Order Amount = ${order.oAmount}</div>
                        <div>Shipping Cost = ${order.oShipping}</div>
                        <div>
                          {' '}
                          Price Total = ${(order.oAmount + order.oShipping).toFixed(2)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>Items In Order</div>
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
                      </TableCell>
                      <Button
                        className={classes.tableQuantity}
                        tabIndex={-1}
                        sx={{
                          marginRight: 1,
                          color: 'white',
                          background: 'gray',
                        }}
                        variant="contained"
                        onClick={() => (
                          <div>
                            {RemoveOrder(order.orderId)} {'\n'}
                          </div>
                        )}
                      >
                        Remove From System
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

export default AdminOrderTable;
