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

  request.get(options, cb);
}

// Downloads an image from a specific URL to the given filePath
function downloadImageByURL(url, filePath) {

  request.get(url)
    .on('error', function (err) {
      throw err;
    })
    .pipe(fs.createWriteStream(filePath))
    .on('finish', function () {
      console.log('Downloaded ' + filePath);
    });
}



// Welcome!
console.log('Welcome to the GitHub Avatar Downloader!');

// Take in command line arguments, ignoring the location of Node and this file
var myArgs = process.argv.slice(2);

// Check to make sure two arguments have been passed in
if (myArgs.length !== 2) {
  console.log('Please enter exactly 2 arguments, in the form <owner> <repo>.');
  process.exit();
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

// Call the main function with command line input
getRepoContributors(myArgs[0], myArgs[1], function(err, response, body) {

  // Check to see if avatars directory already exists or not
  if (!fs.existsSync('./avatars')) {
    fs.mkdirSync('./avatars');
  }

  if (err) {
    console.log(err);
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

  result = JSON.parse(body);

  // Loop through each contributor and download their avatar to local folder
  for (var i = 0; i < result.length; i++) {
    var filePath = 'avatars/' + result[i].login + '.jpg';
    downloadImageByURL(result[i].avatar_url, filePath);
  }

});

