import React from 'react';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Grid, TextField, Button } from '@mui/material';

// This component is responsible for rendering the product catalog's table
const PartsTable = (props) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [inputQuantity, setinputQuantity] = React.useState(0);

  // Pagination methods
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // quantity input handler
  let inputHandler = (event, row) => {
    setinputQuantity(event.target.valueAsNumber);
  };

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

  // merges part data from legacy DB with quantity data from internal DB
  const mergePartQuantity = (parts, quantities) => {
    return parts.map((part) => {
      const quantity = quantities
        .filter((item) => item['iPartNum'] === part['number'])
        .slice(0, 1)
        .shift();
      part.available = quantity.iOnHand;
      return part;
    });
  };
  const products = mergePartQuantity(props.parts, props.quantities);

  // apply filter to products list before rendering table
  const filteredParts = products.filter((part) => {
    if (props.inputText === '') {
      return part;
    } else {
      return part.description.toLowerCase().includes(props.inputText);
    }
  });

  return (
    <div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 1000 }}>
          <Table aria-label="sticky table">
            <TableBody>
              {filteredParts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
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
                        <div>available: {row.available}</div>
                      </TableCell>
                      <TableCell className={classes.tableQuantity}>
                        <Grid container>
                          <div sx={{ marginRight: 50 }}>Quantity:</div>
                          <div>
                            <TextField
                              type="number"
                              onChange={(e) => inputHandler(e, row.number)}
                              disabled={row.available ? false : true}
                            />
                          </div>
                          <div>
                            <Button
                              sx={{ marginLeft: 5 }}
                              variant="contained"
                              disabled={row.available ? false : true}
                              onClick={() =>
                                props.addToCart(row.number, inputQuantity)
                              }
                            >
                              Add to cart
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

export default PartsTable;
