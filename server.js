//Problem: We need a simple way to look at user's badge count and Javascript points from a web browser
//Solution: Use Node.js to perform the profile lookups and server our template via HTTP
var router = require("./router.js")
//Create a web server
const http = require('http');
http.createServer(function (request, response) {
  router.home(request, response);
  router.user(request, response);
}).listen(8080); //the server object listens on port 8080 
console.log("Server running at MyPC");

