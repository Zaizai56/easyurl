var express = require("express");
var app = express();
var mongo = require('mongodb').MongoClient;
var tools = require('./app/api/tools');

var ip = process.env.IP;
var port = process.env.PORT || 8080; // set our port

app.get('/:url', function(req, res){
    var url = req.url.substring(1);
    mongo.connect('mongodb://localhost:27017/easyurl', function(err, db) {
        if (url.indexOf(".") == -1){
            db.collection('url').find({
                short: url
            },{
                _id : 0
            }).toArray(function(err, documents) {
                if (err) res.send("invalid easyurl")
                console.log(documents)
                var redirectUrl = "http://" + documents[0].fullUrl;
                if (redirectUrl.indexOf("http") > -1) redirectUrl = "http://" + redirectUrl;
                console.log("redirecting user to " + redirectUrl)
            res.redirect(redirectUrl);
        })
        } else {
            if (err) throw err;
            var id = tools.makeid();
            console.log("get request passed");
            var newUrl = {short : id,fullUrl : url};
            JSON.stringify(newUrl);
            db.collection('url').insert(newUrl, function(err, data) {
                if (err) throw err;
                console.log(JSON.stringify(newUrl));
                console.log("connection to mongodb established");
                res.send(newUrl);
                db.close();
            });
    }
    });
});

app.listen(port, function() {
  console.log('Server listening on ' + port);
});