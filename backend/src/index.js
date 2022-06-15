const express = require('express');
const parts = require('./controllers/parts');
const orders = require('./controllers/orders');
const cors = require('cors');
const bodyParser = require('body-parser');
const { SqlError } = require('mariadb');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

BigInt.prototype.toJSON = function () {
  return this.toString();
};
const base = '/api';

app.get(`${base}/getParts`, (req, res) => {
  parts.getAll((list) => {
    res.json({ all: list });
  });
});

app.post(`${base}/getAuth`, (req, res) => {
  console.log(req.query.orderId);
  const order = { title: 'Axios POST Request Example' };

  credit.processCC((order) => {
    res.json({ all: list });
  });
});
//gets shipping rates from DB
app.get(`${base}/getShippingRates`, async (req, res) => {
  try {
    const result = await orders.pool.query('SELECT * FROM Rates');
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//gets the inventory from DB
app.get(`${base}/getPartsInv`, async (req, res) => {
  try {
    const result = await orders.pool.query('SELECT * FROM Inventory');
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//Gets rates that are greater than new rate
app.get(`${base}/getRateLowMax`, async (req, res) => {
  try {
    const result = await orders.pool.query(
      'SELECT Max(low) AS lowrate FROM Rates WHERE low <= ' + req.query.rate
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//Gets rates that are less than new rate
app.get(`${base}/getRateHighMin`, async (req, res) => {
  try {
    const result = await orders.pool.query(
      'SELECT Min(high) AS highrate FROM Rates WHERE high >= ' + req.query.rate
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//get all orders from db
app.get(`${base}/getOrders`, async (req, res) => {
  try {
    const result = await orders.pool.query(
      'SELECT orderId, custName, oAmount, oShipping, custAddress, custEmail, oWeight, oComplete FROM Customer, Orders WHERE oComplete = 0 AND Orders.custId = Customer.custId'
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//get all orders from db for admin page
app.get(`${base}/getOrdersAdmin`, async (req, res) => {
  try {
    const result = await orders.pool.query(
      'SELECT orderId, custName, oAmount, oShipping, oDate, custAddress, custEmail, oWeight, oComplete FROM Customer, Orders WHERE Orders.custId = Customer.custId'
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//get all items for an order from the db
app.get(`${base}/getItems`, async (req, res) => {
  try {
    const result = await orders.pool.query(
      ' SELECT orderId ,itemNum, itemAmount, quantity, iDescr FROM OrderItems, Inventory WHERE OrderItems.itemId = Inventory.iPartNum'
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// starts process of creating new records in internal DB
app.post(`${base}/processOrder`, async (req, res) => {
  var formattedCC = req.body.creditCard.replace(/ /g, '');
  console.log(`name: ${req.body.name}`);
  console.log(`email: ${req.body.email}`);
  console.log(`address: ${req.body.address}`);
  console.log(`formattedCC: ${formattedCC}`);
  console.log(`expiration: ${req.body.expiration}`);
  console.log(`amount: ${req.body.amount}`);
  console.log(`shipping: ${req.body.shipping}`);
  console.log(`weight: ${req.body.weight}`);
  console.log(`cart: ${req.body.cart}`);

  const body = req.body;
  createCustomer(body, createOrder);
  res.send('success');
});

// ce=reates a new customer record in internal DB
async function createCustomer(body, callback) {
  var customerId = '';
  try {
    var formattedCC = body.creditCard.replace(/ /g, '');
    var sql =
      "INSERT INTO Customer (custName, custEmail, custAddress, custCCNum, custCCExp) VALUES('" +
      body.name +
      "','" +
      body.email +
      "','" +
      body.address +
      "','" +
      formattedCC +
      "','" +
      body.expiration +
      "')";
    const result = await orders.pool.query(sql);
    console.log(`IN CREATE CUSTOMER: ${result.insertId}`);
    customerId = result.insertId;
  } catch (err) {
    throw err;
  }
  callback(body, customerId, createOrderItems);
}

// creates new order record in internal DB
async function createOrder(body, customerId, callback) {
  var orderId = '';
  var currentdate = new Date();
  var orderDate =
    currentdate.getFullYear() +
    '-' +
    currentdate.getMonth() +
    '-' +
    currentdate.getDay();

  try {
    console.log(`IN CREATEORDER (customerId): ${customerId}`);
    var sql =
      'INSERT INTO Orders (custId, oAmount, oShipping, oWeight, oDate) VALUES(' +
      customerId +
      ',' +
      body.amount +
      ',' +
      body.shipping +
      ',' +
      body.weight +
      ', "' +
      orderDate.toString() +
      '")';
    console.log(sql);
    const result = await orders.pool.query(sql);
    console.log(`IN CREATE ORDER (orderId): ${result.insertId}`);
    orderId = result.insertId;
  } catch (err) {
    throw err;
  }
  callback(body.cart, orderId);
  updateInventory(body.cart);
}

// create order item records for each item in order in internal DB
function createOrderItems(cart, orderId) {
  cart.map((item, index) => {
    try {
      var sql =
        'INSERT INTO OrderItems (orderId, itemNum, itemId, itemDesc, itemAmount, itemWeight, quantity) VALUES(' +
        orderId +
        ',' +
        ++index +
        ',' +
        item.number +
        ",'" +
        item.description +
        "'," +
        item.price +
        ',' +
        item.weight +
        ',' +
        item.quantity +
        ')';
      console.log(sql);
      const result = orders.pool.query(sql);
      console.log(`New Order item: ${result.insertId}`);
    } catch (err) {
      throw err;
    }
  });
}

// update internal DB inventory record for each item in order
function updateInventory(cart) {
  cart.map((item) => {
    try {
      var sql =
        'UPDATE Inventory SET iOnHand  = ' +
        (item.available - item.quantity) +
        ' WHERE iPartNum = ' +
        item.number;
      const result = orders.pool.query(sql);
      console.log(result);
    } catch (err) {
      throw err;
    }
  });
}
//set the status of an order in the db
app.get(`${base}/setStatus`, async (req, res) => {
  try {
    var sql =
      'UPDATE Orders SET oComplete = 1 WHERE orderId = ' + req.query.orderid;
    const result = await orders.pool.query(sql);
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//delete order from db
app.get(`${base}/RemoveFromSystem`, async (req, res) => {
  try {
    var sql = 'DELETE FROM OrderItems WHERE orderId = ' + req.query.orderid;
    const result = await orders.pool.query(sql);
    var sql = 'DELETE FROM Orders WHERE orderId  = ' + req.query.orderid;
    const result2 = await orders.pool.query(sql);
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//update amount of an item in the db
app.get(`${base}/setAmount`, async (req, res) => {
  try {
    var sql =
      'UPDATE Inventory SET iOnHand  = ' +
      req.query.amount +
      ' WHERE iPartNum = ' +
      req.query.partid;
    const result = await orders.pool.query(sql);
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//adjust rates for newly added rates
app.get(`${base}/setNewHigh`, async (req, res) => {
  try {
    var sql =
      'UPDATE Rates SET high  = ' +
      req.query.high +
      ' WHERE low = ' +
      req.query.low;
    const result = await orders.pool.query(sql);
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//add new rates to rate table in db
app.get(`${base}/setNewLow`, async (req, res) => {
  try {
    var sql =
      'INSERT INTO Rates (low, high, rate) VALUES (' +
      req.query.low +
      ',' +
      req.query.high +
      ',' +
      req.query.cost +
      ')';
    const result = await orders.pool.query(sql);
    res.send(result);
  } catch (err) {
    throw err;
  }
});

// get quantities of inventory items
app.get(`${base}/getQuantities`, async (req, res) => {
  try {
    const result = await orders.pool.query(
      'select iPartNum, iOnHand from Inventory'
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});
//remove rates from db
app.get(`${base}/RemoveRate`, async (req, res) => {
  try {
    const result = await orders.pool.query(
      'UPDATE Rates SET high = ' +
        req.query.high +
        ' WHERE high = ' +
        req.query.low
    );
    const result2 = await orders.pool.query(
      'DELETE FROM Rates WHERE rate = ' + req.query.cost
    );
    res.send(result);
  } catch (err) {
    throw err;
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
