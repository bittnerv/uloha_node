//Dependencies
var fs = require('fs');
var express = require('express');
var db = require('./lib/db');

//Parameters
var port = process.argv[2] || 8080;
var file = process.argv[3] || 'log.json';

//Functions
function addToFile(text, file){
    fs.appendFile(file, text+'\n', (err) => {
       if(err) console.error(err);
    });
}

//App
var app = express();
app.get('/track',(req, res) => {
    addToFile(JSON.stringify(req.query), file);
    
    if(req.query['count']){
        db.increment('count', Number(req.query['count']));
    }
    
    res.send(req.query);
});

var server = app.listen(port);

//Shutdown
function shutdown(){
    server.close(() => {
        db.quit();
        process.exit();
    }); 
    setTimeout(() => process.exit(), 10*1000);
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown); 