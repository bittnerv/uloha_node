var db = require('../lib/db');

var key = 'test';
var value = 10;

describe('Database', function(){
    describe('#modify', function(){
        before(function(done){
            db.client.set(key, value, done);
        });
        
        it("increment key by 5", function(){
            var modifier = function(n, callback){
                if(isNaN(n)) return callback("NaN");
                callback(null, Number(n)+5);
            };
            
            db.modify("test", modifier, function(err){
                    db.client.get(key, function(err, rep){
                        if(err) return done(err);
                        assert.equal(modifier(value), rep);
                        done();
                    })
                }
            );
        })
    })
})