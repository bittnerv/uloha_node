//Dependencies
var async = require('async');
var db = require('./lib/db');
var express = require('express');
var fs = require('fs');


//Parameters
var port = process.argv[2] || 8080;
var file = process.argv[3] || 'log.json';


//App
var app = express();
var server = app.listen(port);
var logStream = fs.createWriteStream(file, {
    flags: 'a'
});

app.get('/track', (req, res) => {
    async.parallel([
        (callback) =>
            logStream.write(JSON.stringify(req.query) + '\n', callback), 
        (callback) => {
            if (isFinite(req.query['count'])) {
                db.client.incrbyfloat('count', req.query['count'], callback);
            }
        }
    ], (err) => {
        if (err) console.error(err);
        res.send(req.query);
    });
    
});



//Shutdown
function shutdown() {
    server.close(() => {
        db.client.quit();
        logStream.end();
        process.exit();
    });
    setTimeout(() => process.exit(), 10 * 1000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

exports.closeServer = function(){
  shutdown();
};