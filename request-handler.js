/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */
var http = require("http");
var url = require("url");
var querystring = require('querystring');
var VALID_GET_ROUTES = ['/', '/classes/room', '/classes/messages'];
var VALID_POST_ROUTES = ['/', '/classes/room'];
var fileServer = require('./fileServer');
var mime = require('mime');

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var handleRequest = function(request, response, dbConnection) {
  var pathname = url.parse(request.url).pathname;
  console.log("HandleRequest Pathname: " + pathname);
  switch(request.method) {
    case "OPTIONS":
      response.writeHead(200, defaultCorsHeaders);
      response.write("");
      response.end();
      return;
      break;
    case "GET":
        response.writeHead(200, defaultCorsHeaders);
        handleGetRequest(request, response, dbConnection);
        return response;
      break;
    case "POST":
      handlePostRequest(request, response, dbConnection);
      response.end("\n");
      return response;
      break;
    default:
      response.writeHead(200, defaultCorsHeaders);
  }

  // response.end("");
  return response;
};

var handleGetRequest = function(request, response, dbConnection) {
  console.log("Handling GetRequest");
  var pathname = url.parse(request.url).pathname;
  console.log("Pathname is");
  var type = mime.lookup(pathname);
  console.log("Request type is ");
  console.log(type);

  switch(type) {
    case 'application/json':
      var dbSelect = "SELECT username, message FROM messages ORDER BY cur_timestamp ASC;";
      dbConnection.query(dbSelect, function(err, rows, fields) {
        if (err) {
          console.log("Error connecting");
          throw err;
        } else {
          var allMessages = JSON.stringify(rows);
          response.end(allMessages);
        }
      });
      break;
    case 'text/css':
    case 'text/javascript':
      console.log("Calling fileServer with text or js");
      fileServer.serve(pathname, request, response);
      break;
    break;
    default:
      fileServer.serve('/index.html', request, response);

  }
};

var handlePostRequest = function(request, response, dbConnection) {
  var postData = "";
  var pathname = url.parse(request.url).pathname;
  if (!(checkValidRoutes(pathname, VALID_POST_ROUTES))) {
    response.writeHead(302, defaultCorsHeaders);
  };
  
  request.setEncoding("utf8");
  request.on("data", function(postDataChunk) {
    postData += postDataChunk;
  });

  request.on("end", function() {

    postData = JSON.parse(postData);
    var dbInsert = "INSERT INTO messages (username, message) values('" + postData.username + "','" + postData.message + "');"; 
    console.log(dbInsert);

    dbConnection.query(dbInsert, function(err, rows, fields) {
      if (err) {
        console.log("Error connecting");
        throw err;
      }
    });
    response.writeHead(302, defaultCorsHeaders);
  });
};

var checkValidRoutes = function(route, validRoutesList) {
  for (var i=0; i<validRoutesList.length; i++) {
    if (route === validRoutesList[i]) {
      return true;
    }
  }
  return false;
};


exports.handleRequest = handleRequest;