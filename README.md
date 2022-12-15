# CSCI 467 Introduction to Software Engineering
# Project3A
Project3A source for CSCI467

# Setup

## Frontend app

```
$ cd frontend
$ npm install
```

## Backend app

```
$ cd backend
$ npm install
```

## Local Database

1. Install Docker for Windows (or Mac) and OPEN ONCE to get access to 'docker' command
2. Get latest MariaDB container using:
```
docker run -p 3307:3306 --detach --name mariadb --env MARIADB_USER=expressapp --env MARIADB_PASSWORD=Password123! --env MARIADB_ROOT_PASSWORD=rootpw mariadb:latest
```
3. Open a shell inside the container using:
```
docker exec -it mariadb bash
```
4. Start the mariaDB CLI as root:
```
mariadb --host 127.0.0.1 -P 3306 --user root -prootpw
```
5. Create our internal database and its tables with one of these options:
- copying and pasting the contents of our project's 'Create_orders_db.sql' script and hitting enter
>```
>MariaDB []> (paste contents of 'Create_orders_db.sql' script here)
>```
>You should now see something like this: MariaDB [orders]>
>Check that out tables were created using:
>```
>$ show tables;
>```
>Now add our mock data:
>```
>MariaDB [orders]> (paste contents of 'Insert_mock_data.sql' script here)
>```
- installing DBeaver, setting up the connection, then running both scripts there

# Starting the apps
## Frontend app

```
cd frontend
npm start
```

## Backend app

open new terminal
```
cd backend
npm start
```

## Local Database

Open Docker desktop app and "run" our mariadb container if it is stopped

# Viewing the databases

1. Install DBeaver: https://dbeaver.io/download/  (get the free "Community Edition")
2. Open DBeaver
3. Create a MySQL connection for the legacy database using these settings:
>host:           blitz.cs.niu.edu <br>
>port:           3306 <br>
>database name:  csci467 <br>
>user:           student <br>
>password:       student <br>
4. Create a MariaDB connection for our internal database using these settings:
>host:           localhost <br>
>port:           3307 <br>
>database name:  orders <br>
>user:           root <br>
>password:       rootpw <br>
