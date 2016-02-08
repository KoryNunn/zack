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
        t.ok('create called');
        callback(null, {
            foo: 'bar'
        });
    },
    commit: function(transaction, callback){
        t.ok('commit called');
        transaction.commited = true;
        callback();
    },
    rollback: function(transaction, callback){
        t.fail('rollback called');
        transaction.rolledBack = true;
        callback();
    }
});

// wrap a task with a transaction.
var doThing = transact(function(transaction, a, b, callback){
    callback(null, a + b);
});

// call the task, transactions are automatically handled.
doThing(10, 20, function(error, result){
    t.notOk(error, 'No error');
    t.equal(result, 30, 'Correct result');
});
```