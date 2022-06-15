import React from 'react';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button, Grid, TextField } from '@mui/material';
import API from '../api';

const useStyles = makeStyles({
  tableRow: {
    background: '#E9E9E9',
    flexDirection: 'row',
    border: 'solid',
  },
});

function addToInv(amount, partid) {
  API.get('/setAmount', { params: { partid: partid, amount: amount } });
  alert('Item: ' + partid + ' Amount Updated!');
  window.location.reload(false);
}

const ReceivingTable = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const classes = useStyles();
  const [inputQuantity, setinputQuantity] = React.useState(0);
  let inputHandler = (event, part) => {
    setinputQuantity(event.target.valueAsNumber);
  };

  const filteredParts = props.parts.filter((part) => {
    if (props.inputText === '') {
      return part;
    } else {
      return part.iDescr.toLowerCase().includes(props.inputText);
    }
  });

  return (
    <div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table aria-label="table">
            <TableBody className={classes.tableRow} tabIndex={-1}>
              {filteredParts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((part) => {
                  return (
                    <TableRow key={part.iPartNum}>
                      Item ID: {part.iPartNum}
                      <TableCell>
                        <div>{part.iDescr.toUpperCase()}</div>
                        <div>Amount: {part.iOnHand}</div>
                      </TableCell>
                      <TableCell className={classes.tableQuantity}>
                        <Grid container>
                          <div sx={{ marginRight: 50 }}>Quantity:</div>
                          <div>
                            <TextField
                              type="number"
                              defaultValue="0"
                              onChange={(e) => inputHandler(e, part.iPartNum)}
                            />
                          </div>
                          <div>
                            <Button
                              sx={{ marginLeft: 5 }}
                              variant="contained"
                              onClick={() =>
                                addToInv(
                                  inputQuantity + part.iOnHand,
                                  part.iPartNum
                                )
                              }
                            >
                              Add To Inventory
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
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredParts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ReceivingTable;
