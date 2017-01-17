require('dotenv').config();
var get_contrib = require('./get-contributors');
var request = require('request');

var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;


function getStarredRepos (url) {
  var options = {
    url: url, //'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/users/kvirani/starred',
    headers: {
      'User-Agent': "GitHub Repo Recommender - Student Project"
    },
    json: true
  };

  var starredRepos = [];
  request.get(options, function(err, response, body) {
    //console.log(result[0].full_name);
    for (var i = 0; i < body.length; i++) {
    console.log(body[i].full_name);
    }
  })
  .auth(null, null, true, GITHUB_TOKEN);
}

// Take in command line arguments, ignoring the location of Node and this file
var myArgs = process.argv.slice(2);

// Check to make sure two arguments have been passed in
if (myArgs.length !== 2) {
  console.log('Please enter exactly 2 arguments, in the form <owner> <repo>.');
  process.exit();
}

// Call the main function with command line input
get_contrib.getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
  getStarredRepos(result[0].starred_url.replace('{/owner}{/repo}', ''));
  // for (var i = 0; i < result.length; i++) {
  //   getStarredRepos(result[i].starred_url.replace('{/owner}{/repo}', ''));
  // }
});