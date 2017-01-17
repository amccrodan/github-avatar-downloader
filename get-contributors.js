require('dotenv').config();
var request = require('request');
var fs = require('fs');

var GITHUB_USER = process.env.GITHUB_USER;
var GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// Requests a JSON-formatted array of contributors to a certain repo on GitHub
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: 'https://' + GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors',
    headers: {
      'User-Agent': "GitHub Avatar Downloader - Student Project"
    }
  };

  request.get(options, function (error, response, body) {

    if (error) {
      console.log(error);
      return;
    }

    // Handle incorrect GitHub credentials
    if (response.statusCode === 401) {
      console.log("Unauthorized. Check accuracy of .env file username and token.");
      return;
    }

    // Handle incorrect owner/repo input
    if (response.statusCode === 404) {
      console.log("The provided owner/repo combination was not found.");
      return;
    }

    cb(error, JSON.parse(body));

  });
}


// ENV file validation
if (!fs.existsSync('./.env')) {
  console.log('The .env file containing user information does not exist.');
  process.exit();
}

if (!GITHUB_USER || !GITHUB_TOKEN) {
  console.log('Missing username or token in the .env file.');
  process.exit();
}

module.exports = {
  getRepoContributors: getRepoContributors
}