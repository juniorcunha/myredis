
//
// NPM Modules
//
var chalk    = require('chalk');
var figlet   = require('figlet');
var minimist = require('minimist');

//
// APP Modules
//
var db       = require('./lib/db');

function init() {

	// Show app header
	console.log( chalk.blue(figlet.textSync('myRedis')) + "\n\n" );

	// Parse command line
	var argv = minimist(process.argv.slice(2));
	if (process.argv.length <= 2 || argv.help)
		return showHelp();

	// Load frontend according to given arguments
	if (argv.http) {
		var http = require('./lib/http');
		http.setDB(db);
		http.start();
	}
	if (argv.cli) {
		var cli = require('./lib/cli');
		cli.setDB(db);
		cli.start();
	}

}

function showHelp() {

	console.log(" Usage: node app.js --http");
	console.log("   or   node app.js --cli")
	console.log("\n");
	console.log(" Options:");
	console.log("  --http    Start the http network interface in order to interact with the database");
	console.log("  --cli     Use the CLI (Command Line Interface) to interact with the database");
	console.log("  --help    Show this help message");
	console.log("\n"); 

}

init();
