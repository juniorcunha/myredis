
var chalk   = require('chalk');
var express = require('express');
var bparser = require('body-parser');

module.exports = {

	// Set the database
	setDB: function(db) {
		this.db = db;
	},
	// Get the database
	getDB: function() {
		return this.db;
	},

	log: function(msg) {
		console.log( chalk.green(' > ') + msg );
	},

	start: function() {

		var self = this;
		var app = express();
		app.set('trust proxy', 1);
		app.use(bparser.json({ limit:'5mb' }));
		app.use(bparser.urlencoded({ limit:'5mb', extended: true }));
		app.self = self;
		app.all('/', self.parse);
		app.listen(8080,function() {
			self.log('worker pid ' + process.pid + ' started http interface on port 8080\n'); 
		});

	},

	parse: function(req,res,next) {

		var self = req.app.self;
		var str  = req.query.cmd || "";
		var args = str.toLowerCase().split(" ");
		var cmd  = args.shift();
		self.log('[payload] ' + str);
		switch(cmd) {
			case 'set':
				try {
					var key   = args.shift();
					var value = args.shift();
					var ex    = (args.shift() === 'ex') ? true : false;
					var time  = args.shift();
					if ((ex && !time) || (!ex && time))
						throw new Error('ERR syntax error');
					self.getDB().set(key,value,function() {
						if (ex && time) {
							self.getDB().expire(key,time, function() {
								self.log('OK');
								res.end('OK');
							});
						} else {
							self.log('OK');
							res.end('OK');
						}
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'get':
				try {
					var key   = args.shift();
					self.getDB().get(key, function(value) {
						self.log(value);
						res.end(value.toString());
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'del':
				try {
					var key = args.shift();
					self.getDB().del(key, function() {
						self.log('OK');
						res.end('OK');
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'incr':
				try {
					var key = args.shift();
					self.getDB().incr(key, function() {
						self.log('OK');
						res.end('OK');
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'dbsize':
				try {
					self.getDB().dbsize(function(size) {
						self.log('(integer) ' + size);
						res.end(size.toString());
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'zadd':
				try {
					var key    = args.shift();
					var score  = args.shift();
					var member = args.shift();
					self.getDB().zadd(key,score,member,function() {
						self.log('OK');
						res.end('OK');
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'zcard':
				try {
					var key    = args.shift();
					self.getDB().zcard(key,function(size) {
						self.log('(integer) ' + size);
						res.end(size.toString());
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'zrank':
				try {
					var key    = args.shift();
					var member = args.shift();
					self.getDB().zrank(key,member,function(rank) {
						self.log('(integer) ' + rank);
						res.end(rank.toString());
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			case 'zrange':
				try {
					var key   = args.shift();
					var start = args.shift();
					var stop  = args.shift();
					self.getDB().zrange(key,start,stop,function(range) {
						var arr = [];
						range.forEach(function(v,i) {
							i++;
							self.log(' ' + i + ') ' + v.member + ': ' + v.score);
							arr.push(' ' + i + ') ' + v.member + ': ' + v.score);
						});
						res.end(arr.join('\n'));
					});
				} catch(e) {
					self.log('(error) ' + e.message);
					res.end('(error) ' + e.message);
				}
				break;
			default:
				self.log('(error) ERR unknown command "' + cmd + '"');
				res.end('(error) ERR unknown command "' + cmd + '"');
				break;
		}
	}
};

