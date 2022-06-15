CREATE OR REPLACE DATABASE orders CHARACTER SET='utf8mb4' COLLATE='utf8mb4_general_ci' COMMENT='Our Internal DB';

USE 'orders';

--Customer table
CREATE TABLE Customer (
	custId INT(6) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	custName VARCHAR(32) NOT NULL,
	custEmail VARCHAR(50) NOT NULL,
	custAddress VARCHAR(150) NOT NULL,
	custCCNum VARCHAR(16) NOT NULL,
	custCCExp VARCHAR(7) NOT NULL
);
--Order Table
CREATE TABLE Orders (
	orderId INT(6) PRIMARY KEY NOT NULL AUTO_INCREMENT,
	custId INT(6) NOT NULL,
	oAmount FLOAT (8,2) NOT NULL,
	oShipping FLOAT (8,2) NOT NULL,
	oWeight FLOAT (8,2) NOT NULL,
	oComplete BOOLEAN NOT NULL default 0,
	oDate VARCHAR(10) NOT NULL,
	FOREIGN KEY(custId) REFERENCES Customer(custId)
);
--Items that are in an order table for warehouse
CREATE TABLE OrderItems (
	orderId INT(6) NOT NULL,
	itemId INT(6) NOT NULL,
	itemNum INT(6) NOT NULL,
	itemDesc VARCHAR(255) NOT NULL,
	itemAmount FLOAT(8,2) NOT NULL,
	itemWeight FLOAT(4,2) NOT NULL,
	quantity INT(6) NOT NULL,
	PRIMARY KEY(itemNum,orderId),
	FOREIGN KEY(orderId) REFERENCES Orders(orderId)
);
--Inventory table for receiving desk
CREATE TABLE Inventory (
	iPartNum int(6) PRIMARY KEY NOT NULL,
	iDescr VARCHAR(50) NOT NULL,
	iOnHand int(6) NOT NULL
);
--Rate table for shipping rates
CREATE TABLE Rates (
	low FLOAT(8,2) NOT NULL,
	high FLOAT(8,2) NOT NULL,
	rate FLOAT(8,2) NOT NULL,
	PRIMARY KEY(low,high)
);
