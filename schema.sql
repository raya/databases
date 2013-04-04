CREATE DATABASE chat;

USE chat;

CREATE TABLE messages (
  id INT,
  username VARCHAR(30),
  message VARCHAR(3000),
  cur_timestamp TIMESTAMP
);

CREATE TABLE users(
  id INT,
  username VARCHAR(30),
  textColor varchar(15),
  font varchar(10),
  signOffMessage varchar(100),
  PRIMARY KEY ('id')
);

/* You can also create more tables, if you need them... */

/*  Execute this file from the command line by typing:
 *    mysql < schema.sql   
 *  to create the database and the tables.*/