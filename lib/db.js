
var sizeof = require('object-sizeof');

module.exports = {
	data: {},
	//
	// https://redis.io/commands/set
	// 
	set: function(args) {
		var key  = args.shift();
		var arg1 = args.shift();
		var opt  = args.shift();
		var arg2 = args.shift();
		if (!arg1)
			throw new Error('wrong number of arguments for "set" command');
		this.data[ key ] = { value: arg1, opt: opt, optValue: arg2 };
	},
	//
	// https://redis.io/commands/get
	//
	get: function(args) {
		var key  = args.shift();
		if (this.data.hasOwnProperty(key))
			return this.data[key].value;
		else
			throw new Error('key not found');
	},
	//
	// https://redis.io/commands/del
	//
	del: function(args) {
		var key  = args.shift();
		if (this.data.hasOwnProperty(key))
			delete this.data[key];
		else
			throw new Error('key not found');

	},
	//
	// https://redis.io/commands/incr
	//
	incr: function(args) {
		try {
			var arr   = [ args[0] ];
			var value = parseInt(this.get(args)) + 1;
			arr.push(value);
			this.set(arr);
		} catch(e) {
			throw new Error('value is not an integer or out of range');
		}
	},
	//
	// https://redis.io/commands/dbsize
	//
	dbsize: function() {
		return sizeof(this.data);
	}
};
