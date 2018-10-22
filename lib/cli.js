
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

		var args = str.split(" ");
		var cmd  = args.shift().toLowerCase();
		switch(cmd) {
			case 'set':
				try {
					this.getDB().set(args);
					console.log(chalk.green(' OK'));
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'get':
				try {
					var value = this.getDB().get(args);
					console.log(chalk.green(' ' + value));
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'del':
				try {
					this.getDB().del(args);
					console.log(chalk.green(' OK'));
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'incr':
				try {
					this.getDB().incr(args);
					console.log(chalk.green(' OK'));
				} catch(e) { console.log(chalk.red(' (error) ' + e.message)); }
				break;
			case 'dbsize':
				try {
					var size = this.getDB().dbsize();
					console.log(chalk.green(' (integer) ' + size));
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
