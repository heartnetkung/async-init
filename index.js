var EventEmitter = require('events');


exports.create = function() {
	var event = new EventEmitter();
	var isDone = false;
	var ans = {};

	ans.done = function(err) {
		if (err) return console.log(err);
		isDone = true;
		event.emit('done');
	};

	var wrap = ans.wrap = function(obj, functionName) {
		var originalFunction = obj[functionName];
		return function() {
			var args = arguments;
			isDone ?
				process.nextTick(function(){originalFunction.apply(obj, args)}) :
				event.once('done', function() { originalFunction.apply(obj, args); });
		};
	};

	ans.wrapAll = function(obj) {
		var ret = {};
		for (var x in obj)
			if (typeof obj[x] === 'function')
				ret[x] = wrap(obj, x);
			else
				ret[x] = obj[x];
		return ret;
	};

	return ans;
};
