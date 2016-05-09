//Dependencies
var redis = require('redis');

function database(){
    this.client = redis.createClient();
    
    this.client.on('error', (err) => {
        if(err) console.error(err);
    });
}

database.prototype.modify = function(key, modifier){
    this.client.get(key, (err, reply) => {
        var n = Number(reply) || 0;
        this.client.set(key, modifier(n));
    });  
};

database.prototype.increment = function(key, value){
    this.modify(key, (x) => x+value);  
};

database.prototype.quit = function(){
    this.client.quit();
};

module.exports = new database();