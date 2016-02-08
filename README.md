# zack

wrap a task in a tranZacktion.

## install

```
npm i zack
```

## use

```javascript

var zack = require('zack');

// Setup zack with how your application does transactions
var transact = zack({
    create: function(callback){
        db.makeATransaction(callback);
    },
    commit: function(transaction, callback){
        db.commit(transaction, callback);
    },
    rollback: function(transaction, callback){
        db.rollback(transaction, callback);
    }
});

// wrap a task with a transaction.
var doThing = transact(function(transaction, a, b, callback){
    callback(null, a + b);
});

// call the task, transactions are automatically handled.
doThing(10, 20, function(error, result){
    // etc...
});
```