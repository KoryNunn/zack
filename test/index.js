var test = require('tape'),
    zack = require('../');

test('success case', function(t){

    t.plan(4);

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

    var doThing = transact(function(transaction, a, b, callback){
        callback(null, a + b);
    });

    doThing(10, 20, function(error, result){
        t.notOk(error, 'No error');
        t.equal(result, 30, 'Correct result');
    });

});

test('error case', function(t){

    t.plan(4);

    var transact = zack({
        create: function(callback){
            t.ok('create called');
            callback(null, {
                foo: 'bar'
            });
        },
        commit: function(transaction, callback){
            t.fail('commit called');
            transaction.commited = true;
            callback();
        },
        rollback: function(transaction, callback){
            t.ok('rollback called');
            transaction.rolledBack = true;
            callback();
        }
    });

    var doThing = transact(function(transaction, a, b, callback){
        callback(new Error('borked'));
    });

    doThing(10, 20, function(error, result){
        t.ok(error, 'No error');
        t.notOk(result, 'Correct result');
    });

});

test('transaction create error case', function(t){

    t.plan(3);

    var transact = zack({
        create: function(callback){
            t.ok('create called');
            callback(new Error('BORKED'));
        },
        commit: function(transaction, callback){
            t.fail('commit called');
            transaction.commited = true;
            callback();
        },
        rollback: function(transaction, callback){
            t.fail('rollback called');
            transaction.rolledBack = true;
            callback();
        }
    });

    var doThing = transact(function(transaction, a, b, callback){
        t.fail('task called');
        callback(new Error('borked'));
    });

    doThing(10, 20, function(error, result){
        t.ok(error, 'No error');
        t.notOk(result, 'Correct result');
    });

});