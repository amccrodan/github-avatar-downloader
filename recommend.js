require('dotenv').config();
var get_contrib = require('./get-contributors');
var request = require('request');

var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function reportTop5(starArray) {
  var tallyObject = {};

  starArray.forEach(function(star) {
    tallyObject[star] = (tallyObject[star] || 0) + 1;
  });

  keysSorted = Object.keys(tallyObject).sort(function(a, b) {
    return tallyObject[b] - tallyObject[a];
  });

  for (var i = 0; i < 5; i++) {
    console.log(`[ ${tallyObject[keysSorted[i]]} stars ] ${keysSorted[i]}`);
  }
}

function getStarredRepos (url, starArray, counter, totalUsers) {
  var options = {
    url: url,
    headers: {
      'User-Agent': "GitHub Repo Recommender - Student Project"
    },
    json: true
  };

  request.get(options, function(err, response, body) {

    for (var i = 0; i < body.length; i++) {
      starArray.push(body[i].full_name);
    }

    counter.count += 1;
    console.log(`${counter.count} / ${totalUsers}`);

    if (counter.count === totalUsers) {
      console.log(`${starArray.length} starred repos gathered.`);
      reportTop5(starArray);
    }
  })
  .auth(null, null, true, GITHUB_TOKEN)

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

  var totalArr = [];
  var counter = { count: 0 };

  for (var i = 0; i < result.length; i++) {
    getStarredRepos(result[i].starred_url.replace('{/owner}{/repo}', ''), totalArr, counter, result.length);
  }

});