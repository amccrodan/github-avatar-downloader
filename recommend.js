var get_contrib = require('./get-contributors');

// Take in command line arguments, ignoring the location of Node and this file
var myArgs = process.argv.slice(2);

// Check to make sure two arguments have been passed in
if (myArgs.length !== 2) {
  console.log('Please enter exactly 2 arguments, in the form <owner> <repo>.');
  process.exit();
}

// Call the main function with command line input
get_contrib.getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
  console.log(result);
});