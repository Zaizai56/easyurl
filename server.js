var express = require("express");
var app = express();

var port = process.env.PORT || 8080; // set our port

app.listen(port, function() {
  console.log('Server listening on ' + port);
});