var express = require("express");
var app = express();
var mongo = require('mongodb').MongoClient;
var tools = require('./app/api/tools');

var port = process.env.PORT || 8080; // set our port

app.use(express.static(__dirname + "/app/public"));

app.get('/:url', function(req, res){
    var url = req.url.substring(1);
    mongo.connect('mongodb://ZaiZai:orffyreus88@ds042379.mlab.com:42379/easyurl', function(err, db) {
        if (err) throw err;
        if (url.indexOf(".") == -1){
            db.collection('url').find({
                short: url
            },{
                _id : 0
            }).toArray(function(err, documents) {
                if (err) res.send("invalid easyurl")
                var redirectUrl = documents[0].fullUrl;
                if (redirectUrl.indexOf("http") > -1) redirectUrl = redirectUrl;
            res.redirect(redirectUrl);
        })
        } else {
            var id = tools.makeid();
            var newUrl = {short : id,fullUrl : url};
            JSON.stringify(newUrl);
            db.collection('url').insert(newUrl, function(err, data) {
                if (err) throw err;
                res.send(newUrl);
                db.close();
            });
    }
    });
});

app.listen(port, function() {
  console.log('Server listening on ' + port);
});