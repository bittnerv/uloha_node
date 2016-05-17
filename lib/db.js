//Dependencies
var async = require('async');
var redis = require('redis');


function Database(){
    this.client = redis.createClient();
    
    this.printError = (err) => {
        if(err) return console.error(err);
    };
    
    this.client.on('error', this.printError);
    
}

Database.prototype.modify = function(key, modifier, callback){
    async.waterfall([
        (callback) => 
            this.client.get(key, callback),
        modifier,
        (n, callback) => 
            this.client.set(key, n, callback)
    ], callback);
};


module.exports = new Database();