var mysql = require('mysql');
var http = require("http");
var handler = require('./request-handler');
var fs = require('fs');
var path = require('path');
var port = 8080;

/* If the node mysql module is not found on your system, you may
 * need to do an "npm install -g mysql". */

var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});
/* You'll need to fill this out with your mysql username and password.
 * database: "chat" specifies that we're using the database called 
 * "chat", which we created by running schema.sql.*/


/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/
/* This is the callback function that will be called each time a
 * client (i.e.. a web browser) makes a request to our server. */
/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */
dbConnection.connect();
var requestListener = function (request, response) {

  console.log("Serving request type " + request.method
              + " for url " + request.url);

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";

   console.log("Calling handle request");
   handler.handleRequest(request, response, dbConnection);
};
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
var port = 8080;
var ip = "127.0.0.1";

/* Use node's http module to create a server and start it listening on
 * the given port and IP. */
var server = http.createServer(requestListener);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);
server.on('connection', function(stream) {
  console.log("Connected");
});

