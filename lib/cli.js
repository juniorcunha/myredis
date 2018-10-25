
var chalk    = require('chalk');
var inquirer = require('inquirer');

module.exports = {

	// Set the database
	setDB: function(db) {
		this.db = db;
	},
	// Get the database
	getDB: function() {
		return this.db;
	},

	//
	// Start the cli interface and wait for commands
	//
	start: function() {

		var self = this;
		inquirer.prompt([{
			type: 'input',
			name: 'str',
			prefix: 'myredis',
			message: chalk.green('>')
		}]).then(function(cmd) {
			if (cmd.str.length)
				self.parse(cmd.str);
			else
				self.start();
		});

	},
	//
	// Parse the command string and call the specified command
	//
	parse: function(str) {

		var args = str.toLowerCase().split(" ");
		var cmd  = args.shift();
		switch(cmd) {
			case 'set':
				try {
					var key   = args.shift();
					var value = args.shift();
					var ex    = (args.shift() === 'ex') ? true : false;
					var time  = args.shift();
					if ((ex && !time) || (!ex && time))
						throw new Error('ERR syntax error');
					var self = this;
					this.getDB().set(key,value,function() {
						if (ex && time) {
							self.getDB().expire(key,time, function() {
								console.log(chalk.green(' OK'));
							});
						} else {
							console.log(chalk.green(' OK'));
						}
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'get':
				try {
					var key   = args.shift();
					this.getDB().get(key, function(value) {
						console.log(chalk.green(' ' + value));
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'del':
				try {
					var key = args.shift();
					this.getDB().del(key, function() {
						console.log(chalk.green(' OK'));
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'incr':
				try {
					var key = args.shift();
					this.getDB().incr(key, function() {
						console.log(chalk.green(' OK'));
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'dbsize':
				try {
					this.getDB().dbsize(function(size) {
						console.log(chalk.green(' (integer) ' + size));
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'zadd':
				try {
					var key    = args.shift();
					var score  = args.shift();
					var member = args.shift();
					this.getDB().zadd(key,score,member,function() {
						console.log(chalk.green(' OK'));
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'zcard':
				try {
					var key    = args.shift();
					this.getDB().zcard(key,function(size) {
						console.log(chalk.green(' (integer) ' + size));
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'zrank':
				try {
					var key    = args.shift();
					var member = args.shift();
					this.getDB().zrank(key,member,function(rank) {
						console.log(chalk.green(' (integer) ' + rank));
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'zrange':
				try {
					var key   = args.shift();
					var start = args.shift();
					var stop  = args.shift();
					this.getDB().zrange(key,start,stop,function(range) {
						range.forEach(function(v,i) {
							i++;
							console.log(chalk.green(' ' + i + ') ' + v.member + ': ' + v.score));
						});
					});
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'quit':
				console.log(chalk.green(' bye'));
				process.exit(0);
			default:
				console.log(chalk.red(' (error) ERR unknown command "' + cmd + '"'));
				break;
		}
		this.start();
	}
};
