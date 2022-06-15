import React from 'react';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Button, Tab, TableFooter, TableHead, TextField } from '@mui/material';
import API from '../api';

const AdminRates = (props) => {
    //style used for the table
    const useStyles = makeStyles({
        tableRow: {

            background: '#E9E9E9',
            flexDirection: 'row',
            border: 'solid'
        },

    });
    //set user input rate 
    const [inputRate, setinputRate] = React.useState(0);
    //set user input cost
    const [inpuCost, setinputCost] = React.useState(0);
    const classes = useStyles();
    //if the value of the set rate box is changed
    let inputHandler = (event) => {
        setinputRate(event.target.valueAsNumber);
    };
    //if the value of the set price box is changed
    let inputHandlerCost = (event) => {
        setinputCost(event.target.valueAsNumber);
    };
    //add the new rate into the system
    async function AddNewRate(rate, cost) {
        //get the max of the rate below
        const result = await API.get('/getRateLowMax', { params: { rate: rate } });
        console.log(result);
        var lowMax;
        result.data.map((rate) => {
            lowMax = rate.lowrate
        })
        //get the low of the rate above
        const result2 = await API.get('/getRateHighMin', { params: { rate: rate } });
        var highMin;
        result2.data.map((rate) => {
            highMin = rate.highrate
        })
        //change the high to the low from the new high rate
        await API.get('/setNewHigh', { params: { low: lowMax, high: rate } });
        //add new rate to database
        await API.get('/setNewLow', { params: { low: rate, high: highMin, cost: cost } });
        //reload page
        window.location.reload(false);
    }
    //remove a rate from the system
    async function RemoveRate(low, high, cost) {
        console.log(low + " " + high + " " + cost);
        //remove rate from the system
        await API.get('/RemoveRate', { params: { low: low, high: high, cost: cost } });
        //refresh page
        window.location.reload(false);
    }
    //display all the rates from the datebase into a table 
    return (
        <div><Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 1000 }}>
                <Table aria-label="table">
                    <TableHead>
                        <TableRow
                            className={classes.tableRow}
                        >
                            <TableCell>
                                <div>Low </div>
                            </TableCell>
                            <TableCell >
                                <div>High </div>
                            </TableCell>
                            <TableCell >
                                Cost
                            </TableCell>
                            <TableCell >

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.shippingRates &&
                            props.shippingRates.map((rate) => {
                                return (
                                    <TableRow
                                        className={classes.tableRow}>
                                        <TableCell>
                                            <div>{rate.low}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{rate.high}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div>{rate.rate}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                tabIndex={-1}
                                                sx={{
                                                    margin: 'center',
                                                    color: 'white',
                                                    background: 'Darkblue',
                                                }}
                                                variant="contained"
                                                onClick={() =>
                                                    RemoveRate(
                                                        rate.low,
                                                        rate.high,
                                                        rate.rate
                                                    )}
                                            >
                                                Remove Rate
                                            </Button>
                                        </TableCell>
                                    </TableRow>


                                )
                            })}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell>
                                <div>Weight</div>
                                <TextField
                                    type="number"
                                    defaultValue="0"
                                    onChange={(e) => inputHandler(e)}
                                />
                            </TableCell>
                            <TableCell>
                                <div>Cost</div>
                                <TextField
                                    type="number"
                                    defaultValue="0"
                                    onChange={(e) => inputHandlerCost(e)}
                                />
                            </TableCell>
                            <Button
                                tabIndex={-1}
                                sx={{
                                    margin: 'center',
                                    color: 'white',
                                    background: 'Darkblue',
                                }}
                                variant="contained"
                                onClick={() =>
                                    AddNewRate(
                                        inputRate,
                                        inpuCost
                                    )}
                            >
                                Add Rate
                            </Button>
                        </TableRow>
                    </TableFooter>
                </Table>

            </TableContainer>

        </Paper></div>
    )
};

export default AdminRates