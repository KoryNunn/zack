function transactTask(settings, task, callback){
    return function(){
        var args = Array.prototype.slice.call(arguments);
            callback = args.pop();

        settings.create(function(error, transaction){
            if(error){
                return callback(error);
            }

            args.push(function(error){
                var resultArgs = arguments;
                if(error){
                    return settings.rollback(transaction, function(){
                        callback.apply(null, resultArgs);
                    });
                }
                settings.commit(transaction, function(){
                    callback.apply(null, resultArgs);
                });
            });

            task.apply(null, [transaction].concat(args));
       });
    };
}

module.exports = function(settings){
    return transactTask.bind(null, settings);
};